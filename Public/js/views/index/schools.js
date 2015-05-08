define([
	'jquery',
	'underscore',
	'common'
],function ($, _, Common) {

	'use strict';
    
	var SchoolsView = function(){
		this.render();
	};

	SchoolsView.prototype = {

		render: function(){
			var me = this;

			me.$el = $('#schools');
			me.$title = $('.title', me.$el);
			me.$btn = $('.btn', me.$el);
			me.$list = $('.item-list ul', me.$el);

			me.$title.text(Common.lang.schools);

			me.$tpl = $('#schoolTpl').html();

			$.ajax({
				url: Common.api.schoolListUrl,
				async: true,
				cache: false,
				dataType: 'json',
				data: $.param({
					start: 0,
					limit: 8
				}),
				context: me
			}).done(function(data){
				if(data && data.length){
					this.initList(data);
					this.initEvents();
				}
			});
		},

		initList: function(data){
			var me = this;

			var html = '';

			var tpl = _.template(me.$tpl);

			_.each(data, function(i){
				html += tpl(i);
			});

			me.$list.append(html);

		},

		initEvents: function(){
			var me = this;
		}
	};

	return SchoolsView;
    
});