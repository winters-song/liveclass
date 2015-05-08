define([
	'jquery',
	'underscore',
	'common',
	'views/series/base',
	'text!templates/series/seriesItem.html'
],function ($, _, Common, Base, itemTpl) {

	'use strict';
    
	var SeriesView = function(){
		$.extend(this, Base);
		this.render();
	};

	SeriesView.prototype = {

		render: function(){
			var me = this;
			me.$el = $('#series');
			me.$title = $('.title a', me.$el);
			me.$list = $('.item-list', me.$el);
			me.$more = $('.more-link', me.$el);

			me.tpl = _.template(itemTpl);

			me.$title.html(Common.lang.recommend_series);
			me.$more.html(Common.lang.more);

			$.ajax({
				url: Common.api.seriesUrl,
				data: $.param({
					start: 0,
					limit: 3
				}),
				async: true,
				cache: false,
				dataType: 'json',
				context: me
			}).done(function(data){
				if(data && data.list){
					this.initList(data.list);
					this.$el.show();
				}
			});
		},

		initList: function(data){
			var me = this;

			var html = '';

			_.each(data, function(i){
				var json = me.preprocess(i);
				html += me.tpl(json);
			});

			me.$list.html(html);
		}
	};

	return SeriesView;
    
});