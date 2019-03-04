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
				"code":code,
				"username":function(){
					if(login.username){
						return login.username
					}else{
						return "null"
					}
				}()
			},
			"dataType":"json",
			"showLoading":true,
			"success":function(e){
				if(e.download===false){
					showAlert([
						"You do not have permission to download this file",
						"您没有下载此文件的权限"
					])
				}else{
					openWebPage(e.download,true)
				}
			},
			"error":function(e){
				if(e.status==200){
					showAlert([
						"File does not exist",
						"文件不存在"
					])
				}else{
					error(e)
				}
			}
		})
	}
}
function load(){
	document.getElementById("MyFile").innerHTML=""
	ajax({
		"url":backend+"userdata/file/get",
		"data":{
			"token":login.token,
			"username":login.username
		},
		"dataType":"json",
		"showLoading":true,
		"success":function(e){
			for(var i=e.length-1;i>=0;i--){
				var newLi=document.createElement("li")
				newLi.classList.add("menu")
				newLi.innerText=decodeURIComponent(e[i].name)
				newLi.setAttribute("code",e[i].code)
				newLi.oncontextmenu=
				newLi.onclick=function(mouse){
					var code=this.getAttribute("code")
					name=this.innerText
					showMenu(mouse,[{
						"onclick":function(){
							showQRCode(secondary+code)
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
							},null,secondary+code)
							closeMenu()
						},
						"text":[
							"Link",
							"链接"
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
								downloadFile(code)
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
document.getElementById("OpenFile").onchange=function(input){
	var files=[]
	for(var i=0;i<input.target.files.length;i++){
		if(input.target.files[i].name.indexOf(".php")!=-1||input.target.files[i].type=="text/php"){
			showAlert([
				"Transferring PHP files is not allowed",
				"不允许传输 PHP 文件"
			])
		}else if(input.target.files[i].size>1073741824){
			showAlert([
				"Transferring files larger than 1024 MB is not allowed",
				"不允许传输大于 1024 MB 的文件"
			])
		}else{
			files.push({
				"name":input.target.files[i].name,
				"progress":0,
				"type":input.target.files[i].type,
				"size":input.target.files[i].size
			})
		}
	}
	if(files.length>0){
		var newToast=showToast()
		var uploadSuccess=function(code){
			newToast.close()
			var closeDialog=function(){
				if(document.getElementsByClassName("popup")[0]){
					removeElement(document.getElementsByClassName("popup")[0])
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
			newNumDiv.innerText=code
			newQRCodeButton.onclick=function(){
				showQRCode(secondary+code)
			}
			newLinkButton.onclick=function(){
				showPrompt(null,function(){
					openWebPage(secondary+code)
				},null,secondary+code)
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
		if(files.length<=1&&files[0].size<=10240000){
			newToast.show(["Uploading","正在上传"])
			ajax({
				"url":backend+"userdata/file/upload",
				"data":{
					"file":input.target.files[0],
					"username":login.username
				},
				"dataType":"json",
				"method":"POST",
				"success":function(e){
					if(e.error){
						newToast.close()
						alert(e.error)
					}else{
						uploadSuccess(e.code)
					}
				},
				"error":function(e){
					newToast.close()
					error(e)
				}
			})
		}else{
			newToast.show(["Pending","等待响应"])
			ajax({
				"url":backend+"userdata/file/getcode",
				"data":{
					"info":JSON.stringify(files),
					"username":login.username
				},
				"dataType":"json",
				"method":"POST",
				"success":function(code){
					var upload=function(fileIndex){
						var fileSlice=[],
						sliceSize=10240000,
						thisFile=input.target.files[fileIndex],
						uploadSlice=function(uploadProgress){
							ajax({
								"url":backend+"userdata/file/uploadslice",
								"data":{
									"code":code,
									"file":fileSlice[uploadProgress],
									"index":fileIndex+1,
									"progress":uploadProgress+1
								},
								"dataType":"json",
								"method":"POST",
								"success":function(e){
									if(e.error){
										newToast.close()
										alert(e.error)
									}else if(e.success==uploadProgress+1){
										if(uploadProgress==fileSlice.length-1){
											if(fileIndex==input.target.files.length-1){
												uploadSuccess(code)
											}else{
												setTimeout(function(){
													upload(fileIndex+1)
												},1000)
											}
										}else{
											uploadProgress++
											newToast.show(Math.round(uploadProgress/fileSlice.length*100)+"%")
											uploadSlice(uploadProgress)
										}
									}
								},
								"error":function(e){
									if(e.status==0){
										if(thisFile.size<104857600){
											fileSlice=[thisFile]
											uploadSlice(0)
										}else{
											newToast.close()
											showAlert([
												"Unable to send files larger than 100 MB on this device",
												"无法在此设备上发送大于 100 MB 的文件"
											])
										}
									}else{
										error(e)
									}
								}
							})
						}
						if(thisFile.size>10240000){
							for(var i=0;i<thisFile.size/sliceSize;i++){
								fileSlice.push(thisFile.slice(i*sliceSize,(i+1)*sliceSize))
							}
						}else{
							fileSlice.push(thisFile)
						}
						uploadSlice(0)
					}
					newToast.show(["Uploading","正在上传"])
					upload(0)
				},
				"error":function(e){
					newToast.close()
					if(e.status==402){
						showConfirm([
							"This file needs to be sent by AirPortal",
							"此文件需要由 AirPortal 发送"
						],function(){
							openWebPage("https://rthsoftware.cn/airportal/",true,true)
						})
					}else{
						error(e)
					}
				}
			})
		}
	}
}
switch(language){
	case "SimplifiedChinese":
	document.title="文件传输"
	document.getElementById("SendFile").innerText="发送文件"
	document.getElementById("ReceiveFile").innerText="接收文件"
	break
	default:
	document.title="File Transfer"
	document.getElementById("SendFile").innerText="Send File"
	document.getElementById("ReceiveFile").innerText="Receive File"
}
newTitle.innerText=document.title
load()
