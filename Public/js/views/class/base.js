define([
	'jquery',
	'underscore',
	'common',
	'models/Class'
],function ($, _, Common) {

	'use strict';

	return {

		classTranslate: function(json){

      var cfg = _.pick(Common.lang, [
				'live',
				'finished',
				'seat_remain',
				'lesson',
				'mins',
	      'join_class',
	      'replay_class',
	      'waiting_text',
	      'enter',
	      'cancel',
	      'sign_up',
	      'class_close',
	      'gold_teacher',
	      'silver_teacher',

	      'edit',
	      'view',
	      'remove',
	      'open_btn',
	      'close_btn',
	      'audit_failed',
	      'ask_admin',
	      'replay_status'
			]);
			$.extend(json, cfg);
      
      return json;
    },

    tapedTranslate: function(json){

    	var cfg = _.pick(Common.lang, [
	      'taped_class',
	      'gold_teacher',
	      'silver_teacher',

	      'edit',
	      'remove'
			]);
			$.extend(json, cfg);
      
      return json;
    },

		repaint: function(e, el, model){
			var me = e.data;

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
		},

		isTaped: function(i){
			return i.is_taped == '1';
		},

		preprocessClass: function(i){
			var me = this;

			var json = me.classTranslate(i);

			$.extend(json, {
				class_link : Common.classDetailsLink + json.clid,
				user_link : Common.profileLink + json.uid,
				lecturer_realname : i.lecturer_realname || i.lecturer_name,
				time : moment(json.starttime*1000).format('HH:mm'),
				date : moment(json.starttime*1000).format('YYYY/MM/DD'),
				seats_num : 0,
				seats_status : 0,
				duration : 0,
				signup_url : '#'
			});

			if(json.seats){
				json.seats_num = json.remain_seat; 
				json.seats_status = json.seats.status;
				json.signup_url = json.seats.signup_url || '#';
			}
			if( json.tr_time && json.tr_end_time ){
				json.duration = parseInt((json.tr_end_time - json.tr_time)/60);
			}

			Common.getTeacherStar(json, json, json.uid);

			return me.afterPreprocess(json);
		},

		preprocessTaped: function(i){
			var me = this;

			var json = me.tapedTranslate(i);

			$.extend(json, {
				taped_link : Common.tapedDetailsLink + json.clid,
				user_link : Common.profileLink + json.uid,
				lecturer_realname : i.lecturer_realname || i.lecturer_name
			});

			Common.getTeacherStar(json, json, json.uid);

			return me.afterPreprocess(json);
		},

		initList: function(data){
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
		},
	
		preprocessClass_t: function(i){
    	var me = this;
    	var json = me.classTranslate(i);

    	json.state_class = '';
    	json.state_title = '';

			if(json.state == 1){
				json.state_title = Common.lang.live;
			}else if(json.state == 2){
				json.state_title = Common.lang.in_class;
				json.state_class = 'in_class';
			}else if(json.state == 3){
				json.state_title = Common.lang.finished;
				json.state_class = 'finished';
			}

			if(json.status == '2'){
				json.state_class = 'disabled';
			}

			$.extend(json, {
				class_link : Common.classDetailsLink + json.clid,
				time : moment(json.starttime*1000).format('HH:mm'),
				date : moment(json.starttime*1000).format('YYYY/MM/DD'),
				duration : 0
			});

			if(json.tr_time && json.tr_end_time ){
				json.duration = parseInt((json.tr_end_time - json.tr_time)/60);
			}

			return json;
    },

    preprocessTaped_t: function(i){
    	var me = this;
    	var json = me.tapedTranslate(i);

			if(json.status == '2'){
				json.state_class = 'disabled';
			}

			$.extend(json, {
				taped_link : Common.tapedDetailsLink + json.clid
			});

			return json;
    },

		afterPreprocess: function(json){
			return json;
		},

		addEvent: function(el, model){
			var me = this;

			el.data('model', model);

			if(model.seats && model.remain_seat == 0 ){
				el.find('.join-btn').remove(); 
			}else{
				el.find('.join-btn').on('click', {el: el, scope: me}, me.onJoin);
			}
			
			el.find('.cancel-btn').on('click', {el: el, scope: me}, me.onCancel);
			el.find('.enter-btn').on('click', {el: el, scope: me}, me.onEnter);

			if(model.has_replay && Common.replayEnabled ){
				el.find('.replay-btn').on('click', {el: el, scope: me}, me.onReplay);
			}else{
				el.find('.replay-btn').remove(); 
			}
		},

		addEvent_t: function(el, model){
			var me = this;

			el.data('model', model);

			el.find('.remove-btn').on('click', {el: el, scope: me}, me.onRemove);

			if(model.viewable){
				el.find('.view-btn').on('click', {el: el, scope: me, teacher: true}, me.onEnter);

			}else if(model.replayable && Common.replayEnabled){
				el.find('.view-btn').on('click', {el: el, scope: me, teacher: true}, me.onReplay);

				el.find('.onoffswitch-label').on('click', {el: el, scope: me}, me.onSwitch);
			}else{
				el.find('.view-btn').remove();
			}
		},

		onSwitch: function(e){
			e.preventDefault();

			var $el = e.data.el;
			var me = e.data.scope;

			var model = $el.data('model');

			var $this = $(this);
			var $input = $this.prev();
			var val = !$input.prop('checked');
			
			$this.parent().toggleClass('onoffswitch-checked');
			$input.prop('checked', val);
			
			$.ajax({
				url: Common.api.replayEnableUrl,
				cache: false,
				dataType: 'json',
				type: 'post',
				data: $.param({
					id: model.clid,
					enabled: val?'1':'2'
				}),
				context: me
			}).done(function(data){
				if(data && !data.success){
					me.renderPage();
				}
			});
		},

		onJoin: function(e){
			e.preventDefault();

			var $el = e.data.el;
			var me = e.data.scope;
			var $btn = $(this);

			me.joinXhr && me.joinXhr.abort();
			$btn.button('loading');

			var model = $el.data('model');

			me.joinXhr = $.ajax({
				url: Common.api.classJoinUrl,
				cache: false,
				data: $.param({
					id: model.clid
				}),
				dataType: 'json'
			}).done(function(data){
				if(data && data.success){

					model.seats.status= '1';
					model.remain_seat--;
					$(me).triggerHandler('repaint', [$el, model]);

					// me.renderPage();
				}else{
					if(data.error == 207){
						bootbox.alert(Common.lang.seats_full, function () {
							$btn.addClass('disabled');
						});
					}else{
						bootbox.alert(Common.lang.join_class_failed);
					}
					$btn.button('reset');
				}
			}).fail(function(){
        $btn.button('reset');
      });
		},

		onCancel: function(e){
			e.preventDefault();

			var $el = e.data.el;
			var me = e.data.scope;
			var $btn = $(this);

			me.cancelXhr && me.cancelXhr.abort();
			$btn.button('loading');

			var model = $el.data('model');

			me.cancelXhr = $.ajax({
				url: Common.api.classCancelUrl,
				cache: false,
				data: $.param({
					id: model.clid
				}),
				dataType: 'json'
			}).done(function(data){
				if(data && data.success){

					model.seats.status= '';
					model.remain_seat++;
					$(me).triggerHandler('repaint', [$el, model]);
				}else{
					bootbox.alert(Common.lang.cancel_class_failed);
					$btn.button('reset');
				}
			}).fail(function(){
        $btn.button('reset');
      });
		},

		onEnter: function(e){
			var $el = e.data.el;
			var $btn = $(this);

			if(!e.data.teacher){
				$btn.button('loading');
			}
			
			var model = $el.data('model');

			var data = $.ajax({
				url: Common.api.classEnterUrl,
				async: false,
				cache: false,
				data: $.param({
					id: model.clid
				}),
				dataType: 'json'
			}).responseJSON;

			if(data && data.accessUrl){
				var lang = Common.language;
				if(lang == 'cn'){
	        lang = 'zh-CN';
	      }else if(lang == 'en'){
	        lang = 'en-US';
	      }
	      
				$(this).attr('href', data.accessUrl + '/locale/'+ lang);
			}else{
				e.preventDefault();
				bootbox.alert(Common.lang.enter_class_failed);
			}
			$btn.button('reset');
		},

		onReplay: function(e){
			var $el = e.data.el;
			var $btn = $(this);

			if(!e.data.teacher){
				$btn.button('loading');
			}
			
			var model = $el.data('model');

			var data = $.ajax({
				url: Common.api.classReplayUrl,
				async: false,
				cache: false,
				data: $.param({
					rid: model.rid
				}),
				dataType: 'json'
			}).responseJSON;

			if(data && data.replayUrl){
				var lang = Common.language;
				if(lang == 'cn'){
	        lang = 'zh-CN';
	      }else if(lang == 'en'){
	        lang = 'en-US';
	      }
	      
	      $(this).attr('href', data.replayUrl + '/locale/'+ lang);
			}else{
				console.log(data);
				e.preventDefault();
				bootbox.alert(Common.lang.no_replay_class);
			}
			$btn.button('reset');
		},

		onRemove: function(e){
			e.preventDefault();

			var $el = e.data.el;
			var me = e.data.scope;

			bootbox.confirm(Common.lang.confirm_class_remove,  function(state){
        if(!state){
          return;
        }

        var model = $el.data('model');

        $.ajax({
          url: Common.api.classDeleteUrl,
          data: $.param({
          	id: model.clid
          }),
          async: true,
          cache: false,
          type: 'post',
          dataType: 'json'
        }).done(function(data){
          if(data && data.success){
            me.renderPage();
          }else{
          	bootbox.alert(Common.lang.remove_failed);
          }
        });
        
      });
		}
	};
});