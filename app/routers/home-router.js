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
      // $('#container').addClass('hide');
      // $('#sidebar').addClass('hide');

      this.Welcome.render();
    },

    showDashboard: function() {
      this.Dashboard.render();
    }

  });
