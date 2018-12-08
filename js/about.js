/*Code written by Shangzhen Yang*/
document.getElementById("PrivacyPolicy").onclick=function(){
	openWebPage("https://www.rthe.cn/privacy")
}
document.getElementById("Feedback").onclick=function(){
	openWindow("feedback")
}
document.getElementById("Donate").onclick=function(){
	if(document.getElementsByClassName("bottom-list")[0].style.opacity){
		document.getElementsByClassName("bottom-list")[0].style.opacity=""
		setTimeout(function(){
			document.getElementsByClassName("bottom-list")[0].style.display=""
		},250)
	}else{
		document.getElementsByClassName("bottom-list")[0].style.display="block"
		setTimeout(function(){
			document.getElementsByClassName("bottom-list")[0].style.opacity="1"
		},25)
	}
}
document.getElementById("Alipay").onclick=function(){
	showImage("https://rthsoftware.cn/img/alipay.jpg")
}
document.getElementById("WeChatPay").onclick=function(){
	showImage("https://rthsoftware.cn/img/wechatpay.jpg")
}
document.getElementById("QQWallet").onclick=function(){
	showImage("https://rthsoftware.cn/img/qqwallet.jpg")
}
document.getElementById("PayPal").onclick=function(){
	openWebPage("https://www.paypal.me/ShangzhenY/")
}
switch(language){
	case "SimplifiedChinese":
	document.title="关于"
	document.getElementById("Version").innerText="版本："+ver
	document.getElementById("LastUpdated").innerText="更新日期："+lastUpdated
	document.getElementById("Developer").innerText="开发者：尚臻"
	document.getElementById("PrivacyPolicy").innerText="隐私政策"
	document.getElementById("Feedback").innerText="反馈"
	document.getElementById("Donate").innerText="捐赠"
	document.getElementById("Alipay").innerText="支付宝"
	document.getElementById("WeChatPay").innerText="微信支付"
	document.getElementById("QQWallet").innerText="QQ 钱包"
	break
	default:
	document.title="About"
	document.getElementById("Version").innerText="Version: "+ver
	document.getElementById("LastUpdated").innerText="Last Updated: "+lastUpdated
	document.getElementById("Developer").innerText="Developer: Shangzhen"
	document.getElementById("PrivacyPolicy").innerText="Privacy Policy"
	document.getElementById("Feedback").innerText="Feedback"
	document.getElementById("Donate").innerText="Donate"
	document.getElementById("Alipay").innerText="Alipay"
	document.getElementById("WeChatPay").innerText="WeChat Pay"
	document.getElementById("QQWallet").innerText="QQ Wallet"
}
newTitle.innerText=document.title
