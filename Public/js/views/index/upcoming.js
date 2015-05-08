define([
	'jquery',
	'underscore',
	'common',
	'views/class/base',
	'text!templates/class/classItem.html',
	'text!templates/class/tapedItem.html',
	'moment'
],function ($, _, Common, Base, classTpl, tapedTpl) {

	'use strict';
    
	var UpcomingView = function(){
		$.extend(this, Base, {
			initList: function( $el, data){
				var me = this;

				var html = '';

				_.each(data, function(i){
					if(me.isTaped(i)){
						var json = me.preprocessTaped(i);
						html += me.tapedTpl(json);
					}else{
						var json = me.preprocessClass(i);
						html += me.classTpl(json);
					}
				});

				var $list = $el.find('.item-list');
				$list.append(html);

				$list.children().each(function(i){
					var el = $(this);
					var model = data[i];
					if(!me.isTaped(model)){
						me.addEvent(el, model);
					}
				});

			}
		});
		this.render();
	};

	UpcomingView.prototype = {

		limit: 3,

		collection: {},

		render: function(){
			var me = this;
			me.$el = $('#upcoming .container');

			me.sectionTpl = _.template($('#upcomingTpl').html());
			me.classTpl = _.template(classTpl);
			me.tapedTpl = _.template(tapedTpl);

			var params = $.param({
				lang: Common.language
			});

			$.ajax({
				url: Common.api.pushUrl,
				async: true,
				cache: false,
				data: params,
				context: me
			}).done(function(data){

				var self = this;
				if(data && data.length){
					_.each(data, function(i){

						i.more = Common.lang.more;
						var $el = $(me.sectionTpl(i));
						me.$el.append($el);
						me.renderPage(i, $el);
					});
				}
			});

			$(me).on('repaint', me, me.repaint);
			
		},

		renderPage: function(json, $el){

			var me = this;

			var cfg = {
				start: 0,
				limit: me.limit
			};
			cfg[json.c_name] = json.pid;

			$.ajax({
				url: Common.api.upcomingUrl,
				async: true,
				cache: false,
				data: $.param(cfg),
				dataType: 'json',
				context: me
			}).done(function(data){
				if(data && data.list){
					this.initList( $el, data.list );
				}
			});

		},

		itemTranslate: function(json){
			var cfg = _.pick(Common.lang, [
				'live',
				'finished',
				'seat_remain',
				'lesson',
				'mins',
	      'join_class',
	      'replay_class',
	      'waiting_text',
	      'enter',
	      'cancel',
	      'sign_up'
			]);
			$.extend(json, cfg);
      
      return json;
    }


	};

	return UpcomingView;
    
});