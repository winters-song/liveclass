define([
	'jquery',
	'underscore',
	'text!templates/onlineService.html',
	'common'
],function ($, _, tpl, Common) {

	'use strict';
    
	var OnlineService = function(){
		if(window.doyoo){
		  if( $.cookie('lang') !== 'cn'){
		    doyoo.env.lang = 'en';
		  }
		}

		this.render();
		this.initEvents();
	};

	OnlineService.prototype = {

		render: function(){
			var me = this;

			var compiled = _.template(tpl);
			var fragment = compiled(Common.lang);
			var $html = $(fragment);
			
			$html.appendTo($('body'));

			me.$buttons = $('.services-sy', $html);
			me.$help = $('#service_help', $html);

		},

		initEvents: function(){
			var me = this;

			me.$buttons.on('mouseenter', function(){
				$(this).find('label').show();
			});

			me.$buttons.on('mouseleave', function(){
				$(this).find('label').hide();
			});

			me.$help.find('label').on('click', function(e){
				e.preventDefault();
				$('#service_help')[0].click();
			});

			me.$help.on('click', function(){

				var url = 'http://service.chinesecio.com/help/?lang=';

				if($.cookie('lang') && $.cookie('lang') !== 'cn'){
			    url += 'en';
			  }else{
			  	url += 'zh';
			  }

				$(this).attr('href', url);
			});

			me.initLooyu();
		},

		initLooyu : function () {
			var loop = 0;

			function findServices(){
				var el = $('#doyoo_panel');
				if(el.size()){
						
					el.hide();

					$('#service_online').on('click', function(){
						el.find('a').click();
					});

				}else if(loop < 1000){
					loop++;
					setTimeout(function(){
						findServices();
					}, 10);
				}
			}

			findServices();
		}
	};

	return OnlineService;
    
});