define([
  'jquery',
  'underscore',
  'text!templates/createClass/basics.html',
  'common',
  'datetimepicker',
  'models/Type'
], 
function($, _, tpl, Common){

  'use strict';

  var BasicView = function(){
    this.render();
    this.initEvents();
  };

  BasicView.prototype = {

    id: 'page-basics',

    required : ['name','description','starttime', 'endtime', 'language', 'category', 'level', 'target', 'learning', 'teaching', 'content'],

    render: function(){
      var me = this;

      me.$el = $('#page-basics');

      var html = _.template(tpl, Common.lang);
      var $html = $(html);

      Common.isOrgTeacher = false;
      if(!Common.isOrgTeacher){
        $html.find('#is_public').remove();
      }
      me.$el.html($html);

      var $radioTpl = $('#radioTpl').html();
      me.radioTpl = _.template($radioTpl);

      me.$form       = $('form', me.$el);
      me.$error     = $('.error-info', me.$el);

      me.$language = $('#language-list', me.$el);
      me.$category = $('#category-list', me.$el);
      me.$target = $('#target-list', me.$el);
      me.$level = $('#level-list', me.$el); 
      me.$forms = $('#form-list', me.$el); 
      me.$goal = $('#goal-list', me.$el); 
      me.$skill = $('#skill-list', me.$el); 

      me.$start = $('#startdate', me.$el); 
      me.$end = $('#enddate', me.$el); 

      var lang = Common.language;
      if(lang == 'cn'){
        lang = 'zh-CN';
      }else if(lang == 'en'){
        lang = 'en-gb';
      }
      
      require(['libs/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.'+lang], function(){
        me.$start.datetimepicker({
          language: lang,
          format : Common.dateFormat
        }).on('dp.change', function(e){

          me.$end.data("DateTimePicker").setDate(e.date);
        });

        me.$end.datetimepicker({
          language: lang,
          format : Common.dateFormat
        });

        if(Common.pageType == 'edit'){
          me.initForm();
        }

        if(!Modernizr.indexeddb){
          $('[name=tags]', me.$form).ezpz_hint();
          $('[name=signup_url]', me.$form).ezpz_hint();
        }
        
      });

      me.initCombo();
    },

    initForm: function(){
      var me = this;

      me.$form.find('[name=name]').val(_.unescape(Common.info.name));
      me.$form.find('[name=description]').val(_.unescape(Common.info.description));
      me.$form.find('[name=tags]').val(_.unescape(Common.info.tags));

      me.$form.find('[name=signup_url]').val(Common.info.signup_url);

      if(Common.info.is_open == '1'){
        me.$form.find('[name=is_open]').prop('checked', true);
        me.$form.find('[name=is_replay]').prop('disabled', true);
      }

      if(Common.info.is_replay == '1'){
        me.$form.find('[name=is_replay]').prop('checked', true);
      }

      me.$start.data('DateTimePicker').setDate(moment(Common.info.starttime*1000).format(Common.dateFormat));
      me.$end.data('DateTimePicker').setDate(moment(Common.info.endtime*1000).format(Common.dateFormat));

    },

    initCombo: function(){
      var me = this;

      var items = [{
        url: Common.api.languageUrl,
        el: me.$language,
        field: 'language'
      },{
        url: Common.api.categoryUrl,
        el: me.$category,
        field: 'category'
      },{
        url: Common.api.targetUrl,
        el: me.$target,
        field: 'target'
      },{
        url: Common.api.levelUrl,
        el: me.$level,
        field: 'level'
      },{
        url: Common.api.formUrl,
        el: me.$forms,
        field: 'learning'
      },{
        url: Common.api.goalUrl,
        el: me.$goal,
        field: 'teaching'
      },{
        url: Common.api.skillUrl,
        el: me.$skill,
        field: 'content'
      }];

      _.each(items, function(i){
        $.ajax({
          url: i.url,
          data: $.param({
            lang: Common.language
          }),
          cache: false,
          async: true,
          dataType: 'json'
        }).done(function(data){
          me.addTypes(i.el, i.field, data);
        });
      });
      
    },


    initEvents: function(){
      var me = this;
      $('.next-btn', me.$el).on('click', function(e){
        e.preventDefault();
        $(Common).triggerHandler('goNext', {});
      });

      if(Common.isOrgTeacher){
        var $el = $('#is_public', me.$el);
        var $is_open = $('[name=is_open]', $el);
        var $is_replay = $('[name=is_replay]', $el); 

        $is_open.on('change', function(){
          var val = $(this).prop('checked');

          if(val){
            $is_replay.prop('checked', true);
            $is_replay.prop('disabled', true);
          }else{
            $is_replay.prop('disabled', false);
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

      $('input:checked', me.$language).each(function(){
        result.language = $(this).val();
      });
      $('input:checked', me.$category).each(function(){
        result.category = $(this).val();
      });
      $('input:checked', me.$level).each(function(){
        result.level = $(this).val();
      });
      $('input:checked', me.$target).each(function(){
        result.target = $(this).val();
      });
      $('input:checked', me.$forms).each(function(){
        result.learning = $(this).val();
      });
      $('input:checked', me.$goal).each(function(){
        result.teaching = $(this).val();
      });
      $('input:checked', me.$skill).each(function(){
        result.content = $(this).val();
      });

      var success = true;

      _.each(me.required, function(i){
        if(!$.trim(result[i])){

          if(i == 'name' || i == 'description'){
            me.$form.find('[name='+i+']').val('');
          }
          success = false;
          return false;
        }
      });

      var startDate = me.$start.data('DateTimePicker').getDate();
      var endDate = me.$end.data('DateTimePicker').getDate();

      if(!success){
        this.showError(Common.lang.require_fields);
        
      }else if(result.name.length <3){
        this.showError(Common.lang.class_name_minlength);

      }else if(!(startDate && endDate)){
        this.showError(Common.lang.invalid_date_format);

      }else if( result.starttime >= result.endtime ){
        this.showError(Common.lang.invalid_date_range);

      }else if( (endDate._d.getTime() - startDate._d.getTime())/(60*60*1000) > 2){
        this.showError(Common.lang.invalid_date_limit);

      }else if (!Common.validateStartdate(startDate._d)){
        this.showError(Common.lang.invalid_startdate);
        
      }else{

        if(Common.maintenance){
          var mStart = Common.maintenance.date.getTime();
          var mEnd = mStart + 1000 * 3600 * Common.maintenance.hour;

          var start = startDate._d.getTime();
          var end = endDate._d.getTime();

          if((mStart < start && start < mEnd) || (mStart < end && end < mEnd) ){
            this.showError(Common.maintenance.msg);
            return false;
          }
        }

        result.starttime = me.$start.data('DateTimePicker').getDate().valueOf();
        result.endtime = me.$end.data('DateTimePicker').getDate().valueOf();

        if(Common.isOrgTeacher){
          if(result.is_open){
            result.is_open = 1;
            result.is_replay = 1;
          }else{
            result.is_open = 2;
            result.is_replay = result.is_replay||2;
          }
        }
        
        me.values = result;

        this.hideError();

        return true;
      }
      return false;
    },

    getValues: function(){
      return this.values;
    },

    showError: function(msg){
      this.$error.find('p').text(msg);
      this.$error.slideDown();
    },

    hideError: function(){
      this.$error.hide().find('p').empty();
    },

    addTypes: function(el, field, data) {

      var me = this;

      el.empty();

      var html = '';

      _.each(data, function(i){
        html += me.radioTpl({
          id: i.id,
          name: i.name,
          field: field
        });
      }, this);

      el.append(html);

      if(Common.pageType == 'edit' && Common.info[field]){
        var val = Common.info[field];
        el.find('input').each(function(){
          var value = $(this).val();
          if(value == val){
            $(this).prop('checked', true);
          }
        });
      }
    }

  };

  return BasicView;
});