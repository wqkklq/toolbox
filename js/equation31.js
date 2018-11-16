/*Code written by Shangzhen Yang*/
function calculate(){
	var a1=document.getElementById("a1Input").value*1,
	b1=document.getElementById("b1Input").value*1,
	c1=document.getElementById("c1Input").value*1,
	d1=document.getElementById("d1Input").value*1,
	a2=document.getElementById("a2Input").value*1,
	b2=document.getElementById("b2Input").value*1,
	c2=document.getElementById("c2Input").value*1,
	d2=document.getElementById("d2Input").value*1,
	a3=document.getElementById("a3Input").value*1,
	b3=document.getElementById("b3Input").value*1,
	c3=document.getElementById("c3Input").value*1,
	d3=document.getElementById("d3Input").value*1
	var delta=a1*b2*c3+b1*c2*a3+c1*a2*b3-c1*b2*a3-a1*c2*b3-b1*a2*c3
	document.getElementById("xInput").value=(d1*b2*c3+b1*c2*d3+c1*d2*b3-c1*b2*d3-d1*c2*b3-b1*d2*c3)/delta
	document.getElementById("yInput").value=(a1*d2*c3+d1*c2*a3+c1*a2*d3-c1*d2*a3-a1*c2*d3-d1*a2*c3)/delta
	document.getElementById("zInput").value=(a1*b2*d3+b1*d2*a3+d1*a2*b3-d1*b2*a3-a1*d2*b3-b1*a2*d3)/delta
}
document.getElementById("xInput").oninput=calculate
document.getElementById("yInput").oninput=calculate
document.getElementById("zInput").oninput=calculate
initCalculator(11,calculate)
