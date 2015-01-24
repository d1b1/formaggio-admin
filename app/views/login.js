var $ = require('jquery-browserify')
    , _ = require('underscore')
    , Backbone = require('backbone')
    , Handlebars = require("hbsfy/runtime");

var app = require('formaggio-common')()
    , Authorization = require('../authorization')
    , LayoutManager = require("backboneLayoutmanager")
    // , DashboardData = require("./data/models")()
    , TplService = require("../templates.js")();

module.exports = function ( opts ) {

  var Module = {};

  Module.Layout = Backbone.Layout.extend({
    initialize : function () {
      var self = this;
    }
  });

  Module.Views = {};

  Module.Views.Login = Backbone.Layout.extend({
    template: TplService.Login.Login,
    events: {
      'click .actionButton': 'action'
    },
    unload: function() {
      $('.modal').modal('hide').addClass('hide');
      $('body').removeClass("modal-open");

      this.unbind();
      this.undelegateEvents();
      this.remove();
    },
    show: function(evt) {
      this.$el.find('.modal').modal('show').removeClass('hide').removeClass('fade');
    },
    afterRender: function() {
      var self = this;

      // the AJAX 401 will trigger again, so prevent
      // the modal from attaching again.

      if (!$("#LoginModalDialog").length) {
        // Attach to the body.
        self.$el.appendTo("body");

        // Set the Unload for for the modal.
        self.$el.find('.modal').on('hidden.bs.modal', function () {
          self.unload();
        });

        self.show();
      }
    },
    action: function(evt) {
      var self = this;
      var formData = $('#modalForm').serializeObject();

      var authConfig = {
        key: 'abc123',
        secret: 'ssh-secret'
      };

      var AuthService = Authorization.Header(authConfig);
      var url = 'http://' + window.apiDomain + '/authenticate/accesstoken';

      var opts = {
        url: url,
        type: 'Post',
        contentType: "application/json",
        dataType: "json",
        processData: false,
        data: JSON.stringify(formData),
        headers: { 'Authorization': AuthService.getSignature(url, 'POST') }
      };

      $.ajax(opts)
        .done(function( data ) {

          // Store the session and token info.
          localStorage.setItem('tokenId', data.tokenId);
          localStorage.setItem('secret', data.secret);

          window.Session.setup();

          self.unload();
        })
        .fail(function( data ) {
          var errorMsg = JSON.parse(data.responseText);

          $('#ModalErrorMessages').html(_.first(errorMsg).message);
        });

    }
  });

  Module.Views.Form = Backbone.View.extend({
    el: '#container',
    __name__: "LoginView",
    events: {
      'submit #form-container': 'login'
    },
    initialize: function() {
      alert('here');
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
          url:'http://' + window.apiDomain + '/auth/accesstoken',
          data:  JSON.stringify (loginParams),
          success: function(data) {
            window.location.href="#";
            window.location.reload(true);
            alert('asdfasfd');
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
