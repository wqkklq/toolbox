/*Code written by Shangzhen Yang*/
var currentItem,
encrypt=true,
fontSize=16,
savedText=JSON.parse(localStorage.getItem("SavedText"))
function applyItem(serialNumber){
	if(serialNumber!=0){
		currentItem=serialNumber*1
	}
	edit(true)
}
function count(){
	var text=document.getElementsByTagName("textarea")[0].value
	var all=(text.match(/[a-z]+|[\u4E00-\uFA29]/gi)||[]).length
	var selectedText=text.substring(document.getElementsByTagName("textarea")[0].selectionStart,document.getElementsByTagName("textarea")[0].selectionEnd)
	if(selectedText){
		text=selectedText
		document.getElementById("WordCount").getElementsByTagName("span")[0].innerText=(text.match(/[a-z]+|[\u4E00-\uFA29]/gi)||[]).length+"/"+all
	}else{
		document.getElementById("WordCount").getElementsByTagName("span")[0].innerText=all
	}
}
function edit(edit){
	if(edit){
		document.getElementsByClassName("start")[0].style.display="none"
		document.getElementsByClassName("edit")[0].style.display="block"
		document.getElementsByTagName("footer")[0].style.display="block"
		newBack.onclick=newDoc
	}else{
		document.getElementsByClassName("start")[0].style.display=
		document.getElementsByClassName("edit")[0].style.display=
		document.getElementsByTagName("footer")[0].style.display=""
		newBack.onclick=function(){
			history.go(-1)
		}
	}
}
function find(){
	setText(document.getElementsByTagName("textarea")[0].value,true)
	showPrompt([
		"Find what",
		"查找内容"
	],function(e){
		showPrompt([
			"Replace with",
			"替换为"
		],function(replaceWith){
			try{
				setText(document.getElementsByTagName("textarea")[0].value.replace(new RegExp(e,"g"),replaceWith))
			}catch(e){
				showToast(e.message)
			}
		},null,null,function(){
			try{
				setText(document.getElementsByTagName("textarea")[0].value.replace(new RegExp(e,"g"),""))
			}catch(e){
				showToast(e.message)
			}
		})
	},"text",null,null,function(){
		setText(document.getElementsByTagName("textarea")[0].value,true)
	},function(e){
		if(e&&e){
			try{
				e=e.replace(/</g,"&lt;").
				replace(/>/g,"&gt;")
				document.getElementsByClassName("text-view")[0].innerHTML=document.getElementsByClassName("text-view")[0].innerText.
				replace(/</g,"&lt;").
				replace(/>/g,"&gt;").
				replace(new RegExp(e,"g"),"<span class=\"highlight-find\">$&</span>").
				replace(/\n/g,"<br>")
			}catch(e){}
		}else{
			setText(document.getElementsByTagName("textarea")[0].value,true)
		}
	})
}
function generateWebPage(edit){
	if(!isEmpty()){
		encrypt=false
		save(function(){
			ajax({
				"url":backend+"userdata/domain/add",
				"data":{
					"domain":getURL().domain,
					"redirect":302,
					"to":"text/"+login.username+"/"+getURL().index,
					"username":login.username
				},
				"method":"POST",
				"dataType":"json",
				"showLoading":true,
				"success":function(e){
					var url
					if(e.available){
						url=getURL().short
					}else{
						url=getURL().original
					}
					if(edit){
						url+="?"+encodeData({
							"edit":true
						})
					}
					url=decodeURI(url)
					showPrompt(null,function(){
						openWebPage(url)
					},"url",url)
				},
				"error":error
			})
		})
	}
}
function getURL(){
	if(currentItem&&savedText.text[currentItem-1]&&!savedText.text[currentItem-1].encrypt){
		var index=(function(){
			if(savedText.text[currentItem-1].created){
				return savedText.text[currentItem-1].created
			}else{
				return currentItem
			}
		})(),
		short=encodeURIComponent(document.getElementsByTagName("input")[0].value.replace(/:|\//g,""))
		if(!short){
			short=MD5(login.username+index).substr(0,6)
		}
		return{
			"domain":short,
			"index":index,
			"original":secondary+login.username+"/"+index,
			"short":secondary+short
		}
	}
}
function isEmpty(){
	if(!document.getElementsByTagName("textarea")[0].value){
		setText(document.getElementsByTagName("textarea")[0].value.replace(/\/\*\s|\s\*\//g,"").trim())
		if(!document.getElementsByTagName("textarea")[0].value){
			showAlert([
				"The text cannot be empty",
				"文本不能为空"
			])
			return true
		}else{
			return false
		}
	}else{
		return false
	}
}
function load(){
	if(!savedText){
		savedText={
			"text":[],
			"time":new Date().getTime(),
			"username":""
		}
	}
	for(var i=0;i<9999;i++){
		var oldText=localStorage.getItem("Text"+i)
		if(oldText){
			savedText.text.push({
				"encrypt":false,
				"text":oldText,
				"time":new Date().toLocaleString(),
				"title":localStorage.getItem("Text"+i+"Title")
			})
			localStorage.removeItem("Text"+i)
			localStorage.removeItem("Text"+i+"Title")
		}
	}
	localStorage.setItem("SavedText",JSON.stringify(savedText))
	var loadSavedText=function(){
		if(savedText&&savedText.text&&savedText.text[0]){
			document.getElementById("SavedText").innerHTML=""
			for(var i=savedText.text.length-1;i>=0;i--){
				var newLi=document.createElement("li")
				newLi.classList.add("menu")
				if(savedText.text[i].title){
					newLi.innerText=savedText.text[i].title
				}else{
					if(savedText.text[i].encrypt){
						if(only(isNumber,savedText.text[i].text)){
							newLi.innerText=decrypt(savedText.text[i].text,"RTH")
						}else{
							newLi.innerText=decrypt(atob(savedText.text[i].text),"RTH")
						}
					}else{
						newLi.innerText=savedText.text[i].text
					}
				}
				newLi.setAttribute("number",i+1)
				newLi.onclick=function(){
					openText(this.getAttribute("number"))
				}
				document.getElementById("SavedText").appendChild(newLi)
			}
		}
	}
	loadSavedText()
	if(login.username){
		getUserData("text",function(e){
			if(e.username==savedText.username){
				if(e.time>savedText.time){
					savedText=e
				}
			}else{
				savedText.text=savedText.text.concat(e.text)
				savedText.time=new Date().getTime()
				savedText.username=login.username
			}
			if(JSON.stringify(savedText)!=JSON.stringify(e)&&savedText.text.length>0){
				submit(loadSavedText)
			}else if(savedText.text.length<=0){
				savedText=e
				loadSavedText()
			}else{
				loadSavedText()
			}
		},function(e){
			if(e.status!=0&&savedText.text.length>0){
				submit(loadSavedText)
			}else{
				loadSavedText()
			}
		})
	}
}
function newDoc(){
	if(!document.getElementsByClassName("start")[0].style.display){
		loginRequired(function(){
			edit(true)
			document.getElementById("Created").getElementsByTagName("span")[0].innerText=
			document.getElementById("Modified").getElementsByTagName("span")[0].innerText=new Date().toLocaleString()
		})
	}else{
		reload()
	}
}
function openLText(file){
	if(file.type.indexOf("text/")!=-1||file.name.toLowerCase().split(".")[1]=="txt"){
		var reader=new FileReader()
		reader.onload=function(){
			document.getElementsByTagName("input")[0].value=file.name
			setText(this.result)
			document.getElementById("Created").getElementsByTagName("span")[0].innerText=new Date().toLocaleString()
			document.getElementById("Modified").getElementsByTagName("span")[0].innerText=new Date(file.lastModified).toLocaleString()
			applyItem(0)
		}
		reader.readAsText(file)
	}else{
		showAlert([
			"Unable to open this type of file",
			"无法打开此类文件"
		])
	}
}
function openText(serialNumber){
	try{
		var text
		if(savedText.text[serialNumber-1].encrypt){
			if(only(isNumber,savedText.text[serialNumber-1].text)){
				text=decrypt(savedText.text[serialNumber-1].text,"RTH")
			}else{
				text=decrypt(atob(savedText.text[serialNumber-1].text),"RTH")
			}
		}else{
			encrypt=false
			text=savedText.text[serialNumber-1].text
		}
		setText(text)
		document.getElementsByTagName("input")[0].value=savedText.text[serialNumber-1].title
		document.getElementById("Created").getElementsByTagName("span")[0].innerText=new Date(savedText.text[serialNumber-1].created).toLocaleString()
		document.getElementById("Modified").getElementsByTagName("span")[0].innerText=savedText.text[serialNumber-1].time
		applyItem(serialNumber)
	}catch(e){
		savedText.text[serialNumber-1]=JSON.parse(savedText.text[serialNumber-1])
		openText(serialNumber)
	}
}
function reload(){
	scrollTo(0,0)
	currentItem=null
	setText("")
	document.getElementsByTagName("input")[0].value=
	document.getElementById("SavedText").innerHTML=""
	encrypt=true
	edit(false)
	load()
}
function runJSCode(fromShortcut){
	if(!isEmpty()){
		var code=document.getElementsByTagName("textarea")[0].value.replace(/coin|localStorage|runJSCode|runTrue/gi,"").replace(/console.log/g,"showToast")
		var runTrue=function(){
			try{
				var result=calc(code)
				if(result!=undefined){
					if(typeof result!="string"){
						result=JSON.stringify(result)
					}
					showPrompt(null,null,null,result)
				}
			}catch(e){
				if(fromShortcut){
					speak(document.getElementsByTagName("textarea")[0].value)
				}else{
					showToast(e.message)
				}
			}
		}
		if(code.indexOf("switch(language)")==-1){
			if(/cordova|eval|require/.test(code)){
				showConfirm([
					"This code can harm your device",
					"此代码可能会对您的设备有害"
				],runTrue)
			}else{
				runTrue()
			}
		}else{
			runTrue()
		}
	}
}
function save(callback){
	loginRequired(function(){
		var text,
		time=new Date().toLocaleString()
		if(encrypt){
			text=encryptText(document.getElementsByTagName("textarea")[0].value,"RTH")
		}else{
			text=document.getElementsByTagName("textarea")[0].value
		}
		document.getElementById("Modified").getElementsByTagName("span")[0].innerText=time
		if(savedText&&savedText.text&&savedText.text[currentItem-1]){
			savedText.text[currentItem-1].encrypt=encrypt
			savedText.text[currentItem-1].text=text
			savedText.text[currentItem-1].time=time
			savedText.text[currentItem-1].title=document.getElementsByTagName("input")[0].value
			submit(function(){
				if(callback){
					callback()
				}
				applyItem(currentItem)
			},JSON.stringify(savedText.text[currentItem-1]),"text",currentItem)
		}else{
			try{
				if(savedText.text[0]){
					savedText.text.push({
						"created":new Date().getTime(),
						"encrypt":encrypt,
						"text":text,
						"time":time,
						"title":document.getElementsByTagName("input")[0].value
					})
				}else{
					savedText.text=[{
						"created":new Date().getTime(),
						"encrypt":encrypt,
						"text":text,
						"time":time,
						"title":document.getElementsByTagName("input")[0].value
					}]
				}
				currentItem=savedText.text.length
				submit(function(){
					if(callback){
						callback()
					}
					applyItem(currentItem)
				})
			}catch(e){
				if(savedText&&savedText.text){
					savedText.text=[JSON.parse(savedText.text)]
				}
			}
		}
	})
}
function setText(text,noScrolling){
	document.getElementsByTagName("textarea")[0].value=text
	if(text.indexOf("</")!=-1&&!/<(a|body|link|script|style)|\son/.test(text)){
		document.getElementsByClassName("text-view")[0].innerHTML=text.replace(/\u0009/g,"&nbsp;&nbsp;&nbsp;&nbsp;").replace(/\n/g,"<br>")
	}else{
		document.getElementsByClassName("text-view")[0].innerText=text.replace(/\u0009/g,"\u00a0\u00a0\u00a0\u00a0")
	}
	document.getElementsByTagName("textarea")[0].style.display=
	document.getElementsByClassName("text-view")[0].style.display=""
	if(!noScrolling){
		scrollTo(0,0)
	}
	count()
}
function submit(callback,text,key1,key2){
	savedText.time=new Date().getTime()
	localStorage.setItem("SavedText",JSON.stringify(savedText))
	var postData={
		"dir":"text/",
		"filename":login.username,
		"text":JSON.stringify(savedText),
		"ver":ver.split(".")[0]
	}
	if(key1){
		postData["key1"]=key1
		if(key2){
			postData["key2"]=key2
		}
		postData.text=text
		postData["time"]=savedText.time
	}
	if(getURL()){
		postData["url"]=getURL().short
	}
	ajax({
		"url":backend+"userdata/upload",
		"data":postData,
		"method":"POST",
		"showLoading":true,
		"success":function(){
			if(callback){
				callback()
			}
			showToast([
				"Changes are saved",
				"更改已保存"
			])
		},
		"error":function(){
			if(callback){
				callback()
			}
			showToast([
				"Changes are saved locally",
				"更改已本地保存"
			])
		}
	})
}
window.onkeydown=function(e){
	if(e.ctrlKey||e.metaKey){
		switch(e.keyCode){
			case 13:
			runJSCode(true)
			return false
			case 48:
			if(document.getElementsByClassName("start")[0].style.display){
				fontSize=16
				document.getElementsByTagName("textarea")[0].style.fontSize=
				document.getElementsByClassName("text-view")[0].style.fontSize=
				document.getElementsByTagName("textarea")[0].style.lineHeight=
				document.getElementsByClassName("text-view")[0].style.lineHeight=""
			}
			return false
			case 70:
			find()
			return false
			case 78:
			newDoc()
			return false
			case 79:
			openDialog()
			return false
			case 83:
			save()
			return false
			case 187:
			if(document.getElementsByClassName("start")[0].style.display){
				fontSize+=4
				document.getElementsByTagName("textarea")[0].style.fontSize=
				document.getElementsByClassName("text-view")[0].style.fontSize=fontSize+"px"
				document.getElementsByTagName("textarea")[0].style.lineHeight=
				document.getElementsByClassName("text-view")[0].style.lineHeight=(fontSize*3/2)+"px"
			}
			return false
			case 189:
			if(document.getElementsByClassName("start")[0].style.display&&fontSize>8){
				fontSize-=4
				document.getElementsByTagName("textarea")[0].style.fontSize=
				document.getElementsByClassName("text-view")[0].style.fontSize=fontSize+"px"
				document.getElementsByTagName("textarea")[0].style.lineHeight=
				document.getElementsByClassName("text-view")[0].style.lineHeight=(fontSize*3/2)+"px"
			}
			return false
		}
	}
}
document.getElementById("NewDocument").onclick=newDoc
document.getElementById("OpenLocalDocument").onclick=openDialog
document.getElementById("GetSource").onclick=function(){
	loginRequired(function(){
		showPrompt([
			"Enter the URL",
			"输入网址"
		],function(url){
			if(url.indexOf("/")==-1){
				url=url+"/"
			}
			if(url.indexOf("http")==-1){
				url="http://"+url
			}
			ajax({
				"url":backend+"get",
				"data":{
					"url":url,
					"username":login.username
				},
				"showLoading":true,
				"success":function(e){
					document.getElementsByTagName("input")[0].value=url
					setText(e)
					document.getElementById("Created").getElementsByTagName("span")[0].innerText=
					document.getElementById("Modified").getElementsByTagName("span")[0].innerText=new Date().toLocaleString()
					applyItem(0)
				},
				"error":function(e){
					if(e.status==403){
						showAlert([
							"Access denied",
							"拒绝访问"
						])
					}else if(e.status==404){
						showAlert([
							"404 Not Found",
							"404 未找到"
						])
					}else{
						error()
					}
				}
			})
		},"url")
	})
}
document.getElementsByTagName("textarea")[0].ondrop=function(e){
	setText(event.dataTransfer.getData("Text"))
	try{
		openLText(e.dataTransfer.files[0])
	}catch(e){}
	return false
}
document.getElementsByTagName("textarea")[0].oninput=count
document.getElementsByTagName("textarea")[0].onkeydown=function(e){
	switch(e.keyCode){
		case 9:
		document.execCommand("insertText",null,"\u0009")
		return false
		case 37:
		case 38:
		case 39:
		case 40:
		setTimeout(count,1)
	}
}
document.getElementsByTagName("textarea")[0].onmouseup=function(){
	setTimeout(count,1)
}
document.getElementsByTagName("textarea")[0].onselect=
document.getElementsByTagName("textarea")[0].ontouchstart=count
document.getElementsByClassName("text-view")[0].onclick=function(){
	this.style.display="none"
	document.getElementsByTagName("textarea")[0].style.display="block"
	document.getElementsByTagName("textarea")[0].focus()
}
document.getElementsByClassName("speaker")[0].onclick=function(){
	if(!isEmpty()){
		speak(document.getElementsByTagName("textarea")[0].value)
	}
}
document.getElementById("Save").onclick=function(){
	save()
}
document.getElementById("RunJSCode").onclick=function(){
	runJSCode(false)
}
document.getElementById("Share").onclick=function(){
	generateWebPage(true)
}
document.getElementById("SaveAs").onclick=function(){
	var filename=document.getElementsByTagName("input")[0].value
	if(filename==""){
		switch(language){
			case "SimplifiedChinese":
			filename="文本文档"
			break
			default:
			filename="Text Document"
		}
	}
	if(filename.indexOf(".")==-1){
		filename+=".txt"
	}
	var dl=document.createElement("a")
	dl.setAttribute("href","data:text/plain;charset=utf-8,"+encodeURIComponent(document.getElementsByTagName("textarea")[0].value))
	dl.setAttribute("download",filename)
	dl.click()
}
document.getElementById("Delete").onclick=function(){
	showConfirm([
		"Do you want to delete this text document?",
		"您想删除此文本文档吗？"
	],function(){
		if(currentItem){
			if(!login.username||savedText.text[currentItem-1].encrypt){
				savedText.text.splice(currentItem-1,1)
				submit(reload)
			}else{
				ajax({
					"url":backend+"userdata/domain/del",
					"data":{
						"domain":getURL().domain,
						"username":login.username
					},
					"method":"POST",
					"showLoading":true,
					"success":function(){
						savedText.text.splice(currentItem-1,1)
						submit(reload)
					},
					"error":error
				})
			}
		}else{
			reload()
		}
	})
}
document.getElementById("FindReplace").onclick=function(){
	find()
}
document.getElementById("CreateMessageBox").onclick=function(){
	if(!isEmpty()){
		alert(document.getElementsByTagName("textarea")[0].value)
	}
}
document.getElementById("GenerateQRCode").onclick=function(){
	if(!isEmpty()){
		if(document.getElementsByTagName("textarea")[0].value.indexOf("\n")!=-1){
			encrypt=false
			save(function(){
				showQRCode(getURL().original)
			})
		}else{
			showQRCode(document.getElementsByTagName("textarea")[0].value)
		}
	}
}
document.getElementById("GenerateWebPage").onclick=function(){
	if(document.getElementsByTagName("textarea")[0].value.indexOf("<body")!=-1){
		showConfirm([
			"It is recommended to use RTH Virtual Host Manager",
			"建议使用 RTH 虚拟主机管理器"
		],function(){
			openWebPage("https://rthsoftware.cn/vhost/",false,true)
		})
	}else{
		generateWebPage()
	}
}
document.getElementById("OpenFile").onchange=function(e){
	openLText(e.target.files[0])
}
switch(language){
	case "SimplifiedChinese":
	document.title="文本编辑器"
	document.getElementById("NewDocument").innerText="新建文档"
	document.getElementById("OpenLocalDocument").innerText="打开本地文件"
	document.getElementById("GetSource").innerText="获取网页源代码"
	document.getElementsByTagName("input")[0].placeholder="标题"
	document.getElementById("Save").innerText="保存"
	document.getElementById("RunJSCode").innerText="运行"
	document.getElementById("WordCount").innerHTML="字数统计：<span>0</span>"
	document.getElementById("Created").innerHTML="创建时间：<span></span>"
	document.getElementById("Modified").innerHTML="修改时间：<span></span>"
	document.getElementById("FindReplace").innerText="查找和替换"
	document.getElementById("Share").innerText="共享"
	document.getElementById("SaveAs").innerText="另存为"
	document.getElementById("Delete").innerText="删除"
	document.getElementById("CreateMessageBox").innerText="创建消息框"
	document.getElementById("GenerateQRCode").innerText="生成二维码"
	document.getElementById("GenerateWebPage").innerText="生成网页"
	break
	default:
	document.title="Text Editor"
	document.getElementById("NewDocument").innerText="New Document"
	document.getElementById("OpenLocalDocument").innerText="Open Local Document"
	document.getElementById("GetSource").innerText="Get Source Code of Web Page"
	document.getElementsByTagName("input")[0].placeholder="Title"
	document.getElementById("Save").innerText="Save"
	document.getElementById("RunJSCode").innerText="Run"
	document.getElementById("WordCount").innerHTML="Word Count: <span>0</span>"
	document.getElementById("Created").innerHTML="Created: <span></span>"
	document.getElementById("Modified").innerHTML="Modified: <span></span>"
	document.getElementById("FindReplace").innerText="Find & Replace"
	document.getElementById("Share").innerText="Share"
	document.getElementById("SaveAs").innerText="Save As"
	document.getElementById("Delete").innerText="Delete"
	document.getElementById("CreateMessageBox").innerText="Create Message Box"
	document.getElementById("GenerateQRCode").innerText="Generate QR Code"
	document.getElementById("GenerateWebPage").innerText="Generate Web Page"
}
newTitle.innerText=document.title
if(isLinux||isMobile){
	document.getElementById("SaveAs").style.display="none"
}
load()
if($_GET["index"]&&$_GET["username"]){
	newBack.onclick=function(){
		openWindow("index")
	}
	ajax({
		"url":backend+"getpage",
		"data":{
			"index":$_GET["index"],
			"username":$_GET["username"]
		},
		"dataType":"json",
		"showLoading":true,
		"success":function(e){
			if(e.text){
				document.getElementsByTagName("input")[0].value=e.title
				setText(e.text)
				document.getElementById("Created").getElementsByTagName("span")[0].innerText=
				document.getElementById("Modified").getElementsByTagName("span")[0].innerText=new Date().toLocaleString()
				applyItem(0)
			}else if(e.error){
				switch(e.error){
					case 403:
					showAlert([
						"This text document has been encrypted",
						"此文本文档已被加密"
					])
					break
					case 404:
					showAlert([
						"This text document has been deleted",
						"此文本文档已被删除"
					])
				}
			}
		}
	})
}else if(!login.username){
	loginDialog()
}
