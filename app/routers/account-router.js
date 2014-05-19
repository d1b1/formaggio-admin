var $ = require('jquery-browserify')
    , _ = require('underscore')
    , Backbone = require('backbone')
    , DashboardData = require("../data/models")();

Backbone.$ = $;

var Resources = require("../views/account")();

module.exports = Backbone.Router.extend({
  routes: {
      'account'                    : 'list',
      'account/new'                : 'new',
      'account/:id'                : 'detail'
    },
    initialize : function (options) {
      this.Layout = new Resources.Layout();
      this.collection = new Data.Collections.Accounts();

      this.layoutName = 'accounts';
    },
    list : function () {
      this.Layout.setView(this.layoutName, new Resources.Views.List( { collection: this.collection }));
      this.Layout.getView(this.layoutName).render();
    },
    detail : function (id) {
      var model = new Data.Models.Account({ id: id });

      this.Layout.setView(this.layoutName, new Resources.Views.Detail( { model: model }));
      this.Layout.getView(this.layoutName).id = id;
      this.Layout.getView(this.layoutName).render();
    },
    new: function () {
      var model = new Data.Models.Account();
      this.Layout.setView('new', new Resources.Views.Detail( { model: model } ));
      this.Layout.getView('new').render();
    }
  });
