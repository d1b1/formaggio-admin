var $ = require('jquery-browserify')
    , _ = require('underscore')
    , Backbone = require('backbone')
    , Data = require("../data/models")();

var app = require('formaggio-common')();

Backbone.$ = $;

var Resources = require("../views/maker")();
var TplService    = require("../templates.js")();
var presenter = require('../presenter');

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
        }
      });

      presenter.presentView( new Layout() );

      self.makers.fetch();
    },
    detail: function (id) {

      var self = this;
      var model = new Data.Models.Maker({ id: id });

      var Layout = Backbone.Layout.extend({
        el: '#main-content',
        template: TplService.Maker.Wrapper,
        views: {
          '.formHeader':           new Resources.Views.Header({ model: model }),
          '#formTabContainer':     new Resources.Views.EditForm( { model: model }),
          '#JSONTabContainer':     new Resources.Views.JSONEditor( { model: model }),
          '#CheesesTabContainer':  new Resources.Views.Cheeses( { model: model }),
          '#AccountsTabContainer': new Resources.Views.Accounts( { model: model }),
          '#ImagesTabContainer':   new Resources.Views.Images( { model: model }),
          '#MapTabContainer':      new Resources.Views.Map( { model: model })
        }
      });

      // Option 1: Attach and Render. Separate Fetch.
      //
      // Pro: Shows something, waits for the fetch.
      // Con: Shows before we have data.
      //
      // Best approach since we often do not data or any number
      // of issues might arise and we need the UI elements in the
      // view to make a better user experience.

      presenter.presentView( new Layout() );
      
      model.fetch();

      // Option 2 (Alt): Fetch and only render after success.
      //
      // Pro: Waits for data to render.
      // Con: No Success means nothing to show.
      //
      // Not Best, since a Rest issue could stop the UI from showing
      // anything.

      // model.fetch({
      //   success: function() {
      //     presenter.presentView( new Layout() );
      //   }
      // });

    },
    new: function () {
      this.MakerDetail.model = new Data.Models.Maker();
      // this.MakerDetail.render();
      presenter.presentView( this.MakerDetail );
    }
  });
