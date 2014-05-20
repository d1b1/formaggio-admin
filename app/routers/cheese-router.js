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

      this.CheeseList = this.Layout.setView('cheeseList', new Resources.Views.List( { collection: this.collection }));
      this.CheeseDetail = this.Layout.setView('cheeseDetail', new Resources.Views.Detail());
    },
    list : function () {
      this.CheeseList.render();
    },
    detail : function (id) {
      this.CheeseDetail.model = new Data.Models.Cheese({ id: id });
      this.CheeseDetail.render();
    },
    new: function () {
      this.CheeseDetail.model = new Data.Models.Cheese();
      this.CheeseDetail.render();
    }
  });
