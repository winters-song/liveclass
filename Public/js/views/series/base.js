define([
	'jquery',
	'underscore',
	'common',
	'models/Series'
], function ($, _, Common) {

	'use strict';

	return {

		defaultImg: '/Public/img/series-default.jpg',

		itemTranslate: function(json){
			var cfg = _.pick(Common.lang, [
	      'edit',
	      'remove',
	      'audit_failed',
	      'ask_admin'
			]);
			$.extend(json, cfg);

			if(!json.thumb){
				json.thumb = this.defaultImg;
			}

			if(!json.description){
				json.description = '';
			}
      
      return json;
    },

		repaint: function(e, el, model){
			var me = e.data;

			var json = me.preprocess(model);
			var html = me.tpl(json);

			var $fragment = $(html).children();
			el.html($fragment);
			me.addEvent(el, model);
		},
		
		preprocess: function(i){
			var me = this;
			var json = me.itemTranslate(i);

			$.extend(json, {
				like: 1,
				series_link : Common.seriesDetailsLink + json.sid,
				user_link : Common.profileLink + json.uid,
				lecturer_realname : i.lecturer_realname || i.lecturer_name
			});

			return json;
		},

		addEvent: function(el, model){
			var me = this;

			el.data('model', model);
		},

		addEvent_t: function(el, model){
			var me = this;

			el.data('model', model);

			el.find('.remove-btn').on('click', {el: el, scope: me}, me.onRemove);
		},

		onRemove: function(e){
			e.preventDefault();

			var $el = e.data.el;
			var me = e.data.scope;

			bootbox.confirm(Common.lang.confirm_series_remove,  function(state){
        if(!state){
          return;
        }

        var model = $el.data('model');

        $.ajax({
          url: Common.api.seriesDeleteUrl,
          data: $.param({
          	id: model.sid
          }),
          async: true,
          cache: false,
          type: 'post',
          dataType: 'json'
        }).done(function(data){
          if(data && data.success){
            me.renderPage();
          }else{
          	bootbox.alert(Common.lang.remove_failed);
          }
        });
        
      });
		},

		onLike: function(e){
			e.preventDefault();

			var $el = e.data.el;
			var me = e.data.scope;
			var $btn = $(this);

			me.likeXhr && me.likeXhr.abort();

			var model = $el.data('model');

			me.likeXhr = $.ajax({
				url: Common.likeUrl,
				cache: false,
				data: $.param({
					id: model.clid
				}),
				dataType: 'json'
			}).done(function(data){
				if(data && data.success){
					$el.find('.hidden').removeClass('hidden');
					$btn.addClass('hidden');
				}
			});
		},

		onCancel: function(e){
			e.preventDefault();

			var $el = e.data.el;
			var me = e.data.scope;
			var $btn = $(this);

			me.cancelXhr && me.cancelXhr.abort();

			var model = $el.data('model');

			me.cancelXhr = $.ajax({
				url: Common.cancelUrl,
				cache: false,
				data: $.param({
					id: model.clid
				}),
				dataType: 'json'
			}).done(function(data){
				if(data && data.success){
					$el.find('.hidden').removeClass('hidden');
					$btn.addClass('hidden');
				}
			});
		}
	};
});