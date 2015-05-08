define([
	'jquery',
	'underscore',
	'common'
],function ($, _, Common) {

	'use strict';
    
	var RecommendLecturerView = function(){
		this.render();
	};

	RecommendLecturerView.prototype = {

		limit: 8,

		render: function(){
			var me = this;
			me.$el = $('#recommend-lecturer');
			me.$title = $('.title a', me.$el);
			me.$list = $('.item-list', me.$el);
			me.$more = $('.more-link', me.$el);

			me.$tpl = $('#lecturerTpl').html();

			me.tpl = _.template(me.$tpl);

			me.$title.html(Common.lang.recommend_lecturer);
			me.$more.html(Common.lang.more);

			$.ajax({
				url: Common.api.recommendTeacherUrl,
				async: true,
				cache: false,
				dataType: 'json',
				data: $.param({
					start: 0,
					limit:me.limit
				}),
				context: me
			}).done(function(data){
				if(data && data.list){
					this.initList(data.list);
				}
			});
		},

		initList: function(data){
			var me = this;

			var html = '';

			_.each(data, function(i){

				i.t_name = i.realname || i.name;
				i.teacher_class_link = Common.profileLink + i.id;

				i.gold_teacher = Common.lang.gold_teacher;
				i.silver_teacher = Common.lang.silver_teacher;

				Common.getTeacherStar(i,i,i.id);
				
				html += me.tpl(i);
			});

			me.$list.append(html);
		}
	};

	return RecommendLecturerView;
    
});