var $ = require('jquery-browserify');
var _ = require('underscore');
var Backbone = require('backbone')
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
    events: {
      'submit #form-container': 'login'
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
      $('#container').html(TplService.Login.Form());
    }
  });

  return Module;
};
