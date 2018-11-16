/*Code written by Shangzhen Yang*/
function calculate(){
	var a1=document.getElementById("a1Input").value*1,
	b1=document.getElementById("b1Input").value*1,
	c1=document.getElementById("c1Input").value*(-1),
	a2=document.getElementById("a2Input").value*1,
	b2=document.getElementById("b2Input").value*1,
	c2=document.getElementById("c2Input").value*(-1)
	document.getElementById("xInput").value=(b1*c2-b2*c1)/(a1*b2-b1*a2)
	document.getElementById("yInput").value=(a1*c2-a2*c1)/(b1*a2-a1*b2)
}
document.getElementById("xInput").oninput=calculate
document.getElementById("yInput").oninput=calculate
initCalculator(5,calculate)
