define([
	'jquery',
	'underscore',
	'common',
	'views/mixins/list',
	'views/class/base',
	'text!templates/class/classItem.html',
	'text!templates/class/tapedItem.html',
	'datetimepicker'
],function ($, _, Common, List, Base, classTpl, tapedTpl) {

	'use strict';
    
	var BoardView = function(){
		var me = this;

		$.extend(me, List, Base, {
			listUrl: Common.api.classListUrl_s,

			afterPreprocess: function(json){
				json.seats_num = -1;
				json.seats_status = 1;
				json.signup_url = '#';
				return json;
			}
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
      me.$start = $('#startdate', me.$el); 
      me.$end = $('#enddate', me.$el); 

      me.$date_asc = $('#date_asc', me.$el); 
      me.$date_desc = $('#date_desc', me.$el); 
      me.$date_order = $('#date_order', me.$el); 

      me.$searchInput = $('input[name=name]', me.$form);
		},

		translate: function(){
      var title = Common.lang.my_class;
      Common.setTitle(title);
    },

		initEvents: function(){
			var me = this;

			me.$searchInput.on('keyup', function(e){
				if(e.keyCode == 13){
					e.preventDefault();
					Common.forward(1);
				}
      });

      $('.search-btn', me.$form).on('click', function(e){
        e.preventDefault();
        Common.forward(1);
      });

      me.$state.on('change', function(){
				Common.forward(1);
			});

			me.$date_asc.on('click', function(){
				me.$date_order.val('');
				Common.forward(1);
			});

			me.$date_desc.on('click', function(){
				me.$date_order.val(1);
				Common.forward(1);
			});

      $(me).on('repaint', me, function(){
      	me.renderPage();
      });
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

			me.setOrder(cfg.order);

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

			me.$state.find('input').each(function(){
				var val = $(this).val();
				var bool = val == (cfg.state||'');

				$(this).prop('checked', bool);
				if(bool){
					$(this).parent().addClass('active');
				}else{
					$(this).parent().removeClass('active');
				}
			});

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

     	return result;
		}
	};

	return BoardView;
    
});