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
        console.log('Session Changed.');
        self.render();
      });

    },
    events: {
      'click .sidebar-toggle-box .fa-bars': 'toggleSideBar',
      'click .editProfileButton':           'profile'
    },
    profile: function(evt) {
      evt.preventDefault();

      this.session.fetch().then(function() {
        new Main.Views.Profile({ model: this.session }).render();
      });
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
        model: this.session.toJSON()
      };
    },
    unload: function() {
      this.unbind();
      this.remove();
    }
  });

  Module.Views.Profile = Backbone.Layout.extend({
    template: TplService.Profile,
    initialize: function() {},
    serialize: function() {
      return {
        profile: this.model.toJSON()
      };
    },
    events: {
      'click .continue': 'save'
    },
    save: function() {
      var self = this;
      var form = $(this.$el.find('#modalForm')[0]);
      var data = form.serializeObject();

      if (!data.password) {
        delete data.password;
      }

      // Update the data.
      this.model.set(data);

      if (!this.model.isValid()) {
        $('#ModalErrorMessages').html(this.model.validationError);
        return;
      }

      this.model.save().done(function() {
        // Alert the UI.
        Messenger().post({
          message: 'Your profile has been updated.',
          type: 'success',
          hideAfter: 5,
          hideOnNavigate: true,
          showCloseButton: false,
          id: 'Profile'
        });

        // Force the session to update.
        window.Session.fetch();
        self.unload();
      })
      .fail(function(){
        Messenger().post({
          message: 'Opps error tring to save your profile.',
          type: 'error',
          hideAfter: 5,
          hideOnNavigate: true,
          showCloseButton: false,
          id: 'Profile'
        });
      });
    },
    unload: function() {
      $('.modal').modal('hide').addClass('hide');
      $('body').removeClass('modal-open');

      this.unbind();
      this.undelegateEvents();
      this.remove();
    },
    afterRender: function() {
      var self = this;
      self.$el.appendTo('body');
      self.$el.find('.modal').on('hidden.bs.modal', function () {
        self.unload();
      });

      this.model.fetch().done(function(){
        self.$el.find('.modal').modal('show').removeClass('hide').removeClass('fade');
      });
    }
  });

  return Module;
};
