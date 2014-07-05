var $ = require('jquery-browserify')
    , _ = require('underscore')
    , Backbone = require('backbone')
    , serializeObject = require('serializeObject')
    , jsoneditor = require('jsoneditor');

var app = require('formaggio-common')()
    , LayoutManager = require("backboneLayoutmanager")
    , DashboardData = require("../data/models")()
    , TplService    = require("../templates.js")();

module.exports = function( opts ) {

  var Module = {
    Views: {},
    Layout: Backbone.Layout.extend({
      initialize : function () {
        var self = this;
      }
    })
  };

  Module.Views.List = Backbone.Layout.extend({
    el: '#main-content',
    __name__: 'Account-ListView',
    template: TplService.Account.Table,
    initialize: function () {
      var self = this;

      self.collection.on('sync', self.updateTable);
    },
    unload: function() {
      console.log('Unloading the Account List');
      this.unbind();
      this.remove();
    },
    events: {
      'change #textSearchBox': 'search',
      'focus #textSearchBox': 'searchFocus',
      'click .advanced-search-tab': 'toggleAdvancedSearch',
      'submit #advancedSearch': 'submitAdvancedSearch',
      'click .addNewButton': 'gotoAddNewRoute'
    },
    gotoAddNewRoute: function(e) {
      e.preventDefault();
      Backbone.history.navigate('accounts/new', { trigger: true });
    },
    toggleAdvancedSearch: function(e) {
      // TODO: Move this somewhere else.
      var body = this.$el.find('.advanced-search-body');
      var currentTarget = this.$el.find(e.currentTarget);

      if (currentTarget.hasClass('selected')){
        body.html('').hide();
      } else {
        body.show().html(TplService.Account.AdvancedSearch());
      }

      currentTarget.toggleClass('selected');
    },
    searchFocus: function(e) {
      var target = this.$el.find('.advanced-search-tab');
      return (target.hasClass('selected') ? target.click() : '');
    },
    submitAdvancedSearch: function(e) {
      e.preventDefault();
      var self = this;
      var advancedSearchResults = self.$el.find('#advancedSearch').serializeObject();

      this.collection.state = _.extend({},this.originalUsersState);
      this.collection.queryParams = _.extend({},this.originalUsersQueryParams);

      for(var key in advancedSearchResults){
        if(advancedSearchResults[key]){
          this.collection.state[key] = advancedSearchResults[key];
          this.collection.queryParams[key] = advancedSearchResults[key];
        } else {
          this.collection.state[key] = null;
        }
      }

      this.collection.fetch({error: function(collection, response, options) {
          self.$el.find('#tbody').append('<div class"alert">No results for ' + $(e.currentTarget).val() + "</div>");
        }
      });

      return false;
    },
    search: function(e) {
      this.collection.state =  _.extend({},this.originalUsersState);
      this.collection.queryParams =  _.extend({},this.originalUsersQueryParams);
      this.collection.state._q = $(e.currentTarget).val();
      this.collection.state._fields = "type";
      this.collection.state.currentPage = 1;
      this.collection.queryParams._q =  $(e.currentTarget).val();
      this.collection.queryParams._fields = "type";

      this.collection.fetch({
        error: function(collection, response, options) {
          $('#tbody').append('<tr><td>Oops, error searching for ' + $(e.currentTarget).val() + "</td></tr>");
        }
      });
    },
    updateTable : function () {
      var self = this;
      $('#tbody').html('');

      if(self.models.length > 0){
        _.each(self.models, function(model){
          $('#tbody').append(TplService.Account.Tr({ model: model.toJSON() }));
        });
      } else {
        $('#tbody').append('<tr><td colspan="4" align="center"><br><br>No results found.<br><br></td></tr>');
      }

      var firstPage = self.state.firstPage;
      var arr = [];
      while(firstPage <= self.state.lastPage){
        arr.push(firstPage++);
      }
      $('.adv-table').find('.pagination').remove();
      $('.adv-table').append(TplService.PaginationTemplate({
          currentPage : self.state.currentPage,
          lastPage : self.state.lastPage,
          firstPage : self.state.firstPage,
          arr : arr,
        })
      );

      $('.adv-table').find('.getPreviousPage').click(function(e){
        self.getPreviousPage();
      });
      $('.adv-table').find('.getPage').click(function(e){
        self.getPage($(e.currentTarget).data('page'));
      });
      $('.adv-table').find('.getNextPage').click(function(e){
        self.getNextPage();
      });

    },
    adjustPerPage : function(e) {
      this.collection.setPageSize( parseInt($(e.currentTarget).val()) );
      this.collection.fetch();
    },
    afterRender: function() {
      var self = this;
      this.originalUsersState = _.extend({}, this.collection.state);
      this.originalUsersQueryParams = _.extend({},this.collection.queryParams);

      this.collection.fetch({
        success: function(){
          app.setupPage();
          $('.adv-table').find('.adjustPerPage').change(function(e){
            self.adjustPerPage(e);
          });
        }
      });
    }
  });

  Module.Views.Cheeses = Backbone.Layout.extend({
    __name__: 'Account-Cheeses-ListView',
    template: TplService.Account.Cheeses.Table,
    unload: function() {
      this.unbind();
      this.remove();
    },
    updateTable : function () {
      var self = this;
      $('#tbody').html('');

      if(self.model.get('cheeses').length > 0){
        _.each(self.model.get('cheeses'), function(model){
          $('#tbody').append(TplService.Account.Cheeses.Tr({ model: model.toJSON() }));
        });
      } else {
        $('#tbody').append('<tr><td colspan="4" align="center"><br><br>No results found.<br><br></td></tr>');
      }
    }
  });

  Module.Views.OAuths = Backbone.Layout.extend({
    __name__: 'Account-OAuth-ListView',
    template: TplService.Account.OAuth.Table,
    unload: function() {
      this.unbind();
      this.remove();
    },
    updateTable : function () {
      var self = this;
      $('#tbody').html('');

      if(self.model.get('images').length > 0){
        _.each(self.model.get('images'), function(model){
          $('#tbody').append(TplService.Account.OAuth.Tr({ model: model.toJSON() }));
        });
      } else {
        $('#tbody').append('<tr><td colspan="4" align="center"><br><br>No results found.<br><br></td></tr>');
      }
    }
  });

  Module.Views.Images = Backbone.Layout.extend({
    __name__: 'Account-Images-ListView',
    template: TplService.Cheese.Images.Table,
    unload: function() {
      this.unbind();
      this.remove();
    },
    updateTable : function () {
      var self = this;
      $('#tbody').html('');

      if(self.model.get('images').length > 0){
        _.each(self.model.get('images'), function(model){
          $('#tbody').append(TplService.Account.Images.Tr({ model: model.toJSON() }));
        });
      } else {
        $('#tbody').append('<tr><td colspan="4" align="center"><br><br>No results found.<br><br></td></tr>');
      }
    }
  });

  Module.Views.Map = Backbone.Layout.extend({
    __name__: 'Account-Map-ListView',
    template: TplService.Account.Map,
    unload: function() {
      this.unbind();
      this.remove();
    },
    updateTable : function () {
      var self = this;

      //
    }
  });

  Module.Views.Favorites = Backbone.Layout.extend({
    __name__: 'Account-Favorites-ListView',
    template: TplService.Account.Favorites.Table,
    unload: function() {
      this.unbind();
      this.remove();
    },
    updateTable : function () {
      var self = this;
      $('#tbody').html('');

      if(self.model.get('favorites').length > 0){
        _.each(self.model.get('makers'), function(model){
          $('#tbody').append(TplService.Account.Favorites.Tr({ model: model.toJSON() }));
        });
      } else {
        $('#tbody').append('<tr><td colspan="4" align="center"><br><br>No results found.<br><br></td></tr>');
      }
    }
  });

  Module.Views.Makers = Backbone.Layout.extend({
    __name__: 'Account-Makers-ListView',
    template: TplService.Account.Makers.Table,
    unload: function() {
      this.unbind();
      this.remove();
    },
    updateTable : function () {
      var self = this;
      $('#tbody').html('');

      if(self.model.get('makers').length > 0){
        _.each(self.model.get('makers'), function(model){
          $('#tbody').append(TplService.Maker.Cheeses.Tr({ model: model.toJSON() }));
        });
      } else {
        $('#tbody').append('<tr><td colspan="4" align="center"><br><br>No results found.<br><br></td></tr>');
      }
    }
  });

  Module.Views.Header = Backbone.Layout.extend({
    template: TplService.Account.Header,
    serialize: function() {
      return {
        model: this.model.toJSON()
      };
    }
  });

  Module.Views.JSONEditor = Backbone.View.extend({
    template: TplService.Account.JSONEditor,
    events: {
      'click .saveButton' : 'save',
    },
    initialize: function() {
      var self = this;

      self.model.on('change', function() {
        if (self.model.isValid()) {
          self.$el.find('.saveButton').removeClass('btn-default').addClass('btn-primary');
        } else {
          self.$el.find('.saveButton').removeClass('btn-primary').addClass('btn-default');
        }
      });
    },
    afterRender: function() {
      var self = this;
      var ed = _.first(this.$el.find("#jsonEditorDiv"));

      var editor = new jsoneditor.JSONEditor(ed, {
        change: function () {
          var changedData = _.omit(editor.get(), [ 'id', '_id', '_modified' ]);
          self.model.set(changedData);
        }
      }).set(_.omit(self.model.toJSON(), [ 'id', '_id', '_modified' ]));
    },
    save: function(e) {
      var self = this;
      e.preventDefault();

      if (!self.model.isValid()) {
        app.confirmBox('errorSaving', 'Add All Fields', "Please supply information for every field.", 'hide', 'OK');
        return;
      }

      self.model.save().done(function() {
        location.reload(true);
        app.setupPage();
      }).fail(function() {
        app.confirmBox('errorSaving', 'Error Saving Information', "We're sorry, there was an error saving this information. Please try again.", 'hide', 'OK');
        app.setupPage();
      });
    }
  });

  Module.Views.EditForm = Backbone.Layout.extend({
    template: TplService.Account.Edit,
    serialize: function() {
      return { model: this.model.toJSON() };
    },
    events: {
      'change .form-control': 'inputChanged',
      'click .saveButton' : 'save',
    },
    inputChanged: function(evt) {
      var modelKey = $(evt.currentTarget).data('modelKey');
      var value = $(evt.currentTarget).val();
      var obj = {};
      obj[modelKey] = value;
      this.model.set(obj);
    },
    save: function(e) {
      var self = this;
      e.preventDefault();

      if (!self.model.isValid()) {
        app.confirmBox('errorSaving', 'Add All Fields', "Please supply information for every field.", 'hide', 'OK');
        return;
      }

      self.model.save().done(function() {
        location.reload(true);
        app.setupPage();
      }).fail(function() {
        app.confirmBox('errorSaving', 'Error Saving Information', "We're sorry, there was an error saving this information. Please try again.", 'hide', 'OK');
        app.setupPage();
      });
    }
  });

  Module.Views.Detail = Backbone.Layout.extend({
    el: '#main-content',
    __name__: 'Account-Detail-DetailView',
    template: TplService.Account.Wrapper,
    initialize : function () {
      var self = this;
      self.tabs = {};
    },
    events : {
      'click .saveButton': 'save',
      'click .accountTab': 'changeTabs'
    },
    unload : function() {
      console.log('Unloading the Account Detail');
      this.unbind();
      this.remove();
    },
    changeTabs: function(e) {
      var tab = $(e.currentTarget)[0].hash.replace('#', '');
      this.tabs[tab].render();
    },
    afterRender : function () {
      var self = this;
      this.tabs.formHeader = self.insertView('.formHeader', new Module.Views.Header( { model: self.model }));
      this.tabs.formTabContainer = self.insertView('#formTabContainer', new Module.Views.EditForm( { model: self.model }));
      this.tabs.JSONTabContainer = self.insertView('#JSONTabContainer', new Module.Views.JSONEditor( { model: self.model }));
      this.tabs.CheesesTabContainer = self.insertView('#CheesesTabContainer', new Module.Views.Cheeses( { model: self.model }));
      this.tabs.MakersTabContainer = self.insertView('#MakersTabContainer', new Module.Views.Makers( { model: self.model }));
      this.tabs.OAuthTabContainer = self.insertView('#OAuthTabContainer', new Module.Views.OAuths( { model: self.model }));
      this.tabs.FavoritesTabContainer = self.insertView('#FavoritesTabContainer', new Module.Views.Favorites( { model: self.model }));
      this.tabs.MapTabContainer = self.insertView('#MapTabContainer', new Module.Views.Map( { model: self.model }));

      if (self.model.isNew()) {
        self.tabs.formTabContainer.render();
        self.tabs.formHeader.render();
      } else {
        self.model.fetch({
          success: function() {
            self.tabs.formTabContainer.render();
            self.tabs.formHeader.render();
            self.model.trigger('change');
          }
        });
      }
      app.setupPage();
    }
  });

  return Module;
};
