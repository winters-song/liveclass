define([
	'jquery',
	'underscore',
	'common',
	'slider'
],function ($, _, Common) {

	'use strict';
    
	var PartnersView = function(){
		this.render();
	};

	PartnersView.prototype = {

		render: function(){
			var me = this;

			me.$el = $('#partners');
			me.$title = $('.title', me.$el);
			me.$btn = $('.btn', me.$el);
			me.$list = $('.item-list ul', me.$el);
			me.$prev = $('#partners-prev', me.$el);
			me.$next = $('#partners-next', me.$el);

			me.$title.text(Common.lang.partners);
			me.$btn.find('.btn_text').text(Common.lang.join_us);

			me.$tpl = $('#partnerTpl').html();

			$.ajax({
				url: Common.api.orgListUrl,
				async: true,
				cache: false,
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

			me.slider = new sy.ui.Slider({
		    id: 'partners-slider',
		    $prev: me.$prev,
		    $next: me.$next,
		    autoScroll: true
		  });
		}
	};

	return PartnersView;
    
});