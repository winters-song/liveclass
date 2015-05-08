define([
  'views/utils/wizard',
  'text!templates/createSeries/navigation.html',
], 
function(Wizard, tpl){

  'use strict';

  var NavigationView = function(cfg){
    $.extend(this, cfg);

    this.tpl = _.template(tpl);

    this.collection = [{
      name: 'basics',
      state: 'active',
      index: 1
    },{
      name: 'cover',
      state: 'disabled',
      index: 2
    },{
      name: 'classes',
      state: 'disabled',
      index: 3
    }];
    
    Wizard.apply(this, arguments);
  };

  NavigationView.prototype.__proto__ = Wizard.prototype;  

  return NavigationView;
});