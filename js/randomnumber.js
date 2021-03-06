/*Code written by Shangzhen Yang*/
var historyArray=[],
interval=10,
intervalId,
nameValue="",
randomNumValue,
savedNames,
scrolling=true
function add(){
	document.getElementById("HistoryUl").innerHTML=""
	historyArray.push({
		"name":nameValue,
		"number":randomNumValue
	})
	for(var i=historyArray.length-1;i>=0;i--){
		var newLi=document.createElement("li")
		newLi.classList.add("menu")
		if(historyArray[i].name){
			newLi.innerText="("+(i+1)+") "+historyArray[i].name
		}else{
			newLi.innerText="("+(i+1)+") "+historyArray[i].number
		}
		document.getElementById("HistoryUl").appendChild(newLi)
	}
}
function addName(){
	loginRequired(function(){
		showPrompt([
			"Enter a person's name",
			"输入一个人的名字"
		],function(e){
			savedNames.names.push(e)
			loadNames(savedNames.names.length-1)
			count()
			submit(addName)
		})
	})
}
function clearHistory(negativeCallback){
	if(document.getElementById("HistoryUl").innerHTML){
		showConfirm([
			"Do you want to clear the history?",
			"您想清空历史记录吗？"
		],function(){
			document.getElementById("HistoryUl").innerHTML=""
			historyArray=[]
		},negativeCallback)
	}
}
function count(){
	if(savedNames.names.length<=0){
		document.getElementById("Minimum").value="1"
		document.getElementById("Maximum").value="60"
	}else{
		document.getElementById("Minimum").value="1"
		document.getElementById("Maximum").value=savedNames.names.length
	}
}
function load(){
	document.getElementById("NamesUl").innerHTML=""
	for(var i=0;i<savedNames.names.length;i++){
		loadNames(i)
	}
	count()
}
function loadNames(i){
	var newLi=document.createElement("li")
	newLi.classList.add("menu")
	newLi.innerText=savedNames.names[i]
	newLi.setAttribute("number",i+1)
	newLi.oncontextmenu=
	newLi.onclick=function(mouse){
		var index=this.getAttribute("number")*1-1
		showMenu(mouse,[{
			"onclick":function(){
				showPrompt([
					"Change "+savedNames.names[index]+" to",
					"把"+savedNames.names[index]+"更改为"
				],function(newName){
					savedNames.names[index]=newName
					submit()
				},null,savedNames.names[index])
				closeMenu()
			},
			"text":[
				"Change",
				"更改"
			]
		},{
			"onclick":function(){
				showConfirm([
					"Do you want to delete "+savedNames.names[index]+"?",
					"您想删除"+savedNames.names[index]+"吗？"
				],function(){
					savedNames.names.splice(index,1)
					submit()
				})
				closeMenu()
			},
			"text":[
				"Delete",
				"删除"
			]
		}])
	}
	document.getElementById("NamesUl").appendChild(newLi)
}
function random(){
	var hide=false,
	min=parseInt(document.getElementById("Minimum").value),
	max=parseInt(document.getElementById("Maximum").value),
	total
	nameValue=""
	randomNumValue=min+Math.round(Math.random()*(max-min))
	if(savedNames.names.length>0){
		nameValue=savedNames.names[randomNumValue-1]
	}
	if(function(){
		if(document.getElementById("OddNumberOnlyCheck").checked&randomNumValue%2==0||document.getElementById("EvenNumberOnlyCheck").checked&&randomNumValue%2!=0){
			return true
		}else if(historyArray.length>0&&!document.getElementById("DuplicatesCheck").checked){
			if(savedNames.names.length>0){
				total=savedNames.names.length
			}else{
				total=max-min+1
			}
			if(historyArray.length<total){
				if(historyArray.length-total==-1){
					hide=true
				}
				var contain=false
				for(var i=0;i<historyArray.length;i++){
					if(historyArray[i].number==randomNumValue){
						contain=true
					}
				}
				return contain
			}else if(historyArray.length>=total){
				document.getElementById("Add").style.display=""
				document.getElementById("DuplicatesCheck").checked=true
				return true
			}else{
				return false
			}
		}else{
			return false
		}
	}()){
		try{
			random()
		}catch(e){}
	}else{
		if(hide&&scrolling){
			document.getElementsByClassName("number")[0].innerText="?"
		}else{
			if(nameValue){
				document.getElementsByClassName("number")[0].innerText=nameValue
				return nameValue
			}else{
				document.getElementsByClassName("number")[0].innerText=randomNumValue
				return randomNumValue
			}
		}
	}
}
function randScroll(){
	random()
	scrolling=true
}
function startScrolling(){
	intervalId=setInterval(randScroll,interval)
	scrolling=true
}
function submit(callback){
	savedNames.time=new Date().getTime()
	localStorage.setItem("Names",JSON.stringify(savedNames))
	ajax({
		"url":backend+"userdata/upload",
		"data":{
			"dir":"names/",
			"text":JSON.stringify(savedNames),
			"token":login.token,
			"username":login.username
		},
		"method":"POST",
		"showLoading":true,
		"success":function(){
			load()
			if(callback){
				callback()
			}
			showToast([
				"Changes are saved",
				"更改已保存"
			])
		},
		"error":function(){
			load()
			if(callback){
				callback()
			}
			showToast([
				"Changes are saved locally",
				"更改已本地保存"
			])
		}
	})
}
document.getElementsByTagName("button")[0].onclick=function(){
	var closeDialog=function(){
		if(document.getElementsByClassName("popup")[0]){
			removeElement(document.getElementsByClassName("popup")[0])
		}
	}
	closeDialog()
	if(scrolling==false){
		startScrolling()
	}else{
		clearInterval(intervalId)
		scrolling=false
		if(document.getElementsByClassName("number")[0].innerText=="?"){
			random()
		}
		var newDiv=document.createElement("div"),
		newH1=document.createElement("h1"),
		newNumDiv=document.createElement("div"),
		newButton=document.createElement("button"),
		quantity=parseInt(document.getElementById("Quantity").value)
		if(quantity<1||!quantity){
			document.getElementById("Quantity").value=quantity=1
		}else if(quantity>40){
			document.getElementById("Quantity").value=quantity=40
		}
		newDiv.classList.add("popup")
		newNumDiv.classList.add("number")
		newButton.style.width="100%"
		for(var i=0;i<quantity;i++){
			if(newNumDiv.innerText){
				newNumDiv.innerText+=" "
				add()
				random()
			}
			newNumDiv.innerText+=document.getElementsByClassName("number")[0].innerText
		}
		switch(language){
			case "SimplifiedChinese":
			newH1.innerText="结果"
			newButton.innerText="添加到历史记录"
			break
			default:
			newH1.innerText="Result"
			newButton.innerText="Add to History"
		}
		newDiv.appendChild(newH1)
		newDiv.appendChild(newNumDiv)
		newDiv.appendChild(newButton)
		if(document.getElementById("DuplicatesCheck").checked&&quantity==1){
			newButton.onclick=function(){
				add()
				closeDialog()
				startScrolling()
			}
			var newCloseDiv=document.createElement("div")
			newCloseDiv.classList.add("close")
			newCloseDiv.innerText="×"
			newCloseDiv.onclick=function(){
				closeDialog()
				startScrolling()
			}
			newDiv.appendChild(newCloseDiv)
		}else{
			newButton.onclick=function(){
				closeDialog()
				startScrolling()
			}
			add()
		}
		document.body.appendChild(newDiv)
		newDiv.style.top="calc(50% - "+(newDiv.offsetHeight/2)+"px)"
		setTimeout(function(){
			newDiv.style.opacity="1"
		},25)
	}
}
document.getElementById("Speed").oninput=function(){
	if(this.value){
		interval=1000/this.value
		if(scrolling){
			clearInterval(intervalId)
			startScrolling()
		}
	}
}
document.getElementById("DuplicatesCheck").onchange=function(){
	if(this.checked){
		document.getElementById("Add").style.display=""
	}else{
		document.getElementById("Add").style.display="none"
		clearHistory(function(){
			document.getElementById("Add").style.display=""
			document.getElementById("DuplicatesCheck").checked=true
		})
	}
}
document.getElementById("OddNumberOnlyCheck").onchange=function(){
	document.getElementById("EvenNumberOnlyCheck").checked=false
}
document.getElementById("EvenNumberOnlyCheck").onchange=function(){
	document.getElementById("OddNumberOnlyCheck").checked=false
}
document.getElementById("ShowMoreCheck").onchange=function(){
	var fieldset=document.getElementsByTagName("fieldset")
	if(this.checked){
		for(var i=1;i<fieldset.length;i++){
			fieldset[i].style.display=""
		}
	}else{
		for(var i=1;i<fieldset.length;i++){
			fieldset[i].style.display="none"
		}
	}
}
document.getElementById("Add").onclick=add
document.getElementById("Clear").onclick=function(){
	clearHistory()
}
document.getElementById("NamesAdd").onclick=addName
document.getElementById("NamesClear").onclick=function(){
	showConfirm([
		"Do you want to clear the names?",
		"您想清空名字吗？"
	],function(){
		document.getElementById("NamesUl").innerHTML=""
		savedNames.names=[]
		submit()
	})
}
switch(language){
	case "SimplifiedChinese":
	document.title="随机抽号"
	document.getElementsByTagName("button")[0].innerText="立即抽号"
	document.getElementById("Settings").innerText="设置"
	document.getElementById("QuantityLabel").innerText="数量"
	document.getElementById("MinimumLabel").innerText="最小值"
	document.getElementById("MaximumLabel").innerText="最大值"
	document.getElementById("SpeedLabel").innerText="速度"
	document.getElementById("DuplicatesLabel").innerText="重复"
	document.getElementById("OddNumberOnlyLabel").innerText="仅奇数"
	document.getElementById("EvenNumberOnlyLabel").innerText="仅偶数"
	document.getElementById("ShowMoreLabel").innerText="显示更多"
	document.getElementById("History").innerText="历史记录"
	document.getElementById("Add").innerText="添加"
	document.getElementById("Clear").innerText="清空"
	document.getElementById("Names").innerText="名字"
	document.getElementById("NamesAdd").innerText="添加"
	document.getElementById("NamesClear").innerText="清空"
	break
	default:
	document.title="Random Number"
	document.getElementsByTagName("button")[0].innerText="Select Randomly"
	document.getElementById("Settings").innerText="Settings"
	document.getElementById("QuantityLabel").innerText="Quantity"
	document.getElementById("MinimumLabel").innerText="Minimum"
	document.getElementById("MaximumLabel").innerText="Maximum"
	document.getElementById("SpeedLabel").innerText="Speed"
	document.getElementById("DuplicatesLabel").innerText="Duplicates"
	document.getElementById("OddNumberOnlyLabel").innerText="Odd Number Only"
	document.getElementById("EvenNumberOnlyLabel").innerText="Even Number Only"
	document.getElementById("ShowMoreLabel").innerText="Show More"
	document.getElementById("History").innerText="History"
	document.getElementById("Add").innerText="Add"
	document.getElementById("Clear").innerText="Clear"
	document.getElementById("Names").innerText="Names"
	document.getElementById("NamesAdd").innerText="Add"
	document.getElementById("NamesClear").innerText="Clear"
}
newTitle.innerText=document.title
var currentNamesValue=localStorage.getItem("Names")
if(currentNamesValue&&currentNamesValue.indexOf("{")!=-1){
	savedNames=JSON.parse(currentNamesValue)
}else{
	savedNames={
		"names":[],
		"time":new Date().getTime()
	}
	if(currentNamesValue&&currentNamesValue.indexOf("\n")!=-1){
		var namesSplit=currentNamesValue.split("\n")
		for(var i=0;i<namesSplit.length;i++){
			if(namesSplit[i]){
				savedNames.names.push(namesSplit[i])
			}
		}
	}
	localStorage.setItem("Names",JSON.stringify(savedNames))
}
if(login.username){
	getUserData("names",function(e){
		if(e.time>savedNames.time){
			savedNames=e
		}
		if(JSON.stringify(savedNames)!=JSON.stringify(e)&&savedNames.names.length>0){
			submit()
		}else if(savedNames.names.length<=0){
			savedNames=e
			load()
		}else{
			load()
		}
	},load,true)
}else{
	load()
}
intervalId=setInterval(function(){
	randScroll()
},interval)
