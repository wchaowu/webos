// JavaScript config
//2012.4.13
//Email:wuchaowu@163.com
/*----------------------------*****************----------------------------*/
/*----------------------------*--基础数据 config--*----------------------------*/
/*----------------------------*****************----------------------------*/
var zh_windowCount = 0,
	zh_winzIndex = 10000,
	zh_appzIndex = 1,
	zh_className = {
		thisWindow : 'newWindow',
		windowContainer : 'windowContainer',
		windowMenu : 'windowMenu',
		windowMenuactive:'windowMenuactive',
		windowMenuContent : 'windowMenuContent',
		windowFrame : 'contentFrame',
		contentMask:'contentMask',
		windowControl : 'windowControl',
		windowMinimize : 'windowMinimize',
		windowMaximize : 'windowMaximize',
		windowMax:'windowMax',
		windowClose : 'windowClose',
		windowContent:'windowContent',
		windowResize:'windowResize',
		windowTopResize : 'windowTopResize',
		windowLeftResize : 'windowLeftResize',
		windowRightResize : 'windowRightResize',
		windowBottomResize : 'windowBottomResize',
		windowTlResize : 'windowTlResize',
		windowTrResize : 'windowTrResize',
		windowBrResize : 'windowBrResize',
		windowBlResize : 'windowBlResize',
		
		taskMenu:'taskMenu',
		taskMenuWrap:'taskMenuWrap',
		taskMenuCon:'taskMenuCon',
		taskMax:'taskMax',
		taskClose:'taskClose',
		
		icon : 'app',
		minIcon:'minIcon',
		iconImg	: 'appImg',
		icontitle : 'appTitle',
		iconDelete : 'iconDelete',
		leftIcon:'leftIcon',
		leftIconImg:'leftIconImg',
		
		iconDesk:'deskIcon',
		menu:'menu',
		btm:'btm',
		iconMenuRight:'iconRight',
		iconMenuLeft:'iconLeft',
		iconMenuCur:'iconCur',
		
		deskMenuRight:'deskRight',
		deskMenuLeft:'deskLeft',
		typeChecked:'typeChecked',
		
		top:'top',
		topImg:'topImg',
		deskIndex:'deskIndex',
		activeNum:'active',
		tosearch:'tosearch',
		appView:'appView'
	},
	zh_iconMenu = [
		{id:'open',innerHTML:'打开应用'},
		[
			{id:'move',innerHTML:'移动到'},
			{id:'to1',innerHTML:'桌面1'},
			{id:'to2',innerHTML:'桌面2'},
			{id:'to3',innerHTML:'桌面3'},
			{id:'to4',innerHTML:'桌面4'},
			{id:'to5',innerHTML:'桌面5'}
		],
		{id:'del',innerHTML:'删除应用'},
	],
	zh_addIcon = [
		{id:'open',innerHTML:'上传文件'},
		{id:'del',innerHTML:'添加应用'},
		{id:'del',innerHTML:'添加桌面联系人'},
		{id:'del',innerHTML:'新建文件夹'},
	],
	zh_deskMenu = [
		[
			{id:'viewIcon',innerHTML:'查看'},
			{id:'smIcon',innerHTML:'小图标'},
			{id:'bigIcon',innerHTML:'大图标'},
			{id:'hugIcon',innerHTML:'超大图标'},
		],
		[
			{id:'arrge',innerHTML:'排列方式'},
			{id:'toRow',innerHTML:'横向'},
			{id:'toCol',innerHTML:'纵向'},
			{id:'toFree',innerHTML:'自由排列'},
		],
		{id:'renovate',innerHTML:'刷新'},
		{id:'showdesk',innerHTML:'显示桌面'},
		{id:'bgSet',innerHTML:'主题设置'},
		{id:'advise',innerHTML:'反馈'},
		{id:'cancel',innerHTML:'注销'},
		
	],
/*----------------------------*****************----------------------------*/
/*----------------------------*---App---Data--*----------------------------*/
/*----------------------------*****************----------------------------*/
 	zh_leftIcon = [
		{id:'leftIcon1',pos:'left',title:'vbooking团队项目',src:'images/github.jpg',webSrc:'http://vbooking.github.com',iWidth:950,iHeight:660,minWidth:800,minHeight:600},
		{id:'leftIcon2',pos:'left',title:'携程旅行网',src:'images/ctrip.png',webSrc:'http://ctrip.com/',iWidth:1100,iHeight:500,iLeft:100},
		{id:'leftIcon4',pos:'left',title:'携程度假',src:'images/c_logo2013.png',webSrc:'http://v.ctrip.com/',iLeft:200,iHeight:500},
		{id:'leftIcon3',pos:'left',title:'新浪微博',src:'images/sina.png',webSrc:'http://www.weibo.com/u/2000508384?wvr=5'},				
		{id:'leftIcon6',pos:'left',title:'腾讯微博',src:'images/left6.png',webSrc:'http://dev.t.qq.com/'},
		{id:'leftIcon5',pos:'left',title:'QQ邮箱',src:'images/left5.png',webSrc:'https://mail.qq.com/cgi-bin/loginpage'}
	]
 	zh_deskIcon = [
		[
			{id:'icon2',src:'images/13.png',title:'iteye',webSrc:'http://www.iteye.com'},
			{id:'icon1',src:'images/cnblogs.png',title:'博客圆',webSrc:'http://www.cnblogs.com'},			
			{id:'icon3',src:'images/oschina.png',title:'oschina',webSrc:'http://www.oschina.net'},
			{id:'icon4',src:'images/add.png',title:'添加',isOpen:'no'}
		],
		[
		
			{id:'icon10',src:'images/13.png',title:'芒果旅游',webSrc:'http://www.mangocity.com/webqq/bookFlight.html'},
			{id:'icon10',src:'images/9.png',title:'快递查询',webSrc:'http://kuaidi100.com/frame/app/index.html'},
			{id:'icon10',src:'images/14.png',title:'团购地图',webSrc:'http://web.qq.com/app/tuangoumap/index.html'},
			{id:'icon8',src:'images/4.png',title:'豆瓣FM',webSrc:'http://douban.fm/partner/qq_plus',iWidth:550,iHeight:460,minWidth:400,minHeight:200},
			{id:'icon10',src:'images/add.png',title:'添加',isOpen:'no'}
		],
		[
			{id:'icon1',src:'images/27.png',title:'vbooking项目',webSrc:'http://vbooking.github.com',iWidth:1000,iHeight:500},
			{id:'icon2',src:'images/jquery.png',title:'jquery',webSrc:'http://www.jquery.com',iWidth:800,iHeight:500},
			{id:'icon3',src:'images/nodejs.png',title:'nodejs',webSrc:'http://www.nodejs.org/',iHeight:550},
			{id:'icon4',src:'images/mongodb.png',title:'mongodb',webSrc:'http://www.mongodb.org',iWidth:950,iHeight:660,minWidth:800,minHeight:600},
			{id:'icon5',src:'images/c_logo2013.png',title:'携程旅行网',webSrc:'http://www.ctrip.com'},
		
			{id:'icon6',src:'images/java.jpg',title:'java网站',webSrc:'http://www.java.com/zh_CN/',iHeight:600,iWidth:1200,iLeft:100,iTop:31},	
			{id:'icon7',src:'images/aspnet.png',title:'asp.net',webSrc:'http://www.asp.net/',iHeight:600,iWidth:1200,iLeft:100,iTop:31},
					
			{id:'icon9',src:'images/27.png',title:'说明文档',webSrc:'html/doc/index.html'},
			{id:'icon10',src:'images/add.png',title:'添加',isOpen:'no'}
		],
		[
		
			{id:'icon10',src:'images/5.png',title:'起点中文',webSrc:'http://webqq.qidian.com'},
			{id:'icon10',src:'images/18.png',title:'乐视网',webSrc:'http://www.letv.com/cooperation/qq.html'},
			{id:'icon10',src:'images/15.png',title:'QQ阅读',webSrc:'http://reader.qq.com/cgi-bin/login?fun=passport&from=webqq&target=reader'},
			{id:'icon10',src:'images/17.png',title:'视频',webSrc:'http://ptlogin2.tenpay.com/tenvideo'},
			{id:'icon10',src:'images/add.png',title:'添加',isOpen:'no'}
		],
		[
			{id:'icon1',src:'images/c_logo2013.png',title:'携程旅行网',webSrc:'http://www.ctrip.com'},
			{id:'icon2',src:'images/c_logo2013.png',title:'度假',webSrc:'http://vacations.ctrip.com/'},
			{id:'icon3',src:'images/c_logo2013.png',title:'机票',webSrc:'http://flights.ctrip.com/'},
			{id:'icon4',src:'images/c_logo2013.png',title:'酒店',webSrc:'http://hotels.ctrip.com/'},
			{id:'icon5',src:'images/add.png',title:'商旅',isOpen:'no'}
		]		
	];