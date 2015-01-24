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
var welcomeTpl = require('../templates/public/welcome.handlebars');
var Login = require('./login')();

var ProfileEditView = require('./profile');

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
    events: {
      'click a': 'makeActive'
    },
    makeActive: function(evt) {
      // First remove from any active elements in
      // the active view.
      this.$el.find('.active').removeClass('active');

      // Toggle the class for the selected target.
      $(evt.currentTarget).toggleClass('active');
    },
    initialize: function () {
      var self = this;
    },
    unload: function() {
      this.unbind();
      this.remove();
    },
    afterRender: function () {
      app.setupPage();
    }
  });

  Module.Views.Secondary = Backbone.Layout.extend({
    el: '#secondary',
    template: TplService.Secondary,
    initialize: function () {
      var self = this;
    },
    unload: function() {
      this.unbind();
      this.remove();
    },
    afterRender: function () {
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
      console.log('Dashboard Render');
      app.setupPage();
    }
  });

  Module.Views.Header = Backbone.Layout.extend({
    el: '#header',
    template: TplService.Header,
    initialize: function() {
      var self = this;
      this.session.on('reset', function() { console.log('TODO: Make the Header Update.'); });

      // If the Session Changes, then trigger the session to change.
      this.session.on('change', function() {
        self.render();
      });
    },
    events: {
      'click .sidebar-toggle-box .fa-bars': 'toggleSideBar',
      'click .editProfileButton':           'profile',
      'click .logoutButton':                'logout',
      'click .changeAPIButton':             'changeAPI'
    },
    changeAPI: function() {
      // Toggle the api.
      window.apiDomain = (localStorage.getItem('apiDomain') == 'staging-api.formagg.io') ? 'api.formagg.io' : 'staging-api.formagg.io';

      // Update the localStorage.
      localStorage.setItem('apiDomain', window.apiDomain);

      // Remove the auth info from localStorage.
      localStorage.removeItem('tokenId');
      localStorage.removeItem('secret');

      // Reup the Session.
      window.Session.setup();
    },
    profile: function(evt) {
      evt.preventDefault();

      new ProfileEditView({ model: this.session }).render();
    },
    logout: function() {
      localStorage.removeItem('tokenId');
      localStorage.removeItem('secret');

      this.session.fetch();
    },
    // toggleSideBar: function(e) {
    //
    //   // $(".leftside-navigation").niceScroll({
    //   //     cursorcolor: "#1FB5AD",
    //   //     cursorborder: "0px solid #fff",
    //   //     cursorborderradius: "0px",
    //   //     cursorwidth: "3px"
    //   //   });
    //   //
    //   // $('#sidebar').toggleClass('hide-left-bar');
    //   // if ($('#sidebar').hasClass('hide-left-bar')) {
    //   //   $(".leftside-navigation").getNiceScroll().hide();
    //   // }
    //   // $(".leftside-navigation").getNiceScroll().show();
    //   // $('#main-content').toggleClass('merge-left');
    //   //
    //   // e.stopPropagation();
    // },
    serialize: function() {
      return {
        model: this.session.toJSON(),
        apiDomain: window.apiDomain
      };
    },
    unload: function() {
      this.unbind();
      this.remove();
    }
  });

  Module.Views.Welcome = Backbone.Layout.extend({
    template: welcomeTpl,
    initialize: function () {
      var self = this;
    },
    events: {
      'click .loginButton': 'login'
    },
    login: function(evt) {
      new Login.Views.Login({}).render();
    },
    unload: function() {
      this.unbind();
      this.remove();
    },
    afterRender: function () {
      $('body').addClass('modal-open');
      $('.github-fork-ribbon-wrapper').addClass('hide');

      this.$el.appendTo("body");

      this.$el.find('.modal').modal('show').removeClass('hide').removeClass('fade');
    }
  });

  return Module;
};
