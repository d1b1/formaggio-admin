var $ = require('jquery-browserify');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.PageableCollection = require("backbone-pageable");

Backbone.$ = $ ;

module.exports = function ( opts ) {

  var BaseModel = Backbone.Model.extend({
    parse : function(response,options){
      if(response.data && response.data !== null){
        return _.isArray(response.data) ? _.first(response.data) : response.data;
      }else{
        return response;
      }
    }
  });

  var BaseCollection = Backbone.Collection.extend({
    parse : function(response,options){
      return response.data;
    }
  });

  Module = {
    Models: {
      Acount: BaseModel.extend({
        defaults: {
          name: '',
        },
        validate: function(attrs, options) {
          if (!attrs.name) {
            return "Missing Name";
          }
        },
        urlRoot: "/api/users"
      }),
      Maker: BaseModel.extend({
        defaults: {
          'name': '',
        },
        validate: function(attrs, options) {
          if (!attrs.name) {
            return "Missing Name";
          }
        },
        urlRoot: "/api/makers"
      }),
      Cheese: BaseModel.extend({
        defaults: {},
        validate: function(attrs, options) {
          if (!attrs.nameShort) {
            return "Missing Short Name";
          }

          if (!attrs.description) {
            return "Missing Description";
          }

          if (!attrs.type) {
            return "Missing Type";
          }
        },
        urlRoot: "/api/cheese"
      })
    }
  };

  var defaults = {
    queryParams: {
      pageSize: "_limit",
      currentPage: "_page",
      totalPages: null,
      totalRecords: null,
    },
    state: {
      firstPage: 1,
      pageSize: 10,
    },
    parseRecords: function (resp) {
      return resp.data;
    },
    parseLinks: function (resp, xhr) {
      return resp.pagination;
    },
    parseState: function (resp, queryParams, state, options) {
      if(resp.data === null){
        return false;
      }
      return {
        totalRecords: resp.pagination.totalItems,
        current: resp.pagination.current,
        last: resp.pagination.last,
        totalPages: resp.pagination.totalPages,
        next: resp.pagination.next,
      };
    }
  };

  Module.Collections = {
    Cheeses: Backbone.PageableCollection.extend(
      _.defaults(_.clone(defaults), {
        model: Module.Models.Cheese,
        url: "/api/cheeses"
    })),
    Makers: Backbone.PageableCollection.extend(
      _.defaults(_.clone(defaults), {
        model: Module.Models.Maker,
        url: "/api/makers"
    })),
    Accounts: Backbone.PageableCollection.extend(
      _.defaults(_.clone(defaults), {
        model: Module.Models.Account,
        url: "/api/users"
    }))
  };

  return Module;
};
