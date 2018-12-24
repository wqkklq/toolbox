/*Code written by Shangzhen Yang*/
var rate=localStorage.getItem("Rate")
function calculate1(){
	if(document.getElementsByTagName("input")[0].value){
		if(document.getElementsByTagName("select")[0].value=="USD"){
			document.getElementsByTagName("input")[1].value=document.getElementsByTagName("input")[0].value*rate.quotes["USD"+document.getElementsByTagName("select")[1].value]
		}else{
			document.getElementsByTagName("input")[1].value=document.getElementsByTagName("input")[0].value/rate.quotes["USD"+document.getElementsByTagName("select")[0].value]*rate.quotes["USD"+document.getElementsByTagName("select")[1].value]
		}
	}else{
		document.getElementsByTagName("input")[1].value=""
	}
}
function calculate2(){
	if(document.getElementsByTagName("input")[1].value){
		if(document.getElementsByTagName("select")[1].value=="USD"){
			document.getElementsByTagName("input")[0].value=document.getElementsByTagName("input")[1].value*rate.quotes["USD"+document.getElementsByTagName("select")[0].value]
		}else{
			document.getElementsByTagName("input")[0].value=document.getElementsByTagName("input")[1].value/rate.quotes["USD"+document.getElementsByTagName("select")[1].value]*rate.quotes["USD"+document.getElementsByTagName("select")[0].value]
		}
	}else{
		document.getElementsByTagName("input")[0].value=""
	}
}
function updateRate(){
	ajax({
		"url":"https://rthsoftware.cn/backend/get",
		"data":{
			"url":"http://www.apilayer.net/api/live?"+encodeData({
				"access_key":"305f5a80f4da12a238c9ebfe5479c648"
			}),
			"username":"admin"
		},
		"dataType":"json",
		"showLoading":true,
		"success":function(e){
			if(e.success){
				rate=e
				localStorage.setItem("Rate",JSON.stringify(e))
				document.getElementsByTagName("table")[0].style.display="table"
			}
		},
		"error":error
	})
}
document.getElementsByTagName("select")[0].onchange=calculate2
document.getElementsByTagName("input")[0].oninput=calculate1
document.getElementsByTagName("select")[1].onchange=calculate1
document.getElementsByTagName("input")[1].oninput=calculate2
document.getElementById("UpdateRate").onclick=updateRate
switch(language){
	case "SimplifiedChinese":
	document.title="计算器"
	document.getElementsByTagName("input")[0].placeholder=
	document.getElementsByTagName("input")[1].placeholder="输入数字"
	document.getElementById("UpdateRate").innerText="更新汇率"
	break
	default:
	document.title="Calculator"
	document.getElementsByTagName("input")[0].placeholder=
	document.getElementsByTagName("input")[1].placeholder="Enter the number"
	document.getElementById("UpdateRate").innerText="Update the exchange rate"
}
newTitle.innerText=document.title
document.getElementsByTagName("select")[0].value="CNY"
document.getElementsByTagName("select")[1].value="USD"
if(rate){
	rate=JSON.parse(rate)
	document.getElementsByTagName("table")[0].style.display="table"
}else{
	updateRate()
}
