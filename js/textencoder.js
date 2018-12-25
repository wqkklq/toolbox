/*Code written by Shangzhen Yang*/
var hist=[],
MD5Hist={}
function add(text,saved,title){
	if((function(){
		for(var i=0;i<hist.length;i++){
			if(hist[i]==text){
				return false
			}
		}
		return true
	})()){
		hist.push(text)
		if(!document.getElementsByTagName("ul")[0].style.display){
			document.getElementsByTagName("ul")[0].style.display="block"
		}
		var newLi=document.createElement("li")
		newLi.classList.add("menu")
		if(title){
			newLi.innerText=title
		}else{
			newLi.innerText=text
		}
		newLi.setAttribute("value",text)
		newLi.onclick=function(){
			scrollTo(0,0)
			document.getElementsByTagName("textarea")[0].value=this.getAttribute("value")
		}
		if(saved){
			document.getElementById("SavedText").appendChild(newLi)
		}else{
			document.getElementsByTagName("ul")[0].appendChild(newLi)
		}
	}
}
function decodeUnicode(code){
	if(code.indexOf("\\u")!=-1){
		var escaped=code.replace(/\\u/g,"%u")
		var text=unescape(escaped)
		if(text==escaped){
			return code
		}else{
			return text
		}
	}else{
		return code
	}
}
function encodeUnicode(text){
	var unicode=""
	for(var i=0;i<text.length;i++){
		var charCode=text.charCodeAt(i).toString(16)
		if(charCode.length<4){
			charCode=addZero(charCode,4)
		}
		unicode+="\\u"+charCode
	}
	return unicode
}
function load(){
	loadSavedText(JSON.parse(localStorage.getItem("SavedText")))
	if(login.username){
		getUserData("text",loadSavedText,null,true)
	}
}
function loadSavedText(e){
	document.getElementById("SavedText").innerHTML=""
	hist=[]
	if(e&&e.text){
		for(var i=e.text.length-1;i>=0;i--){
			if(e.text[i].encrypt){
				add(decrypt(e.text[i].text,"RTH"),true,e.text[i].title)
			}else{
				add(e.text[i].text,true,e.text[i].title)
			}
		}
	}
}
document.getElementById("EncodeButton").onclick=function(){
	if(document.getElementsByTagName("textarea")[0].value||document.getElementsByTagName("select")[0].value=="dataurl"){
		switch(document.getElementsByTagName("select")[0].value){
			case "binary":
			var binary="",
			text=document.getElementsByTagName("textarea")[0].value
			if(only(isNumber,text)){
				binary=(text*1).toString(2)
			}else{
				for(var i=0;i<text.length;i++){
					binary+=text.charCodeAt(i).toString(2)+" "
				}
			}
			document.getElementsByTagName("textarea")[0].value=binary
			break
			case "qrcode":
			showQRCode(document.getElementsByTagName("textarea")[0].value)
			break
			case "password":
			showPrompt([
				"Set the password",
				"设置密码"
			],function(e){
				document.getElementsByTagName("textarea")[0].value=encryptText(document.getElementsByTagName("textarea")[0].value,e)
			},"password")
			break
			case "base64":
			try{
				document.getElementsByTagName("textarea")[0].value=btoa(document.getElementsByTagName("textarea")[0].value)
			}catch(e){
				document.getElementsByTagName("textarea")[0].value=btoa(encodeUnicode(document.getElementsByTagName("textarea")[0].value))
			}
			break
			case "dataurl":
			openDialog()
			break
			case "md5":
			var MD5Value=MD5(document.getElementsByTagName("textarea")[0].value)
			MD5Hist[MD5Value]=document.getElementsByTagName("textarea")[0].value
			document.getElementsByTagName("textarea")[0].value=MD5Value
			break
			case "unicode":
			document.getElementsByTagName("textarea")[0].value=encodeUnicode(document.getElementsByTagName("textarea")[0].value)
			break
			case "uricomponent":
			document.getElementsByTagName("textarea")[0].value=encodeURIComponent(document.getElementsByTagName("textarea")[0].value)
			break
			default:
			showAlert([
				"Please select an encoding scheme",
				"请选择一个编码方案"
			])
		}
	}else{
		showAlert([
			"Please enter the text you want to encode",
			"请输入要编码的文本"
		])
	}
}
document.getElementById("DecodeButton").onclick=function(){
	if(document.getElementsByTagName("textarea")[0].value){
		var encoded=document.getElementsByTagName("textarea")[0].value,
		showDecoded=true
		var decoded=encoded
		try{
			if(decoded.indexOf("data:")!=-1){
				if(decoded.indexOf("image/")!=-1){
					showImage(decoded)
				}else{
					showAlert([
						"Unable to decode this data URL",
						"无法解码此 data URL"
					])
				}
			}else if(decoded.indexOf(" ")==-1){
				if(MD5Hist[decoded]){
					decoded=MD5Hist[decoded]
					showToast([
						"MD5 usually cannot be decoded",
						"MD5 通常不能被解码"
					])
				}else if(only(/0|1/,decoded)){
					decoded=parseInt(decoded,2)
				}else if(only(isNumber,decoded)&&decrypt(decoded)){
					showDecoded=false
					showPrompt([
						"Enter the password",
						"输入密码"
					],function(e){
						var decrypted=decrypt(decoded,e)
						if(decrypted==decoded){
							showAlert([
								"Incorrect password",
								"密码错误"
							])
						}else{
							document.getElementsByTagName("textarea")[0].value=decrypted
						}
					},"password")
				}else if(decoded.indexOf("%u")!=-1){
					decoded=unescape(decoded)
				}else if(decoded.indexOf("%")!=-1){
					decoded=decodeURIComponent(decoded)
				}else if(decoded.indexOf("\\u")!=-1){
					decoded=decodeUnicode(decoded)
				}else{
					decoded=decodeUnicode(atob(decoded))
				}
			}else if(only(/0|1|\s/,decoded)){
				var binaries=decoded.trim().split(" "),
				str=""
				for(var i=0;i<binaries.length;i++){
					str+=String.fromCharCode(parseInt(binaries[i],2))
				}
				decoded=str
			}
		}catch(e){
			alert(e.message)
		}
		if(showDecoded){
			document.getElementsByTagName("textarea")[0].value=decoded
		}
	}else{
		showAlert([
			"Please enter the text you want to decode",
			"请输入要解码的文本"
		])
	}
}
document.getElementById("OpenFile").onchange=function(e){
	var file=e.target.files[0]
	if(file.size<10485760){
		var newToast=showToast(),
		reader=new FileReader()
		newToast.show(["Loading","正在加载"])
		reader.onload=function(){
			newToast.close()
			document.getElementsByTagName("textarea")[0].value=this.result
		}
		reader.readAsDataURL(file)
	}else{
		showAlert([
			"The file is larger than 1024 MB",
			"文件大于 10 MB"
		])
	}
}
switch(language){
	case "SimplifiedChinese":
	document.title="文本编码器"
	document.getElementsByTagName("select")[0].options.add(new Option("选择...",""))
	document.getElementsByTagName("select")[0].options.add(new Option("二进制","binary"))
	document.getElementsByTagName("select")[0].options.add(new Option("二维码","qrcode"))
	document.getElementsByTagName("select")[0].options.add(new Option("密码","password"))
	document.getElementById("EncodeButton").innerText="编码"
	document.getElementById("DecodeButton").innerText="解码"
	break
	default:
	document.title="Text Encoder"
	document.getElementsByTagName("select")[0].options.add(new Option("Select...",""))
	document.getElementsByTagName("select")[0].options.add(new Option("Binary","binary"))
	document.getElementsByTagName("select")[0].options.add(new Option("QR Code","qrcode"))
	document.getElementsByTagName("select")[0].options.add(new Option("Password","password"))
	document.getElementById("EncodeButton").innerText="Encode"
	document.getElementById("DecodeButton").innerText="Decode"
}
newTitle.innerText=document.title
document.getElementsByTagName("select")[0].options.add(new Option("Base64","base64"))
document.getElementsByTagName("select")[0].options.add(new Option("Data URL","dataurl"))
document.getElementsByTagName("select")[0].options.add(new Option("MD5","md5"))
document.getElementsByTagName("select")[0].options.add(new Option("Unicode","unicode"))
document.getElementsByTagName("select")[0].options.add(new Option("URI Component","uricomponent"))
load()
