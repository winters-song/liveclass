define([
	'jquery',
	'underscore',
	'text!templates/group/groups.html',
	'views/group/groupItem',
	'views/group/addDialog',
	'bootbox',
	'common',
	'jquery_ui'
],function ($, _, tpl, GroupItem, AddDialog, bootbox, Common) {
  
  'use strict';

  /**
   * Events:
   * cued ({data: data})
   * activate
   */
	var GroupView = function(el){
		this.$el = el;
		this.render();
		this.initEvents();
	};

	GroupView.prototype = {

		collection: {},

		lastId: null,

		loaded: false,

		render: function(){
			var me = this;

			var html = _.template(tpl, Common.lang);
			var $html = $(html);

			me.$el.html($html);

			if(!Common.isOrgTeacher){
				me.$el.find('.c-org').remove();
			}
			me.addItem({
				id: 'all',
				name: Common.lang.all_user
			}, true, me.$el.find('.c-all'));


			me.addItem({
				id: 'org',
				name: Common.lang.org_student
			}, true, me.$el.find('.c-org'));

			me.addDialog = new AddDialog();

		},

		initEvents: function(){
			var me = this;

			me.$el.sortable({ 
		  	items: '.movable',
		  	placeholder: 'circle-highlight',
		  	cursor: 'move',
		  	tolerance: 'pointer'
		  }).on('sortstop', me, me.onSortStop);
		  me.$el.disableSelection();

		  $(me.addDialog)
		  .on('beforeAdd', function(){
		  	me.addDialog.index = me.collection.length - 1;
		  })
		  .on('add', function(e, id, name){
		  	me.addItem({
		  		id: id + '',
		  		name: name,
		  		count: 0
		  	});
		  	me.newId = id;
		  	Common.forward(1);
		  	$(me).triggerHandler('cued', { data : me.data});

		  });

		},

		onSortStop: function(e){
			var me = e.data;
      var list = {};
      var order = [];

      $('.movable', me.$el).each(function(i){
        var id  = $(this).find('.circle').data('gid');
        list[id] = i;
        order.push(id);
      });
      
      me.sortItems(list, order);
    },

    sortItems: function(list, order){
    	var me = this;

	    var params = $.param({
	      sort: list
	    });
	    
	    $.ajax({
	      url: Common.sortUrl,
	      dataType: 'json',
	      type: 'post',
	      cache: false,
	      data: params
	    }).done(function(data){
	    	if(data && data.success){

	    		//update data;
					var newList = [];
					_.each(order, function(i){
						newList.push(me.get(i));
					});
					me.data = newList;

	    		$(me).triggerHandler('cued', { data : me.data});
	    	}
	    });
	  },

		update: function(id){
			var me = this;

			me.newId = id || 'all';

			if(me.loaded){
				me.changeState();
			}else{
				me.load();
			}
		},

		load: function(){
			var me = this;

			me.xhr && me.xhr.abort();

			me.xhr = $.ajax({
				url: Common.groupListUrl,
				async: true,
				cache: false,
				dataType: 'json',
				context: me
			}).done(me.onLoad);
		},

		onLoad: function(data){
			var me = this;

			me.loaded = true;

			if(data && data.length){

				me.data = data;

				_.each(data, function(i){
					me.addItem(i, true);
				});

				$(me).triggerHandler('cued', { data : me.data});
			}else{
				me.data = [];
			}

			me.changeState();
		},

		addItem: function(data, isSilent, el){
			var me = this;
			var group = new GroupItem(data, el);

			if(!el){
				me.$el.append(group.render());
			}
			if(!isSilent){
				//update data
				me.data.push(data);
			}
			me.collection[data.id] = group;

			$(group)
			.on('remove', me, me.onItemRemove)
			.on('activate', me, me.onItemActivate)
			.on('addMember', me, me.onAddMember)
			.on('addFailed', me, me.onAddFailed);

			return group;
		},

		onAddMember: function(e, id, name){
			var me = e.data;
			//update data
			var item = me.get(id);
			item.count++;
			me.showAddMsg(id);

			me.updateCount(id, item.count);
			$(me).triggerHandler('cued', { data : me.data});

			var msg = $.nano(Common.lang.add_member_tpl, {
				group: Common.ellipsis(item.name),
				name: Common.ellipsis(name)
			});
			Common.msg(msg);
		},

		onAddFailed: function(e, id, name){
			var me = e.data;
			var item = me.get(id);

			var msg = $.nano(Common.lang.member_exist_tpl, {
				group: Common.ellipsis(item.name),
				name: Common.ellipsis(name)
			});
			Common.msg(msg);
		},

		showAddMsg: function(id){
			var me = this;

			var $el = me.collection[id].$el;

			var pos = $el.offset();
			var radius = $el.width()/2;
			var pivot = [pos.left + radius - 16, pos.top + radius - 16];

			$('<div class="count-msg">').css({
				opacity: 0,
				left: pivot[0],
				top: pivot[1]
			}).appendTo($('body')).text('+1')
			.animate({
				opacity: 1,
				left: pivot[0] + 40,
				top: pivot[1] - 60
			},600 ).delay( 500 )
			.fadeOut('fast', function(){
				$(this).remove();
			});

		},

		onItemRemove: function(e, id){
			var me = e.data;
			//update data
			var data = me.get(id);
			var name = data.name;
			var index = _.indexOf(me.data, data);

			me.data.splice(index, 1);
			var item = me.collection[id];
			item.remove();
			delete me.collection[id];

			me.lastId = null;
			me.newId = 'all';
			Common.forward(1);

			var msg = $.nano(Common.lang.group_remove_tpl, {
				name: Common.ellipsis(name)
			});
			Common.msg(msg);
			$(me).triggerHandler('cued', { data : me.data});
		},

		// for item
		onItemActivate: function(e, id){
			var me = e.data;
			me.newId = id;

			$(me).triggerHandler('activate');

		},

		changeState: function(){
			var me = this;

			if(me.lastId){
				me.collection[me.lastId].inactivate();
			}
			
			me.lastId = me.newId;

			var currentGroup = me.getActive();
			currentGroup.activate();

			$(me).triggerHandler('switch', [currentGroup.id, currentGroup.getName()]);
		},

		getActive: function(){
			return this.collection[this.newId];
		},

		setName: function(id, name){
			var me = this;
			var item = me.get(id);
			item.name = name;
			this.collection[id].setName(name);
		},

		updateCount: function(id, count){
			this.collection[id].setCount(count);
		},

		onSpotlight: function(ids){
			var me = this;

			me.spotlightList = ids;
			_.each(me.collection, function(i, key){
				if(_.contains(ids, key)){
					i.onSpotlight();
				}
			});
		},

		offSpotlight:function(){
			var me = this;

			_.each(me.collection, function(i){
				i.offSpotlight();
			});
		},

		get: function(id){
			var me = this;
			return _.findWhere(me.data, {id : id+''});
		}

	};

	return GroupView;
});

