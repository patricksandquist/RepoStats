var app = app || {};

(function() {
  'use strict';

  app.Repo = Backbone.Model.extend({
    defaults: {
      name: 'default',
      fork_count: '-1',
      language: 'default',
      created_at: '0000'
    }
  });
}());
