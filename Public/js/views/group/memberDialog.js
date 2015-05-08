define([
	'jquery',
	'underscore',
	'bootbox',
	'common'
],function ($, _, bootbox, Common) {

	'use strict';
   
  var emailReg = /^(")?(?:[^\."])(?:(?:[\.])?(?:[\w\-!#$%&'*+/=?^_`{|}~]))*\1@(\w[\-\w]*\.){1,5}([A-Za-z]){2,6}$/;
   
  /**
   * Events:
   * add (id, name)
   * addFailed (id, name)
   */ 
	var MemberDialog = function(){
		this.render();
		this.initEvents();
	};

	MemberDialog.prototype = {

		editing: false,

		collection: [],

		render: function(){
			var me = this;

      var tpl = $('#memberDialogTpl').html();
			var html = _.template(tpl, Common.lang);

			me.$el = $(html);
			$('body').append(me.$el);
			
			me.$input = $('input', me.$el);
			me.$close = $('.close-btn', me.$el);
			me.$listWrapper = $('.item-list', me.$el);
			me.$list = $('ul', me.$listWrapper);

			var itemTpl = $('#dialogItemTpl').html();
			me.itemTpl = _.template(itemTpl);

			if(!Modernizr.indexeddb){
			  me.$input.ezpz_hint();
			}
		},

		show: function(id, el){
			var me = this;

			me.id = id;

			me.updatePosition();
			me.$el.fadeIn('fast');
		},

		updatePosition: function(){
			var me = this;

			var pos = $('.add-member').offset();

			if(pos){
				me.$el.css({
					left: pos.left + 19,
					top: pos.top + 60
				});
			}else{
				setTimeout(function(){
					me.updatePosition();
				}, 200);
			}
		},

		hide: function(){
			var me = this;
			me.clear();
			me.$el.fadeOut('fast');
		},

		initEvents: function(){
			var me = this;

			var timer;

			$('body').on('click', function(){
				me.hide();
			});

			me.$el.on('click', function(e){
				e.stopPropagation();
			});

			me.$input.on('keyup', function(){

				var $this = $(this);

				if(timer){
					clearTimeout(timer);
				}

				timer = setTimeout(function(){
					var val = $.trim($this.val());

					if(val){
						me.doSearch(val);
					}else{
						me.clear();
					}
				}, 100);
			});

			me.$close.on('click', function(){
				me.hide();
			});

		},

		doSearch: function(val){
			var me = this;

			me.xhr && me.xhr.abort();

			me.$listWrapper.show();

			me.inputValue = val;
			me.$list.empty();

			me.xhr = $.ajax({
				url: Common.listUrl,
				cache: false,
				dataType: 'json',
				data: $.param({
					name: val,
					start: 0,
					limit: 6
				}),
				context: me
			}).done(me.renderList);

		},

		renderList: function(data){
			var me = this;

			if(data && data.list && data.list.length){

				me.collection = data.list;

				var html = '';

				_.each(data.list, function(i){
					html += me.itemTpl(i);
				});

				me.$list.html(html);

				me.addEvents();
			}else{
				var $empty = $('<span class="info">').text(Common.lang.no_match_member).wrap('<li>').parent();
				me.$list.html($empty);
			}

			if(!emailReg.test(me.inputValue)){
				var $info = $('<span class="info">').text(Common.lang.email_add_member).wrap('<li class="extra">').parent();
				me.$list.append($info);
			}

		},

		addEvents: function(){
			var me = this;

			me.$list.children().each(function(i){
				var el = $(this);

				var model = me.collection[i];
				el.data('model', model);

				el.on('click', {el: el, scope: me}, me.onAdd);
				
			});
		},

		onAdd : function(e){
			e.preventDefault();

			var $el = e.data.el;
			var me = e.data.scope;
			var model = $el.data('model');

			$.ajax({
				url: Common.addUserUrl,
				cache: false,
				dataType: 'json',
				data: $.param({
					uid: model.id,
					id: me.id
				})
			}).done(function(data){

				if(data && data.success){
					$(me).triggerHandler('add', [me.id, model.name]);
					me.clear();
					me.updatePosition();
				}else if(data && data.error_code == 706){

					$(me).triggerHandler('addFailed', [me.id, model.name]);
				}else{
					Common.msg(Common.lang.add_failed);
				}
			});
		},

		clear: function(){
			var me = this;
			me.$input.val('');
			me.$listWrapper.hide();
		}

	};

	return MemberDialog;
});

