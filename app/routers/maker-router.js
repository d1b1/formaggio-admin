var $ = require('jquery-browserify')
    , _ = require('underscore')
    , Backbone = require('backbone')
    , Data = require("../data/models")();

var app = require('formaggio-common')();

Backbone.$ = $;

var Resources = require("../views/maker")();
// var LayoutManager = require("backboneLayoutmanager");
var TplService    = require("../templates.js")();

module.exports = Backbone.Router.extend({
  routes: {
      'makers'                    : 'list',
      'makers/new'                : 'new',
      'makers/:id'                : 'detail'
    },
    initialize : function (options) {
      self.makers = this.makers = new Data.Collections.Makers();
      this.Layout = new Resources.Layout();

      // this.MakerList = this.Layout.setView('makerList', new Resources.Views.Container({ collection: this.collection }));
      // this.MakerDetail = this.Layout.setView('makerDetail', new Resources.Views.Detail());
    },
    list : function () {

      var Layout = Backbone.Layout.extend({
        el: '#main-content',
        template: TplService.Maker.Container,
        views: {
          '#MakerListTabContainer': new Resources.Views.List({ collection: this.makers }),
          '#MakerMapTabContainer': new Resources.Views.Map({ collection: this.makers }),
          '#Pagination': new Resources.Views.Pagination({ collection: this.makers }),
        },
        afterRender: function() {
          $('.makerListTab')[0].click();
        }
      });

      new Layout().render();

      self.makers.fetch();
    },
    detail: function (id) {

      var self = this;
      var model = new Data.Models.Maker({ id: id });

      var Layout = Backbone.Layout.extend({
        el: '#main-content',
        template: TplService.Maker.Wrapper,
        views: {
          '.formHeader': new Resources.Views.Header({ model: model }),
          '#formTabContainer': new Resources.Views.EditForm( { model: model }),
          '#JSONTabContainer': new Resources.Views.JSONEditor( { model: model }),
          '#CheesesTabContainer': new Resources.Views.Cheeses( { model: model }),
          '#AccountsTabContainer': new Resources.Views.Accounts( { model: model }),
          '#ImagesTabContainer': new Resources.Views.Images( { model: model }),
          '#MapTabContainer': new Resources.Views.Map( { model: model })
        }
      });

      model.fetch({
        success: function() {
          new Layout().render();
        }
      });
    },
    new: function () {
      this.MakerDetail.model = new Data.Models.Maker();
      this.MakerDetail.render();
    }
  });
