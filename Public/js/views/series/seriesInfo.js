define([
	'jquery',
	'underscore',
	'common',
	'views/series/base',
	'views/series/classList',
	'views/class/recommend',
	'text!templates/series/seriesItem.html',
	'text!templates/teacher/infoBox.html',
	'models/Type'
],function ($, _, Common, Base, ListView, RecommendView, tpl, teacherTpl) {

	'use strict';
    
	var BoardView = function(){

		var me = this;

		$.extend(me, Base);

		me.initHash();
		me.render();	

		// new RecommendView(me.classId);
	};

	BoardView.prototype = {

		classCollection: [],

		limit: 3,

		showMsg: function(msg){
      bootbox.alert(msg);
    },

    initHash : function () {
	  	var hash = window.location.href;
		  var hashData = hash.queryStringToJSON(); 
		  this.seriesId = hashData.id;
	  },

	  initEvents: function(){
	  	var me = this;

	  	if(Common.isAdmin){
	  		$('#edit-btn', me.$el).attr('href', 'editSeries.html?admin=1&id=' + me.seriesId);
	  		$.extend(Common.api, Common.api.admin);
	  	}

			var $remove = $('#remove-btn', me.$el);
			$remove.data('model', {
				sid: me.seriesId
			});
	  	$remove.on('click', { scope:me, el: $remove}, me.onRemove);

	  	me.$follow = $('#follow-btn', me.$el);
			me.$followed = $('#followed-btn', me.$el);
	  	me.$follow.on('click', { scope: me, val: 1}, me.onFollow);
	  	me.$followed.on('click', { scope: me, val: 2}, me.onFollow);
	  },

	  onFollow: function(e){
			e.preventDefault();

			var me = e.data.scope;
			var val = e.data.val;

      $.ajax({
        url: Common.api.seriesFollowUrl,
        data: $.param({
        	id: me.seriesId,
        	status: val
        }),
        async: true,
        cache: false,
        dataType: 'json'
      }).done(function(data){
        if(data && data.success){
        	if(val == 1){
        		me.$follow.addClass('hidden');
        		me.$followed.removeClass('hidden');
        	}else{
        		me.$followed.addClass('hidden');
        		me.$follow.removeClass('hidden');
        	}
        }
      });
      
		},

		//used for delete action
		renderPage: function(){
			window.location.href = 'mySeries_t.html';
		},

		render: function(){
			var me = this;

			me.$el = $('#main-body');

			if(!me.seriesId){
				return;
			}

			$.ajax({
				url: Common.api.seriesInfoUrl,
				data: $.param({
					id: me.seriesId
				}),
        cache:false,
        dataType:'json',
        context: me
      }).done(function(data){

      	if(!data){
      		return;
      	}
      	this.data = data;

      	var tpl = $('#pageTpl').html();

      	var cfg = $.extend({}, Common.lang, {
      		_title: data.title,
      		_thumb: data.thumb || this.defaultImg,
      		_owner: data.owner || Common.isAdmin,
      		_follow: data.follow,
      		_id: data.sid,
      		_editable: true,
      		_deletable: true,
      		_status: data.status
      	});

				var fragment = _.template(tpl, cfg);
				this.$el.html(fragment);

				this.renderData();
      });

		},

		renderData: function(){
			var me = this;

			Common.setTitle(me.data.title);

			me.renderMulti($('#series-language', me.$el), Common.api.languageUrl, me.data.language);
			me.renderMulti($('#series-category', me.$el), Common.api.categoryUrl, me.data.category);
			me.renderMulti($('#series-target', me.$el), Common.api.targetUrl, me.data.target);
			me.renderMulti($('#series-level', me.$el), Common.api.levelUrl, me.data.level);
			me.renderMulti($('#series-form', me.$el), Common.api.formUrl, me.data.learning);
			me.renderMulti($('#series-goal', me.$el), Common.api.goalUrl, me.data.teaching);
			me.renderMulti($('#series-skill', me.$el), Common.api.skillUrl, me.data.content);
			
			var description = me.data.description.split(/\n/).join('</p><p>');
			description = '<p>' + description + '</p>';
			
			$('#class-description', me.$el).html(description);

			$('.more-link', me.$el).attr('href', Common.teacherSeriesLink + me.data.uid);

			me.renderTeacher();

			me.classList = new ListView({
				series_id: me.seriesId,
				teacher_id: me.data.uid,
				owner: true,
				$el: $('#class-list', me.$el)
			});

			me.renderOtherList();

			me.initEvents();
		},

		renderMulti: function(el, url, str) {
      var val = str.split(',')[0];

      $.ajax({
        url: url,
        data: $.param({
          lang: Common.language
        }),
        cache: false,
        async: true,
        dataType: 'json'
      }).done(function(data){

      	_.each(data, function(i){
      		if( i.id == val){
      			el.text(i.name);
      			return false;
      		}
      	});
      });
    },

    renderTeacher: function(){
    	var me = this;

    	if(!me.data.uid){
    		return;
    	}

    	$.ajax({
    		url: Common.api.teacherInfoUrl,
    		cache: false,
    		data: $.param({
    			id: me.data.uid
    		}),
    		dataType: 'json'
    	}).done(function(data){
    		if(data && data.id){
    			var name = data.name || data.NickName;

    			var cfg = $.extend({}, Common.lang, {
						profileUrl: Common.profileLink + data.id,
						classLinkUrl: Common.teacherClassLink + data.id,
						seriesLinkUrl: Common.teacherSeriesLink + data.id,
						thumbUrl: data.Avatar,
						t_name: name,
						org_name : data.org || '',
						class_num: data.class_num || '0',
						series_num:  data.series_num || '0'
					});

					Common.getTeacherStar(data, cfg, data.id);

					var fragment = _.template(teacherTpl, cfg);
					var $info = $('.teacher-info', me.$el);
					$info.html(fragment);

					var $shareBox = $('#share-box');
					$shareBox.appendTo($("#share")).show();

					var summary = _.template(Common.lang.series_share_info, {
						teacher : name,
						title: me.data.title,
						CIO: Common.lang.CIO_full
					});

					$.extend(window.jiathis_config, {
						title: ' ',
						summary : summary
					});

    		}
    	});
    },

    renderOtherList: function(){
    	var me = this;

    	me.$otherList = $('#other-series', me.$el);
    	me.tpl = _.template(tpl);

    	var params = $.param({
				id: me.seriesId,
				teacher_id: me.data.uid,
				order:'asc',
				start: 0,
				limit: me.limit
			});

			$.ajax({
				url: Common.api.otherSeriesUrl,
				async: true,
				cache: false,
				dataType: 'json',
				data: params,
				context: me
			}).done(function(data){
				if(data && data.list && data.list.length){
					this.seriesCollection = data.list;
					this.initSeriesList(data.list);
					// this.addSeriesEvents();
				}else{
	    		var $msg = $('<p>').addClass('bg-info').text(Common.lang.no_other_series_msg);
					me.$otherList.html($msg);
	    	}
			});
    },

    initSeriesList: function(data){
			var me = this;

			var html = '';

			_.each(data, function(i){
				var json = me.preprocess(i);
				json.lecturer_realname = '';
				html += me.tpl(json);
			});

			me.$otherList.html(html);
		}
	};

	return BoardView;
    
});