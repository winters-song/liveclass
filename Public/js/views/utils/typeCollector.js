define([
	'jquery',
	'underscore',
	'text!templates/utils/typeCollector.html',
	'views/utils/typePicker',
	'common'
],function ($, _, tpl, TypePicker, Common) {
	
  'use strict';

	var typeCollector = function(cfg){
		var me = this;

		$.extend(me, cfg);

		me.render();
	};

	typeCollector.prototype = {

		onSelect: function(){},

		render: function(){
			var me = this;

			me.$el = $('#'+ me.id);

			var compiled = _.template(tpl);
			var fragment = compiled({
				title: Common.lang.all_categories
			});
			
			me.$el.html(fragment);

			me.$list = $('.items', me.$el);

			me.map = {};

			_.each(me.items, function(i){
				var picker = new TypePicker(i);
				me.map[i.field] = picker;

				$(picker).on('select', me, me.onSelect);
			});

		},

		initEvents: function(){
			var me = this;

			me.$list.find('.btn').each(function(){
				$(this).on('click', me, me.onSelect);
			});
		},

		setValues: function(values){
			var me = this;

			_.each(values, function(value, key){
				var picker = me.map[key];
				if(picker){
					picker.setValue(value);

					if(!value){
						return;
					}

					if(picker.loaded){
						me.setTag(picker, value);
					}else{
						$(picker).one('load',  function(e, thiz){
							me.setTag(thiz, value);
						});
					}

				}
			});
		},

		setTag: function(picker, value){
			var me = this;

			var data = picker.data;

			for(var i in data){
				if(data[i].id == value){
					name = data[i].name;
					break;
				}
			}

			if(name){
				// var content =  picker.title +' : ' + name+ ' <span class="glyphicon glyphicon-remove"></span>';
				var content =  name + ' <span class="glyphicon glyphicon-remove"></span>';
				var cls = 'tag-'+picker.field;

				var $tag = $('.'+ cls, me.$list);
				if($tag.size()){
					$tag.html(content);
				}else{
					var $html = $('<a class="btn btn-danger btn-sm" data-field="'+picker.field+'" >' +content +'</a>');
					$html.addClass(cls);
					me.$list.append($html);

					$html.on('click', function(){
						var field = $(this).data('field');
						me.map[field].setValue('');
						$(this).remove();
						me.onSelect();

					});
				}
			}
		},

		getName: function(value, arr){
			for(var i in arr){
				if(arr[i].id == value){
					return arr[i][Common.language];
				}
			}
		},


		getValues: function(){
			var me = this;

			var map = {};

			_.each(me.map, function(picker, key){
				map[key] = picker.getValue();
			});

			return map;
		}
	};

	return typeCollector;
    
});