
(function(){
	if(window.devMode == 'dev'){
	  return;
	}

	var _regex = /\{([\w\.]*)\}/g;
	function nano(template, data) {
		return template.replace(_regex, function (str, key) {
			var keys = key.split('.'), value = data[keys.shift()];
			$.each(keys, function() { value = value[this]; });
			return (value === null || value === undefined) ? '' : value;
		});
	};

	var cssUrl = 'http://liveclass.chinesecio.com/Public/js/services/services.css?v1.1';
	document.write('<link href="'+cssUrl+'" rel="stylesheet" type="text/css" />');
					

	var serviceLangs = {
		'en': {
			'help': 'Help',
			'weekday': 'Weekday',
			'online_services': 'Online Services',
			'contact': 'Contact Us',
			'cooperation': 'Cooperation',
			'suggestion': 'Suggestion',
			'complaint': 'Complaint'
		},
		'cn': {
			'help': '帮助中心',
			'weekday': '工作日时间',
			'online_services': '在线客服',
			'contact': '联系我们',
			'cooperation': '合作',
			'suggestion': '建议',
			'complaint': '投诉'
		},
		'es': {
			'help': 'Más Información',
			'weekday': 'Día laboral',
			'online_services': 'Chat de Ayuda',
			'contact': 'Info de Contacto',
			'cooperation': 'Hágase Colaborador',
			'suggestion': 'Sugerencias',
			'complaint': 'Quejas'
		},
		'ru': {
			'help': 'Справочно-информационный центр',
			'weekday': 'Рабочий день',
			'online_services': 'Онлайн-сервисы',
			'contact': 'Связаться с нами',
			'cooperation': 'Сотрудничество',
			'suggestion': 'Совет',
			'complaint': 'Жалоба'
		},
		'ja': {
			'help': 'ヘルプセンター',
			'weekday': 'ウィークデー',
			'online_services': 'オンラインカスタマー サービス',
			'contact': 'お問い合わせ',
			'cooperation': '協力',
			'suggestion': 'ご意見',
			'complaint': 'ご苦情'
		},
		'ko': {
			'help': '도움말 센터',
			'weekday': '평일',
			'online_services': '온라인 고객지원',
			'contact': '문의하기',
			'cooperation': '합작',
			'suggestion': '제안',
			'complaint': '민원'
		},
		'fr': {
			'help': 'Aide',
			'weekday': 'Jour ouvrable',
			'online_services': 'Service client en ligne',
			'contact': 'Nous contacter',
			'cooperation': 'Coopération',
			'suggestion': 'Avis et Conseil',
			'complaint': 'Dépôt de plainte'
		}
		
	};

	var html = [
		'<div id="services" style="display:none;">',
			'<div class="service-close">',
				'<a id="service-close-btn" href="#">?</a>',
			'</div>',
			'<div class="service-inner" style="display:none;">',
				'<div class="service-buttons service-main ">',
					'<a class="sy-btn" id="service_help" href="#" target="_blank">{help}</a><br>',
					'<a class="sy-btn service_online" id="service_help_ol" href="javascript:;">{online_services}</a>',
					'<p class="service-note">{weekday}<br> 09:30 - 11:30, 13:30 - 17:30 (GMT +8)</p>',
				'</div>',
				'<div class="service-contact">',
					'<ul class="service-body">',
						'<li>',
							'ciocs01',
							'<a href="javascript:;" class="phone" >',
								'<span class="icon icon_phone"></span>',
								'<div>+86(10) 5930-7530</div>',
							'</a>',
							'<a href="mailTo:kefu8@chinesecio.com"><span class="icon icon_envelope" title="Email"></span></a>',
						'</li>',
						'<li>',
							'ciocs02',
							'<a href="javascript:;" class="phone" >',
								'<span class="icon icon_phone"></span>',
								'<div>+86(10) 5930-7589</div>',
							'</a>',
							'<a href="mailTo:kefu2@chinesecio.com"><span class="icon icon_envelope" title="Email"></span></a>',
						'</li>',
						'<li>',
							'ciocs03',
							'<a href="javascript:;" class="phone" >',
								'<span class="icon icon_phone"></span>',
								'<div>+86(10) 5930-7540</div>',
							'</a>',
							'<a href="mailTo:kefu4@chinesecio.com"><span class="icon icon_envelope" title="Email"></span></a>',
						'</li>',
						'<li>',
							'ciocs04',
							'<a href="javascript:;" class="phone" >',
								'<span class="icon icon_phone"></span>',
								'<div>+86(10) 5930-7554</div>',
							'</a>',
							'<a href="mailTo:kefu6@chinesecio.com"><span class="icon icon_envelope" title="Email"></span></a>',
						'</li>',
						'<li>',
							'ciocs05',
							'<a href="javascript:;" class="phone" >',
								'<span class="icon icon_phone"></span>',
								'<div>+86(10) 5930-7534</div>',
							'</a>',
							'<a href="mailTo:kefu9@chinesecio.com"><span class="icon icon_envelope" title="Email"></span></a>',
						'</li>',
						'<li>',
							'Chunky',
							'<a href="javascript:;" class="phone" >',
								'<span class="icon icon_phone"></span>',
								'<div>+86(10) 5930-7568</div>',
							'</a>',
							'<a href="mailTo:kefu1@chinesecio.com"><span class="icon icon_envelope" title="Email"></span></a>',
						'</li>',
					'</ul>',
				'</div>',
				'<div class="service-feedback">',
					'<a class="sy-title" href="#" onclick="window.open(\'mailTo:liushan@chinesecio.com\', \'newwindow\');" >{cooperation}</a> | ',
					'<a class="sy-title mid" href="#" onclick="window.open(\'mailTo:contact@chinesecio.com\', \'newwindow\');">{suggestion}</a> | ',
					'<a class="sy-title" href="#" onclick="window.open(\'mailTo:lijinlong@chinesecio.com\', \'newwindow\');">{complaint}</a>',
				'</div>',
			'</div>',
		'</div>'
	].join('');
			
	var lang = getCookie('lang');

	//default language should be same with Live Class
	lang = lang === undefined?'cn':lang;

	html = nano(html, serviceLangs[lang]);
	document.write(html);

	var jsUrl = 'http://liveclass.chinesecio.com/Public/js/services/cio-services.js?v1.0';

	!window.jQuery && document.write('<script src="http://liveclass.chinesecio.com/Public/js/libs/jquery/jquery-1.11.0.min.js"></script>');
	document.write('<script type="text/javascript" src="'+jsUrl+'"></script>');
	document.write('<script type="text/javascript" charset="utf-8" src="http://gate.looyu.com/51615/113890.js"></script>');


if(window.doyoo && lang){
	if( lang !== 'cn'){
		doyoo.env.lang = 'en';
	}
}

})();

function getCookie(objName){
	'use strict';

	var arrStr = document.cookie.split('; '); 
	for(var i = 0;i < arrStr.length;i ++){ 
		var temp = arrStr[i].split('='); 
		if(temp[0] == objName) return unescape(temp[1]); 
	} 
}