var $ = require('jquery-browserify')
    , _ = require('underscore')
    , Backbone = require('backbone')
    , serializeObject = require('serializeObject')
    , jsoneditor = require('jsoneditor');

var app = require('formaggio-common')()
    , LayoutManager = require("backboneLayoutmanager")
    , Data          = require("../data/models")()
    , Shared        = require("../shared/resources")()
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
    __name__: 'Cheese-ListView',
    template: TplService.Cheese.Table,
    initialize: function () {
      var self = this;

      self.collection.on('sync', self.updateTable);
      self.collection.on('remove', self.updateTable);
    },
    unload: function() {
      this.unbind();
      this.remove();
    },
    events: {
      'keyup #textSearchBox': 'search',
      'focus #textSearchBox': 'searchFocus',
      'click .advanced-search-tab': 'toggleAdvancedSearch',
      'submit #advancedSearch': 'submitAdvancedSearch',
      'click .addNewCheeseButton': 'newCheese',
      'click .deleteCheeseButton': 'deleteCheese'
    },
    newCheese: function(evt) {
      var cheese = new Data.Models.Cheese();

      new Shared.Views.NewCheese({ model: cheese }).render();
    },
    deleteCheese: function(evt) {
      var self = this;
      var cheese = this.collection.get($(evt.currentTarget).data('id'));

      if (cheese) {
        if (confirm('Do you want to delete this cheese?')) {

          cheese.destroy({
            success: function() {
              // Remove from the collection.
              self.collection.remove(cheese);

              // Alert the UI.
              Messenger().post({
                message: "Successfully deleted a cheese.",
                type: "info",
                hideAfter: 1,
                hideOnNavigate: true,
                showCloseButton: false,
                id: cheese.id
              });

            },
            error: function() {
              // Alert the UI.
              Messenger().post({
                message: "Failed to remove.",
                type: "error",
                hideAfter: 1,
                hideOnNavigate: true,
                showCloseButton: false,
                id: cheese.id
              });
            }
          });
        }
      } else {
        console.log('Opps we could not find the cheese you wanted to cut. Ha!');
      }
    },
    toggleAdvancedSearch: function(e) {
      // TODO: Move this somewhere else.
      var body = this.$el.find('.advanced-search-body');
      var currentTarget = this.$el.find(e.currentTarget);

      if (currentTarget.hasClass('selected')){
        body.html('').hide();
      } else {
        body.show().html(TplService.Cheese.AdvancedSearch());
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
    search: _.debounce(function(e) {
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
    }, 150),
    updateTable : function () {
      var self = this;
      $('#tbody').html('');

      if(self.models.length > 0){
        _.each(self.models, function(model){
          var modelJSON = model.toJSON();

          // TODO: Fix this to make it work in the template.
          if (_.isArray(modelJSON.makers)) {
            if (!_.isEmpty(modelJSON.makers)) {
              modelJSON.maker = modelJSON.makers[0].maker;
            } else {
              modelJSON.maker = { name: 'NA' };
            }
          } else {
            modelJSON.maker = { name: 'NA' };
          }

          $('#tbody').append(TplService.Cheese.Tr({ model: modelJSON }));
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

  Module.Views.Map = Backbone.Layout.extend({
    __name__: 'Cheese-Map-ListView',
    template: TplService.Cheese.Map,
    unload: function() {
      this.unbind();
      this.remove();
    }
  });

  Module.Views.Accounts = Backbone.Layout.extend({
    __name__: 'Cheese-Accounts-ListView',
    template: TplService.Cheese.Accounts.Table,
    unload: function() {
      this.unbind();
      this.remove();
    },
    events: {
      'click .addAccountBtn': 'addAccountButton',
      'click .findAccountBtn': 'findAccountButton'
    },
    addAccountButton: function(evt) {
      alert('Open Modal to Add a New Account');
    },
    findAccountButton: function(evt) {
      alert('Open Modal to Find and Link a Account');
    },
    afterRender: function () {
      var self = this;
      var ctl = self.$el.find('#tbody').empty();

      if(self.model.get('accounts').length > 0){
        _.each(self.model.get('accounts'), function(model){
          ctl.append(TplService.Cheese.Accounts.Tr({ model: model }));
        });
      } else {
        ctl.append('<tr><td colspan="4" align="center"><br><br>No results found.<br><br></td></tr>');
      }
    }
  });

  Module.Views.Images = Backbone.Layout.extend({
    __name__: 'Cheese-Images-ListView',
    template: TplService.Cheese.Images.Table,
    unload: function() {
      this.unbind();
      this.remove();
    },
     events: {
      'click .addBtn': 'add'
    },
    add: function(evt) {
      alert('Open Modal to Add a Image');
    },
    afterRender: function () {
      var self = this;
      var ctl = self.$el.find('#tbody').empty();

      if(self.model.get('images').length > 0){
        _.each(self.model.get('images'), function(model){
          ctl.append(TplService.Cheese.Images.Tr({ model: model.toJSON() }));
        });
      } else {
        ctl.append('<tr><td colspan="4" align="center"><br><br>No results found.<br><br></td></tr>');
      }
    }
  });

  Module.Views.Makers = Backbone.Layout.extend({
    __name__: 'Cheese-Makers-ListView',
    template: TplService.Cheese.Makers.Table,
    unload: function() {
      this.unbind();
      this.remove();
    },
    events: {
      'click .addMakerBtn': 'addMakerButton',
      'click .findMakerBtn': 'findMakerButton'
    },
    addMakerButton: function(evt) {
      alert('Open Modal to Add a New Maker');
    },
    findMakerButton: function(evt) {
      alert('Open Modal to Find and Link a Maker');
    },
    afterRender: function () {
      var self = this;
      var ctl = self.$el.find('#tbody').empty();

      if(self.model.get('makers').length > 0){
        _.each(self.model.get('makers'), function(model){
          ctl.append(TplService.Cheese.Makers.Tr({ model: model }));
        });
      } else {
        ctl.append('<tr><td colspan="4" align="center"><br><br>No results found.<br><br></td></tr>');
      }
    }
  });

  Module.Views.Header = Backbone.Layout.extend({
    template: TplService.Cheese.Header,
    events: {
      'click .deleteCheeseButton': 'deleteCheese'
    },
    deleteCheese: function(evt) {
      var self = this;

      if (self.model) {
        if (confirm('Do you want to delete this cheese?')) {

          self.model.destroy({
            success: function() {
              // Remove from the collection.

              // Alert the UI.
              Messenger().post({
                message: "Successfully deleted a cheese.",
                type: "info",
                hideAfter: 1,
                hideOnNavigate: true,
                showCloseButton: false,
                id: self.model.id
              });

            },
            error: function() {
              // Alert the UI.
              Messenger().post({
                message: "Failed to remove.",
                type: "error",
                hideAfter: 1,
                hideOnNavigate: true,
                showCloseButton: false,
                id: self.model.id
              });
            }
          });
        }
      } else {
        console.log('Opps we could not find the cheese you wanted to cut. Ha!');
      }
    },
    serialize: function() {
      return {
        model: this.model.toJSON()
      };
    }
  });

  Module.Views.JSONEditor = Backbone.View.extend({
    template: TplService.Cheese.JSONEditor,
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

      var options = {
        'mode': 'tree',
        'modes': ['code','tree'],
        'search': false,
        'expand': true
      };

      var editor = new jsoneditor.JSONEditor(ed, options).set(_.omit(self.model.toJSON(), [ "id", "_id", "_modified" ]));
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
    template: TplService.Cheese.Edit,
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

      self.model.unset('maker');
      self.model.unset('makers');
      self.model.unset('users');
      self.model.unset('user');
      self.model.unset('__v');
      self.model.unset('accounts');

      if (!self.model.isValid()) {
        var msg = "Please supply information for every field.<br><br>" + self.model.validationError;
        app.confirmBox('errorSaving', 'Add All Fields', msg, 'hide', 'OK');
        return;
      }

      self.model.save(null, {
        success: function() {

          Messenger().post({
            message: "Cheese was saved!",
            type: "info",
            hideAfter: 1,
            hideOnNavigate: true,
            showCloseButton: false,
            id: self.model.id
          });

        },
        error: function() {
          app.confirmBox('errorSaving', 'Error Saving Information', "We're sorry, there was an error saving this information. Please try again.", 'hide', 'OK');
          app.setupPage();
        }
      });
    }
  });

  Module.Views.Detail = Backbone.Layout.extend({
    __name__: 'Cheese-Detail-DetailView',
    template: TplService.Cheese.Wrapper,
    initialize : function () {
      var self = this;
      self.tabs = {};
    },
    events : {
      'click .saveButton': 'save',
      'click .cheeseTab': 'changeTabs'
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
      this.tabs.MakersTabContainer = self.insertView('#MakersTabContainer', new Module.Views.Makers( { model: self.model }));
      this.tabs.AccountsTabContainer = self.insertView('#AccountsTabContainer', new Module.Views.Accounts( { model: self.model }));
      this.tabs.ImagesTabContainer = self.insertView('#ImagesTabContainer', new Module.Views.Images( { model: self.model }));
      this.tabs.MapTabContainer = self.insertView('#MapTabContainer', new Module.Views.Map( { model: self.model }));

      self.model.fetch({
        success: function() {
          self.tabs.formTabContainer.render();
          self.tabs.formHeader.render();
          self.model.trigger('change');
        }
      });

      app.setupPage();
    }
  });

  return Module;
};
