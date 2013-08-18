// JavaScript Document
//2013-4-9
//Email:zhou060806@163.com

function firstChild(oParent){							//第一个子元素;
	return oParent.firstElementChild || oParent.firstChild;
}
function lastChild(){									//最后一个子元素;
	return oParent.lastElementChild || oParent.lastChild;	
}
function prevNode(obj){									//上一个兄弟节点;
	return obj.previousElementSibiling || previousSibling;
}
function nextNode(obj){									//下一个兄弟节点;
	return obj.nextElementSibling || nextElementSibling;
}
function hasChild(obj){									//有无子节点
	var ele = obj.getElementsByTagName('*');
	if(ele.length){
		return false;
	}
	return true;
}
function viewH(){										//可视区高度;
	return document.documentElement.clientHeight;	
}
function viewW(){										//可视区宽度;
	return document.documentElement.clientWidth;	
}
function scrollY(){										//滚过的高度;
	return document.body.scrollTop || document.documentElement.scrollTop;
}
function scrollX(){										//滚过的宽度;
	return document.body.scrollLeft || document.documentElement.scrollLeft;	
}
function scrollH(){										//页面内容高度;
	return document.body.scrollHeight;	
}
function scrollW(){										//页面宽内容度;
	return document.body.scrollWidth;	
}
function $(str,oParent){//getElement
	var id = /^#[\w\d]+/;
	var tag = /^<\w{1,}>$/;		
	if(id.test(str)){
		return (oParent||document).getElementById(str.substring(1));	
	}
	if(tag.test(str)){
		return (oParent||document).getElementsByTagName(str.substring(1,(str.length-1)));	
	}	
}
function browInfo(){
	var info = navigator.userAgent;
	if(info.indexOf('MSIE 8') != -1){
		return 'IE8';	
	}
	if(info.indexOf('MSIE 7') != -1){
		return 'IE7';	
	}
	if(info.indexOf('MSIE 6') != -1){
		return 'IE6';	
	}else{
		return 'nace';	
	}
}
function getByClass(oParent,sClass){					//通过class获取元素;
	var iResult = [];
	var aEle = oParent.getElementsByTagName('*');
	for(var i=0;i<aEle.length;i++){
		var aClass = aEle[i].className.split(' ');
		for(var j = 0;j<aClass.length;j++){
			if(aClass[j] == sClass){
				iResult.push(aEle[i]);
			}
		}
	}
	return iResult;
};
function addClass(obj,sClass){							//添加className;
	var aClass = obj.className.split(' ');
	for(var i=0;i<aClass.length;i++){
		if(aClass[i] == sClass){
			return;	
		}
	}
	if(!obj.className){
		obj.className = sClass;
		return;	
	}
	obj.className +=' ' + sClass;		
}
function removeClass(obj,sClass){						//删除className;
	if(obj.className){
 		var aClass = obj.className.split(' ');
		for(var i=0;i<aClass.length;i++){
			if(aClass[i] == sClass ){
				aClass.splice(i,1);
				obj.className = aClass.join(' ');
				return;	
			}
		}
	}
}
function addEvent(obj,sEv,fn){							//绑定事件;
	if(obj.attachEvent){
		obj.attachEvent('on'+sEv,function (){
			fn.call(obj);
		});
		return;
	}
	obj.addEventListener(sEv,fn,false);
}
function delEvent(obj,sEv,fn){									//移除事件;
	if(obj.detachEvent){
		obj.detachEvent('on'+sEv,fn);
		return;
	}
	obj.removeEventListener(sEv,fn,false);
}
function getAttribute(obj,attr){						//获取属性;
if(attr == 'class'|| attr == 'className'){
	return obj.getAttribute('class')||obj.getAttribute('className');
}
	return obj.getAttribute(attr);
}
function setStyle(obj,jAttr){							//设置样式;
	for(var attr in jAttr){
		if(attr == 'opacity'){
			obj.style[attr] = jAttr[attr];
			obj.style.filter = 'alpha(opacity:'+jAttr[attr]*100+')';
			return;
		}
		if(attr == 'z-index'){
			obj.style.zIndex = 	jAttr[attr];
			return;
		}
		obj.style[attr] = jAttr[attr];	
	}
}

function getStyle(obj,attr){							//获取样式;
	if(obj.currentStyle){
		return obj.currentStyle[attr];	
	}
	return getComputedStyle(obj,false)[attr];
}


function isCollision (obj1,obj2){							//碰撞检测
	var L1= obj1.offsetLeft,
		R1= obj1.offsetLeft + obj1.offsetWidth,
		T1= obj1.offsetLeft,
		B1= obj1.offsetLeft + obj1.offsetHeight,
		
		L2= obj2.offsetLeft,
		R2= obj2.offsetLeft + obj2.offsetWidth,
		T2= obj2.offsetLeft,
		B2= obj2.offsetLeft + obj2.offsetHeight;
		
	if(R1<L2||L1>R2||T1>B2||B1<T2){
		return false;	
	}
	else{
		return true;
	}
}
function distance (obj1,obj2){							//距离
	var a = obj1.offsetLeft - obj2.offsetLeft;
	var b = obj1.offsetTop - obj2.offsetTop;
	return Math.sqrt(a*a+b*b);
}
function drag(obj){
	obj.onmousedown = function (ev){
		var ev = ev||event;	
		var X = ev.clientX - obj.offsetLeft;
		var Y = ev.clientY - obj.offsetTop;
		if(ev.setCapture){
			ev.setCapture();
		}
		document.onmousemove = function (ev){
			var ev = ev||event;
			var iL = ev.clientX - X;
			var iT = ev.clientY - Y;

			iL = iL<0 ? 0 : iL>viewW()-obj.offsetWidth ? viewW()-obj.offsetWidth:iL;
			iT = iT<0 ? 0 : iT>viewH()-obj.offsetHeight ? viewH()-obj.offsetHeight:iT;

			obj.style.top = iT +'px';
			obj.style.left = iL +'px';
		};
		document.onmouseup = function (){
			document.onmousemove = document.onmouseup =  null;
			if(ev.releaseCapture){
				ev.releaseCapture();
			}
		}
		
		return false;
	};
}
function fnMove(obj,json,fn){					//页面运动效果
	clearInterval(obj.timer);
	obj.timer = setInterval(function(){	
		var flag=true;
		for(var attr in json){	
			var iCur = getStyle(obj,attr);
			if( attr == 'opacity'){
				iCur = Math.round(iCur*100);
			}else{
				 iCur = parseInt(iCur);
			}
			var iSpeed = (Number(json[attr])-iCur)/8;
			iSpeed = iSpeed >0 ? Math.ceil(iSpeed):Math.floor(iSpeed);
			
			if(iCur != Number(json[attr])){
				flag=false;
			}
			if( attr == 'opacity'){
				obj.style.filter = 'alpha(opacity:'+(iCur +iSpeed)+')';
				obj.style.opacity = (iCur +iSpeed)/100;
			}else{
				obj.style[attr] = (iCur+iSpeed)+'px';
			}
		}
		if(flag){
				clearInterval(obj.timer);
				obj.timer = null;
			if(fn){
				fn();
			}
		}
	},30)
}
