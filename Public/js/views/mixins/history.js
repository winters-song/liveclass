/**
 * List.js
 * Used for list page. 
 * Provides utils for history state changing 
 */
define([
	'jquery',
  'underscore',
	'common'
], function ($, _, Common) {

	'use strict';

	var boardView, params;

	return {

		initPage: function (b, p) {
			boardView = b;
			params = p;
			this.initHistory();
			this.initHash();
		},

		initHistory : function () {

			History.Adapter.bind(window,'statechange',function(){
		    var State = History.getState(); 
		    var page = State.data.page||1;
		    var cfg = _.pick(State.data, params);
		    
		    boardView.setFilters(cfg);
		    boardView.renderPage(page, cfg);
		  });
		},

		forward : function(page){
	    var values = boardView.getFilters();

	    var cfg = $.extend(values, {
	      page: page,
	      v: new Date().getTime()
	    });

    	var hash = '?' + $.param(cfg);

    	if(hash == window.location.search){
    		boardView.renderPage(page, cfg);
    	}else{
    		History.pushState(cfg, Common.title, hash );
	    }
	  },

	  refresh : function(){
	    boardView.renderPage();
	  },

	  initHash : function () {
	  	var hash = window.location.href;
		  var hashData = hash.queryStringToJSON(); 
		  var page = hashData.page||1;
		  var cfg = _.pick(hashData, params);
		  if(Modernizr.history){
		  	History.replaceState(cfg, Common.title, hash);
		  }
		  
		  boardView.setFilters(cfg);
		  boardView.renderPage(page, cfg);
	  }
	};
});