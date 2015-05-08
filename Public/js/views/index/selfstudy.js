define([
	'jquery',
	'underscore',
	'common'
],function ($, _, Common) {

	'use strict';
    
	var SelfstudyView = function(){
		this.render();
		this.initEvents();
	};

	SelfstudyView.prototype = {

		limit: 8,

		render: function(){
			var me = this;
			me.$el = $('#selfstudy');
			me.$title = $('.title a', me.$el);
			me.$list = $('.item-list', me.$el);
			me.$more = $('.more-link', me.$el);

			var html = $("#selfstudyTpl").html();
			me.tpl = _.template(html);

			me.$title.html(Common.lang.featured_courses);
			me.$more.html(Common.lang.more);

			me.renderPage();
		},

		initEvents: function(){
			var me = this;
			$(me).on('repaint', me, me.repaint);
		},

		renderPage: function(){

			var me = this;

			me.$list.empty();

			$.ajax({
				url: Common.api.selfstudyUrl,
				async: true,
				cache: false,
				data: $.param({
					state: 1,
					order:'asc',
					start: 0,
					limit: me.limit
				}),
				dataType: 'json',
				context: me
			}).done(function(data){
				if(data && data.length){
					me.$el.show();
					me.collection = data;
					this.initList(data);
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

	return SelfstudyView;
    
});