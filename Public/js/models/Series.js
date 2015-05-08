define([
	'jquery',
	'common'
],function ($, Common) {
	'use strict';

	Common.api = Common.api || {};
	$.extend(Common.api, {
		seriesAddUrl:   	'/Course/Series/add_series',
    seriesEditUrl:   '/Course/Series/editSeries',
    seriesDeleteUrl: '/Course/Series/del_series',
    seriesInfoUrl: 	'/Course/Series/series_info',
    seriesCoverUrl: '/Course/Series/up_pic',
    seriesClassUrl: 	'/Course/Series/seriesClassList',

    seriesClassAddUrl: 	'/Course/Series/addSeriesClass',
    seriesClassDeleteUrl:   '/Course/Series/delSeriesClass',
    seriesClassSortUrl: 	'/Course/Series/editClassSort',

		seriesListUrl: 	'/Course/Series/querySeriesList',
		seriesListUrl_s: '/Course/Series/my_seriesClass',
		seriesListUrl_t: '/Course/Series/teacher_seriesClass',

    seriesFollowUrl: 	'/Course/Series/followSeriesUser',
    otherSeriesUrl: 	'/Course/Series/seriesOtherList',

    admin: {
    	seriesEditUrl:   '/Course/Admin/editSeries',
    	seriesDeleteUrl: '/Course/Admin/del_series'
    }
	});
});