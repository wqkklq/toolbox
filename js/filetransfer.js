/*Code written by Shangzhen Yang*/
function downloadFile(code,index){
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
				if(e.multifile.length>1&&!index){
					openWebPage("https://www.rthsoftware.net/airportal/?code="+code,true)
				}else{
					if(!index||index<0){
						index=0
					}
					openWebPage(e.multifile[index].download,true)
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
					for(var file=0;file<e[i].multifile.length;file++){
						var newLi=document.createElement("li")
						newLi.classList.add("menu")
						newLi.innerText=e[i].multifile[file].name
						newLi.setAttribute("code",e[i].code)
						if(e[i].multifile.length>1){
							newLi.setAttribute("index",file+1)
						}
						newLi.oncontextmenu=
						newLi.onclick=function(mouse){
							var code=this.getAttribute("code")
							index=this.getAttribute("index")-1,
							name=this.innerText
							showMenu(mouse,[{
								"onclick":function(){
									showQRCode("https://www.rthsoftware.net/airportal/?code="+code)
									closeMenu()
								},
								"text":[
									"QR Code",
									"二维码"
								]
							},{
								"onclick":function(){
									showPrompt(null,function(){
										openWebPage(secondary+code)
									},null,"http://rthe.cn/"+code)
									closeMenu()
								},
								"text":[
									"Link",
									"链接"
								]
							},{
								"onclick":function(){
									if(index>-1){
										name=code
									}
									showConfirm([
										"Do you want to delete "+name+"?",
										"您想删除 "+name+" 吗？"
									],function(){
										ajax({
											"url":backend+"userdata/file/del",
											"data":{
												"code":code,
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
										downloadFile(code,index)
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
document.getElementById("UseAirPortal").onclick=function(){
	openWebPage("https://www.rthsoftware.net/airportal/")
}
document.getElementById("OpenFile").onchange=function(e){
	var file=e.target.files[0]
	if(file.type=="text/php"||file.name.indexOf(".php")!=-1){
		showAlert([
			"This type of file is not allowed to be transferred",
			"不允许传输的文件类型"
		])
	}else if(file.size>10485760){
		showConfirm([
			"This file needs to be sent by AirPortal",
			"此文件需要由 AirPortal 发送"
		],function(){
			openWebPage("https://www.rthsoftware.net/airportal/",true)
		})
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
					newQRCodeButton=document.createElement("button"),
					newLinkButton=document.createElement("button"),
					newCloseDiv=document.createElement("div")
					newDiv.classList.add("popup")
					newNumDiv.classList.add("number")
					newNumDiv.innerText=e.code
					newQRCodeButton.onclick=function(){
						showQRCode("https://www.rthsoftware.net/airportal/?code="+e.code)
					}
					newLinkButton.onclick=function(){
						showPrompt(null,function(){
							openWebPage(secondary+e.code)
						},null,"http://rthe.cn/"+e.code)
					}
					newCloseDiv.classList.add("close")
					newCloseDiv.innerText="×"
					newCloseDiv.onclick=closeDialog
					switch(language){
						case "SimplifiedChinese":
						newH1.innerText="密码"
						newQRCodeButton.innerText="二维码"
						newLinkButton.innerText="链接"
						break
						default:
						newH1.innerText="Code"
						newQRCodeButton.innerText="QR Code"
						newLinkButton.innerText="Link"
					}
					newDiv.appendChild(newH1)
					newDiv.appendChild(newNumDiv)
					newDiv.appendChild(newQRCodeButton)
					newDiv.appendChild(newLinkButton)
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
	document.getElementById("UseAirPortal").innerText="使用 AirPortal"
	document.getElementsByTagName("p")[0].innerText="您发送的文件将在 24 小时后失效。"
	break
	default:
	document.title="File Transfer"
	document.getElementById("SendFile").innerText="Send File"
	document.getElementById("ReceiveFile").innerText="Receive File"
	document.getElementById("UseAirPortal").innerText="Use AirPortal"
	document.getElementsByTagName("p")[0].innerText="Files you sent will expire in 24 hours."
}
newTitle.innerText=document.title
if(login.username){
	load()
}
