var $ = require('jquery-browserify')
    , _ = require('underscore')
    , Backbone = require('backbone')
    , serializeObject = require('serializeObject')
    , jsoneditor = require('jsoneditor');

var app = require('maxwell-common')()
    , LayoutManager = require("backboneLayoutmanager")
    , DashboardData = require("../data/dashboard-data")()
    , TplService    = require("../templates")();

module.exports = function( opts ) {

  var Module = {
    Views: {}
  };

  /*
    This is a common view that is used to add a paging element to
    a table view. It works with the Pageable Collection and provides
    simple element for navigation.

    Usage:
      Pagination    = require('./pagination')()

      initlialize: function() {
        ....
        self.insertView('.adv-table', new Pagination.Views.Pager( { collection: self.collection }));
      }
  */

  Module.Views.Pager = Backbone.Layout.extend({
    template: TplService.PaginationTemplate,
    events: {
      'click .getPreviousPage': 'prev',
      'click .getPage': 'go',
      'click .getNextPage': 'next'
    },
    prev: function() {
      this.collection.getPreviousPage();
    },
    go: function(e) {
      this.collection.getPage($(e.currentTarget).data('page'));
    },
    next: function(e) {
      this.collection.getNextPage();
    },
    serialize: function() {
      var firstPage = this.collection.state.firstPage;
      var arr = [];
      while(firstPage <= this.collection.state.lastPage){
        arr.push(firstPage++);
      }
      return {
        arr: arr,
        currentPage: this.collection.state.currentPage,
        lastPage: this.collection.state.lastPage
      };
    },
    initialize: function() {
      if (!this.collection) console.log('Warning: No collection provided to pager view.');

      this.collection.on('sync', function() { this.render(); }, this);
    }
  });

  return Module;
};
