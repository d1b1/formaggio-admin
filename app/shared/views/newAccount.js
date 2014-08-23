var _ = require('underscore')
    , LayoutManager = require("backboneLayoutmanager");

// This calls a local service that loads templates. Need to
// trace down what is happening with the templates, since I can
// not call them directly from the require lines.

var TplService  = require("../templates")()

/*
  This is a shared view for deleting an Employer. The view is in the
  the templates/model folder. This view is designed to be called from
  the Advisor or Super Admin UIs.

  Required:
    - Employer Model

  Optional:
    - callback (function)
    - collection (Backbone Collection)

*/

module.exports = Backbone.Layout.extend({
  template: TplService.newAccount,
  events: {
    'click .actionButton': 'action'
  },
  unload: function() {
    $('.modal').modal('hide').addClass('hide');
    $('body').removeClass("modal-open");

    this.unbind();
    this.undelegateEvents();
    this.remove();
  },
  serialize: function() {
    // Remember we might not have brokers. The UI will hide is we have none.

    return {
      model: this.model.toJSON()
    };
  },
  initialize: function() {
    // If we have collection, then load it into the view so we can use it.
    var self = this;
  },
  action: function(evt) {
    var self = this;

    // Store the Data in the Model.
    self.model.set($('#modalForm').serializeObject());

    // Check validation.
    if (!self.model.isValid()) {
      $('#ModalErrorMessages').html(self.model.validationError);
      return;
    }

    self.model.save(null, {
      success: function() {
        // If we have a collection then add the model.

        if (self.options.collection) {
          self.options.collection.add(self.model);
        }

        // Alert the UI.
        Messenger().post({
          message: 'Create a new account.',
          type: 'success',
          hideAfter: 2,
          hideOnNavigate: false,
          showCloseButton: false,
          id: self.model.id
        });

        // If we have a callback then call it!
        if (_.isFunction(self.options.callback)) {
          self.options.callback(self);
        }

        // Unload the form.
        self.unload();
      },
      error: function() {
        // Alert the UI.
        Messenger().post({
          message: 'Error creating an account',
          type: 'error',
          hideAfter: 2,
          hideOnNavigate: false,
          showCloseButton: false
        });
      }
    });

  },
  show: function(evt) {
    this.$el.find('.modal').modal('show').removeClass('hide').removeClass('fade');
  },
  afterRender: function() {
    var self = this;

    // Attach to the body.
    self.$el.appendTo("body");

    // Set the Unload for for the modal.
    self.$el.find('.modal').on('hidden.bs.modal', function () {
      self.unload();
    });

    self.show();

  }
});
