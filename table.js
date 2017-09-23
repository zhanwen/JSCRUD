(function($) {
	/**
	 *    查询方法
	 *    修改方法
	 *    删除方法
	 */
	$.fn.gridPanel = {
			
		initEvent: function(){
			$("#" + $.fn.gridPanel.defaultConfig.table_id).delegate("a","click",function() {
				if($(this).text() == "删除") {
					$.fn.gridPanel.method.deleteRow.call(this);
				}else if($(this).text() == "修改"){
					
				}
			});
			
			$("#" + $.fn.gridPanel.defaultConfig.table_id).delegate("td:not(:has(a))","click",function() {
				
				if($(this).children("input").length == 0) {
					var value = $(this).text();
					$(this).empty();
					var $txt = $("<input type='text'/>");
					$(this).append($txt);
					$txt.focus();
					$txt.attr("value",value);
				}
			});
			
			$("#" + $.fn.gridPanel.defaultConfig.table_id).delegate("input","blur",function() {
				$.fn.gridPanel.method.updateCell.call(this);
			});
			
			$("#" + $.fn.gridPanel.defaultConfig.table_id + "tbody button").delegate("button","click",function() {
				$.fn.gridPanel.method.addRow();
			});
		},	
		
		defaultConfig : {
			table_id: '',
			url:  '',
			fields: '',
			option: {
				query:{
					
				},
				del:{
					
				},
				update: {
					
				},
				add: {
					
				}
			},
			fieldUpdate: '',
			fieldDelete: ''
		},
		
		method: {
			/*从后台加载数据，利用ajax技术形成表格*/
			createTable: function(config){
				$.extend(true, $.fn.gridPanel.defaultConfig, config),
				$.fn.gridPanel.initEvent();
				$.post($.fn.gridPanel.defaultConfig.url, $.fn.gridPanel.defaultConfig.option.query, function(data) {
					/**
					 * data:
					 * [
					 * 	{
					 * 		pid:1,
					 * 		name:'aa',
					 * 		description:'aa'
					 *  },
					 *  {
					 *  	pid:2,
					 *  	name:'bb',
					 *  	description:'bb'
					 *  }
					 * ]
					 */
					//把后台回调过来的数据，转换成json数据
					var array = eval("("+data+")");
					if(array.length > 1) {
						$.each(array, function() {
							//遍历array数据中的每一个元素
							$("#"+$.fn.gridPanel.defaultConfig.table_id + " tbody").append($.fn.gridPanel.method.createTR.call(this));
						});
					}
				});
			},
			addRow: function() {
			    var name = $.fn.gridPanel.defaultConfig.option.add.name;
				var description = $.fn.gridPanel.defaultConfig.option.add.description;
				var id = $.fn.gridPanel.defaultConfig.option.add.index;
				$.post($.fn.gridPanel.defaultConfig.url, $.fn.gridPanel.defaultConfig.option.add,function(data){
					var $tr = $.fn.gridPanel.method.createTR.call(this);
					$("#"+$.fn.gridPanel.defaultConfig.table_id+" tbody").append($tr);
				});
				
			},
			updateCell: function() {
				//值
				var value = $(this).val();
				//父节点
				var $td = $(this).parent();
				var item = $td.attr("item");
				var pid = $(this).parent().parent().data("id");
				$(this).remove();
				$.post($.fn.gridPanel.defaultConfig.url,
				{
					id:pid,
					item:item,
					value:value,
					method:'update'
				}, function(date) {
					$td.text(value);
				});
			},
			
			deleteRow: function() {
				var obj = $(this);
				if(window.confirm("您确认要删除吗?")) {
					$.fn.gridPanel.defaultConfig.option.del.pid =$(this).parent().parent().data("id");
					$.post($.fn.gridPanel.defaultConfig.url, $.fn.gridPanel.defaultConfig.option.del,function(data){
						obj.parent().parent().remove();
					});
				}
			},
			
			createTR:function() {
				var jsonObj = this;
				var $tr = $("<tr/>");
				$tr.data("id", jsonObj.pid);
				$.each($.fn.gridPanel.defaultConfig.fields, function() {
					$tr.append($.fn.gridPanel.method.createTD.call(this, jsonObj));
				});
				return $tr;
			},
			
			createTD:function(jsonObj) {
				/**
				 *  	pid:2,
				 *  	name:'bb',
				 *  	description:'bb'
				 *  
				 */
				if($(this).attr("field") == $.fn.gridPanel.defaultConfig.fieldUpdate) {
					return $("<td/>").append($.fn.gridPanel.method.createA("修改"));
				}else if($(this).attr("field") == $.fn.gridPanel.defaultConfig.fieldDelete){
					return $("<td/>").append($.fn.gridPanel.method.createA("删除"));
				}else {
					return $("<td/>").attr("item",$(this).attr("field")).text(jsonObj[$(this).attr("field")]);
				}
			},
			
			createA: function(text) {
				return $("<a/>").css("cursor","pointer").text(text);
			}
			
			
		},
		
		
			
	};
	
	
})($);