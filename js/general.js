/*Code written by Shangzhen Yang*/
"use strict"
var $_GET=(function(){
	var json={}
	if(location.search){
		var parameters=location.search.replace("?","").split("&")
		for(var i=0;i<parameters.length;i++){
			var split=parameters[i].split("=")
			json[split[0]]=decodeURIComponent(split[1])
		}
	}
	return json
})(),
appName="RTH Toolbox",
backend=localStorage.getItem("Backend")||"https://cdn.rthsoftware.cn/backend/",
header=document.getElementsByTagName("header")[0],
isAndroid=/Android/i.test(navigator.userAgent),
isApp=!!window.cordova||document.body.classList.add("browser"),
isChinese=/[\u4E00-\u9FA5]+/,
isEnglish=/[A-Za-z]+/,
isiOS=/iPhone|iPad/i.test(navigator.userAgent),
isLinux=/Linux/i.test(navigator.userAgent),
isMac=/Macintosh/i.test(navigator.userAgent),
isNumber=/[0-9]+/,
isQQ=/QQ\//i.test(navigator.userAgent),
isUpperCase=/[A-Z]+/,
isWeChat=/MicroMessenger\//i.test(navigator.userAgent),
isWindows=/Windows/i.test(navigator.userAgent),
langOpt,
language=localStorage.getItem("Language")||function(){
	if(navigator.language.indexOf("zh")!=-1){
		return "SimplifiedChinese"
	}else{
		return "English"
	}
}(),
lastUpdated=new Date("2019/3/5").toLocaleDateString(),
login={
	"email":localStorage.getItem("Email"),
	"token":localStorage.getItem("Token"),
	"username":localStorage.getItem("Username")
},
newBack=document.createElement("a"),
newMask=document.createElement("div"),
newTitle=document.createElement("h1"),
recentInput=0,
secondary="http://rthe.cn/",
theme=localStorage.getItem("Theme")||"Light",
ver="16.15"
var appliedTheme=function(){
	if(theme=="Automatic"){
		var currentHour=new Date().getHours()
		if(currentHour>=21||currentHour<=6){
			return "Dark"
		}else{
			return "Light"
		}
	}else{
		return theme
	}
}(),
isAndroidApp=isAndroid&&isApp,
isMobile=isAndroid||isiOS,
isTencent=isQQ||isWeChat
function addZero(num,length){
	return (Array(length).join("0")+num).slice(-length)
}
function ajax(settings){
	var newToast
	if(settings.showLoading){
		newToast=showToast()
	}
	var data
	if(settings.data){
		if(settings.method=="POST"){
			data=new FormData()
			for(var key in settings.data){
				if(settings.data[key]){
					data.append(key,settings.data[key])
				}
			}
		}else{
			data=encodeData(settings.data)
		}
	}
	var xhr=new XMLHttpRequest()
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4){
			if(newToast){
				newToast.close()
			}
			if(xhr.status==200&&xhr.responseText||xhr.status==200&&settings.method=="POST"){
				if(settings.success){
					if(settings.dataType&&settings.dataType=="json"){
						settings.success(JSON.parse(xhr.responseText))
					}else{
						settings.success(xhr.responseText)
					}
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
	xhr.onloadstart=function(){
		if(newToast){
			if(settings.method=="POST"){
				newToast.show(["Syncing","正在同步"])
			}else{
				newToast.show(["Pending","等待响应"])
			}
		}
	}
	xhr.onprogress=function(e){
		if(newToast&&e.lengthComputable){
			newToast.show(Math.round(e.loaded/e.total*100)+"%")
		}
	}
	if(settings.method&&settings.method=="POST"){
		xhr.open("POST",settings.url)
		xhr.send(data)
	}else{
		var url
		if(data){
			url=settings.url+"?"+data
		}else{
			url=settings.url
		}
		xhr.open("GET",url)
		if(!settings.timeout){
			xhr.timeout=10000
		}
		xhr.send()
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
		localStorage.setItem("Backend",backend)
		localStorage.setItem("Email",login.email)
		localStorage.setItem("Token",login.token)
		localStorage.setItem("Username",login.username)
	}
}
function closeMenu(){
	if(document.getElementsByClassName("popup-menu")[0]){
		newMask.style.display=""
		removeElement(document.getElementsByClassName("popup-menu")[0])
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
function encodeData(data){
	var array=[]
	for(var key in data){
		if(data[key]){
			array.push(key+"="+encodeURIComponent(data[key]))
		}
	}
	return array.join("&")
}
function encryptText(text,password){
	var encrypted=""
	text=text.replace(/丨/g,"｜")+"丨"+MD5(password)
	for(var i=0;i<text.length;i++){
		encrypted+=(text.charCodeAt(i)*8).toString(8)+"9"
	}
	return encrypted
}
function error(e){
	showAlert([
		"Unable to connect to the server: "+e.status,
		"无法连接到服务器："+e.status
	])
}
function getUserData(dir,callback,errorCallback,hideLoading){
	ajax({
		"url":backend+"get",
		"data":{
			"token":login.token,
			"url":dir,
			"username":login.username
		},
		"dataType":"json",
		"showLoading":!hideLoading,
		"success":function(e){
			if(callback){
				callback(e)
			}
		},
		"error":function(e){
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
	newTitle.innerText=document.title
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
			if(!this.value){
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
		var closeSignUp=function(){
			newH1.innerText=newLoginButton.innerText
			newConfirmPasswordInput.style.display="none"
			newSignUpButton.style.width=
			newLoginButton.style.display=
			newDescriptionDiv.style.display=""
		},
		signUp=function(){
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
			newEmailInput.classList.remove("warning")
			newPasswordInput.classList.remove("warning")
			newConfirmPasswordInput.classList.remove("warning")
			if(!/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/.test(email)){
				newEmailInput.classList.add("warning")
				newEmailInput.focus()
			}else if(!newPasswordInput.value){
				newPasswordInput.classList.add("warning")
				newPasswordInput.focus()
			}else{
				newSignUpButton.onclick=
				newLoginButton.onclick=null
				ajax({
					"url":"https://cdn.rthsoftware.cn/backend/userdata/verify",
					"data":{
						"email":email,
						"password":password,
						"token":true
					},
					"dataType":"json",
					"showLoading":true,
					"success":function(e){
						newSignUpButton.onclick=signUp
						newLoginButton.onclick=submitLogin
						if(e.index){
							if(e.token){
								localStorage.setItem("Backend",e.backend)
								localStorage.setItem("Email",e.email)
								localStorage.setItem("Token",e.token)
								localStorage.setItem("Username",e.username)
								backend=e.backend
								login.email=e.email
								login.token=e.token
								login.username=e.username
								removeElement(document.getElementsByClassName("popup")[0])
								if("load" in window){
									load()
								}
							}else if(email!="admin"){
								newPasswordInput.value=""
								newConfirmPasswordInput.value=""
								showConfirm([
									"Incorrect password. Do you want to reset the password?",
									"密码错误。您想重置密码吗？"
								],function(){
									openWebPage("https://rthsoftware.cn/login?"+encodeData({
										"email":email,
										"page":"resetpassword"
									}),true)
								})
							}
						}else{
							if(newH1.innerText==newSignUpButton.innerText){
								if(newConfirmPasswordInput.value!=newPasswordInput.value){
									newConfirmPasswordInput.classList.add("warning")
									newConfirmPasswordInput.focus()
								}else{
									var username=email.split("@")[0]+new Date().getTime().toString(36)
									ajax({
										"url":"https://cdn.rthsoftware.cn/backend/userdata/signup",
										"data":{
											"email":email,
											"password":password,
											"username":username
										},
										"method":"POST",
										"success":function(){
											showAlert([
												"Signed up successfully.",
												"注册成功。"
											])
											closeSignUp()
										},
										"error":error
									})
								}
							}else{
								showAlert([
									"This user does not exist.",
									"此用户不存在。"
								])
								signUp()
							}
						}
					},
					"error":function(e){
						newSignUpButton.onclick=signUp
						newLoginButton.onclick=submitLogin
						error(e)
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
				removeElement(newDiv)
			}else{
				closeSignUp()
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
			newDescriptionDiv.innerText="有了 RTH 账号，您就可以在您的所有设备上获取保存的数据。"
			break
			default:
			newH1.innerText="Login"
			newEmailInput.placeholder="Email"
			newPasswordInput.placeholder="Password"
			newConfirmPasswordInput.placeholder="Confirm Password"
			newSignUpButton.innerText="Sign Up"
			newLoginButton.innerText="Login"
			newDescriptionDiv.innerText="With RTH account, you can get the saved data on all of your devices."
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
function loginRequired(callback,negativeCallback){
	if(login.username){
		if(callback){
			callback()
		}
	}else{
		if(negativeCallback){
			negativeCallback()
		}
		loginDialog()
	}
}
function logOut(){
	var ssoIFrame=document.createElement("iframe")
	ssoIFrame.style.display="none"
	ssoIFrame.src="https://rthsoftware.cn/sso?"+encodeData({
		"action":"logout"
	})
	document.body.appendChild(ssoIFrame)
}
function only(regExp,text){
	var array=text.split(""),
	passed=""
	for(var i=0;i<array.length;i++){
		if(regExp.test(array[i])){
			passed+=array[i]
		}
	}
	if(passed==text){
		return true
	}else{
		return false
	}
}
function openDialog(){
	document.getElementById("OpenFile").value=""
	document.getElementById("OpenFile").click()
}
function openWebPage(url,avoidPopup,sso){
	if(sso&&location.hostname!="rthsoftware.cn"){
		url="https://rthsoftware.cn/sso?"+encodeData({
			"continue":url,
			"token":login.token,
			"username":login.username
		})
	}
	if(avoidPopup&&!isApp){
		location.href=url
	}else{
		open(url)
	}
}
function openWindow(name){
	if(location.hostname&&name=="index"){
		location.href="./"
	}else if(location.hostname){
		location.href=name
	}else if(name.indexOf("?")!=-1){
		location.href=name.replace("?",".html?")
	}else{
		location.href=name+".html"
	}
}
function removeElement(element){
	if(element){
		if(element.style.opacity){
			element.style.opacity=""
			setTimeout(function(){
				try{
					element.parentElement.removeChild(element)
				}catch(e){}
			},250)
		}else{
			try{
				element.parentElement.removeChild(element)
			}catch(e){}
		}
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
	newImg=new Image(),
	newButtonDiv=document.createElement("div"),
	newCloseDiv=document.createElement("div"),
	newSaveDiv=document.createElement("div")
	newDiv.classList.add("image")
	newTitleDiv.classList.add("image-title")
	newContentDiv.classList.add("image-content")
	newLoadDiv.classList.add("image-load")
	newTitleDiv.onmousedown=
	newTitleDiv.ontouchstart=function(start){
		newDiv.style.transition="0s all"
		var left=newDiv.offsetLeft,
		startPoint,
		top=newDiv.offsetTop
		if(start.touches){
			startPoint={
				"x":start.touches[0].clientX,
				"y":start.touches[0].clientY
			}
		}else{
			startPoint={
				"x":start.clientX,
				"y":start.clientY
			}
		}
		window.onmousemove=
		this.ontouchmove=function(move){
			move.preventDefault()
			var x,y
			if(move.touches){
				x=move.touches[0].clientX
				y=move.touches[0].clientY
			}else{
				x=move.clientX
				y=move.clientY
			}
			newDiv.style.left=(left+x-startPoint.x)+"px"
			newDiv.style.top=(top+y-startPoint.y)+"px"
		}
		window.onmouseup=
		this.ontouchend=function(){
			window.onmousemove=
			newTitleDiv.ontouchmove=
			newDiv.style.transition=null
		}
	}
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
		removeElement(newDiv)
	}
	newSaveDiv.onclick=function(){
		if(src.indexOf("data:")!=-1){
			showAlert([
				"Unable to save this image.",
				"无法保存此图片。"
			])
		}else if(src.indexOf("https://cdn.rthsoftware.cn/backend/get")!=-1){
			openWebPage(searchURL("url",src))
		}else{
			openWebPage(src)
		}
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
	var newDiv=document.createElement("div")
	newDiv.classList.add("popup-menu")
	newMask.style.display="block"
	newDiv.oncontextmenu=function(){
		return false
	}
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
		removeElement(newDiv)
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
			removeElement(newDiv)
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
	showImage("https://cdn.rthsoftware.cn/backend/get?"+encodeData({
		"url":"http://qr.topscan.com/api.php?"+encodeData({
			"text":text
		}),
		"username":"admin"
	}))
}
function showToast(text){
	if(document.getElementsByClassName("mui-toast-container")[0]){
		removeElement(document.getElementsByClassName("mui-toast-container")[0])
	}
	var newContainerDiv=document.createElement("div"),
	newMessageDiv=document.createElement("div")
	newContainerDiv.classList.add("mui-toast-container")
	newMessageDiv.classList.add("mui-toast-message")
	if(text){
		if(typeof text=="string"){
			newMessageDiv.innerText=text
		}else{
			switch(language){
				case "SimplifiedChinese":
				newMessageDiv.innerText=text[1]
				break
				default:
				newMessageDiv.innerText=text[0]
			}
		}
	}
	newContainerDiv.appendChild(newMessageDiv)
	document.body.appendChild(newContainerDiv)
	if(text){
		setTimeout(function(){
			newContainerDiv.style.opacity=".7"
			setTimeout(function(){
				removeElement(newContainerDiv)
			},2000)
		},25)
	}else{
		return{
			"close":function(){
				newMask.style.display=""
				removeElement(newContainerDiv)
			},
			"show":function(value){
				if(value){
					newMask.style.display="block"
					if(typeof value=="string"){
						newMessageDiv.innerText=value
					}else{
						switch(language){
							case "SimplifiedChinese":
							newMessageDiv.innerText=value[1]
							break
							default:
							newMessageDiv.innerText=value[0]
						}
					}
					newContainerDiv.style.opacity=".7"
				}
			}
		}
	}
}
function speak(text,lan){
	if(text){
		if(!lan||lan=="auto"||lan=="cht"||lan=="wyw"){
			lan=(function(){
				if(isChinese.test(text)){
					return "zh"
				}else{
					return "en"
				}
			})()
		}
		showToast([
			"Loading audio",
			"正在加载音频"
		])
		var audio=new Audio("https://cdn.rthsoftware.cn/backend/get?"+encodeData({
			"url":"https://fanyi.baidu.com/gettts?lan="+lan+"&spd=6&text="+text,
			"username":"admin"
		}))
		audio.onerror=function(){
			if("speechSynthesis" in window){
				speechSynthesis.speak(new SpeechSynthesisUtterance(text))
			}else{
				showAlert([
					"Unable to load audio.",
					"无法加载音频。"
				])
			}
		}
		audio.play()
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
	ajax({
		"url":backend+"get",
		"data":{
			"url":"http://api.fanyi.baidu.com/api/trans/vip/translate?"+encodeData({
				"q":query,
				"appid":appid,
				"salt":salt,
				"from":from,
				"to":to,
				"sign":sign
			}),
			"username":"admin"
		},
		"dataType":"json",
		"showLoading":true,
		"success":function(data){
			if(data&&data.trans_result&&callback){
				callback(data.trans_result[0].dst,data)
			}
		},
		"error":function(e){
			if(negativeCallback){
				negativeCallback()
			}else{
				error(e)
			}
		}
	})
}
addEventListener("message",function(e){
	try{
		login=JSON.parse(atob(e.data))
		if(login.username===null){
			login.email=
			login.password=null
			localStorage.removeItem("Backend")
			localStorage.removeItem("Email")
			localStorage.removeItem("Token")
			localStorage.removeItem("Username")
			clearLocalStorage()
			location.reload()
		}else{
			localStorage.setItem("Backend",backend)
			localStorage.setItem("Email",login.email)
			localStorage.setItem("Token",login.token)
			localStorage.setItem("Username",login.username)
			removeElement(document.getElementsByClassName("popup")[0])
			if("load" in window){
				load()
			}
		}
	}catch(e){}
})
if(appliedTheme!="Light"){
	if(appliedTheme=="Bing"){
		loadCSS("css/dark.css")
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
				"url":"https://cdn.rthsoftware.cn/backend/bing/base64",
				"success":function(e){
					savedBingWallpaper="url("+e+")"
					localStorage.setItem("bing-wallpaper",savedBingWallpaper)
					loadWallpaper()
				}
			})
		}
	}
	loadCSS("css/"+appliedTheme.toLowerCase()+".css")
}
if(theme!="Bing"&&!location.hostname){
	localStorage.removeItem("bing-wallpaper")
}
if(header){
	var newDiv=document.createElement("div")
	newDiv.classList.add("title-bg")
	newBack.classList.add("mui-icon")
	newBack.classList.add("mui-icon-left-nav")
	newBack.classList.add("mui-pull-left")
	newBack.classList.add("back")
	if(window.history.length<=1){
		newBack.onclick=function(){
			openWindow("index")
		}
	}else{
		newBack.onclick=function(){
			history.go(-1)
		}
	}
	newTitle.classList.add("mui-title")
	newDiv.appendChild(newBack)
	newDiv.appendChild(newTitle)
	header.appendChild(newDiv)
}
newMask.classList.add("mask")
newMask.oncontextmenu=function(){
	return false
}
newMask.onclick=closeMenu
document.body.appendChild(newMask)
if(login.username){
	ajax({
		"url":"https://cdn.rthsoftware.cn/backend/userdata/verify",
		"data":{
			"token":login.token,
			"username":login.username
		},
		"dataType":"json",
		"success":function(e){
			if(e.token){
				backend=e.backend
				localStorage.setItem("Backend",backend)
			}else{
				showAlert([
					"Login session is expired.",
					"登录会话已过期。"
				])
				logOut()
			}
		}
	})
}else if(!isApp&&location.hostname!="rthsoftware.cn"){
	var ssoIFrame=document.createElement("iframe")
	ssoIFrame.style.display="none"
	ssoIFrame.src="https://rthsoftware.cn/sso"
	document.body.appendChild(ssoIFrame)
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
if(!isApp&&(location.hostname=="rthsoftware.cn"||location.hostname=="localhost")&&"serviceWorker" in navigator){
	navigator.serviceWorker.register("sw.js")
}
var newScript=document.createElement("script")
newScript.async=true
newScript.src="https://cdn.rthsoftware.cn/backend/code?"+encodeData({
	"app":isApp,
	"appname":appName,
	"filename":(function(){
		var urlSplit=location.href.split("/")
		var filename=urlSplit[urlSplit.length-1]
		if(filename.indexOf(".html")!=-1){
			filename=filename.replace(".html","")
		}
		return filename
	})(),
	"lang":language,
	"username":login.username,
	"ver":ver
})
document.body.appendChild(newScript)
