/*Code written by Shangzhen Yang*/
var lastBotInfo=""
function chatbotReply(botInfo){
	ajax({
		"url":"http://www.tuling123.com/openapi/api",
		"data":{
			"info":botInfo,
			"key":"42cff502574d42e996841e655fecd78a"
		},
		"dataType":"json",
		"crossOrigin":true,
		"showLoading":true,
		"success":function(e){
			var botText=e.text,
			newDiv=document.createElement("div"),
			newChildDiv=document.createElement("div")
			newDiv.classList.add("msg-row")
			newChildDiv.classList.add("msg")
			newChildDiv.classList.add("msg-bot")
			newDiv.appendChild(newChildDiv)
			var appendMsg=function(){
				if(e.code==200000){
					newChildDiv.innerHTML+="<br><a href=\"javascript:openWebPage('"+e.url+"')\">"+e.url.split("/")[2]+"</a>"
				}
				document.getElementsByClassName("mui-content")[0].appendChild(newDiv)
				scrollTo(0,document.body.scrollHeight)
			}
			newChildDiv.innerText=botText
			appendMsg()
			switch(language){
				case "SimplifiedChinese":
				newTitle.innerText="康康"
				break
				default:
				translate(botText,"zh","en",function(e){
					newChildDiv.innerText+="\n"+e
					scrollTo(0,document.body.scrollHeight)
					newTitle.innerText="Kangkang"
				},noConnection)
			}
		},
		"error":noConnection
	})
}
function noConnection(){
	var newDiv=document.createElement("div"),
	newChildDiv=document.createElement("div")
	newDiv.classList.add("msg-row")
	newChildDiv.classList.add("msg")
	newChildDiv.classList.add("msg-bot")
	switch(language){
		case "SimplifiedChinese":
		newChildDiv.innerText="无法连接服务器。"
		newTitle.innerText="康康"
		break
		default:
		newChildDiv.innerText="Unable to connect to the server."
		newTitle.innerText="Kangkang"
	}
	newDiv.appendChild(newChildDiv)
	document.getElementsByClassName("mui-content")[0].appendChild(newDiv)
	scrollTo(0,document.body.scrollHeight)
}
function sendMsg(text){
	if(text){
		lastBotInfo=text
		document.getElementById("SendBox").value=""
		var newMyDiv=document.createElement("div"),
		newMyChildDiv=document.createElement("div")
		newMyDiv.classList.add("msg-row")
		newMyChildDiv.classList.add("msg")
		newMyChildDiv.classList.add("msg-me")
		newMyChildDiv.innerText=text
		newMyDiv.appendChild(newMyChildDiv)
		document.getElementsByClassName("mui-content")[0].appendChild(newMyDiv)
		scrollTo(0,document.body.scrollHeight)
		switch(language){
			case "SimplifiedChinese":
			newTitle.innerText="对方正在输入"
			break
			default:
			newTitle.innerText="Typing"
		}
		if(isEnglish.test(text)){
			translate(text,"auto","zh",function(e){
				newMyChildDiv.innerText+="\n"+e
				scrollTo(0,document.body.scrollHeight)
				chatbotReply(e)
			},noConnection)
		}else{
			chatbotReply(text)
		}
	}else{
		document.getElementById("SendBox").value=lastBotInfo
	}
}
document.getElementById("SendBox").onclick=function(){
	if(isAndroidApp){
		showPrompt([
			"Enter the message",
			"输入消息"
		],function(e){
			sendMsg(e)
		},null,null,function(){
			showPrompt([
				"Enter the message",
				"输入消息"
			],function(e){
				sendMsg(e)
			},null,lastBotInfo)
		})
	}
}
document.getElementById("SendBox").onkeydown=function(e){
	if(e.keyCode==13){
		sendMsg(this.value)
	}
}
document.getElementById("SendButton").onclick=function(){
	sendMsg(document.getElementById("SendBox").value)
}
switch(language){
	case "SimplifiedChinese":
	document.title="聊天机器人"
	newTitle.innerText="康康"
	document.getElementById("Welcome").innerText="我们一起来聊天吧！"
	document.getElementById("SendButton").innerText="发送"
	break
	default:
	document.title="Chatbot"
	newTitle.innerText="Kangkang"
	document.getElementById("Welcome").innerText="Let's chat!"
	document.getElementById("SendButton").innerText="Send"
}
