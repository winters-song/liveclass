define([
	'jquery',
	'underscore',
	'views/group/groups',
	'views/group/titleEditor',
	'views/group/groupPicker',
	'views/group/memberDialog',
	'bootbox',
	'common',
	'pagingBar',
	'easing',
	'vgrid',
	'jquery_ui'
],function ($, _, GroupView, TitleEditor, GroupPicker, MemberDialog, bootbox, Common) {

	'use strict';
    
	var BoardView = function(){
		this.render();
		this.initEvents();
	};

	BoardView.prototype = {

		collection: [],

		currentPage: 1,

		limit: 11,

		editing: false,

		render: function(){
			var me = this;
			me.$el = $('#main');

			me.translate();
			
			var $msg = $('.action-msg', me.$el).find('.alert');
			var msgTimer;
			Common.msg = function(text){
				msgTimer && clearTimeout(msgTimer);
				$msg.text(text);
				$msg.stop().slideDown();

				msgTimer = setTimeout(function(){
					$msg.slideUp();
				}, 5000);
			};

			me.$list = $('.item-list', me.$el);
			me.$paging = $('.pagingbar', me.$el);
			me.$form = $('#search-form', me.$el);
			me.$addBtn = $('#add-group-btn', me.$el);

			var html = $('#filterTpl').html();
			var filter = _.template(html, Common.lang);
			me.$form.html(filter);

			var itemTpl = $('#studentTpl').html();
			me.tpl = _.template(itemTpl);

      me.$searchInput = $('input[name=name]', me.$form);
      me.$title = $('.group-title', me.$el);
      me.$editBtn = $('#edit-group-btn', me.$el);

      html = $('#addMemberTpl').html();
			me.addTpl = _.template(html, Common.lang);

      me.titleEditor = new TitleEditor($('.title-editor', me.$el));
      me.groupView = new GroupView($('#groups', me.$el));
      me.groupPicker = new GroupPicker();
      me.memberDialog = new MemberDialog();

		},

		translate: function(){
      var title = Common.lang.nav_mystudent;
      Common.setTitle(title);
    },

		initEvents: function(){
			var me = this;

      me.$form.on('submit', function(e){
				e.preventDefault();
				Common.forward(1);
      });

      $('.search-btn', me.$form).on('click', function(e){
        e.preventDefault();
        Common.forward(1);
      });

      me.$editBtn.on('click', function(e){
      	e.preventDefault();
      	var title = me.groupView.getActive().getName();
      	me.titleEditor.open(title);
      });

      // GroupView
      $(me.groupView)
			.on('switch', function(e, val, name){
				me.setTitle(val, name);
			})
			.on('cued', function(e, obj){
				me.groupPicker.update(obj.data);
			})
			.on('activate', function(){
				me.$searchInput.val('');
				Common.forward(1);
			});

			// TitleEditor
      $(me.titleEditor)
      .on('show', function(){
      	me.$title.hide();
    		me.$editBtn.hide();
      })
      .on('hide', function(){
      	me.$title.show();
    		me.$editBtn.show();
      })
      .on('success', function(e, id, newName, oldName){
      	me.$title.text(newName);

      	var msg = $.nano(Common.lang.rename_tpl, {
      		oldName: Common.ellipsis(oldName),
      		newName: Common.ellipsis(newName)
      	});
      	Common.msg(msg);

      	me.groupView.setName(id, newName);
      	me.groupPicker.update(me.groupView.data);
      });

      // GroupPicker
      $(me.groupPicker)
			.on('change', function(e, type, id, count){
				me.groupView.updateCount(id, count);

				if(id == me.filters.group && !me.isDefaultGroup() && type == 'remove'){
					me.groupPicker.hide();
					me.renderPage();
				}else if(type == 'add'){
					me.groupView.showAddMsg(id);
				}
			})
		  .on('beforeAdd', function(){
		  	me.groupPicker.index = me.groupView.collection.length - 1;
		  })
			.on('addGroup', function(e, id, val){
				var data = {
		  		id: id + '',
		  		name: val,
		  		count: 0
		  	};
				me.groupView.addItem(data);
		  	
		  	me.groupPicker.update(me.groupView.data);
			});

			$(me.memberDialog)
			.on('add', function(e, id, name){

				var item = me.groupView.get(id);
				item.count++;
				me.groupView.updateCount(id, item.count);
				me.groupPicker.update(me.groupView.data);
				me.renderPage(1);

				var msg = $.nano(Common.lang.add_member_tpl, {
					group: Common.ellipsis(item.name),
					name: Common.ellipsis(name)
				});
				Common.msg(msg);
				me.groupView.showAddMsg(id);
			})
			.on('addFailed', function(e, id, name){

				var item = me.groupView.get(id);
				var msg = $.nano(Common.lang.member_exist_tpl, {
					group: Common.ellipsis(item.name),
					name: Common.ellipsis(name)
				});
				Common.msg(msg);
			});

		},

		setTitle: function(val, name){
			var me = this;

			me.$title.text(name);

			if(val && /^\d+$/.test(val)){
				me.$editBtn.show();
			}else{
				me.$editBtn.hide();
			}
		},

		setFilters: function(cfg){
			var me = this;
			me.filters = cfg;
			Common.filters = cfg;

			if(!Common.filters.group){
				Common.filters.group = 'all';
			}

			me.$searchInput.val(cfg.display_name); 

			me.groupView.update(Common.filters.group);

			me.titleEditor.setId(cfg.group);
		},

		getFilters: function(){
			var me = this;
			var result = {};

      result.display_name = $.trim(me.$searchInput.val());
      result.group = me.groupView.getActive().id;

     	return result;
		},

		isDefaultGroup: function(){
			return this.filters.group == 'all' || this.filters.group == 'org';
		},

		renderPage: function(page, cfg){

			var me = this;

			me.xhr && me.xhr.abort();

			$(window).scrollTop(0);
			me.$list.empty();

			if(page){
				me.currentPage = page;
			}else{
				page = me.currentPage;
			}

			if(!cfg){
				cfg = this.getFilters();
			}
			cfg.name = cfg.display_name;

			if(me.isDefaultGroup()){
				me.limit = 12;
			}else{
				me.limit = 11;
			}

			var params = $.extend(cfg, {
				order:'asc',
				start: (page-1)*me.limit,
				limit: me.limit
			});

			me.xhr = $.ajax({
				url: Common.listUrl,
				cache: false,
				dataType: 'json',
				data: $.param(params),
				context: me
			}).done(me.onRender);

		},

		onRender: function(data){
			var me = this;
			if(data && data.list && data.list.length){

				me.collection = data.list;

				me.initList(data.list);
				me.addEvents();

				data.totalPage = Math.ceil(data.total/me.limit);

				if(me.pagingBar){
					me.pagingBar.repaint(me.currentPage, data.totalPage);
				}else{
					me.pagingBar = new sy.ui.PagingBar({
						prevText: Common.lang.prev,
						nextText: Common.lang.next,
						total: data.totalPage,
						currentPage: me.currentPage,
						$el: me.$paging,
						onClick: function(val){
							Common.forward(val);
						}
					});
				}
			}else{
				if(me.pagingBar){
					me.pagingBar = null;
					me.$paging.empty();
				}
				var $el = $('<p>').addClass('bg-info').text(Common.lang.no_result_msg);
				$el.appendTo(me.$list);
				me.createAddBtn();
			}
		},

		itemTranslate: function(json){
			var cfg = _.pick(Common.lang, [
				'add_to',
				'remove'
			]);
			$.extend(json, cfg);

      return json;
    },

		initList: function(data){
			var me = this;

			me.createAddBtn();

			var html = '';

			_.each(data, function(i){
				var json = me.itemTranslate(i);

				html += me.tpl(json);
			});

			var $html = $(html);

			if(me.isDefaultGroup()){
				$html.find('.close-btn').remove();
			}

			me.$list.append($html);

			me.$list.vgrid({
        easing: 'easeOutQuint',
        time: 500,
        delay: 20,
        fadeIn: {
          time: 300,
          delay: 50
        },
        forceAnim: 1
	    });

		},

		createAddBtn: function(){
			var me = this;

			if(me.isDefaultGroup()){
				return;
			}

			var $btn = $(me.addTpl);
			me.$list.append($btn);

			$btn.on('click', function(e){
				e.preventDefault();
				e.stopPropagation();
				me.memberDialog.show(me.filters.group);
			});
		},

		addEvents: function(){
			var me = this;

			var items = me.$list.find('.student-item');
			items.each(function(i){
				var el = $(this);

				var model = me.collection[i];
				el.data('model', model);

				el
				.on('mouseenter', {el: el, scope: me}, me.onItemMouseEnter)
				.on('mouseleave', {el: el, scope: me}, me.onItemMouseLeave);

				el.find('.add-to-btn')
				.on('mouseenter', {el: el, scope: me}, me.onBtnMouseEnter)
				.on('mouseleave', {el: el, scope: me}, me.onBtnMouseLeave);

				el.find('.close-btn').on('click', {el: el, scope: me}, me.onRemove);

			});

			//draggable
			items.draggable({
	      helper: 'clone',
	      revert: 'invalid',
	      opacity: 0.876,
	      zIndex: 200
	    });

		}, 

		onRemove : function(e){
			e.preventDefault();

			var $el = e.data.el;
			var me = e.data.scope;
			var model = $el.data('model');

			$.ajax({
				url: Common.delUserUrl,
				cache: false,
				dataType: 'json',
				data: $.param({
					uid: model.id,
					id: me.filters.group
				})
			}).done(function(data){
				if(data && data.success){

					var item = me.groupView.get(me.filters.group);
					item.count--;
					me.groupView.updateCount(me.filters.group, item.count);

					me.groupPicker.hide();
					me.groupView.offSpotlight();
					me.groupPicker.update(me.groupView.data);

					var msg = $.nano(Common.lang.remove_member_tpl, {
						group: Common.ellipsis(item.name),
						name: Common.ellipsis(model.name)
					});
					Common.msg(msg);
					
					me.renderPage();

				}
			});
		},

		onItemMouseEnter: function(e){
			e.preventDefault();

			var $el = e.data.el;
			var me = e.data.scope;
			var model = $el.data('model');
			var xhr =$el.data('xhr');
			xhr && xhr.abort();

			if(model.inGroups){
				me.groupView.onSpotlight(model.inGroups);
			}else{
				xhr = $.ajax({
					url: Common.inGroupsUrl,
					data:$.param({
						id: model.id
					}),
					dataType: 'json',
					cache: false
				}).done(function(data){
					model.inGroups = data;
					me.groupView.onSpotlight(model.inGroups);
				});
				$el.data('xhr', xhr);
			}
		},

		onItemMouseLeave: function(e){
			e.preventDefault();

			var me = e.data.scope;

			me.groupView.offSpotlight();
		},

		onBtnMouseEnter : function(e){
			e.preventDefault();

			var $el = e.data.el;
			var me = e.data.scope;
			
			var model = $el.data('model');
			var $this = $(this);
			var timer = $el.data('timer');

			timer && clearTimeout(timer);

			timer = setTimeout(function(){
				me.groupPicker.open($this, model);
			},150);
			$el.data('timer', timer);
			
		},

		onBtnMouseLeave : function(e){
			e.preventDefault();

			var $el = e.data.el;
			
			var timer = $el.data('timer');
			timer && clearTimeout(timer);
		}
	};

	return BoardView;
    
});