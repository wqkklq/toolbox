/*Code written by Shangzhen Yang*/
var appliedTheme,
backend="https://www.rthsoftware.cn/backend/",
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
isWeb=location.hostname=="www.rthsoftware.cn",
isWindows=/Windows/i.test(navigator.userAgent),
langOpt,
language=localStorage.getItem("Language"),
lastUpdated=new Date("2018/9/7").toLocaleDateString(),
loadingId,
login={
	"email":localStorage.getItem("Email"),
	"password":localStorage.getItem("Password"),
	"username":localStorage.getItem("Username")
},
recentInput=0,
theme=localStorage.getItem("Theme"),
ver="13.7"
var isApp=isCordova||isElectron,
isAndroidApp=isAndroid&&isCordova,
isiOSApp=isCordova&&isiOS,
isMobile=isAndroid||isiOS
function addZero(num,length){
	return (Array(length).join("0")+num).slice(-length)
}
function ajax(settings){
	var data
	if(settings.data){
		data=[]
		for(var key in settings.data){
			if(settings.data[key]){
				data.push(key+"="+encodeURIComponent(settings.data[key]))
			}
		}
		data=data.join("&")
	}
	var xhr=new XMLHttpRequest()
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4){
			if(xhr.status==200&&xhr.responseText||xhr.status==200&&settings.method=="POST"){
				if(settings.success){
					if(settings.dataType&&settings.dataType.indexOf("json")!=-1){
						settings.success(JSON.parse(xhr.responseText))
					}else{
						settings.success(xhr.responseText)
					}
				}else if(settings.dataType=="jsonp"&&xhr.responseText){
					eval(xhr.responseText)
				}
			}else if(settings.error){
				settings.error({
					"status":xhr.status
				})
			}
		}
	}
	if(settings.timeout){
		xhr.timeout=settings.timeout
	}
	if(settings.method&&settings.method=="POST"){
		xhr.open("POST",settings.url)
		xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
		xhr.send(data)
	}else{
		var url
		if(data){
			url=settings.url+"?"+data
		}else{
			url=settings.url
		}
		if(settings.crossOrigin){
			ajax({
				"url":backend+"get",
				"data":{
					"url":url,
					"username":"admin"
				},
				"dataType":settings.dataType,
				"timeout":settings.timeout,
				"success":settings.success,
				"error":settings.error
			})
		}else{
			xhr.open("GET",url)
			if(!settings.timeout){
				xhr.timeout=10000
			}
			xhr.send()
		}
	}
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
	localStorage.clear()
	if(login.username){
		localStorage.setItem("Email",login.email)
		localStorage.setItem("Password",login.password)
		localStorage.setItem("Username",login.username)
	}
	restart()
}
function closeLoading(){
	clearInterval(loadingId)
	try{
		document.body.removeChild(document.getElementsByClassName("loading")[0])
	}catch(e){}
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
		if(Math.abs(result)>1){
			return result+" days"
		}else{
			return result+" day"
		}
	}
}
function decrypt(text,password){
	var encrypted=text.split("9"),
	str=""
	for(var i=0;i<encrypted.length;i++){
		str+=String.fromCharCode(parseInt(encrypted[i],8)/8)
	}
	if(str.indexOf("丨")!=-1){
		if(password&&MD5(password)==str.substr(str.indexOf("丨")+1,32)){
			return str.substr(0,str.indexOf("丨"))
		}else{
			return text
		}
	}
}
function error(){
	closeLoading()
	showAlert([
		"Unable to connect to the server",
		"无法连接服务器"
	])
}
function getUserData(dir,callback,errorCallback,hideLoading){
	if(!hideLoading){
		showLoading()
	}
	ajax({
		"url":backend+"get",
		"data":{
			"url":"userdata/"+dir+"/"+login.username,
			"username":"admin"
		},
		"dataType":"json",
		"success":function(e){
			closeLoading()
			if(callback){
				callback(e)
			}
		},
		"error":function(e){
			closeLoading()
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
				newSignUpButton.onclick=
				newLoginButton.onclick=null
				showLoading()
				ajax({
					"url":backend+"userdata/verify",
					"data":{
						"email":email,
						"password":password
					},
					"dataType":"json",
					"success":function(e){
						closeLoading()
						newSignUpButton.onclick=signUp
						newLoginButton.onclick=submitLogin
						if(e.index){
							if(e.pass){
								showAlert([
									"Log in successfully",
									"已成功登录"
								])
								localStorage.setItem("Email",email)
								localStorage.setItem("Password",password)
								localStorage.setItem("Username",e.username)
								location.reload()
							}else if(email!="admin"){
								newPasswordInput.value=""
								newConfirmPasswordInput.value=""
								showConfirm([
									"Incorrect password. Do you want to reset the password?",
									"密码错误。您想重置密码吗？"
								],function(){
									var url="https://www.rthsoftware.cn/login?email="+encodeURIComponent(email)+"&page=resetpassword"
									if(isApp){
										openWebPage(url)
									}else{
										location.href=url
									}
								})
							}
						}else{
							if(newH1.innerText==newSignUpButton.innerText){
								if(newConfirmPasswordInput.value!=newPasswordInput.value){
									newConfirmPasswordInput.style.borderColor="rgb(255,192,203)"
									newConfirmPasswordInput.focus()
								}else{
									var username=email.split("@")[0]+new Date().getTime().toString(36)
									ajax({
										"url":backend+"userdata/signup",
										"data":{
											"email":email,
											"password":password,
											"username":username
										},
										"method":"POST",
										"success":function(){
											showAlert([
												"Log in successfully",
												"已成功登录"
											])
											localStorage.setItem("Email",email)
											localStorage.setItem("Password",password)
											localStorage.setItem("Username",username)
											location.reload()
										},
										"error":error
									})
								}
							}else{
								showAlert([
									"This user does not exist",
									"此用户不存在"
								])
								signUp()
							}
						}
					},
					"error":function(){
						newSignUpButton.onclick=signUp
						newLoginButton.onclick=submitLogin
						error()
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
			newDescriptionDiv.innerText="登录后，您可以在 www.rthsoftware.cn 查看您保存的单词表和文本文档"
			break
			default:
			newH1.innerText="Login"
			newEmailInput.placeholder="Email"
			newPasswordInput.placeholder="Password"
			newConfirmPasswordInput.placeholder="Confirm Password"
			newSignUpButton.innerText="Sign Up"
			newLoginButton.innerText="Login"
			newDescriptionDiv.innerText="After logging in, you can view your saved word lists and text documents at www.rthsoftware.cn"
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
function loginRequired(callback,negativeCallback,offline,redirect){
	if(login.username){
		if(callback){
			callback()
		}
	}else{
		if(negativeCallback){
			negativeCallback()
		}
		if(redirect&&isWeb){
			location.href="../login"
		}else{
			loginDialog()
		}
	}
}
function logOut(){
	login.email=
	login.password=
	login.username=null
	localStorage.removeItem("Email")
	localStorage.removeItem("Password")
	localStorage.removeItem("Username")
	clearLocalStorage()
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
	if(name.indexOf("?")!=-1||isWeb){
		location.href=name
	}else{
		location.href=name+".html"
	}
}
function restart(){
	if(isAndroidApp||isElectron){
		mui.back()
	}else{
		openWindow("index")
	}
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
function showAlert(text){
	switch(language){
		case "SimplifiedChinese":
		alert(text[1])
		break
		default:
		alert(text[0])
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
function showLoading(){
	if(!document.getElementsByClassName("loading")[0]){
		var newDiv=document.createElement("div")
		newDiv.classList.add("loading")
		newDiv.innerText="0%"
		document.body.appendChild(newDiv)
	}
	loadingId=setInterval(function(){
		if(document.getElementsByClassName("loading")[0]){
			var newNum=document.getElementsByClassName("loading")[0].innerText.replace("%","")*1+1
			if(newNum>100){
				document.getElementsByClassName("loading")[0].innerText="0%"
			}else{
				document.getElementsByClassName("loading")[0].innerText=newNum+"%"
			}
		}
	},100)
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
	closeLoading()
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
function showQRCode(text){
	showImage(backend+"get?type=image&url="+encodeURIComponent("http://qr.topscan.com/api.php?text="+text))
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
function translate(query,from,to,callback,negativeCallback){
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
	showLoading()
	ajax({
		"url":"http://api.fanyi.baidu.com/api/trans/vip/translate",
		"data":{
			"q":query,
			"appid":appid,
			"salt":salt,
			"from":from,
			"to":to,
			"sign":sign
		},
		"dataType":"json",
		"crossOrigin":true,
		"success":function(data){
			closeLoading()
			if(data.trans_result&&callback){
				callback(data.trans_result[0].dst,data)
			}
		},
		"error":function(){
			if(negativeCallback){
				closeLoading()
				negativeCallback()
			}else{
				error()
			}
		}
	})
}
if(!isIE){
	window.onerror=function(msg,url,lineNo){
		if(msg!="Script error."&&lineNo!=1){
			var text=msg+" at "+url+" : "+lineNo
			if(isApp||login.username){
				window.onerror=null
				mui.toast(msg)
				ajax({
					"url":backend+"feedback",
					"data":{
						"email":login.email,
						"lang":language,
						"name":login.username,
						"text":text,
						"ver":ver
					},
					"method":"POST",
					"success":function(){
						if(header){
							clearLocalStorage()
						}
					}
				})
			}else{
				mui.toast(text)
			}
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
	if(login.username&&login.username!="app"){
		var newAd=document.createElement("a")
		newAd.classList.add("mui-pull-right")
		newAd.classList.add("ad")
		newAd.onclick=function(){
			openWebPage("http://rths.tk/ad")
		}
		document.getElementsByClassName("title-bg")[0].appendChild(newAd)
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
	if(!savedBingWallpaper||!header){
		ajax({
			"url":backend+"bing/base64",
			"success":function(e){
				savedBingWallpaper="url("+e+")"
				localStorage.setItem("bing-wallpaper",savedBingWallpaper)
				loadWallpaper()
			}
		})
	}
}else if(theme!="Bing"&&!isWeb){
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
	ajax({
		"url":backend+"userdata/verify",
		"data":{
			"email":login.email,
			"password":login.password
		},
		"dataType":"json",
		"success":function(e){
			if(!e.pass){
				showAlert([
					"Incorrect password",
					"密码错误"
				])
				logOut()
			}
		}
	})
}else if(!header&&!searchURL("action")){
	loginDialog()
}
switch(language){
	case "SimplifiedChinese":
	langOpt=[
		["英语","en"],
		["简体中文","zh"],
		["繁体中文","cht"],
		["文言文","wyw"],
		["粤语","yue"],
		["日语","jp"],
		["韩语","kor"],
		["法语","fra"],
		["西班牙语","spa"],
		["泰语","th"],
		["阿拉伯语","ara"],
		["俄语","ru"],
		["葡萄牙语","pt"],
		["德语","de"],
		["意大利语","it"],
		["希腊语","el"],
		["荷兰语","nl"],
		["波兰语","pl"],
		["保加利亚语","bul"],
		["爱沙尼亚语","est"],
		["丹麦语","dan"],
		["芬兰语","fin"],
		["捷克语","cs"],
		["罗马尼亚语","rom"],
		["斯洛文尼亚语","slo"],
		["瑞典语","swe"],
		["匈牙利语","hu"],
		["越南语","vie"]
	]
	break
	default:
	langOpt=[
		["English","en"],
		["Simplified Chinese","zh"],
		["Traditional Chinese","cht"],
		["Classical Chinese","wyw"],
		["Cantonese","yue"],
		["Japanese","jp"],
		["Korean","kor"],
		["French","fra"],
		["Spanish","spa"],
		["Thai","th"],
		["Arabic","ara"],
		["Russia","ru"],
		["Portuguese","pt"],
		["German","de"],
		["Italian","it"],
		["Greek","el"],
		["Dutch","nl"],
		["Polish","pl"],
		["Bulgarian","bul"],
		["Estonian","est"],
		["Danish","dan"],
		["Finnish","fin"],
		["Czech","cs"],
		["Romanian","rom"],
		["Slovenian","slo"],
		["Swedish","swe"],
		["Hungarian","hu"],
		["Vietnamese","vie"]
	]
}
