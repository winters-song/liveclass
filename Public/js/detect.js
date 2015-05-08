
require.config({
  baseUrl:'./js',

  shim: {
    underscore: {
      deps: ['jquery'],
      exports: '_'
    },
    bootstrap: {
      deps: ['jquery'],
      exports: '$.fn.popover'
    },
    bootbox: {
      deps: ['bootstrap'],
      exports: 'bootbox'
    },
    detect2: {
      exports: 'jscd'
    }
  },

  paths: {
    jquery: 'libs/jquery/jquery-1.11.0.min',
    underscore: 'libs/underscore/underscore-min',
    cookie: 'libs/jquery/jquery.cookie',
    queryString: 'libs/utils/queryString',
    bootstrap : 'libs/bootstrap/js/bootstrap.min',
    bootbox: 'libs/bootbox/bootbox.min',
    detect2: 'libs/utils/detect',
    swfobject: 'libs/utils/swfobject'
  }

});

require([
  'jquery',
  'underscore',
  'views/detect/upload',
  'views/detect/download',
  'views/detect/form',
  'common',
  'detect2',
  'swfobject'
], function($, _, UploadView, DownloadView, FormPanel, Common){

  'use strict';

  function createFlashConfig(serverIp,isAuthMicAndCamera,isAuthRtmfp) {
    // For version detection, set to min. required Flash Player version, or 0 (or 0.0.0), for no version detection. 
    var swfVersionStr = "11.1.0";
    // To use express install, set to playerProductInstall.swf, otherwise the empty string. 
    var xiSwfUrlStr = './swf/playerProductInstall.swf';
    var _rtmfpSwf = './swf/RTMFP_VIEWER_NEW.swf';
    var flashvars = {};
    flashvars.live_serverip = serverIp;
    flashvars.authMicAndCamera = isAuthMicAndCamera;
    flashvars.authRtmfp = isAuthRtmfp;
    var params = {};
    params.quality = "high";
    params.bgcolor = "#ffffff";
    params.allowscriptaccess = "sameDomain";
    params.allowfullscreen = "true";
    params.wmode = "opaque";
    var attributes = {};
    attributes.id = "RTMFP_VIEWER";
    attributes.name = "RTMFP_VIEWER";
    attributes.align = "middle";
    swfobject.embedSWF(
      _rtmfpSwf, "rtmfp_flash", 
        "215", "138", 
        swfVersionStr, xiSwfUrlStr, 
        flashvars, params, attributes);
  }

  $.extend(Common, {
    langUrl: './js/lang/detect/',
    uploadUrl: '/Api/Speed/upTime',
    downloadUrl: '/Api/Speed/downTime',
    submitUrl: '/api/speed/add'
  });
  Common.initLocale();

  var d = window.jscd;
  var l = Common.lang;
  var cfg = {
    _sys      : d.os +' '+ d.osVersion,
    _browser  : d.browser +' '+ d.browserVersion,
    _mobile   : d.mobile ? l.yes : l.no,
    _flash    : d.flashVersion,
    _cookies  : d.cookies ? l.open_btn : l.close_btn,
    _screen_size     : d.screen
  }

  var data = $.extend({}, cfg, Common.lang);

  var tpl = $('#pageTpl').html();
  var html = _.template(tpl, data);
  var $html = $(html);

  if(!(d.browser == 'Microsoft Internet Explorer' && d.browserVersion*1<8)){
    $('#ie-alert', $html).remove();
  }

  $('body').prepend($html);

  Common.baseInfo = $.extend(cfg, {
    _mobile: d.mobile ? 2 : 1,
    _cookies: d.cookies ? 2 : 1
  });

  createFlashConfig('ms.chinesecio.com','on','off');

  new UploadView();
  new DownloadView();

  new FormPanel();
});
