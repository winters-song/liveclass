define([
	'jquery',
	'underscore',
	'common',
  'datetimepicker',
  'select2'
],function ($, _, Common) {

  'use strict';

  var emailReg = /^(")?(?:[^\."])(?:(?:[\.])?(?:[\w\-!#$%&'*+/=?^_`{|}~]))*\1@(\w[\-\w]*\.){1,5}([A-Za-z]){2,6}$/;
    
	var RegisterView = function(){
		this.render();	
    this.initEvents();
	};

	RegisterView.prototype = {

    dateFormat: 'YYYY-MM-DD',

    email_valid: false,

    org_load: false,
    country_load: false,
    college_load: false,

		render: function(){
			var me = this;

			me.$el = $('#main');
      me.$form = $('#form');

      me.translate();

      var $tpl = $('#formTpl').html();
      var tpl = _.template($tpl, Common.lang);

			me.$form.append(tpl);

      me.$email = $('#email', me.$el);
      me.$emailErr = $('#email-error', me.$el);

      me.$birthday = $('#birthday', me.$el); 
      me.$submit = $('#submit-btn', me.$el); 
      me.$error  = $('.error-info', me.$el);

      me.$type = $('#type-list input', me.$el);
      me.$college_type = $('#teach-status-list input', me.$el);
      me.$college_teacher = $('#college-teacher', me.$el);
      me.$collapse = $('.type-collapse', me.$el);
      me.$work_country = $('#work_country', me.$el);

      me.$org = $('#org_select', me.$el);
      me.$province = $('#province_select', me.$el);
      me.$college = $('#college_select', me.$el);
      me.$college_name = me.$college.next();

      me.$work_date = $('#work_date', me.$el); 

      var lang = Common.language;
      if(lang == 'cn'){
        lang = 'zh-CN';
      }else if(lang == 'en'){
        lang = 'en-gb';
      }
      
      require(['libs/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.'+lang], function(){
        me.$birthday.datetimepicker({
          language: lang,
          pickTime: false,   
          format : me.dateFormat,
          maxDate : new Date()
        });

        me.$work_date.datetimepicker({
          language: lang,
          pickTime: false,   
          format : me.dateFormat,
          maxDate : new Date()
        });
      });

      function initSelect(){
        me.$org.select2();
        me.$work_country.select2();
        me.$province.select2();
        me.$college.select2();
      }

      if(lang != 'en-gb'){
        require(['libs/select2/select2_locale_'+lang], initSelect);
      }else{
        initSelect();
      }

		},

    translate: function(){
      $('#page-title').text(Common.lang.lecturer_register);
      $('#teacher_reg_msg').html(Common.lang.teacher_reg_msg);
      Common.setTitle(Common.lang.lecturer_register);
    },

    initEvents: function(){
      var me = this;

      me.$email.on('blur', function () {
        var val = $(this).val();
        if(val){
          $.ajax({
            url: Common.api.emailCheckUrl,
            cache: false,
            dataType: 'json',
            data: $.param({
              email: val
            }),
            type: 'post'
          }).done(function (data) {
            if(!data.success && data.error_code == 604){
              me.email_valid = false;
              me.$emailErr.show();
            } else {
              me.email_valid = true;
              me.$emailErr.hide();
            }
          });
        }
      });

      me.$submit.on('click', me, me.onSubmit);

      me.$type.on('click', function(){
        var val = $(this).val();

        me.$collapse.hide();
        var selector = $(this).data('target');
        $(selector).show();

        if(val == '1'){
          !me.org_load && me.init_org();
          !me.country_load && me.init_country();
        }
      });

      me.$college_type.on('click', function(){
        var val = $(this).val();

        if(val == '2'){
          me.$college_teacher.show();
          !me.college_load && me.init_college();
        }else{
          me.$college_teacher.hide();
        }
      });

    },

    init_org: function(){
      var me = this;

      me.shoolXHR && me.shoolXHR.abort(); 

      me.shoolXHR = $.ajax({
        url:Common.api.schoolUrl,
        cache: false,
        type: 'get',
        dataType: 'json'
      }).done(function(data){

        if(data && data.length){

          me.org_load = true;
          var lang = 'cn'; //Common.language == 'cn'? 'cn': 'en';
          var html = '';
        
          _.each(data, function(model){
            var val = model.groupID;
            var title = model[lang];
            html += '<option value="'+val+'" >'+title+'</option>';
          });
          me.$org.append(html);
        }
      });

    },

    init_country: function(){
      var me = this;

      me.countryXHR && me.countryXHR.abort(); 

      me.countryXHR = $.ajax({
        url:Common.api.countryUrl,
        cache: true,
        type: 'get',
        dataType: 'json'
      }).done(function(data){

        if(data && data.length){

          me.country_load = true;
          var lang = Common.language == 'cn'? 'cn': 'en';
          var html = '';
        
          _.each(data, function(model){
            var val = model.id;
            var title = model[lang];
            html += '<option value="'+val+'" >'+title+'</option>';
          });
          me.$work_country.append(html);
        }
      });

    },

    init_college: function(){
      var me = this;

      me.college_load = true;

      me.$province.on('change', function(){
        var val = $(this).val();
        me.changeProvince(val);
      });

      me.$college.on('change', function(){
        var val = $(this).val();
        
        if(val){
          for(var i in me.colleges){
            if(me.colleges[i].id == val){
              me.$college_name.val(me.colleges[i].name);
            }
          }
        }
      });
      me.changeProvince(1);

    },

    changeProvince: function(id){
      var me = this;

      me.collegeXHR && me.collegeXHR.abort(); 

      me.collegeXHR = $.ajax({
        url:Common.api.collegeUrl,
        data: $.param({ id: id }),
        cache: false,
        type: 'get',
        dataType: 'json'
      }).done(function(data){

        if(data && data.length){
          me.colleges = data;
          me.$college.select2('val','');
          me.$college.empty();
          var html = '';
        
          _.each(data, function(model){
            var val = model.id;
            var title = model.name;
            html += '<option value="'+val+'" >'+title+'</option>';
          });
          me.$college.append(html);
        }
      });

    },

    showError: function(msg){
      this.$error.find('p').text(msg);
      this.$error.slideDown();
    },

    hideError: function(){
      this.$error.hide().find('p').empty();
    },

    onSubmit: function(e){
      var me = e.data;
      e.preventDefault();

      if(me.validate()){
        $.ajax({
          url: Common.api.submitUrl,
          dataType: 'json',
          data: $.param(me.values),
          type:'post',
          async: true,
          cache: false
        }).done(function(data){
          if(data && data.success){

            bootbox.alert(Common.lang.reg_success_msg, function() {
              window.location.href = 'index.html';
            });
            
          }else{

            if(data.error_code == 604){
              bootbox.alert(Common.lang.email_exist_err);
            }else if(data.error_code == 605){
              bootbox.alert(Common.lang.apply_already_err);
            }else{
              bootbox.alert(Common.lang.reg_failed);
            }
            
          }
        });
      }
    },

    validate: function(){

      var me = this;

      var result = {};

      var values = me.$form.serializeArray();

      _.each(values, function(i){
        result[i.name] = $.trim(i.value);
      });

      if(!me.requiredCheck(result)){
        me.showError(Common.lang.require_fields);

      }else if(!emailReg.test(result.email)){
        me.showError(Common.lang.email_format);

      }else if(result.birthday && !(me.$birthday.data('DateTimePicker').getDate())){
        me.showError(Common.lang.invalid_date_format);

      }else if(!me.email_valid){
        me.hideError();
        
      }else{
        me.values = result;
        me.hideError();

        return true;
      }

      return false;
    },

    omit: function(obj, arr){
      _.each(arr, function(i){
        delete obj[i];
      });
    },

    requiredCheck: function(result){
      var me = this;
      var list = ['name', 'email', 'teacher_type'];

      var res = true;

      _.each(list, function(i){
        if (!result[i]){
          res = false;
        }
        return false;
      });

      if(!res){
        return false;
      }

      var type = result.teacher_type;


      if(type == '1'){
        me.omit(result, [
          'dispatch', 'school_id', 'work_school', 'work_status'
        ]);

        return result.org &&result.work_country && result.work_date && result.work_job;

      }else if(type == '2'){
        me.omit(result, [
          'org', 'work_country', 'work_date', 'work_job', 'school_id', 'work_school', 'work_status'
        ]);

        return result.dispatch;
        
      }else if(type == '3'){

        me.omit(result, [
          'org', 'work_country', 'work_date', 'work_job', 'dispatch'
        ]);

        var college_type = result.work_status;

        if(college_type == '1'){
          me.omit(result, [
            'school_id', 'work_school'
          ]);
          return true;
        }

        return result.school_id && result.work_school && result.work_status;

      }else if(type == '4' || type == '5' ){
        me.omit(result, [
          'org', 'work_country', 'work_date', 'work_job', 'school_id', 'work_school', 'work_status'
        ]);
        return true;
      }else{
        return false;
      }

    }

	};

	return RegisterView;
    
});