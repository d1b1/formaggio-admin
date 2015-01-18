var $ = require('jquery-browserify');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $ ;

var Resource = require("../views/home")();

module.exports = Backbone.Router.extend({

  routes: {
      ''                 : 'showDashboard',
      'home'             : 'showDashboard'
    },

    initialize: function(options) {
      this.Layout = new Resource.Layout();

      this.Dashboard = this.Layout.setView('main', new Resource.Views.Dashboard());
    },

    showDashboard: function() {
      this.Dashboard.render();
    }

  });
