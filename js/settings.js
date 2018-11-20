/*Code written by Shangzhen Yang*/
document.getElementById("LanguageSelect").onchange=function(){
	if(this.value!=language){
		localStorage.setItem("Language",this.value)
		localStorage.removeItem("Quote")
		restart()
	}
}
document.getElementById("ThemeSelect").onchange=function(){
	if(this.value!=theme){
		localStorage.setItem("Theme",this.value)
		restart()
	}
}
document.getElementById("Login").onclick=loginDialog
document.getElementById("ChangePassword").onclick=function(){
	showPrompt([
		"Enter your current password",
		"输入您的当前密码"
	],function(e){
		ajax({
			"url":backend+"userdata/verify",
			"data":{
				"email":login.email,
				"password":MD5(e)
			},
			"dataType":"json",
			"showLoading":true,
			"success":function(verifyResult){
				if(verifyResult.pass){
					showPrompt([
						"Enter a new password",
						"输入新密码"
					],function(newPassword){
						showPrompt([
							"Enter the new password again",
							"再次输入新密码"
						],function(confirmPassword){
							if(confirmPassword==newPassword){
								localStorage.setItem("Password",MD5(newPassword))
								ajax({
									"url":backend+"reset",
									"data":{
										"index":verifyResult.index,
										"passwordmd5":MD5(newPassword)
									},
									"method":"POST",
									"showLoading":true,
									"success":function(){
										showAlert([
											"The password is changed",
											"密码已更改"
										])
									},
									"error":error
								})
							}else{
								showAlert([
									"The two passwords you entered are inconsistent",
									"两次输入的密码不一致"
								])
							}
						},"password")
					},"password")
				}else{
					showAlert([
						"Incorrect password",
						"密码错误"
					])
				}
			}
		})
	},"password")
}
document.getElementById("ChangeEmail").onclick=function(){
	showPrompt([
		"Enter your current password",
		"输入您的当前密码"
	],function(e){
		ajax({
			"url":backend+"userdata/verify",
			"data":{
				"email":login.email,
				"password":MD5(e)
			},
			"dataType":"json",
			"showLoading":true,
			"success":function(verifyResult){
				if(verifyResult.pass){
					showPrompt([
						"Enter the new email address",
						"输入新电子邮箱地址"
					],function(newEmail){
						ajax({
							"url":backend+"userdata/verify",
							"data":{
								"email":newEmail,
								"password":login.password
							},
							"dataType":"json",
							"showLoading":true,
							"success":function(newVerify){
								if(newVerify.index>0){
									showAlert([
										"This email address has already been occupied",
										"此电子邮箱地址已被占用"
									])
								}else{
									showPrompt([
										"Enter the new email address again",
										"再次输入新电子邮箱地址"
									],function(confirmEmail){
										if(confirmEmail==newEmail){
											localStorage.setItem("Email",newEmail)
											ajax({
												"url":backend+"reset",
												"data":{
													"index":verifyResult.index,
													"newemail":newEmail
												},
												"method":"POST",
												"showLoading":true,
												"success":function(){
													showAlert([
														"The email address is changed",
														"电子邮箱地址已更改"
													])
													location.reload()
												},
												"error":error
											})
										}else{
											showAlert([
												"The two email addresses you entered are inconsistent",
												"两次输入的电子邮箱地址不一致"
											])
										}
									},"email")
								}
							},
							"error":error
						})
					},"email")
				}else{
					showAlert([
						"Incorrect password",
						"密码错误"
					])
				}
			},
			"error":error
		})
	},"password")
}
document.getElementById("DeleteAccount").onclick=function(){
	showConfirm([
		"This will delete all your data on the server",
		"此操作将在服务器上删除您的所有数据"
	],function(){
		showPrompt([
			"Enter your current password",
			"输入您的当前密码"
		],function(e){
			ajax({
				"url":backend+"userdata/verify",
				"data":{
					"email":login.email,
					"password":MD5(e)
				},
				"dataType":"json",
				"showLoading":true,
				"success":function(verifyResult){
					if(verifyResult.pass){
						ajax({
							"url":backend+"userdata/remove",
							"data":{
								"index":verifyResult.index,
								"username":login.username
							},
							"method":"POST",
							"success":logOut,
							"error":error
						})
					}else{
						showAlert([
							"Incorrect password",
							"密码错误"
						])
					}
				},
				"error":error
			})
		},"password")
	})
}
document.getElementById("LogOut").onclick=logOut
document.getElementById("ClearLocalStorage").onclick=function(){
	showConfirm([
		"Do you want to clear the local storage?",
		"您想清空本地存储吗？"
	],clearLocalStorage)
}
document.getElementById("About").onclick=function(){
	openWindow("about")
}
switch(language){
	case "SimplifiedChinese":
	document.title="设置"
	document.getElementById("Language").innerText="语言"
	document.getElementById("Theme").innerText="主题"
	document.getElementById("ThemeSelect").options.add(new Option("浅色","Light"))
	document.getElementById("ThemeSelect").options.add(new Option("深色","Dark"))
	document.getElementById("ThemeSelect").options.add(new Option("自动","Automatic"))
	document.getElementById("ThemeSelect").options.add(new Option("必应","Bing"))
	document.getElementById("MyEmail").innerText="未登录"
	document.getElementById("Login").innerText="登录"
	document.getElementById("ChangePassword").innerText="更改密码"
	document.getElementById("ChangeEmail").innerText="更改电子邮箱"
	document.getElementById("DeleteAccount").innerText="删除账号"
	document.getElementById("LogOut").innerText="退出登录"
	document.getElementById("ClearLocalStorage").innerText="清空本地存储"
	document.getElementById("Introduction").innerText="您可以在 "+officialWebsite+" 查看您保存的单词表和文本文档。"
	document.getElementById("About").innerText="关于 RTH 工具箱"
	break
	default:
	document.title="Settings"
	document.getElementById("Language").innerText="Language"
	document.getElementById("Theme").innerText="Theme"
	document.getElementById("ThemeSelect").options.add(new Option("Light","Light"))
	document.getElementById("ThemeSelect").options.add(new Option("Dark","Dark"))
	document.getElementById("ThemeSelect").options.add(new Option("Automatic","Automatic"))
	document.getElementById("ThemeSelect").options.add(new Option("Bing","Bing"))
	document.getElementById("MyEmail").innerText="Not logged in"
	document.getElementById("Login").innerText="Login"
	document.getElementById("ChangePassword").innerText="Change Password"
	document.getElementById("ChangeEmail").innerText="Change Email"
	document.getElementById("DeleteAccount").innerText="Delete Account"
	document.getElementById("LogOut").innerText="Log Out"
	document.getElementById("ClearLocalStorage").innerText="Clear Local Storage"
	document.getElementById("Introduction").innerText="You can view your saved word lists and text documents at "+officialWebsite+"."
	document.getElementById("About").innerText="About RTH Toolbox"
}
newTitle.innerText=document.title
document.getElementById("LanguageSelect").value=language
document.getElementById("ThemeSelect").value=theme
if(login.username){
	document.getElementById("MyEmail").innerText=login.email
	document.getElementById("Login").style.display="none"
	document.getElementById("MyAccount").style.display="block"
}