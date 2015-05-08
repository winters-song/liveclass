define([
	'jquery',
	'underscore',
	'bootbox',
	'common'
],function ($, _, bootbox, Common) {

	'use strict';
  
  /**
   * Events:
   * change (type, id, count)
   * 	- type: 'add', 'remove'
   *
   * hide
   *
   * addGroup
   */
	var GroupPicker = function(el){
		this.$el = el;
		this.render();
		this.initEvents();
	};

	GroupPicker.prototype = {

		loading: false,

		timer: null,

		render: function(){
			var me = this;

      var tpl = $('#pickerTpl').html();
			var html = _.template(tpl, Common.lang);
			me.$el = $(html);
			$('body').append(me.$el);

			me.$list = $('ul', me.$el);
			me.itemTpl = _.template($('#pickerItemTpl').html());

			me.$add_box = $('.add-box', me.$el);
			me.$add = $('.add-group', me.$add_box);
			
			me.$input_box = $('.input-box', me.$el);
			me.$input = $('input', me.$input_box);
			me.$submit = $('.btn', me.$input_box);
			
		},

		showInput: function(){
			var me = this;
			me.$add_box.hide();
			me.$input_box.show();
			me.$input[0].focus();
		},

		hideInput: function(){
			var me = this;
			me.$add_box.show();
			me.$input_box.hide();
			me.$input.val('');
		},

		initEvents: function(){
			var me = this;

			$('body').on('click.groupPicker', function(e){
				if(!$.contains( me.$el[0], e.target )){
					me.hide();
				}
			});

			me.$el.on('mouseleave', function(){
				var focus = me.$el.find(':focus');
				if(!focus.is(me.$input)){
					me.hide();
				}
			});

			me.$add.on('click', function(e){
				e.preventDefault();
				me.showInput();
			});

			me.$input.on('keyup', function(e){
				if(e.keyCode == 13){
					me.addGroup();
				}
			});

			me.$submit.on('click', function(e){
				e.preventDefault();
				me.addGroup();
			});

		},

		addGroup: function(){
      var me = this;

      var val = $.trim(me.$input.val());

      if(!val){
      	me.$input.val('');
      } else if(val.length > 50){
        Common.alert(Common.lang.group_name_maxlength);
      } else if(val){

      	me.$submit.prop('disabled', true);

        $(me).triggerHandler('beforeAdd');

        $.ajax({
          url: Common.addGroupUrl,
          data: $.param({
            name: val,
            index: me.index || 99
          }),
          async: true,
          cache: false,
          type: 'post',
          dataType: 'json'
        }).done(function(data){
          if(data){
            if(data.success){
              me.$el.modal('hide');
              $(me).triggerHandler('addGroup', [data.id, val]);
              me.updatePosition();
              me.$input.val('');

            }else if(data.error_code == 703){
              var msg = $.nano(Common.lang.group_exist_tpl, {
                name: val
              });
              Common.msg(msg);
            }else{
              Common.msg(Common.lang.add_failed);
            }
            
          }else{
            Common.msg(Common.lang.add_failed);
          }
        }).always(function(){
          me.$submit.prop('disabled', false);
        });
      }
      
    },

		update: function(data){
			var me = this;

			var html = '';

			_.each(data, function(i){
				html += me.itemTpl(i);
			});

			me.$list.html(html);
			me.setValues();
			me.addEvents();
		},

		addEvents: function(){
			var me = this;

			me.$list.find('li').on('click', function(){
				var input = $(this).find('input');
				var id = input.val();
				var name = input.data('group');
				var checked = input.prop('checked');
				input.prop('checked', !checked);

				if(!checked){
					me.add(id, name, input);
				}else{
					me.remove(id, name, input);
				}
			});

			me.$list.find('input').on('click', function(e){
				var $this = $(this);
				var id = $this.val();
				var name = $this.data('group');
				var checked = $this.prop('checked');

				if(checked){
					me.add(id, name, $this);
				}else{
					me.remove(id, name, $this);
				}
				e.stopPropagation();
			});
		},

		setValues: function(){
			var me = this;
			if(me.model && me.model.inGroups){
				me.$list.find('input').each(function(){
					var $this = $(this);
					var val = $this.val();
					var checked = _.contains(me.model.inGroups, val);
					$this.prop('checked', checked);
				});
			}
		},

		add: function(id, name, el){
			var me = this;

			$.ajax({
				url: Common.addUserUrl,
				cache: false,
				dataType: 'json',
				data: $.param({
					uid: me.uid,
					id: id
				})
			}).done(function(data){
				if(data && data.success){
					var $count = el.next().next();
					var count = $count.text()*1 + 1;
					$count.text(count);
					me.model.inGroups.push(id);
					$(me).triggerHandler('change', ['add', id, count]);

					var msg = $.nano(Common.lang.add_member_tpl, {
						group: Common.ellipsis(name),
						name: Common.ellipsis(me.model.name)
					});
					Common.msg(msg);

				}
			});
		},

		remove: function(id, name, el){
			var me = this;

			$.ajax({
				url: Common.delUserUrl,
				cache: false,
				dataType: 'json',
				data: $.param({
					uid: me.uid,
					id: id
				})
			}).done(function(data){
				if(data && data.success){
					var $count = el.next().next();
					var count = $count.text()*1 - 1;
					$count.text(count);

					var index = _.indexOf(me.model.inGroups, id);
					me.model.inGroups.splice(index, 1);
					$(me).triggerHandler('change', ['remove', id, count]);

					var msg = $.nano(Common.lang.remove_member_tpl, {
						group: Common.ellipsis(name),
						name: Common.ellipsis(me.model.name)
					});
					Common.msg(msg);

				}
			});
		},

		open: function(el, model){
			var me = this;

			//uid
			me.uid = model.id;
			me.model = model;
			me.targetEl = el;

			if(model.inGroups){
				me.setValues();
				me.show(el);
				return;
			}

			$.ajax({
				url: Common.inGroupsUrl,
				data:$.param({
					id: me.uid
				}),
				dataType: 'json',
				cache: false
			}).done(function(data){
				model.inGroups = data;
				me.setValues();

				me.show(el);
			});
			
		},

		updatePosition: function(){
			var me = this;
			var pos = me.targetEl.offset();
			me.$el.css(pos);
		},

		show: function(el){
			var me = this;

			if(me.timer){
				clearTimeout(me.timer);
			}
			var pos = el.offset();

			me.hideInput();
			me.$el.css(pos).stop().slideDown('fast');
		},

		hide: function(){
			var me = this;
			
			me.timer = setTimeout(function(){
				me.$el.slideUp('fast');
			},200);
			
		}
	};

	return GroupPicker;
});

