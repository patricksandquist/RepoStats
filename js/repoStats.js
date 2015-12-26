var app = app || {};

(function() {
  'use strict';

  // Kick things off by constructing our two Views
  app.listView = new app.ListView();
  app.searchView = new app.SearchView({ el: $("#search_container") });
}());
