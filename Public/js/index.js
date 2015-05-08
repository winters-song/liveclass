
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

    rslide: {
      deps: ['jquery']
    },
    slider:{
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

    rslide: 'libs/responsive_slides/responsiveslides.min',
    slider: 'libs/utils/Slider'
  }
});

require([
	'jquery',
	'underscore',
  'common',
	'views/header',
	'views/footer',
	'views/index/categoryBar',
	'views/index/slider',
  'views/index/guess',
  'views/index/recommendLecturer',
	'views/index/series',
  'views/index/upcoming',
	'views/index/selfstudy',
	// 'views/index/lecturerStar',
  'views/index/partners',
	'views/index/schools',
	'bootstrap'
],function($, _, Common, HeaderView, FooterView, 
  CategoryBar, 
  SliderView, 
  GuessView,
  RecommendLecturerView, 
  SeriesView,
  UpcomingView, 
  SelfstudyView, 
  PartnersView, 
  SchoolsView
  ){

  'use strict';

	Common.initLocale();

  $.extend(Common.api, {
    slideUrl: '/User/Recommend/lists',
    pushUrl: '/Course/Admin/push_class_list',
    seriesUrl: '/Course/Series/recommendSeriesList',
    upcomingUrl: '/Course/Index/querylist_index',
    selfstudyUrl: '/Course/Forward/selfstudy',
    recommendTeacherUrl: '/user/teacher/recommendTeacher',
    starTeacherUrl: '/user/teacher/starTeacher',
    orgListUrl: '/user/org/lists',
    schoolListUrl: '/user/org/school'
  });

  $(Common).on('bulletin', function(e, data){
    if(data && data.recommend == 1){
      $('#guess').removeClass('hidden');
    }
  });
  
	new HeaderView({
    activeTab : 'home'
  });
	new FooterView();  
  new CategoryBar();
	new SliderView();
  new GuessView();
  // new LecturerStarView();
  new RecommendLecturerView();
  
	new SeriesView();
  
  new UpcomingView();
	new SelfstudyView();
	
  new PartnersView();
	new SchoolsView();

  //browser msg
  var b = BrowserDetect;
  if(b.browser == 'Explorer' ){
    var html = $('#browserTpl').html();
    html = _.template(html, Common.lang);
    var $html = $(html);
    $html.prependTo($('body'), true).hide().slideDown('slow');
  }

});
