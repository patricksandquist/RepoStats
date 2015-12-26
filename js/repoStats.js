(function($) {
  // Model
  var Repo = Backbone.Model.extend({
    defaults: {
      name: 'default',
      fork_count: '-1',
      language: 'default',
      created_at: '0000'
    }
  });

  // Collection
  var ReposList = Backbone.Collection.extend({
    model: Repo,

    initialize: function () {
      $.ajax({
        method: 'GET',
        url: 'https://api.github.com/users/7Geese/repos',
        success: function (data) {
          // Data is a JSON array of all of the repos
          _(data).each(function (repoData) {
            if (data.private === 'false') {
              var repoToAdd = {
                name: data.name,
                fork_count: data.fork_count,
                language: data.language,
                created_at: data.created_at
              };

              this.addRepo(repoToAdd);
            }
          }, this);
        }
      });
    },

    addRepo: function (data) {
      var repo = new Repo(data);
      this.collection.add(repo); // view updated via 'add' event
    }
  });

  // View
  var ListView = Backbone.View.extend({
    el: $('#content'),

    initialize: function () {
      this.collection = new ReposList();
      this.collection.bind('add', this.appendRepo); // collection event binder
      this.render();
    },

    render: function () {
      var self = this;
      var repos = this.collection.models;

      repos = repos.sort(function (a, b) {
        // Sort by fork count, descending
        if (a.fork_count > b.fork_count) {
          return -1;
        } else if (a.fork_count < b.fork_count) {
          return 1;
        } else {
          return 0;
        }
      });

      $(this.el).append("<div></div>");
      _(repos).each(function (repo) {
        self.appendRepo(repo);
      }, this);
    },

    appendRepo: function (repo){
      $('div', this.el).append(
        "<div> Name: " + repo.get('name') + "</div><br/>" +
        "<div> Fork Number: " + repo.get('fork_count') + "</div><br/>" +
        "<div> Language: " + repo.get('language') + "</div><br/>" +
        "<div> Creation Date: " + repo.get('created_at') + "</div>"
      );
    }
  });

  var listView = new ListView();
}(jQuery));
