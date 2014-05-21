var $ = require('jquery-browserify')
    , _ = require('underscore')
    , Backbone = require('backbone')
    , Handlebars = require("hbsfy/runtime");

var app = require('formaggio-common')()
    , TplService = require("../templates.js")();

module.exports = function ( opts ) {

  var Module = {};

  Module.Layout = Backbone.Layout.extend({
    initialize : function () {
      var self = this;
    }
  });

  Module.Views = {};

  Module.Views.Form = Backbone.View.extend({
    el: '#container',
    __name__: "LoginView",
    events: {
      'submit #form-container': 'login'
    },
    initialize: function() {
      var self = this;
    },
    unload: function() {
      // Make this clean and add a body class.
      $('body').removeClass('login-body');

      this.unbind();
      this.remove();
    },
    login : function(e) {
      e.preventDefault();
      var self = this;
      var loginParams = $(e.currentTarget).serializeObject();
      $.ajax({
          type: 'POST',
          url:'http://api.formagg.io/auth/accesstoken',
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
      // Make this clean and add a body class.
      $('body').addClass('login-body');

      $('#container').html(TplService.Login.Form());
    }
  });

  return Module;
};
