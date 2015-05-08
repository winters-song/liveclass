define([
	'jquery',
	'underscore',
	'bootbox',
	'common',
	'nano'
],function ($, _, bootbox, Common) {

	'use strict';
  /**
   * Events:
   * show
   * hide
   * success: (me.id, newVal, oldVal)
   */
	var TitleEditor = function(el){
		this.$el = el;
		this.render();
		this.initEvents();
	};

	TitleEditor.prototype = {

		editing: false,

		render: function(){
			var me = this;

      var tpl = $('#editorTpl').html();
			var html = _.template(tpl, Common.lang);
			me.$el.html(html);
			
			me.$input = $('input', me.$el);
      me.$edit = $('.edit-btn', me.$el);
      me.$cancel = $('.cancel-btn', me.$el);
		},

		open: function(val){
			var me = this;
			me.title = val;
			me.$input.val(val);
			me.show();
			me.$input[0].focus();
		},

		show: function(){
			var me = this;
			me.editing = true;
			me.$el.show();
			$(me).triggerHandler('show');
		},

		hide: function(){
			var me = this;
			me.editing = false;
			me.$el.hide();
			$(me).triggerHandler('hide');
		},

		initEvents: function(){
			var me = this;

			me.$input.on('keyup', function(e){
				if(e.keyCode == 13){
					me.editTitle();
				}
			});

			me.$edit.on('click', function(e){
			  e.preventDefault();
			  me.editTitle();
			});

			me.$cancel.on('click', function(e){
			  e.preventDefault();
			  me.hide();
			});

		},

		editTitle: function(){
			var me = this;

			var val = $.trim(me.$input.val());

			if(!val){
				me.$input.val('');
			} else if(val.length > 50){
				Common.alert(Common.lang.group_name_maxlength);
			}else if(val == me.title) {
				me.hide();
			}else{

				$.ajax({
					url: Common.editGroupUrl,
					async: true,
					cache: false,
					dataType: 'json',
					type: 'post',
					data: $.param({
						id: me.id,
						name: val
					}),
					context: me
				}).done(function(data){
					var me = this;
					if(data && data.success){
						me.hide();
						$(me).triggerHandler('success', [me.id, val, me.title] );
					}else if(data.error_code == 703){

						var msg = $.nano(Common.lang.group_exist_tpl, {
							name: val
						});
						Common.alert(msg);
					}else{
						Common.alert(Common.lang.edit_failed);
					}

				});
			}
		},

		setId: function(id){
			this.id = id;
		}
	};

	return TitleEditor;
});

