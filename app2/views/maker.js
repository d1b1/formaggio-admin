var $ = require("jquery-browserify")
    , _ = require("underscore")
    , Backbone = require("backbone")
    , serializeObject = require("serializeObject")
    , jsoneditor = require("jsoneditor");

var app = require("formaggio-common")()
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

  Module.Views.Pagination = Backbone.Layout.extend({
    initialize: function(options) {
      var self = this;
      self.collection = options.collection;
      this.collection.on("sync", this.render, this);
    },
    events: {
      "click .gotNextPage": function() {
        this.collection.getNextPage();
      },
      "click .getPreviousPage": function() {
        this.collection.getPreviousPage();
      },
      "click .getPage": function(e) {
        this.collection.getPage( $(e.currentTarget).data("page") );
      }
    },
    template: TplService.PaginationTemplate,
    serialize: function() {
      var arr = [];
      var firstPage = this.collection.state.firstPage;
      while(firstPage <= this.collection.state.lastPage){
        arr.push(firstPage++);
      }

      return {
        currentPage: this.collection.state.currentPage,
        firstPage: this.collection.state.firstPage,
        arr: arr,
        lastPage: this.collection.state.lastPage
      }
    }
  });

  Module.Views.List = Backbone.Layout.extend({
    template: TplService.Maker.Table,
    initialize: function(options) {
      var self = this;
      options.collection.on("sync", this.renderTable, this);
    },
    events: {
      "click .deleteMakerButton": "deleteMaker"
    },
    deleteMaker: function(evt) {
      var self = this;
      var maker = this.collection.get($(evt.currentTarget).data("id"));

      if (maker) {
        if (confirm("Do you want to delete this maker?")) {

          maker.destroy({
            success: function() {
              // Remove from the collection.
              self.collection.remove(maker);

              // Alert the UI.
              Messenger().post({
                message: "Successfully deleted a maker.",
                type: "info",
                hideAfter: 1,
                hideOnNavigate: true,
                showCloseButton: false,
                id: maker.id
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
                id: maker.id
              });
            }
          });
        }
      } else {
        console.log("Opps we could not find the maker you wanted to cut. Ha!");
      }
    },
    renderTable: function() {
      var self = this;
      var tbody = this.$el.find("#tbody");
      tbody.html("");

      var collection = this.collection;

      if(collection.models.length > 0){
        _.each(collection.models, function(model){
          tbody.append(TplService.Maker.Tr({ model: model.toJSON() }));
        });
      } else {
        tbody.append("<tr><td colspan=4 align=center><br><br>No results found.<br><br></td></tr>");
      }
    }
  });

  Module.Views.Container = Backbone.Layout.extend({
    el: "#main-content",
    __name__: "Maker-ListView",
    template: TplService.Maker.Container,
    initialize: function () {
      var self = this;
      self.tabs = {};

      var self = this;
    },
    unload: function() {
      this.unbind();
      this.remove();
    },
    events: {
      "click .addNewMakerButton": "newMaker"
      // "change #textSearchBox": "search",
      // "focus #textSearchBox": "searchFocus",
      // "click .advanced-search-tab": "toggleAdvancedSearch",
      // "submit #advancedSearch": "submitAdvancedSearch",
      // "click .makerListTab": "changeTabs",
    },
    newMaker: function(evt) {
      var maker = new Data.Models.Maker();

      new Shared.Views.NewMaker({ model: maker }).render();
    },
    // toggleAdvancedSearch: function(e) {
    //   // TODO: Move this somewhere else.
    //   var body = this.$el.find(".advanced-search-body");
    //   var currentTarget = this.$el.find(e.currentTarget);
    //
    //   if (currentTarget.hasClass("selected")){
    //     body.html("").hide();
    //   } else {
    //     body.show().html(TplService.Maker.AdvancedSearch());
    //   }
    //
    //   currentTarget.toggleClass("selected");
    // },
    // // searchFocus: function(e) {
    //   var target = this.$el.find(".advanced-search-tab");
    //   return (target.hasClass("selected") ? target.click() : "");
    // },
    // submitAdvancedSearch: function(e) {
    //   e.preventDefault();
    //   var self = this;
    //   var advancedSearchResults = self.$el.find("#advancedSearch").serializeObject();
    //
    //   this.collection.state = _.extend({},this.originalUsersState);
    //   this.collection.queryParams = _.extend({},this.originalUsersQueryParams);
    //
    //   for(var key in advancedSearchResults){
    //     if(advancedSearchResults[key]){
    //       this.collection.state[key] = advancedSearchResults[key];
    //       this.collection.queryParams[key] = advancedSearchResults[key];
    //     } else {
    //       this.collection.state[key] = null;
    //     }
    //   }
    //
    //   this.collection.fetch({error: function(collection, response, options) {
    //       self.$el.find("#tbody").append("<div class"alert">No results for " + $(e.currentTarget).val() + "</div>");
    //     }
    //   });
    //
    //   return false;
    // },
    // search: function(e) {
    //   this.collection.state =  _.extend({},this.originalUsersState);
    //   this.collection.queryParams =  _.extend({},this.originalUsersQueryParams);
    //   this.collection.state._q = $(e.currentTarget).val();
    //   this.collection.state._fields = "type";
    //   this.collection.state.currentPage = 1;
    //   this.collection.queryParams.name =  $(e.currentTarget).val();
    //   this.collection.queryParams._fields = "type";
    //
    //   this.collection.fetch({
    //     error: function(collection, response, options) {
    //       $("#tbody").append("<tr><td>Oops, error searching for " + $(e.currentTarget).val() + "</td></tr>");
    //     }
    //   });
    // },
    // changeTabs: function(e) {
    //   var tab = $(e.currentTarget)[0].hash.replace("#", "");
    //
    //   if (this.tabs[tab]) {
    //     console.log("Found and Rendered", tab);
    //     this.tabs[tab].render();
    //   } else {
    //     console.log("Could not Find", tab);
    //   }
    // },
    // adjustPerPage : function(e) {
    //   this.collection.setPageSize( parseInt($(e.currentTarget).val()) );
    //   this.collection.fetch();
    // },
    afterRender: function() {
      var self = this;
      // this.originalUsersState = _.extend({}, this.collection.state);
      // this.originalUsersQueryParams = _.extend({},this.collection.queryParams);

      $('.addNewMakerButton').on('click', function() {
        alert('asdf');
      });

      $(".makerListTab")[0].click();
      // this.pager.render();
    }
  });

  Module.Views.Accounts = Backbone.Layout.extend({
    __name__: "Maker-Accounts-ListView",
    template: TplService.Maker.Accounts.Table,
    unload: function() {
      this.unbind();
      this.remove();
    },
    updateTable : function () {
      var self = this;
      $("#tbody").html("");

      if(self.model.get("accounts").length > 0){
        _.each(self.model.get("accounts"), function(model){
          $("#tbody").append(TplService.Maker.Accounts.Tr({ model: model.toJSON() }));
        });
      } else {
        $("#tbody").append("<tr><td colspan=4 align=center><br><br>No results found.<br><br></td></tr>");
      }
    }
  });

  Module.Views.Images = Backbone.Layout.extend({
    __name__: "Maker-Images-ListView",
    template: TplService.Maker.Images.Table,
    unload: function() {
      this.unbind();
      this.remove();
    },
    updateTable : function () {
      var self = this;
      $("#tbody").html("");

      if(self.model.get("images").length > 0){
        _.each(self.model.get("images"), function(model){
          $("#tbody").append(TplService.Maker.Accounts.Tr({ model: model.toJSON() }));
        });
      } else {
        $("#tbody").append("<tr><td colspan=4 align=center><br><br>No results found.<br><br></td></tr>");
      }
    }
  });

  Module.Views.Cheeses = Backbone.Layout.extend({
    __name__: "Maker-Cheeses-ListView",
    template: TplService.Maker.Cheeses.Table,
    initialize: function() {
      this.collection = new Data.Collections.Cheeses();
      this.collection.state.maker = this.model.id;
      this.collection.queryParams.maker = this.model.id;

      this.collection.on("sync", this.list, this);
    },
    list: function () {
      var tbody = $("#tbody").empty();
      _.each(this.collection.models, function(model){
        tbody.append(TplService.Maker.Cheeses.Tr({ model: model.toJSON() }));
      });
    },
    afterRender: function() {
      this.collection.fetch();
    }
  });

  Module.Views.Map = Backbone.Layout.extend({
    __name__: "Maker-Map-ListView",
    template: TplService.Maker.Map,
    unload: function() {
      this.unbind();
      this.remove();
    }
  });

  Module.Views.Header = Backbone.Layout.extend({
    template: TplService.Maker.Header,
    serialize: function() {
      return {
        model: this.model.toJSON()
      };
    }
  });

  Module.Views.JSONEditor = Backbone.View.extend({
    template: TplService.Maker.JSONEditor,
    events: {
      "click .saveButton" : "save",
    },
    initialize: function() {
      var self = this;

      self.model.on("change", function() {
        if (self.model.isValid()) {
          self.$el.find(".saveButton").removeClass("btn-default").addClass("btn-primary");
        } else {
          self.$el.find(".saveButton").removeClass("btn-primary").addClass("btn-default");
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
        app.confirmBox("errorSaving", "Add All Fields", "Please supply information for every field.", "hide", "OK");
        return;
      }

      self.model.save().done(function() {
        location.reload(true);
        app.setupPage();
      }).fail(function() {
        app.confirmBox("errorSaving", "Error Saving Information", "We're sorry, there was an error saving this information. Please try again.", "hide", "OK");
        app.setupPage();
      });
    }
  });

  Module.Views.EditForm = Backbone.Layout.extend({
    template: TplService.Maker.Edit,
    serialize: function() {
      return { model: this.model.toJSON() };
    },
    events: {
      "change .form-control": "inputChanged",
      "click .saveButton" : "save",
    },
    inputChanged: function(evt) {
      var modelKey = $(evt.currentTarget).data("model-key");
      var value = $(evt.currentTarget).val();
      var obj = {};
      obj[modelKey] = value;
      this.model.set(obj);
    },
    save: function(e) {
      var self = this;
      e.preventDefault();

      self.model.unset("maker");
      self.model.unset("makers");
      self.model.unset("users");
      self.model.unset("user");
      self.model.unset("__v");
      self.model.unset("accounts");
      self.model.unset("cheeses");
      self.model.unset("location");

      if (!self.model.isValid()) {
        app.confirmBox("errorSaving", "Add All Fields", "Please supply information for every field.", "hide", "OK");
        return;
      }

      self.model.save(null, {
        success: function() {
          location.reload(true);
          app.setupPage();
        },
        error: function() {
          app.confirmBox("errorSaving", "Error Saving Information", "We're sorry, there was an error saving this information. Please try again.", "hide", "OK");
          app.setupPage();lp
        }
      });
    }
  });

  Module.Views.Detail = Backbone.Layout.extend({
    el: "#main-content",
    __name__: "Maker-Detail-DetailView",
    template: TplService.Maker.Wrapper,
    initialize : function () {
      var self = this;
      self.tabs = {};
    },
    events : {
      "click .saveButton" : "save",
      "click .makerTab": "changeTabs"
    },
    unload : function() {
      this.unbind();
      this.remove();
    },
    changeTabs: function(e) {
      var tab = $(e.currentTarget)[0].hash.replace("#", "");
      this.tabs[tab].render();
    },
    afterRender : function () {
      var self = this;
      // this.tabs.formHeader = self.insertView(".formHeader", new Module.Views.Header( { model: self.model }));
      // this.tabs.formTabContainer = self.insertView("#formTabContainer", new Module.Views.EditForm( { model: self.model }));
      // this.tabs.JSONTabContainer = self.insertView("#JSONTabContainer", new Module.Views.JSONEditor( { model: self.model }));
      // this.tabs.CheesesTabContainer = self.insertView("#CheesesTabContainer", new Module.Views.Cheeses( { model: self.model }));
      // this.tabs.AccountsTabContainer = self.insertView("#AccountsTabContainer", new Module.Views.Accounts( { model: self.model }));
      // this.tabs.ImagesTabContainer = self.insertView("#ImagesTabContainer", new Module.Views.Images( { model: self.model }));
      // this.tabs.MapTabContainer = self.insertView("#MapTabContainer", new Module.Views.Map( { model: self.model }));
      //
      // if (self.model.isNew()) {
      //   self.tabs.formTabContainer.render();
      //   self.tabs.formHeader.render();
      // } else {
      //   self.model.fetch({
      //     success: function() {
      //       self.tabs.formTabContainer.render();
      //       self.tabs.formHeader.render();
      //       self.model.trigger("change");
      //     }
      //   });
      // }
      // app.setupPage();
    }
  });

  return Module;
};
