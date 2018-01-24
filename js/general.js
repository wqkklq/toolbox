/*Code written by Shangzhen Yang*/
if(window.location.href.indexOf("rthsoftware.tk")!=-1&&window.location.href.indexOf("sharedtext")==-1){window.location.href="http://rths.tk/"}
var back=document.getElementsByClassName("mui-action-back")[0],
language=localStorage.getItem("Language")
if(language!="SimplifiedChinese"&&language!="English"){
	if(navigator.language.indexOf("zh")!=-1){
		language="SimplifiedChinese"
		localStorage.setItem("Language","SimplifiedChinese")
	}else{
		language="English"
		localStorage.setItem("Language","English")
	}
}
if(back!=null){
	if(isAndroidApp()){mui.init({swipeBack:true})}
	else{mui.init({swipeBack:false})}
	if(!isApp()){
		document.getElementsByClassName("mui-content")[0].style.marginTop="20px"
		document.getElementsByClassName("title")[0].style.height="65px"
		document.getElementsByClassName("title")[0].style.paddingTop="20px"
	}
}
if(isElectron()){
	require("electron").webFrame.setZoomLevelLimits(1,1)
	if(process.platform!=="darwin"){document.getElementsByClassName("win")[0].style.display=""}
	if(back!=null){back.onclick=function(){window.close()}}
	document.addEventListener("keydown",function(e){
		if(e.ctrlKey||e.metaKey){
			if(e.keyCode==82){window.location.reload()}
			else if(e.keyCode==85){require("electron").remote.getCurrentWindow().toggleDevTools()}
		}
	})
}
function isElectron(){return navigator.userAgent.indexOf("Electron")!=-1}
function isPlus(){return navigator.userAgent.indexOf("Html5Plus")!=-1}
function isApp(){return isElectron()||isPlus()}
function isAndroid(){return navigator.userAgent.indexOf("Android")!=-1}
function isAndroidApp(){return isAndroid()&&isPlus()}
function isiOS(){return navigator.userAgent.indexOf("iPhone")!=-1||navigator.userAgent.indexOf("iPad")!=-1}
function isMobile(){return isAndroid()||isiOS()}
function isEdge(){return navigator.userAgent.indexOf("Edge")!=-1}
function isLinux(){return navigator.userAgent.indexOf("Linux")!=-1}
function isMac(){return navigator.userAgent.indexOf("Macintosh")!=-1}
function isEnglish(text){return (new RegExp("[A-Za-z]+")).test(text)}
function isOnline(){return window.location.href.indexOf("t.rths.tk")!=-1}
function addTime(url){
	if(url.indexOf("?")!=-1){url+="&time="+(new Date).getTime()}
	else{url+="?time="+(new Date).getTime()}
	return url
}
function addZero(num,length){return (Array(length).join("0")+num).slice(-length)}
function getToolbox(){
	if(isAndroid()){
		if(navigator.language=="zh-CN"){window.location.href="https://www.coolapk.com/apk/163867"}
		else{window.location.href="https://play.google.com/store/apps/details?id=shangzhenyang.rthtoolbox"}
	}else if(isiOS()){window.location.href="https://itunes.apple.com/app/rth-toolbox/id1294479577"}
	else{window.location.href=addTime("http://t.rths.tk/web/toolbox/download.html")}
}
function loadJS(src,callback){
	var existingScript=document.getElementsByTagName("script")
	for(var i=0;i<existingScript.length;i++){if(existingScript.src==src){return false}}
	var loadScript=function(i){
		var newScript=document.createElement("script")
		newScript.setAttribute("src",src[i])
		if(i<src.length-1){newScript.onload=function(){loadScript(i+1)}}
		else{newScript.onload=callback}
		document.body.appendChild(newScript)
	}
	loadScript(0)
	return true
}
function loadOnline(){
	var wvs=plus.webview.all()
	for(var i=0;i<wvs.length;i++){plus.webview.close(wvs[i].id)}
	openWindow("http://t.rths.tk/index")
}
function maximize(){
	const win=require("electron").remote.getCurrentWindow()
	if(win.isMaximized()){win.unmaximize()}
	else{win.maximize()}
}
function openDialog(){
	document.getElementById("OpenFileInput").value=""
	document.getElementById("OpenFileInput").click()
}
function openWebPage(href){
	href=encodeURI(href)
	if(href.indexOf("t.rths.tk")!=-1||href.indexOf("rthsoftware.tk")!=-1){href=addTime(href)}
	if(isPlus()){plus.runtime.openURL(href)}
	else if(isElectron()){require("electron").shell.openExternal(href)}
	else{window.open(href)}
}
function openWindow(name){
	var suffix=".html"
	if(name.indexOf(suffix)!=-1){suffix=""}
	var url=name+suffix
	if(isPlus()){
		if(isOnline()){url=addTime(url)}
		if(url.indexOf("http")!=-1||url.indexOf("?")!=-1||url.indexOf("flashcard")!=-1||url.indexOf("quiz")!=-1){plus.webview.open(url,name,{"popGesture":"close"},"fade-in")}
		else{
			plus.webview.create(url,name,{"popGesture":"hide"})
			plus.webview.show(name,"pop-in")
		}
	}else if(isElectron()){
		const remote=require("electron").remote
		const BrowserWindow=remote.BrowserWindow
		const path=require("path")
		const position=remote.getCurrentWindow().getPosition()
		const size=remote.getCurrentWindow().getSize()
		let options={
			backgroundColor:"#efeff4",
			frame:false,
			height:size[1],
			icon:__dirname+"/electron/icon.png",
			titleBarStyle:"hiddenInset",
			width:size[0],
			x:position[0],
			y:position[1]
		}
		if(process.platform=="darwin"){
			options.frame=true
			if(url.indexOf("http")==-1){options.show=false}
		}
		if(url.indexOf("http")==-1){url=path.join("file://",__dirname,url)}
		let win=new BrowserWindow(options)
		win.loadURL(url)
		win.once("ready-to-show",()=>{win.show()})
	}else{window.location.href=url}
	localStorage.setItem("Recent",name)
}
function request(url,callback){
	if(url.indexOf("t.rths.tk")!=-1){url=addTime(url)}
	var xhr=new XMLHttpRequest()
	xhr.onreadystatechange=function(){
		switch(xhr.readyState){
			case 4:
				if(xhr.status==200){callback(xhr.responseText)}
				break
			default:break
		}
	}
	xhr.open("GET",url)
	xhr.send()
}
function searchURL(key,url){
	var reg=new RegExp("(^|&)"+key+"=([^&]*)(&|$)")
	var r=url.substr(1).match(reg)
	if(r!=null){
		var value=unescape(decodeURI(r[2]))
		if(value!=null&value!=""){return value}
		else{return false}
	}else{return false}
}
function translate(query,from,to,callback){
	loadJS(["js/jquery.min.js","js/md5.min.js"],function(){
		var appid="20171109000093780",key="ZR6EGbP8ZzwU7GookTvy",salt=(new Date).getTime()
		if(to=="auto"){
			if(isEnglish(query)){to="zh"}
			else{to="en"}
		}
		var str1=appid+query+salt+key
		var sign=MD5(str1)
		$.ajax({
			url:"http://api.fanyi.baidu.com/api/trans/vip/translate",
			type:"get",
			dataType:"jsonp",
			data:{
				q:query,
				appid:appid,
				salt:salt,
				from:from,
				to:to,
				sign:sign
			},
			success:function(data){callback(data)}
		})
	})
}
