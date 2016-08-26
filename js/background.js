//检测字符串是否以指定字符串开始
function startsWith(sourceStr, targetStr){
	var reg=new RegExp("^"+targetStr);
	return reg.test(sourceStr); 
}

//要插入的内容块
var div = document.createElement("div");
div.style.position="relative";
div.style.width="400px";
div.style.float="right";
div.style.padding="10px";
div.style.fontSize="14px";

var isbn=null;
var containerElement=null; //显示书评内容的父元素
var currentUrl=window.location.href;
//匹配京东的页面
if(startsWith(currentUrl, "http://item.jd.com/")||startsWith(currentUrl, "https://item.jd.com/")){
	var elements=document.getElementById("parameter2").getElementsByTagName("li");
	for(var i=0;i<elements.length;i++){
		var items=elements[i].innerHTML.split("：");
		var itemHead=items[0];
		if(itemHead=="ISBN"){
			isbn=items[1];
		}
	}
	containerElement=document.getElementById("nav-2014");
}

//匹配当当的页面
if(startsWith(currentUrl, "http://product.dangdang.com/")||startsWith(currentUrl, "https://product.dangdang.com/")){
	var elements=document.getElementById("detail_describe").getElementsByTagName("li");
	for(var i=0;i<elements.length;i++){
		var items=elements[i].innerHTML.split("：");
		var itemHead=items[0];
		if(itemHead=="国际标准书号ISBN"){
			isbn=items[1];
		}
	}
	containerElement=document.getElementById("hd");
}

//匹配亚马逊的页面
if(startsWith(currentUrl, "http://www.amazon.cn/")||startsWith(currentUrl, "https://www.amazon.cn/")){
	var elements=document.getElementById("detail_bullets_id").getElementsByTagName("li");	 //嵌套层次比较深，可以直接拿最底层的子元素
	for(var i=0;i<elements.length;i++){
		var items=elements[i].innerHTML.split(" ");
		var itemHead=items[0];
		if(itemHead=="<b>ISBN:</b>"){
			isbn=elements[i].innerHTML.split(" ")[items.length-1];
		}
	}
	containerElement=document.getElementById("navbar");
}

var xmlHttp = new XMLHttpRequest();
//此处涉及到跨域访问的安全问题，所以一定要在manifest的permissions中添加权限
xmlHttp.open("GET", "https://api.douban.com/v2/book/isbn/:"+isbn, false);
xmlHttp.send(null);
var jsonResponse=JSON.parse(xmlHttp.responseText);	//将字符串转换成json格式
var numRaters=jsonResponse.rating.numRaters;	//参与评分的人数
var average=jsonResponse.rating.average;	//平均评分
var url=jsonResponse.alt;	//豆瓣链接
div.innerHTML="豆瓣评分："+average+"&nbsp;&nbsp;参与人数："+numRaters+"&nbsp;&nbsp;<a href=\""+url+"\">跳转到豆瓣书评</a>";

containerElement.appendChild(div);

