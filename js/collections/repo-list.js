var app = app || {};

(function() {
  'use strict';

  app.ReposList = Backbone.Collection.extend({
    model: app.Repo
  });
}());
