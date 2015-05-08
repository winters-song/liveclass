define([
	'jquery',
	'underscore',
	'common',
	'jwplayer',
	'views/class/base',
	'views/class/recommend',
	'text!templates/class/classItem.html',
	'text!templates/class/tapedItem.html',
	'text!templates/teacher/infoBox.html',
	'models/Type'
],function ($, _, Common, jwplayer, Base, RecommendView,  classTpl, tapedTpl, teacherTpl) {

	'use strict';
    
	var BoardView = function(){

		var me = this;

		$.extend(me, Base, {
			repaint: function(e, el, model){
				var me = e.data;

				if(me.classId == model.clid){
					me.renderButton(model);
				}else{
					if(me.isTaped(model)){
						var json = me.preprocessTaped(model);
						var html = me.tapedTpl(json);

						var $fragment = $(html).children();
						el.html($fragment);

					}else{
						var json = me.preprocessClass(model);
						var html = me.classTpl(json);

						var $fragment = $(html).children();
						el.html($fragment);
						me.addEvent(el, model);
					}
				}
				
			}
		});
		me.initHash();
		me.render();	
		me.initEvents();

		new RecommendView(me.classId);
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
		  this.classId = hashData.id;
	  },

	  initEvents: function(){
	  	var me = this;
	  	$(me).on('repaint', me, me.repaint);
	  },

		render: function(){
			var me = this;

			me.$el = $('#main-body');

			me.classTpl = _.template(classTpl);
			me.tapedTpl = _.template(tapedTpl);

			if(!me.classId){
				return;
			}

			$.ajax({
				url: Common.api.classInfoUrl,
				data: $.param({
					id: me.classId,
					status: 1
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
      		_name: data.name,
      		_owner: data.owner,
      		_id: data.clid,
      		_editable: data.editable,
      		_deletable: data.deletable,
      		_status: data.status
      	});

				var fragment = _.template(tpl, cfg);
				this.$el.html(fragment);

				this.renderData();
			});
		},

		renderData: function(){
			var me = this;

			Common.setTitle(me.data.name);

			$('#remove-btn', me.$el).on('click', {scope: me, id: me.data.clid}, me.onRemove);

			me.$classList = $('#class-list', me.$el);

			me.renderMulti($('#class-language', me.$el), Common.api.languageUrl, me.data.language);
			me.renderMulti($('#class-category', me.$el), Common.api.categoryUrl, me.data.category);
			me.renderMulti($('#class-target', me.$el), Common.api.targetUrl, me.data.target);
			me.renderMulti($('#class-level', me.$el), Common.api.levelUrl, me.data.level);
			me.renderMulti($('#class-form', me.$el), Common.api.formUrl, me.data.learning);
			me.renderMulti($('#class-goal', me.$el), Common.api.goalUrl, me.data.teaching);
			me.renderMulti($('#class-skill', me.$el), Common.api.skillUrl, me.data.content);
			
			var description = me.data.description.split(/\n/).join('</p><p>');
			description = '<p>' + description + '</p>';
			
			$('#class-description', me.$el).html(description);

			$('.more-link', me.$el).attr('href', Common.teacherClassLink + me.data.uid);

			me.createVideo();
			me.renderTeacher();
			me.renderClasses();
		},

		createVideo: function(){

			var me = this;
			var json = {
		    "name": "野生动物",
		    "uid": "158",
		    "status": "1",
		    "id": "1795",
		    "description": "野生动物",
		    "filesize": "26246026",
		    "ext": "wmv",
		    "uploadtime": "1430115731",
		    "rid": "35d8613b99ea4efda022a8b11dc1f572",
		    "transcoding_status": "ready",
		    "type": "video",
		    "preview": {
	        "highDefinitionUrl": "http://convertweb.chinesecio.com/ConvertManagerWeb/video/fffcc490b19b4f59adba20dcbaa02993.mp4",
	        "standardDefinitionUrl": "http://convertweb.chinesecio.com/ConvertManagerWeb/video/1cafeb70683d45128fdbeb0ec98eed78.mp4",
	        "superDefinitionUrl": "http://convertweb.chinesecio.com/ConvertManagerWeb/video/87e5943a4c5d49faaf3d5bd77bc469fd.mp4",
	        "thumbUrl": "http://convertweb.chinesecio.com/ConvertManagerWeb/thumb/017f290c46504ab69d07f5e7d985cab1.jpg"
		    }
			};

			if(json && json.preview && json.preview.highDefinitionUrl){
				me.$content = $('#file-content', me.$el);
				me.$content.html($('<div id="file-video">'));

				var height = window.outerWidth > 500 ? 400 : 200;

				var player = jwplayer('file-video').setup({
	        file: json.preview.highDefinitionUrl,	//standardDefinitionUrl
	        image: json.preview.thumbUrl,
	        flashplayer: '/Public/js/libs/jwplayer/jwplayer.flash.swf',
    			html5player: '/Public/js/libs/jwplayer/jwplayer.html5.js',
	        width: '100%',
	        height: height
		    }).onPause(function(){
		    	console.log('onPause');
		    }).onPlay(function(){
		    	console.log('onPlay');
		    	console.log("Position: " + this.getPosition());
		    	console.log("Duration: " + this.getDuration());
		    }).onComplete(function(){
		    	console.log('onComplete');
		    });

			}
		},

		onRemove: function(e){
			e.preventDefault();

			var me = e.data.scope;
			var id = e.data.id;

			bootbox.confirm(Common.lang.confirm_class_remove,  function(state){
        if(!state){
          return;
        }

        $.ajax({
          url: Common.api.classDeleteUrl,
          data: $.param({
          	id: id
          }),
          async: true,
          cache: false,
          type: 'post',
          dataType: 'json'
        }).done(function(data){
          if(data && data.success){
          	window.location.href = "myClass_t.html";
          }else{
          	bootbox.alert(Common.lang.remove_failed);
          }
        });
        
      });
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

					var summary = _.template(Common.lang.class_share_info, {
						teacher : name,
						title: me.data.name,
						CIO: Common.lang.CIO_full
					});

					$.extend(window.jiathis_config, {
						title: ' ',
						summary : summary
					});

    		}
    	});
    },

    renderPage: function(){

			var me = this;

			me.data = $.ajax({
				url: Common.api.classInfoUrl,
				data: $.param({
					id: me.classId
				}),
        cache:false,
        dataType:'json',
        context:me
      }).done(function(data){
      	this.data = data;
      	this.renderButton(data);
      	if(data.is_open == '1'){
      		this.renderStudents();
      	}
      	this.renderClasses();
      });
		},

    renderButton: function(json){
    	var me = this;

    	json = me.classTranslate(json);

			json.seats_num = 0;
			json.seats_status = 0;
			json.signup_url = '#';
			if(json.seats){
				json.seats_num = json.remain_seat;
				json.seats_status = json.seats.status;
				json.signup_url = json.seats.signup_url || '#';
			}

			var tpl = $('#buttonTpl').html();
			var fragment = _.template(tpl, json);
			$('#join-box', me.$el).html(fragment);

			me.addButtonEvents();
    },

    addButtonEvents: function(){
			var me = this;

			var el = $('#join-box', me.$el);

			var model = me.data;
			el.data('model', model);

			if(model.seats && model.remain_seat == 0){
				el.find('.join-btn').remove();
			}else{
				el.find('.join-btn').on('click', {el: el, scope: me}, me.onJoin);
			}
			
			el.find('.cancel-btn').on('click', {el: el, scope: me}, me.onCancel);
			el.find('.enter-btn').on('click', {el: el, scope: me}, me.onEnter);

			if(model.has_replay && Common.replayEnabled){
				el.find('.replay-btn').on('click', {el: el, scope: me}, me.onReplay);
			}else{
				el.find('.replay-btn').remove(); 
			}
		},

    renderClasses: function () {
    	var me = this;

    	me.$classList.empty();

			var params = $.param({
				id: me.classId,
				teacher_id: me.data.uid,
				order:'asc',
				start: 0,
				limit: me.limit
			});

			$.ajax({
				url: Common.api.otherClassUrl,
				async: true,
				cache: false,
				dataType: 'json',
				data: params,
				context: me
			}).done(function(data){
				if(data && data.list && data.list.length){
					this.classCollection = data.list;
					this.initClassList(data.list);
					this.addClassEvents();
				}else{
	    		var $msg = $('<p>').addClass('bg-info').text(Common.lang.no_other_class_msg);
					me.$classList.html($msg);
	    	}
			});
    },

    initClassList: function(data){
			var me = this;

			var html = '';

			_.each(data, function(i){
				if(me.isTaped(i)){
					var json = me.preprocessTaped(i);
					html += me.tapedTpl(json);
				}else{
					var json = me.preprocessClass(i);
					html += me.classTpl(json);
				}
			});

			me.$classList.html(html);
		},

		addClassEvents: function(){
			var me = this;

			me.$classList.children().each(function(i){
				var el = $(this);
				var model = me.classCollection[i];
				me.addEvent(el, model);
			});
		}

	};

	return BoardView;
    
});