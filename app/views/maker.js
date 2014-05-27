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
    __name__: 'Maker-ListView',
    template: TplService.Maker.Table,
    initialize: function () {
      var self = this;

      self.collection.on('sync', self.updateTable);
    },
    unload: function() {
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
      Backbone.history.navigate('makers/new', { trigger: true });
    },
    toggleAdvancedSearch: function(e) {
      // TODO: Move this somewhere else.
      var body = this.$el.find('.advanced-search-body');
      var currentTarget = this.$el.find(e.currentTarget);

      if (currentTarget.hasClass('selected')){
        body.html('').hide();
      } else {
        body.show().html(TplService.Maker.AdvancedSearch());
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
      this.collection.queryParams.name =  $(e.currentTarget).val();
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
          $('#tbody').append(TplService.Maker.Tr({ model: model.toJSON() }));
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

  Module.Views.Accounts = Backbone.Layout.extend({
    __name__: 'Maker-Accounts-ListView',
    template: TplService.Maker.Accounts.Table,
    unload: function() {
      this.unbind();
      this.remove();
    },
    updateTable : function () {
      var self = this;
      $('#tbody').html('');

      if(self.model.get('accounts').length > 0){
        _.each(self.model.get('accounts'), function(model){
          $('#tbody').append(TplService.Maker.Accounts.Tr({ model: model.toJSON() }));
        });
      } else {
        $('#tbody').append('<tr><td colspan="4" align="center"><br><br>No results found.<br><br></td></tr>');
      }
    }
  });

  Module.Views.Images = Backbone.Layout.extend({
    __name__: 'Maker-Images-ListView',
    template: TplService.Maker.Images.Table,
    unload: function() {
      this.unbind();
      this.remove();
    },
    updateTable : function () {
      var self = this;
      $('#tbody').html('');

      if(self.model.get('images').length > 0){
        _.each(self.model.get('images'), function(model){
          $('#tbody').append(TplService.Maker.Accounts.Tr({ model: model.toJSON() }));
        });
      } else {
        $('#tbody').append('<tr><td colspan="4" align="center"><br><br>No results found.<br><br></td></tr>');
      }
    }
  });

  Module.Views.Cheeses = Backbone.Layout.extend({
    __name__: 'Maker-Cheeses-ListView',
    template: TplService.Maker.Cheeses.Table,
    unload: function() {
      this.unbind();
      this.remove();
    },
    updateTable : function () {
      var self = this;
      $('#tbody').html('');

      if(self.model.get('cheeses').length > 0){
        _.each(self.model.get('cheeses'), function(model){
          $('#tbody').append(TplService.Maker.Cheeses.Tr({ model: model.toJSON() }));
        });
      } else {
        $('#tbody').append('<tr><td colspan="4" align="center"><br><br>No results found.<br><br></td></tr>');
      }
    }
  });

  Module.Views.Header = Backbone.Layout.extend({
    template: TplService.Maker.Header,
    sType: '',
    serialize: function() {
      return {
        model: this.model.toJSON()
      };
    }
  });

  Module.Views.JSONEditor = Backbone.View.extend({
    template: TplService.Maker.JSONEditor,
    sType: '',
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
    template: TplService.Maker.Edit,
    sType: '',
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
    sType: '',
    __name__: 'Maker-Detail-DetailView',
    template: TplService.Maker.Wrapper,
    initialize : function () {
      var self = this;
      self.tabs = {};
    },
    events : {
      'click .saveButton' : 'save',
      'click .makerTab': 'changeTabs'
    },
    unload : function() {
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
      this.tabs.AccountsTabContainer = self.insertView('#AccountsTabContainer', new Module.Views.Accounts( { model: self.model }));
      this.tabs.ImagesTabContainer = self.insertView('#ImagesTabContainer', new Module.Views.Images( { model: self.model }));

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
