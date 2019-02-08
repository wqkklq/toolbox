/*Code written by Shangzhen Yang*/
var dateCountdown=localStorage.getItem("DateCountdown")
function submit(){
	localStorage.setItem("DateCountdown",JSON.stringify(dateCountdown))
	ajax({
		"url":backend+"userdata/upload",
		"data":{
			"dir":"datecountdown/",
			"text":JSON.stringify(dateCountdown),
			"token":login.token,
			"username":login.username
		},
		"method":"POST",
		"showLoading":true,
		"success":function(){
			showToast([
				"Changes are saved",
				"更改已保存"
			])
		},
		"error":function(){
			showToast([
				"Changes are saved locally",
				"更改已本地保存"
			])
		}
	})
}
document.getElementById("StartDate").oninput=
document.getElementById("EndDate").oninput=function(){
	document.getElementsByClassName("result")[0].innerText=dateDiff(new Date(document.getElementById("StartDate").value).getTime(),new Date(document.getElementById("EndDate").value).getTime())
}
if(isMobile){
	document.getElementById("Name").onclick=function(){
		var id=this.id
		showPrompt([
			document.getElementById(id).placeholder,
			document.getElementById(id).placeholder
		],function(e){
			document.getElementById(id).value=e
		},null,document.getElementById(id).value,function(){
			document.getElementById(id).value=""
		})
	}
	document.getElementById("Date").onclick=function(){
		var id=this.id
		showPrompt([
			document.getElementById(id).placeholder,
			document.getElementById(id).placeholder
		],function(e){
			document.getElementById(id).value=new Date(e).toLocaleDateString()
		},null,(function(){
			if(document.getElementById(id).value){
				return document.getElementById(id).value
			}else{
				return new Date().toLocaleDateString()
			}
		})(),function(){
			document.getElementById(id).value=""
		})
	}
}else{
	document.getElementById("Date").onclick=function(){
		if(!this.value){
			this.value=new Date().toLocaleDateString()
		}
	}
}
document.getElementById("Save").onclick=function(){
	loginRequired(function(){
		if(dateCountdown){
			dateCountdown.date=new Date(document.getElementById("Date").value).getTime()
			dateCountdown.name=document.getElementById("Name").value
			dateCountdown.time=new Date().getTime()
		}else{
			dateCountdown={
				"date":new Date(document.getElementById("Date").value).getTime(),
				"name":document.getElementById("Name").value,
				"time":new Date().getTime()
			}
		}
		submit()
	})
}
document.getElementById("Delete").onclick=function(){
	document.getElementById("Name").value=
	document.getElementById("Date").value=""
	dateCountdown={
		"date":"",
		"name":"",
		"time":new Date().getTime()
	}
	submit()
}
switch(language){
	case "SimplifiedChinese":
	document.title="计算器"
	document.getElementById("DateDiff").innerText="日期之间的差异"
	document.getElementById("StartDateLabel").innerText="起始日期"
	document.getElementById("EndDateLabel").innerText="结束日期"
	document.getElementsByClassName("result")[0].innerText="0 天"
	document.getElementById("DateCountdown").innerText="日期倒计时"
	document.getElementById("NameLabel").innerText="名称"
	document.getElementById("Name").placeholder="输入名称"
	document.getElementById("DateLabel").innerText="日期"
	document.getElementById("Date").placeholder="输入日期"
	document.getElementById("Save").innerText="保存"
	document.getElementById("Delete").innerText="删除"
	break
	default:
	document.title="Calculator"
	document.getElementById("DateDiff").innerText="Date Diff"
	document.getElementById("StartDateLabel").innerText="Start Date"
	document.getElementById("EndDateLabel").innerText="End Date"
	document.getElementsByClassName("result")[0].innerText="0 Day"
	document.getElementById("DateCountdown").innerText="Date Countdown"
	document.getElementById("NameLabel").innerText="Name"
	document.getElementById("Name").placeholder="Enter the name"
	document.getElementById("DateLabel").innerText="Date"
	document.getElementById("Date").placeholder="Enter the date"
	document.getElementById("Save").innerText="Save"
	document.getElementById("Delete").innerText="Delete"
}
newTitle.innerText=document.title
if(dateCountdown){
	dateCountdown=JSON.parse(dateCountdown)
	if(dateCountdown.date&&dateCountdown.name){
		document.getElementById("Name").value=dateCountdown.name
		document.getElementById("Date").value=new Date(dateCountdown.date).toLocaleDateString()
	}
}
