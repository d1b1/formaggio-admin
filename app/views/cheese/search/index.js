var _ = require('underscore');
var tpl = require('./template.handlebars');
var row = require('./row.handlebars');

var rowView = Backbone.Layout.extend({
  template: row,
  el: false,
  initialize: function(opts) {
    this.callback = opts.callback;
  },
  events: {
    'click .selectBtn': 'select'
  },
  select: function(evt) {
  	evt.preventDefault();

  	// Handle the callback.
    this.callback(self.model);

    // Close the parent View.
    this.__manager__.parent.unload();
  },
  serialize: function() {
  	return this.model.toJSON();
  }
});

module.exports = Backbone.Layout.extend({
	template: tpl,
	manage: true,
	events: {
      'keyup #SearchTerm': 'search'
	},
	initialize: function(opts) {
    /* Set the callback. */
	  if (_.isObject(opts) && opts.callback) {
	  	this.callback = opts.callback;
	  }

	  var col = Backbone.Collection.extend({
        url: function() {
          return 'http://' + window.apiDomain + '/cheese/search?limit=5&name=' + this.name;
        },
        parse: function(data) {
          return data.results;
        }
      });

      this.collection = new col();
      this.collection.on('sync', this.renderResults, this);
	},
	renderResults: function() {
	  var self = this;
	  // Empty out the results.
	  self.$el.find('#results').empty();

      // Loop and insert a view for each results.
      _.each(self.collection.models, function(model) {
        self.insertView('#results', new rowView({ model: model, callback: self.callback })).render();
      }, this);
	},
	search: function(evt) {
	  this.collection.name = $(evt.currentTarget).val();
      this.collection.fetch();
	},
	unload: function() {
	  $('.modal').modal('hide').addClass('hide');
	  $('body').removeClass('modal-open');

	  this.unbind();
	  this.undelegateEvents();
	  this.remove();
	},
	afterRender: function() {
	  var self = this;
	  self.$el.appendTo('body');
	  self.$el.find('.modal').on('hidden.bs.modal', function () {
	    self.unload();
	  });

	  self.$el.find('.modal').modal('show').removeClass('hide').removeClass('fade');

    // Set the focus to the input box.
    self.$el.find('#SearchTerm').focus();
	}
});