$().ready(function(){
	var index = 1;
	/**
	 * 1、创建命名空间
	 */
	$.nameSapce("com.hw.Person");
	/**
	 * 2、把gridPanel中的内容复制给了com.hw.Person
	 */
	$.extend(com.hw.Person,$.fn.gridPanel);
	/**
	 * 3、调用方法
	 */
	com.hw.Person.method.createTable({
		table_id:'usertable',
		url:'../PersonServlet',
		fields: $("#usertable *[field]"),
		option: {
			query:{
				method: 'query'
			},
			del:{
				method: 'deleteById',
				pid:""
			},
			update: {
				method:'update'
			},
			add: {
				method: 'add',
				name: $("#name").val(),
				description:$("#description").val(),
				index: index++
			}
		},
		fieldUpdate: 'update',
		fieldDelete: 'del'
	});
});
