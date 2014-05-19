var $ = require('jquery-browserify')
    , _ = require('underscore')
    , Backbone = require('backbone')
    , Data = require("../data/models")();

Backbone.$ = $;

var Resources = require("../views/cheese")();

module.exports = Backbone.Router.extend({
  routes: {
      'cheese'                    : 'list',
      'cheese/new'                : 'new',
      'cheese/:id'                : 'detail'
    },
    initialize : function (options) {
      this.Layout = new Resources.Layout();
      this.collection = new Data.Collections.Cheeses();

      this.layoutName = 'cheeses';
    },
    list : function () {
      this.Layout.setView(this.layoutName, new Resources.Views.List( { collection: this.collection }));
      this.Layout.getView(this.layoutName).render();
    },
    detail : function (id) {
      var model = new Data.Models.Maker({ id: id });

      this.Layout.setView(this.layoutName, new Resources.Views.Detail( { model: model }));
      this.Layout.getView(this.layoutName).id = id;
      this.Layout.getView(this.layoutName).render();
    },
    new: function () {
      var model = new Data.Models.Maker();
      this.Layout.setView('new', new Resources.Views.Detail( { model: model } ));
      this.Layout.getView('new').render();
    }
  });
