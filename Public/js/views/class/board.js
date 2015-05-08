define([
	'jquery',
	'underscore',
	'common',
	'views/mixins/list',
	'views/class/base',
	'text!templates/class/classItem.html',
	'text!templates/class/tapedItem.html',
	'views/utils/typeCollector',
	'datetimepicker',
	'models/Type'
],function ($, _, Common, List, Base, classTpl, tapedTpl, TypeCollector ) {

	'use strict';
    
	var BoardView = function(){
		var me = this;

		$.extend(me, List, Base, {
			listUrl: Common.api.classListUrl
		});
		me.render();
		me.initEvents();
	};

	BoardView.prototype = {

		datepickerInited: false,

		render: function(){
			var me = this;
			me.$el = $('#main');

			me.translate();
			
			me.$list = $('.item-list', me.$el);
			me.$paging = $('.pagingbar', me.$el);
			me.$form = $('#search-form', me.$el);

			var html = $('#filterTpl').html();
			var filter = _.template(html, Common.lang);
			me.$form.html(filter);

			me.classTpl = _.template(classTpl);
			me.tapedTpl = _.template(tapedTpl);

      me.$state = $('#state-group', me.$el); 
      me.$teacherId = $('#teacher-id', me.$el); 
      me.$teacherBox = $('#teacher-box', me.$el); 
      me.$teacherName = $('input[name=teacher_name]', me.$el); 

      me.$date_asc = $('#date_asc', me.$el); 
      me.$date_desc = $('#date_desc', me.$el); 
      me.$date_order = $('#date_order', me.$el); 
      me.$time_range = $('#time-range', me.$el);

      me.$start = $('#startdate', me.$el); 
      me.$end = $('#enddate', me.$el); 

      me.$searchInput = $('input[name=name]', me.$form);

      me.initFilters();
      
		},

		translate: function(){
      var title = Common.lang.classes;
      Common.setTitle(title);
    },

		initFilters: function(){
      var me = this;

      me.typeCollector = new TypeCollector({
	    	id: 'type-collector',
	    	items: [{
	    		id: 'category-picker',
	    		url: Common.api.categoryUrl,
	    		title: Common.lang.class_category,
	    		multiSelect: false,
	    		field: 'category'
	    	},{
	      	id: 'language-picker',
	      	url: Common.api.languageUrl,
	      	title: Common.lang.class_language,
	    		multiSelect: false,
	    		field: 'language'
	      },{
	      	id: 'target-picker',
	      	url: Common.api.targetUrl,
	      	title: Common.lang.class_target,
	    		multiSelect: false,
	    		field: 'target'
	      },{
	      	id: 'level-picker',
	      	url: Common.api.levelUrl,
	      	title: Common.lang.class_level,
	    		multiSelect: false,
	    		field: 'level'
	      },{
	      	id: 'form-picker',
	      	url: Common.api.formUrl,
	      	title: Common.lang.class_form,
	    		multiSelect: false,
	    		field: 'learning'
	      },{
	      	id: 'goal-picker',
	      	url: Common.api.goalUrl,
	      	title: Common.lang.class_goal,
	    		multiSelect: false,
	    		field: 'teaching'
	      },{
	      	id: 'skill-picker',
	      	url: Common.api.skillUrl,
	      	title: Common.lang.class_skill,
	    		multiSelect: false,
	    		field: 'content'
	      }],
	      onSelect: function(){
					Common.forward(1);
				}
	    });
    },

		initEvents: function(){
			var me = this;

			me.$state.on('change', function(){
				var val = $(this).find(':checked').val();
				if(val == 1){
					me.setOrder(1);
					me.$time_range.show();
				}else{
					me.setOrder();
					me.$time_range.hide();
				}

				if(val == 3){
					me.$start.parent().hide();
					me.$end.parent().hide();
				}else{
					me.$start.parent().show();
					me.$end.parent().show();
				}
				Common.forward(1);
			});

			me.$teacherBox.find('.remove-btn').on('click', function(){
				me.$teacherId.val('');
				me.$teacherBox.hide();
				Common.forward(1);
			});

			me.$searchInput.on('keyup', function(e){
				if(e.keyCode == 13){
					e.preventDefault();
					Common.forward(1);
				}
      });

      me.$date_asc.on('click', function(){
				me.$date_order.val('');
				Common.forward(1);
			});

			me.$date_desc.on('click', function(){
				me.$date_order.val(1);
				Common.forward(1);
			});

			me.$time_range.find('a').on('click', function(e){
				e.preventDefault();
				var type = $(this).data('type');
				me.setTimeRange(type);

				var label = $(this).text();
				me.$time_range.find('.text').text(label);
			})

      $('.search-btn', me.$form).on('click', function(e){
        e.preventDefault();
        Common.forward(1);
      });

      $(me).on('repaint', me, me.repaint);
		},

		setTimeRange: function(type){
			var me = this;

			var start, end, now = new Date();

			if(type == 'no_limit'){
				me.$start.find('input').val('');
				me.$end.find('input').val('');
				Common.forward(1);
				return;
			}else if(type == 'in_30mins'){
				start = now;
				end = new Date(start.getTime() + 1000 * 60* 30);
			}else if(type == 'today'){
				start = now;
				end = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 0,0,0);
			}else if(type == 'tomorrow'){
				start = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 0,0,0);
				end = new Date(now.getFullYear(), now.getMonth(), now.getDate()+2, 0,0,0);
			}else if(type == 'in_7days'){
				start = now;
				end = new Date(now.getFullYear(), now.getMonth(), now.getDate()+7);
			}else if(type == 'in_30days'){
				start = now;
				end = new Date(now.getFullYear(), now.getMonth(), now.getDate()+30);
			}

			start = moment(start).format(Common.dateFormat);
			end = moment(end).format(Common.dateFormat);
			me.$start.data("DateTimePicker").setDate(start);
			me.$end.data("DateTimePicker").setDate(end);
		},

		setOrder: function(val){
			var me = this;
			me.$date_order.val(val || '');

			if(val){
				me.$date_asc.show(); 
				me.$date_desc.hide(); 
			}else{
				me.$date_asc.hide(); 
				me.$date_desc.show(); 
			}
		},

		setFilters: function(cfg){
			var me = this;
			me.filters = cfg;
			me.$searchInput.val(cfg.name);
			me.$teacherId.val(cfg.teacher_id);

			me.setOrder(cfg.order);

			me.typeCollector.setValues({
				category : cfg.category,
				language : cfg.language,
				target : cfg.target,
				level : cfg.level,
				learning : cfg.learning,
				teaching : cfg.teaching,
				content : cfg.content
			});

			me.$state.find('input').each(function(){
				var val = $(this).val();
				var bool = val == (cfg.state||'');

				$(this).prop('checked', bool);
				if(bool){
					$(this).parent().addClass('active');

					if(val == 1){
						me.setOrder(1);
						me.$time_range.show();
					}else{
						me.setOrder();
						me.$time_range.hide();
					}

					if(val == 3){
						me.$start.parent().hide();
						me.$end.parent().hide();
					}else{
						me.$start.parent().show();
						me.$end.parent().show();
					}
				}else{
					$(this).parent().removeClass('active');
				}
			});


			if(!me.datepickerInited){
				var lang = Common.language;
	      if(lang == 'cn'){
	        lang = 'zh-CN';
	      }else if(lang == 'en'){
	        lang = 'en-gb';
	      }
	      
	      require(['libs/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.'+lang], function(){
	        me.initDatepickers(lang);
	      });
			}

      me.setTeacherBox(cfg.teacher_id);
		},

		setTeacherBox: function (id) {
			var me = this;

			if(id){
				$.ajax({
					url: Common.api.teacherInfoUrl,
					cache: false,
					data: $.param({
						id: id
					})
				}).done(function(data){
					if(data && data.name){
						me.$teacherName.val(data.name);
						me.$teacherBox.show();
					}else{
						me.$teacherBox.hide();
					}
				});
			}
		},

		initDatepickers: function (lang) {
			var me = this;

			me.$start.datetimepicker({
        language: lang,
        format : Common.dateFormat
      });

      me.$end.datetimepicker({
        language: lang,
        format : Common.dateFormat
      });

      if(!Modernizr.indexeddb){
      	var $startInput = me.$start.find('input');
			  $startInput.val(Common.lang.startdate);

			  var $endInput = me.$end.find('input');
			  $endInput.val(Common.lang.enddate);

			  $startInput.on('focus', function () {
			  	if($(this).val() == Common.lang.startdate){
			  		$(this).val('');
			  	}
			  });
			  $startInput.on('blur', function () {
			  	if(!$(this).val()){
			  		$(this).val(Common.lang.startdate);
			  	}
			  });
			  $endInput.on('focus', function () {
			  	if($(this).val() == Common.lang.enddate){
			  		$(this).val('');
			  	}
			  });
			  $endInput.on('blur', function () {
			  	if(!$(this).val()){
			  		$(this).val(Common.lang.enddate);
			  	}
			  });

			}

			if(me.filters.starttime){
				var start = moment(me.filters.starttime).format(Common.dateFormat);
      	me.$start.data('DateTimePicker').setDate(start);
			}

			if(me.filters.endtime){
	      var end = moment(me.filters.endtime).format(Common.dateFormat);
	      me.$end.data('DateTimePicker').setDate(end);
	    }

      me.$start.on('dp.change', function(){
				Common.forward(1);
			});
			
			me.$end.on('dp.change', function(){
				Common.forward(1);
			});

			if(Modernizr.indexeddb){
				me.$start.one('dp.show', function(){
					Common.forward(1);
				});
				me.$end.one('dp.show', function(){
					Common.forward(1);
				});
			}

			me.datepickerInited = true;
		},

		getFilters: function(){
			var me = this;
			var result = {};
			var date;

      var values = me.$form.serializeArray();

      _.each(values, function(i){
        result[i.name] = i.value;
      });

      $.extend(result, me.typeCollector.getValues());

      if(result.starttime){
      	if(result.starttime == Common.lang.startdate){
      		result.starttime = '';
      	}else{
      		date = me.$start.data('DateTimePicker').getDate();
      		result.starttime = date? date.valueOf() : '';
      	}
      }
      if(result.endtime){
      	if(result.endtime == Common.lang.enddate){
      		result.endtime = '';
      	}else{
      		date = me.$end.data('DateTimePicker').getDate();
      		result.endtime = date? date.valueOf() : '';
      	}
      }
      delete result.teacher_name;

     	return result;
		}
		
	};

	return BoardView;
    
});