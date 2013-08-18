//2012.3.11
//Email:wchaowu@163.com

var moveTimer = null;//动态屏保

var screenTimer = null;//屏保显示

var screenDelay = 60000;//默认2分钟

var rbg_range = 2,
	style_range = 1,
	rbg_iMax = 254,
	rbg_iMin = 0,
	rbg_r = 254,
	rbg_g = 0,
	rbg_b = 2;

var oMask = $('#mask'),
	oHour = $('#hour'),
	oDate = $('#date'),
	maskImg = $('<img>',oMask)[0];

//document.write('<div id="mask" class="mask"><img src="images/mask2.png" /><div id="time" class="time"> <p id="hour" class="hour"></p><p id="date" class="date"></p></div></div>');

function fnScreen(){
	
	var arr = ['日','一','二','三','四','五','六'];
		
		addEvent(window,'resize',function(){
			oMask.style.height = viewH()+'px';
			oMask.style.width = viewW()+'px';	
		});
		//document.body.appendChild(oMask);
		moveTimer = setInterval(function (){
			var nowDate = new Date(),
				iYear = nowDate.getFullYear(),
				iMonth = nowDate.getMonth()+1,	//从0开始计算 0表示1月
				iDay = nowDate.getDate(),
				iWeek = nowDate.getDay(), 	//从0开始计算  0表示星期日
				iHour = nowDate.getHours(),
				iMint = nowDate.getMinutes();
						
			iHour = iHour<10?'0'+iHour:iHour;
			iMint = iMint<10?'0'+iMint:iMint;
		
			oHour.innerHTML = iHour+':'+iMint;
			
			oDate.innerHTML =  iYear+'.'+iMonth+'.'+iDay+' 星期'+arr[iWeek];
			
			rbg_r += (rbg_g == rbg_iMax && rbg_b == rbg_iMin) ? rbg_range : (rbg_g == rbg_iMin && rbg_b == rbg_iMax) ? -rbg_range : 0;
					
			rbg_g += (rbg_r == rbg_iMin && rbg_b == rbg_iMax) ? rbg_range : (rbg_r == rbg_iMax && rbg_b == rbg_iMin) ? -rbg_range : 0;
			
			rbg_b += (rbg_r == rbg_iMax && rbg_g == rbg_iMin) ? rbg_range : (rbg_r == rbg_iMin && rbg_g == rbg_iMax) ? -rbg_range : 0;

			oMask.style.background = 'rgb('+rbg_r+','+rbg_g+','+rbg_b+')';
			
			maskImg.style.width = maskImg.offsetWidth + style_range + 'px';
			
			maskImg.style.height = maskImg.offsetHeight + style_range + 'px';
			
			if(Math.round(getStyle(maskImg,'opacity')*100)<100){
				maskImg.style.opacity = (Math.round(getStyle(maskImg,'opacity')*100) + style_range)/100;
			}
			if(Math.round(getStyle(maskImg,'opacity'))<100){
				maskImg.style.filter = 'alpha(opacity:('+(Math.round(getStyle(maskImg,'opacity')) + style_range)+')';
			}
			style_range = maskImg.offsetWidth == 4000 ? -1 : maskImg.offsetWidth == 1000 ? 1 : style_range;
	},30)
};

fnScreen();

function isSreen(){
	screenTimer = setTimeout(function (){
		fnScreen();
		oMask.style.display = 'block';
		fnMove(oMask,{opacity:100});
	},10000);
	
	addEvent(window,'change',clear);
	addEvent(window,'resize',clear);
	addEvent(document,'keydown',clear);
	addEvent(document,'mousedown',clear);
	addEvent(document,'mousemove',clear);
	addEvent(document,'mousewheel',clear);
	document.addEventListener('DOMMouseScroll',clear,false);
	
	function clear(){
		clearInterval(screenTimer);
		clearInterval(moveTimer);
		fnMove(oMask,{opacity:0},function (){
			oMask.style.display = 'none';
		});
		screenTimer = setInterval(function (){
			clearInterval(moveTimer);
			fnScreen();
			oMask.style.display = 'block';
			fnMove(oMask,{opacity:100});
		},10000);
	}
	return false;	
}
