var $ = require('jquery-browserify')
    , _ = require('underscore')
    , Backbone = require('backbone')
    , Data = require("../data/models")();

Backbone.$ = $;

var Resources = require("../views/maker")();

module.exports = Backbone.Router.extend({
  routes: {
      'maker'                    : 'list',
      'maker/new'                : 'new',
      'maker/:id'                : 'detail'
    },
    initialize : function (options) {
      this.Layout = new Resources.Layout();
      this.collection = new Data.Collections.Makers();

      this.layoutName = 'makers';
    },
    list : function () {
      this.Layout.setView(this.layoutName, new Resources.Views.List( { collection: this.collection }));
      this.Layout.getView(this.layoutName).render();
    },
    detail : function (id) {
      var model = new Data.Models.Maker({ id: id });

      this.Layout.setView(this.layoutName, new Data.Views.Detail( { model: model }));
      this.Layout.getView(this.layoutName).id = id;
      this.Layout.getView(this.layoutName).render();
    },
    new: function () {
      var model = new Data.Models.Maker();
      this.Layout.setView('new', new Resources.Views.Detail( { model: model } ));
      this.Layout.getView('new').render();
    }
  });
