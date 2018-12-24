/*Code written by Shangzhen Yang*/
var currentHour=new Date().getHours(),
dateCountdown=localStorage.getItem("DateCountdown"),
dateCountdownLoaded,
menu=document.getElementsByClassName("home-menu")[0].getElementsByTagName("li"),
savedQuote=localStorage.getItem("Quote")
function checkForUpdates(latestVer){
	var currentVer=ver.split("."),newVer
	if(isAndroid){
		newVer=latestVer.android.split(".")
	}else if(isiOS){
		newVer=latestVer.ios.split(".")
	}else{
		return false
	}
	if(newVer[0]*1>currentVer[0]*1){
		return true
	}else if(newVer[0]*1==currentVer[0]*1){
		if(newVer[1]*1>currentVer[1]*1){
			return true
		}else{
			return false
		}
	}else{
		return false
	}
}
function displayDateCountdown(){
	if(dateCountdown&&dateCountdown.date&&dateCountdown.name){
		switch(language){
			case "SimplifiedChinese":
			document.getElementById("Quote").innerText=dateCountdown.name+"：还有 "+dateDiff(new Date(new Date().toLocaleDateString()).getTime(),dateCountdown.date)
			break
			default:
			document.getElementById("Quote").innerText=dateCountdown.name+": "+dateDiff(new Date(new Date().toLocaleDateString()).getTime(),dateCountdown.date)+" remaining"
		}
		dateCountdownLoaded=true
		document.getElementById("Quote").onclick=function(){
			openWindow("date")
		}
	}
}
function getSentence(manual){
	loadSentence()
	ajax({
		"url":"https://rthsoftware.cn/backend/rs/",
		"data":{
			"encode":"text",
			"language":(function(){
				switch(language){
					case "SimplifiedChinese":
					return "chs"
					default:
					return "en"
				}
			})(),
			"type":7,
			"username":"admin"
		},
		"showLoading":manual,
		"success":function(e){
			if(e){
				localStorage.setItem("Quote",e)
				if(!dateCountdownLoaded&&!savedQuote){
					savedQuote=e
					loadSentence()
					getSentence()
				}
			}
		},
		"error":function(){
			if(manual){
				error()
			}
		}
	})
}
function getToolbox(){
	var url
	if(isTencent){
		showAlert([
			"Please open this page in the browser",
			"请在浏览器中打开此页面"
		])
	}else if(isAndroid){
		if(navigator.language=="zh-CN"&&isCNServer==null||isCNServer){
			url="https://www.coolapk.com/apk/163867"
		}else{
			url="https://play.google.com/store/apps/details?"+encodeData({
				"id":"shangzhenyang.rthtoolbox"
			})
		}
	}else if(isiOS){
		url="https://itunes.apple.com/app/rth-toolbox/id1294479577"
	}else{
		showQRCode("https://rthsoftware.cn/toolbox/?"+encodeData({
			"action":"dl"
		}))
	}
	if(url){
		location.href=url
	}
}
function loadSentence(){
	if(savedQuote){
		document.getElementById("Quote").innerText=savedQuote
		document.getElementById("Quote").oncontextmenu=
		document.getElementById("Quote").onclick=function(mouse){
			showMenu(mouse,[{
				"onclick":function(){
					switch(language){
						case "SimplifiedChinese":
						openWebPage("https://so.gushiwen.org/search.aspx?"+encodeData({
							"value":document.getElementById("Quote").innerText
						}))
						break
						default:
						openWebPage("https://www.dictionary.com/browse/"+document.getElementById("Quote").innerText.toLowerCase().replace(/[^a-z|\s]/g,""))
					}
					closeMenu()
				},
				"text":[
					"Look Up",
					"查询"
				]
			},{
				"onclick":function(){
					savedQuote=null
					getSentence(true)
					closeMenu()
				},
				"text":[
					"Change",
					"更改"
				]
			}])
			return false
		}
	}
}
function submitDateCountdown(){
	displayDateCountdown()
	ajax({
		"url":backend+"userdata/upload",
		"data":{
			"dir":"datecountdown/",
			"filename":login.username,
			"text":JSON.stringify(dateCountdown)
		},
		"method":"POST",
		"showLoading":true
	})
}
window.onkeydown=function(e){
	if(e.ctrlKey||e.metaKey){
		switch(e.keyCode){
			case 83:
			if(!isApp){
				getToolbox()
			}
			return false
		}
	}
}
for(var i=0;i<menu.length;i++){
	menu[i].onclick=function(){
		openWindow(this.id.toLowerCase())
	}
}
document.getElementsByClassName("mui-icon-settings")[0].onclick=function(){
	openWindow("settings")
}
switch(language){
	case "SimplifiedChinese":
	document.title="RTH 工具箱"
	document.getElementById("WordList").innerText="单词表"
	document.getElementById("ShortURL").innerText="短网址"
	document.getElementById("Translate").innerText="翻译"
	document.getElementById("Timer").innerText="计时器"
	document.getElementById("Calculator").innerText="计算器"
	document.getElementById("Chatbot").innerText="聊天机器人"
	document.getElementById("Marquee").innerText="跑马灯"
	document.getElementById("RandomNumber").innerText="随机抽号"
	document.getElementById("Search").innerText="搜索"
	document.getElementById("TextEditor").innerText="文本编辑器"
	document.getElementById("TextEncoder").innerText="文本编码器"
	document.getElementById("FileTransfer").innerText="文件传输"
	if(currentHour>=6&&currentHour<=11){
		document.getElementById("Quote").innerText="早上好！"
	}else if(currentHour>=12&&currentHour<=18){
		document.getElementById("Quote").innerText="下午好！"
	}else if(currentHour>=19&&currentHour<=20){
		document.getElementById("Quote").innerText="晚上好！"
	}else if(currentHour>=21&&currentHour<=23||currentHour>=0&&currentHour<=5){
		document.getElementById("Quote").innerText="晚安！"
	}
	break
	default:
	document.title="RTH Toolbox"
	document.getElementById("WordList").innerText="Word List"
	document.getElementById("ShortURL").innerText="Short URL"
	document.getElementById("Translate").innerText="Translate"
	document.getElementById("Timer").innerText="Timer"
	document.getElementById("Calculator").innerText="Calculator"
	document.getElementById("Chatbot").innerText="Chatbot"
	document.getElementById("Marquee").innerText="Marquee"
	document.getElementById("RandomNumber").innerText="Random Number"
	document.getElementById("Search").innerText="Search"
	document.getElementById("TextEditor").innerText="Text Editor"
	document.getElementById("TextEncoder").innerText="Text Encoder"
	document.getElementById("FileTransfer").innerText="File Transfer"
	if(currentHour>=6&&currentHour<=11){
		document.getElementById("Quote").innerText="Good morning!"
	}else if(currentHour>=12&&currentHour<=18){
		document.getElementById("Quote").innerText="Good afternoon!"
	}else if(currentHour>=19&&currentHour<=20){
		document.getElementById("Quote").innerText="Good evening!"
	}else if(currentHour>=21&&currentHour<=23||currentHour>=0&&currentHour<=5){
		document.getElementById("Quote").innerText="Good night!"
	}
}
document.getElementsByClassName("home-title")[0].innerText=document.title
if($_GET["action"]){
	switch($_GET["action"].toLowerCase()){
		case "dl":
		getToolbox()
	}
}else if(!login.username){
	loginDialog()
}
if(!login.username&&!isApp&&location.hostname!="rthsoftware.cn"){
	var ssoIFrame=document.createElement("iframe")
	ssoIFrame.style.display="none"
	ssoIFrame.src="https://rthsoftware.cn/sso"
	document.body.appendChild(ssoIFrame)
}
getSentence()
if(dateCountdown){
	dateCountdown=JSON.parse(dateCountdown)
}
if(login.username){
	getUserData("datecountdown",function(e){
		if(!dateCountdown||e.time>dateCountdown.time){
			dateCountdown=e
			localStorage.setItem("DateCountdown",JSON.stringify(e))
		}else if(dateCountdown.time>e.time){
			submitDateCountdown()
		}
		displayDateCountdown()
	},function(e){
		if(e.status==0){
			displayDateCountdown()
		}else if(dateCountdown){
			submitDateCountdown()
		}
	},true)
}
