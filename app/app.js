var $ = require('jquery-browserify');
var _ = require('underscore');
var Backbone = require('backbone');

Backbone.$ = $ ;
window._ = _;
window.Backbone = Backbone;
window.Backbone.$ = $ ;
var LayoutManager = require("backboneLayoutmanager");

var Router = require('./router.js');
var router = new Router();

Backbone.Layout.configure({ manage: true });

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
      401: function () {
        window.location.href='#login';
        window.location.reload();
      }
    }
});

$(function() {
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

Backbone.history.start();
