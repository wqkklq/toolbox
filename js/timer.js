/*Code written by Shangzhen Yang*/
var historyArray=[],
Hour,
intervalId,
Minute,
Second
function countdown(){
	if(Hour==0&&Minute==0&&Second==0){
		pause()
		task()
		return false
	}else if(Second==0){
		Second=59
		document.getElementById("Second").value=Second
		if(Minute==0){
			Minute=59
			document.getElementById("Minute").value=Minute
			Hour=Hour-1
			document.getElementById("Hour").value=Hour
		}else{
			Minute=Minute-1
			document.getElementById("Minute").value=Minute
		}
	}else{
		Second=Second-1
		document.getElementById("Second").value=Second
	}
	timeChanged()
}
function pause(){
	clearInterval(intervalId)
	document.getElementsByTagName("select")[0].disabled=""
	document.getElementById("StartButton").disabled=""
	document.getElementById("PauseButton").disabled="disabled"
}
function timeChanged(){
	var secondStr=addZero(document.getElementById("Second").value,2),
	minuteStr=addZero(document.getElementById("Minute").value,2),
	hourStr=addZero(document.getElementById("Hour").value,2)
	if(secondStr=="0"){
		secondStr="00"
	}
	if(minuteStr=="0"){
		minuteStr="00"
	}
	if(hourStr=="0"){
		hourStr="00"
	}
	document.getElementsByClassName("time")[0].value=hourStr+":"+minuteStr+":"+secondStr
}
function start(){
	Second=parseInt(document.getElementById("Second").value)
	Minute=parseInt(document.getElementById("Minute").value)
	Hour=parseInt(document.getElementById("Hour").value)
	if(document.getElementsByTagName("select")[0].value=="Countdown"){
		if(Hour==0&&Minute==0&&Second==0){
			showAlert([
				"Please set the countdown time",
				"请设置倒计时时间"
			])
		}else{
			document.getElementsByTagName("select")[0].disabled="disabled"
			document.getElementById("StartButton").disabled="disabled"
			document.getElementById("PauseButton").disabled=""
			intervalId=setInterval(function(){
				countdown()
			},1000)
		}
	}else if(document.getElementsByTagName("select")[0].value=="Stopwatch"){
		document.getElementsByTagName("select")[0].disabled="disabled"
		document.getElementById("StartButton").disabled="disabled"
		document.getElementById("PauseButton").disabled=""
		intervalId=setInterval(function(){
			stopwatch()
		},1000)
	}
}
function stopwatch(){
	if(Second==59){
		Second=0
		document.getElementById("Second").value=Second
		if(Minute==59){
			Minute=0
			document.getElementById("Minute").value=Minute
			Hour=Hour+1
			document.getElementById("Hour").value=Hour
		}else{
			Minute=Minute+1
			document.getElementById("Minute").value=Minute
		}
	}else{
		Second=Second+1
		document.getElementById("Second").value=Second
	}
	timeChanged()
}
function task(){
	if(document.getElementById("RunCodeCheck").checked){
		try{
			eval(document.getElementById("RunCodeInput").value.replace(/coin|eval|localStorage|task/gi,""))
		}catch(e){
			mui.toast(e.message)
		}
	}
	if(document.getElementById("SpeakCheck").checked){
		speak(document.getElementById("SpeakInput").value)
	}
	if(document.getElementById("OpenWebPageCheck").checked){
		openWebPage(document.getElementById("OpenWebPageInput").value)
	}
	if(document.getElementById("CreateMessageBoxCheck").checked){
		if(document.hidden){
			if((function(){
				if(window.Notification){
					return Notification.permission=="granted"
				}else{
					return false
				}
			})()){
				try{
					new Notification(document.title,{
						body:document.getElementById("CreateMessageBoxInput").value,
						icon:"../img/icon.png"
					})
				}catch(e){}
			}else if(isCordova){
				if(isAndroid){
					openWebPage(backend+"alert?text="+encodeURIComponent(document.getElementById("CreateMessageBoxInput").value)+"&title="+encodeURIComponent(document.title))
				}else if(isiOS){
					cordova.plugins.notification.local.schedule({
						title:document.title,
						text:document.getElementById("CreateMessageBoxInput").value
					})
				}
			}
		}else{
			setTimeout(function(){
				alert(document.getElementById("CreateMessageBoxInput").value)
			},1000)
		}
	}
}
document.getElementsByClassName("time")[0].oninput=function(){
	var timeSplit=document.getElementsByClassName("time")[0].value.split(":")
	if(timeSplit.length<3){
		document.getElementById("Second").value=0
		document.getElementById("Minute").value=0
		document.getElementById("Hour").value=0
	}else{
		document.getElementById("Second").value=timeSplit[2]
		document.getElementById("Minute").value=timeSplit[1]
		document.getElementById("Hour").value=timeSplit[0]
	}
}
document.getElementsByClassName("time")[0].onkeydown=function(e){
	if(e.keyCode==13){
		start()
	}
}
document.getElementById("Hour").onchange=timeChanged
document.getElementById("Minute").onchange=timeChanged
document.getElementById("Second").onchange=timeChanged
document.getElementById("StartButton").onclick=start
document.getElementById("PauseButton").onclick=pause
document.getElementById("PreviewButton").onclick=task
document.getElementById("Add").onclick=function(){
	var date=new Date()
	document.getElementById("HistoryUl").innerHTML=""
	historyArray.push(document.getElementsByClassName("time")[0].value+" ("+addZero(date.getHours(),2)+":"+addZero(date.getMinutes(),2)+":"+addZero(date.getSeconds(),2)+")")
	for(var i=historyArray.length-1;i>=0;i--){
		var newLi=document.createElement("li")
		newLi.classList.add("menu")
		newLi.innerText=historyArray[i]
		document.getElementById("HistoryUl").appendChild(newLi)
	}
}
document.getElementById("Clear").onclick=function(){
	if(document.getElementById("HistoryUl").innerHTML){
		showConfirm([
			"Do you want to clear the history?",
			"您想清空历史记录吗？"
		],function(){
			document.getElementById("HistoryUl").innerHTML=""
			historyArray=[]
		})
	}
}
switch(language){
	case "SimplifiedChinese":
	document.title="计时器"
	document.getElementById("HourLabel").innerText="时"
	document.getElementById("MinuteLabel").innerText="分"
	document.getElementById("SecondLabel").innerText="秒"
	document.getElementsByTagName("select")[0].options.add(new Option("倒计时","Countdown"))
	document.getElementsByTagName("select")[0].options.add(new Option("秒表","Stopwatch"))
	document.getElementById("StartButton").innerText="开始"
	document.getElementById("PauseButton").innerText="暂停"
	document.getElementById("TimedTask").innerText="定时任务"
	document.getElementById("CreateMessageBoxLabel").innerText="创建消息框"
	document.getElementById("CreateMessageBoxInput").placeholder="输入消息框的内容"
	document.getElementById("CreateMessageBoxInput").value="时间到！"
	document.getElementById("OpenWebPageLabel").innerText="打开网页"
	document.getElementById("OpenWebPageInput").placeholder="输入网址"
	document.getElementById("SpeakLabel").innerText="朗读"
	document.getElementById("SpeakInput").placeholder="输入朗读的文本"
	document.getElementById("SpeakInput").value="时间到！"
	document.getElementById("RunCodeLabel").innerText="运行代码";
	document.getElementById("RunCodeInput").placeholder="输入 JS 代码";
	document.getElementById("PreviewButton").innerText="预览"
	document.getElementById("History").innerText="历史记录"
	document.getElementById("Add").innerText="添加"
	document.getElementById("Clear").innerText="清空"
	break
	default:
	document.title="Timer"
	document.getElementById("HourLabel").innerText="Hour"
	document.getElementById("MinuteLabel").innerText="Minute"
	document.getElementById("SecondLabel").innerText="Second"
	document.getElementsByTagName("select")[0].options.add(new Option("Countdown","Countdown"))
	document.getElementsByTagName("select")[0].options.add(new Option("Stopwatch","Stopwatch"))
	document.getElementById("StartButton").innerText="Start"
	document.getElementById("PauseButton").innerText="Pause"
	document.getElementById("TimedTask").innerText="Timed Task"
	document.getElementById("CreateMessageBoxLabel").innerText="Create Message Box"
	document.getElementById("CreateMessageBoxInput").placeholder="Enter the contents"
	document.getElementById("CreateMessageBoxInput").value="Time out!"
	document.getElementById("OpenWebPageLabel").innerText="Open Web Page"
	document.getElementById("OpenWebPageInput").placeholder="Enter the URL"
	document.getElementById("SpeakLabel").innerText="Speak"
	document.getElementById("SpeakInput").placeholder="Enter the text"
	document.getElementById("SpeakInput").value="Time out!"
	document.getElementById("RunCodeLabel").innerText="Run Code";
	document.getElementById("RunCodeInput").placeholder="Enter the JS code";
	document.getElementById("PreviewButton").innerText="Preview"
	document.getElementById("History").innerText="History"
	document.getElementById("Add").innerText="Add"
	document.getElementById("Clear").innerText="Clear"
}
newTitle.innerText=document.title
if(location.hostname&&window.Notification){
	Notification.requestPermission()
}
