define([
	'jquery',
	'underscore',
	'common',
	'views/mixins/list',
	'views/class/base',
	'views/series/base',
	'text!templates/class/classItem.html',
	'text!templates/class/classItem_t.html',
	'text!templates/series/seriesItem.html',
	'text!templates/series/seriesItem_t.html',
	'models/Profile'
],function ($, _, Common, List, ClassBase, SeriesBase, classTpl, classTpl_t, seriesTpl, seriesTpl_t) {

	'use strict';
    
	var BoardView = function(){

		var me = this;

		me.initHash();

		me.owner = Common.userInfo.ID == me.uid;

		$.extend(me, List, {

			backToTop: false,

			getFilters: function(){
				return {
					teacher_id: me.uid
				};
			},
			
			onPaging: function(val){
				me.renderPage(val);
			}
		});

		me.render();
	};

	BoardView.prototype = {

		showMsg: function(msg){
      bootbox.alert(msg);
    },

    initHash : function () {
	  	var hash = window.location.href;
		  var hashData = hash.queryStringToJSON(); 
		  this.uid = hashData.id;
	  },

	  initEvents: function(){
	  	var me = this;

	  	if(Common.isAdmin){
	  	}

	  	me.$nav.on('click', me, function(e){
				e.preventDefault();
				e.data.setActive($(this));
			});
	  },

	  setActive: function(index){
			var me = this;
			var el;

			if($.isNumeric(index)){
				el = me.$nav.eq(index).addClass('active');
			}else{
				el = index;
			}

			me.currentType = el.data('type');

			if(me.currentType == 'class'){
				me.renderClass();
			}else if(me.currentType == 'series'){
				me.renderSeries();
			}
		},

		render: function(){
			var me = this;

			me.$el = $('#main');

			me.$list = $('.item-list', me.$el);
			me.$paging = $('.pagingbar', me.$el);

			var tabs = $('#tabTpl').html();
			var html = _.template(tabs, Common.lang);
			$('.toolbar', me.$el).append(html);
			me.$nav = $('.toolbar li', me.$el);

			if(!me.uid){
				return;
			}
			me.loadData();

			me.setActive(0);
    	me.initEvents();
		},

		loadData: function(){
			var me = this;

			$.ajax({
    		url: Common.api.teacherInfoUrl,
    		cache: false,
    		data: $.param({
    			id: me.uid
    		}),
    		dataType: 'json'
    	}).done(function(data){
    		if(data && data.id){
    			me.data = data;
    			me.renderUser();
    		}
    	});
		},

		renderUser: function(){
			var me = this;
			var data = me.data;

			var tpl = $('#teacherTpl').html();

			var name = data.nickname || data.name;

			var cfg = $.extend({}, Common.lang, {
				thumbUrl: data.Avatar,
				_owner: me.owner,
				t_name: name,
				org_name : data.org || '',
				org_logo: data.org_logo,
				class_num: data.class_num || '0',
				series_num: data.series_num || '0'
			});

			Common.getTeacherStar(data, cfg, data.id);

			var fragment = _.template(tpl, cfg);
			me.$banner = $('#user-banner', me.$el);
			me.$banner.html(fragment);

			me.initUser();

			me.renderDescription();
		},

		initUser: function(){
			var me = this;

			if(!me.owner){
				return;
			}

			var $editor = $('.editor', me.$banner);
			var $input = $('input', me.$banner);
			var $content = $('.name', me.$banner);
			$content.tooltip();

			$content.on('click', function(){
				$input.val(me.data.nickname || me.data.name);
				$(this).addClass('hidden');
				$editor.removeClass('hidden');
				$input.focus();
			});

			$input.on('keydown', function(e){

				if(e.keyCode == 13){

					var val = $input.val();
					if(val){
						me.nameXhr && me.nameXhr.abort();

						me.nameXhr = $.ajax({
							url: Common.api.nicknameEditUrl,
							cache: false,
							type: 'post',
							data: $.param({
								nickname: val
							}),
							dataType: 'json'
						}).done(function(data){
							if(data && data.success){
								me.data.nickname = val;
								$content.html(val);
								$('#profiles .name').html(val);
								$input.val('');
								$editor.addClass('hidden');
								$content.removeClass('hidden');
								$content.blur();
							}else{
								Common.alert(Common.lang.save_failed);
							}
						}).fail(function(){
							Common.alert(Common.lang.save_failed);
						});
					} else {
						$editor.addClass('hidden');
						$input.val('');
						$content.removeClass('hidden');
					}
					
				} else if (e.keyCode == 27){
					$editor.addClass('hidden');
					$input.val('');
					$content.removeClass('hidden');
				}
				
			});

			$input.on('blur', function(e){
				$editor.addClass('hidden');
				$input.val('');
				$content.removeClass('hidden');
			});
		},

		renderDescription: function(){
			var me = this;

			var description = me.data.description || '';
			var error = '';

			if(description && (me.owner || (!me.owner && me.data.description_status == '2'))) {
				description = description.split(/\n/).join('</p><p>');
				description = '<p>' + description + '</p>';
			} else{
				description = '';
			}

			if(me.owner){
				if(me.data.description_status == '3'){
					error += Common.lang.profile + ' : ' + Common.lang.audit_failed;
				}

				if(error){
					error += '<br/>('+ Common.lang.teacher_info_failed + ')';
				}
			}

			var cfg = $.extend({}, Common.lang, {
				_owner: me.owner,
				_description : description,
				_error : error
			});

			var tpl = $('#descriptionTpl').html();

			var fragment = _.template(tpl, cfg);
			me.$description = $('.description', me.$el);
			me.$description.html(fragment);

			me.initDescription();
		},

		setDescription: function(val){
			var me = this;

			me.data.description = val;

			var description = val || '';
			if(description) {
				description = description.split(/\n/).join('</p><p>');
				description = '<p>' + description + '</p>';
			}

			$('.content', me.$description).html(description);
		},

		initDescription: function(){
			var me = this;

			if(!me.owner){
				return;
			}

			var $editor = $('.editor', me.$description);
			var $addBox = $('.add-box', me.$description);
			var $addBtn = $('#description-btn', me.$description);
			var $textarea = $('textarea', me.$description);
			var $saveBtn = $('#description-save-btn', me.$description);
			var $cancelBtn = $('#description-cancel-btn', me.$description);
			var $content = $('.content', me.$description);
			$content.tooltip();

			$addBtn.on('click', function(e){
				$editor.removeClass('hidden');
				$addBox.addClass('hidden');
				$textarea.height('auto');
				$textarea.val(me.data.description);
			});

			$content.on('click', function(){
				$textarea.val(me.data.description);
				var height = $content.height();
				height = height > 80? height: 80;
				$textarea.height(height);
				$(this).addClass('hidden');
				$addBox.addClass('hidden');
				$editor.removeClass('hidden');
				$textarea.focus();
			});

			$saveBtn.on('click', function(e){
				var $btn = $(this);

				var val = $textarea.val();
				$btn.button('loading');
				me.profileXhr && me.profileXhr.abort();

				me.profileXhr = $.ajax({
					url: Common.api.profileEditUrl,
					cache: false,
					type: 'post',
					data: $.param({
						description: val
					}),
					dataType: 'json'
				}).done(function(data){
					if(data && data.success){
						me.setDescription(val);
						$textarea.val('');
						$editor.addClass('hidden');
						$content.removeClass('hidden');

						if(!val){
							$addBox.removeClass('hidden');
						}
					}else{
						Common.alert(Common.lang.save_failed);
					}
				}).fail(function(){
					Common.alert(Common.lang.save_failed);
				}).always(function(){
					$btn.button('reset');
				});
			});

			$textarea.on('keydown', function(e){
				if(e.keyCode == 27){
					$editor.addClass('hidden');
					$textarea.val('');

					$content.removeClass('hidden');
					if(!me.data.description){
						$addBox.removeClass('hidden');
					}
				}
			});

			$cancelBtn.on('click', function(e){
				$editor.addClass('hidden');
				$textarea.val('');

				$content.removeClass('hidden');
				if(!me.data.description){
					$addBox.removeClass('hidden');
				}
			});
		},

		renderClass: function(){
			var me = this;

			if(me.owner){

				$.extend(me, ClassBase, {
					listUrl: Common.api.classListUrl_t,
					tpl : _.template(classTpl_t),

					preprocess: ClassBase.preprocess_t,
					addEvent: 	ClassBase.addEvent_t
				});

			} else {
				$.extend(me, ClassBase, {
					listUrl: Common.api.classListUrl,
					tpl : _.template(classTpl)
				});
			}

			me.renderPage(1);
		},

		renderSeries: function(){
			var me = this;

			if(me.owner){

				$.extend(me, SeriesBase, {
					listUrl: Common.api.seriesListUrl_t,
					tpl : _.template(seriesTpl_t),

					addEvent: 	SeriesBase.addEvent_t
				});

			} else {	
				$.extend(me, SeriesBase, {
					listUrl: Common.api.seriesListUrl,
					tpl : _.template(seriesTpl)
				});
			}

			me.renderPage(1);
		}

	};

	return BoardView;
    
});