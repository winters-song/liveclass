({
  baseUrl:'../js',

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
  },
  findNestedDependencies : true,
  preserveLicenseComments: false,
	name: "detect",
 	out: "../built/detect.js"
})
