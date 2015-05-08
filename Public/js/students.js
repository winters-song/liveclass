
require.config({
  baseUrl:'./js',

  shim: {
    touchSwipe: {
      deps: ['jquery']
    },
    underscore: {
      deps: ['jquery'],
      exports: '_'
    },
    bootstrap: {
      deps: ['jquery'],
      exports: '$.fn.popover'
    },
    easing:{
      deps: ['jquery']
    },
    ezpz_hint:{
      deps: ['jquery']
    },
    bootbox: {
      deps: ['bootstrap'],
      exports: 'bootbox'
    },

    jquery_ui: {
      deps: ['jquery']
    },
    pagingBar:{
      deps: ['jquery']
    },
    vgrid:{
      deps: ['jquery']
    },
    history:{
      deps: ['jquery']
    },
    nano: {
      deps: ['jquery']
    }
  },

  paths: {
    touchSwipe: 'libs/jquery/jquery.touchSwipe.min',
    text: 'libs/require/text',
    jquery: 'libs/jquery/jquery-1.11.0.min',
    underscore: 'libs/underscore/underscore-min',
    cookie: 'libs/jquery/jquery.cookie',
    bootstrap : 'libs/bootstrap/js/bootstrap.min',
    bootbox: 'libs/bootbox/bootbox.min',
    queryString: 'libs/utils/queryString',
    easing: 'libs/jquery/jquery-easing-1.3',
    ezpz_hint: 'libs/jquery/jquery.ezpz_hint',
    moment: 'libs/utils/moment.min',

    jquery_ui: 'libs/jquery/jquery-ui.min',
    history: 'libs/jquery/jquery.history',
    vgrid: 'libs/jquery/jquery.vgrid.min',
    pagingBar: 'libs/utils/PagingBar',
    nano: 'libs/jquery/jquery.nano'
  }
});

require([
  'jquery',
  'underscore',
	'views/header',
  'views/footer',
  'views/mixins/history',
  'views/teacher/student',
	'common',
  'bootstrap',
  'history'
], function($, _, HeaderView, FooterView, historyUtil, BoardView, Common){

  'use strict';

	Common.initLocale();

  $.extend(Common, historyUtil, {
    addGroupUrl: '/user/groups/addGroup',
    editGroupUrl: '/user/groups/edit',
    removeGroupUrl: '/user/groups/remove',
    sortUrl: '/user/groups/sort',
    groupListUrl: '/user/groups/mygroups',
    inGroupsUrl: '/user/groups/inGroups',
    addUserUrl: '/user/groups/addUser',
    delUserUrl: '/user/groups/delUser',
    listUrl: '/user/profiles/student',

    ellipsis: function(v){
      if(v.length > 20){
        return v.substr(0,17) + '...';
      }
      return v;
    }
  });

	new HeaderView({
    activeTab : 'students'
  });
  new FooterView();

  if(!Common.loginState){
    window.location.href = Common.getLoginUrl();
  }else if(!Common.isTeacher){
    window.location.href = 'lectureRegister.html';
  }

  var boardView = new BoardView();

  var params = [
    'display_name', 
    'group'
  ];

  Common.initPage(boardView, params);

});
