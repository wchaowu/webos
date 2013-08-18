// JavaScript 
//2012-7-15
//Email: wchaowu@163.com

/*---------------------------------------------index.js--------------------------------------*/
function desk(){
	this.oWrap = $('#wrap');
	this.oDesk = $('#desk');
	this.oTask = $('#task');
	this.oLeft = $('#leftBar');
	this.oBg = $('#bgWindow');	
	this.oDeskContent = $('#deskContent');
	
	this.aDeskCount = 5;    			//桌面个数
	this.iconMarRgt = 50;
	this.iconMarTop = 20;
	this.deskPdgTop = 50;  				//图标桌面上变局
	this.deskPdgLeft = 100; 			//图标桌面左边距
	this.minDis = 50;    				//碰撞时交换图标的最小距离
	this.className = zh_className;
	this.addIconCon = zh_addIcon;
	this.aDeskIconContent = zh_deskIcon;
	this.iconMenuContent = zh_iconMenu;	//右键菜单
	this.deskMenuContent = zh_deskMenu;
	this.argMent = 'row';				//图标排列方式'row'：横向，'col'：纵向，其他值：自由排列
	this.aDesk = [];
	this.iNowDesk = 3;					//默认显示桌面1
	this.aCheckDesk = [];				//顶部桌面导航
	this.aDeskIcon =[[],[],[],[],[]];	//每个桌面的图标
	this.iconMenu = [];	
	this.deskMenu = '';
	this.addIcon = [];
	this.deskMenuMain = [];
	this.deskMenuList1 = [];
	this.deskMenuList2 = [];	
	this.iconMenuMain = [[],[],[],[],[]];
	this.iconMenuList = [[],[],[],[],[]];
}
desk.prototype = {
	init:function (){
		var _this = this;												//初始化
		
		this.createDesk();
		this.createNav();
		this.createLeftApp();
		this.createApp();
		this.setSize();
		this.arrangeIcon(this.argMent);
		this.events();	
	
	},
	createDesk:function (){												//创建桌面
		var oFrag = document.createDocumentFragment();
			
			for(var i=0;i<this.aDeskCount;i++){
				var desk = document.createElement('div');
				
				desk.id = 'desk'+(i+1);
				desk.className = this.className.iconDesk;
				desk.index = i;
				
				if(i<this.iNowDesk-1){
					desk.style.left = -viewW()+'px';	
				}
				if(i == this.iNowDesk-1){
					desk.style.left = 0+'px';
				}
				if(i>this.iNowDesk-1){
					desk.style.left = viewW()+'px';	
				}
			
			
			this.aDesk.push(desk);
			oFrag.appendChild(desk);
		}
		
		this.oDeskContent.appendChild(oFrag);
	},
	createNav:function (){												//生成顶部导航条
		this.oTop = document.createElement('div');
		this.oImg = document.createElement('div');
		this.oIndex = document.createElement('div');
		this.appView = document.createElement('div');
		this.oSearch = document.createElement('div');
		for(var i=0;i<this.aDeskCount;i++){
			var a = document.createElement('a');
				a.innerHTML = i+1;
				this.oIndex.appendChild(a);
				this.aCheckDesk.push(a);
		}
		this.oTop.className = this.className.top;
		this.oImg.className = this.className.topImg;
		this.oIndex.className = this.className.deskIndex;
		this.oSearch.className = this.className.tosearch;
		this.appView.className = this.className.appView;
		
		this.oTop.appendChild(this.oImg);
		this.oTop.appendChild(this.oIndex);
		this.oTop.appendChild(this.appView);
		this.oTop.appendChild(this.oSearch);
		this.oDesk.appendChild(this.oTop);	
		
		this.oTop.style.zIndex = zh_winzIndex;
	},
	createApp:function(){												//生成桌面图标
		for(var i=0;i<this.aDeskIconContent.length;i++){						
			for(var j=0;j<this.aDeskIconContent[i].length;j++){
				var newIcon = new createIcon(this.oDesk,this.aDesk[i],this.oTask,this.aDeskIconContent[i][j]);
				newIcon.init();		
				newIcon.icon.index = j;
				this.aDeskIcon[i].push(newIcon.icon);
			}
			this.aDeskIcon[i].index = i;
		}
	},
	createLeftApp:function (){											//生成左侧图标
		for(var i = 0;i<zh_leftIcon.length;i++){
			new createIcon(this.oDesk,this.oLeft,this.oTask,zh_leftIcon[i]).init();
		}	
	},
	events:function (){													//事件
		var _this = this;
		var i=0;
		
		window.onresize = function (){
			_this.setSize();
			_this.arrangeIcon(_this.argMent);		
		};
		document.onmousewheel = wheel;
		
		if (document.addEventListener) {
			document.addEventListener('DOMMouseScroll', wheel, false);
		}	
		function wheel(ev){
			var ev = ev||event;

			var iNow = _this.iNowDesk;
			var flag = false;
			if(ev.wheelDelta){
				flag = ev.wheelDelta>0 ? true : false;	
			}
			if(ev.detial){
				flag = ev.detail<0 ? true : false;
			}
			if(flag){
				iNow++;
				if(iNow > 5){
					iNow = 1;	
				}
				_this.iNowDesk = iNow;
				_this.checkDesk(iNow-1);
			}else{
				iNow--;
				if(iNow < 1){
					iNow = 5;	
				}
				_this.iNowDesk = iNow;
				_this.checkDesk(iNow-1);
			}
			if(ev.preventDefault){
				ev.preventDefault();	
			}
			return false;
		};
		document.oncontextmenu = function (ev){
			var ev = ev||event;
			var X = ev.clientX;
			var Y = ev.clientY;
			_this.deskContextmenu();
			
			if(_this.iconMenu[_this.iNowDesk-1]){
				_this.iconMenu[_this.iNowDesk-1].style.display = 'none';	
			}
			if( X >= viewW()-_this.deskMenu.offsetWidth){
				X = viewW()-_this.deskMenu.offsetWidth;
				_this.deskMenuMain[0].className = _this.className.deskMenuLeft;
				_this.deskMenuMain[1].className = _this.className.deskMenuLeft;
			}
			else{
				if(X >= viewW()-_this.deskMenu.offsetWidth-80){
					_this.deskMenuMain[0].className = _this.className.deskMenuLeft;
					_this.deskMenuMain[1].className = _this.className.deskMenuLeft;
				}
				else{
					_this.deskMenuMain[0].className = _this.className.deskMenuRight;
					_this.deskMenuMain[1].className = _this.className.deskMenuRight;
				}
					
			}
			if( Y >= viewH()-_this.deskMenu.offsetHeight){
				Y = viewH()-_this.deskMenu.offsetHeight;		
			}
			_this.deskMenu.style.left = X+'px';
			_this.deskMenu.style.top = Y+'px';
			return false;
		};	
		
		this.oLeft.oncontextmenu = function (ev){
			var ev = ev||event;
			ev.cancelBubble = true;
			return false;
		};
		addEvent(document,'click',function (){
			if(_this.deskMenu){
				_this.deskMenu.style.display = 'none';		
			}
			if(_this.addIcon[_this.iNowDesk-1]){
				_this.addIcon[_this.iNowDesk-1].style.display = 'none';		
			}	
		})
		
		/*--------------------------顶部导航条-----------------------------*/
		this.drag(this.oTop);
		
		this.oTop.oncontextmenu = function (ev){
			var ev = ev||event;
			ev.cancelBubble = true;
			return false;
		};
		this.checkDesk(this.iNowDesk-1);
		_this.aCheckDesk[this.iNowDesk-1].className = this.className.activeNum;
		
		for(i=0;i<this.aCheckDesk.length;i++){
			this.aCheckDesk[i].index = i;
			this.aCheckDesk[i].onmousedown = function (ev){
				var ev = ev||event;
				var This = this;
				var X = ev.clientX;
				var Y = ev.clientY;
				this.onmouseup = function (ev){
					var ev = ev||event;
					if(ev.clientX == X && ev.clientY == Y){
						_this.checkDesk(This.index);
					}
				};
				ev.cancelBubble = true;
				return false;
			}
		}
		
		/*--------------------------图标事件---------------------------------*/
		for(i=0;i<this.aDeskIcon.length;i++){
			for(var j=0;j<this.aDeskIcon[i].length;j++){
				
				this.addIconEvent(i,j);
			}
		}	
	},

	addIconEvent:function (deskIndex,objIndex){							//图标事件
		var _this = this;
		addEvent(this.aDeskIcon[deskIndex][objIndex],'mousedown',function (){
			_this.moveArrangeIcon(this,deskIndex);
		})
		if(this.aDeskIcon[deskIndex][objIndex].isOpen == 'no'){
			this.aDeskIcon[deskIndex][objIndex].onclick = function (ev){
				var ev = ev||event;
				_this.fnAddIcon();
				_this.addIcon[_this.iNowDesk-1].style.left = ev.clientX+'px';
				_this.addIcon[_this.iNowDesk-1].style.top = ev.clientY+'px';
				_this.addIcon[_this.iNowDesk-1].style.zIndex = zh_winzIndex;
				if(_this.iconMenu[_this.iNowDesk-1]){
					_this.iconMenu[_this.iNowDesk-1].style.display = 'none';
				}
				if(_this.deskMenu){
					_this.deskMenu.style.display = 'none';		
				}
				ev.cancelBubble = true;
				return false;
			}
		}
		this.aDeskIcon[deskIndex][objIndex].oncontextmenu=function (ev){
			var ev = ev||event;	
			var iL = 0;	
			if(this.isOpen == 'yes'){
				_this.iconContextmenu(this,deskIndex);
				
				var moreLi = _this.iconMenu[deskIndex].getElementsByTagName('li')[1];
				
				
				_this.iconMenu[deskIndex].style.left = ev.clientX+'px';
				_this.iconMenu[deskIndex].style.top = ev.clientY+'px';
				iL = viewW()-_this.iconMenu[deskIndex].offsetWidth;
				
				if(ev.clientX>=iL){
					_this.iconMenu[deskIndex].style.left = iL+'px';
					moreLi.className = _this.className.iconMenuLeft;
				}else{
					if(ev.clientX>=iL-130){
						moreLi.className = _this.className.iconMenuLeft;
					}else{
						moreLi.className = _this.className.iconMenuRight;
					}
					
				}
			}
			else{
				if(_this.iconMenu[deskIndex]){
					_this.iconMenu[deskIndex].style.display = 'none';
				}
				if(_this.deskMenu){
					_this.deskMenu.style.display = 'none';		
				}
			}
			if(_this.iconMenu[deskIndex]){
				_this.iconMenu[deskIndex].style.zIndex = zh_winzIndex;
			}
			if(_this.addIcon[_this.iNowDesk-1]){
				_this.addIcon[_this.iNowDesk-1].style.display = 'none';
			}
			ev.cancelBubble = true;
			return false;
		};
	},
	checkDesk:function (num){											//选择桌面
		for(var i=0;i<this.aDesk.length;i++){
			this.aCheckDesk[i].className = '';	
			if(i>num){
				fnMove(this.aDesk[i],{left:viewW(),opacity:0});	
			}
			if(i<num){
				fnMove(this.aDesk[i],{left:-viewW(),opacity:0});
			}
		}
		this.iNowDesk = num+1;
		fnMove(this.aDesk[num],{left:0,opacity:100})
		this.aCheckDesk[num].className = this.className.activeNum;
	},
	setSize:function (){												//设置桌面大小
		this.oWrap.style.height = viewH()+'px';
		this.oWrap.style.width = viewW()+'px';
		this.oDesk.style.height = viewH()+'px';
		this.oDesk.style.width = viewW()+'px';
		this.oTask.style.top = (viewH()-50)+'px';
		if(this.oTask.offsetTop<=200){
			this.oTask.style.top = 200+'px';
		}
		for(var i = 0 ; i < this.aDesk.length; i++){
			this.aDesk[i].style.height = (viewH()-140)+'px';
			this.aDesk[i].style.width = (viewW()-50)+'px';
			//this.aDesk[i].style.top = 50*i +'px'
		}
	},
	arrangeIcon:function (argMent){										//图标自动排列
		var oneWidth = (this.iconMarRgt+this.aDeskIcon[0][0].offsetWidth);
		var oneHeight = (this.iconMarTop+this.aDeskIcon[0][0].offsetHeight);
		for(var i=0;i<this.aDesk.length;i++){							
		
			if(argMent == 'row'){
				var row = parseInt((this.aDesk[i].offsetHeight)/oneHeight);
				var col = Math.ceil(this.aDeskIcon[i].length/row);
				for(var j=0;j<this.aDeskIcon[i].length;j++){
						
					fnMove(this.aDeskIcon[i][j],{
						'top':((j%row)*oneHeight+this.deskPdgTop),
						'left':(parseInt(j/row)*oneWidth+this.deskPdgLeft),	
						'opacity':100
					});			
				}	
			}
			else if(argMent == 'col'){
				var col = parseInt((this.aDesk[i].offsetWidth)/oneWidth);
				var row = Math.ceil(this.aDeskIcon[i].length/col);
				for(var j=0;j<this.aDeskIcon[i].length;j++){
					fnMove(this.aDeskIcon[i][j],{
						'top':(parseInt(j/col)*oneHeight+this.deskPdgTop),
						'left':((j%col)*oneWidth+this.deskPdgLeft),
						'opacity':100
					})				
				}	
			}
		}
	},
	moveArrangeIcon:function (obj,num){									//拖动交换位置
		var _this = this;
		var dis = 0;
		var isCol = false;
		
		obj.onmouseup = function (){
			for(var n=0;n<_this.aDeskIcon[num].length;n++){
				if(_this.aDeskIcon[num][n] != obj && _this.aDeskIcon[num][n].isOpen == 'yes'){
					isCol = isCollision(obj,_this.aDeskIcon[num][n]);
					dis = distance(obj,_this.aDeskIcon[num][n]);
										
					if(isCol && dis <= obj.offsetWidth/2){
						var index2 = _this.aDeskIcon[num][n].index;
						var length = _this.aDeskIcon[num].length;
						
						_this.aDeskIcon[num].splice(obj.index,1);

						_this.aDeskIcon[num].splice(index2,0,obj);

						for(var i=0;i<_this.aDeskIcon[num].length;i++){
							_this.aDeskIcon[num][i].index = i;
						}
						break;
					}
				}
			}
			_this.arrangeIcon(_this.argMent);
		}
		addEvent(document,'mouseup',function (){
			
			_this.arrangeIcon(_this.argMent);	
		})
	},
	contextMenu:function (parent,MenuContent,deskId,cur){				//创建右键菜单
		var oDiv = document.createElement('div');
		oDiv.className = this.className.menu;
		for(var i=0;i<MenuContent.length;i++){
			if(!oUl){
				var oUl = document.createElement('ul');
			}
			var li = document.createElement('li');
			
			li.innerHTML = MenuContent[i].innerHTML;
			li.id = deskId + MenuContent[i].id;
			if(MenuContent[i].id == 'showdesk'){
				li.innerHTML = '<span>'+MenuContent[i].innerHTML+'</span>';
			}
			if(MenuContent == this.deskMenuContent){
				this.deskMenuMain.push(li);	
			}
			if(MenuContent == this.iconMenuContent){
				
				this.iconMenuMain[cur].push(li);	
			}
			this.contextList(li,MenuContent[i],deskId,cur);
			oUl.appendChild(li);
		}
		oDiv.appendChild(oUl);
		parent.appendChild(oDiv);
		return oDiv;
	},
	contextList:function (parent,MenuContent,deskId,cur){				//生成子菜单
		var _this = this;
		for(var i=0;i<MenuContent.length;i++){
			if(!parent.ul){
				parent.ul = document.createElement('ul');
				parent.innerHTML = MenuContent[0].innerHTML;
				parent.id = deskId + MenuContent[0].id;
				i++;
			}
			if(MenuContent == this.iconMenuContent[1]){
				parent.className = this.className.iconMenuRight;	
			}
			
			var li = document.createElement('li');
			
			li.innerHTML = MenuContent[i].innerHTML;
			li.id = deskId + MenuContent[i].id;
			li.index = i-1;
			
			if(MenuContent == this.deskMenuContent[0] || MenuContent == this.deskMenuContent[1]){
				parent.className = this.className.deskMenuRight;
				if(MenuContent == this.deskMenuContent[0]){
					this.deskMenuList1.push(li);
				}
				if(MenuContent == this.deskMenuContent[1]){
					this.deskMenuList2.push(li);	
				}
			}
			if( MenuContent == this.iconMenuContent[1]){
				if( cur == i-1 ){
					li.className = this.className.iconMenuCur;
				}
				this.iconMenuList[cur].push(li);
			}
			this.contextList(li,MenuContent[i],deskId);		
			parent.ul.appendChild(li);
			parent.appendChild(parent.ul);
		}
	},
	iconContextmenu: function (obj,num){								//app右键菜单
		var _this = this;
		if(!_this.iconMenu[num]){
			_this.iconMenu[num] = _this.contextMenu(_this.aDesk[num],_this.iconMenuContent,_this.aDesk[num].id,num);
		}else{
			_this.iconMenu[num].style.display = 'block';	
		}
		if(_this.deskMenu){
			_this.deskMenu.style.display = 'none';	
		}
		//alert(_this.iconMenu[0]+';'+num)
		_this.iconMenuMain[num][0].onclick = function(ev){
			_this.openWindow(obj,num);
					
		}
		_this.iconMenuMain[num][2].onclick = function(){
			_this.delIcon(obj,num);			
		}
				
		for(var i=0;i<_this.iconMenuList[num].length;i++){
			if(_this.iconMenuList[num][i].className != _this.className.iconMenuCur){
				_this.iconMenuList[num][i].onclick = function (ev){
					_this.iconMenu[num].style.display = 'none';
					_this.moveIcon(obj,_this.aDeskIcon[num],_this.aDeskIcon[this.index],_this.aDesk[num],_this.aDesk[this.index]);
				};	
			}
		}
		_this.iconMenu[num].onclick = function (){
			var ev = ev||event;
			ev.cancelBubble = true;	
		};
		document.onclick = function (){
			_this.iconMenu[num].style.display = 'none';	
		};
	},
	fnAddIcon:function (){
		var _this = this;
		if(!this.addIcon[this.iNowDesk-1]){
			this.addIcon[this.iNowDesk-1] = this.contextMenu(this.aDesk[this.iNowDesk-1],this.addIconCon,this.aDesk[this.iNowDesk-1].id);
		}else{
			this.addIcon[this.iNowDesk-1].style.display = 'block';	
		}
		this.addIcon[this.iNowDesk-1].onclick = function (){
			this.style.display = 'none';	
		};
			
	},
	openWindow:function (obj,deskIndex){								//打开应用
		this.iconMenu[deskIndex].style.display = 'none';	
		var Window = $('#'+this.aDesk[deskIndex].id+'window'+obj.id);
		if(Window){
			Window.style.left = obj.offsetLeft+'px';
			Window.style.top = obj.offsetTop+'px';
			return;
		}
		new newWindow(this.oDesk,this.oTask,this.aDesk[deskIndex].id+'window'+obj.id,obj.json).init();		
	},
	moveIcon:function (obj,arr,toArr,curDesk,toDesk){					//移动到,交换数据
		var _this = this;
		var index1 = curDesk.index;
		var index2 = toDesk.index;
		for(var i=0;i<arr.length;i++){
			if(arr[i] == obj){
				arr.splice(i,1);
			}
		}
	
		//toArr.push(obj);
		toArr.splice(toArr.length-1,0,obj);
		for(var i=0;i<arr.length;i++){
			arr[i].index = i;	
			_this.addIconEvent(index1,i);
		}
		for(var i=0;i<toArr.length;i++){
			toArr[i].index = i;	
			_this.addIconEvent(index2,i);
		}
		toDesk.appendChild(obj);
		_this.arrangeIcon(_this.argMent);		
	},
	delIcon:function (obj,deskIndex){									//删除应用
		var _this = this;
		
		fnMove(obj,{opacity:0},function (){
			_this.aDesk[deskIndex].removeChild(obj);
			_this.arrangeIcon(_this.argMent);	
		})
		for(var i=0;i<this.aDeskIcon[deskIndex].length;i++){
			if(this.aDeskIcon[deskIndex][i] == obj){
				this.aDeskIcon[deskIndex].splice(i,1);	
			}
		}
		for(var i=0;i<this.aDeskIcon[deskIndex].length;i++){
			this.aDeskIcon[deskIndex][i].index = i;
		}
		this.iconMenu[deskIndex].style.display = 'none';			
	},
	deskContextmenu:function (){										//桌面右键菜单
		var _this = this;
		if(!this.deskMenu){
			this.deskMenu = this.contextMenu(this.oDesk,this.deskMenuContent,this.oDesk.id,1);
			this.deskMenuList1[1].className = this.className.typeChecked;
			this.deskMenuList2[0].className = this.className.typeChecked;	
		}else{
			this.deskMenu.style.display = 'block';	
		}
		if(_this.addIcon[_this.iNowDesk-1]){
			_this.addIcon[_this.iNowDesk-1].style.display = 'none';		
		}
		this.deskMenu.onclick = function (ev){
			var ev = ev||event;
			ev.cancelBubble = true;	
		};
		this.deskMenu.style.zIndex = zh_winzIndex;
		this.deskMenuList1[0].onclick = function (){
			_this.iconType(0,_this.className.minIcon,60);
		};
		this.deskMenuList1[1].onclick = function (){
			_this.iconType(1,_this.className.icon,100);
		};
		this.deskMenuList1[2].onclick = function (){
			_this.iconType(2,_this.className.icon,200);
		};
		
		this.deskMenuList2[0].onclick = function (){
			_this.argType(0,'row');
		};
		this.deskMenuList2[1].onclick = function (){
			_this.argType(1,'col');
		};
		this.deskMenuList2[2].onclick = function (){
			_this.argType(2,' ');
		};
		this.deskMenuMain[2].onclick = function (){
			_this.reLoad();	
		};
		this.deskMenuMain[3].onclick = function (){
			_this.showDesk();
		};
		this.deskMenuMain[4].onclick = function (){
			_this.setBg()
		};
		this.deskMenuMain[5].onclick = 
		this.deskMenuMain[6].onclick = function (){
			_this.deskMenu.style.display = 'none';	
		}
	},
	iconType:function (num,typeClass,size){								//查看
		for(var i=0;i<this.deskMenuList1.length;i++){
			this.deskMenuList1[i].className = '';
		}
		this.deskMenuList1[num].className = this.className.typeChecked;
		this.deskMenu.style.display = 'none';
		for(var i=0;i<this.aDesk.length;i++){
			for(var j=0;j<this.aDeskIcon[i].length;j++){
				this.aDeskIcon[i][j].className = typeClass;
				this.aDeskIcon[i][j].style.height = size +'px';
				this.aDeskIcon[i][j].style.width = size +'px';
				this.arrangeIcon(this.argMent);		
			}
		}
	},
	argType:function (num,type){										//排列方式
		for(var i=0;i<this.deskMenuList2.length;i++){
			this.deskMenuList2[i].className = '';
		}
		this.deskMenuList2[num].className = this.className.typeChecked;
		this.deskMenu.style.display = 'none';
		this.argMent = type;
		this.arrangeIcon(this.argMent);
	},
	showDesk:function (){												//显示桌面
		var aWindow = getByClass(this.oDesk,this.className.thisWindow);
		var aTask = getByClass(this.oTask,this.className.taskMenu);
		for(var i=0;i<aWindow.length;i++){
			aWindow[i].style.display = 'none';
			fnMove(aWindow[i],{opacity:0})
		}
		for(var i=0;i<aTask.length;i++){
			fnMove(aTask[i],{width:90,opacity:100});
			aTask[i].style.display = 'block';	
		}
		$('#bgWindow').style.display = 'none';
		this.deskMenu.style.display = 'none';
	},
	reLoad:function (){													//刷新
		for(var i=0;i<this.aDeskIcon[this.iNowDesk-1].length;i++){
			this.aDeskIcon[this.iNowDesk-1][i].style.opacity =0;
			fnMove(this.aDeskIcon[this.iNowDesk-1][i],{opacity:100});
			this.arrangeIcon(this.argMent);
		}
		this.deskMenu.style.display = 'none';
	},
	setBg:function (){													//主题设置
		setBg(this.oBg);
		this.deskMenu.style.display = 'none';
	},
	drag:function (obj){												//导航条拖拽
		obj.onmousedown = function(ev){
			var ev = ev||event;
			var disX = ev.clientX - this.offsetLeft;
			var disY = ev.clientY - this.offsetTop;
			if(obj.setCapture){
				obj.setCapture();	
			}
			this.style.zIndex = zh_winzIndex;
			document.onmousemove = function (ev){
				var ev = ev||event;	
				var iL = ev.clientX - disX;
				var iT = ev.clientY - disY;
				if(iL<0){
					iL = 0;
				}
				if(iL>viewW()-obj.offsetWidth){
					iL = viewW() - obj.offsetWidth;	
				}
				if(iT<10){
					iT = 10;	
				}
				if(iT>=(viewH() - obj.offsetHeight)){
					iT = viewH() - obj.offsetHeight;
				}
				obj.style.left = iL+'px';
				obj.style.top = iT+'px';
			};
			document.onmouseup = function (){
				document.onmousemove = document.onmouseup = null;
				if(obj.releaseCapture){
					obj.releaseCapture();
				}
			}
			return false;
		}
	}
};

/*------------------------------------------------APP---------------------------------------*/

function createIcon(winParent,appParent,oTask,json){					//APP
	this.winParent = winParent;
	this.appParent = appParent;
	this.oTask = oTask;
	this.json = json;
	this.iconId = json.id;
	this.imgSrc = json.src;
	this.title = json.title;
	this.isOpen = json.isOpen || 'yes';
	this.iconClass = json.className||zh_className;
	this.isClick = false;
	this.iconPos = json.pos||'desk';
	this.isDel = json.isDel||true;
	this.zIndex = 0;
}
createIcon.prototype = {												//初始化
	init:function (){
		var _this=this;
		this.create();
		this.setAppzIndex();
		this.drag(_this.icon);
	},
	create:function (){													//创建app
		this.icon = document.createElement('div');
		this.iconImg = document.createElement('div');
		this.img = document.createElement('img');
		this.icontitle = document.createElement('a');
		this.icoDelete = document.createElement('div');
				
		this.iconImg.title = this.title;
		this.img.src = this.imgSrc;
		this.icontitle.innerHTML = this.title;
		
		this.icon.json = this.json;
		this.icon.isOpen = this.isOpen;
		this.icon.id = this.appParent.id+this.iconId;
		this.icon.setAttribute('isClick',this.isClick)
		this.icon.className = this.iconClass.icon;
		this.iconImg.className = this.iconClass.iconImg;
		this.icontitle.className = this.iconClass.icontitle;
		this.icoDelete.className = this.iconClass.iconDelete;
		if(this.iconPos == 'left'){
			this.icon.className = this.iconClass.leftIcon;
			this.iconImg.className = this.iconClass.leftIconImg;	
		}
		
		this.iconImg.appendChild(this.img);
		this.icon.appendChild(this.iconImg);
		if(this.iconPos == 'desk'){
			this.icon.appendChild(this.icontitle);
		}
		this.icon.appendChild(this.icoDelete);
		this.appParent.appendChild(this.icon);
	},
	setAppzIndex:function (){											//改变app层级
		setStyle(this.icon,{'z-index':zh_appzIndex++});
		this.zIndex = zh_appzIndex;
	},
	drag:function (obj){											    //APP拖拽;
		var _this = this;											
		obj.onmousedown = function(ev){
			var oDate1 = new Date();
			var time1 = oDate1.getTime();
			_this.setAppzIndex();
			var ev = ev || event;
			var X = ev.clientX;
			var Y = ev.clientY;
			var disX = X - parseInt(getStyle(_this.icon,'left'));
			var disY = Y - parseInt(getStyle(_this.icon,'top'));
			if (obj.setCapture) {
				obj.setCapture();
			}
			document.onmousemove = function(ev) {
				var ev = ev || event;
				var iT = ev.clientY - disY;
				var iL = ev.clientX - disX;
				if(iT<=0){
					iT=0;	
				};
				if(iT>=(viewH()-obj.offsetHeight)){
					iT=(viewH()-obj.offsetHeight);
				}
				if(iL<=0){
					iL=0;	
				};
				if(iL>=(viewW()-obj.offsetWidth)){
					iL=(viewW()-obj.offsetWidth);
				}
				if(_this.iconPos == 'desk' && obj.isOpen == 'yes'){
					_this.icon.style.left = iL + 'px';
					_this.icon.style.top = iT + 'px';	
				}
			}
			document.onmouseup = function(ev) {
				var ev = ev||event;
				if(ev.clientX == X && ev.clientY == Y){
					if(!$('#'+_this.appParent.id+'window'+_this.iconId)){	/*一个app只允许打开一个窗口*/	
						obj.setAttribute('isClick',false);
					}
					if(obj.getAttribute('isClick') == 'false' && obj.isOpen == 'yes'){
						obj.setAttribute('isClick',true);
						obj.onclick = function (){
							 new newWindow(_this.winParent,_this.oTask,_this.appParent.id+'window'+_this.iconId,_this.json).init();
						};
					}
					else{
						if(obj.isOpen == 'yes'){
							obj.onclick = null;	
						}
						
					}
				}
				else{
					if(_this.isOpen == 'yes'){
						obj.onclick = null;	
					}
				}
				if (obj.releaseCapture) {
					obj.releaseCapture();
				}
				document.onmouseup = document.onmousemove = null;
			}
			ev.cancelBubble = true;
			return false;
		}
	}
};

/*---------------------------------------------window--------------------------------------*/

function newWindow(oParent,oTask,id,json){
	this.oParent = oParent;
	this.oTask = oTask;
	this.windowId = id;
	this.windowClass = json.className||zh_className;
	this.timer1 = null;						//关闭时等待动画效果完成
	this.timer2 = null;						//检测是否为当前窗口
	this.isMax = json.isMax||'mid';			//窗口状态其值为min,mid,max;
	this.zIndex = 0;
	this.iLeft = json.iLeft||300;
	this.iTop = json.iTop=(json.iTop<=20?20:json.iTop)||51;	//窗口top值
	this.iWidth = json.iWidth||900;
	this.iHeight = json.iHeight||450;
	this.webSrc = json.webSrc||'html/doc/index.html';
	this.title = json.title||'说明文档';
	this.minWidth = json.minWidth||250;
	this.minHeight = json.minHeight||50;
};
newWindow.prototype = {
	init:function (){											//初始化窗口;
		var _this = this;
		this.createWindow();
		this.createTask();
		this.show();
		this.currentWindow();
		this.events();
		this.timer2 = setInterval(function (){
			_this.checkCurWindow();
		},30);
	},
	createWindow:function(){									//创建窗口;
		zh_windowCount+=50;
		this.thisWindow = document.createElement('div');
		this.windowContainer = document.createElement('div');
		this.windowMenu = document.createElement('div');
		this.windowMenuContent = document.createElement('div');
		this.windowControl = document.createElement('div');
		this.windowMinimize = document.createElement('div');
		this.windowMaximize = document.createElement('div');
		this.windowClose = document.createElement('div');
		this.windowContent = document.createElement('div');
		this.windowFrame = document.createElement('iframe');
		this.contentMask = document.createElement('div');
		
		this.windowMenuContent.innerHTML = this.title;
		
		this.windowFrame.src = this.webSrc;
		
		this.thisWindow.innerHTML = 
		'<div class='+this.windowClass.windowTopResize+'></div>'+
		'<div class='+this.windowClass.windowLeftResize+'></div>'+
		'<div class='+this.windowClass.windowRightResize+'></div>'+
		'<div class='+this.windowClass.windowBottomResize+'></div>'+
		'<div class='+this.windowClass.windowTlResize+'></div>'+
		'<div class='+this.windowClass.windowTrResize+'></div>'+
		'<div class='+this.windowClass.windowBrResize+'></div>'+
		'<div class='+this.windowClass.windowBlResize+'></div>';
		
		this.thisWindow.id = this.windowId;
		
		this.thisWindow.className = this.windowClass.thisWindow;
		this.windowContainer.className = this.windowClass.windowContainer;
		this.windowMenu.className = this.windowClass.windowMenu;
		this.windowMenuContent.className = this.windowClass.windowMenuContent;
		this.windowControl.className = this.windowClass.windowControl;
		this.windowMinimize.className = this.windowClass.windowMinimize;
		this.windowMaximize.className = this.windowClass.windowMaximize;
		this.windowClose.className = this.windowClass.windowClose;
		this.windowContent.className = this.windowClass.windowContent;
		this.windowFrame.className = this.windowClass.windowFrame;
		this.contentMask.className = this.windowClass.contentMask;
		
		this.windowControl.appendChild(this.windowMinimize);
		this.windowControl.appendChild(this.windowMaximize);
		this.windowControl.appendChild(this.windowClose);
		this.windowMenu.appendChild(this.windowMenuContent);
		this.windowMenu.appendChild(this.windowControl);
		this.windowContainer.appendChild(this.windowMenu);
		this.windowContent.appendChild(this.contentMask);
		this.windowContent.appendChild(this.windowFrame);
		this.windowContainer.appendChild(this.windowContent);
		this.thisWindow.appendChild(this.windowContainer);
		
		this.oParent.appendChild(this.thisWindow);
	},
	events:function(){											//事件
		var _this = this;
		
		this.drag(this.windowMenu);
		
		this.thisWindow.onmousewheel = function (ev){
			var ev = ev||event;
			ev.cancelBubble = true;	
			return false;
		};
		
		if (this.thisWindow.addEventListener) {
			this.thisWindow.addEventListener('DOMMouseScroll',
				function (ev){
					var ev = ev||event;
					if(ev.preventDefalut){
						ev.preventDefalut();	
					}
					return false;
				}
			, false);
		}
		this.resizeWindow();
		
		/**************************标题栏事件*************************/
		
		addEvent(this.windowMinimize,'click',function (){		//最小化按钮
			_this.minimize();
		});
		addEvent(this.windowMaximize,'click',function (){		//放大缩小按钮
			if(_this.isMax == 'mid'){
				_this.maximize();
			}else if(_this.isMax == 'max'){
				_this.narrow();
			}
			_this.setWindowzIndex();
		});
		addEvent(this.windowClose,'click',function (){			//关闭按钮
			_this.closeWindow();
		});
		addEvent(this.windowMenu,'dblclick',function (){		//双击
			if(_this.isMax == 'mid'){
				_this.maximize();
			}else if(_this.isMax == 'max'){
				_this.narrow();
			}
			_this.setWindowzIndex();	
		});
		/**************************任务栏事件*************************/
		
		addEvent(this.taskMenuMax,'click',function (){			//放大缩小按钮
			if(_this.isMax == 'mid'){
				_this.narrow();
			}else if(_this.isMax == 'max'){
				_this.maximize();
			}
			fnMove(_this.taskMenu,{'opacity':0,'width':0});
			_this.setWindowzIndex();
			_this.currentWindow();
			_this.timer2 = setInterval(function (){
				_this.checkCurWindow();
			},30)
		});
		addEvent(this.taskMenuClose,'click',function (){		//关闭按钮
			_this.closeWindow();
		});
		addEvent(this.taskMenu,'mouseover',function (){
			fnMove(_this.taskMenuWrap,{'top':-40});
		});
		addEvent(this.taskMenu,'mouseout',function (){
			fnMove(_this.taskMenuWrap,{'top':5});
		});
		
		
		/**************************窗口层级*************************/
		this.windowMenu.oncontextmenu = function (ev){
			var ev = ev||event;
			ev.cancelBubble = true;
			return false;
		};
		addEvent(this.windowMenu,'mousedown',function (){
			_this.setWindowzIndex();
			_this.clearMask();
			_this.currentWindow();
			_this.timer2 = setInterval(function (){
				_this.checkCurWindow();
			},30)
		});
		addEvent(this.contentMask,'mousedown',function (){
			_this.setWindowzIndex();
			_this.clearMask();
			_this.currentWindow();
			_this.timer2 = setInterval(function (){
				_this.checkCurWindow();
			},30)
		});
		addEvent(this.windowFrame,'mouseover',function (){
			if(_this.zIndex != zh_winzIndex){
				_this.addMask();	
			}else{
				_this.clearMask();	
			}
		});	
	},
	createTask:function (){										//创建任务栏图标;
		this.taskMenu = document.createElement('div');
		this.taskMenuWrap = document.createElement('div');
		this.taskMenuCon = document.createElement('div');
		this.taskMenuMax = document.createElement('div');
		this.taskMenuClose = document.createElement('div');
		
		this.taskMenuCon.innerHTML = this.title;
		
		this.taskMenu.className = this.windowClass.taskMenu;
		this.taskMenuWrap.className = this.windowClass.taskMenuWrap;
		this.taskMenuCon.className = this.windowClass.taskMenuCon;
		this.taskMenuMax.className = this.windowClass.taskMax;
		this.taskMenuClose.className = this.windowClass.taskClose;
		
		this.taskMenuWrap.appendChild(this.taskMenuCon);
		this.taskMenuWrap.appendChild(this.taskMenuMax);
		this.taskMenuWrap.appendChild(this.taskMenuClose);
		this.taskMenu.appendChild(this.taskMenuWrap);
		if(this.oTask){
			this.oTask.appendChild(this.taskMenu);
		}
	},
	show:function (){											//显示窗口
		var left = parseInt(this.iLeft)+(zh_windowCount-50)%150;
		var top = parseInt(this.iTop)+(zh_windowCount-50)%150;
		fnMove(this.thisWindow,{'opacity':100});
		setStyle(this.thisWindow,{'left':left+'px','top':top+'px','width':this.iWidth+'px','height':this.iHeight+'px'});
		this.iLeft = left;
		this.iTop = top;
		this.setWindowzIndex();
	},
	setWindowzIndex:function (){								//改变window层级
		setStyle(this.thisWindow,{'z-index':zh_winzIndex++});
		this.zIndex = zh_winzIndex;
		
	},
	currentWindow:function (){									//窗口设置为激活窗口
		addClass(this.windowMenu,this.windowClass.windowMenuactive);
		this.windowFrame.focus();
	},
	cancelCurWindow:function (){								//取消窗口激活
		removeClass(this.windowMenu,this.windowClass.windowMenuactive);
	},
	checkCurWindow:function (){									//检测是否为当前窗口
		if(this.zIndex != zh_winzIndex){
			this.cancelCurWindow();
			clearInterval(this.timer2);
		}
	},												
	addMask:function (){										//增加content遮罩
		setStyle(this.contentMask,{'display':'block'});
	},
	clearMask:function (){										//清除content遮罩
		setStyle(this.contentMask,{'display':'none'});
	},
	minimize:function (){										//窗口最小化;
		var _this = this;
		if(this.isMax == 'mid'){
			this.iHeight = 	this.thisWindow.offsetHeight;
			this.iLeft = this.thisWindow.offsetLeft;
			this.iTop = this.thisWindow.offsetTop;
			this.iWidth = this.thisWindow.offsetWidth;	
		}
		fnMove(_this.taskMenu,{'opacity':100,'width':100});
		fnMove(_this.thisWindow,{'opacity':0,'height':0,'top':viewH()});
		this.isMax = this.isMax;
		_this.taskMenu.style.display = 'block';
		setTimeout(function (){
			_this.thisWindow.style.display = 'none';	
		},500)
		
	},
	maximize:function (){										//窗口最大化;
		var _this = this;
		if(this.isMax == 'mid'){
			this.iHeight = 	this.thisWindow.offsetHeight;

			this.iLeft = this.thisWindow.offsetLeft;
			this.iTop = this.thisWindow.offsetTop;
			this.iWidth = this.thisWindow.offsetWidth;	
		}
		fnMove(_this.thisWindow,{'opacity':100,'height':viewH()-31,'width':viewW(),'left':0,'top':31});
		this.isMax = 'max';
		this.windowMaximize.className = this.windowClass.windowMax;
		_this.thisWindow.style.display = 'block';
	},
	narrow:function (){											//缩放窗口;
		var _this = this;
		fnMove(_this.thisWindow,{'opacity':100,'top':this.iTop,'left':this.iLeft,'height':this.iHeight,'width':this.iWidth});
		this.isMax = 'mid';
		this.windowMaximize.className = this.windowClass.windowMaximize;
		_this.thisWindow.style.display = 'block';
		setTimeout(function (){
			_this.taskMenu.style.display = 'none';
		},500);
	},
	closeWindow:function (){									//关闭窗口;
		var _this = this;
		zh_windowCount-=50;
		fnMove(_this.taskMenu,{'opacity':0,'width':0});
		fnMove(_this.thisWindow,{'opacity':0,'height':0});
		this.timer1 = setTimeout(function (){
			_this.oParent.removeChild(_this.thisWindow);
			_this.oTask.removeChild(_this.taskMenu);	
		},500);
		setTimeout(function (){
			_this.taskMenu.style.display = 'none';
		},500);
	},
	resizeWindow:function (){									//改变窗口大小
		var _this = this;
		this.thisWindow.onmousedown = function (ev){
			if(_this.isMax != 'max'){
				_this.addMask();
				var ev = ev||event;
				var oPos = '',
					iX = ev.clientX,
					iY = ev.clientY+31,
					iLeft = _this.thisWindow.offsetLeft,
					iTop = _this.thisWindow.offsetTop,
					iWidth = _this.thisWindow.offsetWidth,
					iHeight = _this.thisWindow.offsetHeight,
					iRight = iLeft + iWidth,
					iBottom = iTop + iHeight+31;
				
				/*-------------以下判断为获得鼠标在窗口中的位置---------------*/
				/*-------------l:左，r:右，t:上，b:下---------------*/
				
				if(iX>=iLeft-5&&iX<=iLeft+5){
					oPos = 'l';
				}
				if(iX>=iRight-5&&iX<=iRight+5){
					oPos = 'r';
				}
				if(iY>=iTop-5&&iY<=iTop+5){
					oPos = 't';
				}
				if(iY>=iBottom-5&&iY<=iBottom+5){
					oPos = 'b';
				}
				if((iX>=iLeft-8&&iX<=iLeft+8)&&(iY>=iTop-8&&iY<=iTop+8)){
					oPos = 'tl';
				}
				if((iX>=iRight-8&&iX<=iRight+8)&&(iY>=iTop-8&&iY<=iTop+8)){
					oPos = 'tr';
				}
				if((iX>=iLeft-8&&iX<=iLeft+8)&&(iY>=iBottom-8&&iY<=iBottom+8)){
					oPos = 'bl';
				}
				if((iX>=iRight-8&&iX<=iRight+8)&&(iY>=iBottom-8&&iY<=iBottom+8)){
					oPos = 'br';
				}													
				
				document.onmousemove = function (ev){
					var ev = ev||event,
						iW = iX-ev.clientX,
						iH = iY- ev.clientY-31,
						left = iLeft,
						top = iTop,
						width = iWidth,
						height = iHeight;
					
					/*-------以下所有判断，全为限制窗口活动范围.-------*/
					
					switch(oPos){
						case 'l':
							left = (iLeft - iW);
							width = (iWidth + iW);
							if(left<=0){
								left = 0;
								width = iLeft + iWidth;
							}
							if(width<=_this.minWidth){
								width = _this.minWidth;
								left = iLeft + iWidth-_this.minWidth;
							}
							break;
						case 't':
							top = (iTop - iH);
							height = (iHeight + iH);
							if(top<=31){
								top = 31;
								height = iHeight+iTop-top;		
							}
							if(height<=_this.minHeight){
								height = _this.minHeight;
								top = iTop + iHeight-_this.minHeight;
							}
							break;
						case 'b':
							height = (iHeight - iH);
							if(height<=_this.minHeight){
								height = _this.minHeight;
							}
							break;
						case 'r':
							width = (iWidth - iW);
							if(width<=_this.minWidth){
								width = _this.minWidth;
							}
							break;
						case 'tl':
							left = (iLeft - iW);
							width = (iWidth + iW);
							top = (iTop - iH)
							height = (iHeight + iH);
							if(left<=0){
								left = 0;
								width = iLeft + iWidth;
							}
							if(top<=31){
								top = 31;
								height = iHeight+iTop-top;		
							}
							if(width<=_this.minWidth){
								width = _this.minWidth;
								left = iLeft + iWidth-_this.minWidth;
							}
							if(height<=_this.minHeight){
								height = _this.minHeight;
								top = iTop + iHeight-_this.minHeight;
							}
							break;
						case 'tr':
							top = (iTop - iH)
							height = (iHeight + iH);
							width = (iWidth - iW);
							if(top<=31){
								top = 31;
								height = iHeight+iTop-top;		
							}
							if(height<=_this.minHeight){
								height = _this.minHeight;
								top = iTop + iHeight-_this.minHeight;
							}
							if(width<=_this.minWidth){
								width = _this.minWidth;
							}
							break;
						case 'bl':
							left = (iLeft - iW);
							width = (iWidth + iW);
							height = (iHeight - iH);
							if(left<=0){
								left = 0;
								width = iLeft + iWidth;
							}
							if(width<=_this.minWidth){
								width = _this.minWidth;
								left = iLeft + iWidth-_this.minWidth;
							}
							if(height<=_this.minHeight){
								height = _this.minHeight;
							}
							break;
						case 'br':
							height = (iHeight - iH);
							width = (iWidth - iW);
							if(height<=_this.minHeight){
								height = _this.minHeight;
							}
							if(width<=_this.minWidth){
								width = _this.minWidth;
							}
							break;
					}
					if(width>=viewW()){							
						width = viewW();	
					}
					if(height>=viewH()-31){
						height = viewH()-31;
					}												
					_this.thisWindow.style.left = left+'px';
					_this.thisWindow.style.top = top+'px';
					_this.thisWindow.style.width = width+'px';
					_this.thisWindow.style.height = height+'px';
					_this.iHeight = _this.thisWindow.offsetHeight;
					_this.iLeft = _this.thisWindow.offsetLeft;
					_this.iTop = _this.thisWindow.offsetTop;
					_this.iWidth = _this.thisWindow.offsetWidth;
				};
				document.onmouseup = function (){
					document.onmousemove = 	document.onmouseup = null;
					_this.clearMask();
				};
			};
			return false;
		}
	},
	drag:function (obj){										//窗口拖拽;
		var _this = this;
		obj.onmousedown = function(ev) {
			var ev = ev || event;
			var flag = false;
			var disX = ev.clientX - parseInt(getStyle(_this.thisWindow,'left'));
			var disY = ev.clientY - parseInt(getStyle(_this.thisWindow,'top'));
			if (obj.setCapture) {
				obj.setCapture();
			}
			document.onmousemove = function(ev) {
				
				_this.addMask();
				var ev = ev || event;
				var iT = ev.clientY - disY;
				var iL = ev.clientX - disX;
				if(iT<=31){
					iT=31;	
				};
				if(iT>=(viewH()+31-obj.offsetHeight)){
					iT=(viewH()+31-obj.offsetHeight);
				}
				if(_this.isMax == 'max' && flag == false){
					iT = 31;
					iL = 0;
				}
				_this.thisWindow.style.left = iL + 'px';
				_this.thisWindow.style.top = iT + 'px';
				_this.iHeight = _this.thisWindow.offsetHeight;
				_this.iLeft = _this.thisWindow.offsetLeft;
			}
			document.onmouseup = function() {
				 document.onmouseup = document.onmousemove = null;
				 _this.clearMask();
				if (obj.releaseCapture) {
					obj.releaseCapture();
				}
			}
			ev.cancelBubble = true;
			return false;
		}
	}
}
function setBg(oBg){
	var oMenu = $('#bgWindowMenu');
	var oClose = $('#bgclose');
	var bgImg1 = $('#deskbg1');
	var aImg = $('<img>',oBg);
	var iNow = 0;
	
	fnDrag(oMenu,oBg);
	if(getStyle(oBg,'display') == 'none'){
		oBg.style.display = 'block';
		oBg.style.left  = '300px';
		oBg.style.top  = '150px';
		oBg.style.zIndex = zh_winzIndex++;
	}else{
		oBg.style.display = 'none';
	}
	oClose.onclick = function(ev){
		var ev = ev||event;
		oBg.style.display = 'none';
		ev.cancelBubble = true;
		return false;
	};
	for(var i=0;i<aImg.length;i++){
		aImg[i].onclick = function (){
			bgImg1.src = this.getAttribute('src');		
		};	
	}
}

function fnDrag(obj1,obj2){
	obj1.onmousedown = function(ev){
		var ev = ev||event;
		var disX = ev.clientX - obj2.offsetLeft;
		var disY = ev.clientY - obj2.offsetTop;
		if(obj1.setCapture){
			obj1.setCapture();	
		}
		obj2.style.zIndex = zh_winzIndex++;
		document.onmousemove = function (ev){
			var ev = ev||event;	
			var iL = ev.clientX - disX;
			var iT = ev.clientY - disY;
			if(iT<30){
				iT = 30;	
			}
			if(iT>(viewH())){
				iT = viewH();	
			}
			obj2.style.left = iL+'px';
			obj2.style.top = iT+'px';
			document.onmouseup = function (){
				document.onmousemove = document.onmouseup = null;
				if(obj1.releaseCapture){
					obj1.releaseCapture();
				}
			}
		};
		ev.cancelBubble = true;
		return false;
	};	
}