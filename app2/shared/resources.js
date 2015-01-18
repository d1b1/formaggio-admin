var $ = require('jquery-browserify')
    , _ = require('underscore')
    , Backbone = require('backbone');

module.exports = function() {

  var Module = {};
  Module.Views = {};

  Module.Views.NewCheese = require("./views/newCheese");
  Module.Views.NewAccount = require("./views/newAccount");
  Module.Views.NewMaker = require("./views/newMaker");

  return Module;
}
