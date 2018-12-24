/*Code written by Shangzhen Yang*/
document.getElementsByTagName("button")[0].onclick=function(){
	document.getElementById("Name").classList.remove("warning")
	document.getElementById("Email").classList.remove("warning")
	document.getElementsByTagName("textarea")[0].classList.remove("warning")
	if(!document.getElementById("Name").value){
		document.getElementById("Name").classList.add("warning")
	}else if(!/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/.test(document.getElementById("Email").value)){
		document.getElementById("Email").classList.add("warning")
	}else if(!document.getElementsByTagName("textarea")[0].value){
		document.getElementsByTagName("textarea")[0].classList.add("warning")
	}else{
		ajax({
			"url":"https://rthsoftware.cn/backend/feedback",
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
			"error":function(e){
				if(e.status==504){
					showAlert([
						"Please try again",
						"请再试一次"
					])
				}else{
					error()
				}
			}
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
