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

var Resources = require("./views/home")();

module.exports = Backbone.Router.extend({
  routes: {
    ''              : 'index'
  },
  initialize: function(){
    var self = this;
    this.Layout = new Resources.Layout();

    this.Header    = this.Layout.setView('header', new Resources.Views.Header( { session: window.Session } ));
    this.Sidebar   = this.Layout.setView('sidebar', new Resources.Views.Sidebar( { session: window.Session } ));
    this.Secondary = this.Layout.setView('secondary', new Resources.Views.Secondary( { session: window.Session } ));

    // Render the Layout
    this.Layout.render();

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
