
$(function () {

	var isHidden = true;

	$("#service-close-btn").on('click', function(e){
		e.preventDefault();

		isHidden = !isHidden;

		var fn = isHidden ? 'fadeOut': 'fadeIn';
		$("#services .service-inner")[fn]('fast');

		fn = isHidden ? 'removeClass':'addClass';
		$(this)[fn]('active');
	});

	$("#service_help").on('click', function(){

		var url = 'http://service.chinesecio.com/help/?lang=';

		if(getCookie('lang') && getCookie('lang') == 'cn'){
			url += 'zh';
	  }else{
	  	url += 'en';
	  }

		$(this).attr('href', url);
	});

	var loop = 0;

	function findServices(){
		var el = $('#doyoo_panel');
		if(el.size()){
				
			el.hide();

			var lang = getCookie('lang');
			//default language should be same with Live Class
			lang = lang === undefined?'cn':lang;

			if(window.doyoo && lang){
				if( lang !== 'cn'){
					doyoo.env.lang = 'en';
				}
			}

			$('.service_online').on('click', function(){
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

	setTimeout(function(){
		$('#services').show();
	}, 500);

});