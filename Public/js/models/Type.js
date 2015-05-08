define([
	'jquery',
	'common'
],function ($, Common) {
	'use strict';

	Common.api = Common.api || {};
	$.extend(Common.api, {
		languageUrl:  '/Course/Index/classification/id/1',
    categoryUrl:  '/Course/Index/classification/id/2',
    targetUrl :   '/Course/Index/classification/id/3',
    levelUrl :    '/Course/Index/classification/id/4',
    formUrl :    	'/Course/Index/classification/id/5',
    goalUrl :    	'/Course/Index/classification/id/6',
    skillUrl :    '/Course/Index/classification/id/7'
	});
});