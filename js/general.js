/*Code written by Shangzhen Yang*/
let addedScript="",
addedStyle="",
appliedTheme,
language=localStorage.getItem("Language"),
recentInput=0,
theme=localStorage.getItem("Theme")
const header=document.getElementsByTagName("header")[0]
function addTime(url){
	if(url.indexOf("?")!=-1){
		url+="&time="+(new Date).getTime()
	}else{
		url+="?time="+(new Date).getTime()
	}
	return url
}
function addZero(num,length){
	return (Array(length).join("0")+num).slice(-length)
}
function getToolbox(){
	if(isAndroid()){
		if(navigator.language=="zh-CN"){
			openWebPage("https://www.coolapk.com/apk/163867")
		}else{
			openWebPage("https://play.google.com/store/apps/details?id=shangzhenyang.rthtoolbox")
		}
	}else if(isiOS()){
		window.location.href="https://itunes.apple.com/app/rth-toolbox/id1294479577"
	}else{
		openWebPage("http://t.rths.tk/web/toolbox/download.html")
	}
}
function initCalculator(max,calculate){
	switch(language){
		case "SimplifiedChinese":
			document.title="计算器"
			break
		default:
			document.title="Calculator"
			break
	}
	document.getElementsByClassName("mui-title")[0].innerText=document.title
	const input=document.getElementsByTagName("input")
	for(let i=0;i<=max;i++){
		switch(language){
			case "SimplifiedChinese":
				input[i].placeholder="输入数字"
				break
			default:
				input[i].placeholder="Enter the number"
				break
		}
		input[i].oninput=function(){
			const name=input[i].id.replace("Input","")
			const num=name.replace(/[A-Za-z]+/g,"")
			const display=name.replace(num,"")+"<sub>"+num+"</sub>"
			const label=document.getElementById(name+"Label")
			if(input[i].value==""){
				label.innerHTML=display
			}else{
				label.innerHTML=input[i].value
			}
			calculate()
		}
		input[i].onclick=function(){
			recentInput=i
		}
	}
	document.getElementsByClassName("sign")[0].onclick=function(){
		let value=input[recentInput].value
		if(value!=""&&value!=null){
			if(value.indexOf("-")!=-1){
				value=value.replace("-","")
			}else{
				value="-"+value
			}
		}else{
			value="-0"
		}
		input[recentInput].value=value
		const label=document.getElementById(input[recentInput].id.replace("Input","")+"Label")
		label.innerHTML=input[recentInput].value
		calculate()
	}
}
function isAndroid(){
	return /Android/i.test(navigator.userAgent)
}
function isAndroidApp(){
	return isAndroid()&&isPlus()
}
function isApp(){
	return isElectron()||isPlus()
}
function isElectron(){
	return /Electron/i.test(navigator.userAgent)
}
function isEnglish(text){
	return(new RegExp("[A-Za-z]+")).test(text)
}
function isiOS(){
	return /iPhone/i.test(navigator.userAgent)||/iPad/i.test(navigator.userAgent)
}
function isLinux(){
	return /Linux/i.test(navigator.userAgent)
}
function isMac(){
	return /Macintosh/i.test(navigator.userAgent)
}
function isMobile(){
	return isAndroid()||isiOS()
}
function isOnline(){
	return /t.rths.tk/.test(window.location.href)
}
function isPlus(){
	return /Html5Plus/i.test(navigator.userAgent)
}
function loadCSS(href){
	if(addedStyle.indexOf(href)==-1){
		const newLink=document.createElement("link")
		newLink.href=href
		newLink.rel="stylesheet"
		document.getElementsByTagName("head")[0].appendChild(newLink)
		addedStyle+=href+","
	}
}
function loadJS(src,callback){
	if(addedScript.indexOf(src)==-1){
		const loadScript=function(i){
			const newScript=document.createElement("script")
			newScript.src=src[i]
			if(i<src.length-1){
				newScript.onload=function(){
					loadScript(i+1)
				}
			}else{
				newScript.onload=callback
			}
			document.body.appendChild(newScript)
			addedScript+=src[i]+","
		}
		loadScript(0)
	}else{
		callback()
	}
}
function loadOnline(){
	const wvs=plus.webview.all()
	for(let i=0;i<wvs.length;i++){
		plus.webview.close(wvs[i].id)
	}
	openWindow("http://t.rths.tk/index")
}
function openDialog(){
	document.getElementById("OpenFileInput").value=""
	document.getElementById("OpenFileInput").click()
}
function openWebPage(href){
	href=encodeURI(href)
	if(/t.rths.tk|rthsoftware.tk/.test(href)){
		href=addTime(href)
	}
	if(href.length<=2048){
		if(isPlus()){
			plus.runtime.openURL(href)
		}else if(isElectron()){
			require("electron").shell.openExternal(href)
		}else{
			window.open(href)
		}
	}else{
		showAlert([
			"Length limit exceeded ("+href.length+"/2048)",
			"超出长度限制 ("+href.length+"/2048)"
		],[
			"Error",
			"错误"
		])
	}
}
function openWindow(name){
	let suffix=".html"
	if(name.indexOf(suffix)!=-1){
		suffix=""
	}
	let url=name+suffix
	if(isPlus()){
		if(isOnline()){
			url=addTime(url)
		}
		if(/http|\?|flashcard|quiz/.test(url)){
			plus.webview.open(url,name,{"popGesture":"close"},"fade-in")
		}else{
			plus.webview.create(url,name,{"popGesture":"hide"})
			plus.webview.show(name,"pop-in")
		}
	}else{
		window.location.href=url
	}
}
function request(url,callback){
	if(/t.rths.tk/.test(url)){
		url=addTime(url)
	}
	const xhr=new XMLHttpRequest()
	xhr.onreadystatechange=function(){
		switch(xhr.readyState){
			case 4:
				if(xhr.status==200){
					callback(xhr.responseText)
				}
				break
			default:break
		}
	}
	xhr.open("GET",url)
	xhr.send()
}
function restart(){
	if(isPlus()){
		if(isOnline()){
			loadOnline()
		}else{
			plus.runtime.restart()
		}
	}else{
		window.location.href="index.html"
	}
}
function searchURL(key,url){
	if(url.indexOf("http")!=-1){
		const urlSplit=url.split("?")
		url=url.replace(urlSplit[0],"")
	}
	const match=url.substr(1).match(new RegExp("(^|&)"+key+"=([^&]*)(&|$)"))
	if(match!=null){
		const value=unescape(decodeURI(match[2]))
		if(value!=null&value!=""){
			return value
		}else{
			return false
		}
	}else{
		return false
	}
}
function showAlert(text,title,callback){
	if(title==null){
		title=[document.title,document.title]
	}
	switch(language){
		case "SimplifiedChinese":
			mui.alert(text[1],title[1],null,callback)
			break
		default:
			mui.alert(text[0],title[0],"OK",callback)
			break
	}
}
function showConfirm(text,title,positiveCallback,negativeCallback){
	if(title==null){
		title=[document.title,document.title]
	}
	switch(language){
		case "SimplifiedChinese":
			mui.confirm(text[1],title[1],["否","是"],function(e){
				if(e.index==1){
					positiveCallback()
				}else if(negativeCallback){
					negativeCallback()
				}
			})
			break
		default:
			mui.confirm(text[0],title[0],["No","Yes"],function(e){
				if(e.index==1){
					positiveCallback()
				}else if(negativeCallback){
					negativeCallback()
				}
			})
			break
	}
}
function showPrompt(text,title,callback){
	if(isApp()){
		switch(language){
			case "SimplifiedChinese":
				mui.prompt(text[1],"",title[1],null,function(e){
					if(e.index==1&&e.value!=""){
						callback(e.value)
					}
				})
				break
			default:
				mui.prompt(text[0],"",title[0],["Cancel","OK"],function(e){
					if(e.index==1&&e.value!=""){
						callback(e.value)
					}
				})
				break
		}
	}else{
		let value
		switch(language){
			case "SimplifiedChinese":
				value=prompt(text[1])
				break
			default:
				value=prompt(text[0])
				break
		}
		if(value!=null&&value!=""){
			callback(value)
		}
	}
}
function translate(query,from,to,callback){
	if(isPlus()){plus.nativeUI.showWaiting()}
	loadJS(["js/jquery.min.js","js/md5.min.js"],function(){
		const appid="20171109000093780",key="ZR6EGbP8ZzwU7GookTvy",salt=(new Date).getTime()
		if(to=="auto"){
			if(isEnglish(query)){
				to="zh"
			}else{
				to="en"
			}
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
				callback(data)
			},
			complete:function(){
				if(isPlus()){
					plus.nativeUI.closeWaiting()
				}
			}
		})
	})
}
function unsupportedType(){
	showAlert([
		"Unable to open this type of file",
		"无法打开此类文件"
	],[
		"Error",
		"错误"
	])
}
document.addEventListener("keydown",function(e){
	if(isElectron()){
		const win=require("electron").remote.getCurrentWindow()
		if(e.ctrlKey||e.metaKey){
			switch(e.keyCode){
				case 73:
					if(isElectron()){
						win.toggleDevTools()
					}
					break
				case 82:
					win.reload()
					break
				default:break
			}
		}
	}
	if(e.keyCode==27){
		mui.back()
	}
})
if(window.location.href.indexOf("rthsoftware.tk")!=-1&&window.location.href.indexOf("sharedtext")==-1){
	window.location.href="http://rths.tk/"
}
if(language==null){
	if(navigator.language.indexOf("zh")!=-1){
		language="SimplifiedChinese"
		localStorage.setItem("Language","SimplifiedChinese")
	}else{
		language="English"
		localStorage.setItem("Language","English")
	}
}
if(theme==null){
	theme="Automatic"
}
if(theme=="Automatic"){
	const currentHour=(new Date).getHours()
	if(currentHour>=21||currentHour<=6){
		appliedTheme="Dark"
	}else{
		appliedTheme="Light"
	}
}else{
	appliedTheme=theme
}
if(appliedTheme=="Dark"){
	loadCSS("css/dark.css")
}
if(header!=null){
	header.classList.add("title")
	const newA=document.createElement("a"),
	newH1=document.createElement("h1")
	newA.setAttribute("class","mui-action-back mui-icon mui-icon-left-nav mui-pull-left back")
	newH1.setAttribute("class","mui-title")
	header.appendChild(newA)
	header.appendChild(newH1)
	if(isAndroidApp()){
		mui.init({swipeBack:true})
	}else{
		mui.init({swipeBack:false})
	}
	if(!isApp()||isMac()){
		document.getElementsByClassName("mui-content")[0].style.marginTop="20px"
		header.style.height="65px"
		header.style.paddingTop="20px"
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
			if(win.isMaximized()){
				win.unmaximize()
			}else{
				win.maximize()
			}
		}
		newDiv.appendChild(newMaximizeDiv)
		newCloseDiv.style.right="0px"
		newCloseDiv.innerText="×"
		newCloseDiv.onclick=function(){
			window.close()
		}
		newDiv.appendChild(newCloseDiv)
		document.body.appendChild(newDiv)
	}
}
