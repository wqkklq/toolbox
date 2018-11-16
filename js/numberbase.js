/*Code written by Shangzhen Yang*/
var enterNum
document.getElementById("Binary").oninput=function(){
	var binary=parseInt(this.value,2)
	document.getElementById("Octal").value=binary.toString(8)
	document.getElementById("Decimal").value=binary.toString(10)
	document.getElementById("Hexadecimal").value=binary.toString(16)
}
document.getElementById("Octal").oninput=function(){
	var octal=parseInt(this.value,8)
	document.getElementById("Binary").value=octal.toString(2)
	document.getElementById("Decimal").value=octal.toString(10)
	document.getElementById("Hexadecimal").value=octal.toString(16)
}
document.getElementById("Decimal").oninput=function(){
	var decimal=parseInt(this.value,10)
	document.getElementById("Binary").value=decimal.toString(2)
	document.getElementById("Octal").value=decimal.toString(8)
	document.getElementById("Hexadecimal").value=decimal.toString(16)
}
document.getElementById("Hexadecimal").oninput=function(){
	var hexadecimal=parseInt(this.value,16)
	document.getElementById("Binary").value=hexadecimal.toString(2)
	document.getElementById("Octal").value=hexadecimal.toString(8)
	document.getElementById("Decimal").value=hexadecimal.toString(10)
}
switch(language){
	case "SimplifiedChinese":
	document.title="计算器"
	document.getElementById("BinaryLabel").innerText="二进制"
	document.getElementById("OctalLabel").innerText="八进制"
	document.getElementById("DecimalLabel").innerText="十进制"
	document.getElementById("HexadecimalLabel").innerText="十六进制"
	enterNum="输入数字"
	break
	default:
	document.title="Calculator"
	document.getElementById("BinaryLabel").innerText="Binary"
	document.getElementById("OctalLabel").innerText="Octal"
	document.getElementById("DecimalLabel").innerText="Decimal"
	document.getElementById("HexadecimalLabel").innerText="Hexadecimal"
	enterNum="Enter the number"
}
newTitle.innerText=document.title
document.getElementById("Binary").placeholder=enterNum
document.getElementById("Octal").placeholder=enterNum
document.getElementById("Decimal").placeholder=enterNum
document.getElementById("Hexadecimal").placeholder=enterNum
