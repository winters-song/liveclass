define([
	'jquery',
	'underscore',
	'text!templates/footer.html',
	'common'
],function ($, _, footerTpl, Common) {
  
  'use strict';

	var FooterView = function(){
		this.render();
	};

	FooterView.prototype = {
		render: function(){
			var el = $('.page-bottom');

			var tpl = _.template(footerTpl);
			var fragment = tpl(Common.lang);

			var $footer = $(fragment);
			
			$footer.appendTo(el);

			$footer.find('a').each(function() {
				var href = $(this).attr('href');
				$(this).attr('href', href + '?lang='+ Common.language);
			});

			$('#weixin-btn', el).popover({
				content: [
					'<img src="/Public/img/weixin.jpg" class="code">',
					'<p>扫描二维码<br/>关注网络孔子学院</p>'
				].join(''),
				html: true,
				placement: 'top',
				trigger: 'hover'
			});
		}
	};

	return FooterView;
    
});