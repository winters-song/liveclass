var sy = {};

$.extend(sy, {
	DEBUG: 'debug',
	PRODUCTION: 'production',
	mode: 'production',
	
	emptyFn: function () {},
	
	//console
	error: function(msg){
		if(sy.DEBUG == sy.mode){
			try{
				console.error(msg);
			}catch(e){}
		}
	},
	warn: function(msg){
		if(sy.DEBUG == sy.mode){
			try{
				console.warn(msg);
			}catch(e){}
		}
	},
	info: function(msg){
		if(sy.DEBUG == sy.mode){
			try{
				console.info(msg);
			}catch(e){}
		}
	},
	log: function(msg){
		if(sy.DEBUG == sy.mode){
			try{
				console.log(msg);
			}catch(e){}
		}
	},
	
	isEmpty: function(value, allowEmptyString) {
        return (value === null) || (value === undefined) || (!allowEmptyString ? value === '' : false) || ($.isArray(value) && value.length === 0);
    },
	
	format: function(format, data, scope) {
		var str = format;
		
		if(scope){
			str = str.replace(/{this\.(\w*)}/g, function(m, i) {
				return sy.isEmpty(scope[i])? '' : scope[i];
			});
		}
		
		str = str.replace(/{(\w*)}/g, function(m, i) {
			return sy.isEmpty(data[i])? '' : data[i];
		});
		return str;
	},
	
	ns: function() {
        var root = window,
            parts, part, i, j, ln, subLn;

        for (i = 0, ln = arguments.length; i < ln; i++) {
            parts = arguments[i].split(".");

            for (j = 0, subLn = parts.length; j < subLn; j++) {
                part = parts[j];

                if (typeof part != 'string') {
                    root = part;
                } else {
                    if (!root[part]) {
                        root[part] = {};
                    }

                    root = root[part];
                }
            }
        }
        return root;
    },
	
	getJson: function(response){
		var text = response.responseText;
			data = null;
        if(text){
        	data = Ext.decode(text);
        }
        return data;
	},
	
	compare: function(v1, v2){
		if(v1 > v2){
			return 1;
		}else if(v1 == v2){
			return 0;
		}else{
			return -1;
		}
	},
	
	get: function(el){
		if(typeof el == 'string'){
			return $("#" + el);
		}else{
			return el;
		}
	},
	
	copy: function(obj){
		return  Ext.decode(Ext.encode(obj));
	},
	
	findBy: function(arr, attrName, val){
		for(var i in arr){
			if(arr[i][attrName] == val){
				return i;
			}
		}
		return -1;
	},
	
	mask : function(msg) {
		var me = this;
		var title = msg || '加载中';
		if (me.maskEl) {
			$(me.maskEl).find('.loading-msg').text(title);
			$(me.maskEl).show();
			
		}else{
			var html = [
			     '<div class="sy-loading">',
			     	'<span class="sy-wait icon"></span>',
			     	'<span class="loading-msg">' + title+'</span>',
			     '</div>'
			].join('');
			
			me.maskEl = $(html).appendTo($('body'));
		}
		
		var el = me.maskEl,
			width = el.width(),
			height = el.height(),
			screenWidth = $(window).width(),
			screenHeight = $(window).height(),
			scrollTop = $(window).scrollTop();

		$(el).css({
			left : (screenWidth - width) /2 + 'px',
			top : (screenHeight - height) /2 + scrollTop + 'px'
		});
	},

	/**
	 * 隐藏loading
	 */
	unmask : function() {
		if (this.maskEl) {
			this.maskEl.hide();
		}
	}
});
