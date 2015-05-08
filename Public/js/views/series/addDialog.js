define([
  'jquery',
  'underscore',
  'text!templates/series/addDialog.html',
  'common',
  'fileupload',
  'tmpl',
  'iframe-transport',
  'fileupload-validate'
], 
function($, _, addTpl, Common){

  'use strict';

  var AddDialog = function(){

    $.extend(this, {
      submitText: Common.lang.submit,
      abortText: Common.lang.abort
    });

    this.render();
  };

  AddDialog.prototype = {

    fileTypes: [
      'jpg','png'
    ],

    render: function(){
      var me = this;

      var html = _.template(addTpl, Common.lang);
      me.$el = $(html).appendTo($('body'));

      me.$form = $('form', me.$el);

      me.$err = $('.error-msg', me.$el);

      me.$submit = $('.submit-btn', me.$el);
      me.$preview = $('.preview', me.$el);
      me.$file = $('.fileupload', me.$el);
      me.$check = $('input[type=checkbox]', me.$el);

      me.$language = $('#language-list', me.$el);
      me.$category = $('#category-list', me.$el);
      me.$target = $('#target-list', me.$el);
      me.$level = $('#level-list', me.$el); 

      var $checkboxTpl = $('#checkboxTpl').html();
      me.checkboxTpl = _.template($checkboxTpl);

      me.initEvents();

      me.initFileUpload();

      me.initCombo();

      return this;
    },

    initEvents: function(){
      var me = this;

      me.$el.on('hidden.bs.modal', me, function (e) {
        e.data.reset();
      });

      me.$submit.on('click', me, me.submit);

      me.$check.on('change', me, function(){
        var val = $(this).prop('checked');
        me.$submit.prop('disabled', !val);
      });

    },

    initCombo: function(){
      var me = this;

      $.ajax({
        url: Common.languageUrl,
        data: $.param({
          lang: Common.language
        }),
        cache: false,
        async: true,
        dataType: 'json'
      }).done(function(data){
        me.addLanguages(data);
      });
      
      $.ajax({
        url: Common.categoryUrl,
        data: $.param({
          lang: Common.language
        }),
        cache: false,
        async: true,
        dataType: 'json'
      }).done(function(data){
        me.addCategories(data);
      });

      $.ajax({
        url: Common.targetUrl,
        data: $.param({
          lang: Common.language
        }),
        cache: false,
        async: true,
        dataType: 'json'
      }).done(function(data){
        me.addTargets(data);
      });

      $.ajax({
        url: Common.levelUrl,
        data: $.param({
          lang: Common.language
        }),
        cache: false,
        async: true,
        dataType: 'json'
      }).done(function(data){
        me.addLevels(data);
      });
      
    },

    submit: function(e){
      var me = e.data;

      var $this = me.$submit,
        data = $this.data();

      if(me.validate(data)){
        $this
          .off('click')
          .text(me.abortText)
          .on('click', function () {
            data.abort();
          });
        data.submit().always(function () {
          $this.text(me.submitText);
          $this.on('click', me, me.submit);
        });
      }
      
    },

    validate: function(data){

      var me = this;
      var res = false;
      var err = '';
      var cfg = {};

      var values = me.$form.serializeArray();

      _.each(values, function(obj){
        cfg[obj.name] = obj.value;
      });

      var list = [
        'name', 
        'description'
      ];

      if(!(data.files && data.files.length)){
        err = Common.lang.require_file_upload;
      }else{

        res = true;

        _.each(list, function(i){
          if(!$.trim(cfg[i])){
            $('[name='+i+']', me.$form ).val('');

            err = Common.lang.require_fields;
            res = false;
            return false;
          }
        });
      }

      if(!res){
        me.$err.text(err).slideDown();
      }

      return res;
    },

    reset: function(){
      var me = this;

      me.$form[0].reset();
      me.$preview.empty();
      me.$err.hide().text('');
    },

    initFileUpload: function(){
      var me = this;

      var regex = new RegExp('(\.|\/)(' + me.fileTypes.join('|')+ ')$','i');

      me.$file.fileupload({
        url: Common.uploadUrl,
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

        data.context = me.$preview;

        $.each(data.files, function (index, file) {
          var node = $('<p/>').addClass('ellipsis').text(file.name).attr('title', file.name);
          data.context.html(node);
          me.$submit.data(data);
        });

      }).on('fileuploadprocessalways', function (e, data) {
          var index = data.index,
              file = data.files[index],
              node = data.context;
          
          if (file.error) {
            data.context.html('');
            alert(file.error);
          }else if(Modernizr.csstransitions){
            var $progress = $('<div class="progress"><div class="progress-bar progress-bar-success"></div></div>');
            node.append($progress);
          }

          if (index + 1 === data.files.length) {
            me.$submit.text(me.submitText).prop('disabled', !!data.files.error);
          }

      }).on('fileuploadprogressall', function (e, data) {

          var progress = parseInt(data.loaded / data.total * 100, 10);
          $('.progress-bar', data.context).css(
              'width',
              progress + '%'
          );

      }).on('fileuploaddone', function (e, data) {

        var json = data.result;

        if(json && json.success) {

          var node = data.context;

          $(node).empty();
          me.$submit.removeData();

          me.$el.modal('hide');

          $(me).triggerHandler('success');
          
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
    addLanguages: function(data) {

      var me = this;

      me.$language.empty();

      var html = '';

      _.each(data, function(i){

        html += me.checkboxTpl({
          id: i.id,
          name: i[Common.language],
          field: 'language'
        });

      }, this);

      this.$language.append(html);

      if(Common.pageType == 'edit' && Common.info.language){
        var list = Common.info.language.split(',');
        this.$language.find('input').each(function(){
          var value = $(this).val();
          if(_.contains(list, value)){
            $(this).prop('checked', true);
          }
        });
      }
    },

    addCategories: function(data) {

      var me = this;

      me.$category.empty();

      var html = '';

      _.each(data, function(i){

        html += me.checkboxTpl({
          id: i.id,
          name: i[Common.language],
          field: 'category'
        });

      }, this);

      this.$category.append(html);

      if(Common.pageType == 'edit' && Common.info.category){
        var list = Common.info.category.split(',');
        this.$category.find('input').each(function(){
          var value = $(this).val();
          if(_.contains(list, value)){
            $(this).prop('checked', true);
          }
        });
      }
    },

    addTargets: function(data) {

      var me = this;

      me.$target.empty();

      var html = '';

      _.each(data, function(i){

        html += me.checkboxTpl({
          id: i.id,
          name: i[Common.language],
          field: 'target'
        });

      }, this);

      this.$target.append(html);

      if(Common.pageType == 'edit' && Common.info.target){
        var list = Common.info.target.split(',');
        this.$target.find('input').each(function(){
          var value = $(this).val();
          if(_.contains(list, value)){
            $(this).prop('checked', true);
          }
        });
      }
    },

    addLevels: function(data) {

      var me = this;

      me.$level.empty();

      var html = '';

      _.each(data, function(i){

        html += me.checkboxTpl({
          id: i.id,
          name: i[Common.language],
          field: 'level'
        });

      }, this);

      this.$level.append(html);

      if(Common.pageType == 'edit' && Common.info.level){
        var list = Common.info.level.split(',');
        this.$level.find('input').each(function(){
          var value = $(this).val();
          if(_.contains(list, value)){
            $(this).prop('checked', true);
          }
        });
      }
    }

  };

  return AddDialog;
});

