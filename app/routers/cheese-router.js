var $ = require('jquery-browserify')
    , _ = require('underscore')
    , Backbone = require('backbone')
    , Data = require("../data/models")();

Backbone.$ = $;

var Resources = require("../views/cheese")();

module.exports = Backbone.Router.extend({
  routes: {
      'cheeses'                    : 'list',
      'cheeses/new'                : 'new',
      'cheeses/:id'                : 'detail'
    },
    initialize : function (options) {
      this.Layout = new Resources.Layout();
      this.collection = new Data.Collections.Cheeses();

    },
    list : function () {
      this.Layout.setView('cheeseList', new Resources.Views.List( { collection: this.collection }));
      this.Layout.getView('cheeseList').render();
    },
    detail : function (id) {
      var model = new Data.Models.Maker({ id: id });

      this.Layout.setView('cheeseDetail', new Resources.Views.Detail( { model: model }));
      this.Layout.getView('cheeseDetail').id = id;
      this.Layout.getView('cheeseDetail').render();
    },
    new: function () {
      var model = new Data.Models.Maker();
      this.Layout.setView('new', new Resources.Views.Detail( { model: model } ));
      this.Layout.getView('new').render();
    }
  });
