var $ = require("jquery-browserify");
var _ = require("underscore");
var Backbone = require("backbone");
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
      Account: BaseModel.extend({
        idAttribute: "_id",
        defaults: {
          username: "",
          email: ""
        },
        validate: function(attrs, options) {
          if (!attrs.username) {
            return "Missing Username";
          }

          if (!attrs.email) {
            return "Missing Email";
          }
        },
        urlRoot: "http://api.formagg.io/user"
      }),
      Maker: BaseModel.extend({
        idAttribute: "_id",
        defaults: {
          "name": "",
          "state": "",
          "city": "",
          "country": ""
        },
        validate: function(attrs, options) {
          if (!attrs.name) {
            return "Missing Name";
          }
        },
        urlRoot: "http://api.formagg.io/maker"
      }),
      Cheese: BaseModel.extend({
        idAttribute: "_id",
        defaults: {},
        validate: function(attrs, options) {
          if (!attrs.name) {
            return "Missing Name";
          }

          if (!attrs.description) {
            return "Missing Description";
          }

          if (!attrs.source) {
            return "Missing Source";
          }
        },
        urlRoot: "http://api.formagg.io/cheese"
      })
    }
  };

  var defaults = {
    queryParams: {
      pageSize: "size",
      currentPage: "page",
      totalPages: null,
      totalRecords: null,
    },
    state: {
      firstPage: 1,
      pageSize: 10,
    },
    parseRecords: function (resp) {
      return resp.results;
    },
    parseLinks: function (resp, xhr) {
      return resp.pages;
    },
    parseState: function (resp, queryParams, state, options) {
      if(resp.data === null){
        return false;
      }
      return {
        totalRecords: resp.count,
        current: resp.current,
        last: resp.last,
        totalPages: resp.last,
        next: resp.next,
      };
    }
  };

  Module.Collections = {
    Cheeses: Backbone.PageableCollection.extend(
      _.defaults(_.clone(defaults), {
        model: Module.Models.Cheese,
        url: "http://api.formagg.io/cheese/search"
    })),
    Makers: Backbone.PageableCollection.extend(
      _.defaults(_.clone(defaults), {
        model: Module.Models.Maker,
        url: "http://api.formagg.io/maker/search"
    })),
    Accounts: Backbone.PageableCollection.extend(
      _.defaults(_.clone(defaults), {
        model: Module.Models.Account,
        url: "http://api.formagg.io/user/search"
    }))
  };

  return Module;
};
