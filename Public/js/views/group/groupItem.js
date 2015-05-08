define([
	'jquery',
	'underscore',
	'text!templates/group/groupItem.html',
	'bootbox',
	'common'
],function ($, _, tpl, bootbox, Common) {

	'use strict';
  
  /**
   * Events:
   * activate
   * addMember (id, name)
   * addFailed (id, name)
   * remove
   */
	var GroupItemView = function(data, el){
		var me = this;

		me.data = data;
		me.id = data.id;

		if(el){
			me.$el = el;
			me.isDefaultGroup = true;
			me.initEvents();
		}
	};

	GroupItemView.prototype = {

		isDefaultGroup: false,

		render: function(){
			var me = this;

			var cfg = me.preprocess(me.data);
			var html = _.template(tpl, cfg);
			me.$el = $(html);

			me.initEvents();

			return me.$el;
		},

		preprocess: function(i){
			var json = $.extend({}, i, {
				color: '0' + (i.id*1 + 1 ) % 10,
				remove: Common.lang.remove
			});

			return json;
		},

		initEvents: function(){
			var me = this;

			me.$el.find('.circle').on('click', me, me.onActive);
			me.$el.find('.trash').on('click', me, me.onRemove);

			//droppable
			if(!me.isDefaultGroup){
				me.$el.droppable({ 
					accept: '.student-item',
					hoverClass: 'drop-hover',
					tolerance: 'pointer',
					drop: function( event, ui ) {
						var id = me.id;
						var user = ui.draggable.data('model');
						
						me.addMember(id, user);
		      }
				});
			}
		},

		onActive: function(e){
			e.preventDefault();

			var me = e.data;
			$(me).triggerHandler('activate', me.id);
		},

		addMember: function(id, user){
			var me = this;

			var uid = user.id;
			var name = user.name;

			$.ajax({
				url: Common.addUserUrl,
				cache: false,
				dataType: 'json',
				data: $.param({
					uid: uid,
					id: id
				})
			}).done(function(data){
				if(data && data.success){
					$(me).triggerHandler('addMember', [id, name]);
				}else if(data && data.error_code == 706){
					$(me).triggerHandler('addFailed', [id, name]);
				}else{
					Common.msg(Common.lang.add_failed);
				}
			});
		},

		onRemove: function(e){
			e.preventDefault();

			var me = e.data;

			bootbox.confirm('确定要移除该群组吗？', function(result) {
			  
			  if(!result){
			  	return;
			  }

  			$.ajax({
  				url: Common.removeGroupUrl,
  				dataType: 'json',
  	      cache: false,
  	      data: $.param({
  	      	id : me.id
  	      })
  			}).done(function(data){
  				if(data && data.success){
  					$(me).triggerHandler('remove', me.id);
  				}else{
  					Common.alert('删除失败');
  				}
  			});
			});
			
		},

		activate: function(){
			this.$el.find('.circle').addClass('active');
		},

		inactivate: function(){
			this.$el.find('.circle').removeClass('active');
		},

		onSpotlight: function(){
			this.$el.find('.circle').addClass('spotlight');
		},

		offSpotlight: function(){
			this.$el.find('.circle').removeClass('spotlight');
		},

		getName: function(){
			return this.data.name;
		},

		setName: function(name){
			var me = this;
			me.data.name = name;
			me.$el.find('.name').text(name);
		},

		setCount: function(count){
			var me = this;
			me.data.count = count;
			me.$el.find('.count').text(count);
		},

		remove: function(){
			this.$el.remove();
		}
	};

	return GroupItemView;
});

