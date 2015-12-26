var app = app || {};

(function() {
  'use strict';

  app.SearchView = Backbone.View.extend({
    initialize: function() {
      this.render();
    },

    render: function() {
      // Load the template and add to DOM
      var template = _.template($("#search_template").html(), {});
      this.$el.html(template);
    },

    events: {
      // Add a search event to the button
      "click input[type=button]": "handleSearch"
    },

    handleSearch: function (e) {
      e.preventDefault();

      // Build up the filtered list of repos
      var filterData = {
        repos: app.listView.filterRepos($("#search_input").val())
      };

      // Pass the list to the listView for rendering
      app.listView.render(filterData);
    }
  });
}());
