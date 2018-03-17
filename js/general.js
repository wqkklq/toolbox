/*Code written by Shangzhen Yang*/
var addedScript="",
addedStyle="",
appliedTheme,
header=document.getElementsByTagName("header")[0],
isAndroid=/Android/i.test(navigator.userAgent),
isChinese=new RegExp("[\u4E00-\u9FA5]+"),
isEdge=/Edge/i.test(navigator.userAgent),
isElectron=/Electron/i.test(navigator.userAgent),
isEnglish=new RegExp("[A-Za-z]+"),
isIE=/MSIE|Trident/i.test(navigator.userAgent),
isiOS=/iPhone/i.test(navigator.userAgent)||/iPad/i.test(navigator.userAgent),
isLinux=/Linux/i.test(navigator.userAgent),
isMac=/Macintosh/i.test(navigator.userAgent),
isNumber=new RegExp("[0-9]+"),
isOnline=/t.rths.tk/.test(window.location.href),
isPlus=/Html5Plus/i.test(navigator.userAgent),
isUpperCase=new RegExp("[A-Z]+"),
isUWP=/MSAppHost/i.test(navigator.userAgent),
isWindows=/Windows/i.test(navigator.userAgent),
isWin10=/Windows\sNT\s10\.0/i.test(navigator.userAgent),
language=localStorage.getItem("Language"),
recentInput=0,
theme=localStorage.getItem("Theme")
var isApp=isElectron||isPlus||isUWP,
isAndroidApp=isAndroid&&isPlus,
isMobile=isAndroid||isiOS
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
function calc(code){
	var abs=Math.abs,
	arccos=Math.acos,
	arccosh=Math.acosh,
	arccot=function(x){
		return Math.atan(1/x)
	},
	arccsc=function(x){
		return Math.asin(1/x)
	},
	arcsec=function(x){
		return Math.acos(1/x)
	},
	arcsin=Math.asin,
	arcsinh=Math.asinh,
	arctan=Math.atan,
	arctanh=Math.atanh,
	cbrt=Math.cbrt,
	ceil=Math.ceil,
	cos=Math.cos,
	cosh=Math.cosh,
	cot=function(x){
		return 1/Math.tan(x)
	},
	csc=function(x){
		return 1/Math.sin(x)
	},
	e=Math.E,
	exp=Math.exp,
	floor=Math.floor,
	ln=Math.log,
	log10=Math.log10,
	log2=Math.log2,
	pi=Math.PI,
	pow=Math.pow,
	random=Math.random,
	round=Math.round,
	sec=function(x){
		return 1/Math.cos(x)
	},
	sin=Math.sin,
	sinh=Math.sinh,
	sqrt=Math.sqrt,
	tan=Math.tan,
	tanh=Math.tanh,
	trunc=Math.trunc,
	x=Math.random(),
	y=Math.random(),
	z=Math.random()
	var calcResult=eval(code),
	falseCount=0,
	trueCount=0
	if(calcResult==false||calcResult==true){
		if(/==|<|>/.test(code)&&/x|y|z/.test(code)&&!/for|if|while/.test(code)){
			for(var i=0;i<10;i++){
				x=Math.random()
				y=Math.random()
				z=Math.random()
				if(eval(code)){
					trueCount+=1
				}else{
					falseCount+=1
				}
			}
			if(trueCount>falseCount){
				calcResult=true
			}else if(trueCount<falseCount){
				calcResult=false
			}
		}
	}
	return calcResult
}
function getToolbox(){
	if(isAndroid){
		if(navigator.language=="zh-CN"){
			openWebPage("https://www.coolapk.com/apk/163867")
		}else{
			openWebPage("https://play.google.com/store/apps/details?id=shangzhenyang.rthtoolbox")
		}
	}else if(isiOS){
		window.location.href="https://itunes.apple.com/app/rth-toolbox/id1294479577"
	}else if(isWin10){
		openWebPage("https://www.microsoft.com/store/apps/9PBT29R7W8DJ")
	}else if(isWindows){
		window.location.href="https://github.com/rthsoftware/rth-toolbox/releases/download/2018022501/RTHToolbox_Windows_2.zip"
	}else if(isMac){
		window.location.href="https://github.com/rthsoftware/rth-toolbox/releases/download/2018022501/RTHToolbox_macOS.zip"
	}else if(isLinux){
		window.location.href="https://github.com/rthsoftware/rth-toolbox/releases/download/2018022501/RTHToolbox_Linux.zip"
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
	var input=document.getElementsByTagName("input")
	for(var i=0;i<=max;i++){
		switch(language){
			case "SimplifiedChinese":
				input[i].placeholder="输入数字"
				break
			default:
				input[i].placeholder="Enter the number"
				break
		}
		input[i].oninput=function(){
			var name=this.id.replace("Input","")
			var num=name.replace(/[A-Za-z]+/g,"")
			var display=name.replace(num,"")+"<sub>"+num+"</sub>",
			label=document.getElementById(name+"Label")
			if(this.value==""){
				label.innerHTML=display
			}else{
				label.innerHTML=this.value
			}
			calculate()
		}
		input[i].setAttribute("number",i)
		input[i].onclick=function(){
			recentInput=this.getAttribute("number")
		}
	}
	document.getElementsByClassName("sign")[0].onclick=function(){
		var value=input[recentInput].value
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
		var label=document.getElementById(input[recentInput].id.replace("Input","")+"Label")
		label.innerHTML=input[recentInput].value
		calculate()
	}
}
function loadCSS(href){
	if(addedStyle.indexOf(href)==-1){
		var newLink=document.createElement("link")
		newLink.href=href
		newLink.rel="stylesheet"
		document.getElementsByTagName("head")[0].appendChild(newLink)
		addedStyle+=href+","
	}
}
function loadJS(src,callback){
	var loadScript=function(i){
		if(addedScript.indexOf(src[i])==-1){
			var newScript=document.createElement("script")
			newScript.src=src[i]
			if(i<src.length-1){
				newScript.setAttribute("number",i*1+1)
				newScript.onload=function(){
					loadScript(this.getAttribute("number"))
				}
			}else if(callback){
				newScript.onload=callback
			}
			document.body.appendChild(newScript)
			addedScript+=src[i]+","
		}else{
			if(i<src.length-1){
				loadScript(i*1+1)
			}else if(callback){
				callback()
			}
		}
	}
	loadScript(0)
}
function loadOnline(){
	openWindow("http://t.rths.tk/index")
}
function openDialog(){
	document.getElementsByClassName("open-file")[0].value=""
	document.getElementsByClassName("open-file")[0].click()
}
function openWebPage(href){
	href=encodeURI(href)
	if(/t.rths.tk|rthsoftware.tk/.test(href)&&href.indexOf("jpg")==-1){
		href=addTime(href)
	}
	if(href.length<=2048){
		if(isPlus){
			plus.runtime.openURL(href)
		}else if(isElectron){
			require("electron").shell.openExternal(href)
		}else if(isUWP){
			Windows.System.Launcher.launchUriAsync(new Windows.Foundation.Uri(href))
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
	var suffix=".html"
	if(name.indexOf(suffix)!=-1||isOnline){
		suffix=""
	}
	var url=name+suffix
	if(isPlus){
		if(isOnline){
			url=addTime(url)
		}
		plus.webview.open(url,name,{"popGesture":"close"},"fade-in")
	}else{
		window.location.href=url
	}
}
function request(url,callback){
	if(/t.rths.tk/.test(url)){
		url=addTime(url)
	}
	var xhr=new XMLHttpRequest()
	xhr.onreadystatechange=function(){
		switch(xhr.readyState){
			case 4:
				if(xhr.status==200&&callback){
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
	if(isPlus){
		if(isOnline){
			loadOnline()
		}else{
			plus.runtime.restart()
		}
	}else if(isUWP){
		mui.back()
	}else{
		openWindow("index")
	}
}
function searchURL(key,url){
	if(url.indexOf("http")!=-1){
		var urlSplit=url.split("?")
		url=url.replace(urlSplit[0],"")
	}
	var match=url.substr(1).match(new RegExp("(^|&)"+key+"=([^&]*)(&|$)"))
	if(match!=null){
		var value=unescape(decodeURI(match[2]))
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
	if(isMobile||isUWP){
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
	}else{
		switch(language){
			case "SimplifiedChinese":
				alert(text[1])
				break
			default:
				alert(text[0])
				break
		}
		if(callback){
			callback()
		}
	}
}
function showConfirm(text,title,positiveCallback,negativeCallback){
	if(isMobile||isUWP){
		if(title==null){
			title=[document.title,document.title]
		}
		switch(language){
			case "SimplifiedChinese":
				mui.confirm(text[1],title[1],["否","是"],function(e){
					if(e.index==1){
						if(positiveCallback){
							positiveCallback()
						}
					}else if(negativeCallback){
						negativeCallback()
					}
				})
				break
			default:
				mui.confirm(text[0],title[0],["No","Yes"],function(e){
					if(e.index==1){
						if(positiveCallback){
							positiveCallback()
						}
					}else if(negativeCallback){
						negativeCallback()
					}
				})
				break
		}
	}else{
		var value
		switch(language){
			case "SimplifiedChinese":
				value=confirm(text[1])
				break
			default:
				value=confirm(text[0])
				break
		}
		if(value){
			if(positiveCallback){
				positiveCallback()
			}
		}else if(negativeCallback){
			negativeCallback()
		}
	}
}
function showImage(src){
	var addedImageDiv=document.getElementsByClassName("image")[0]
	if(addedImageDiv){
		document.body.removeChild(addedImageDiv)
	}
	var newDiv=document.createElement("div"),
	newTitleDiv=document.createElement("div"),
	newContentDiv=document.createElement("div"),
	newLoadDiv=document.createElement("div"),
	newImg=document.createElement("img"),
	newButtonDiv=document.createElement("div"),
	newCloseDiv=document.createElement("div"),
	newSaveDiv=document.createElement("div")
	newDiv.setAttribute("class","image")
	newTitleDiv.setAttribute("class","image-title")
	newContentDiv.setAttribute("class","image-content")
	newLoadDiv.setAttribute("class","image-load")
	newImg.onload=function(){
		newContentDiv.removeChild(newLoadDiv)
		var frameHeight=this.height+80
		newDiv.style.height=frameHeight+"px"
		newDiv.style.top="calc(50% - "+frameHeight/2+"px)"
		setTimeout(function(){
			newImg.style.opacity="1"
		},250)
	}
	newButtonDiv.setAttribute("class","image-button")
	newCloseDiv.onclick=function(){
		newDiv.style.opacity="0"
		setTimeout(function(){
			document.body.removeChild(newDiv)
		},250)
	}
	newSaveDiv.onclick=function(){
		openWebPage(src)
	}
	switch(language){
		case "SimplifiedChinese":
			newTitleDiv.innerText="图片查看"
			newLoadDiv.innerText="正在加载"
			newCloseDiv.innerText="关闭"
			newSaveDiv.innerText="保存"
			break
		default:
			newTitleDiv.innerText="Image View"
			newLoadDiv.innerText="Loading"
			newCloseDiv.innerText="Close"
			newSaveDiv.innerText="Save"
			break
	}
	newDiv.appendChild(newTitleDiv)
	newContentDiv.appendChild(newLoadDiv)
	newContentDiv.appendChild(newImg)
	newDiv.appendChild(newContentDiv)
	newButtonDiv.appendChild(newCloseDiv)
	newButtonDiv.appendChild(newSaveDiv)
	newDiv.appendChild(newButtonDiv)
	document.body.appendChild(newDiv)
	newImg.src=src
	setTimeout(function(){
		newDiv.style.opacity="1"
	},25)
}
function showPrompt(text,title,callback){
	if(isApp){
		switch(language){
			case "SimplifiedChinese":
				mui.prompt(text[1],"",title[1],null,function(e){
					if(e.index==1&&e.value!=""&&callback){
						callback(e.value)
					}
				})
				break
			default:
				mui.prompt(text[0],"",title[0],["Cancel","OK"],function(e){
					if(e.index==1&&e.value!=""&&callback){
						callback(e.value)
					}
				})
				break
		}
	}else{
		var value
		switch(language){
			case "SimplifiedChinese":
				value=prompt(text[1],"")
				break
			default:
				value=prompt(text[0],"")
				break
		}
		if(value!=null&&value!=""&&callback){
			callback(value)
		}
	}
}
function translate(query,from,to,callback){
	loadJS(["js/jquery.min.js","js/md5.min.js"],function(){
		var appid="20171109000093780",key="ZR6EGbP8ZzwU7GookTvy",salt=(new Date).getTime()
		if(to=="auto"){
			if(isEnglish.test(query)){
				to="zh"
			}else{
				to="en"
			}
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
			success:function(data){
				if(callback){
					callback(data)
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
	if(isElectron){
		var win=require("electron").remote.getCurrentWindow()
		if(e.ctrlKey||e.metaKey){
			switch(e.keyCode){
				case 73:
					if(isElectron){
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
	var currentHour=(new Date).getHours()
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
	var newA=document.createElement("a"),
	newH1=document.createElement("h1")
	newA.setAttribute("class","mui-action-back mui-icon mui-icon-left-nav mui-pull-left back")
	if(isIE){
		newA.onclick=function(){
			history.go(-1)
		}
	}
	newH1.setAttribute("class","mui-title")
	header.appendChild(newA)
	header.appendChild(newH1)
	if(isAndroidApp){
		mui.init({swipeBack:true})
	}else{
		mui.init({swipeBack:false})
	}
	if(!isApp||isMac||isUWP){
		document.getElementsByClassName("mui-content")[0].style.marginTop="40px"
		header.style.height="65px"
		header.style.paddingTop="20px"
	}
}
if(isElectron){
	var electron=require("electron")
	var remote=electron.remote
	electron.webFrame.setZoomLevelLimits(1,1)
	if(process.platform!=="darwin"){
		var newDiv=document.createElement("div"),
		newMinimizeDiv=document.createElement("div")
		newMaximizeDiv=document.createElement("div")
		newCloseDiv=document.createElement("div")
		newDiv.setAttribute("class","win")
		newMinimizeDiv.style.right="80px"
		newMinimizeDiv.innerText="-"
		newMinimizeDiv.onclick=function(){
			remote.getCurrentWindow().minimize()
		}
		newDiv.appendChild(newMinimizeDiv)
		newMaximizeDiv.style.right="40px"
		newMaximizeDiv.innerText="+"
		newMaximizeDiv.onclick=function(){
			var win=remote.getCurrentWindow()
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
