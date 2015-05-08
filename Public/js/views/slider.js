define([
	'jquery',
	'underscore',
	'common',
	'flexslider'
],function ($, _, Common) {

	'use strict';
    
	var SliderView = function(){
		this.render();
	};

	SliderView.prototype = {

		render: function(){
			var me = this;
			me.$el = $('#slide');
			me.$list = $('.slides', me.$el);
			me.$slider = $('.flexslider', me.$el);

			me.$tpl = $('#sliderTpl').html();

			var params = $.param({
				lang : Common.language
			});

			$.ajax({
				url: 'proxy/slider.json',
				async: true,
				cache: false,
				data: params,
				dataType: 'json',
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

			me.$slider.flexslider({
		    animation: 'slide'
		  });
		}
	};

	return SliderView;
    
});