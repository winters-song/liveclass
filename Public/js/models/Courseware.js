define([
	'jquery',
	'common'
],function ($, Common) {
	'use strict';

	Common.api = Common.api || {};
	$.extend(Common.api, {
		coursewareUploadUrl:  '/Courseware/Index/add_courseware',
    coursewareEditUrl:    '/Courseware/Index/edit_courseware',
    coursewareDeleteUrl:  '/Courseware/Index/del_courseware',
    coursewareInfoUrl: '/api/webservice/courseware_show',

		coursewareListUrl_s: '/Courseware/Index/my_courseware',
		coursewareListUrl_t: '/Api/Webservice/coursewarelist'
	});
});