define([
	'jquery',
  'underscore',
	'common',
	'pagingBar',
	'easing',
	'vgrid'
], function ($, _, Common) {

	'use strict';

	return {

		listUrl: '',

		collection: [],

		currentPage: 1,

		limit: 12,

		totalProperty: 'total',

    rootProperty: 'list',

    backToTop: true,

		renderPage: function(page, cfg){

			var me = this;

			me.xhr && me.xhr.abort();

			if(me.backToTop){
				$(window).scrollTop(0);
			}
			
			me.$list.empty();

			if(page){
				me.currentPage = page;
			}else{
				page = me.currentPage;
			}

			if(!cfg){
				cfg = me.getFilters();
			}
			cfg = me.afterGetFilter(cfg);

			var params = $.extend(cfg, {
				start: (page-1)*me.limit,
				limit: me.limit
			});

			me.xhr = $.ajax({
				url: me.listUrl,
				async: true,
				cache: false,
				dataType: 'json',
				data: $.param(params),
				context: me
			}).done(me.onRender);

		},

		afterGetFilter: function(cfg){
			return cfg;
		},

		onRender: function(data){
			var me = this;
			if(data && data[me.rootProperty] && data[me.rootProperty].length){

				me.collection = data[me.rootProperty];
				me.initList(me.collection);
				me.addEvents();

				data.totalPage = Math.ceil(data[me.totalProperty]/me.limit);

				if(me.pagingBar){
					me.pagingBar.repaint(me.currentPage, data.totalPage);
				}else{
					me.pagingBar = new sy.ui.PagingBar({
						prevText: Common.lang.prev,
						nextText: Common.lang.next,
						total: data.totalPage,
						currentPage: me.currentPage,
						$el: me.$paging,
						onClick: function(val){
							me.onPaging(val);
						}
					});
				}
			}else{
				if(me.pagingBar){
					me.pagingBar = null;
					me.$paging.empty();
				}
				var $el = $('<p>').addClass('bg-info').text(Common.lang.no_result_msg);
				me.$list.html($el);
			}

			me.afterRender(data);
		},

		onPaging: function(val){
			Common.forward(val);
		},
		/**
		 * To be overridden
		 */
		afterRender: function(){},

		initList: function(data){
			var me = this;

			var html = '';

			_.each(data, function(i){
				var json = me.preprocess(i);
				html += me.tpl(json);
			});

			me.$list.html(html);

			me.$list.vgrid({
        easing: 'easeOutQuint',
        time: 500,
        delay: 20,
        fadeIn: {
          time: 300,
          delay: 50
        },
        forceAnim: 1
	    });
		},

		addEvents: function(){
			var me = this;

			me.$list.children().each(function(i){
				var el = $(this);
				var model = me.collection[i];
				me.addEvent(el, model);
			});
		},
		/**
		 * To be overridden
		 */
		preprocess: function(json){
			return json;
		},
		/**
		 * To be overridden
		 */
		addEvent: function(){}
	};
});