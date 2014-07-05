module.exports = {

	presentView:function(view) {
		window.scrollTo(0, 0);
		this.$removeCurrentView();

    $('#main-content').html('');

    view.render();

    view.$el.appendTo($('#main-content'));

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
