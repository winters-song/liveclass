define([
	'jquery',
	'underscore',
  'common',
  'views/createTaped/basics',
  'models/Class'
],function ($, _, Common, BasicView  ) {

  'use strict';
    
	var BoardView = function(){
		this.initialize();
		this.render();	
    this.renderState(null, 'basics');
	};

	BoardView.prototype = {

		initialize: function(){
			var me = this;

      Common.info = {};

      if(Common.pageType == 'edit'){
        var json = $.ajax({
          url: Common.api.classInfoUrl,
          data: $.param({
            id: Common.classId
          }),
          async: false,
          cache:false,
          dataType:'json'
        }).responseJSON;

        Common.info = json;
        Common.orig_info = _.clone(json);
      }

		},

    render: function(){
      var me = this;

      me.$el = $('#main');
      me.$pages = $('#wizzard', me.$el);
      me.translate();
    },

    translate: function(){
      var title = Common.lang.create_a_class;
      if(Common.pageType == 'edit'){
        title = Common.lang.edit_class_info;
      }
      $('#page-title').text(title + ' (' + Common.lang.taped_class + ')');
      Common.setTitle(title)
    },

		renderState: function(e, name){

      if(Common.currentView){
        Common.currentView.$el.hide();
      }

      var view;

      if(Common.pageList[name]){

        view = Common.pageList[name];
        view.$el.fadeIn();

      }else{

        switch(name){
          case 'basics': 
            view = new BasicView();
            break;
        }

        Common.pageList[name] = view;
        if(view){
          view.$el.fadeIn();
        }
      }

      Common.currentView = view;
    }
    
	};

	return BoardView;
    
});