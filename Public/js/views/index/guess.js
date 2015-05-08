define([
	'jquery',
	'underscore',
	'text!templates/class/recommendClass.html',
	'text!templates/class/recommendLesson.html',
	'text!templates/class/recommendCourse.html',
	'common',
	'moment'
],function ($, _, classTpl, lessonTpl, courseTpl, Common) {

	'use strict';
    
	var GuessView = function(){
		this.render();
		this.initEvents();
	};

	GuessView.prototype = {

		page : 1,

		render: function(){
			var me = this;
			me.$el = $('#guess');

			var tpl = $('#guessTpl').html();

			me.$el.html(_.template(tpl, Common.lang));
			me.$title = $('.title a', me.$el);
			me.$list = $('.item-list', me.$el);
			me.$nav = $('.nav li', me.$el);
			me.$more = $('.more-link', me.$el);

			var class_tpl = _.template(classTpl);
			var lesson_tpl = _.template(lessonTpl);
			var course_tpl = _.template(courseTpl);

			me.api = {
				'preclass' : {
					tpl : class_tpl,
					limit: 6
				},
				'class' : {
					tpl : class_tpl,
					limit: 6
				},
				'lesson' : {
					tpl : lesson_tpl,
					limit: 10
				},
				'course' : {
					tpl : course_tpl,
					limit: 7
				}
			};

			// me.$title.html(Common.lang.upcoming_class);
			// me.$more.html(Common.lang.more);
			me.setActive(0);
		},

		preprocess: function(type, i){
			var me = this;

			if(type == 'class' || type == 'preclass'){
				i.tscore = i.tscore+'' || '';
				var arr = i.tscore.split('.');
				var score_int = arr[0];
				var score_float = arr.length>1? arr[1][0] : 0;
				var datetime = i.starttime.split('-');

				$.extend(i, {
					class_link : Common.classDetailsLink + i.nid,
					user_link: Common.profileLink + i.tid,
					lecturer_realname : i.tname || '',
					time : datetime[1],
					date : datetime[0],
					score_int : score_int,
					score_float : '.' + score_float
				});
			} 		
			
			return i;
		},

		setActive: function(index){
			var me = this;
			var el;

			me.$nav.removeClass('active');

			if($.isNumeric(index)){
				el = me.$nav.eq(index).addClass('active');
			}else{
				el = $(index).parent();
			}

			me.currentType = el.data('type');

			me.page = 1;

			me.renderPage();
		},

		initEvents: function(){
			var me = this;

			me.$nav.find('a').on('click', me, function(e){
				e.preventDefault();
				e.data.setActive($(this));
			});

			$(me).on('repaint', me, me.repaint);

			me.$more.on('click', me, function(e){
				e.preventDefault();
				e.data.page++;
				e.data.renderPage();
			});

			var $navbar = $('.nav', me.$el);

			function resize(){
				if(window.outerWidth > 768){
					$navbar.removeClass('dropdown-menu');
				}else{
					$navbar.addClass('dropdown-menu');
				}
			}

			$(window).on('resize', resize);
			resize();
		},

		renderPage: function(page){
			var me = this;

			me.$list.empty();

			var uid = Common.userInfo.ID;
			var type = me.currentType;
			var limit = me.api[me.currentType].limit;
			var start = (me.page - 1) * limit + 1;

			if(window.devMode == 'dev'){
				Common.api.guessUrl = '/Public/proxy/guess_'+type+ '.json';
			}

			$.ajax({
				url: Common.api.guessUrl,
				data: $.param({
					role: 'user',
					id: uid,
					type: type,
					start: start,
					limit: limit
				}),
				async: true,
				cache: false,
				dataType: 'json',
				context: me
			}).done(function(data){
				if(data && data.list){
					this.collection = data.list;
					this.initList(data.list);
				}
			}).fail(function(e){
				console.warn('推荐数据请求失败', e);
			});

		},

		initList: function(data){
			var me = this;

			var html = '';

			var tpl = me.api[me.currentType].tpl;

			_.each(data, function(i){
				var json = me.preprocess(me.currentType, i);
				html += tpl(json);
			});

			me.$list.append(html);
		}
	};

	return GuessView;
    
});