var $ = require('jquery-browserify')
    , _ = require('underscore')
    , Backbone = require('backbone')
    , Data = require("../data/models")();

Backbone.$ = $;

var Resources = require("../views/account")();

module.exports = Backbone.Router.extend({
  routes: {
      'accounts'                    : 'list',
      'accounts/new'                : 'new',
      'accounts/:id'                : 'detail'
    },
    initialize : function (options) {
      this.Layout = new Resources.Layout();
      this.collection = new Data.Collections.Accounts();

      this.AccountList = this.Layout.setView('accountlist', new Resources.Views.List( { collection: this.collection }));
      this.AccountDetail = this.Layout.setView('accountdetail', new Resources.Views.Detail());
    },
    list : function () {
      this.AccountList.render();
    },
    detail : function (id) {
      this.AccountDetail.model = new Data.Models.Account({ id: id });
      this.AccountDetail.render();
    },
    new: function () {
      this.AccountDetail.model = new Data.Models.Account();
      this.AccountDetail.render();
    }
  });
