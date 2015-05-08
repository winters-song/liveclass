define([
	'jquery',
	'underscore',
	'common',
	'text!templates/header.html',
	'text!templates/profiles.html',
	'text!templates/actionButton.html',
	'ezpz_hint',
	'easing',
  'moment',
  'touchSwipe'
],function ($, _, Common, headerTpl, profilesTpl, actionButtonTpl) {
	
  'use strict';

	var HeaderView = function(cfg){
		var me = this;

		$.extend(me, cfg);

		me.render();
		me.checkLogin();
		me.initEvents();
	};

	HeaderView.prototype = {

		checkLoginUrl: '/user/checkLogin',

		checkAdminUrl: '/admin/home/checkLogin',
		
		teacherApplyUrl: '/user/teacher/checkTeacher',

		bulletinUrl: '/Course/Admin/query_bulletin',

		render: function(){
			var me = this;

			me.$el = $('.page-top');

			var tpl = _.template(headerTpl);
			var fragment = tpl(Common.lang);
			
			me.$el.html(fragment);

			me.$search = $('#search-box', me.$el);

			me.$lang = $('#lang-btn .dropdown-menu a', me.$el);

			me.$nav = $('#navigation', me.$el);

			me.$login = $('#login', me.$el);
			
			me.$profiles = $('#profiles', me.$el);

			me.$navMask = $('<div id="nav-mask" class="global-mask dark">');
			me.$el.after(me.$navMask);

			me.showMaintenance();
		},

		showMaintenance: function(){
			var me = this;

			var $before_maintenance = $('#before_maintenance');

			$.ajax({
				url: me.bulletinUrl,
				dataType: 'json',
				cache: false
			}).done(function(data){

				$(Common).triggerHandler('bulletin', data);
				
				if(data && data.status == 1){
					var date = new Date(data.date);

					var text = _.template(Common.lang.before_maintenance, {
					  date: moment(date).format(Common.dateFormat),
					  hour: data.duration
					});

					Common.maintenance = {
						date : date,
						hour : data.duration,
						msg : text
					};

					$before_maintenance.find('strong').text(text);

					setTimeout(function(){
					  $before_maintenance.slideDown();
					}, 500);
				}
			});
		},

		initNavigation: function(){
			var me = this;

			var type = $.cookie('user-role') || 'teacher';

			if(type == 'teacher'){
				me.$nav.find('.li-student').remove();
				me.initFloatAction();
			}else{
				me.$nav.find('.li-teacher').remove();
			}
			
			$('#role-teacher', me.$el).on('click', function(){
				$.cookie('user-role', 'teacher');
				window.location.href = '/Public/myClass_t.html';
			});
			$('#role-student', me.$el).on('click', function(){
				$.cookie('user-role', 'student');
				window.location.href = '/Public/myClass.html';
			});

			var $navbar = $('#navbar', me.$el);
			var $myNavbar = $('#sencond-navbar', me.$el);
			var $myNav = $('#role-navbar', $myNavbar);

			function resize(){
				if(window.outerWidth > 768){
					$myNav.appendTo($myNavbar);
				}else{
					$myNav.appendTo($navbar);
				}
			}

			$(window).on('resize', resize);
			resize();
		},

		initFloatAction: function(){
			var me = this;

			var html = _.template(actionButtonTpl, Common.lang);
			var $html = $(html);
			me.$el.after($html);
			var $mask = $('<div id="global-add-mask" class="global-mask light">');
			me.$el.after($mask);

			var $dropdown = $('.float-action-box', $html);

			$dropdown.hover(function(){
				if(window.outerWidth > 768){
					$(this).addClass('open').trigger('shown.bs.dropdown');
				}
			},function(){
				if(window.outerWidth > 768){
					$(this).removeClass('open').trigger('hidden.bs.dropdown');
				}
			});
			
			$dropdown
			.on('shown.bs.dropdown', function () {
			  $mask.addClass('open');
			})
			.on('hidden.bs.dropdown', function () {
			  $mask.removeClass('open');
			});

			function resize(){
				if(window.outerWidth > 768){
					if($dropdown.hasClass('dropup')){
						$dropdown.removeClass('dropup').addClass('dropdown');
					}
				}else{
					if($dropdown.hasClass('dropdown')){
						$dropdown.removeClass('dropdown').addClass('dropup');
					}
				}
			}

			$(window).on('resize', resize);
			resize();
		},

		checkLogin: function(){
			var me = this;

			var url = me.checkLoginUrl;

			if(Common.hashData.admin){
				url = me.checkAdminUrl;
			}

			var json = $.ajax({
				url: url,
				async: false,
				cache: false,
				dataType: 'json'
			}).responseJSON;

			if(json && json.success){
				me.loginSuccess(json);
			}else{
				me.$login.removeClass('hidden');
				$('#login-btn', me.$login).attr('href', Common.getLoginUrl());
				$('#register-btn', me.$login).attr('href', Common.regUrl);

				me.$profiles.remove();
				me.$nav.remove();
			}
			
		},

		loginSuccess: function(json){
			var me = this;

			$.extend(json, {
				account: Common.lang.account,
				sign_out: Common.lang.sign_out
			});

			if(Common.hashData.admin){

				$.extend(json, {
					ID: 0,
					NickName: json.username,
					Avatar: '/Public/img/visitor_medium.gif',
					teacher: false
				});

				$.extend(Common, {
					loginState 		: true,
					isAdmin				: true,
					isTeacher 		: true,
					isOrgTeacher 	: false,
					isCIOTeacher	: false,
					teacherApply 	: false,
					CLASS_MAX_SIZE: 0,
					userInfo 			: {
						NickName: json
					}
				});

			}else{
				$.extend(Common, {
					loginState 		: true,
					isAdmin				: false,
					isTeacher 		: json.teacher,
					isOrgTeacher 	: json.org_teacher,
					isCIOTeacher	: !json.org_teacher,
					teacherApply 	: json.teacher_apply,
					CLASS_MAX_SIZE: json.class_max_size || 0,
					userInfo 			: json
				});
			}

			$('body').addClass('logged');
			me.$login.remove();
			me.$nav.removeClass('hidden');
			me.$profiles.removeClass('hidden');

			var tpl = _.template(profilesTpl);

			var fragment = tpl(json);

			me.$profiles.html(fragment);

			if(Common.isTeacher){
				me.initNavigation();
			}else{
				$('.li-teacher', me.$nav).remove();
				$('#role-btn', me.$nav).remove();
			}
		},

		initEvents: function(){
			var me = this;

			var $navbar = $('#navbar', me.$el);
			var $navBtn = $('#nav-btn', me.$el);

			$navBtn.on('click', function(){
				$navbar.addClass('open');
				me.$navMask.addClass('open');
			});
			me.$navMask.on('click', function(){
				$navbar.removeClass('open');
				me.$navMask.removeClass('open');
			});

			$("body").swipe({
        swipeRight: function(event, direction, distance, duration, fingerCount) {
        	if(window.outerWidth < 768){
	          $navbar.addClass('open');
						me.$navMask.addClass('open');
					}
        },
        swipeLeft: function(event, direction, distance, duration, fingerCount) {
        	if(window.outerWidth < 768){
	          $navbar.removeClass('open');
						me.$navMask.removeClass('open');
					}
        }
        //Default is 75px, set to 0 for demo so any distance triggers swipe
        // threshold:0
      });


			me.$lang.on('click', me, me.setLanguage);

			$('#role-navbar>li', me.$nav).each(function(){
				var tab = $(this).data('tab');
				if(tab == me.activeTab){
					$(this).addClass('active');
				}
			});

			//dropdown menu animation
			$('.dropdown', me.$el).hover(function(){
				if(window.outerWidth >= 768){
					$(this).addClass('open').trigger('shown.bs.dropdown');
				}
			},function(){
				if(window.outerWidth >= 768){
					$(this).removeClass('open').trigger('hidden.bs.dropdown');
				}
			});

			

			$('#global-search-btn', me.$el).on('click', function(){
				$('#global-search input', me.$el).toggleClass('open').focus();
			});

		},

    setLanguage: function(e){
			e.preventDefault();

			var lang = $(this).data('label');
			
			$.cookie('lang', lang);

			var url = window.location.href;
			var regex = /lang=\w+/;
			if(regex.test(url)){
				url = url.replace(/lang=\w+/, '');
				window.location.href = url;
			}else{
				window.location.reload();
			}
			
    }
	};

	return HeaderView;
    
});