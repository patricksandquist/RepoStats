(function() {
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
    model: Repo
  });

  // View
  var ListView = Backbone.View.extend({
    el: $('#content'),

    initialize: function () {
      // Create the collection
      this.collection = new ReposList();

      // Collection event binder
      this.collection.on('add', this.appendRepo, this);

      // Grab the data from GitHub API
      $.ajax({
        method: 'GET',
        url: 'https://api.github.com/users/7Geese/repos',
        success: this.handleJSONData.bind(this)
      });

      // Initial render
      this.render();
    },

    render: function () {
      // Grab all of the repos
      var repos = this.collection.models;

      // Sort by fork count, descending
      repos = repos.sort(function (a, b) {
        if (a.fork_count > b.fork_count) {
          return -1;
        } else if (a.fork_count < b.fork_count) {
          return 1;
        } else {
          return 0;
        }
      });

      // Clear the page
      this.$el.empty();

      // Add the repos
      _.each(repos, function (repo) {
        this.appendRepo(repo);
      }, this);
    },

    appendRepo: function (repo) {
      // Format the repo data and append it to the page
      this.$el.append(
        "<div> Name: " + repo.get('name') + "</div><br/>" +
        "<div> Fork Number: " + repo.get('fork_count') + "</div><br/>" +
        "<div> Language: " + repo.get('language') + "</div><br/>" +
        "<div> Creation Date: " + repo.get('created_at') + "</div>"
      );
    },

    handleJSONData: function (data) {
      // Take the JSON array of all of the repos and build up the collection
      _.each(data, function (repoData) {
        // If the repo is public
        if (repoData.private === false) {
          // Take useful data
          var repoToAdd = {
            name: repoData.name,
            fork_count: repoData.forks_count,
            language: repoData.language,
            created_at: repoData.created_at
          };

          // Add it to the collection
          this.addRepo(repoToAdd);
        }
      }, this);
    },

    addRepo: function (data) {
      // Make new model
      var repo = new Repo(data);

      // Trigger view update with 'add' event
      this.collection.add(repo);
    }
  });

  var listView = new ListView();
}());
