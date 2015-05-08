define([
	'jquery',
	'common'
],function ($, Common) {
	'use strict';

	Common.api = Common.api || {};
	$.extend(Common.api, {
		profileEditUrl: '/user/teacher/description',
    nicknameEditUrl: '/user/user/edit',
    avatarUploadUrl: '/user/user/edit'
	});
});