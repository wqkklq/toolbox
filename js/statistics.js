/*Code written by Shangzhen Yang*/
var num=[]
function add(){
	showPrompt([
		"Enter a number",
		"输入一个数字"
	],function(e){
		addLi(e)
		num.push(e)
		calculate()
		add()
	},"number")
}
function addLi(newNum){
	var newLi=document.createElement("li")
	newLi.classList.add("menu")
	newLi.id="Num-"+(document.getElementsByClassName("text-like")[0].getElementsByTagName("li").length+1)
	newLi.innerText=newNum
	newLi.oncontextmenu=
	newLi.onclick=function(mouse){
		var index=this.id.replace("Num-","")*1-1
		showMenu(mouse,[{
			"onclick":function(){
				showPrompt([
					"Change "+num[index]+" to",
					"把"+num[index]+"更改为"
				],function(newNum){
					num[index]=newNum
					document.getElementById("Num-"+(index+1)).innerText=newNum
					calculate()
				},null,num[index])
				closeMenu()
			},
			"text":[
				"Change",
				"更改"
			]
		},{
			"onclick":function(){
				showConfirm([
					"Do you want to delete "+num[index]+"?",
					"您想删除 "+num[index]+" 吗？"
				],function(){
					num.splice(index,1)
					document.getElementsByClassName("text-like")[0].innerHTML=""
					for(var i=0;i<num.length;i++){
						addLi(num[i])
					}
					calculate()
				})
				closeMenu()
			},
			"text":[
				"Delete",
				"删除"
			]
		}])
	}
	document.getElementsByClassName("text-like")[0].appendChild(newLi)
}
function calculate(){
	var sum=0
	document.getElementById("Count").value=num.length
	for(var i=0;i<num.length;i++){
		sum+=num[i]*1
	}
	document.getElementById("Average").value=sum/num.length
	document.getElementById("Sum").value=sum
}
function clear(){
	num=[]
	document.getElementById("Count").value=
	document.getElementById("Average").value=
	document.getElementById("Sum").value=
	document.getElementsByClassName("text-like")[0].innerHTML=""
}
document.getElementById("Count").onkeydown=
document.getElementById("Average").onkeydown=
document.getElementById("Sum").onkeydown=function(){
	return false
}
document.getElementById("Add").onclick=add
document.getElementById("Clear").onclick=clear
switch(language){
	case "SimplifiedChinese":
	document.title="计算器"
	document.getElementById("CountLabel").innerText="计数"
	document.getElementById("AverageLabel").innerText="平均值"
	document.getElementById("SumLabel").innerText="求和"
	document.getElementById("Add").innerText="添加"
	document.getElementById("Clear").innerText="清空"
	break
	default:
	document.title="Calculator"
	document.getElementById("CountLabel").innerText="Count"
	document.getElementById("AverageLabel").innerText="Average"
	document.getElementById("SumLabel").innerText="Sum"
	document.getElementById("Add").innerText="Add"
	document.getElementById("Clear").innerText="Clear"
}
newTitle.innerText=document.title
