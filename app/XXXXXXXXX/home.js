var $ = require('jquery-browserify');
var _ = require('underscore');
var Backbone = require('backbone');
var LayoutManager = require(".../../../plugins/backbone.layoutmanager");
var dataTables = require(".../../../plugins/data-tables/jquery.dataTables");
var dataTablesBootstrap = require(".../../../plugins/data-tables/DT_bootstrap");
var DashboardData = require("../data/dashboard-data")();
var app = require('formaggio-common')();

var DashboardTemplate = require("../templates/dashboard/main/dashboard.handlebars");
var TplService = require("../templates.js")();

module.exports = function( opts ) {

  var Main = {};

  Main.Layout = Backbone.Layout.extend({
    initialize : function () {
      var self = this;

    }
  });

  Main.Views = {};

  Main.Views.Sidebar = Backbone.Layout.extend({
    el: '#sidebar',
    template: TplService.Sidebar,
    sType: '',
    initialize: function () {
      var self = this;
      console.log('init the Sidebar');
    },
    unload: function() {
      this.unbind();
      this.remove();
    },
    afterRender: function () {
      console.log('After render of the Sidebar');
      app.setupPage();
    }
  });

  Main.Views.Dashboard = Backbone.Layout.extend({
    el: '#content',
    sType: '',
    initialize: function () {
      var self = this;
    },
    unload: function() {
      this.unbind();
      this.remove();
    },
    afterRender: function () {
      $('.wrapper').html(DashboardTemplate());
      app.setupPage();
    }
  });

  return Main;
};