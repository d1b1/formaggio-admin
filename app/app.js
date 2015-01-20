var $ = require('jquery-browserify');
var _ = require('underscore');
var Backbone = require('backbone');
var Authorization = require('./authorization');
var Messenger = require("messenger");

Backbone.$ = $ ;
window._ = _;
window.Backbone = Backbone;
window.Backbone.$ = $ ;
var LayoutManager = require("backboneLayoutmanager");

window.apiDomain = localStorage.getItem('apiDomain') ? localStorage.getItem('apiDomain') : 'staging-api.formagg.io';
// window.apiDomain = 'localhost:3000';

var Login = require('./views/login')();
var Router = require('./router.js');

Backbone.Layout.configure({ manage: true });

var authConfig = {
  key: 'abc123',
  secret: 'ssh-secret'
};

var AuthService = Authorization.Header(authConfig);

var sync = Backbone.sync;
Backbone.sync = function (method, model, options) {
  options.beforeSend = function(xhr, request) {

    // Only send a signed request when we have tokens or we are trying to login.

    if (signature = AuthService.getSignature(request.url, request.type)) {
      xhr.setRequestHeader('Authorization', signature);
    }
  };
  sync(method, model, options);
};

$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
    options.crossDomain ={
        crossDomain: true
    };
    options.xhrFields = {
        withCredentials: false
    };
});

$.ajaxSetup({
    cache: false,
    statusCode: {
      401: function (req) {
        console.log('401');
        new Login.Views.Login({}).render();

        req.abort();
      }
    }
});

$(function() {

  Messenger.options = {
    extraClasses: 'messenger-fixed messenger-on-bottom messenger-on-left',
    theme: 'flat'
  };

  $('#nav-accordion').dcAccordion({
    eventType: 'click',
    autoClose: true,
    saveState: true,
    disableLink: true,
    speed: 'slow',
    showCount: false,
    autoExpand: true,
    classExpand: 'dcjq-current-parent'
  });

});

var Session = Backbone.Model.extend({
  url: 'http://' + window.apiDomain + '/user/current',
  setup: function() {
    this.fetch({
      success: function() {
        console.log('Start the router.');
        var router = new Router();

        Backbone.history.start({ pushState: true });
      },
      error: function(err) {
        console.log('Unable to talk to the API. Could not start Backbone.');
      }
    });
  }
});

window.Session = new Session();
window.Session.setup();

// All navigation that is relative should be passed through the navigate
// method, to be processed by the router. If the link has a `data-bypass`
// attribute, bypass the delegation completely.
$(document).on("click", "a:not([data-bypass])", function(evt) {
  // Get the absolute anchor href.
  alert('asdf');
  var href = $(this).prop("href");
  // Get the absolute root.
  var root = location.protocol + "//" + location.host + app.root;

  // Ensure the protocol is not part of URL, meaning it's relative.
  if (href && href.indexOf(root)) {
    alert('got here');
    // Stop the default event to ensure the link will not cause a page refresh.
    evt.preventDefault();

    // `Backbone.history.navigate` is sufficient for all Routers and will
    // trigger the correct events. The Router's internal `navigate` method
    // calls this anyways.  The fragment is sliced from the root.
    Backbone.history.navigate(href.slice(root.length), true);
  }
});
