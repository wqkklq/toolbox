/*Code written by Shangzhen Yang*/
var appliedTheme,
header=document.getElementsByTagName("header")[0],
isAndroid=/Android/i.test(navigator.userAgent),
isChinese=/[\u4E00-\u9FA5]+/,
isCordova=!!window.cordova,
isEdge=/Edge/i.test(navigator.userAgent),
isElectron=/Electron/i.test(navigator.userAgent),
isEnglish=/[A-Za-z]+/,
isIE=/MSIE|Trident/i.test(navigator.userAgent),
isiOS=/iPhone/i.test(navigator.userAgent)||/iPad/i.test(navigator.userAgent),
isLinux=/Linux/i.test(navigator.userAgent),
isMac=/Macintosh/i.test(navigator.userAgent),
isNumber=/[0-9]+/,
isUpperCase=/[A-Z]+/,
isUWP=/MSAppHost/i.test(navigator.userAgent),
isWindows=/Windows/i.test(navigator.userAgent),
isWin10=/Windows\sNT\s10\.0/i.test(navigator.userAgent),
language=localStorage.getItem("Language"),
login={
	"email":localStorage.getItem("Email"),
	"password":localStorage.getItem("Password"),
	"username":localStorage.getItem("Username")
},
recentInput=0,
theme=localStorage.getItem("Theme"),
userInfo,
ver="9.0"
var isApp=isCordova||isElectron||isUWP,
isAndroidApp=isAndroid&&isCordova,
isiOSApp=isCordova&&isiOS,
isMobile=isAndroid||isiOS
function addTime(url){
	if(url.indexOf("?")!=-1){
		url+="&time="+new Date().getTime()
	}else{
		url+="?time="+new Date().getTime()
	}
	return url
}
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
function closeMenu(){
	document.getElementsByClassName("popup-menu")[0].style.opacity="0"
	setTimeout(function(){
		document.body.removeChild(document.getElementsByClassName("popup-menu")[0])
	},250)
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
			if(userInfo&&userInfo.users){
				var email=newEmailInput.value.toLowerCase(),
				password=MD5(newPasswordInput.value),
				match=false
				var verifyResult=verifyPassword(email,password)
				if(verifyResult.index){
					match=true
					if(verifyResult.pass){
						showAlert([
							"Log in successfully",
							"已成功登录"
						],function(){
							localStorage.setItem("Email",userInfo.users[verifyResult.index-1].email)
							localStorage.setItem("Password",userInfo.users[verifyResult.index-1].password)
							localStorage.setItem("Username",userInfo.users[verifyResult.index-1].username)
							location.reload()
						})
					}else if(email!="admin"){
						showConfirm([
							"Incorrect password. Do you want to reset the password?",
							"密码错误。您想要重置密码吗？"
						],function(){
							newPasswordInput.value=""
							newConfirmPasswordInput.value=""
							switch(language){
								case "SimplifiedChinese":
								mui.toast("正在重置")
								break
								default:
								mui.toast("Resetting")
								break
							}
							var newPassword=(new Date().getTime()*(Math.round(Math.random()*99)+1)).toString(36)
							userInfo.users[verifyResult.index-1].password=MD5(newPassword)
							$.post("https://rthsoftware.azurewebsites.net/userdata/upload.php",{
								"dir":"",
								"filename":"users",
								"text":JSON.stringify(userInfo)
							},function(){
								$.post("https://rthsoftware.azurewebsites.net/reset.php",{
									"email":userInfo.users[verifyResult.index-1].email,
									"password":newPassword
								},function(){
									showAlert([
										"We will send your new password to your email",
										"我们会将您的新密码发送到您的邮箱"
									])
								})
							})
						},function(){
							newPasswordInput.value=""
							newConfirmPasswordInput.value=""
						})
					}
				}
				if(newH1.innerText==newSignUpButton.innerText&&!match){
					newEmailInput.style.borderColor=""
					newPasswordInput.style.borderColor=""
					newConfirmPasswordInput.style.borderColor=""
					if(!/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/.test(newEmailInput.value)){
						newEmailInput.style.borderColor="rgb(255,192,203)"
						newEmailInput.focus()
					}else if(newPasswordInput.value==""){
						newPasswordInput.style.borderColor="rgb(255,192,203)"
						newPasswordInput.focus()
					}else if(newConfirmPasswordInput.value!=newPasswordInput.value){
						newConfirmPasswordInput.style.borderColor="rgb(255,192,203)"
						newConfirmPasswordInput.focus()
					}else{
						userInfo.users.push({
							"email":email,
							"password":password,
							"username":email.split("@")[0]+new Date().getTime().toString(36)
						})
						switch(language){
							case "SimplifiedChinese":
							mui.toast("正在注册")
							break
							default:
							mui.toast("Signing up")
							break
						}
						$.post("https://rthsoftware.azurewebsites.net/userdata/upload.php",{
							"dir":"",
							"filename":"users",
							"text":JSON.stringify(userInfo)
						},function(){
							location.reload()
						})
					}
				}else{
					if(!match){
						showAlert([
							"This user does not exist",
							"此用户不存在"
						],signUp)
					}
				}
			}else{
				showAlert([
					"Unable to connect to the server",
					"无法连接服务器"
				])
			}
		}
		newDiv.setAttribute("class","popup")
		newEmailInput.type="email"
		newEmailInput.onkeydown=function(e){
			if(e.keyCode==13){
				newPasswordInput.focus()
			}
		}
		newPasswordInput.type="password"
		newPasswordInput.onkeydown=function(e){
			if(e.keyCode==13){
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
			if(e.keyCode==13){
				submitLogin()
			}
		}
		newSignUpButton.onclick=signUp
		newLoginButton.onclick=submitLogin
		newDescriptionDiv.setAttribute("class","description")
		newCloseDiv.setAttribute("class","close")
		newCloseDiv.innerText="×"
		newCloseDiv.onclick=function(){
			if(newH1.innerText==newLoginButton.innerText){
				newDiv.style.bottom=""
				setTimeout(function(){
					document.body.removeChild(newDiv)
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
			break
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
		setTimeout(function(){
			newDiv.style.bottom="0px"
		},25)
	}
}
function openDialog(){
	document.getElementsByClassName("open-file")[0].value=""
	document.getElementsByClassName("open-file")[0].click()
}
function openWebPage(href){
	href=encodeURI(href)
	if(/t.rths.tk/.test(href)&&href.indexOf("jpg")==-1){
		href=addTime(href)
	}
	if(isElectron){
		require("electron").shell.openExternal(href)
	}else if(isiOSApp){
		OpenUrlExt.open(href)
	}else if(isUWP){
		Windows.System.Launcher.launchUriAsync(new Windows.Foundation.Uri(href))
	}else{
		window.open(href)
	}
}
function openWindow(name){
	var suffix=".html"
	if(name.indexOf(suffix)!=-1||/t.rths.tk/.test(location.href)){
		suffix=""
	}
	var url=name+suffix
	location.href=url
}
function request(url,callback,errCallback){
	if(/t.rths.tk|rthsoftware.azurewebsites.net/.test(url)){
		url=addTime(url)
	}
	var xhr=new XMLHttpRequest()
	xhr.onreadystatechange=function(){
		switch(xhr.readyState){
			case 4:
			if(xhr.status==200&&callback){
				callback(xhr.responseText)
			}else if(errCallback){
				errCallback()
			}
			break
			default:break
		}
	}
	xhr.open("GET",url)
	xhr.send()
}
function restart(){
	showAlert([
		"RTH Toolbox needs to be restarted",
		"需要重新启动 RTH 工具箱"
	],function(){
		if(isAndroidApp||isElectron||isUWP){
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
function showAlert(text,callback){
	if(isUWP){
		switch(language){
			case "SimplifiedChinese":
			mui.alert(text[1],document.title,null,callback)
			break
			default:
			mui.alert(text[0],document.title,"OK",callback)
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
function showConfirm(text,positiveCallback,negativeCallback){
	if(isUWP){
		switch(language){
			case "SimplifiedChinese":
			mui.confirm(text[1],document.title,["否","是"],function(e){
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
			mui.confirm(text[0],document.title,["No","Yes"],function(e){
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
function showMenu(e,menu){
	var addedMenuDiv=document.getElementsByClassName("popup-menu")[0]
	if(addedMenuDiv){
		document.body.removeChild(addedMenuDiv)
	}
	var newDiv=document.createElement("div")
	newDiv.setAttribute("class","popup-menu")
	for(var i=0;i<menu.length;i++){
		var newSpan=document.createElement("span")
		newSpan.innerText
		switch(language){
			case "SimplifiedChinese":
			newSpan.innerText=menu[i].text[1]
			break
			default:
			newSpan.innerText=menu[i].text[0]
			break
		}
		newSpan.onclick=menu[i].onclick
		newDiv.appendChild(newSpan)
	}
	var newSpan=document.createElement("span")
	newSpan.innerText
	switch(language){
		case "SimplifiedChinese":
		newSpan.innerText="取消"
		break
		default:
		newSpan.innerText="Cancel"
		break
	}
	newSpan.onclick=closeMenu
	newDiv.appendChild(newSpan)
	document.body.appendChild(newDiv)
	newDiv.style.left=e.x+"px"
	newDiv.style.top=(e.y-newDiv.offsetHeight/2)+"px"
	setTimeout(function(){
		newDiv.style.opacity="1"
	},25)
}
function showPrompt(text,callback,type,defaultText,emptyCallback,closeFunc,onInput){
	var newDiv=document.createElement("div"),
	newInput=document.createElement("input"),
	newCancelButton=document.createElement("button"),
	newOKButton=document.createElement("button")
	newDiv.setAttribute("class","popup prompt")
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
		if(e.keyCode==13){
			newOKButton.click()
		}
	}
	newCancelButton.onclick=function(){
		if(closeFunc){
			closeFunc()
		}
		newDiv.style.bottom=""
		setTimeout(function(){
			document.body.removeChild(newDiv)
		},250)
	}
	newOKButton.onclick=function(){
		if(newInput.value!=""){
			if(callback){
				callback(newInput.value)
			}
		}else{
			if(emptyCallback){
				emptyCallback()
			}
		}
		setTimeout(function(){
			newDiv.style.bottom=""
			setTimeout(function(){
				document.body.removeChild(newDiv)
			},250)
		},25)
	}
	switch(language){
		case "SimplifiedChinese":
		newInput.placeholder=text[1]
		newCancelButton.innerText="取消"
		newOKButton.innerText="确定"
		break
		default:
		newInput.placeholder=text[0]
		newCancelButton.innerText="Cancel"
		newOKButton.innerText="OK"
		break
	}
	newDiv.appendChild(newInput)
	newDiv.appendChild(newCancelButton)
	newDiv.appendChild(newOKButton)
	document.body.appendChild(newDiv)
	newInput.focus()
	setTimeout(function(){
		newDiv.style.bottom="0px"
	},25)
}
function translate(query,from,to,callback){
	var appid="20171109000093780",key="ZR6EGbP8ZzwU7GookTvy",salt=new Date().getTime()
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
		url:"https://api.fanyi.baidu.com/api/trans/vip/translate",
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
}
function verifyPassword(email,password){
	if(userInfo){
		for(var i=0;i<userInfo.users.length;i++){
			if(email==userInfo.users[i].email){
				if(password==userInfo.users[i].password){
					return{
						"index":i+1,
						"pass":true,
						"username":userInfo.users[i].username
					}
				}else{
					return{
						"index":i+1,
						"pass":false,
						"username":userInfo.users[i].username
					}
				}
			}
		}
	}
	return{
		"index":null,
		"pass":false,
		"username":null
	}
}
if(!isIE){
	window.onerror=function(msg,url,lineNo){
		if(msg!="Script error."){
			var message=msg+" at "+url+":"+lineNo
			showConfirm([
				"An error occurs. Do you want to submit the error report?\n"+message,
				"发生错误。您想要提交错误报告吗？\n"+message
			],function(){
				$.post("https://rthsoftware.azurewebsites.net/feedback.php",{
					"email":login.email,
					"name":login.username,
					"text":message,
					"ver":ver
				},function(){
					showAlert([
						"Thank you for submitting an error report",
						"感谢您提交错误报告"
					])
				})
			})
		}
	}
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
mui.init({swipeBack:false})
if(header){
	var newA=document.createElement("a"),
	newH1=document.createElement("h1")
	newA.setAttribute("class","mui-icon mui-icon-left-nav mui-pull-left back")
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
	newH1.setAttribute("class","mui-title")
	header.appendChild(newA)
	header.appendChild(newH1)
	if(!isApp||isMac||isUWP){
		document.getElementsByClassName("mui-content")[0].style.marginTop="40px"
		header.style.height="65px"
		header.style.paddingTop="20px"
	}
}
if(appliedTheme=="Bing"){
	var loadWallpaper=function(){
		if(header){
			header.style.backgroundImage="url("+savedBingWallpaper+")"
		}
		var blueButtons=document.getElementsByClassName("mui-btn-blue")
		for(var i=0;i<blueButtons.length;i++){
			blueButtons[i].style.backgroundImage="url("+savedBingWallpaper+")"
		}
	}
	savedBingWallpaper=localStorage.getItem("Bing")
	if(savedBingWallpaper){
		loadWallpaper()
	}else if(header){
		request("https://rthsoftware.azurewebsites.net/bing.php",function(e){
			localStorage.setItem("Bing",e)
			savedBingWallpaper=e
			loadWallpaper()
		})
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
request("https://rthsoftware.azurewebsites.net/userdata/users.txt",function(e){
	userInfo=JSON.parse(e)
	if(login.username){
		if(!verifyPassword(login.email,login.password).pass){
			showAlert([
				"Incorrect password",
				"密码错误"
			],function(){
				loginDialog()
			})
		}
	}else if(header==null){
		loginDialog()
	}
},function(){
	login.username=null
})
