define([
  'jquery',
  'underscore',
  'text!templates/courseware/editDialog.html',
  'common'
], 
function($, _, editTpl, Common){

  'use strict';

  var EditDialog = function(){
    this.render();
  };

  EditDialog.prototype = {

    render: function(){
      var me = this;

      var html = _.template(editTpl, Common.lang);
      me.$el = $(html).appendTo($('body'));

      me.$form = $('form', me.$el);
      me.$err = $('.alert', me.$el);
      me.$submit = $('.edit-btn', me.$el);

      me.initEvents();

      return this;
    },

    set: function(model){

      var me = this;

      this.$form[0].reset();
      $('[name=id]', me.$el).val(model.id);
      $('[name=name]', me.$el).val(model.name);
      $('[name=description]', me.$el).val(model.description);
      $('[name=co_tags]', me.$el).val(model.co_tags);

      return this;
    },

    initEvents: function(){
      var me = this;

      me.$el.on('hidden.bs.modal', me, function (e) {
        e.data.reset();
      });

      me.$submit.on('click', me, me.submit);
    },

    submit: function(e){
      var me = e.data;

      if(me.validate()){
        $.ajax({
          url: Common.api.coursewareEditUrl,
          data: me.$form.serialize(),
          async: true,
          cache: false,
          type: 'post',
          dataType: 'json'
        }).done(function(data){
          if(data && data.success){
            me.$el.modal('hide');
            $(me).triggerHandler('success');
          }else{
            alert(Common.lang.edit_failed);
          }
        });
      }
      
    },

    validate: function(){

      var me = this;
      var res = false;
      var err = '';
      var cfg = {};

      var values = me.$form.serializeArray();

      _.each(values, function(obj){
        cfg[obj.name] = obj.value;
      });

      var list = [
        'name', 
        'description'
      ];

      res = true;

      _.each(list, function(i){
        if(!cfg[i]){
          err = Common.lang.require_fields;
          res = false;
          return false;
        }
      });
        
      me.$err.text(err).slideDown();

      return res;
    },

    reset: function(){
      var me = this;

      me.$form[0].reset();
      me.$err.hide().text('');
    }
  };

  return EditDialog;
});

