define([
	'jquery',
  'underscore',
	'common'
], function ($, _, Common) {

	'use strict';

	return {

		addEvents: function(){
			var me = this;

			$(Common).on('msg', me, me.showMsg);
			$(Common).on('state', me, me.renderState);
			$(Common).on('goNext', me, me.goNext);
			$(Common).on('goPrev', me, me.goPrev);
      $(Common).on('toggle', me, me.toggle);
			$(Common).on('submit', me, me.submit);
		},

		render: function(){
			var me = this;

			me.$el = $('#main');
			me.$pages = $('#wizzard', me.$el);
			me.$nav = $('#wizzard-nav', me.$el);
			
      me.translate();
			// $(window).on('beforeunload', Common.onBeforeUnload);
		},

		showMsg: function(msg){
      bootbox.alert(msg);
    },

    isLastPage: function(){
      return Common.currentView.id == Common.lastPage;
    },

    goNext: function(e){
      e.preventDefault();

      var me = e.data;

      if(Common.currentView.validate()){
        var values = Common.currentView.getValues();
        console.log(values);
        $.extend(Common.info, values);
        me.navigationView.goNext();
      }
    },

    goPrev: function(e){
      e.preventDefault();

      var me = e.data;

      var nav = me.navigationView;

      if(nav.isDone()){

        var current = Common.currentView;

        if(!me.isLastPage()){
          
          if(current.validate()){
            var values = current.getValues();
            $.extend(Common.info, values);
            nav.goPrev();
          }
          return;
        }
      }
      nav.goPrev();
    },

    toggle: function(e, name){

      var me = e.data;

      var nav = me.navigationView;

      if(nav.isDone()){

        var current = Common.currentView;

        if(!me.isLastPage()){

          if(current.validate()){
            var values = current.getValues();

            $.extend(Common.info, values);
            nav.goTo(name);
          }
          return;
        }
      }
      nav.goTo(name);
    },

    /**
     * Implement renderState
     */

    /**
     * Implement submit
     */
	};
});