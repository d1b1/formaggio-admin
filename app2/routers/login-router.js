var $ = require('jquery-browserify')
    , Backbone = require('backbone')
    , _ = require('underscore');

Backbone.$ = $
var Login = require("../views/login")();

module.exports =  Backbone.Router.extend({
  routes: {
      'login': 'showLogin',
    },
    initialize: function() {
      this.Layout = new Login.Layout();
    },
    showLogin: function() {
      this.Layout.setView('login', new Login.Views.Form());
      this.Layout.getView('login').render();
    }
  });
