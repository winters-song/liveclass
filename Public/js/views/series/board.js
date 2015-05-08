define([
	'jquery',
	'underscore',
	'common',
	'views/mixins/list',
	'views/series/base',
	'text!templates/series/seriesItem.html',
	'views/utils/typeCollector',
	'models/Type'
],function ($, _, Common, List, Base, itemTpl, TypeCollector) {

	'use strict';
    
	var BoardView = function(){
		var me = this;

		$.extend(me, List, Base, {
			listUrl: Common.api.seriesListUrl
		});

		if(Common.isAdmin){
			$.extend(Common.api, Common.api.admin);
		}
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

			me.$state = $('#state-group', me.$el); 
			me.$teacherId = $('#teacher-id', me.$el); 
      me.$teacherBox = $('#teacher-box', me.$el); 
      me.$teacherName = $('input[name=teacher_name]', me.$el); 

      me.$searchInput = $('input[name=name]', me.$form);

      me.initFilters();
		},

		translate: function(){
      var title = Common.lang.nav_series;
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
				Common.forward(1);
			});

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

      me.$teacherBox.find('.remove-btn').on('click', function(){
				me.$teacherId.val('');
				me.$teacherBox.hide();
				Common.forward(1);
			});

      $(me).on('repaint', me, me.repaint);
		},

		setFilters: function(cfg){
			var me = this;
			me.filters = cfg;
			me.$searchInput.val(cfg.name);
			me.$teacherId.val(cfg.teacher_id);

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
				var bool = val == (cfg.recommend ||'');

				$(this).prop('checked', bool);
				if(bool){
					$(this).parent().addClass('active');
				}else{
					$(this).parent().removeClass('active');
				}
			});

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

		getFilters: function(){
			var me = this;
			var result = {};

      var values = me.$form.serializeArray();

      _.each(values, function(i){
        result[i.name] = i.value;
      });

      $.extend(result, me.typeCollector.getValues());
      delete result.teacher_name;

     	return result;
		}
	};

	return BoardView;
    
});