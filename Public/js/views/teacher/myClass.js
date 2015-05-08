define([
	'jquery',
	'underscore',
	'common',
	'views/mixins/list',
	'views/class/base',
	'text!templates/class/classItem_t.html',
	'text!templates/class/tapedItem_t.html',
	'moment'
],function ($, _, Common, List, Base, classTpl, tapedTpl) {

	'use strict';
    
	var BoardView = function(){
		var me = this;

		$.extend(me, List, Base, {
			listUrl: Common.api.classListUrl_t,

			preprocess: Base.preprocess_t,
			addEvent: 	Base.addEvent_t,

			initList: function(data){
				var me = this;

				var html = '';

				_.each(data, function(i){
					if(me.isTaped(i)){
						var json = me.preprocessTaped_t(i);
						html += me.tapedTpl(json);
					}else{
						var json = me.preprocessClass_t(i);
						html += me.classTpl(json);
					}
				});

				me.$list.html(html);

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
			}
		});
		me.render();
		me.initEvents();
	};

	BoardView.prototype = {

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
			me.$reward = $('#help-btn', me.$el);
			
			me.classTpl = _.template(classTpl);
			me.tapedTpl = _.template(tapedTpl);

      me.$searchInput = $('input[name=name]', me.$form);
      me.$state = $('#state-group', me.$el); 

      me.$date_asc = $('#date_asc', me.$el); 
      me.$date_desc = $('#date_desc', me.$el); 
      me.$date_order = $('#date_order', me.$el); 

      if(Common.isCIOTeacher){
      	me.$reward.show();
      }else{
      	me.$reward.remove();
      }

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

      me.$state.on('change', function(){
				Common.forward(1);
			});

      $('.search-btn', me.$form).on('click', function(e){
        e.preventDefault();
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

      me.$form.on('submit', function(e){
        e.preventDefault();
        Common.forward(1);
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

		getFilters: function(){
			var me = this;
			var result = {};

      var values = me.$form.serializeArray();

      _.each(values, function(i){
        result[i.name] = i.value;
      });

     	return result;
		}
	};

	return BoardView;
    
});