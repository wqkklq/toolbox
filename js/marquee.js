/*Code written by Shangzhen Yang*/
var hist=[],
intervalId
function add(text,saved,title){
	if(function(){
		for(var i=0;i<hist.length;i++){
			if(hist[i]&&hist[i].replace(/\n/g,"")==text){
				return false
			}
		}
		return true
	}()){
		hist.push(text)
		if(!document.getElementsByTagName("ul")[0].style.display){
			document.getElementsByTagName("ul")[0].style.display="block"
		}
		var newLi=document.createElement("li")
		newLi.classList.add("menu")
		if(title){
			newLi.innerText=title
		}else{
			newLi.innerText=text
		}
		newLi.setAttribute("value",text)
		newLi.onclick=function(){
			scrollTo(0,0)
			document.getElementsByTagName("input")[0].value=this.getAttribute("value")
			start()
		}
		if(saved){
			document.getElementById("SavedText").appendChild(newLi)
		}else{
			document.getElementsByTagName("ul")[0].appendChild(newLi)
		}
	}
}
function load(){
	loadSavedText(JSON.parse(localStorage.getItem("SavedText")))
	if(login.username){
		getUserData("text",loadSavedText,null,true)
	}
}
function loadSavedText(e){
	document.getElementById("SavedText").innerHTML=""
	hist=[]
	if(e&&e.text){
		for(var i=e.text.length-1;i>=0;i--){
			if(e.text[i].encrypt){
				add(decrypt(e.text[i].text,"RTH"),true,e.text[i].title)
			}else{
				add(e.text[i].text,true,e.text[i].title)
			}
		}
	}
}
function start(){
	if(document.getElementsByTagName("input")[0].value){
		var newDiv=document.createElement("div"),
		newTextDiv=document.createElement("div")
		newDiv.classList.add("full-screen")
		newDiv.style.backgroundColor=document.getElementById("BackgroundColor").value
		newDiv.onclick=stop
		newTextDiv.innerText=document.getElementsByTagName("input")[0].value
		newTextDiv.style.color=document.getElementById("TextColor").value
		newDiv.appendChild(newTextDiv)
		document.body.appendChild(newDiv)
		setTimeout(function(){
			newDiv.style.opacity="1"
			if(newDiv.webkitRequestFullScreen){
				newDiv.webkitRequestFullScreen()
			}
			intervalId=setInterval(function(){
				var left
				if(newTextDiv.style.left){
					left=newTextDiv.style.left.replace("px","")
				}else{
					left=innerWidth
				}
				if(left<-newTextDiv.offsetWidth){
					newTextDiv.style.left=""
				}else{
					newTextDiv.style.left=(left-5)+"px"
				}
			},1000/document.getElementById("Speed").value)
		},25)
		add(document.getElementsByTagName("input")[0].value)
	}else{
		showAlert([
			"Please enter the text.",
			"请输入文本。"
		])
	}
}
function stop(){
	clearInterval(intervalId)
	removeElement(document.getElementsByClassName("full-screen")[0])
}
document.onwebkitfullscreenchange=function(){
	if(!document.webkitIsFullScreen){
		stop()
	}
}
document.getElementsByTagName("input")[0].onkeydown=function(e){
	if(e.keyCode==13){
		start()
	}
}
document.getElementsByTagName("button")[0].onclick=start
switch(language){
	case "SimplifiedChinese":
	document.title="跑马灯"
	document.getElementsByTagName("input")[0].placeholder="输入文本"
	document.getElementById("BackgroundColorLabel").innerText="背景颜色"
	document.getElementById("TextColorLabel").innerText="文本颜色"
	document.getElementById("SpeedLabel").innerText="速度"
	document.getElementsByTagName("button")[0].innerText="开始"
	break
	default:
	document.title="Marquee"
	document.getElementsByTagName("input")[0].placeholder="Enter the text"
	document.getElementById("BackgroundColorLabel").innerText="Background"
	document.getElementById("TextColorLabel").innerText="Text"
	document.getElementById("SpeedLabel").innerText="Speed"
	document.getElementsByTagName("button")[0].innerText="Start"
}
newTitle.innerText=document.title
load()
