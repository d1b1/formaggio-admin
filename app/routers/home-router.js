var $ = require('jquery-browserify');
var _ = require('underscore');
var Backbone = require('backbone');
var Main = require("../views/home")();
Backbone.$ = $ ;

module.exports = Backbone.Router.extend({

  routes: {
      ''                 : 'showHome',
      'home'             : 'showHoe'
    },

    initialize: function(options) {
      this.Layout = new Main.Layout();
    },

    showDashboard: function() {
      this.Layout.setView('main', new Main.Views.Dashboard());
      this.Layout.render();
    }

  });
