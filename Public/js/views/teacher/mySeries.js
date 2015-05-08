define([
	'jquery',
	'underscore',
	'common',
	'views/mixins/list',
	'views/series/base',
	'text!templates/series/seriesItem_t.html'
],function ($, _, Common, List, Base, itemTpl) {

	'use strict';
    
	var BoardView = function(){
		var me = this;

		$.extend(me, List, Base, {
			listUrl: Common.api.seriesListUrl_t,

			addEvent: 	Base.addEvent_t
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
			
			me.tpl = _.template(itemTpl);

      me.$searchInput = $('input[name=name]', me.$form);
      me.$state = $('[name=state]', me.$form);

		},

		translate: function(){
      var title = Common.lang.nav_myseries;
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

      me.$form.on('submit', function(e){
        e.preventDefault();
        Common.forward(1);
      });

      $(me).on('repaint', me, me.repaint);
		},

		setFilters: function(cfg){
			var me = this;
			me.filters = cfg;
			me.$searchInput.val(cfg.name);
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