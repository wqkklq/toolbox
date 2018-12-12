/*Code written by Shangzhen Yang*/
var $_GET=(function(){
	var json={}
	if(location.search){
		var parameters=location.search.replace("?","").split("&")
		for(var i=0;i<parameters.length;i++){
			var split=parameters[i].split("=")
			json[split[0]]=split[1]
		}
	}
	return json
})(),
appliedTheme,
appName="RTH Toolbox",
backend=localStorage.getItem("Backend"),
header=document.getElementsByTagName("header")[0],
isAndroid=/Android/i.test(navigator.userAgent),
isChinese=/[\u4E00-\u9FA5]+/,
isCordova=!!window.cordova,
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
language=localStorage.getItem("Language"),
lastUpdated=new Date("2018/12/12").toLocaleDateString(),
login={
	"email":localStorage.getItem("Email"),
	"password":localStorage.getItem("Password"),
	"username":localStorage.getItem("Username")
},
newLoading=document.createElement("div"),
newMask=document.createElement("div"),
newTitle=document.createElement("h1"),
recentInput=0,
secondary="http://www.rthe.cn/",
theme=localStorage.getItem("Theme"),
ver="16.3"
var isApp=isCordova,
isAndroidApp=isAndroid&&isCordova,
isiOSApp=isCordova&&isiOS,
isMobile=isAndroid||isiOS,
isTencent=isQQ||isWeChat
function addZero(num,length){
	return (Array(length).join("0")+num).slice(-length)
}
function ajax(settings){
	if(settings.showLoading){
		newMask.style.display="block"
		newLoading.style.display="block"
	}
	var data
	if(settings.data){
		if(settings.processData==false){
			data=new FormData()
			for(var key in settings.data){
				if(settings.data[key]){
					data.append(key,settings.data[key])
				}
			}
		}else{
			data=[]
			for(var key in settings.data){
				if(settings.data[key]){
					data.push(key+"="+encodeURIComponent(settings.data[key]))
				}
			}
			data=data.join("&")
		}
	}
	var xhr=new XMLHttpRequest()
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4){
			newMask.style.display=
			newLoading.innerText=
			newLoading.style.display=""
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
	xhr.onloadstart=function(){
		if(settings.method=="POST"){
			if(settings.processData==false){
				switch(language){
					case "SimplifiedChinese":
					newLoading.innerText="正在上传"
					break;
					default:
					newLoading.innerText="Uploading"
				}
			}else{
				switch(language){
					case "SimplifiedChinese":
					newLoading.innerText="正在同步"
					break;
					default:
					newLoading.innerText="Syncing"
				}
			}
		}else{
			switch(language){
				case "SimplifiedChinese":
				newLoading.innerText="等待响应"
				break;
				default:
				newLoading.innerText="Pending"
			}
		}
	}
	xhr.onprogress=function(e){
		if(e.lengthComputable){
			newLoading.innerText=Math.round(e.loaded/e.total*100)+"%"
		}
	}
	if(settings.method&&settings.method=="POST"){
		xhr.open("POST",settings.url)
		if(settings.processData!=false){
			xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
		}
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
				"url":"https://www.rthsoftware.cn/backend/get",
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
	return xhr
}
function arrayContains(obj,array){
	for(var i=0;i<array.length;i++){
		if(obj==array[i]){
			return true
		}
	}
	return false
}
function backendChanged(){
	if(backend=="https://rthsoftware.net/backend/"){
		secondary="https://rthe.cn/"
	}
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
		localStorage.setItem("Password",login.password)
		localStorage.setItem("Username",login.username)
	}
}
function closeMenu(){
	if(document.getElementsByClassName("popup-menu")[0]){
		document.getElementsByClassName("popup-menu")[0].style.opacity="0"
		setTimeout(function(){
			try{
				document.body.removeChild(document.getElementsByClassName("popup-menu")[0])
			}catch(e){}
			newMask.style.display=""
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
function encryptText(text,password){
	var encrypted=""
	text=text.replace(/丨/g,"｜")+"丨"+MD5(password)
	for(var i=0;i<text.length;i++){
		encrypted+=(text.charCodeAt(i)*8).toString(8)+"9"
	}
	return encrypted
}
function error(){
	showAlert([
		"Unable to connect to the server",
		"无法连接服务器"
	])
}
function getUserData(dir,callback,errorCallback,hideLoading){
	ajax({
		"url":backend+"get",
		"data":{
			"url":"userdata/"+dir+"/"+login.username,
			"username":"admin"
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
				ajax({
					"url":"https://rthsoftware.cn/backend/userdata/verify",
					"data":{
						"email":email,
						"password":password
					},
					"dataType":"json",
					"showLoading":true,
					"success":function(e){
						newSignUpButton.onclick=signUp
						newLoginButton.onclick=submitLogin
						if(e.index){
							if(e.pass){
								localStorage.setItem("Backend",e.backend)
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
									openWebPage("https://rthsoftware.cn/login?email="+encodeURIComponent(email)+"&page=resetpassword",true)
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
										"url":"https://rthsoftware.cn/backend/userdata/signup",
										"data":{
											"email":email,
											"password":password,
											"username":username
										},
										"method":"POST",
										"success":function(){
											localStorage.setItem("Backend",e.backend)
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
	login.email=
	login.password=
	login.username=null
	localStorage.removeItem("Backend")
	localStorage.removeItem("Email")
	localStorage.removeItem("Password")
	localStorage.removeItem("Username")
	clearLocalStorage()
	if(isApp||location.hostname=="rthsoftware.cn"){
		location.reload()
	}else{
		var ssoIFrame=document.createElement("iframe")
		ssoIFrame.style.display="none"
		ssoIFrame.src="https://rthsoftware.cn/sso?action=logout"
		document.body.appendChild(ssoIFrame)
	}
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
function openWebPage(href,avoidPopup){
	href=encodeURI(href)
	if(avoidPopup&&!isApp){
		location.href=href
	}else if(isiOSApp){
		OpenUrlExt.open(href)
	}else{
		open(href)
	}
}
function openWindow(name){
	if(location.hostname&&name=="index"){
		location.href="https://"+location.hostname+"/toolbox/"
	}else if(name.indexOf("?")!=-1||location.hostname){
		location.href=name
	}else{
		location.href=name+".html"
	}
}
function reload(){
	if(isiOS){
		openWindow("index")
	}else{
		location.reload()
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
		newDiv.style.opacity="0"
		setTimeout(function(){
			try{
				document.body.removeChild(newDiv)
			}catch(e){}
		},250)
	}
	newSaveDiv.onclick=function(){
		if(src.indexOf("https://rthsoftware.cn/backend/get")!=-1){
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
	showImage("https://rthsoftware.cn/backend/get?url="+encodeURIComponent("http://qr.topscan.com/api.php?text="+text)+"&username=admin")
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
		var audio=new Audio("https://www.rthsoftware.cn/backend/get?url="+encodeURIComponent("https://fanyi.baidu.com/gettts?lan="+lan+"&spd=6&text="+text)+"&username=admin")
		audio.onerror=function(){
			if(window.speechSynthesis){
				window.speechSynthesis.speak(new SpeechSynthesisUtterance(text))
			}else{
				error()
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
		"showLoading":true,
		"success":function(data){
			if(data&&data.trans_result&&callback){
				callback(data.trans_result[0].dst,data)
			}
		},
		"error":function(){
			if(negativeCallback){
				negativeCallback()
			}else{
				error()
			}
		}
	})
}
if(!backend){
	backend="https://rthsoftware.cn/backend/"
}else{
	backendChanged()
}
window.onerror=function(msg,url,lineNo){
	if(msg&&url&&lineNo&&msg!="Script error."&&url.indexOf("mui.min.js")==-1&&lineNo!=1){
		var text=msg+" at "+url+" : "+lineNo
		mui.toast(msg)
		if(isApp||login.username){
			window.onerror=null
			ajax({
				"url":"https://rthsoftware.cn/backend/feedback",
				"data":{
					"appname":appName,
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
		}
	}
}
addEventListener("message",function(e){
	try{
		login=JSON.parse(atob(e.data))
		if(login.username===null){
			location.reload()
		}else{
			localStorage.setItem("Backend",backend)
			localStorage.setItem("Email",login.email)
			localStorage.setItem("Username",login.username)
			if(login.password){
				localStorage.setItem("Password",login.password)
			}
			document.getElementsByClassName("popup")[0].style.opacity=""
			setTimeout(function(){
				try{
					document.body.removeChild(document.getElementsByClassName("popup")[0])
				}catch(e){}
			},250)
		}
	}catch(e){}
})
if(!language){
	if(navigator.language.indexOf("zh")!=-1){
		language="SimplifiedChinese"
	}else{
		language="English"
	}
	localStorage.setItem("Language",language)
}
if(!theme){
	theme="Light"
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
	newA=document.createElement("a")
	newDiv.classList.add("title-bg")
	newA.classList.add("mui-icon")
	newA.classList.add("mui-icon-left-nav")
	newA.classList.add("mui-pull-left")
	newA.classList.add("back")
	if(window.history.length<=1){
		newA.onclick=function(){
			openWindow("index")
		}
	}else{
		newA.onclick=mui.back
	}
	newTitle.classList.add("mui-title")
	newDiv.appendChild(newA)
	newDiv.appendChild(newTitle)
	header.appendChild(newDiv)
	if(!isApp){
		document.getElementsByClassName("mui-content")[0].style.marginTop="40px"
		header.style.height="65px"
		newDiv.style.paddingTop="20px"
	}
}
newLoading.classList.add("loading")
newMask.classList.add("mask")
newMask.oncontextmenu=function(){
	return false
}
newMask.onclick=closeMenu
document.body.appendChild(newMask)
document.body.appendChild(newLoading)
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
			"url":"https://rthsoftware.cn/backend/bing/base64",
			"success":function(e){
				savedBingWallpaper="url("+e+")"
				localStorage.setItem("bing-wallpaper",savedBingWallpaper)
				loadWallpaper()
			}
		})
	}
}else if(theme!="Bing"){
	localStorage.removeItem("bing-wallpaper")
}
if(login.username){
	ajax({
		"url":"https://rthsoftware.cn/backend/userdata/verify",
		"data":{
			"email":login.email,
			"password":login.password
		},
		"dataType":"json",
		"success":function(e){
			if(e.pass){
				backend=e.backend
				localStorage.setItem("Backend",backend)
				backendChanged()
			}else{
				showAlert([
					"Incorrect password",
					"密码错误"
				])
				logOut()
			}
		}
	})
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
if(!isApp&&location.hostname&&"serviceWorker" in navigator){
	navigator.serviceWorker.register("sw.js")
}
if(location.hostname){
	var newStatDiv=document.createElement("div"),
	newScript=document.createElement("script")
	newStatDiv.style.display="none"
	newScript.src="https://s13.cnzz.com/z_stat.php?id=1275083108&web_id=1275083108"
	newStatDiv.appendChild(newScript)
	document.body.appendChild(newStatDiv)
}
