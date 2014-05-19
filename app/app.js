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

$.ajaxSetup({
    cache: false,
    statusCode: {
      401: function () {
        console.log('API URL:', this.type, this.contentType, this.url);
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
