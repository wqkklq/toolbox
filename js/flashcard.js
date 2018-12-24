/*Code written by Shangzhen Yang*/
var currentList,
dictCache=JSON.parse(localStorage.getItem("DictCache")),
openedWordList=localStorage.getItem("WordList"),
progress=1,
showingDefinition
function dictChanged(){
	var dictBox
	var changeDisplay=function(alwaysShow){
		if(dictBox.innerText==""||dictBox.innerText=="undefined"){
			dictBox.style.display=""
		}else if(showingDefinition||alwaysShow){
			dictBox.style.display="block"
		}
	}
	dictBox=document.getElementById("Pronunciation")
	changeDisplay(true)
	dictBox=document.getElementById("CNDefinition")
	changeDisplay(false)
	dictBox=document.getElementById("ENDefinition")
	changeDisplay(false)
	dictBox=document.getElementById("Translate")
	if(document.getElementById("CNDefinition").style.display){
		document.getElementById("Translate").style.display=""
	}else{
		changeDisplay(false)
	}
}
function loadWord(){
	document.getElementById("Progress").innerText=progress
	document.getElementsByTagName("input")[0].value=currentList[progress-1].word
	document.getElementById("CNDefinition").style.display="none"
	document.getElementById("ENDefinition").style.display="none"
	document.getElementById("ENDefinition").innerText=currentList[progress-1].definition
	if(dictCache[currentList[progress-1].word]){
		document.getElementById("Pronunciation").innerText=dictCache[currentList[progress-1].word].pronunciation
		document.getElementById("CNDefinition").innerText=dictCache[currentList[progress-1].word].cn_definition.defn
		document.getElementById("ENDefinition").innerText=dictCache[currentList[progress-1].word].en_definition.defn
		dictChanged()
	}
}
function lookUp(word){
	window.onkeydown=null
	newTitle.innerText=document.title
	reset()
	showingDefinition=true
	document.getElementById("ShowDefinition").style.display="none"
	document.getElementsByTagName("footer")[0].style.display="none"
	document.getElementsByTagName("input")[0].value=word
	if(dictCache[word]){
		document.getElementById("Pronunciation").innerText=dictCache[word].pronunciation
		document.getElementById("CNDefinition").innerText=dictCache[word].cn_definition.defn
		document.getElementById("ENDefinition").innerText=dictCache[word].en_definition.defn
		dictChanged()
		translateENDef()
	}else{
		translate(word,"auto","auto",function(e){
			document.getElementById("Translate").innerText=e
			dictChanged()
		})
		ajax({
			"url":backend+"get",
			"data":{
				"url":"http://api.shanbay.com/bdc/search/?"+encodeData({
					"word":word
				}),
				"username":"admin"
			},
			"dataType":"json",
			"showLoading":true,
			"success":function(e){
				if(e.msg=="SUCCESS"){
					document.getElementById("Pronunciation").innerText=e.data.pronunciation
					document.getElementById("CNDefinition").innerText=e.data.cn_definition.defn
					document.getElementById("ENDefinition").innerText=e.data.en_definition.defn
					dictChanged()
					if(!dictCache[e.data.content]){
						dictCache[e.data.content]=e.data
						if(Object.keys(dictCache).length>100){
							delete dictCache[Object.keys(dictCache)[0]]
						}
						localStorage.setItem("DictCache",JSON.stringify(dictCache))
					}
					translateENDef()
				}
			}
		})
	}
}
function next(){
	if(progress>=currentList.length){
		showAlert([
			"This is the last word",
			"这是最后一个单词"
		])
	}else{
		showingDefinition=false
		document.getElementById("ShowDefinition").style.display=""
		reset()
		progress+=1
		loadWord()
	}
}
function previous(){
	if(progress<=1){
		showAlert([
			"This is the first word",
			"这是第一个单词"
		])
	}else{
		showingDefinition=false
		document.getElementById("ShowDefinition").style.display=""
		reset()
		progress-=1
		loadWord()
	}
}
function reset(){
	document.getElementById("Pronunciation").innerText=""
	document.getElementById("CNDefinition").innerText=""
	document.getElementById("ENDefinition").innerText=""
	document.getElementById("Translate").innerText=""
	dictChanged()
}
function showDefinition(){
	showingDefinition=true
	document.getElementById("ShowDefinition").style.display="none"
	dictChanged()
}
function translateENDef(){
	if(document.getElementById("ENDefinition").innerText&&document.getElementById("ENDefinition").innerText!="undefined"){
		translate(document.getElementById("ENDefinition").innerText,"en","zh",function(e){
			document.getElementById("Translate").innerText=e
			document.getElementById("Translate").style.display="block"
		})
	}
}
document.getElementsByTagName("input")[0].onkeydown=function(e){
	if(e.keyCode==13&&this.value){
		lookUp(this.value)
	}
}
document.getElementById("Pronunciation").onclick=function(){
	new Audio("https://media.shanbay.com/audio/us/"+document.getElementsByTagName("input")[0].value.replace(/\s/g,"_")+".mp3").play()
}
document.getElementById("Translate").onclick=function(){
	openWebPage("https://fanyi.baidu.com/#en/zh/"+document.getElementsByTagName("input")[0].value)
}
document.getElementById("ShowDefinition").onclick=showDefinition
document.getElementById("Previous").onclick=previous
document.getElementById("Next").onclick=next
switch(language){
	case "SimplifiedChinese":
	document.title="学习卡"
	document.getElementsByTagName("input")[0].placeholder="输入要查询的单词"
	document.getElementById("ShowDefinition").innerText="显示释义"
	document.getElementById("Previous").innerText="上一个"
	document.getElementById("Next").innerText="下一个"
	break
	default:
	document.title="Flash Card"
	document.getElementsByTagName("input")[0].placeholder="Enter the word you want to look up"
	document.getElementById("ShowDefinition").innerText="Show Definition"
	document.getElementById("Previous").innerText="Previous"
	document.getElementById("Next").innerText="Next"
}
if(!dictCache){
	dictCache={}
}
if(!$_GET["word"]&&openedWordList){
	window.onkeydown=function(e){
		switch(e.keyCode){
			case 32:
			showDefinition()
			return false
			case 37:
			case 38:
			previous()
			return false
			case 39:
			case 40:
			next()
			return false
		}
	}
	currentList=JSON.parse(openedWordList).list
	newTitle.innerHTML=document.title+" (<span id=\"Progress\">1</span>/"+currentList.length+")"
	loadWord()
}else{
	newTitle.innerText=document.title
	if($_GET["word"]){
		lookUp($_GET["word"])
	}else{
		lookUp("morning")
	}
}
