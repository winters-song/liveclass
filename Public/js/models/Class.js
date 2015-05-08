define([
	'jquery',
	'common'
],function ($, Common) {
	'use strict';

	Common.api = Common.api || {};
	$.extend(Common.api, {
		classAddUrl:   	'/Course/Index/add_course',
    classEditUrl:   '/Course/Index/edit_class',
    classDeleteUrl: '/Course/Index/del_class',
    classInfoUrl: 	'/Course/Index/get_classinfo',

		classListUrl: 	'/Course/Index/querylist',
		classListUrl_s: '/Course/Index/my_class',
		classListUrl_t: '/Course/Index/teacher_class',

    classJoinUrl: 	'/Course/Index/add_class',
    classCancelUrl: '/Course/Index/off_class',
    classEnterUrl: 	'/Course/Index/into_class',
    classReplayUrl: '/Course/Index/get_records',
    replayEnableUrl: '/Course/Index/edit_replay',
    otherClassUrl: 	'/Course/Index/teacher_other_list',

    tapedAddUrl: '/Course/Taped/add_taped',
    tapedEditUrl: '/Course/Index/edit_class',
    tapedUploadUrl: '/Course/Taped/uploadTaped'
	});
});