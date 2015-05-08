define([
	'jquery',
	'underscore',
	'common',
	'models/Type'
],function ($, _, Common) {

	'use strict';
    
	var CategoryBar = function(){
		this.render();
	};

	CategoryBar.prototype = {

		render: function(){
			var me = this;
			me.$el = $('#category-bar');

			me.$list = $('.item-list', me.$el);

			me.$tpl = $('#categoryTpl').html();

			var params = $.param({
				lang: Common.language
				// limit: 6
			});

			$.ajax({
				url: Common.api.categoryUrl,
				cache: false,
				data: params,
				dataType: 'json',
				context: me
			}).done(function(data){
				if(data && data.length){
					this.initList(data);
				}
			});
		},

		initList: function(data){
			var me = this;

			var html = '';

			var tpl = _.template(me.$tpl);

			_.each(data, function(i){
				html += tpl({
          id: i.id,
          label: i.name
        });
			});

			me.$list.append(html);
		}
	};

	return CategoryBar;
    
});