define([
  'jquery',
  'underscore',
  'text!templates/createClass/courseware.html',
  'text!templates/createClass/coursewareItem.html',
  'views/courseware/addDialog',
  'bootbox',
  'common',
  'pagingBar'
], 
function($, _, tpl, itemTpl, AddDialog, bootbox, Common){

  'use strict';

  var CoursewareView = function(){
    this.render();
    this.initEvents();
  };

  CoursewareView.prototype = {

    id: 'page-courseware',

    currentPage: 1,

    limit: 10,

    data: [],

    render: function(){
      var me = this;

      me.$el = $('#page-courseware');

      var html = _.template(tpl, Common.lang);
      me.$el.html(html);

      me.$list = $('.item-list', me.$el);
      me.$selected = $('.selected-list', me.$el);
      me.$paging = $('.pagingbar', me.$el);
      me.$form = $('#courseware-search', me.$el);
      me.$refresh = $('#refresh-courseware', me.$el);

      me.$type = $('input[name=type]', me.$form);
      me.$searchInput = $('input[name=display_name]', me.$form);

      me.$submit = $('.submit-btn', me.$el);

      me.tpl = _.template(itemTpl);

      me.$error = $('.error-info', me.$el);

      if(Common.pageType == 'edit'){
        me.renderSelected();
      }

      me.addDialog = new AddDialog();
      me.renderPage();
    
    },

    renderSelected: function(){
      var me = this;
      if(!Common.info.courseware_id){
        return;
      }

      $.ajax({
        url: Common.api.selectedCoursewareUrl,
        cache: false,
        data: $.param({
          courseware_id: Common.info.courseware_id
        }),
        dataType: 'json'
      }).done(function(data){
        _.each(data, function(i){
          me.data.push(i);
          me.addRecord(i);
        });
      });
      
    },

    initEvents: function(){
      var me = this;

      $('.prev-btn', me.$el).on('click', function(e){
        e.preventDefault();
        $(Common).triggerHandler('goPrev', {});
      });

      // @mark
      // $('.next-btn', me.$el).on('click', function(e){
      //   e.preventDefault();
      //   $(Common).triggerHandler('goNext', {});
      // });
      me.$submit.on('click', me, function(e){
        e.preventDefault();
        $(Common).triggerHandler('submit', [me, $(this)]);
      });
  
      $('.select-all', me.$el).on('click', function(e){
        e.preventDefault();

        var list =_.reject(me.collection, function(item){ 
          return _.findWhere(me.data, { id: item.id }); 
        });

        me.$list
        .find('.courseware-option').addClass('selected')
        .find('.item-buttons').empty();

        _.each(list, function(i){
          me.data.push(i);
          me.addRecord(i);
        });
      });

      $('.remove-all', me.$el).on('click', function(e){
        e.preventDefault();

        me.data = [];
        me.$selected.empty();

        me.renderPage();
      });

      me.$type.on('click', function(){
        me.renderPage(1); 
      });

      me.$form.on('submit', function (e) {
        e.preventDefault();
        me.renderPage(1); 
      });

      $('.search-btn', me.$form).on('click', function(e){
        e.preventDefault();
        me.renderPage(1); 
      });

      me.$refresh.on('click', function(e){
        e.preventDefault();
        me.renderPage(); 
      });

      $(me.addDialog).on('success', function () {
        me.renderPage(1);
      });

    },

    getFilters: function(){
      var me = this;
      var result = {};

      var values = me.$form.serializeArray();

      _.each(values, function(i){
        result[i.name] = i.value;
      });

      return result;
    },

    renderPage: function(page, cfg){

      var me = this;

      me.xhr && me.xhr.abort();

      me.$list.parent().scrollTop(0);

      me.$list.empty();

      if(page){
        me.currentPage = page;
      }else{
        page = me.currentPage;
      }
      if(!cfg){
        cfg = me.getFilters();
      }

      if(cfg.type == 'all'){
        cfg.type = '';
      }else if(cfg.type == 'doc'){
        cfg.type = 'document';
      }

      $.extend(cfg, {
        start: (page-1)*me.limit,
        limit: me.limit,
      });

      me.xhr = $.ajax({
        url: Common.api.coursewareListUrl_t,
        async: true,
        cache: false,
        dataType: 'json',
        data: $.param(cfg),
        context: me
      }).done(me.onRender);

    },

    onRender: function(data){
      var me = this;

      if(data && data.result && data.result.length){

        me.collection = data.result;
        me.initList(data.result);
        me.addEvents();

        data.totalPage = Math.ceil(data.total/me.limit);

        if(me.pagingBar){
          me.pagingBar.repaint(me.currentPage, data.totalPage);
        }else{
          me.pagingBar = new sy.ui.PagingBar({
            prevText: Common.lang.prev,
            nextText: Common.lang.next,
            total: data.totalPage,
            currentPage: me.currentPage,
            $el: me.$paging,
            onClick: function(val){
              me.renderPage(val);
            }
          });
        }
      }else{
        if(me.pagingBar){
          me.pagingBar = null;
          me.$paging.empty();
        }
        var $el = $('<p>').addClass('bg-info').text(Common.lang.no_result_msg);
        me.$list.html($el);
      }
    },
    
    getType: function(){
      return this.$form.find('input[type=radio]:checked').val() || 'all';
    },

    itemTranslate: function(json){
      json.add = Common.lang.add;
      json.remove = Common.lang.remove;

      return json;
    },

    initList: function(data){
      var me = this;

      var html = '';

      _.each(data, function(i){
        var json = me.itemTranslate(i);

        json.state = 'add';

        json.selected = !!_.findWhere(me.data, { id : i.id }); 

        html += me.tpl(json);
      });

      me.$list.append(html);
    },

    addEvents: function(){
      var me = this;

      me.$list.children().each(function(i){
        var el = $(this);
        el.data('model', me.collection[i]);

        el.find('.add-btn').on('click', { el: el, scope:me}, me.onAdd);
      });
    },

    onAdd: function(e){
      e.preventDefault();

      var me = e.data.scope;
      var $el = e.data.el;

      var model = $el.data('model');
      me.data.push(model);

      $(this).remove();
      $el.addClass('selected');
      me.addRecord(model);
    },

    addRecord: function(model){

      var me = this;

      var json = me.itemTranslate(model);

      json.state = 'remove';
      json.selected = false;

      var html = me.tpl(json);

      var $el = $(html);

      $el.appendTo(me.$selected);

      $el.find('.remove-btn').on('click', function(e){
        e.preventDefault();

        me.data = _.without(me.data, model);
        $el.remove();
        me.renderPage();
      });
    },

    validate: function(){
      return true;
    },

    getValues: function(){
      return {
        courseware_id : _.map(this.data, function(i){ return i.id; }).join(',')
      };
    },

    showError: function(msg){
      this.$error.find('p').text(msg);
      this.$error.slideDown();
    },

    hideError: function(){
      this.$error.hide().find('p').empty();
    }

  };

  return CoursewareView;

});