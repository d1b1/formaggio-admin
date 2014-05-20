var $ = require('jquery-browserify')
    , _ = require('underscore')
    , Backbone = require('backbone')
    , Data = require("../data/models")();

Backbone.$ = $;

var Resources = require("../views/maker")();

module.exports = Backbone.Router.extend({
  routes: {
      'makers'                    : 'list',
      'makers/new'                : 'new',
      'makers/:id'                : 'detail'
    },
    initialize : function (options) {
      this.Layout = new Resources.Layout();
      this.collection = new Data.Collections.Makers();

      this.MakerList = this.Layout.setView('makerList', new Resources.Views.List( { collection: this.collection }));
      this.MakerDetail = this.Layout.setView('makerDetail', new Resources.Views.Detail());
    },
    list : function () {
      this.MakerList.render();
    },
    detail : function (id) {
      this.MakerDetail.model = new Data.Models.Maker({ id: id });
      this.MakerDetail.render();
    },
    new: function () {
      this.MakerDetail.model = new Data.Models.Maker();
      this.MakerDetail.render();
    }
  });
