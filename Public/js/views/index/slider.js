define([
	'jquery',
	'underscore',
	'common',
	'easing',
	'rslide'
],function ($, _, Common) {

	'use strict';

	$.fn.akdelay = function(time, callback){
		jQuery.fx.step.delay = function(){};
		return this.animate({delay:1}, time, callback);
	}
    
	var SliderView = function(){
		this.render();
	};

	SliderView.prototype = {

		render: function(){
			var me = this;
			me.$el = $('#slider');

			var tpl = $('#sliderTpl').html();
			me.$el.html(_.template(tpl, Common.lang));

			var moveTo = ($(window).width() / 1.5) * (-1);
			$('li:not(.first) .leftside .text-wrap', me.$el).css('left', moveTo);
			$('li:not(.first) .rightside .text-wrap', me.$el).css('right', moveTo);
			$('.rslides .first h1').fadeIn();
			$('.rslides .first p').css('left', '0').fadeIn();
			$('.rslides .first .btn').css('left', '0').fadeIn();

			$(".rslides", me.$el).responsiveSlides({
				auto : true, // Boolean: Animate automatically, true or false
				speed : 2000, // Integer: Speed of the transition, in milliseconds
				timeout : 9000, // Integer: Time between slide transitions, in milliseconds
				pager : false, // Boolean: Show pager, true or false
				nav : true, // Boolean: Show navigation, true or false
				random : false, // Boolean: Randomize the order of the slides, true or false
				pause : false, // Boolean: Pause on hover, true or false
				pauseControls : false, // Boolean: Pause when hovering controls, true or false
				prevText : "", // String: Text for the "previous" button
				nextText : "", // String: Text for the "next" button
				maxwidth : "", // Integer: Max-width of the slideshow, in pixels
				navContainer : ".container.hero-unit-nav", // Selector: Where controls should be appended to, default is after the 'ul'
				namespace : "rslides", // String: change the default namespace used
				before : function(index){
					me.onBefore(index);
				}, // Function: Before callback
				after : function() {
				} // Function: After callback
			});


			me.$openClassBtn = $('#open-class', me.$el);
			if(Common.isTeacher){
					// me.$openClassBtn.attr('href', 'createClass.html');
			}else{
				if(Common.teacherApply){
					me.$openClassBtn.on('click', function (e) {
						e.preventDefault();
						bootbox.alert(Common.lang.reg_success_msg);
					});
				}else{
					// me.$openClassBtn.attr('href', 'lectureRegister.html');
				}
			}

		},

		onBefore: function (index) {
			var me = this;

			var animateTo = ($(window).width()/1.7)*(-1);
			var leftTo;
			var rightTo;

			var width = $(window).width();
			if( width > 992){
				leftTo = '95px';
				rightTo = '95px';
			}else {
				leftTo = '60px';
				rightTo = '60px';
			}

			$('.rslides1_on .leftside .text-wrap', me.$el).animate({
				left: animateTo},1400,'easeInExpo',function(){

				if(index == 0){
					me.animateFirstSlide(leftTo, rightTo);
				} else {
					me.animateLastSlide(leftTo, rightTo);
				}
			});

			$('.rslides1_on .leftside .text-wrap h1', me.$el).animate({
				left: animateTo}, 1050,'easeInExpo');
			$('.rslides1_on .leftside .text-wrap p', me.$el).animate({
				left: animateTo}, 1200,'easeInExpo');
			$('.rslides1_on .leftside .text-wrap .btn', me.$el).animate({
				left: animateTo}, 1350,'easeInExpo');
				
			$('.rslides1_on .rightside .text-wrap', me.$el).animate({
				right: animateTo},1400,'easeInExpo',function(){

				if(index == 0){
					me.animateFirstSlide(leftTo, rightTo);
				} else {
					me.animateLastSlide(leftTo, rightTo);
				}
			});

			$('.rslides1_on .rightside .text-wrap h1', me.$el).animate({
				right: animateTo}, 1050,'easeInExpo');
			$('.rslides1_on .rightside .text-wrap p', me.$el).animate({
				right: animateTo, left: -animateTo}, 1200,'easeInExpo');
			$('.rslides1_on .rightside .text-wrap .btn', me.$el).animate({
				right: animateTo, left: -animateTo}, 1350,'easeInExpo');
		},

		animateFirstSlide: function(leftTo, rightTo){
			var me = this;

			$('.first .btn', me.$el).css({left: '',right: ''});
			$('.first p', me.$el).css({left: '',right: ''});
			$('.first h1', me.$el).css({left: '',right: ''});

			$('.first .leftside .text-wrap', me.$el).animate({
				left: leftTo}, 1000,'easeOutExpo');
			$('.first p', me.$el).akdelay(300, function(){
					$(this).animate({ left: '0' }, 1000, 'easeOutBack');
			});
			$('.first .btn', me.$el).akdelay(300, function(){
					$(this).animate({ left: '0' }, 1000, 'easeOutBack');
			});
			$('.first .rightside .text-wrap', me.$el).animate({
				right: rightTo},1000,'easeOutExpo');
		},

		animateLastSlide: function(leftTo, rightTo){
			var me = this;

		 	$('.last .btn', me.$el).css({left: '',right: ''});
			$('.last p', me.$el).css({left: '',right: ''});
			$('.last h1', me.$el).css({left: '',right: ''});

			$('.last .leftside .text-wrap', me.$el).animate({
				left: leftTo}, 1000,'easeOutExpo');
			$('.last p', me.$el).akdelay(300, function(){
					$(this).animate({ left: '0' }, 1000, 'easeOutBack');
			});
			$('.last .btn', me.$el).akdelay(300, function(){
					$(this).animate({ left: '0' }, 1000, 'easeOutBack');
			});
			$('.last .rightside .text-wrap', me.$el).animate({
				right: rightTo},1000,'easeOutExpo');
		}
	};

	return SliderView;
    
});