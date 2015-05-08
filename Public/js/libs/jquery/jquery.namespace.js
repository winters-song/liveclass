/**
 * by Winters
 * 
 * jquery.namespace.js
 * 
 * Example: $.ns('app.layout');
 */
;(function($, window, document) {
	'use strict';
	
	$.ns = function() {
        var root = window,
        parts, part, i, j, ln, subLn;

	    for (i = 0, ln = arguments.length; i < ln; i++) {
	        parts = arguments[i].split(".");
	
	        for (j = 0, subLn = parts.length; j < subLn; j++) {
	            part = parts[j];
	
	            if (typeof part != 'string') {
	                root = part;
	            } else {
	                if (!root[part]) {
	                    root[part] = {};
	                }
	                root = root[part];
	            }
	        }
	    }
	    return root;
	}
	
}(jQuery, window, document));

