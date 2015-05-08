/**
 * PagingBar

 	dependency: jquery, jquery.namespace, jquery.nano
 * 
 * @config
 * 
 * total
 * currentPage
 * prevText
 * nextText
 * 
 * Example:
 * var paging = new sy.ui.PagingBar({
		total: total,
		currentPage: currentPage,
		$el: $('')
	});

	var paging = new sy.ui.PagingBar({		
		total: total,
		currentPage: currentPage,
		renderTo: 'paging',
		type: 'small',
		onClick: function(){
	
		}
	});
 */
(function(){

	var sy = window.sy = window.sy || {};
	sy.ui = sy.ui || {};
	
	sy.ui.PagingBar = function(obj){
		var me = this;
		$.extend(me, me.defaults, obj);

		me.counter = me.type=='small'? me.small: me.big; 

		me.render();

		me.initEvents();
		
	}
	
	sy.ui.PagingBar.prototype = {

		big: [7,6,5,2],

		small: [5,4,3,1],
			
		defaults:{
			prevText: '上一页',
			nextText: '下一页',
			currentPage: 1
		},

		repaint: function(current, total){
			var me = this;

			me.$el.empty();
			me.currentPage = current;
			me.total = total;

			me.render();
			me.initEvents();

		},

		initEvents: function(){
			var me = this;
			if(me.onClick){
				var val;
				me.$el.find('a').on('click', function(e){
					e.preventDefault();

					val = $(this).data('page')*1;
					me.onClick(val);
					
				});
			}
		},
		
		render: function(){
			var me = this,
				start = '<ul class="sy-paging">',
				end = '</ul>',
				arr = [start],
				tmp;
			
			if(me.currentPage>1){
				// tmp = me.getLi(me.prevText, me.currentPage-1);
				tmp = me.getLi('<span class="glyphicon glyphicon-chevron-left"></span>', me.currentPage-1);
				arr.push(tmp);
			}
			
			if( me.total<=me.counter[0] ){
				for(var i = 1; i <= me.total; i++){
					if(i == me.currentPage){
						tmp = me.getLi(i, i, true);
					}else{
						tmp = me.getLi(i, i);
					}
					arr.push(tmp);
				}
			}else if(me.currentPage < me.counter[2]){
				
				for(var i = 1; i <= me.counter[1]; i++){
					if(i == me.currentPage){
						tmp = me.getLi(i, i, true);
					}else{
						tmp = me.getLi(i, i);
					}
					arr.push(tmp);
				}
				
				tmp = me.getLi();
				arr.push(tmp);
				
				tmp = me.getLi(me.total, me.total);
				arr.push(tmp);
				
			}else if(me.currentPage > me.total - me.counter[2]){
				
				tmp = me.getLi(1, 1);
				arr.push(tmp);
				
				tmp = me.getLi();
				arr.push(tmp);
				
				for(var i = me.total - me.counter[2]; i <= me.total; i++){
					if(i == me.currentPage){
						tmp = me.getLi(i, i, true);
					}else{
						tmp = me.getLi(i, i);
					}
					arr.push(tmp);
				}
			}else{
				
				tmp = me.getLi(1, 1);
				arr.push(tmp);
				
				tmp = me.getLi();
				arr.push(tmp);
				
				for(var i = me.currentPage - me.counter[3]; i <= me.currentPage + me.counter[3]; i++){
					if(i == me.currentPage){
						tmp = me.getLi(i, i, true);
					}else{
						tmp = me.getLi(i, i);
					}
					arr.push(tmp);
				}
				
				tmp = me.getLi();
				arr.push(tmp);
				
				tmp = me.getLi(me.total, me.total);
				arr.push(tmp);
			}
			
			if(me.currentPage < me.total){
				// tmp = me.getLi(me.nextText, me.currentPage+1);
				tmp = me.getLi('<span class="glyphicon glyphicon-chevron-right"></span>', me.currentPage+1);
				
				arr.push(tmp);
			}
			
			arr.push(end);
			
			var html = arr.join('');
			
			$(html).appendTo(me.$el);
			
		},
		
		getLi: function(text, page, active){
			var me = this,
				result;

			var cls = me.type=='small'? 'btn-sm' : '';

			if(page){
				if(!active){
					result = _.template('<li><a href="#" class="btn btn-primary <%=cls %>" data-page="<%=page %>"><%=text %></a></li>',{
						text: text,
						page: page,
						cls: cls
					});
				}else{
					result = _.template('<li><a href="#" class="btn btn-default <%=cls %> active" data-page="<%=page %>"><%=text %></a></li>',{
						text: text,
						page: page,
						cls: cls
					});
				}
			}else{
				result = "<li>...</li>";
			}
			return result;
		}
	}
				
})();