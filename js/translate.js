/*Code written by Shangzhen Yang*/
var hist=[]
function add(text,saved,title){
	if((function(){
		for(var i=0;i<hist.length;i++){
			if(hist[i]==text){
				return false
			}
		}
		return true
	})()){
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
			document.getElementById("Original").value=this.getAttribute("value")
			translateText()
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
function translateText(){
	if(document.getElementById("Original").value){
		translate(document.getElementById("Original").value,document.getElementById("FromSelect").value,document.getElementById("ToSelect").value,function(e,data){
			document.getElementById("FromSelect").value=data.from
			document.getElementById("Translated").value=e
			if(data.trans_result.length>1){
				for(var i=1;i<data.trans_result.length;i++){
					document.getElementById("Translated").value+="\n"
					document.getElementById("Translated").value+=data.trans_result[i].dst
				}
			}
			add(document.getElementById("Original").value)
		})
	}else{
		showAlert([
			"Please enter the text you want to translate",
			"请输入要翻译的文本"
		])
	}
}
document.getElementById("ExchangeButton").onclick=function(){
	var from=document.getElementById("FromSelect").value
	if(from!="auto"){
		document.getElementById("FromSelect").value=document.getElementById("ToSelect").value
		document.getElementById("ToSelect").value=from
		document.getElementById("Original").value=document.getElementById("Translated").value
		document.getElementById("Translated").value=""
		if(document.getElementById("Original").value){
			translateText()
		}
	}
}
document.getElementById("Original").onkeydown=function(e){
	if(e.ctrlKey||e.metaKey){
		switch(e.keyCode){
			case 13:
			translateText()
		}
	}
}
document.getElementsByClassName("speaker")[0].onclick=function(){
	speak(document.getElementById("Original").value,document.getElementById("FromSelect").value)
}
document.getElementById("TranslateButton").onclick=translateText
document.getElementsByClassName("speaker")[1].onclick=function(){
	speak(document.getElementById("Translated").value,document.getElementById("ToSelect").value)
}
switch(language){
	case "SimplifiedChinese":
	document.title="翻译"
	document.getElementById("From").innerText="从"
	document.getElementById("FromSelect").options.add(new Option("检测语言","auto"))
	document.getElementById("To").innerText="到"
	document.getElementById("ExchangeButton").innerText="交换"
	document.getElementById("TranslateButton").innerText="翻译"
	break
	default:
	document.title="Translate"
	document.getElementById("From").innerText="From"
	document.getElementById("FromSelect").options.add(new Option("Detect Language","auto"))
	document.getElementById("To").innerText="To"
	document.getElementById("ExchangeButton").innerText="Exchange"
	document.getElementById("TranslateButton").innerText="Translate"
}
newTitle.innerText=document.title
for(var i=0;i<langOpt.length;i++){
	document.getElementById("FromSelect").options.add(new Option(langOpt[i][0],langOpt[i][1]))
	document.getElementById("ToSelect").options.add(new Option(langOpt[i][0],langOpt[i][1]))
}
switch(language){
	case "SimplifiedChinese":
	document.getElementById("ToSelect").value="zh"
	break
	default:
	document.getElementById("ToSelect").value="en"
}
load()
