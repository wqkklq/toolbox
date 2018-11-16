/*Code written by Shangzhen Yang*/
function calculate(){
	var a1=Math.pow(document.getElementById("x1Input").value,2),
	b1=document.getElementById("x1Input").value*1,
	c1=1,
	d1=document.getElementById("y1Input").value*1,
	a2=Math.pow(document.getElementById("x2Input").value,2),
	b2=document.getElementById("x2Input").value*1,
	c2=1,
	d2=document.getElementById("y2Input").value*1,
	a3=Math.pow(document.getElementById("x3Input").value,2),
	b3=document.getElementById("x3Input").value*1,
	c3=1,
	d3=document.getElementById("y3Input").value*1
	var delta=a1*b2*c3+b1*c2*a3+c1*a2*b3-c1*b2*a3-a1*c2*b3-b1*a2*c3
	document.getElementById("aLabel").innerText=(d1*b2*c3+b1*c2*d3+c1*d2*b3-c1*b2*d3-d1*c2*b3-b1*d2*c3)/delta
	document.getElementById("bLabel").innerText=(a1*d2*c3+d1*c2*a3+c1*a2*d3-c1*d2*a3-a1*c2*d3-d1*a2*c3)/delta
	document.getElementById("cLabel").innerText=(a1*b2*d3+b1*d2*a3+d1*a2*b3-d1*b2*a3-a1*d2*b3-b1*a2*d3)/delta
}
initCalculator(5,calculate)
