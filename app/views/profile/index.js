var _ = require('underscore');
var tpl  = require("./template.handlebars");

module.exports = Backbone.Layout.extend({
    template: tpl,
    serialize: function() {
      return {
        profile: this.model.toJSON()
      };
    },
    events: {
      'click .continue': 'save'
    },
    save: function() {
      var self = this;
      var form = $(this.$el.find('#modalForm')[0]);
      var data = form.serializeObject();

      if (!data.password) {
        delete data.password;
      }

      // Update the data.
      this.model.set(data);

      if (!this.model.isValid()) {
        $('#ModalErrorMessages').html(this.model.validationError);
        return;
      }

      this.model.save(null, { 
        success: function() {
	        // Force the session to update.
	        window.Session.fetch();
	        self.unload();
	    }
      });
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

      this.model.fetch({
        success: function() {
          self.$el.find('.modal').modal('show').removeClass('hide').removeClass('fade');
        }
      });
    }
  });