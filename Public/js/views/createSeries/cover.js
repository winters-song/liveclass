define([
  'jquery',
  'underscore',
  'common',
  'text!templates/createSeries/cover.html',
  'fileupload',
  'tmpl',
  'iframe-transport',
  'fileupload-validate',
  'imgareaselect'
], 
function($, _, Common, tpl ){

  'use strict';

  var CoverView = function(){
    this.render();
    this.initEvents();
  };

  CoverView.prototype = {

    id: 'page-cover',

    data: {},

    coverChanged: false,
    posChanged: false,

    render: function(){
      var me = this;

      me.$el = $('#page-cover');

      var html = _.template(tpl, Common.lang);
      var $html = $(html);

      me.$el.html($html);

      me.$form = $('form', me.$el);
      me.$error = $('.error-info', me.$el);
      me.$file = $('.fileupload', me.$el);

      if(Common.pageType == 'edit'){
        me.setCover(Common.info.cover);
      }
    },

    initEvents: function(){
      var me = this;

      $('.prev-btn', me.$el).on('click', function(e){
        e.preventDefault();
        $(Common).triggerHandler('goPrev', {});
      });

      $('.next-btn', me.$el).on('click', function(e){
        e.preventDefault();
        $(Common).triggerHandler('goNext', {});
      });

      me.initFileUpload();
    },

    setCover: function(src){
      var me = this;

      var cover = $('<img id="cover-img">').attr('src',src);
      var preview = $('<img id="preview-img">').attr('src',src);
      $("#cover").html(cover);
      $("#preview").html(preview);

      me.data.cover = src;

      me.onChange();
    },

    initFileUpload: function(){
      var me = this;

      me.$file.fileupload({
        url: Common.api.seriesCoverUrl,
        dataType: 'json',
        autoUpload: true,
        // acceptFileTypes : regex,
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
        maxFileSize: 5242880, // 5 MB
        maxNumberOfFiles: 1,
        messages: {
          maxNumberOfFiles: Common.lang.maxNumberOfFiles,
          acceptFileTypes: Common.lang.acceptFileTypes,
          maxFileSize: Common.lang.maxFileSize,
          minFileSize: Common.lang.minFileSize
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
          var src = json.cover;

          me.coverChanged = true;
          me.setCover(src);
        }else{
          Common.alert(Common.lang.file_upload_failed);
          console.log(json);
        }

      }).on('fileuploadfail', function (e, data) {
        Common.alert(Common.lang.file_upload_failed);
      });
    },

    onChange: function(){
      var me = this;

      function onSelect(img, selection) {
        if (!selection.width || !selection.height){
          return;
        }

        var scale = 400 / selection.width;
      
        $('#preview-img').css({
            width: scale * 400 +'px',
            marginLeft: '-' + Math.round(scale * selection.x1) + 'px',
            marginTop: '-' + Math.round(scale * selection.y1) + 'px'
        });
      }

      $('#cover-img').imgAreaSelect({ 
        handles: true,
        aspectRatio: '16:9', 
        minWidth: 50,
        minHeight: 50,
        parent: $("#cover"),
        x1: 120,
        y1: 72,
        x2: 280,
        y2: 162,
        onInit: onSelect,
        onSelectChange: onSelect,
        onSelectEnd: function(img, selection) {
          if (!selection.width || !selection.height){
            return;
          }

          me.posChanged = true;

          $.extend(me.data, {
            x1: selection.x1,
            x2: selection.x2,
            y1: selection.y1,
            y2: selection.y2
          });
        }
      });

    },
    
    validate: function(){
      return true;
    },

    getValues: function(){
      var me = this;

      if(Common.pageType == 'edit'){
        if(!me.posChanged){
          if(!me.coverChanged){
            $.extend(this.data,{
              x1: null,
              x2: null,
              y1: null,
              y2: null
            });
          }else{
            $.extend(this.data,{
              x1: 120,
              y1: 72,
              x2: 280,
              y2: 162
            });
          }
        }
      }else if(!me.posChanged){
        $.extend(this.data,{
          x1: 120,
          y1: 72,
          x2: 280,
          y2: 162
        });
      }
      return this.data;
    },

    showError: function(msg){
      this.$error.find('p').text(msg);
      this.$error.slideDown();
    },

    hideError: function(){
      this.$error.hide().find('p').empty();
    }

  };

  return CoverView;
});