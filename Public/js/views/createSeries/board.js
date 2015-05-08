define([
	'jquery',
	'underscore',
	'common',
  'views/mixins/wizard',
  'views/createSeries/navigation',
  'views/createSeries/basics',
  'views/createSeries/cover',
  'views/createSeries/classes',
	'pagingBar',
	'easing',
	'vgrid',
  'models/Series'
],function ($, _, Common, Wizard, NavigationView, BasicView, CoverView, ClassesView) {

  'use strict';
    
	var BoardView = function(){
    $.extend(this, Wizard);
		this.initialize();
		this.render();	
    
    this.navigationView = new NavigationView({
      $el: this.$nav
    });
	};

	BoardView.prototype = {

		initialize: function(){
			var me = this;

      $.extend(Common, {
        lastPage: 'page-classes'
      });

      if(Common.isAdmin){
        $.extend(Common.api, Common.api.admin);
      }

      Common.info = {};

      if(Common.pageType == 'edit'){
        var json = $.ajax({
          url: Common.api.seriesInfoUrl,
          data: $.param({
            id: Common.seriesId
          }),
          async: false,
          cache:false,
          dataType:'json'
        }).responseJSON;

       Common.info = json;
       Common.orig_info = _.clone(json);
      }

      me.addEvents();
		},

    translate: function(){
      var title = Common.lang.create_series;
      if(Common.pageType == 'edit'){
        title = Common.lang.edit_series_info;
      }
      $('#page-title').text(title);
      Common.setTitle(title);
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

          case 'cover': 
            view = new CoverView();
            break;

          case 'classes': 
            view = new ClassesView();
            break;
        }

        Common.pageList[name] = view;
        if(view){
          view.$el.fadeIn();
        }
      }

      Common.currentView = view;
    },

    submit: function(e, lastPage, el){

      var me = e.data;

      if(!lastPage.validate()){
        return;
      }

      me.xhr && me.xhr.abort();
      el.button('loading');

      $.extend(Common.info, lastPage.getValues());

      var values = Common.info;

      var url = Common.api.seriesAddUrl;

      if(Common.pageType == 'edit'){
        url = Common.api.seriesEditUrl;
        values.id = Common.seriesId;
      }

      var params = $.param(values);

      me.xhr = $.ajax({
        url: url,
        cache: false,
        type: 'post',
        data: params,
        dataType: 'json'
      }).done(function(data){

        if(data&& data.success){
          var sid;
          if(Common.pageType == 'edit'){
            sid = Common.seriesId;
          }else{
            sid = data.sid;
          }

          var url = 'seriesInfo.html?id=' + sid
          if(Common.isAdmin){
            window.location.href = url + '&admin=1';
          }else{
            window.location.href = url;
          }
          
        }else{
          el.button('reset');
          
          if(Common.pageType == 'edit'){
            bootbox.alert(Common.lang.edit_series_failed);
          }else{
            bootbox.alert(Common.lang.create_series_failed);
          }
        }

      }).fail(function(){
        $(el).button('reset');
      });
      
    }
	};

	return BoardView;
    
});