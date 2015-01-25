var $ = require('jquery-browserify');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $ ;

var Resource = require("../views/home")();

module.exports = Backbone.Router.extend({

  routes: {
      ''                 : 'welcome',
      'home'             : 'showDashboard'
    },

    initialize: function(options) {
      this.Layout = new Resource.Layout();
      this.Dashboard = this.Layout.setView('main', new Resource.Views.Dashboard());
      this.Welcome = this.Layout.setView('public', new Resource.Views.Welcome());
    },

    welcome: function() {
      if (window.Session.get('username')) {
        return Backbone.history.navigate("home", { trigger: true });
      }

      this.Welcome.render();
    },

    showDashboard: function() {
      this.Dashboard.render();
    }

  });
