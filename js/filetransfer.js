/*Code written by Shangzhen Yang*/
function downloadFile(code){
	if(isTencent){
		showAlert([
			"Please open this page in the browser",
			"请在浏览器中打开此页面"
		])
	}else if(code){
		ajax({
			"url":backend+"userdata/file/getinfo",
			"data":{
				"code":code
			},
			"dataType":"json",
			"showLoading":true,
			"success":function(e){
				if(document.getElementById("File"+code)){
					document.getElementById("File"+code).classList.add("unavailable")
				}
				if(isApp){
					openWebPage(e.download)
				}else{
					location.href=e.download
				}
			},
			"error":function(e){
				if(e.status==200){
					showAlert([
						"File does not exist",
						"文件不存在"
					])
				}else{
					error()
				}
			}
		})
	}
}
function load(){
	if(login.username){
		document.getElementById("MyFile").innerHTML=""
		ajax({
			"url":backend+"userdata/file/get",
			"data":{
				"username":login.username
			},
			"dataType":"json",
			"showLoading":true,
			"success":function(e){
				for(var i=e.length-1;i>=0;i--){
					var newLi=document.createElement("li")
					newLi.classList.add("menu")
					if(e[i].download){
						newLi.classList.add("unavailable")
					}
					newLi.id="File"+e[i].code
					newLi.innerText=e[i].name
					newLi.oncontextmenu=
					newLi.onclick=function(mouse){
						var index=this.id.replace("File","")*1,
						name=this.innerText
						showMenu(mouse,[{
							"onclick":function(){
								showQRCode(toolboxOnline+"filetransfer?code="+index)
								closeMenu()
							},
							"text":[
								"QR Code",
								"二维码"
							]
						},{
							"onclick":function(){
								showConfirm([
									"Do you want to delete "+name+"?",
									"您想删除 "+name+" 吗？"
								],function(){
									ajax({
										"url":backend+"userdata/file/del",
										"data":{
											"code":index,
											"username":login.username
										},
										"method":"POST",
										"showLoading":true,
										"success":load,
										"error":error
									})
								})
								closeMenu()
							},
							"text":[
								"Delete",
								"删除"
							]
						},{
							"onclick":function(){
								showConfirm([
									"Do you want to download "+name+"?",
									"您想下载 "+name+" 吗？"
								],function(){
									downloadFile(index)
								})
								closeMenu()
							},
							"text":[
								"Download",
								"下载"
							]
						}])
						return false
					}
					document.getElementById("MyFile").appendChild(newLi)
				}
			}
		})
	}
}
document.getElementById("SendFile").onclick=function(){
	document.getElementById("OpenFile").value=""
	document.getElementById("OpenFile").click()
}
document.getElementById("ReceiveFile").onclick=function(){
	showPrompt([
		"Enter the code",
		"输入密码"
	],downloadFile,"tel")
}
document.getElementById("OpenFile").onchange=function(e){
	var file=e.target.files[0]
	if(file.type=="text/php"){
		showAlert([
			"This type of file is not allowed to be transferred",
			"不允许传输的文件类型"
		])
	}else if(file.size>104857600){
		showAlert([
			"File exceeds 100MB and cannot be transferred",
			"文件超过 100MB，无法传输"
		])
	}else{
		ajax({
			"url":backend+"userdata/file/upload",
			"data":{
				"file":file,
				"username":login.username
			},
			"dataType":"json",
			"method":"POST",
			"processData":false,
			"showLoading":true,
			"success":function(e){
				if(e.error){
					alert(e.error)
				}else{
					var closeDialog=function(){
						if(document.getElementsByClassName("popup")[0]){
							document.getElementsByClassName("popup")[0].style.opacity=""
							setTimeout(function(){
								try{
									document.body.removeChild(document.getElementsByClassName("popup")[0])
								}catch(e){}
							},250)
						}
					},
					newDiv=document.createElement("div"),
					newH1=document.createElement("h1"),
					newNumDiv=document.createElement("div"),
					newButton=document.createElement("button"),
					newCloseDiv=document.createElement("div")
					newDiv.classList.add("popup")
					newNumDiv.classList.add("number")
					newNumDiv.innerText=e.code
					newButton.style.width="100%"
					newButton.onclick=function(){
						closeDialog()
						showQRCode(toolboxOnline+"filetransfer?code="+e.code)
					}
					newCloseDiv.classList.add("close")
					newCloseDiv.innerText="×"
					newCloseDiv.onclick=closeDialog
					switch(language){
						case "SimplifiedChinese":
						newH1.innerText="密码"
						newButton.innerText="查看二维码"
						break
						default:
						newH1.innerText="Code"
						newButton.innerText="View QR Code"
					}
					newDiv.appendChild(newH1)
					newDiv.appendChild(newNumDiv)
					newDiv.appendChild(newButton)
					newDiv.appendChild(newCloseDiv)
					document.body.appendChild(newDiv)
					newDiv.style.top="calc(50% - "+(newDiv.offsetHeight/2)+"px)"
					setTimeout(function(){
						newDiv.style.opacity="1"
					},25)
					load()
				}
			},
			"error":error
		})
	}
}
switch(language){
	case "SimplifiedChinese":
	document.title="文件传输"
	document.getElementById("SendFile").innerText="发送文件"
	document.getElementById("ReceiveFile").innerText="接收文件"
	document.getElementsByTagName("p")[0].innerText="您发送的文件将在一小时后失效。"
	break
	default:
	document.title="File Transfer"
	document.getElementById("SendFile").innerText="Send File"
	document.getElementById("ReceiveFile").innerText="Receive File"
	document.getElementsByTagName("p")[0].innerText="Files you sent will expire in an hour."
}
newTitle.innerText=document.title
if(login.username){
	load()
}else{
	loginDialog()
}
if($_GET["code"]){
	downloadFile($_GET["code"])
}
