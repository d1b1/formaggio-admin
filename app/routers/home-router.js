var $ = require('jquery-browserify');
var _ = require('underscore');
var Backbone = require('backbone');
var Main = require("../views/home")();
Backbone.$ = $ ;

module.exports = Backbone.Router.extend({

  routes: {
      ''                 : 'showDashboard',
      'home'             : 'showDashboard'
    },

    initialize: function(options) {
      this.Layout = new Main.Layout();

      this.Dashboard = this.Layout.setView('main', new Main.Views.Dashboard());
    },

    showDashboard: function() {
      this.Dashboard.render();
    }

  });
