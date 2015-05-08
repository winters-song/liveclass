define([
  'jquery',
  'underscore',
  'common',
  'text!templates/createSeries/classes.html',
  'text!templates/createSeries/classItem.html',
  'pagingBar',
  'jquery-ui',
  'models/Class'
], 
function($, _, Common, tpl, itemTpl){

  'use strict';

  var ClassesView = function(){
    this.render();
    this.initEvents();
  };

  ClassesView.prototype = {

    id: 'page-classes',

    currentPage: 1,

    limit: 10,

    data: [],

    render: function(){
      var me = this;

      me.$el = $('#page-classes');

      var html = _.template(tpl, Common.lang);
      me.$el.html(html);

      me.$list = $('.item-list', me.$el);
      me.$selected = $('.selected-list', me.$el);
      me.$paging = $('.pagingbar', me.$el);
      me.$form = $('#class-search', me.$el);
      me.$searchInput = $('input[name=name]', me.$form);

      me.$submit = $('.submit-btn', me.$el);

      me.tpl = _.template(itemTpl);

      me.$error = $('.error-info', me.$el);

      if(Common.pageType == 'edit'){
        me.renderSelected();
      }

      me.renderPage();
    },

    renderSelected: function(){
      var me = this;
      if(!Common.seriesId){
        return;
      }
      me.$selected.empty();

      me.selectedXhr && me.selectedXhr.abort();

      me.selectedXhr = $.ajax({
        url: Common.api.seriesClassUrl,
        cache: false,
        data: $.param({
          id: Common.seriesId
        }),
        dataType: 'json'
      }).done(function(data){
        if(data && data.list){
          _.each(data.list, function(i){
            me.addRecord(i, true);
          });
        }
      });
      
    },

    initEvents: function(){
      var me = this;

      $('.prev-btn', me.$el).on('click', function(e){
        e.preventDefault();
        $(Common).triggerHandler('goPrev', {});
      });

      me.$submit.on('click', me, function(e){
        e.preventDefault();
        $(Common).triggerHandler('submit', [me, $(this)]);
      });

      me.$form.on('submit', function (e) {
        e.preventDefault();
        me.renderPage(1); 
      });

      $('.search-btn', me.$form).on('click', function(e){
        e.preventDefault();
        me.renderPage(1); 
      });

      //sorting
      me.$selected.sortable({
        handle: ".move-icon",
        update: function( event, ui ) {
          var $el = ui.item;
          var model = $el.data('model');
          var prev = '', next = '', $prev, $next;
          // console.log("Move Class: ");
          // console.log(model);

          $prev = $el.prev();
          if($prev.size()){
            prev = $prev.data('model').sort;
          }
          console.log("Prev: " + prev);

          $next = $el.next();
          if($next.size()){
            next = $next.data('model').sort;
          }
          console.log("Next: " + next);

          me.onSort(model, prev, next);

          
        }
      });
      me.$selected.disableSelection();

    },

    onSort: function(model, prev, next){
      var me = this;

      if(Common.pageType == 'edit'){
        var tmpData = _.clone(me.data);

        me.actionXhr && me.actionXhr.abort();

        me.actionXhr = $.ajax({
          url: Common.api.seriesClassSortUrl,
          data: $.param({
            sid: Common.seriesId,
            clid: model.clid,
            prev: prev,
            next: next
          }),
          type: 'post',
          cache: false,
          dataType: 'json'
        }).done(function(data){
          if(data && data.success){
            model.sort = data.sort;

            me.data = [];
            me.$selected.children().each(function(){
              var model = $(this).data('model');
              me.data.push(model);
            });
          }else{
            Common.alert(Common.lang.edit_failed);
            me.renderSelected();
          }
        }).fail(function(){
          Common.alert(Common.lang.edit_failed);
          me.renderSelected();
        });
      }else{
        me.data = [];
        me.$selected.children().each(function(){
          var model = $(this).data('model');
          me.data.push(model);
        });
      }

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
        url: Common.api.classListUrl_t,
        async: true,
        cache: false,
        dataType: 'json',
        data: $.param(cfg),
        context: me
      }).done(me.onRender);

    },

    onRender: function(data){
      var me = this;

      if(data && data.list && data.list.length){

        me.collection = data.list;
        me.initList(data.list);
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

        json.selected = !!_.findWhere(me.data, { clid : i.clid }); 

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

      $(this).remove();
      $el.addClass('selected');
      me.addRecord(model, false);
    },

    onRemove: function(e){
      e.preventDefault();

      var me = e.data.scope;
      var $el = e.data.el;

      var model = $el.data('model');

      console.log('Remove Class:');
      console.log(model);

      if(Common.pageType == 'edit'){
        var tmpData = me.data;
        $el.hide();

        me.actionXhr && me.actionXhr.abort();

        me.actionXhr = $.ajax({
          url: Common.api.seriesClassDeleteUrl,
          data: $.param({
            sid: Common.seriesId,
            clid: model.clid
          }),
          type: 'post',
          cache: false,
          dataType: 'json'
        }).done(function(data){
          if(data && data.success){
            $el.remove();
          }else{
            Common.alert(Common.lang.remove_failed);
            $el.show();
            me.data = tmpData;
            me.renderPage();
          }
        }).fail(function(){
          Common.alert(Common.lang.remove_failed);
          $el.show();
          me.data = tmpData;
          me.renderPage();
        });
      }else{
        $el.remove();
      }

      me.data = _.without(me.data, model);
      me.renderPage();
    },

    addRecord: function(model, skipAction){

      var me = this;

      var json = me.itemTranslate(model);

      json.state = 'remove';
      json.selected = false;

      var html = me.tpl(json);

      var $el = $(html);

      $el.data('model', model);

      $el.appendTo(me.$selected);

      $el.find('.remove-btn').on('click', { el: $el, scope:me}, me.onRemove);

      // console.log('Add Class:');
      // console.log(model);

      if(Common.pageType == 'edit' && !skipAction){
        var tmpData = _.clone(me.data);

        me.actionXhr && me.actionXhr.abort();

        me.actionXhr = $.ajax({
          url: Common.api.seriesClassAddUrl,
          data: $.param({
            uid: model.uid,
            clid: model.clid,
            name: _.unescape(model.name),
            sid: Common.seriesId
          }),
          type: 'post',
          cache: false,
          dataType: 'json'
        }).done(function(data){
          if(data && data.success){
            model.sort = data.sort;
            console.log(me.data);
          }else{
            Common.alert(Common.lang.add_failed);
            $el.remove();
            me.data = tmpData;
            me.renderPage();
          }
        }).fail(function(){
          Common.alert(Common.lang.add_failed);
          $el.remove();
          me.data = tmpData;
          me.renderPage();
        });
      }

      me.data.push(model);
    },

    validate: function(){
      return true;
    },

    getValues: function(){
      var arr = [];
      _.each(this.data, function(i){
        var obj = _.pick(i, 'clid', 'uid', 'name');
        obj.name = _.unescape(obj.name);
        arr.push(obj);
      });
      
      return {
        class_id :arr
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

  return ClassesView;

});