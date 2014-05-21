var $ = require('jquery-browserify');
var _ = require('underscore');
var Backbone = require('backbone');
var LayoutManager = require("backboneLayoutmanager");
var dataTables = require("dataTables");
var dataTablesBootstrap = require("DT_bootstrap");
var DashboardData = require("../data/models")();
var app = require('formaggio-common')();

var DashboardTemplate = require("../templates/main/dashboard.handlebars");
var TplService = require("../templates.js")();

module.exports = function( opts ) {

  var Module = {};

  Module.Layout = Backbone.Layout.extend({
    initialize : function () {
      var self = this;

    }
  });

  Module.Views = {};

  Module.Views.Sidebar = Backbone.Layout.extend({
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

  Module.Views.Dashboard = Backbone.Layout.extend({
    el: '#main-content',
    sType: '',
    template: TplService.Dashboard,
    initialize: function () {
      var self = this;
    },
    unload: function() {
      this.unbind();
      this.remove();
    },
    afterRender: function () {
      console.log('asdfasdf');
      app.setupPage();
    }
  });

  return Module;
};
