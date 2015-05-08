define([
	'jquery',
	'underscore',
	'common',
	'models/Courseware'
],function ($, _, Common) {

	'use strict';

	return {

		rootProperty: 'result',

		afterGetFilter: function(cfg){
			if(cfg.type == 'all'){
      	cfg.type = '';
      }else if (cfg.type == 'doc'){
      	cfg.type = 'document';
      }
      return cfg;
		},

		itemTranslate: function(json){
      var cfg = _.pick(Common.lang, [
	      'edit',
	      'view',
	      'remove'
			]);
			$.extend(json, cfg);
      
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
		
		preprocess: function(json){
			json.time = moment(json.time*1000).format(Common.dateFormat);
			return json;
		},

		preprocess_t: function(i){
    	var me = this;
    	var json = me.itemTranslate(i);

			json.uploadtime = moment(json.uploadtime*1000).format(Common.dateFormat);
			return json;
    },

		afterPreprocess: function(json){
			return json;
		},

		addEvent_t: function(el, model){
			var me = this;

			el.data('model', model);

			el.find('.remove-btn').on('click', {el: el, scope: me}, me.onRemove);
			el.find('.edit-btn').on('click', {el: el, scope: me}, me.onEdit);
		},

		onEdit: function(e){
			e.preventDefault();

			var $el = e.data.el;
			var me = e.data.scope;

			var model = $el.data('model');

			me.editDialog.set(model);
			me.editDialog.$el.modal('show');
		},

		onRemove: function(e){
			e.preventDefault();

			var $el = e.data.el;
			var me = e.data.scope;

			bootbox.confirm(Common.lang.confirm_class_remove,  function(state){
        if(!state){
          return;
        }

        var model = $el.data('model');

        $.ajax({
          url: Common.api.coursewareDeleteUrl,
          data: $.param({
          	id: model.id
          }),
          async: true,
          cache: false,
          type: 'post',
          dataType: 'json'
        }).done(function(data){
          if(data && data.success){
            me.renderPage();
          }else{
            alert(Common.lang.remove_failed);
          }
        });
        
      });
		}
	};
});