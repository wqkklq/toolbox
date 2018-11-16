/*Code written by Shangzhen Yang*/
var calcBtn=document.getElementsByTagName("button"),
functionList=document.getElementsByClassName("function")[0].getElementsByTagName("ul")[0].getElementsByTagName("li")
function calculate(){
	var formula=document.getElementsByTagName("input")[0].value.replace(/coin|cordova|eval|require/gi,"").replace(/×/g,"*").replace(/÷/g,"/").replace(/π/g,"pi").toLowerCase()
	if(formula==""){
		showAlert([
			"Please enter the formula",
			"请输入算式"
		])
	}else{
		if(/x|y|z/.test(formula)&&formula.indexOf("=")==-1&&formula.indexOf("exp")==-1){
			document.getElementsByTagName("input")[0].value+=" == "
		}else{
			if(formula.indexOf(" = ")!=-1){
				formula=formula.split(" = ")[0]
			}
			if(formula.indexOf("=")!=-1&&formula.indexOf("==")==-1){
				formula=formula.replace("=","==")
			}
			try{
				document.getElementsByTagName("input")[0].value=formula+" = "+calc(formula)
			}catch(e){
				if(document.getElementsByTagName("input")[0].value.indexOf("()")==-1&&e.message.indexOf(")")!=-1){
					document.getElementsByTagName("input")[0].value+=")"
					calculate()
				}else{
					mui.toast(e.message)
				}
			}
		}
	}
}
document.getElementsByTagName("input")[0].onkeydown=function(e){
	if(e.keyCode==13&&this.value){
		calculate()
	}
}
document.getElementById("C").onclick=function(){
	document.getElementsByTagName("input")[0].value=""
}
document.getElementById("Backspace").onclick=function(){
	var value=document.getElementsByTagName("input")[0].value
	document.getElementsByTagName("input")[0].value=value.substr(0,value.length-1)
}
document.getElementById("Equal").onclick=calculate
document.getElementById("Date").onclick=
document.getElementById("Statistics").onclick=
document.getElementById("Currency").onclick=
document.getElementById("NumberBase").onclick=
document.getElementById("Mole").onclick=
document.getElementById("Equation12").onclick=
document.getElementById("Equation21").onclick=
document.getElementById("Equation31").onclick=
document.getElementById("QuadraticFunction").onclick=
document.getElementById("FindLinearFunction").onclick=
document.getElementById("FindQuadraticFunction").onclick=function(){
	openWindow(this.id.toLowerCase())
}
switch(language){
	case "SimplifiedChinese":
	document.title="计算器"
	document.getElementsByTagName("input")[0].placeholder="输入算式"
	document.getElementById("Date").innerText="日期"
	document.getElementById("Statistics").innerText="统计"
	document.getElementById("Currency").innerText="货币换算"
	document.getElementById("NumberBase").innerText="进制换算"
	document.getElementById("Mole").innerText="摩尔换算"
	document.getElementById("Equation12").innerText="一元二次方程"
	document.getElementById("Equation21").innerText="二元一次方程组"
	document.getElementById("Equation31").innerText="三元一次方程组"
	document.getElementById("QuadraticFunction").innerText="二次函数"
	document.getElementById("FindLinearFunction").innerText="求一次函数解析式"
	document.getElementById("FindQuadraticFunction").innerText="求二次函数解析式"
	break
	default:
	document.title="Calculator"
	document.getElementsByTagName("input")[0].placeholder="Enter the formula"
	document.getElementById("Date").innerText="Date"
	document.getElementById("Statistics").innerText="Statistics"
	document.getElementById("Currency").innerText="Currency Conversion"
	document.getElementById("NumberBase").innerText="Number Base Conversion"
	document.getElementById("Mole").innerText="Mole Conversion"
	document.getElementById("Equation12").innerText="Quadratic Equation in One Unknown"
	document.getElementById("Equation21").innerText="System of Linear Equations in 2 Unknowns"
	document.getElementById("Equation31").innerText="System of Linear Equations in 3 Unknowns"
	document.getElementById("QuadraticFunction").innerText="Quadratic Function"
	document.getElementById("FindLinearFunction").innerText="Find Analytic Formula of Linear Function"
	document.getElementById("FindQuadraticFunction").innerText="Find Analytic Formula of Quadratic Function"
}
newTitle.innerText=document.title
for(var i=0;i<calcBtn.length;i++){
	if(calcBtn[i].onclick==null){
		calcBtn[i].onclick=function(){
			var btnText=this.innerText
			if(btnText=="×"){
				var value=document.getElementsByTagName("input")[0].value
				var last=value.substr(value.length-1,value.length)
				if(!value||/\(|\*|\/|\+|-|×|÷|\s/.test(last)){
					btnText="x"
				}else{
					btnText="*"
				}
			}else if(btnText=="÷"){
				btnText="/"
			}
			document.getElementsByTagName("input")[0].value+=btnText
		}
	}
}
for(var i=0;i<functionList.length;i++){
	functionList[i].onclick=function(){
		document.getElementsByTagName("input")[0].value+=this.innerText.replace("()","(").replace("π","pi")
	}
}
if(!isMobile){
	document.getElementsByTagName("input")[0].focus()
}
