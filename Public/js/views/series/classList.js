define([
	'jquery',
	'underscore',
	'common',
	'text!templates/series/seriesClassItem.html'
],function ($, _, Common, itemTpl) {

	'use strict';
    
	var ListView = function(cfg){
		var me = this;
		$.extend(me, cfg);

		me.tpl = _.template(itemTpl);
		me.$list = $('.item-list', me.$el);
		me.load();
	};

	ListView.prototype = {

		load: function(){
			var me = this;

			me.xhr && me.xhr.abort();

			me.xhr = $.ajax({
				url: Common.api.seriesClassUrl,
				async: true,
				cache: false,
				dataType: 'json',
				data: $.param({
					id: me.series_id,
					teacher_id : me.teacher_id
				}),
				context: me
			}).done(me.onRender);
		},

		onRender: function(data){
			var me = this;

			if(data && data.list && data.list.length){

				_.each(data.list, function(item, index){
					me.append(item, index);
				});

			}else{
				var $el = $('<p>').addClass('bg-info').text(Common.lang.no_result_msg);
				me.$list.html($el);
			}

		},

		append: function(item, index){
			var me = this;

			var i = index ||0;

			var json = {
				index: i + 1,
				name: item.name,
				class_link : Common.classDetailsLink + item.clid
			};
			var html = me.tpl(json);

			me.$list.append(html);
		}		
	};

	return ListView;
    
});