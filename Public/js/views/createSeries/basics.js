define([
  'jquery',
  'underscore',
  'text!templates/createSeries/basics.html',
  'common',
  'models/Type'
], 
function($, _, tpl, Common){

  'use strict';

  var BasicView = function(){
    this.render();
    this.initEvents();
  };

  BasicView.prototype = {

    id: 'page-basics',

    required : ['title','description','language', 'category', 'level', 'target', 'learning', 'teaching', 'content'],

    render: function(){
      var me = this;

      me.$el = $('#page-basics');

      var html = _.template(tpl, Common.lang);
      var $html = $(html);
      me.$el.html($html);

      var $radioTpl = $('#radioTpl').html();
      me.radioTpl = _.template($radioTpl);

      me.$form       = $('form', me.$el);
      me.$error     = $('.error-info', me.$el);

      me.$language = $('#language-list', me.$el);
      me.$category = $('#category-list', me.$el);
      me.$target = $('#target-list', me.$el);
      me.$level = $('#level-list', me.$el); 
      me.$forms = $('#form-list', me.$el); 
      me.$goal = $('#goal-list', me.$el); 
      me.$skill = $('#skill-list', me.$el); 

      if(Common.pageType == 'edit'){
        me.initForm();
      }

      if(!Modernizr.indexeddb){
        $('[name=tags]', me.$form).ezpz_hint();
      }

      me.initCombo();
    },

    initEvents: function(){
      var me = this;
      
      $('.next-btn', me.$el).on('click', function(e){
        e.preventDefault();
        $(Common).triggerHandler('goNext', {});
      });
    },

    initForm: function(){
      var me = this;

      me.$form.find('[name=title]').val(_.unescape(Common.info.title));
      me.$form.find('[name=description]').val(_.unescape(Common.info.description));
      me.$form.find('[name=tags]').val(_.unescape(Common.info.tags));

      me.$form.find('[name=signup_url]').val(Common.info.signup_url);
    },

    initCombo: function(){
      var me = this;

      var items = [{
        url: Common.api.languageUrl,
        el: me.$language,
        field: 'language'
      },{
        url: Common.api.categoryUrl,
        el: me.$category,
        field: 'category'
      },{
        url: Common.api.targetUrl,
        el: me.$target,
        field: 'target'
      },{
        url: Common.api.levelUrl,
        el: me.$level,
        field: 'level'
      },{
        url: Common.api.formUrl,
        el: me.$forms,
        field: 'learning'
      },{
        url: Common.api.goalUrl,
        el: me.$goal,
        field: 'teaching'
      },{
        url: Common.api.skillUrl,
        el: me.$skill,
        field: 'content'
      }];

      _.each(items, function(i){
        $.ajax({
          url: i.url,
          data: $.param({
            lang: Common.language
          }),
          cache: false,
          async: true,
          dataType: 'json'
        }).done(function(data){
          me.addTypes(i.el, i.field, data);
        });
      });
      
    },

    validate: function(){

      var me = this;

      var result = {};

      var values = me.$form.serializeArray();

      _.each(values, function(i){
        result[i.name] = i.value;
      });

      $('input:checked', me.$language).each(function(){
        result.language = $(this).val();
      });
      $('input:checked', me.$category).each(function(){
        result.category = $(this).val();
      });
      $('input:checked', me.$level).each(function(){
        result.level = $(this).val();
      });
      $('input:checked', me.$target).each(function(){
        result.target = $(this).val();
      });
      $('input:checked', me.$forms).each(function(){
        result.learning = $(this).val();
      });
      $('input:checked', me.$goal).each(function(){
        result.teaching = $(this).val();
      });
      $('input:checked', me.$skill).each(function(){
        result.content = $(this).val();
      });

      var success = true;

      _.each(me.required, function(i){
        if(!$.trim(result[i])){

          if(i == 'title' || i == 'description'){
            me.$form.find('[name='+i+']').val('');
          }
          success = false;
          return false;
        }
      });

      if(!success){
        this.showError(Common.lang.require_fields);
        
      }else if(result.title.length <3){
        this.showError(Common.lang.series_name_minlength);

      } else {
        
        me.values = result;
        this.hideError();

        return true;
      }
      return false;
    },

    getValues: function(){
      return this.values;
    },

    showError: function(msg){
      this.$error.find('p').text(msg);
      this.$error.slideDown();
    },

    hideError: function(){
      this.$error.hide().find('p').empty();
    },

    addTypes: function(el, field, data) {

      var me = this;

      el.empty();

      var html = '';

      _.each(data, function(i){
        html += me.radioTpl({
          id: i.id,
          name: i.name,
          field: field
        });
      }, this);

      el.append(html);

      if(Common.pageType == 'edit' && Common.info[field]){
        var val = Common.info[field];
        el.find('input').each(function(){
          var value = $(this).val();
          if(value == val){
            $(this).prop('checked', true);
          }
        });
      }
    }

  };

  return BasicView;
});