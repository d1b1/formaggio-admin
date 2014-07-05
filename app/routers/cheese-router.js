var $ = require('jquery-browserify')
    , _ = require('underscore')
    , Backbone = require('backbone')
    , Data = require("../data/models")();

Backbone.$ = $;

var Resources = require("../views/cheese")();
var presenter = require('../presenter');

module.exports = Backbone.Router.extend({
  routes: {
      'cheeses'                    : 'list',
      'cheeses/:id'                : 'detail'
    },
    initialize : function (options) {
      this.Layout = new Resources.Layout();
      this.collection = new Data.Collections.Cheeses();

      // This used the pattern of attaching the views using
      // the layout manager in the init, and then makeing them
      // available for render.

      // Additionally the presenter handles the DOM
      // swap and the view unload actions.

      this.CheeseList = this.Layout.setView('cheeseList', new Resources.Views.List( { collection: this.collection }));
      this.CheeseDetail = this.Layout.setView('cheeseDetail', new Resources.Views.Detail());
    },
    list : function () {
      this.CheeseList.render();

      presenter.presentView( this.CheeseList );
    },
    detail : function (id) {
      this.CheeseDetail.model = new Data.Models.Cheese({ id: id });
      // WAS: Moved to the presenter: this.CheeseDetail.render();

      presenter.presentView( this.CheeseDetail );
    }

  });
