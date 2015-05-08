define([
	'jquery',
	'underscore',
	'text!templates/lecturerNavbar.html',
	'common'
],function ($, _, tpl, Common) {

	'use strict';

	var LecturerNavbar = function(cfg){
		$.extend(this, cfg);
		this.render();
	};

	LecturerNavbar.prototype = {

		render: function(){
			var me = this;

			me.tpl = _.template(tpl);
			var fragment = me.tpl(Common.lang);
			
			me.$el.html(fragment);

			me.$el.find('li').each(function(){
				var tab = $(this).data('tab');
				if(tab == me.activeTab){
					$(this).addClass('active');
				}
			});

		}
	};

	return LecturerNavbar;
    
});