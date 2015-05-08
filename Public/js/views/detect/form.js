define([
	'jquery',
	'bootbox',
	'common'
],function ($, bootbox, Common) {

	'use strict';

	var FormPanel = function(){
	  this.init();
	}

	FormPanel.prototype = {
	  init: function(){
	    var me = this;

	    me.$el = $('#detect-form');

	    me.$camera = $('[name=camera]', me.$el);
	    me.$mike = $('[name=mike]', me.$el);
	    me.$email = $('[name=email]', me.$el);
	    me.$description = $('[name=description]', me.$el);
	    me.$error = $('.alert', me.$el);
	    me.$submit = $('[type=submit]', me.$el);

	    me.$el.on('submit', me, function(e){
	      e.preventDefault();
	      var me = e.data;
	      me.doSubmit();
	    });

	    me.$submit.on('click', me, function(e){
	      e.preventDefault();
	      var me = e.data;
	      me.doSubmit();
	    });
	  },

	  doSubmit: function(){
	    var me = this;

	    var err = me.validate();
	    if(err){
	      me.showError(err);
	    }else{
	      me.hideError();

	      me.$submit.addClass('disabled');

	      $.ajax({
	        url: Common.submitUrl,
	        type: 'post',
	        data: $.param(me.values),
	        dataType: 'json',
	        cache: false
	      }).done(function(data){
	        if(data && data.success){

	        	bootbox.alert(Common.lang.your_diagnosis_id + ' : ' + data.id)
	        }
	      }).always(function(){
	        me.$submit.removeClass('disabled');
	      });
	    }
	  },

	  showError: function(type){
	    var me = this;
	    var msg;
	    var l = Common.lang;

	    if(type == 'camera'){
	      msg = l.camera_required;
	    }else if(type == 'mike'){
	      msg = l.mike_required;
	    }else if(type == 'email'){
	      msg = l.email_required;
	    }else if(type == 'email-format'){
	      msg = l.email_format_err;
	    }else if(type == 'download'){
	      msg = l.download_required;
	    }else if(type == 'upload'){
	      msg = l.upload_required;
	    }

	    me.$error.text(msg).slideDown();
	  },

	  hideError: function(){
	    var me = this;
	    me.$error.slideUp();
	  },

	  validate: function(){
	    var me = this;

	    var camera = me.$camera.filter(':checked');
	    if(camera.size()){
	      camera = camera.val();
	    }else{
	      return 'camera';
	    }

	    var mike = me.$mike.filter(':checked');
	    if(mike.size()){
	      mike = mike.val();
	    }else{
	      return 'mike';
	    }

	    var email = $.trim(me.$email.val());

	    if(email){
	      var emailReg = /^(")?(?:[^\."])(?:(?:[\.])?(?:[\w\-!#$%&'*+/=?^_`{|}~]))*\1@(\w[\-\w]*\.){1,5}([A-Za-z]){2,6}$/;
	      if(!emailReg.test(email)){
	        return 'email-format';
	      }
	    }else{
	      return 'email';
	    }

	    if(!Common.upload){
	      return 'upload';
	    }

	    if(!Common.download){
	      return 'download';
	    }

	    var description = me.$description.val();
	    if(description.length>500){
	      description = description.substr(0,500);
	    }

	    me.values = $.extend({
	      _camera: camera,
	      _mike: mike,
	      _email: email,
	      _description: description
	    }, {
	      _upload: Common.upload,
	      _download: Common.download
	    }, Common.baseInfo);

	    return;
	  }
	};

	return FormPanel;

});