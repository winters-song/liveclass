define([
	'jquery',
	'underscore',
	'text!templates/utils/typePicker.html',
	'common'
],function ($, _, tpl, Common) {
	
  'use strict';

	var TypePicker = function(cfg){
		var me = this;

		$.extend(me, cfg);

		me.render();
		me.load();
	};

	TypePicker.prototype = {

		title: '',

		url: '',

		hidden: false,

		multiSelect: true,

		multiActive: false,

		loaded: false,

		render: function(){
			var me = this;

			me.$el = $('#'+ me.id);

			if(me.hidden){
				me.$el.hide();
			}

			var compiled = _.template(tpl);
			var fragment = compiled({
				title: me.title,
				multi_select: '多选'
			});
			
			me.$el.html(fragment);

			me.$list = $('.items', me.$el);

			if(me.multiSelect){
				me.$multiBtn = $('.multi-btn', me.$el);
			}else{
				$('.multi-bar', me.$el).remove();
				$('.buttons', me.$el).remove();
			}
			
		},

		load: function(){
			var me = this;

			$.ajax({
				url: me.url,
				cache: false,
				data: $.param({
          lang: Common.language
        }),
				dataType: 'json'
			}).done(function(data){
				if(data && data.length){
					me.data = data;

					var html = '';
					_.each(data, function(i){
						html += '<li><a href="javascript:;" data-value="'+i.id+'">' +i.name+ '</a></li>';
					});

					me.$list.append(html);
					me.initEvents();

					me.loaded = true;
					$(me).triggerHandler('load', me);
				}
			});
		
		},

		initEvents: function(){
			var me = this;

			me.$list.find('a').each(function(){
				$(this).on('click', me, me.onSelect);
			});
		},

		onSelect: function(e){
			e.preventDefault();

			var me = e.data;

			var id = $(this).data('value');
			me.value = id;

			me.setHidden(true);

			$(me).triggerHandler('select', me.value);

		},

		getValue: function(){
			return this.value;
		},

		setValue: function(value){
			this.value = value;
			this.setHidden(!!value);
		},

		setHidden: function(bool){
			var me = this;
			if(bool){
				me.$el.hide();
			}else{
				me.$el.show();
			}
		}

	};

	return TypePicker;
    
});