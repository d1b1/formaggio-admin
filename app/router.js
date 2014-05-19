var $ = require('jquery-browserify')
    , _ = require('underscore')
    , Backbone = require('backbone');

var LoginRouter    = require('./routers/login-router');
var HomeRouter     = require('./routers/home-router');
var CheeseRouter   = require('./routers/cheese-router');
var MakerRouter    = require('./routers/maker-router');
var AccountRouter  = require('./routers/account-router');

Backbone.$ = $;
window.helper = {
  elements: {}
};

module.exports =  Backbone.Router.extend({
  routes: {
    ''              : 'index'
  },
  initialize: function(){
    var self = this;
    this.routers = {
      login            : new LoginRouter(),
      home             : new HomeRouter(),
      cheeses          : new CheeseRouter(),
      makers           : new MakerRouter(),
      accounts         : new AccountRouter()
    };
  },
  index: function() {
    var self = this;
  }
});
