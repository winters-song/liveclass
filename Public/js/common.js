define([
	'jquery',
	'cookie',
	'queryString',
	'bootbox'
], function ($) {

	'use strict';

	return {

		version: '1.3.150324',

		title: '在线课堂 - Live Class | 网络孔子学院, 学习汉语, 体验文化 - Confucius Institute Online, Learning Chinese, Experiencing Culture',

		isAdmin	 			: false,
		isTeacher 		: false,
		isOrgTeacher 	: false,
		isCIOTeacher	: false,
		teacherApply 	: false,
		userInfo 			: {},

		langUrl: './js/lang/',

		loginUrl: '/user/ssologin?from_url=',
		
		regUrl: 'http://www.chinesecio.com/join.php',
		profileUrl: 'http://www.chinesecio.com/member.php',
		
		userLink: 'http://www.chinesecio.com/', // + nickname
		profileLink: '/Public/profile.html?id=', // + teacher id
		teacherClassLink: '/Public/classes.html?teacher_id=', // + teacher id
		teacherSeriesLink: '/Public/series.html?teacher_id=', // + teacher id
		classDetailsLink: '/Public/classInfo.html?id=', // + class id
		tapedDetailsLink: '/Public/tapedInfo.html?id=', // + class id
		seriesDetailsLink: '/Public/seriesInfo.html?id=', // + series id

		cookieDomain: '.chinesecio.com',

		dateFormat: 'YYYY/MM/DD HH:mm',

		api: {
			teacherInfoUrl: '/user/teacher/info',
			guessUrl: '/Course/Recommend/Curl_Get_Recommend'
		},

		SEAT_NUM: 51,

		//开启回放功能
		replayEnabled: true,

		loginState: false,

		alert: function(msg){
			bootbox.alert(msg);
		},

		getLoginUrl: function(){
			return this.loginUrl + window.location.href;
		},

		setTitle: function(title){
			$('title').text(title + ' | ' + this.title);
		},
		
		initLocale: function(){

			console.log('Live Class v' + this.version);

			var hash = window.location.href;
		  this.hashData = hash.queryStringToJSON();
		  var lang = this.hashData.lang;

		  //remove cookie of old version
		  $.removeCookie('lang', { path: '/Public' });

		  $.cookie.defaults.domain = this.cookieDomain;
		  $.cookie.defaults.path = '/';

		  var orig = $.cookie('lang');

		  if(lang){
		  	$.cookie('lang', lang);
		  }else{

		  	var nav_lang = navigator.language || navigator.browserLanguage;
		  	var defaults = ['cn', 'ja', 'ru', 'ko', 'es', 'en', 'fr'];
		  	if(orig){
		  		lang = orig;
		  	}else if(/zh/.test(nav_lang)){
		  		lang = 'cn';
		  	}else if (/fr/.test(nav_lang)){
		  		lang = 'fr';
		  	}else if (/ru/.test(nav_lang)){
		  		lang = 'ru';
		  	}else if (/es/.test(nav_lang)){
		  		lang = 'es';
		  	}else if (/ko/.test(nav_lang)){
		  		lang = 'ko';
		  	}else if (nav_lang == 'ja'){
		  		lang = 'ja';
		  	}else{
		  		lang = 'en';
		  	}
		  	
		  	$.cookie('lang', lang);
		  }

		  var json = $.ajax({
		    url: this.langUrl + lang + '.json?v='+ this.version,
		    async: false,
		    cache: window.devMode == 'pro',
		    dataType: 'json'
		  }).responseJSON; 

		  if(json){
		  	this.language = lang;
		  	
		    this.lang = json;
		    this.lang.l = lang;

		    $('html').addClass(lang);

		    if(lang == 'cn'){
		    	lang = 'zh_CN';
		    }

		    bootbox.setDefaults({
  				locale: lang
  			});

		  }else{
		  	console.warn('Not found Locale Package');
		  }

		},

		timestampToString: function(timestamp){
      var date = new Date(timestamp*1);

      var month = date.getMonth() + 1;
      var day = date.getDate();
      month = month < 10 ? '0'+ month : month;
      day = day < 10 ? '0'+ day : day;
      return '' + date.getFullYear() + '-' + month + '-' + day;
    },

    getTeacherStar: function(data, target, id){

    	var value = data.teacher_level + '';
    	var score_int, score_float;

    	if(value){
    		score_int = parseInt(value);
				var arr = value.split('.');
				score_float = '.0';
				if(arr.length>1){
					score_float = '.' + arr[1][0];
				}
    	}else{
    		score_int = 0;
    		score_float = '.0';
    	}

			$.extend(target, {
				teacher_level: data.teacher_level,
				teacher_star: data.paragon ||'',
				score_int: score_int,
				score_float: score_float
			});
    }
	};

});