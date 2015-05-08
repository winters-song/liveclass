define([
  'jquery',
  'underscore',
  'text!templates/createTaped/basics.html',
  'text!templates/utils/uploadTpl.html',
  'common',
  'models/Type',
  'fileupload',
  'tmpl',
  'iframe-transport',
  'fileupload-validate'
], 
function($, _, tpl, uploadTpl, Common){

  'use strict';

  var BasicView = function(){
    this.render();
    this.initEvents();
    this.initFileUpload();
  };

  BasicView.prototype = {

    id: 'page-basics',

    fileTypes: [
      '3gp','avi','dat','f4v','flv','m4v','mpeg','mkv','mp4','mpg','rm','rmvb','wmv'
    ],

    required : ['name','description', 'language', 'category', 'level', 'target', 'learning', 'teaching', 'content', 'video'],

    render: function(){
      var me = this;

      me.$el = $('#page-basics');

      var html = _.template(tpl, Common.lang);
      var $html = $(html);
      me.$el.html($html);

      var $radioTpl = $('#radioTpl').html();
      me.radioTpl = _.template($radioTpl);

      me.$form    = $('form', me.$el);
      me.$error   = $('.error-info', me.$el);

      me.$language = $('#language-list', me.$el);
      me.$category = $('#category-list', me.$el);
      me.$target = $('#target-list', me.$el);
      me.$level = $('#level-list', me.$el); 
      me.$forms = $('#form-list', me.$el); 
      me.$goal = $('#goal-list', me.$el); 
      me.$skill = $('#skill-list', me.$el); 
      me.$video = $('#video', me.$el); 

      me.$submit = $('.submit-btn', me.$el);
      me.$preview = $('.preview', me.$el);
      me.$file = $('.fileupload', me.$el);
      me.$check = $('input[type=checkbox]', me.$el);

      if(Common.pageType == 'edit'){
        me.initForm();

        me.required = _.without(me.required, 'video');
      }

      me.initCombo();
    },

    initForm: function(){
      var me = this;

      me.$form.find('[name=name]').val(_.unescape(Common.info.name));
      me.$form.find('[name=description]').val(_.unescape(Common.info.description));
      me.$form.find('[name=tags]').val(_.unescape(Common.info.tags));
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

      me.$form.on('submit', function(e){
        e.preventDefault();
      });

      me.$submit.on('click', me, me.submit);

      me.$check.on('change', me, function(){
        var val = $(this).prop('checked');
        me.$submit.prop('disabled', !val);
      });
     
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

      if(!success){
        this.showError(Common.lang.require_fields);
        
      }else if(result.name.length <3){
        this.showError(Common.lang.class_name_minlength);
      }else{
        
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
    },

    formatFileSize: function (bytes) {
      if (typeof bytes !== 'number') {
        return '';
      }
      if (bytes >= 1000000000) {
        return (bytes / 1000000000).toFixed(2) + ' GB';
      }
      if (bytes >= 1000000) {
        return (bytes / 1000000).toFixed(2) + ' MB';
      }
      return (bytes / 1000).toFixed(2) + ' KB';
    },

    initFileUpload: function(){
      var me = this;

      var regex = new RegExp('(\.|\/)(' + me.fileTypes.join('|')+ ')$','i');

      me.$file.fileupload({
        url: Common.api.tapedUploadUrl,
        dataType: 'json',
        autoUpload: false,
        acceptFileTypes : regex,
        // acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
        maxFileSize: 209715200, // 200 MB
        maxNumberOfFiles: 1,
        messages: {
          maxNumberOfFiles: Common.lang.maxNumberOfFiles,
          acceptFileTypes: Common.lang.acceptFileTypes,
          maxFileSize: Common.lang.maxFileSize,
          minFileSize: Common.lang.minFileSize
        }
      }).on('fileuploadadd', function (e, data) {

        var $this = $(this);

        data.context = me.$preview;

        var file = data.files[0];
        var node = _.template(uploadTpl, {
          name: file.name,
          upload: Common.lang.upload,
          cancel: Common.lang.cancel,
          remove: Common.lang.remove
        });

        data.context.html(node);

        var size = me.formatFileSize(file.size);
        data.context.find('.size').text(size);

        data.context.find('.start').on('click', function(e){
          e.preventDefault();
          $(this).prop('disabled', true);
          if (data && data.submit) {
            data.submit();
          }
        });

        data.context.find('.cancel').on('click', function(e){
          e.preventDefault();
          if (data.abort) {
            data.abort();
          }
          data.context.empty();
        });

        $.when(
          data.process(function () {
            return $this.fileupload('process', data);
          })
        ).done(function () {
          data.context.find('.start').prop('disabled', false);
        }).fail(function () {
          if (data.files.error) {
            data.context.find('.error').text(data.files[0].error);
          }
        });

      }).on('fileuploadprogressall', function (e, data) {

          var progress = parseInt(data.loaded / data.total * 100, 10);
          $('.progress-bar', data.context).css(
              'width',
              progress + '%'
          );

      }).on('fileuploaddone', function (e, data) {

        var json = data.result;

        if(json && json.success) {

          var $el = data.context;
          $el.find('.start').remove();
          $el.find('.cancel').remove();
          $el.find('.progress').remove();
          $el.find('.remove').removeClass('hidden').on('click', function(e){
            $el.empty();
            me.$video.val('');
          });

          me.$video.val(json.result);
          
        }else{
          alert(Common.lang.file_upload_failed);
          console.log(json);
        }

      }).on('fileuploadfail', function (e, data) {
        alert(Common.lang.file_upload_failed);
        console.log(data.result);

      }).prop('disabled', !$.support.fileInput)
          .parent().addClass($.support.fileInput ? undefined : 'disabled');
    },

    submit: function(e){

      var me = e.data;
      var el = this;

      if(!me.validate()){
        return;
      }

      me.xhr && me.xhr.abort();

      $(el).button('loading');

      var values = me.getValues();

      var url = Common.api.tapedAddUrl;

      if(Common.pageType == 'edit'){
        url = Common.api.tapedEditUrl;
        values.id = Common.classId;
      }

      var params = $.param(values);

      me.xhr = $.ajax({
        url: url,
        cache: false,
        type: 'post',
        data: params,
        dataType: 'json'
      }).done(function(data){

        if(data&& data.success){
          // $(window).off('beforeunload', Common.onBeforeUnload);
          window.location.href = 'myClass_t.html';
        }else{
          $(el).button('reset');
          
          if(Common.pageType == 'edit'){
            bootbox.alert(Common.lang.edit_class_failed);
          }else{
            bootbox.alert(Common.lang.create_class_failed);
          }
        }

      }).fail(function(){
        $(el).button('reset');
      });
      
    }

  };

  return BasicView;
});