define([
  'jquery',
  'underscore',
  'text!templates/createClass/student.html',
  'text!templates/createClass/studentFilter.html',
  'text!templates/createClass/studentItem.html',
  'views/createClass/saveGroupDialog',
  'bootbox',
  'common',
  'pagingBar',
  'easing',
  'vgrid',
  'nano'
], 
function($, _, tpl, filterTpl, itemTpl, SaveDialog, bootbox, Common){

  'use strict';

  var StudentView = function(){
    this.render();
    this.initEvents();
  };

  StudentView.prototype = {

    id: 'page-student',

    currentPage: 1,

    limit: 20,

    data: [],

    render: function(){
      var me = this;

      me.$el = $('#page-student');

      var html = _.template(tpl, Common.lang);
      me.$el.html(html);

      me.$list = $('.item-list', me.$el);
      me.$selected = $('.selected-list', me.$el);
      me.$paging = $('.pagingbar', me.$el);
      me.$form = $('#student-search', me.$el);
      me.$submit = $('.submit-btn', me.$el);

      var filter = _.template(filterTpl, Common.lang);
      me.$form.html(filter);

      me.tpl = _.template(itemTpl);

      me.$searchInput = $('input', me.$form);
      me.$group = $('select', me.$form);
      me.$addAll = $('.add-all', me.$form);

      me.$error = $('.error-info', me.$el);

      if(Common.pageType == 'edit'){
        me.renderSelected();
      }
      me.renderPage();
      me.loadGroup();

      me.saveDialog = new SaveDialog();
    },

    loadGroup: function(){
      var me = this;

      me.$group.empty();
      
      var $all = $('<option>').attr('value', 'all').text(Common.lang.all_user);
      me.$group.append($all);

      if(Common.isOrgTeacher){
        var $org = $('<option>').attr('value', 'org').text(Common.lang.org_student);
        me.$group.append($org);
      }

      $.ajax({
        url: Common.api.groupListUrl,
        async: true,
        cache: false,
        dataType: 'json',
        context: me
      }).done(function(data){
        var me = this;

        if(data && data.length){
          var $item;
          _.each(data, function(i){
            $item =$('<option>').attr('value', i.id).text(i.name);
            me.$group.append($item);
          });
          me.$group.val(me.group || 'all');
        }
      });
    },

    renderSelected: function(){
      var me = this;

      if(!Common.info.userid){
        return;
      }

      var json = $.ajax({
        url: Common.api.selectedStudentUrl,
        async: false,
        cache: false,
        data:$.param({
          id: Common.info.userid
        }),
        type: 'post',
        dataType: 'json'
      }).responseJSON;

      _.each(json, function(i){
        me.data.push(i);
        me.addRecord(i);
      });
    },

    onAddAll: function(){
      var me = this;

      if(me.group && me.group != 'all'){
        $.ajax({
          url: Common.api.studentUrl,
          async: true,
          cache: false,
          dataType: 'json',
          data: $.param({
            group: me.group
          }),
          context: me
        }).done(function(data){
          var me = this;

          if(data && data.list && data.list.length){
            var list =_.reject(data.list, function(item){ 
              return _.findWhere(me.data, { id: item.id }); 
            });
            //Minus 1 teacher himself
            if(list.length + me.data.length > Common.CLASS_MAX_SIZE){
              me.showLimitError();
              return;
            }

            me.$list
            .find('.student-option').addClass('selected')
            .find('.item-buttons').empty();

            _.each(list, function(i){
              me.data.push(i);
              me.addRecord(i);
            });
          }
        });
      }
    },

    initEvents: function(){
      var me = this;

      $('.prev-btn', me.$el).on('click', function(e){
        e.preventDefault();
        $(Common).triggerHandler('goPrev', {});
      });

      me.$addAll.on('click', function(){
        me.onAddAll();
      });

      me.$form.on('submit', function(e){
        e.preventDefault();
        me.renderPage(1);
      });

      $('.search-btn', me.$form).on('click', function(e){
        e.preventDefault();
        me.renderPage(1);
      });

      me.$group.on('change', function(e){
        e.preventDefault();

        var val = $(this).val();
        me.group = val;
        me.$addAll.prop('disabled', val == 'all');

        me.renderPage(1);
      });

      $('.select-all', me.$el).on('click', function(e){
        e.preventDefault();

        var list =_.reject(me.collection, function(item){ 
          return _.findWhere(me.data, { id: item.id }); 
        });
        //Minus 1 teacher himself
        if(list.length + me.data.length > Common.CLASS_MAX_SIZE){
          me.showLimitError();
          return;
        }

        me.$list
        .find('.student-option').addClass('selected')
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

      me.$submit.on('click', me, me.submit);

      $(me.saveDialog).on('beforeAdd', function(){
        me.saveDialog.ids = me.getValues().userid;
      });

      $(me.saveDialog).on('add', function(){
        me.loadGroup();
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

      $.extend(cfg, {
        start: (page-1)*me.limit,
        limit: me.limit,
      });

      me.xhr = $.ajax({
        url: Common.studentUrl,
        async: true,
        cache: false,
        dataType: 'json',
        data: $.param(cfg),
        context: me
      }).done(function(data){
        if(data && data.list){

          me.collection = data.list;
          this.initList(data.list);
          this.addEvents();

          data.totalPage = Math.ceil(data.total/this.limit);

          if(me.pagingBar){
            me.pagingBar.repaint(page, data.totalPage);
          }else{
            me.pagingBar = new sy.ui.PagingBar({
              type: 'small',
              prevText: Common.lang.prev,
              nextText: Common.lang.next,
              total: data.totalPage,
              currentPage: page,
              $el: me.$paging,
              onClick: function(val){
                me.renderPage(val);
              }
            });
          }
        }
      });

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

      me.$list.vgrid({
        easing: 'easeOutQuint',
        time: 500,
        delay: 20,
        fadeIn: {
          time: 300,
          delay: 50
        },
        forceAnim: 1
      });
    },

    addEvents: function(){
      var me = this;

      me.$list.children().each(function(i){
        var el = $(this);
        el.data('model', me.collection[i]);

        el.find('.add-btn').on('click', { el: el, scope:me}, me.onAdd);
      });
    },

    showLimitError: function(){
      var str = Common.lang.select_max_size.replace('{num}', Common.CLASS_MAX_SIZE);
      bootbox.alert(str);
    },

    onAdd: function(e){
      e.preventDefault();

      var me = e.data.scope;
      var $el = e.data.el;

      if(me.data.length >= Common.CLASS_MAX_SIZE){
        me.showLimitError();
        return;
      }

      var model = $el.data('model');
      me.data.push(model);

      $(this).hide();

      $el.find('.student-option').addClass('selected');
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

        for(var i in me.collection){
          if(model.id == me.collection[i].id){
            me.$list.find('.student-option').eq(i).removeClass('selected').find('.add-btn').show();
          }
        }
        $el.remove();
        // me.renderPage();
      });
    },

    validate: function(){
      return true;
    },

    getValues: function(){
      return {
        userid: _.map(this.data, function(i){ return i.id; }).join(',')
      };
    },

    showError: function(msg){
      this.$error.find('p').text(msg);
      this.$error.slideDown();
    },

    hideError: function(){
      this.$error.hide().find('p').empty();
    },

    submit: function(e){
      e.preventDefault();

      var me = e.data;

      me.xhr && me.xhr.abort();

      me.$submit.button('loading');

      $.extend(Common.info, me.getValues());

      var values = Common.info;

      var url = Common.addUrl;

      if(Common.pageType == 'edit'){
        url = Common.editUrl;
        values.id =Common.classId;

        var student = values.userid ? values.userid.split(',') : [];
        var orig_student = Common.orig_info.userid ? Common.orig_info.userid.split(',') : [];
        var del_student = _.difference(orig_student, student);
        values.del_student = del_student.join(',');

        var courseware_id = values.courseware_id ? values.courseware_id.split(',') : [];
        var orig_courseware_id = Common.orig_info.courseware_id ? Common.orig_info.courseware_id.split(',') : [];
        var del_courseware_id = _.difference(orig_courseware_id, courseware_id);
        values.del_courseware_id = del_courseware_id.join(',');
      }

      var params = $.param(values);

      me.xhr = $.ajax({
        url: url,
        cache: false,
        type: 'post',
        data: params,
        dataType: 'json'
      }).done(function(data){

        if(data&& data.success){
          $(window).off('beforeunload', Common.onBeforeUnload);
          window.location.href = 'myLiveClass.html';
        }else{
          me.$submit.button('reset');
          
          if(Common.pageType == 'edit'){
            bootbox.alert(Common.lang.edit_class_failed);
          }else{
            bootbox.alert(Common.lang.create_class_failed);
          }
        }

      }).fail(function(){
        me.$submit.button('reset');
      });
      
    }

  };

  return StudentView;

});