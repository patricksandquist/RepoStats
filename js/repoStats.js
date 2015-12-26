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

  // Repo list View
  var ListView = Backbone.View.extend({
    el: $('#content_container'),

    initialize: function () {
      this.collection = new ReposList();

      // Collection event binder
      this.collection.on('add', this.appendRepo, this);
      //
      // // Search event binder
      // var $searchButton = $('#search_button');
      // _.extend($searchButton, Backbone.Events);
      // $searchButton.on('click', this.handleSearch, this);

      // Grab the data from GitHub API
      $.ajax({
        method: 'GET',
        url: 'https://api.github.com/users/7Geese/repos',
        success: this.handleJSONData.bind(this),
        complete: this.render.bind(this)
      });

      this.render();
    },

    render: function (filterData) {
      // Either use the filtered list of repos or grab them all
      var repos;
      if (typeof filterData === 'undefined' || typeof filterData.repos === 'undefined') {
        repos = this.collection.models;
      } else {
        repos = filterData.repos;
      }

      // Sort repos by fork count, descending
      repos = repos.sort(function (a, b) {
          if (a.attributes.fork_count > b.attributes.fork_count) {
            return -1;
          } else if (a.attributes.fork_count < b.attributes.fork_count) {
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

    filterRepos: function (string) {
      var repos = this.collection.models;

      return _.filter(repos, function (repo) {
        var repoName = repo.attributes.name.toLowerCase();
        return repoName.indexOf(string.toLowerCase()) > -1;
      });
    },

    appendRepo: function (repo) {
      // Format the repo data and append it to the page
      this.$el.append(
        "<div><b>Name:</b> " + repo.get('name') + "</div>" +
        "<div><b>Fork Number:</b> " + repo.get('fork_count') + "</div>" +
        "<div><b>Language:</b> " + repo.get('language') + "</div>" +
        "<div><b>Creation Date:</b> " + repo.get('created_at') + "</div></br>"
      );
    },

    handleJSONData: function (data) {
      // Take the JSON array of all of the repos and build up the collection
      _.each(data, function (repoData) {
        // If the repo is public
        if (repoData.private === false) {
          // Take useful data
          var repoToAdd = {
            name: this.formatName(repoData.name),
            fork_count: repoData.forks_count,
            language: repoData.language,
            created_at: this.formatDate(repoData.created_at)
          };

          // Add it to the collection
          this.addRepo(repoToAdd);
        }
      }, this);
    },

    formatName: function (rawName) {
      // Makes repo name more readible by taking out hyphens
      var words = rawName.split('-');

      // And capitolizing important words
      var output = _.map(words, function (word) {
        // Only capitolize uncommon words
        if (["as", "on"].includes(word)) {
          return word;
        } else {
          return word.charAt(0).toUpperCase() + word.slice(1);
        }
      });

      return output.join(' ');
    },

    formatDate: function (date) {
      // Makes a Date object from the ISO string
      var d = new Date(date);
      return d.toDateString();
    },

    addRepo: function (data) {
      // Make new model
      var repo = new Repo(data);

      // Trigger view update with 'add' event
      this.collection.add(repo);
    }
  });

  var listView = new ListView();

  // Search View
  var SearchView = Backbone.View.extend({
    initialize: function() {
      this.render();
    },

    render: function() {
      var template = _.template($("#search_template").html(), {});
      this.$el.html(template);
    },

    events: {
      "click input[type=button]": "handleSearch"
    },

    handleSearch: function (event) {
      var filterData = {
        repos: listView.filterRepos($("#search_input").val())
      };

      listView.render(filterData);
    }
  });

  var search_view = new SearchView({ el: $("#search_container") });
}());
