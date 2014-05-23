var $ = require('jquery-browserify');
var _ = require('underscore');
var Backbone = require('backbone');
var Handlebars = require("hbsfy/runtime");
var LayoutManager = require(".../../../plugins/backbone.layoutmanager");
var dataTables = require(".../../../plugins/data-tables/jquery.dataTables");
var dataTablesBootstrap = require(".../../../plugins/data-tables/DT_bootstrap");
var DashboardData = require("../../data/dashboard-data")();
var app = require('formaggio-common')();
var LoginTemplate = require("../templates/login/login.handlebars");

module.exports = function ( opts ) {
  var Login = {};

  Login.Layout = Backbone.Layout.extend({
    initialize : function () {
      var self = this;
    }
  });

  Login.LoginView = Backbone.View.extend({
    el: '#container',
    events: {
      'submit #form-container' : 'login'
    },
    initialize: function() {
      var self = this;
    },
    unload: function() {
      this.unbind();
      this.remove();
    },
    login : function(e) {
      e.preventDefault();
      var self = this;
      var loginParams = $(e.currentTarget).serializeObject();
      $.ajax({
          type: 'POST',
          url:'/api/auth/analyst-admin',
          data:  JSON.stringify (loginParams),
          success: function(data) {
            window.location.href="#";
            window.location.reload(true);
          },
          contentType: "application/json",
          dataType: 'json'
      }).fail(function() {
        alert( "there was an issue with your username or password" );
      });
    },
    afterRender: function () {
      $('#container').html(LoginTemplate());
    }
  });

  return Login;
};
