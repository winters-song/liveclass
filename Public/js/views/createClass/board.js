define([
	'jquery',
	'underscore',
  'common',
  'views/mixins/wizard',
	'views/createClass/navigation',
  'views/createClass/basics',
  'views/createClass/courseware',
	// 'views/createClass/student',
	'pagingBar',
	'easing',
	'vgrid',
  'models/Class',
  'models/Courseware'
],function ($, _, Common, Wizard, NavigationView, BasicView, CoursewareView  ) {

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
        lastPage: 'page-courseware'  // 'page-student'
      });

      $.extend(Common.api, {
        selectedCoursewareUrl: '/Api/Webservice/get_courseware',
        emailUrl: '/Course/Index/mail_send1'
        // studentUrl:   '/user/profiles/student',
        // groupListUrl: '/user/groups/mygroups',
        // saveGroupUrl: '/user/groups/saveGroup',
        // selectedStudentUrl: '/user/profiles/getById',
      });

      Common.info = {};

      Common.validateStartdate = function(date){
        var str = date.toUTCString();

        var json = $.ajax({
          url: '/Course/Index/checkTime',
          data: $.param({
            date: str
          }),
          async: false,
          cache:false,
          dataType: 'json'
        }).responseJSON;

        return json && json.success;
      };

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

			me.addEvents();
		},

    translate: function(){
      var title = Common.lang.create_a_class;
      if(Common.pageType == 'edit'){
        title = Common.lang.edit_class_info;
      }
      $('#page-title').html(title + ' (' + Common.lang.live_classes + ')');
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

          case 'coursewares': 
            view = new CoursewareView();
            break;

          //@mark
          // case 'students': 
          //   view = new StudentView();
          //   break;
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

      me.xhr && me.xhr.abort();

      $(el).button('loading');

      $.extend(Common.info, lastPage.getValues());

      var values = Common.info;

      var url = Common.api.classAddUrl;

      if(Common.pageType == 'edit'){
        url = Common.api.classEditUrl;
        values.id =Common.classId;

        // @mark
        // var student = values.userid ? values.userid.split(',') : [];
        // var orig_student = Common.orig_info.userid ? Common.orig_info.userid.split(',') : [];
        // var del_student = _.difference(orig_student, student);
        // values.del_student = del_student.join(',');

        var courseware_id = values.courseware_id ? values.courseware_id.split(',') : [];
        var orig_courseware_id = Common.orig_info.courseware_id ? Common.orig_info.courseware_id.split(',') : [];
        var del_courseware_id = _.difference(orig_courseware_id, courseware_id);
        values.del_courseware_id = del_courseware_id.join(',');
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
          // $(window).off('beforeunload', Common.onBeforeUnload);
          window.location.href = 'myClass_t.html';
        }else{
          $(el).button('reset');
          
          if(Common.pageType == 'edit'){
            bootbox.alert(Common.lang.edit_class_failed);
          }else{
            bootbox.alert(Common.lang.create_class_failed);
          }
        }

      }).fail(function(){
        $(el).button('reset');
      });
      
    }
	};

	return BoardView;
    
});