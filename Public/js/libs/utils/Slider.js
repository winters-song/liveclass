/**
 * Written by Songyang
 * email: songyang@outlook.com
 * qq: 77941075
 */

(function(){

	var sy = window.sy = window.sy || {};
	sy.ui = sy.ui || {};

	sy.ui.Slider = function(obj){
		var me = this;
		$.extend(me, me.defaults, obj);
		
		me.init();

		me.initEvents();
		
	};

	sy.ui.Slider.prototype = {
			
		defaults:{
			autoScroll: true,
			duration: 5, 
			circular: true,
			visible:1,
			forceSlide: false
		},

		lock: false,
		start:0,
		current: 1,
		total: 0,
		width:0,
		slidable: true,
		resizable: true,
		pagerWidth: 20,

		init: function(){
			var me = this;

			me.$el = $('#'+ me.id);
			me.$wrapEl = $('.item-list', me.$el);
			var $ul = $('ul', me.$wrapEl);
			var $li = $('li', me.$wrapEl);
			me.total = $li.size();

			me.width = me.$el.width();
			me.item_width = $li.width();

			me.visible = Math.floor((me.width - 2* me.pagerWidth) / me.item_width);

			if(!me.$prev){
				me.$prev = $('<a href="#" class="pager prev-btn"></a>').appendTo(me.$el);
			}

			if(!me.$next){
				me.$next = $('<a href="#" class="pager next-btn"></a>').appendTo(me.$el);
			}	
			
			if(me.circular) {

				if(me.total <= me.visible && !me.forceSlide){
					me.slidable = false;

					me.$prev.hide();
					me.$next.hide();

				}else{
					$ul.prepend($li.clone());
	        $ul.append($li.clone());
					
	        me.start += me.total;
				}
      }

			$ul.width(me.item_width * me.total * 3);
			me.$wrapEl.width(me.item_width * me.visible);
			me.$wrapEl.scrollLeft(me.start * me.item_width);

			// IE dom hidden 
			// me.$wrapEl.css('visibility','hidden');
			// setTimeout(function(){
			// 	me.$wrapEl.css('visibility','visible');
			// },0);
				
		},

		doAnim: function(){
			var me = this;

			if(me.timer){
				clearTimeout(me.timer);
			}
			
			me.slide();

			if(me.autoScroll){
      	me.setTimer();
      }
		},

		slide: function(){
			var me = this;

			if(!me.slidable){
				return;
			}
			me.lock = true;

			var left = me.item_width * (me.current - 1 + me.start);
			if(me.circular){

				if(me.current>me.total){
					me.current -= me.total;
				}else if(me.current<1){
					me.current += me.total;
				}
			}

      me.$wrapEl.stop(false,false).animate({
        scrollLeft: left
      },800, function(){
      	me.lock = false;
      	if(me.circular){
      		var left = me.item_width * (me.current - 1 + me.start);
					me.$wrapEl.scrollLeft(left);
				}
      });

		},

		initEvents: function(){
			var me = this;

			me.$prev.on('click', function(e){
	      e.preventDefault();
	      if(me.lock){
	      	return;
	      }
	      if(me.current > 1 || me.circular){
	      	me.current -= me.visible;
	      } else{
					me.current = me.total;
	      }
	      me.doAnim();
	    });

			me.$next.on('click', function(e){
	      e.preventDefault();
	      if(me.lock){
	      	return;
	      }
	      
	      if(me.current < me.total || me.circular){
	        me.current += me.visible;
	      }else{
					me.current = 1;
      	}

	      me.doAnim();
	    });



	    if(me.autoScroll){

	    	me.$el.on('mouseenter', function(e){
	    		clearTimeout(me.timer);
	    	});
	    	me.$el.on('mouseleave', function(e){
	    		me.setTimer();
	    	});

	    	me.setTimer();
	    }

	    if(me.resizable){
	    	$(window).on('resize', function(){
	    		me.width = me.$el.width();
					me.visible = Math.floor((me.width - 2* me.pagerWidth) / me.item_width);
					me.$wrapEl.width(me.item_width * me.visible);
	    	});
	    }

		},

		setTimer: function(){
			var me = this;

			me.timer = setTimeout(function(){
				me.current += me.visible;
        me.doAnim();
    	}, me.duration*1000);
		}
	}	

})(jQuery);