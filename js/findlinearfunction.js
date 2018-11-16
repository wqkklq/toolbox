/*Code written by Shangzhen Yang*/
function calculate(){
	var a=document.getElementById("x1Input").value*1,
	c=document.getElementById("y1Input").value*(-1),
	d=document.getElementById("x2Input").value*1,
	f=document.getElementById("y2Input").value*(-1)
	if(a!=d){
		document.getElementById("kLabel").innerText=(f-c)/(a-d)
		document.getElementById("bLabel").innerText=(a*f-d*c)/(d-a)
	}else{
		document.getElementById("kLabel").innerText="k"
		document.getElementById("bLabel").innerText="b"
	}
}
initCalculator(3,calculate)
