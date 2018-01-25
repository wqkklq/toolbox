/*Code written by Shangzhen Yang*/
if(window.location.href.indexOf("rthsoftware.tk")!=-1&&window.location.href.indexOf("sharedtext")==-1){window.location.href="http://rths.tk/"}
const back=document.getElementsByClassName("mui-action-back")[0]
let existingScript="",inputId=0,language=localStorage.getItem("Language")
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
	const{remote,webFrame}=require("electron")
	webFrame.setZoomLevelLimits(1,1)
	if(process.platform!=="darwin"){
		const newDiv=document.createElement("div"),
		newMinimizeDiv=document.createElement("div")
		newMaximizeDiv=document.createElement("div")
		newCloseDiv=document.createElement("div")
		newDiv.setAttribute("class","win")
		newMinimizeDiv.style.right="80px"
		newMinimizeDiv.innerText="-"
		newMinimizeDiv.onclick=function(){remote.getCurrentWindow().minimize()}
		newDiv.appendChild(newMinimizeDiv)
		newMaximizeDiv.style.right="40px"
		newMaximizeDiv.innerText="+"
		newMaximizeDiv.onclick=function(){
			const win=remote.getCurrentWindow()
			if(win.isMaximized()){win.unmaximize()}
			else{win.maximize()}
		}
		newDiv.appendChild(newMaximizeDiv)
		newCloseDiv.style.right="0px"
		newCloseDiv.innerText="×"
		newCloseDiv.onclick=function(){window.close()}
		newDiv.appendChild(newCloseDiv)
		document.body.appendChild(newDiv)
	}
	if(back!=null){back.onclick=function(){window.close()}}
	document.addEventListener("keydown",function(e){
		if(e.ctrlKey||e.metaKey){
			if(e.keyCode==82){window.location.reload()}
			else if(e.keyCode==85){remote.getCurrentWindow().toggleDevTools()}
		}
	})
}
function isElectron(){return navigator.userAgent.indexOf("Electron")!=-1}
function isPlus(){return navigator.userAgent.indexOf("Html5Plus")!=-1&&window.plus}
function isApp(){return isElectron()||isPlus()}
function isAndroid(){return navigator.userAgent.indexOf("Android")!=-1}
function isAndroidApp(){return isAndroid()&&isPlus()}
function isiOS(){return navigator.userAgent.indexOf("iPhone")!=-1||navigator.userAgent.indexOf("iPad")!=-1}
function isMobile(){return isAndroid()||isiOS()}
function isEdge(){return navigator.userAgent.indexOf("Edge")!=-1}
function isLinux(){return navigator.userAgent.indexOf("Linux")!=-1}
function isMac(){return navigator.userAgent.indexOf("Macintosh")!=-1}
function isEnglish(text){return(new RegExp("[A-Za-z]+")).test(text)}
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
function initCalculator(max,calculate){
	if(language=="SimplifiedChinese"){document.title="计算器"}
	else{document.title="Calculator"}
	document.getElementsByClassName("mui-title")[0].innerText=document.title
	const input=document.getElementsByTagName("input")
	for(let i=0;i<=max;i++){
		if(language=="SimplifiedChinese"){input[i].placeholder="输入数字"}
		else{input[i].placeholder="Enter the number"}
		input[i].oninput=function(){
			const name=input[i].id.replace("Input","")
			const num=name.replace(/[A-Za-z]+/g,"")
			const display=name.replace(num,"")+"<sub>"+num+"</sub>"
			const label=document.getElementById(name+"Label")
			if(input[i].value==""){label.innerHTML=display}
			else{label.innerHTML=input[i].value}
			calculate()
		}
		input[i].onclick=function(){inputId=i}
	}
	document.getElementsByClassName("sign")[0].onclick=function(){
		let value=input[inputId].value
		if(value!=""&&value!=null){
			if(value.indexOf("-")!=-1){value=value.replace("-","")}
			else{value="-"+value}
		}else{value="-0"}
		input[inputId].value=value
		const label=document.getElementById(input[inputId].id.replace("Input","")+"Label")
		label.innerHTML=input[inputId].value
		calculate()
	}
}
function loadJS(src,callback){
	if(existingScript.indexOf(src)==-1){
		const loadScript=function(i){
			const newScript=document.createElement("script")
			newScript.setAttribute("src",src[i])
			if(i<src.length-1){newScript.onload=function(){loadScript(i+1)}}
			else{newScript.onload=callback}
			document.body.appendChild(newScript)
			existingScript+=src[i]+","
		}
		loadScript(0)
	}else{callback()}
}
function loadOnline(){
	const wvs=plus.webview.all()
	for(let i=0;i<wvs.length;i++){plus.webview.close(wvs[i].id)}
	openWindow("http://t.rths.tk/index")
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
	let suffix=".html"
	if(name.indexOf(suffix)!=-1){suffix=""}
	let url=name+suffix
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
	const xhr=new XMLHttpRequest()
	xhr.onreadystatechange=function(){
		switch(xhr.readyState){
			case 4:
				if(xhr.status==200){callback(xhr.responseText)}
				else{
					if(language=="SimplifiedChinese"){mui.toast("无法获取数据")}
					else{mui.toast("Unable to get data")}
				}
				break
			default:break
		}
	}
	xhr.open("GET",url)
	xhr.send()
}
function searchURL(key,url){
	if(url.indexOf("http")!=-1){
		const urlSplit=url.split("?")
		url=url.replace(urlSplit[0],"")
	}
	const match=url.substr(1).match(new RegExp("(^|&)"+key+"=([^&]*)(&|$)"))
	if(match!=null){
		const value=unescape(decodeURI(match[2]))
		if(value!=null&value!=""){return value}
		else{return false}
	}else{
		if(url!=window.location.search){
			if(language=="SimplifiedChinese"){mui.toast("无效的网址")}
			else{mui.toast("Invalid URL")}
		}
		return false
	}
}
function translate(query,from,to,callback){
	if(language=="SimplifiedChinese"){mui.toast("正在翻译")}
	else{mui.toast("Translating")}
	loadJS(["js/jquery.min.js","js/md5.min.js"],function(){
		const appid="20171109000093780",key="ZR6EGbP8ZzwU7GookTvy",salt=(new Date).getTime()
		if(to=="auto"){
			if(isEnglish(query)){to="zh"}
			else{to="en"}
		}
		const str1=appid+query+salt+key
		const sign=MD5(str1)
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
			success:function(data){
				if(language=="SimplifiedChinese"){mui.toast("已翻译")}
				else{mui.toast("Translated")}
				callback(data)
			}
		})
	})
}
