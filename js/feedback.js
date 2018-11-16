/*Code written by Shangzhen Yang*/
document.getElementsByTagName("button")[0].onclick=function(){
	document.getElementById("Name").style.background=""
	document.getElementById("Email").style.background=""
	document.getElementsByTagName("textarea")[0].style.background=""
	if(document.getElementById("Name").value==""){
		document.getElementById("Name").style.background="rgb(255,192,203)"
	}else if(!/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/.test(document.getElementById("Email").value)){
		document.getElementById("Email").style.background="rgb(255,192,203)"
	}else if(document.getElementsByTagName("textarea")[0].value==""){
		document.getElementsByTagName("textarea")[0].style.background="rgb(255,192,203)"
	}else{
		ajax({
			"url":backend+"feedback",
			"data":{
				"appname":appName,
				"email":document.getElementById("Email").value,
				"lang":language,
				"name":document.getElementById("Name").value,
				"text":document.getElementsByTagName("textarea")[0].value,
				"ver":ver
			},
			"method":"POST",
			"showLoading":true,
			"success":function(){
				showAlert([
					"Thank you for your feedback",
					"感谢您的反馈"
				])
			},
			"error":error
		})
	}
}
switch(language){
	case "SimplifiedChinese":
	document.title="反馈"
	document.getElementById("Name").placeholder="名字"
	document.getElementById("Email").placeholder="电子邮箱"
	document.getElementsByTagName("textarea")[0].placeholder="正文"
	document.getElementsByTagName("button")[0].innerText="发送"
	break
	default:
	document.title="Feedback"
	document.getElementById("Name").placeholder="Name"
	document.getElementById("Email").placeholder="Email"
	document.getElementsByTagName("textarea")[0].placeholder="Text"
	document.getElementsByTagName("button")[0].innerText="Send"
}
newTitle.innerText=document.title
document.getElementById("Email").value=login.email
