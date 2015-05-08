define([
	'jquery',
	'underscore',
	'jwplayer',
	'common',
	'moment',
	'flexpaper',
	'models/Courseware'
],function ($, _, jwplayer, Common) {

	'use strict';
    
	var BoardView = function(){
		this.initHash();
		this.render();	
	};

	BoardView.prototype = {

    initHash : function () {
	  	var hash = window.location.href;
		  var hashData = hash.queryStringToJSON(); 
		  this.classId = hashData.id;
	  },

		render: function(){
			var me = this;

			me.$el = $('#main-body');

			if(!me.classId){
				return;
			}

			$.ajax({
				url: Common.api.coursewareInfoUrl,
				data: $.param({
					id: me.classId
				}),
        cache:false,
        dataType:'json'
      }).done(function(data){
      	if(!data){
      		return;
      	}
      	me.data = data;
      	Common.setTitle(me.data.name);

      	var tpl = $('#pageTpl').html();
      	if(me.data.uploadtime){
      		me.data.uploadtime = moment(me.data.uploadtime*1000).format(Common.dateFormat);
      	}
      	
      	var fragment = _.template(tpl, $.extend(me.data, {
      		upload_time : Common.lang.upload_time
      	}));

      	me.$el.html(fragment);

      	me.createContent();
      });
		},

		createContent: function(){
			var me = this;

			me.$content = $('#file-content', me.$el);

			var type = me.data.type;

			if(type == 'document'){
				me.createFlash();
			}else if(type == 'video'){
				me.createVideo();
			}else if(type == 'audio'){
				me.createAudio();
			}
			
		},

		createVideo: function(){

			var me = this;
			var json = me.data;

			if(json && json.preview && json.preview.highDefinitionUrl){

				me.$content.html($('<div id="file-video">'));

				jwplayer('file-video').setup({
	        file: json.preview.highDefinitionUrl,	//standardDefinitionUrl
	        image: json.preview.thumbUrl,
	        flashplayer: '/Public/js/libs/jwplayer/jwplayer.flash.swf',
    			html5player: '/Public/js/libs/jwplayer/jwplayer.html5.js',
	        width: '100%',
	        height: 400
		    });

			}
		},

		createAudio: function(){

			var me = this;
			var json = me.data;

			if(json && json.preview && json.preview.audioUrl){

				me.$content.html($('<div id="file-audio">'));

				jwplayer('file-audio').setup({
	        file: json.preview.audioUrl,
	        flashplayer: '/Public/js/libs/jwplayer/jwplayer.flash.swf',
    			html5player: '/Public/js/libs/jwplayer/jwplayer.html5.js',
	        width: '100%',
	        height: 400
		    });

			}
		},

		createFlash: function(){

			var me = this;
			var json = me.data;

			if(json && json.preview && json.preview.swfUrl){

				var tpl = $('#docTpl').html();

				var fragment = _.template(tpl, {
					adobe_flash_msg : Common.lang.adobe_flash_msg
				});
				me.$content.html(fragment);

				var lang = $.cookie('lang');
				if(lang == 'cn'){
					lang = 'zh_CN';
				}else if(lang == 'fr'){
					lang = 'fr_FR';
				}else if(lang == 'es'){
					lang = 'es_ES';
				}else if(lang == 'ru'){
					lang = 'ru_RU';
				}else{
					lang = 'en_US';
				}

				$('#flashContent').FlexPaperViewer({ 
					config : {
						jsDirectory: '/Public/js/libs/FlexPaper/js/',
            SWFFile : json.preview.swfUrl,
            PrintPaperAsBitmap: false,

            Scale : 1,
            ZoomTransition : 'easeOut',
            ZoomTime : 0.5,
            ZoomInterval : 0.2,
            FitPageOnLoad : true,
            FitWidthOnLoad : false,
            FullScreenAsMaxWindow : false,
            ProgressiveLoading : false,
            MinZoomSize : 0.2,
            MaxZoomSize : 5,
            SearchMatchAll : false,
            InitViewMode : 'Portrait',
            RenderingOrder : 'flash',
            StartAtPage : '',

            ViewModeToolsVisible : true,
            ZoomToolsVisible : true,
            NavToolsVisible : true,
            CursorToolsVisible : true,
            SearchToolsVisible : true,
            WMode : 'window',
            localeChain: lang
          }
        });
			}
		}
	};

	return BoardView;
    
});