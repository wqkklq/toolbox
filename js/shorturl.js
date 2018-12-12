/*Code written by Shangzhen Yang*/
var defaultShortURL,
myURL=localStorage.getItem("MyURL"),
shortURL="http://rthe.cn/"
function load(){
	defaultShortURL=Math.round(new Date().getTime()/1000*Math.random()).toString(36)
	document.getElementById("ShortURLInput").value=shortURL+defaultShortURL
	document.getElementById("OriginalURLInput").value=""
	if(login.username){
		ajax({
			"url":backend+"userdata/domain/get",
			"data":{
				"shorturl":true,
				"username":login.username
			},
			"dataType":"json",
			"showLoading":true,
			"success":function(e){
				myURL=e
				localStorage.setItem("MyURL",JSON.stringify(myURL))
				loadMyURL()
			}
		})
	}
}
function loadMyURL(){
	document.getElementById("MyURL").innerHTML=""
	for(var i=myURL.length-1;i>=0;i--){
		var newLi=document.createElement("li")
		newLi.classList.add("menu")
		newLi.innerText=decodeURIComponent(myURL[i].name)
		newLi.setAttribute("number",i+1)
		newLi.oncontextmenu=
		newLi.onclick=function(mouse){
			var index=this.getAttribute("number")*1-1
			var url=secondary+myURL[index].name
			showMenu(mouse,[{
				"onclick":function(){
					showPrompt(null,function(){
						openWebPage(decodeURI(url))
					},null,shortURL+decodeURIComponent(myURL[index].name))
					closeMenu()
				},
				"text":[
					"Open",
					"打开"
				]
			},{
				"onclick":function(){
					showQRCode(url)
					closeMenu()
				},
				"text":[
					"QR Code",
					"二维码"
				]
			},{
				"onclick":function(){
					showPrompt([
						"Change "+myURL[index].to+" to",
						"把 "+myURL[index].to+" 更改为"
					],function(e){
						if(e.indexOf("rthe.cn")!=-1){
							showAlert([
								"Short URLs cannot be the original URL",
								"短网址不能作为原网址"
							])
						}else{
							if(e.indexOf("/")==-1){
								e=e+"/"
							}
							if(e.indexOf("http")==-1){
								e="http://"+e
							}
							ajax({
								"url":backend+"userdata/upload",
								"data":{
									"dir":"domain/",
									"filename":"list",
									"key1":myURL[index].name,
									"key2":"to",
									"text":e,
									"url":url
								},
								"method":"POST",
								"showLoading":true,
								"success":function(){
									showToast([
										"Changes are saved",
										"更改已保存"
									])
									load()
								},
								"error":error
							})
						}
					},null,myURL[index].to)
					closeMenu()
				},
				"text":[
					"Change",
					"更改"
				]
			},{
				"onclick":function(){
					showConfirm([
						"Do you want to delete "+decodeURIComponent(myURL[index].name)+"?",
						"您想删除 "+decodeURIComponent(myURL[index].name)+" 吗？"
					],function(){
						ajax({
							"url":backend+"userdata/domain/del",
							"data":{
								"domain":myURL[index].name,
								"username":login.username
							},
							"method":"POST",
							"dataType":"json",
							"showLoading":true,
							"success":function(e){
								if(e.success){
									load()
								}else{
									showAlert([
										"Unable to delete "+myURL[index].name,
										"无法删除 "+myURL[index].name
									])
								}
							},
							"error":error
						})
					})
					closeMenu()
				},
				"text":[
					"Delete",
					"删除"
				]
			}])
			return false
		}
		document.getElementById("MyURL").appendChild(newLi)
	}
}
document.getElementsByTagName("button")[0].onclick=function(){
	loginRequired(function(){
		if(document.getElementById("OriginalURLInput").value){
			if(document.getElementById("ShortURLInput").value.indexOf("https:")!=-1){
				document.getElementById("ShortURLInput").value=document.getElementById("ShortURLInput").value.replace("https:","http:")
			}
			if(document.getElementById("ShortURLInput").value.substr(0,shortURL.length)==shortURL){
				var originalURL=document.getElementById("OriginalURLInput").value,
				value=encodeURIComponent(document.getElementById("ShortURLInput").value.replace(shortURL,""))
				if(originalURL.indexOf("rthe.cn")!=-1){
					showAlert([
						"Short URLs cannot be the original URL",
						"短网址不能作为原网址"
					])
				}else{
					if(!value){
						value=defaultShortURL
					}
					if(originalURL.indexOf("/")==-1){
						originalURL=originalURL+"/"
					}
					if(originalURL.indexOf("http")==-1){
						originalURL="http://"+originalURL
					}
					document.getElementById("OriginalURLInput").value=originalURL
					ajax({
						"url":backend+"userdata/domain/add",
						"data":{
							"domain":value,
							"redirect":302,
							"to":originalURL,
							"username":login.username
						},
						"method":"POST",
						"dataType":"json",
						"showLoading":true,
						"success":function(e){
							if(e.success){
								load()
								value=decodeURIComponent(value)
								showPrompt(null,function(){
									openWebPage(secondary+value)
								},null,shortURL+value)
								closeMenu()
							}else{
								var extraInfo=""
								switch(language){
									case "SimplifiedChinese":
									if(e.username=="admin"){
										extraInfo="管理员"
									}else if(e.username==login.username){
										extraInfo="您"
									}
									break
									default:
									if(e.username=="admin"){
										extraInfo=" by the administrator"
									}else if(e.username==login.username){
										extraInfo=" by you"
									}
								}
								showAlert([
									"This short URL has been taken"+extraInfo,
									"此短网址已被"+extraInfo+"占用"
								])
							}
						},
						"error":error
					})
				}
			}else{
				showAlert([
					"The short URL must begin with "+shortURL,
					"短网址必须以 "+shortURL+" 开头"
				])
				document.getElementById("ShortURLInput").value=shortURL+document.getElementById("ShortURLInput").value.replace(/[^A-Za-z0-9]/g,"")
			}
		}else{
			showAlert([
				"Please enter the original URL",
				"请输入原网址"
			])
		}
	})
}
switch(language){
	case "SimplifiedChinese":
	document.title="短网址"
	document.getElementById("ShortURL").innerText="短网址"
	document.getElementById("OriginalURL").innerText="原网址"
	document.getElementsByTagName("button")[0].innerText="创建"
	break
	default:
	document.title="Short URL"
	document.getElementById("ShortURL").innerText="Short"
	document.getElementById("OriginalURL").innerText="Original"
	document.getElementsByTagName("button")[0].innerText="Create"
}
newTitle.innerText=document.title
if(myURL){
	myURL=JSON.parse(myURL)
	loadMyURL()
}
load()
