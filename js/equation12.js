/*Code written by Shangzhen Yang*/
function calculate(){
	var a=document.getElementById("aInput").value*1,
	b=document.getElementById("bInput").value*1,
	c=document.getElementById("cInput").value*1
	var delta=Math.pow(b,2)-4*a*c
	if(delta>0){
		document.getElementById("DeltaInput").value=delta+" > 0"
	}else if(delta==0){
		document.getElementById("DeltaInput").value=delta+" = 0"
	}else if(delta<0){
		document.getElementById("DeltaInput").value=delta+" < 0"
	}
	document.getElementById("x1Input").value=(-b+Math.sqrt(delta))/(2*a)
	document.getElementById("x2Input").value=(-b-Math.sqrt(delta))/(2*a)
}
document.getElementById("DeltaInput").oninput=calculate
document.getElementById("x1Input").oninput=calculate
document.getElementById("x2Input").oninput=calculate
initCalculator(2,calculate)
