define([
	'jquery',
	'views/detect/base',
	'bootbox',
	'common'
],function ($, Base, bootbox, Common) {

	'use strict';

	var DownloadView = function(){

	  this.$el = $("#download");
	  Base.apply(this, arguments);
	};

	DownloadView.prototype = {

	  __proto__ : Base.prototype,

	  progress: function(){
	    var me = this;

	    me.counter++;

	    var sdate = new Date();

	    $.ajax({
	      url: Common.downloadUrl,
	      data: $.param({
	        data: 1
	      }),
	      type: 'post',
	      cache: false,
	      dataType: 'json'
	    }).done(function(data){
	      if(data && data.success){

	        me.updateProgress();

	        var edate = new Date();
	        var time = (edate.getTime() - sdate.getTime())/1000;

	        var speed = parseInt(512/time);

	        me.records.push(speed);

	        if(me.step == 10){
	          me.onFinish();
	        }
	      }else{
	        clearInterval(me.timer);
	        me.reset();
	        bootbox.alert(Common.lang.test_failed);
	      }
	    }).fail(function(){
	      clearInterval(me.timer);
	      me.reset();
	      bootbox.alert(Common.lang.test_failed);
	    });
	  },

	  onFinish: function(){
	    var me = this;
	    var average = me.average();
	    var l = Common.lang;

	    var text;
	    if(average < 512){
	      text = l.bad;
	    }else if(average < 1024){
	      text = l.normal;
	    }else if(average < 1024 + 512){
	      text = l.good;
	    }else{
	      text = l.very_good;
	    }

	    Common.download = me.records.join(',');
	    me.reset();
	    bootbox.alert(l.download_speed_msg + " : " + text);
	  }
	};

	return DownloadView;

});