var $ = require('jquery-browserify');
var _ = require('underscore');
var Backbone = require('backbone');
var Login = require("../views/login")();
Backbone.$ = $ ;

module.exports =  Backbone.Router.extend({
  routes: {
      'login': 'showLogin',
    },
    initialize: function() {
      this.Layout = new Login.Layout();
    },
    showLogin: function() {
      this.Layout.setView('login', new Login.LoginView());
      this.Layout.getView('login').render();
    }
  });
