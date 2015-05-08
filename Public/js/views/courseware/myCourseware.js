define([
	'jquery',
	'underscore',
	'common',
	'views/mixins/list',
	'views/courseware/base',
	'text!templates/courseware/coursewareItem.html',
  'moment',
  'models/Courseware'
],function ($, _, Common, List, Base, itemTpl ) {

	'use strict';
    
	var BoardView = function(){
		var me = this;

		$.extend(me, List, Base, {
			listUrl: Common.api.coursewareListUrl_s
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

			var filter = _.template($('#filterTpl').html(), Common.lang);
			me.$form.html(filter);

			me.$type = $('#type-group', me.$form);
			me.$searchInput = $('input[name=display_name]', me.$form);

			me.tpl = _.template(itemTpl);
		},

		translate: function(){
      var title = Common.lang.nav_mycourseware;
      Common.setTitle(title);
    },

		initEvents: function(){
			var me = this;

			me.$type.on('change', function(){
				Common.forward(1);
			});

			me.$form.on('submit', function(e){
				e.preventDefault();
				Common.forward(1);
      });

      $('.search-btn', me.$form).on('click', function(e){
        e.preventDefault();
        Common.forward(1);
      });
		},

		setFilters: function(cfg){
			var me = this;
			me.filters = cfg;
			me.$searchInput.val(cfg.display_name);

			me.$type.find('input').each(function(){
				var val = $(this).val();
				var bool = val == (cfg.type||'');

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