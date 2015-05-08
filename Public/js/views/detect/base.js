define([
	'jquery'
],function ($) {

	'use strict';

	var Base = function(){
	  this.init();
	};
	Base.prototype = {

	  counter: 0,
	  step: 0,

	  records : [],

	  init: function(){
	    var me = this;

	    me.$btn = $(".btn", me.$el);
	    me.$progress = $('.progress-bar', me.$el);
	    me.$progressText = $('span', me.$progress);
	    me.$btn.on('click', me, me.onCount);
	  },

	  onCount: function(e){
	    e.preventDefault();

	    var me = e.data;

	    me.records = [];

	    me.$btn.addClass('disabled');

	    me.$progressText.text('0%');

	    me.timer = setInterval(function(){

	      me.progress();

	      me.counter==10&& clearInterval(me.timer);
	    }, 1000);

	    me.progress();
	  }, 

	  updateProgress: function(){
	    var me = this;
	    me.step++;
	    var text = me.step*10 + '%'
	    me.$progress.css({
	      width: text
	    });
	    me.$progressText.text(text);
	  },

	  reset: function(){
	    var me = this;

	    me.step = 0;
	    me.counter = 0;
	    me.$btn.removeClass('disabled');
	  },

	  average: function(){
	    var me = this;

	    var total = 0;
	    for(var i in me.records){
	      total += me.records[i];
	    }
	    return total/me.records.length;
	  }
	};

	return Base;

});