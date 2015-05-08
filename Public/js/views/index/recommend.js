define([
	'jquery',
	'underscore',
	'text!templates/reviewItem.html',
	'common'
],function ($, _, itemTpl, Common) {

	'use strict';
    
	var RecommendView = function(){
		this.render();
	};

	RecommendView.prototype = {

		render: function(){
			var me = this;
			me.$el = $('#recommend');
			me.$title = $('.title', me.$el);
			me.$list = $('.item-list', me.$el);

			me.tpl = _.template(itemTpl);

			me.$title.html(Common.lang.recommend_course);

			$.ajax({
				url: 'proxy/recommend.json',
				async: true,
				cache: false,
				dataType: 'json',
				context: me
			}).done(function(data){
				if(data && data.length){
					this.initList(data);
				}
			});
		},

		translate: function(json){
      json.enter = Common.lang.enter;
      json.hours = Common.lang.hours;
      json.date_text = Common.lang.date;
      json.lesson = Common.lang.lesson;
      return json;
    },

		initList: function(data){
			var me = this;

			var html = '';

			_.each(data, function(i){
				var json = me.translate(i);
				json.date = Common.timestampToString(json.date);

				html += me.tpl(json);
			});

			me.$list.append(html);

		}
	};

	return RecommendView;
    
});