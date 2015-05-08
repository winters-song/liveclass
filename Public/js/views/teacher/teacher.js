define([
	'jquery',
	'underscore',
	'common',
	'views/mixins/list',
	'text!templates/teacher/teacherItem.html',
  'select2'
],function ($, _, Common, List, itemTpl ) {

	'use strict';
    
	var BoardView = function(){
		var me = this;

		$.extend(me, List, {
			listUrl: Common.api.listUrl,

			afterGetFilter: function(cfg){
				return $.extend(cfg, {
					order:'asc'
				});
			},

			preprocess: function(i){
				var me = this;
				var json = me.itemTranslate(i);

				$.extend(json, {
					teacher_class_link: Common.teacherClassLink + json.id,
					user_link : Common.profileLink + json.id,
					lecturer_realname : json.lecturer_realname || json.lecturer_name
				});

				Common.getTeacherStar(json,json, json.id);

				return json;
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
			me.translate();

			me.tpl = _.template(itemTpl);

			me.$belongs = $('#belongs-list', me.$el);
			me.$orgBox = $('#org-box', me.$el);
			me.$org = $('#org-list', me.$el);

      me.$searchInput = $('input[name=name]', me.$form);

      me.schools = $.ajax({
        url:Common.api.schoolUrl,
        async:false,
        cache: true,
        type: 'get',
        dataType: 'json'
      }).responseJSON;

      me.orgs = $.ajax({
        url:Common.api.orgUrl,
        async:false,
        cache: true,
        type: 'get',
        dataType: 'json'
      }).responseJSON;

		},

		translate: function(){
			var title = Common.lang.teachers;
      Common.setTitle(title);
		},

		initEvents: function(){
			var me = this;

			me.$belongs.on('change', function(){
        Common.forward(1);
      });

      me.$org.on('change', function(){
        Common.forward(1);
      });

			me.$searchInput.on('keyup', function(e){
				if(e.keyCode == 13){
					e.preventDefault();
					Common.forward(1);
				}
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

		initSelect: function(){
      var me = this;
      var lang;

      me.$org.empty();
      me.$org.append('<option></option>');
      me.$org.select2('val','');

      var belongs = me.filters.belongs;

      if(belongs){
      	if(belongs == 'school'){

					lang = Common.language == 'cn'? 'cn': 'en';
	      
	        _.each(me.schools, function(model){
	          var val = model.groupID;
	          var title = model['cn'];
	          me.$org.append('<option value="'+val+'" >'+title+'</option>');
	        });

	      }else if(belongs == 'org'){
	        _.each(me.orgs, function(model){
	          var val = model.id;
	          var title = model.name;
	          me.$org.append('<option value="'+val+'" >'+title+'</option>');
	        });
	      }

	      me.$org.val(me.filters.org);

	      lang = Common.language;
	      if(lang == 'cn'){
	        lang = 'zh-CN';
	      }

	      if(lang != 'en'){
	        require(['libs/select2/select2_locale_'+lang], function(){
	          me.$org.select2();

	        });
	      }else{
	        me.$org.select2();
	      } 
        me.$orgBox.show();
      }
      else{
      	me.$orgBox.hide();
      }

    },

		setFilters: function(cfg){
			var me = this;
			me.filters = cfg;
			me.$belongs.val(cfg.belongs);  
			me.$searchInput.val(cfg.name); 

			me.initSelect();
		},

		getFilters: function(){
			var me = this;
			var result = {};

      var values = me.$form.serializeArray();

      _.each(values, function(i){
        result[i.name] = i.value;
      });

     	return result;
		},

		
		itemTranslate: function(json){
			var cfg = _.pick(Common.lang, [
				'gold_teacher',
	      'silver_teacher',
				'class_num_text'
			]);
			$.extend(json, cfg);
      
      return json;
    },

    
	};

	return BoardView;
    
});