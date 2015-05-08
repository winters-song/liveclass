define([
	'jquery',
	'underscore',
	'common',
	'views/mixins/list',
	'views/courseware/base',
	'views/courseware/addDialog',
	'views/courseware/editDialog',
	'text!templates/courseware/coursewareItem_t.html',
	'pagingBar',
	'easing',
	'vgrid',
  'moment',
  'models/Courseware'
],function ($, _, Common, List, Base, AddDialog, EditDialog, itemTpl ) {

	'use strict';
    
	var BoardView = function(){
		var me = this;

		$.extend(me, List, Base, {
			listUrl: Common.api.coursewareListUrl_t,

			preprocess: Base.preprocess_t,
			addEvent: 	Base.addEvent_t,

			afterRender: function(){
				var me = this;

				var status = this.$is_status.val();
				if(status == 2){
					this.$msg.text(Common.lang.file_encoding_msg).slideDown('slow');
				}else{
					this.$msg.text(Common.lang.courseware_upload_msg).slideDown('slow');
				}
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
			me.$msg = $('#courseware_upload_msg', me.$el);

			var filter = _.template($('#filterTpl').html(), Common.lang);
			me.$form.html(filter);

			me.$type = $('input[name=type]', me.$form);
			me.$is_status = $('[name=is_status]', me.$form);
			me.$searchInput = $('input[name=display_name]', me.$form);

			me.tpl = _.template(itemTpl);

			me.addDialog = new AddDialog();
			me.editDialog = new EditDialog();
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

			me.$is_status.on('change', function(){
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

      $(me.addDialog).on('success', function () {
		    me.$is_status.val(2);
		    Common.forward(1);
		  });

		  $(me.editDialog).on('success', function () {
		    Common.refresh();
		  });
		},

		setFilters: function(cfg){
			var me = this;
			me.filters = cfg;
			cfg.is_status = cfg.is_status || 1;
			me.$searchInput.val(cfg.display_name);
			me.$is_status.val(cfg.is_status);
			
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

			if(cfg.is_status == 2){
				me.$msg.hide();
			}else{
				me.$msg.text(Common.lang.courseware_upload_msg).show();
			}
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

		setType: function(type){
			this.$type.filter('[value='+type+']').prop('checked', true);
		}

	};

	return BoardView;
    
});