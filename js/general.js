/*Code written by Shangzhen Yang*/
var appliedTheme,
backend=localStorage.getItem("Backend"),
header=document.getElementsByTagName("header")[0],
isAndroid=/Android/i.test(navigator.userAgent),
isChinese=/[\u4E00-\u9FA5]+/,
isCordova=!!window.cordova,
isEdge=/Edge/i.test(navigator.userAgent),
isElectron=/Electron/i.test(navigator.userAgent),
isEnglish=/[A-Za-z]+/,
isIE=/MSIE|Trident/i.test(navigator.userAgent),
isiOS=/iPhone|iPad/i.test(navigator.userAgent),
isLinux=/Linux/i.test(navigator.userAgent),
isMac=/Macintosh/i.test(navigator.userAgent),
isNumber=/[0-9]+/,
isUpperCase=/[A-Z]+/,
isWindows=/Windows/i.test(navigator.userAgent),
language=localStorage.getItem("Language"),
login={
	"email":localStorage.getItem("Email"),
	"password":localStorage.getItem("Password"),
	"username":localStorage.getItem("Username")
},
recentInput=0,
theme=localStorage.getItem("Theme"),
timeout=10000,
ver="11.0"
var isApp=isCordova||isElectron,
isAndroidApp=isAndroid&&isCordova,
isiOSApp=isCordova&&isiOS,
isMobile=isAndroid||isiOS
function addZero(num,length){
	return (Array(length).join("0")+num).slice(-length)
}
function arrayContains(obj,array){
	for(var i=0;i<array.length;i++){
		if(obj==array[i]){
			return true
		}
	}
	return false
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
function clearLocalStorage(){
	showConfirm([
		"Do you want to clear the local storage?",
		"您想清空本地存储吗？"
	],function(){
		if(localStorage.getItem("Username")&&!login.username){
			login.username=localStorage.getItem("Username")
		}
		localStorage.clear()
		if(login.username){
			localStorage.setItem("Email",login.email)
			localStorage.setItem("Password",login.password)
			localStorage.setItem("Username",login.username)
		}
		restart()
	})
}
function closeMenu(){
	if(document.getElementsByClassName("popup-menu")[0]){
		document.getElementsByClassName("popup-menu")[0].style.opacity="0"
		setTimeout(function(){
			try{
				document.body.removeChild(document.getElementsByClassName("popup-menu")[0])
				document.body.removeChild(document.getElementsByClassName("mask")[0])
			}catch(e){}
		},250)
	}
}
function dateDiff(startDate,endDate){
	var result=parseInt(Math.abs(endDate-startDate)/1000/60/60/24)
	switch(language){
		case "SimplifiedChinese":
		return result+" 天"
		default:
		if(Math.abs(result>1)){
			return result+" days"
		}else{
			return result+" day"
		}
	}
}
function getJSON(url,callback,errorCallback){
	if(!document.getElementsByClassName("loading")[0]){
		var newDiv=document.createElement("div")
		newDiv.classList.add("loading")
		newDiv.innerText="0%"
		document.body.appendChild(newDiv)
	}
	var intervalId=setInterval(function(){
		if(document.getElementsByClassName("loading")[0]){
			var newNum=document.getElementsByClassName("loading")[0].innerText.replace("%","")*1+1
			if(newNum>100){
				clearInterval(intervalId)
				try{
					document.body.removeChild(document.getElementsByClassName("loading")[0])
				}catch(e){}
			}else{
				document.getElementsByClassName("loading")[0].innerText=newNum+"%"
			}
		}
	},timeout/100)
	$.ajax({
		"url":backend+"get.php",
		"data":{
			"time":new Date().getTime(),
			"url":url
		},
		"dataType":"json",
		"timeout":timeout,
		"success":function(e){
			clearInterval(intervalId)
			try{
				document.body.removeChild(document.getElementsByClassName("loading")[0])
			}catch(e){}
			if(callback){
				callback(e)
			}
		},
		"error":function(e){
			clearInterval(intervalId)
			try{
				document.body.removeChild(document.getElementsByClassName("loading")[0])
			}catch(e){}
			if(errorCallback){
				errorCallback(e)
			}
		}
	})
}
function initCalculator(max,calculate){
	switch(language){
		case "SimplifiedChinese":
		document.title="计算器"
		break
		default:
		document.title="Calculator"
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
		}
		if(isAndroid){
			input[i].type="text"
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
			var id=this.id
			recentInput=this.getAttribute("number")
			if(isMobile){
				showPrompt([
					"Enter the number",
					"输入数字"
				],function(e){
					document.getElementById(id).value=e
					document.getElementById(id).oninput()
				},document.getElementById(id).type,document.getElementById(id).value,function(){
					document.getElementById(id).value=0
					document.getElementById(id).oninput()
				})
			}
		}
	}
}
function loadCSS(href){
	var newLink=document.createElement("link")
	newLink.href=href
	newLink.rel="stylesheet"
	document.getElementsByTagName("head")[0].appendChild(newLink)
}
function loginDialog(){
	if(!document.getElementsByClassName("popup")[0]){
		var newDiv=document.createElement("div"),
		newH1=document.createElement("h1"),
		newEmailInput=document.createElement("input"),
		newPasswordInput=document.createElement("input"),
		newConfirmPasswordInput=document.createElement("input"),
		newSignUpButton=document.createElement("button"),
		newLoginButton=document.createElement("button"),
		newDescriptionDiv=document.createElement("div"),
		newCloseDiv=document.createElement("div")
		var signUp=function(){
			if(newH1.innerText==newSignUpButton.innerText){
				submitLogin()
			}else{
				newH1.innerText=newSignUpButton.innerText
				newConfirmPasswordInput.style.display=""
				newSignUpButton.style.width="100%"
				newLoginButton.style.display=
				newDescriptionDiv.style.display="none"
			}
		}
		var submitLogin=function(){
			var email=newEmailInput.value.toLowerCase(),
			password=MD5(newPasswordInput.value)
			newEmailInput.style.borderColor=
			newPasswordInput.style.borderColor=
			newConfirmPasswordInput.style.borderColor=""
			if(!/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/.test(email)){
				newEmailInput.style.borderColor="rgb(255,192,203)"
				newEmailInput.focus()
			}else if(newPasswordInput.value==""){
				newPasswordInput.style.borderColor="rgb(255,192,203)"
				newPasswordInput.focus()
			}else{
				$.ajax({
					"url":backend+"userdata/verify.php",
					"data":{
						"email":email,
						"password":password,
						"time":new Date().getTime()
					},
					"dataType":"json",
					"timeout":timeout,
					"success":function(e){
						if(e.index){
							if(e.pass){
								showAlert([
									"Log in successfully",
									"已成功登录"
								],function(){
									localStorage.setItem("Email",email)
									localStorage.setItem("Password",password)
									localStorage.setItem("Username",e.username)
									location.reload()
								})
							}else if(email!="admin"){
								showConfirm([
									"Incorrect password. Do you want to reset the password?",
									"密码错误。您想重置密码吗？"
								],function(){
									newPasswordInput.value=""
									newConfirmPasswordInput.value=""
									var newPassword=(new Date().getTime()*(Math.round(Math.random()*99)+1)).toString(36)
									$.post(backend+"reset.php",{
										"index":e.index,
										"password":newPassword,
										"passwordmd5":MD5(newPassword)
									},function(){
										showAlert([
											"We will send your new password to your email",
											"我们会将您的新密码发送到您的邮箱"
										])
									})
								},function(){
									newPasswordInput.value=""
									newConfirmPasswordInput.value=""
								})
							}
						}else{
							if(newH1.innerText==newSignUpButton.innerText){
								if(newConfirmPasswordInput.value!=newPasswordInput.value){
									newConfirmPasswordInput.style.borderColor="rgb(255,192,203)"
									newConfirmPasswordInput.focus()
								}else{
									var username=email.split("@")[0]+new Date().getTime().toString(36)
									$.post(backend+"userdata/signup.php",{
										"email":email,
										"password":password,
										"username":username
									},function(){
										showAlert([
											"Log in successfully",
											"已成功登录"
										],function(){
											localStorage.setItem("Email",email)
											localStorage.setItem("Password",password)
											localStorage.setItem("Username",username)
											location.reload()
										})
									})
								}
							}else{
								showAlert([
									"This user does not exist",
									"此用户不存在"
								],signUp)
							}
						}
					},
					"error":function(){
						showAlert([
							"Unable to connect to the server",
							"无法连接服务器"
						])
					}
				})
			}
		}
		newDiv.classList.add("popup")
		newEmailInput.name="email"
		newEmailInput.type="email"
		newEmailInput.onkeydown=function(e){
			if(e.keyCode==13&&this.value){
				newPasswordInput.focus()
			}
		}
		newPasswordInput.name="password"
		newPasswordInput.type="password"
		newPasswordInput.onkeydown=function(e){
			if(e.keyCode==13&&this.value){
				if(newConfirmPasswordInput.style.display=="none"){
					submitLogin()
				}else{
					newConfirmPasswordInput.focus()
				}
			}
		}
		newConfirmPasswordInput.type="password"
		newConfirmPasswordInput.style.display="none"
		newConfirmPasswordInput.onkeydown=function(e){
			if(e.keyCode==13&&this.value){
				submitLogin()
			}
		}
		newSignUpButton.onclick=signUp
		newLoginButton.onclick=submitLogin
		newDescriptionDiv.classList.add("description")
		newCloseDiv.classList.add("close")
		newCloseDiv.innerText="×"
		newCloseDiv.onclick=function(){
			if(newH1.innerText==newLoginButton.innerText){
				newDiv.style.opacity=""
				setTimeout(function(){
					try{
						document.body.removeChild(newDiv)
					}catch(e){}
				},250)
			}else{
				newH1.innerText=newLoginButton.innerText
				newConfirmPasswordInput.style.display="none"
				newSignUpButton.style.width=
				newLoginButton.style.display=
				newDescriptionDiv.style.display=""
			}
		}
		switch(language){
			case "SimplifiedChinese":
			newH1.innerText="登录"
			newEmailInput.placeholder="电子邮箱"
			newPasswordInput.placeholder="密码"
			newConfirmPasswordInput.placeholder="确认密码"
			newSignUpButton.innerText="注册"
			newLoginButton.innerText="登录"
			newDescriptionDiv.innerText="登录后，您可以在 https://t.rths.tk/ 查看您保存的单词表和文本文档。"
			break
			default:
			newH1.innerText="Login"
			newEmailInput.placeholder="Email"
			newPasswordInput.placeholder="Password"
			newConfirmPasswordInput.placeholder="Confirm Password"
			newSignUpButton.innerText="Sign Up"
			newLoginButton.innerText="Login"
			newDescriptionDiv.innerText="After logging in, you can view your saved word lists and text documents at https://t.rths.tk/."
		}
		newDiv.appendChild(newH1)
		newDiv.appendChild(newEmailInput)
		newDiv.appendChild(newPasswordInput)
		newDiv.appendChild(newConfirmPasswordInput)
		newDiv.appendChild(newSignUpButton)
		newDiv.appendChild(newLoginButton)
		newDiv.appendChild(newDescriptionDiv)
		newDiv.appendChild(newCloseDiv)
		document.body.appendChild(newDiv)
		newDiv.style.top="calc(50% - "+(newDiv.offsetHeight/2)+"px)"
		setTimeout(function(){
			newDiv.style.opacity="1"
		},25)
	}
}
function logOut(){
	localStorage.removeItem("Email")
	localStorage.removeItem("Password")
	localStorage.removeItem("Username")
	localStorage.removeItem("DateCountdown")
	localStorage.removeItem("Names")
	localStorage.removeItem("SavedText")
	localStorage.removeItem("SavedWordList")
	restart()
}
function openDialog(){
	document.getElementsByClassName("open-file")[0].value=""
	document.getElementsByClassName("open-file")[0].click()
}
function openWebPage(href){
	href=encodeURI(href)
	if(isElectron){
		require("electron").shell.openExternal(href)
	}else if(isiOSApp){
		OpenUrlExt.open(href)
	}else{
		open(href)
	}
}
function openWindow(name){
	if(name.indexOf("?")!=-1){
		location.href=name
	}else{
		location.href=name+".html"
	}
}
function restart(){
	showAlert([
		"RTH Toolbox needs to be restarted",
		"需要重新启动 RTH 工具箱"
	],function(){
		if(isAndroidApp||isElectron){
			mui.back()
		}else{
			openWindow("index")
		}
	})
}
function searchURL(key,url){
	if(!url){
		url=location.search
	}
	if(url.indexOf("http")!=-1){
		var urlSplit=url.split("?")
		url=url.replace(urlSplit[0],"")
	}
	var match=url.substr(1).match(new RegExp("(^|&)"+key+"=([^&]*)(&|$)"))
	if(match){
		return unescape(decodeURI(match[2]))
	}
}
function showAlert(text,callback){
	switch(language){
		case "SimplifiedChinese":
		alert(text[1])
		break
		default:
		alert(text[0])
	}
	if(callback){
		callback()
	}
}
function showConfirm(text,positiveCallback,negativeCallback){
	var value
	switch(language){
		case "SimplifiedChinese":
		value=confirm(text[1])
		break
		default:
		value=confirm(text[0])
	}
	if(value){
		if(positiveCallback){
			positiveCallback()
		}
	}else if(negativeCallback){
		negativeCallback()
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
	newDiv.classList.add("image")
	newTitleDiv.classList.add("image-title")
	newContentDiv.classList.add("image-content")
	newLoadDiv.classList.add("image-load")
	newImg.onload=function(){
		newContentDiv.removeChild(newLoadDiv)
		var frameHeight=this.height+80
		newDiv.style.height=frameHeight+"px"
		newDiv.style.top="calc(50% - "+frameHeight/2+"px)"
		setTimeout(function(){
			newImg.style.opacity="1"
		},250)
	}
	newButtonDiv.classList.add("image-button")
	newCloseDiv.onclick=function(){
		newDiv.style.opacity="0"
		setTimeout(function(){
			try{
				document.body.removeChild(newDiv)
			}catch(e){}
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
function showMenu(e,menu){
	var addedMenuDiv=document.getElementsByClassName("popup-menu")[0]
	if(addedMenuDiv){
		document.body.removeChild(addedMenuDiv)
	}
	var newDiv=document.createElement("div"),
	newMask=document.createElement("div")
	newDiv.classList.add("popup-menu")
	newMask.classList.add("mask")
	newDiv.oncontextmenu=
	newMask.oncontextmenu=function(){
		return false
	}
	newMask.onclick=closeMenu
	for(var i=0;i<menu.length;i++){
		var newSpan=document.createElement("span")
		switch(language){
			case "SimplifiedChinese":
			newSpan.innerText=menu[i].text[1]
			break
			default:
			newSpan.innerText=menu[i].text[0]
		}
		newSpan.onclick=menu[i].onclick
		newDiv.appendChild(newSpan)
	}
	document.body.appendChild(newMask)
	document.body.appendChild(newDiv)
	newDiv.style.left=(e.x-newDiv.offsetWidth/2)+"px"
	newDiv.style.top=(e.y-newDiv.offsetHeight)+"px"
	setTimeout(function(){
		newDiv.style.opacity="1"
	},25)
}
function showPrompt(text,callback,type,defaultText,emptyCallback,closeFunc,onInput){
	var newDiv=document.createElement("div"),
	newInput=document.createElement("input"),
	newCancelButton=document.createElement("button"),
	newOKButton=document.createElement("button")
	newDiv.classList.add("popup")
	newDiv.classList.add("prompt")
	if(type){
		newInput.type=type
	}else{
		newInput.type="text"
	}
	if(defaultText){
		newInput.value=defaultText
	}
	if(onInput){
		newInput.oninput=function(e){
			onInput(newInput.value)
		}
	}
	newInput.onkeydown=function(e){
		switch(e.keyCode){
			case 13:
			newOKButton.click()
			break
			case 27:
			newCancelButton.click()
		}
	}
	newCancelButton.onclick=function(){
		if(closeFunc){
			closeFunc()
		}
		newDiv.style.opacity=""
		setTimeout(function(){
			try{
				document.body.removeChild(newDiv)
			}catch(e){}
		},250)
	}
	newOKButton.onclick=function(){
		if(newInput.value){
			if(callback){
				callback(newInput.value)
			}
		}else{
			if(emptyCallback){
				emptyCallback()
			}
		}
		setTimeout(function(){
			newDiv.style.opacity=""
			setTimeout(function(){
				try{
					document.body.removeChild(newDiv)
				}catch(e){}
			},250)
		},25)
	}
	switch(language){
		case "SimplifiedChinese":
		if(text){
			newInput.placeholder=text[1]
		}
		newCancelButton.innerText="取消"
		newOKButton.innerText="确定"
		break
		default:
		if(text){
			newInput.placeholder=text[0]
		}
		newCancelButton.innerText="Cancel"
		newOKButton.innerText="OK"
	}
	newDiv.appendChild(newInput)
	newDiv.appendChild(newCancelButton)
	newDiv.appendChild(newOKButton)
	document.body.appendChild(newDiv)
	newInput.focus()
	setTimeout(function(){
		newDiv.style.opacity="1"
	},25)
}
function showToast(text){
	switch(language){
		case "SimplifiedChinese":
		mui.toast(text[1])
		break
		default:
		mui.toast(text[0])
	}
}
function translate(query,from,to,callback){
	var appid="20171109000093780",
	key="ZR6EGbP8ZzwU7GookTvy",
	salt=new Date().getTime()
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
		"url":"https://api.fanyi.baidu.com/api/trans/vip/translate",
		"type":"get",
		"dataType":"jsonp",
		"data":{
			"q":query,
			"appid":appid,
			"salt":salt,
			"from":from,
			"to":to,
			"sign":sign
		},
		"success":function(data){
			if(data.trans_result&&callback){
				callback(data.trans_result[0].dst)
			}
		}
	})
}
if(location.href.indexOf("https")!=-1&&!login.username){
	if(navigator.language=="zh-CN"){
		if(location.href.indexOf("www.rthsoftware.cn")==-1){
			location.href=location.href.replace("t.rths.tk","www.rthsoftware.cn/toolbox")
		}
	}else if(location.href.indexOf("t.rths.tk")==-1){
		location.href=location.href.replace("www.rthsoftware.cn/toolbox","t.rths.tk")
	}
}
if(!backend){
	if(navigator.language=="zh-CN"){
		backend="https://www.rthsoftware.cn/backend/"
	}else{
		backend="https://rthapi.tk/"
	}
	localStorage.setItem("Backend",backend)
}
if(!isIE){
	window.onerror=function(msg,url,lineNo){
		window.onerror=null
		if(msg!="Script error."){
			var message=msg+" at "+url+" : "+lineNo
			showConfirm([
				"An error occurs. Do you want to submit the error report?\n"+message,
				"发生错误。您想提交错误报告吗？\n"+message
			],function(){
				$.get(backend+"feedback.php",{
					"email":login.email,
					"lang":language,
					"name":login.username,
					"text":message,
					"ver":ver
				},function(){
					showAlert([
						"Thank you for submitting an error report",
						"感谢您提交错误报告"
					],clearLocalStorage)
				})
			},clearLocalStorage)
		}
	}
}
if(!language){
	if(navigator.language.indexOf("zh")!=-1){
		language="SimplifiedChinese"
	}else{
		language="English"
	}
	localStorage.setItem("Language",language)
}
if(!theme){
	theme="Automatic"
}
if(theme=="Automatic"){
	var currentHour=new Date().getHours()
	if(currentHour>=21||currentHour<=6){
		appliedTheme="Dark"
	}else{
		appliedTheme="Light"
	}
}else{
	appliedTheme=theme
}
if(appliedTheme=="Bing"){
	loadCSS("css/dark.css")
}
if(appliedTheme!="Light"){
	loadCSS("css/"+appliedTheme.toLowerCase()+".css")
}
if(header){
	var newDiv=document.createElement("div"),
	newA=document.createElement("a"),
	newH1=document.createElement("h1")
	newDiv.classList.add("title-bg")
	newA.classList.add("mui-icon")
	newA.classList.add("mui-icon-left-nav")
	newA.classList.add("mui-pull-left")
	newA.classList.add("back")
	if(window.history.length<=1){
		newA.onclick=function(){
			openWindow("index")
		}
	}else if(isIE){
		newA.onclick=function(){
			history.go(-1)
		}
	}else{
		newA.onclick=mui.back
	}
	newH1.classList.add("mui-title")
	newDiv.appendChild(newA)
	newDiv.appendChild(newH1)
	header.appendChild(newDiv)
	if(!isApp||isMac){
		document.getElementsByClassName("mui-content")[0].style.marginTop="40px"
		header.style.height="65px"
		newDiv.style.paddingTop="20px"
	}
}
if(appliedTheme=="Bing"){
	var savedBingWallpaper
	var loadWallpaper=function(){
		if(header){
			header.style.backgroundImage=savedBingWallpaper
		}else if(document.getElementsByClassName("bg-img")[0]){
			document.getElementsByClassName("bg-img")[0].style.backgroundImage=savedBingWallpaper
		}
		var blueButtons=document.getElementsByClassName("btn-bg-img")
		for(var i=0;i<blueButtons.length;i++){
			blueButtons[i].style.backgroundImage=savedBingWallpaper
		}
	}
	savedBingWallpaper=localStorage.getItem("bing-wallpaper")
	if(savedBingWallpaper){
		loadWallpaper()
	}
	$.ajax({
		"url":backend+"bing/base64.php",
		"success":function(e){
			savedBingWallpaper="url("+e+")"
			localStorage.setItem("bing-wallpaper",savedBingWallpaper)
			loadWallpaper()
		}
	})
}else if(theme!="Bing"&&location.href.indexOf("https")==-1){
	localStorage.removeItem("bing-wallpaper")
}
if(isElectron){
	var electron=require("electron")
	var remote=electron.remote
	document.addEventListener("keydown",function(e){
		var win=remote.getCurrentWindow()
		if(e.ctrlKey||e.metaKey){
			switch(e.keyCode){
				case 73:
				win.toggleDevTools()
				break
				case 82:
				win.reload()
			}
		}
	})
	electron.webFrame.setZoomLevelLimits(1,1)
	if(process.platform!=="darwin"){
		var newDiv=document.createElement("div"),
		newMinimizeDiv=document.createElement("div")
		newMaximizeDiv=document.createElement("div")
		newCloseDiv=document.createElement("div")
		newDiv.classList.add("win")
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
if(login.username){
	$.ajax({
		"url":backend+"userdata/verify.php",
		"data":{
			"email":login.email,
			"password":login.password,
			"time":new Date().getTime()
		},
		"dataType":"json",
		"timeout":timeout,
		"success":function(e){
			if(!e.pass){
				showAlert([
					"Incorrect password",
					"密码错误"
				],logOut)
			}
		},
		"error":function(){
			login.username=null
		}
	})
}else if(!header&&!searchURL("action")){
	loginDialog()
}
