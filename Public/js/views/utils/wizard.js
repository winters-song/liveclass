define([
  'jquery',
  'underscore',
  'common'
], 
function($, _, Common){

  'use strict';

  /**
   * Base Class
   * needs this.tpl
   * needs this.collection
   */
  var Wizard = function(cfg){
    $.extend(this, cfg);
    this.initialize();
    this.render();
    this.initEvents();
  };

  Wizard.prototype = {

    initialize: function(){
      var me = this;
      if(Common.pageType == 'edit'){
        me.collection[1].state = 'finished';
        me.collection[2].state = 'finished';
      }
    },

    render: function(){
      var me = this;

      var fragment = me.tpl(Common.lang);
      
      me.$el.append(fragment);
      me.$list = $('a', me.$el);

      me.onChange();
    },

    initEvents: function(){
      var me = this;

      me.$list.on('click', me, me.navigate);

    },

    navigate: function(e){
      e.preventDefault();
      var me = e.data;

      var name = $(this).data('label');
      var state = _.findWhere(me.collection, { name: name }).state;

      if(state == 'finished'){
        $(Common).triggerHandler('toggle', name);
      }
    },

    goPrev: function(){
      var me = this;

      var active = me.getActive();
      var index = _.indexOf(me.collection, active);

      if(index > 0){
        active.state = 'finished';

        var prev = me.collection[index - 1];
        prev.state = 'active';

        this.onChange();
      }
    },

    goNext: function(){
      var me = this;

      var active = this.getActive();
      var index = _.indexOf(me.collection, active);

      if(index < me.collection.length - 1){
        active.state = 'finished';

        var next = me.collection[index + 1];
        next.state = 'active';

        this.onChange();
      }
    },

    goTo: function(name){

      var me = this;

      var active = me.getActive();
      active.state = 'finished';

      var model = _.findWhere(me.collection, { name: name });
      model.state = 'active';

      this.onChange();

    },

    getActive: function(){
      return _.findWhere(this.collection, { state: 'active' });
    },

    onChange: function(){

      var me = this;

      var active = this.getActive();

      $(Common).triggerHandler('state', active.name);

      $('a', me.$el).each(function(i){
        $(this).attr('class', me.collection[i].state );
      });
    },

    isDone: function(){
      var rec = _.last(this.collection);
      return rec.state !== 'disabled';
    }
  };

  return Wizard;

});