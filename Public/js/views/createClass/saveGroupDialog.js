define([
  'jquery',
  'underscore',
  'text!templates/group/addDialog.html',
  'common',
  'ezpz_hint'
], 
function($, _, tpl, Common){

  'use strict';

  /**
   * Events:
   * beforeAdd
   * add
   */
  var SaveGroupDialog = function(){
    this.render();
  };

  SaveGroupDialog.prototype = {

    render: function(){
      var me = this;

      var translate = $.extend({}, Common.lang, {
        add_group : Common.lang.save_as_group,
        add : Common.lang.save
      });

      var html = _.template(tpl, translate);
      me.$el = $(html).appendTo($('body'));

      me.$form = $('form', me.$el);
      me.$input = $('input', me.$el);
      me.$err = $('.alert', me.$el);
      me.$submit = $('.submit-btn', me.$el);

      if(!Modernizr.indexeddb){
        me.$input.ezpz_hint();
      }

      me.initEvents();

      return this;
    },

    initEvents: function(){
      var me = this;

      me.$el.on('hidden.bs.modal', me, function (e) {
        e.data.reset();
      });

      me.$el.on('shown.bs.modal', me, function (e) {
        e.data.$input[0].focus();
      });

      me.$submit.on('click', me, me.submit);

      me.$form.on('submit', me, function(e){
        e.preventDefault();
        me.submit(e);
      });
    },

    submit: function(e){
      var me = e.data;

      var val = $.trim(me.$input.val());

      if(me.validate(val)){

        $(me).triggerHandler('beforeAdd');

        me.$submit.prop('disabled', true);

        $.ajax({
          url: Common.api.saveGroupUrl,
          data: $.param({
            name: val,
            id: me.ids
          }),
          async: true,
          cache: false,
          type: 'post',
          dataType: 'json'
        }).done(function(data){
          if(data){
            if(data.success){
              me.$el.modal('hide');
              $(me).triggerHandler('add', [data.id, val]);

            }else if(data.error_code == 703){
              
              var msg = $.nano(Common.lang.group_exist_tpl, {
                name: val
              });
              me.$err.text(msg).slideDown();
            }else{
              me.$err.text(Common.lang.save_failed).slideDown();
            }
            
          }else{
            me.$err.text(Common.lang.save_failed).slideDown();
          }
        }).always(function(){
          me.$submit.prop('disabled', false);
        });
      }
      
    },

    validate: function(val){
      var me = this;
      var res = false;
      var err = '';

      if(!val){
        err = Common.lang.required_field;
        me.$input.val('');
      }else if(val.length > 50){
        err = Common.lang.group_name_maxlength;
      }else{
        res = true;
      }
      
      if(err){
        me.$err.text(err).slideDown();
      }

      return res;
    },

    reset: function(){
      var me = this;

      me.$form[0].reset();
      me.$err.hide().text('');
    }
  };

  return SaveGroupDialog;
});

