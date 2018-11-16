/*Code written by Shangzhen Yang*/
var upwards,
downwards,
NotExist,
increases,
decreases,
Minimum,
Maximum,
MinimumMaximum,
and,
None
function calculate(){
	var a=document.getElementById("aInput").value*1,
	b=document.getElementById("bInput").value*1,
	c=document.getElementById("cInput").value*1
	var h=-b/(2*a),
	k=(4*a*c-Math.pow(b,2))/(4*a),
	delta=Math.pow(b,2)-4*a*c
	document.getElementById("xInput").value=h
	calculateY()
	document.getElementById("VertexForm2").innerText=a
	document.getElementById("VertexForm3").innerText=h
	document.getElementById("VertexForm4").innerText=k
	document.getElementById("AxisSymmetry2").innerText=h
	document.getElementById("VertexPointCoordinates2").innerText=h
	document.getElementById("VertexPointCoordinates3").innerText=k
	document.getElementById("xGreater2").innerText=h
	document.getElementById("xLess2").innerText=h
	if(a>0){
		document.getElementById("ParabolaOpens2").innerText=upwards
		document.getElementById("xGreater5").innerText=increases
		document.getElementById("xLess5").innerText=decreases
		document.getElementById("MinimumMaximum1").innerText=Minimum
	}else if(a<0){
		document.getElementById("ParabolaOpens2").innerText=downwards
		document.getElementById("xGreater5").innerText=decreases
		document.getElementById("xLess5").innerText=increases
		document.getElementById("MinimumMaximum1").innerText=Maximum
	}else{
		document.getElementById("ParabolaOpens2").innerText=NotExist
		document.getElementById("xGreater5").innerText=increases+" / "+decreases
		document.getElementById("xLess5").innerText=decreases+" / "+increases
		document.getElementById("MinimumMaximum1").innerText=MinimumMaximum
	}
	document.getElementById("MinimumMaximum2").innerText=k
	if(delta>0){
		var x1=(-b+Math.sqrt(delta))/(2*a),
		x2=(-b-Math.sqrt(delta))/(2*a)
		document.getElementById("xIntercept2").innerText="("+x1+", 0) "+and+" ("+x2+", 0)"
	}else if(delta==0){
		document.getElementById("xIntercept2").innerText="("+h+", 0)"
	}else{
		document.getElementById("xIntercept2").innerText=None
	}
	document.getElementById("yIntercept2").innerText=c
}
function calculateY(){
	var a=document.getElementById("aInput").value*1,
	b=document.getElementById("bInput").value*1,
	c=document.getElementById("cInput").value*1,
	x=document.getElementById("xInput").value*1
	document.getElementById("yInput").value=a*Math.pow(x,2)+b*x+c
}
document.getElementById("xInput").oninput=calculateY
document.getElementById("yInput").oninput=function(){
	var a=document.getElementById("aInput").value*1,
	b=document.getElementById("bInput").value*1,
	y=document.getElementById("yInput").value*1
	var c=document.getElementById("cInput").value-y
	var delta=Math.pow(b,2)-4*a*c
	var x1=(-b+Math.sqrt(delta))/(2*a)
	if(delta>0){
		var x2=(-b-Math.sqrt(delta))/(2*a)
		document.getElementById("xInput").value=x1+" "+and+" "+x2
	}else if(delta==0){
		document.getElementById("xInput").value=x1
	}else if(delta<0){
		document.getElementById("xInput").value="Δ < 0"
	}
}
initCalculator(2,calculate)
switch(language){
	case "SimplifiedChinese":
	document.getElementById("VertexForm1").innerText="顶点式："
	document.getElementById("AxisSymmetry1").innerText="对称轴：直线"
	document.getElementById("VertexPointCoordinates1").innerText="顶点坐标："
	document.getElementById("ParabolaOpens1").innerText="抛物线"
	upwards="开口向上。"
	downwards="开口向下。"
	NotExist="不存在。"
	document.getElementById("xGreater1").innerText="当"
	document.getElementById("xGreater3").innerText=" 时，"
	document.getElementById("xGreater4").innerText="随 x 的增大而"
	increases="增大"
	decreases="减小"
	document.getElementById("xGreater6").innerText="。"
	document.getElementById("xLess1").innerText="当"
	document.getElementById("xLess3").innerText=" 时，"
	document.getElementById("xLess4").innerText="随 x 的增大而"
	document.getElementById("xLess6").innerText="。"
	Minimum="最小值："
	Maximum="最大值："
	MinimumMaximum="最小值 / 最大值："
	document.getElementById("xIntercept1").innerText="与 x 轴的交点："
	and="和"
	document.getElementById("yIntercept1").innerText="与 y 轴的交点："
	None="无"
	break
	default:
	document.getElementById("VertexForm1").innerText="Vertex Form: "
	document.getElementById("AxisSymmetry1").innerText="Axis of Symmetry: Line"
	document.getElementById("VertexPointCoordinates1").innerText="Vertex Point Coordinates: "
	document.getElementById("ParabolaOpens1").innerText="The parabola "
	upwards="opens upwards."
	downwards="opens downwards."
	NotExist="does not exist."
	document.getElementById("xGreater1").innerText="When"
	document.getElementById("xGreater3").innerText=", "
	increases="increases"
	decreases="decreases"
	document.getElementById("xGreater6").innerText=" with the increase of x."
	document.getElementById("xLess1").innerText="When"
	document.getElementById("xLess3").innerText=", "
	document.getElementById("xLess6").innerText=" with the increase of x."
	Minimum="Minimum: "
	Maximum="Maximum: "
	MinimumMaximum="Minimum / Maximum: "
	document.getElementById("xIntercept1").innerText="x-Intercept: "
	and="and"
	document.getElementById("yIntercept1").innerText="y-Intercept: "
	None="None"
}
document.getElementById("ParabolaOpens2").innerText=NotExist
document.getElementById("xGreater5").innerText=increases+" / "+decreases
document.getElementById("xLess5").innerText=decreases+" / "+increases
document.getElementById("MinimumMaximum1").innerText=MinimumMaximum
