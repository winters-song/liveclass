define([
	'jquery',
	'underscore',
	'common'
],function ($, _, Common) {

	'use strict';
    
	var LecturerStarView = function(){
		this.render();
	};

	LecturerStarView.prototype = {

		limit: 3,

		render: function(){
			var me = this;
			me.$el = $('#lecturer-star');
			me.$title = $('.title', me.$el);
			me.$list = $('.item-list', me.$el);

			me.$tpl = $('#lecturerTpl').html();

			me.tpl = _.template(me.$tpl);

			me.$title.html(Common.lang.lecturer_star);

			$.ajax({
				url: Common.api.starTeacherUrl,
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
				html += me.tpl(i);
			});

			me.$list.append(html);

		}
	};

	return LecturerStarView;
    
});