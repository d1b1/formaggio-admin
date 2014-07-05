module.exports = {

	presentView:function(view) {
		window.scrollTo(0, 0);
		this.$removeCurrentView();

    $('#main-content').html('');

    view.render();

    // This is only used when we do not define
		// the attachment point. Need to figure a better
		// way to handle this. Want to be able to
		// let view options determine when needed.

    // view.$el.appendTo($('#main-content'));

		this.$currentView = view;
	},

	$removeCurrentView:function() {
		if(this.$currentView) {

			if(typeof this.$currentView.unload == 'function') {
				this.$currentView.unload();
			}
			else {
				this.$currentView.undelegateEvents();
				this.$currentView.$el.removeData().unbind();
				this.$currentView.remove();
			}
		}

	}

};
