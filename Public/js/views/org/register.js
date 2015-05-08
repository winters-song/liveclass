define([
	'jquery',
	'underscore',
	'bootbox',
	'common',
  'iframe_transport'
],function ($, _, bootbox, Common) {

  'use strict';

  var emailReg = /^(")?(?:[^\."])(?:(?:[\.])?(?:[\w\-!#$%&'*+/=?^_`{|}~]))*\1@(\w[\-\w]*\.){1,5}([A-Za-z]){2,6}$/;
  var urlReg = /(((^https?)|(^ftp)):\/\/((([\-\w]+\.)+\w{2,3}(\/[%\-\w]+(\.\w{2,})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.\w{2,})?)*)|(localhost|LOCALHOST))\/?)/i;

	var RegisterView = function(){
		this.render();	
    this.initEvents();
	};

	RegisterView.prototype = {

    name_valid: false,

    email_valid: false,

    url_valid: false,

		render: function(){
			var me = this;

			me.$el = $('#main');
      me.$form = $('#form');

      me.translate();

      var $tpl = $('#formTpl').html();
      var tpl = _.template($tpl, Common.lang);

			me.$form.append(tpl);

      me.$name = $('#org-name', me.$el);
      me.$nameErr = $('#name-error', me.$el);
      me.$email = $('#email', me.$el);
      me.$emailErr = $('#email-error', me.$el);
      me.$org_url = $('#org_url', me.$el);
      me.$urlErr = $('#url-error', me.$el);
      me.$submit = $('#submit-btn', me.$el); 
      me.$error     = $('.error-info', me.$el);

      if(!Modernizr.indexeddb){
        $('[name=org_url]', me.$form).ezpz_hint();
      }

		},

    translate: function(){
      $('#page-title').text(Common.lang.org_register);
    },

    initEvents: function(){
      var me = this;

      me.$name.on('blur', me, me.onNameCheck);
      me.$email.on('blur', me, me.onEmailCheck);
      me.$org_url.on('blur', me, me.onUrlCheck);

      me.$submit.on('click', me, me.onSubmit);

      if ( typeof FileReader !== 'undefined' ) { 
        me.$form.find(':file').on('change', me, me.onChangeImg);
      }
    },

    onNameCheck: function(e){
      var me = this;
      if(e){
        me = e.data;
      }
      var val = $.trim(me.$name.val());

      if(!val){
        me.$name.val('');
        me.showNameError(Common.lang.required_field);
      } else {
        $.ajax({
          url: Common.orgCheckUrl,
          cache: false,
          dataType: 'json',
          data: $.param({
            name: val
          }),
          type: 'post'
        }).done(function (data) {
          if(!data.success && data.error_code == 802){
            me.showNameError(Common.lang.org_name_exist_err);
          } else {
            me.hideNameError();
          }
        });
      }
    },

    showNameError: function(msg){
      var me = this;
      me.name_valid = false;
      me.$nameErr.find('p').html(msg);
      me.$nameErr.slideDown();
    },

    hideNameError: function(){
      var me = this;
      me.name_valid = true;
      me.$nameErr.slideUp();
    },

    onEmailCheck:function (e) {
      var me = this;
      if(e){
        me = e.data;
      }
      var val = me.$email.val();

      if(!val){
        me.showEmailError(Common.lang.required_field);
      } else if( !emailReg.test(val) ){
          me.showEmailError(Common.lang.email_format);
      }else{

        $.ajax({
          url: Common.orgCheckUrl,
          cache: false,
          dataType: 'json',
          data: $.param({
            org_email: val
          }),
          type: 'post'
        }).done(function (data) {
          if(!data.success && data.error_code == 604){
            me.showEmailError(Common.lang.email_exist_err);
          } else {
            me.hideEmailError();
          }
        });
      }
    },

    showEmailError: function(msg){
      var me = this;
      me.email_valid = false;
      me.$emailErr.find('p').html(msg);
      me.$emailErr.slideDown();
    },

    hideEmailError: function(){
      var me = this;
      me.email_valid = true;
      me.$emailErr.slideUp();
    },

    onUrlCheck:function (e) {
      var me = this;
      if(e){
        me = e.data;
      }
      var val = me.$org_url.val();

      if(!val){
        me.showUrlError(Common.lang.required_field);
      } else if( !urlReg.test(val) ){
        me.showUrlError(Common.lang.url_format_err);
      }else{
        me.hideUrlError();
      }
    },

    showUrlError: function(msg){
      var me = this;
      me.url_valid = false;
      me.$urlErr.find('p').html(msg);
      me.$urlErr.slideDown();
    },

    hideUrlError: function(){
      var me = this;
      me.url_valid = true;
      me.$urlErr.slideUp();
    },

    onChangeImg: function(){

      var $imgWrapper = $(this).next();

      var file = this.files[0];
      if(!file) {
        $imgWrapper.html('');
        return;
      }

      if(!/image\/\w+/.test(file.type)){
        bootbox.alert(Common.lang.file_img_check);
        $(this).val('');
        return false;
      }else{
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(){
          $imgWrapper.html('<img src="'+this.result+'" alt=""/>');
        };
      }

    },

    showError: function(msg){
      this.$error.find('p').text(msg);
      this.$error.slideDown();
    },

    hideError: function(){
      this.$error.hide().find('p').empty();
    },

    getValueArray: function(){
      var me = this;

      var mapToArray = function(map){
        return $.map( map, function( value, key ) {
          return {
            name: key,
            value: value
          };
        });
      };

      return mapToArray(me.values);
    },

    onSubmit: function(e){
      var me = e.data;
      e.preventDefault();

      if(me.validate()){
        me.$submit.button('loading');

        $.ajax({
          url: Common.submitUrl,
          data: me.getValueArray(),
          dataType: 'json',
          files: me.$form.find(':file'),
          iframe: true,
          processData: false
        }).done(function(data) {
          if(data && data.success){
            bootbox.alert(Common.lang.reg_success_msg, function() {
              window.location.href = 'index.html';
            });
          }else{
            bootbox.alert(Common.lang.reg_failed);
            me.$submit.button('reset');
          }
        });

      }
    },

    validate: function(){

      var me = this;

      var result = {};

      var values = me.$form.serializeArray();

      _.each(values, function(i){
        result[i.name] = i.value;
      });

      if(! (result.name && result.org_email && result.org_url) ){
        me.onNameCheck();
        me.onEmailCheck();
        me.onUrlCheck();
        me.showError(Common.lang.require_fields);
      }else if(! (me.email_valid && me.name_valid && me.url_valid) ){

      }else{
        me.values = result;
        me.hideError();

        return true;
      }
    }
	};

	return RegisterView;
    
});