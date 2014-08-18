var $ = require('jquery-browserify')
    , _ = require('underscore')
    , Backbone = require('backbone');

module.exports = function() {

  var Module = {};
  Module.Views = {};

  Module.Views.NewCheese = require("./views/newCheese");
  // Module.Views.CopyEmployer   = require("./views/copyEmployer");
  // Module.Views.NewEmployer    = require("./views/newEmployer");

  return Module;
}
