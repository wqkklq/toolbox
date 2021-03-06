/*Code written by Shangzhen Yang*/
var correctDefinition,
correctInt=0,
currentItem,
currentList=[],
correctWord,
dictCache=JSON.parse(localStorage.getItem("DictCache"))||{},
mistakes,
outOfOrder=[],
progress=1,
quizSettings=document.getElementsByClassName("mui-switch"),
quizSettingsChanged=false,
savedQuizSettings=JSON.parse(localStorage.getItem("QuizSettings")),
savedWordList=JSON.parse(localStorage.getItem("SavedWordList")),
showAnswer=false,
switchDiv=document.getElementsByClassName("mui-switch"),
wordIndex
function add(word){
	showPrompt([
		"Enter a new word",
		"输入新单词"
	],function(newWord){
		var enterDef=function(){
			showPrompt([
				"Enter the definition of the new word",
				"输入新单词的释义"
			],function(newDefinition){
				addWord(newWord,newDefinition)
			},null,null,function(){
				translate(newWord,document.getElementsByTagName("select")[0].value,(function(){
					switch(language){
						case "SimplifiedChinese":
						return "zh"
						default:
						return "en"
					}
				})(),function(e){
					addWord(newWord,e)
				})
			},function(){
				add(newWord)
			})
		}
		if(document.getElementsByTagName("select")[0].value=="en"){
			if(dictCache[newWord]){
				if(language=="SimplifiedChinese"){
					addWord(newWord,dictCache[newWord].cn_definition.defn)
				}else{
					addWord(newWord,dictCache[newWord].en_definition.defn)
				}
			}else{
				ajax({
					"url":backend+"get",
					"data":{
						"url":"http://api.shanbay.com/bdc/search/?"+encodeData({
							"word":newWord
						}),
						"username":"admin"
					},
					"dataType":"json",
					"showLoading":true,
					"success":function(e){
						if(e.msg=="SUCCESS"){
							if(language=="SimplifiedChinese"&&e.data.cn_definition.defn){
								addWord(newWord,e.data.cn_definition.defn)
							}else if(e.data.en_definition.defn){
								addWord(newWord,e.data.en_definition.defn)
							}
							if(!dictCache[e.data.content]){
								dictCache[e.data.content]=e.data
								if(Object.keys(dictCache).length>100){
									delete dictCache[Object.keys(dictCache)[0]]
								}
								localStorage.setItem("DictCache",JSON.stringify(dictCache))
							}
						}else{
							if(language!="SimplifiedChinese"||confirm(e.msg)&&e.msg.indexOf("未找到单词")!=-1){
								enterDef()
							}else{
								add(newWord)
							}
						}
					},
					"error":enterDef
				})
			}
		}else{
			enterDef()
		}
	},null,word)
}
function addMistake(word,definition){
	var repeat=false
	for(var i=0;i<mistakes.list.length;i++){
		if(mistakes.list[i].word==word){
			repeat=true
		}
	}
	if(!repeat){
		mistakes.list.push({
			"definition":definition,
			"word":word
		})
	}
}
function addWord(word,definition){
	currentList.push({
		"definition":definition,
		"word":word
	})
	addWordLi(word,definition,currentList.length-1)
	scrollTo(0,document.body.scrollHeight)
	save(null,null,true)
	add()
}
function addWordLi(word,definition,i){
	var newLi=document.createElement("li"),
	newLabel=document.createElement("label"),
	newP=document.createElement("p")
	newLi.classList.add("menu")
	newLi.id="Word"+(i+1)
	newLi.oncontextmenu=
	newLi.onclick=function(mouse){
		var index=(this.id.replace("Word",""))*1-1
		showMenu(mouse,[{
			"onclick":function(){
				lookUp(currentList[index].word)
			},
			"text":[
				"Look Up",
				"查询"
			]
		},{
			"onclick":function(){
				showPrompt([
					"Change "+currentList[index].word+" to",
					"把 "+currentList[index].word+" 更改为"
				],function(newWord){
					showPrompt([
						"Change "+currentList[index].definition+" to",
						"把"+currentList[index].definition+"更改为"
					],function(newDefinition){
						currentList[index].word=newWord
						currentList[index].definition=newDefinition
						document.getElementById("Word"+(index+1)).getElementsByTagName("label")[0].innerText=newWord
						document.getElementById("Word"+(index+1)).getElementsByTagName("p")[0].innerText=newDefinition
						save()
					},null,currentList[index].definition)
				},null,currentList[index].word)
				closeMenu()
			},
			"text":[
				"Change",
				"更改"
			]
		},{
			"onclick":function(){
				speak(currentList[index].word,document.getElementsByTagName("select")[0].value)
				closeMenu()
			},
			"text":[
				"Speak",
				"朗读"
			]
		},{
			"onclick":function(){
				showConfirm([
					"Do you want to delete "+currentList[index].word+"?",
					"您想删除 "+currentList[index].word+" 吗？"
				],function(){
					currentList.splice(index,1)
					save(null,true)
				})
				closeMenu()
			},
			"text":[
				"Delete",
				"删除"
			]
		}])
		return false
	}
	newLabel.innerText=word
	newP.innerText=definition
	newLi.appendChild(newLabel)
	newLi.appendChild(newP)
	document.getElementById("WordListUl").appendChild(newLi)
}
function applyItem(serialNumber,list,willReload){
	if(serialNumber==0||serialNumber==null){
		currentItem=null
		localStorage.setItem("WordList",JSON.stringify(list))
		localStorage.removeItem("WordListCurrentItem")
	}else{
		currentItem=serialNumber*1
		localStorage.setItem("WordList",JSON.stringify(savedWordList.list[currentItem-1]))
		localStorage.setItem("WordListCurrentItem",currentItem)
	}
	if(willReload||!document.getElementsByClassName("start")[0].style.display){
		reload()
	}
}
function arrange(name){
	var wordCount=currentList.length*1,wordMin
	switch(name){
		case "flashcard":
		wordMin=1
		break
		case "quiz":
		wordMin=4
	}
	if(wordCount>=wordMin){
		if(name=="quiz"){
			openDiv("quiz")
			save()
		}else{
			localStorage.setItem("WordList",JSON.stringify({
				"list":currentList,
				"title":document.getElementById("TitleInput").value
			}))
			openWindow(name)
		}
	}else{
		showAlert([
			"Too few words. ("+wordCount+"/"+wordMin+")",
			"单词太少。("+wordCount+"/"+wordMin+")"
		])
	}
}
function closeDoc(){
	closeMenu()
	document.getElementById("TitleInput").value=""
	localStorage.removeItem("WordList")
	currentItem=null
	localStorage.removeItem("WordListCurrentItem")
	reload()
}
function convertFormat(list){
	if(list.indexOf("RTH 1")!=-1){
		list=list.replace(/<br \/>|\r/g,"")
		var wla=[],
		wls=list.split("\n")
		for(var i=1;i<wls.length-1;i+=2){
			wla.push({
				"definition":wls[i+1],
				"word":wls[i]
			})
		}
		return{
			"list":wla,
			"title":""
		}
	}else{
		return JSON.parse(list)
	}
}
function end(){
	var correctRate=Math.round(100-(mistakes.list.length/progress)*100)
	if(mistakes.list.length>0){
		currentItem=null
		localStorage.setItem("WordList",JSON.stringify(mistakes))
		localStorage.removeItem("WordListCurrentItem")
	}
	showAlert([
		"Correct rate: "+correctRate+"%",
		"正确率："+correctRate+"%"
	])
	reload()
}
function expWL(){
	if(isTencent){
		showAlert([
			"Please open this page in the browser.",
			"请在浏览器中打开此页面。"
		])
	}else if(login.username){
		showConfirm([
			"Do you want to export this word list?",
			"您想导出此单词表吗？"
		],function(){
			save(function(){
				openWebPage(backend+"userdata/getwordlist?"+encodeData({
					"dl":"json",
					"index":currentItem,
					"username":login.username
				}),true)
			})
		})
	}else if(!isLinux&&!isMobile){
		showConfirm([
			"Do you want to export this word list?",
			"您想导出此单词表吗？"
		],function(){
			var filename=document.getElementById("TitleInput").value
			if(filename==""){
				filename=document.title
			}
			if(filename.indexOf(".")==-1){
				filename+=".rth"
			}
			var dl=document.createElement("a")
			dl.setAttribute("href","data:text/plain;charset=utf-8,"+encodeURIComponent(JSON.stringify({
				"list":currentList,
				"title":document.getElementById("TitleInput").value
			})))
			dl.setAttribute("download",filename)
			dl.click()
		})
	}else if(!login.username){
		loginDialog()
	}
}
function generateOrder(){
	wordIndex=Math.round(Math.random()*currentList.length-1)+1
	if(arrayContains(wordIndex,outOfOrder)||wordIndex==0){
		generateOrder()
	}
}
function getIndex(){
	if(savedWordList.list[currentItem-1].created){
		return savedWordList.list[currentItem-1].created
	}else{
		return currentItem
	}
}
function getURL(){
	if(currentItem&&savedWordList.list[currentItem-1]&&!savedWordList.list[currentItem-1].encrypt){
		var index=getIndex(),
		short=encodeURIComponent(document.getElementById("TitleInput").value.replace(/:|\//g,""))
		if(!short){
			short=MD5(login.username+index).substr(0,6)
		}
		return{
			"domain":short,
			"original":"https://rthsoftware.cn/toolbox/wordlist?"+encodeData({
				"index":index,
				"username":login.username
			}),
			"short":secondary+short
		}
	}
}
function isEnabled(name){
	if(document.getElementById(name+"Switch")){
		return document.getElementById(name+"Switch").classList.contains("mui-active")
	}
}
function load(){
	if(!savedWordList){
		savedWordList={
			"list":[],
			"sharing":false,
			"time":new Date().getTime(),
			"username":""
		}
	}
	for(var i=0;i<9999;i++){
		var oldWL=localStorage.getItem("WordList"+i)
		if(oldWL){
			savedWordList.list.push(convertFormat(oldWL))
			localStorage.removeItem("WordList"+i)
		}
	}
	localStorage.setItem("SavedWordList",JSON.stringify(savedWordList))
	loadMyWordList()
	if(login.username){
		getUserData("wordlist",function(e){
			if(e.username==savedWordList.username){
				if(e.time>savedWordList.time){
					savedWordList=e
				}
			}else{
				savedWordList.list=savedWordList.list.concat(e.list)
				savedWordList.time=new Date().getTime()
				savedWordList.username=login.username
			}
			if(JSON.stringify(savedWordList)!=JSON.stringify(e)&&savedWordList.list.length>0){
				submit(loadMyWordList)
			}else if(savedWordList.list.length<=0){
				savedWordList=e
				loadMyWordList()
			}else{
				loadMyWordList()
			}
		},function(e){
			if(e.status!=0&&savedWordList.list.length>0){
				submit(loadMyWordList)
			}else{
				loadMyWordList()
			}
		})
	}
	var openedWordList=localStorage.getItem("WordList")
	if(openedWordList&&openedWordList!="undefined"){
		currentItem=localStorage.getItem("WordListCurrentItem")*1
		openedWordList=convertFormat(openedWordList)
		currentList=currentList.concat(openedWordList.list)
		document.getElementById("TitleInput").value=openedWordList.title
		for(var i=0;i<currentList.length;i++){
			addWordLi(currentList[i].word,currentList[i].definition,i)
		}
		openDiv("edit")
	}else{
		var friendEmail=localStorage.getItem("FriendEmail")
		if(friendEmail&&friendEmail){
			ajax({
				"url":backend+"userdata/getwordlist",
				"data":{
					"email":friendEmail,
				},
				"dataType":"json",
				"success":function(e){
					for(var i=e.length-1;i>=0;i--){
						var newLi=document.createElement("li")
						newLi.classList.add("menu")
						newLi.innerText="F"+addZero(e.length-i,3)+". "
						if(e[i].title){
							newLi.innerText+=e[i].title
						}else{
							switch(language){
								case "SimplifiedChinese":
								if(e[i].count>0){
									newLi.innerText+=e[i].word+" 和另外 "+e[i].count+" 个单词"
								}else{
									newLi.innerText+="空白单词表"
								}
								break
								default:
								if(e[i].count>0){
									newLi.innerText+=e[i].word+" and other "+e[i].count+" words"
								}else{
									newLi.innerText+="Empty Word List"
								}
							}
						}
						newLi.setAttribute("number",i+1)
						newLi.onclick=function(){
							ajax({
								"url":backend+"userdata/getwordlist",
								"data":{
									"email":friendEmail,
									"index":this.getAttribute("number")*1
								},
								"dataType":"json",
								"success":function(e){
									applyItem(0,e)
								},
								"error":error
							})
						}
						document.getElementById("FriendWordList").appendChild(newLi)
					}
				},
				"error":function(){
					showToast([
						friendEmail+" has no shared word lists",
						friendEmail+" 没有共享单词表"
					])
				}
			})
		}
		ajax({
			"url":backend+"userdata/getwordlist",
			"data":{
				"language":language,
				"username":"admin"
			},
			"dataType":"json",
			"success":function(e){
				var count=0
				for(var i=e.length-1;i>=0;i--){
					count++
					var newLi=document.createElement("li")
					newLi.classList.add("menu")
					newLi.innerText="A"+addZero(count,3)+". "
					if(e[i].title){
						newLi.innerText+=e[i].title
					}else{
						switch(language){
							case "SimplifiedChinese":
							newLi.innerText+=e[i].word+" 和另外 "+e[i].count+" 个单词"
							break
							default:
							newLi.innerText+=e[i].word+" and other "+e[i].count+" words"
						}
					}
					newLi.setAttribute("number",e[i].index+1)
					newLi.onclick=function(){
						ajax({
							"url":backend+"userdata/getwordlist",
							"data":{
								"index":this.getAttribute("number")*1,
								"username":"admin"
							},
							"dataType":"json",
							"success":function(e){
								applyItem(0,e)
							},
							"error":error
						})
					}
					document.getElementById("AdminWordList").appendChild(newLi)
				}
			}
		})
	}
}
function loadMyWordList(){
	try{
		if(savedWordList&&savedWordList.list&&savedWordList.list[0]){
			document.getElementById("MyWordList").innerHTML=""
			for(var i=savedWordList.list.length-1;i>=0;i--){
				var newLi=document.createElement("li")
				newLi.classList.add("menu")
				newLi.innerText="M"+addZero(savedWordList.list.length-i,3)+". "
				if(savedWordList.list[i].title){
					newLi.innerText+=savedWordList.list[i].title
				}else{
					switch(language){
						case "SimplifiedChinese":
						if(savedWordList.list[i].list[0]){
							newLi.innerText+=savedWordList.list[i].list[0].word+" 和另外 "+savedWordList.list[i].list.length+" 个单词"
						}else{
							newLi.innerText+="空白单词表"
						}
						break
						default:
						if(savedWordList.list[i].list[0]){
							newLi.innerText+=savedWordList.list[i].list[0].word+" and other "+savedWordList.list[i].list.length+" words"
						}else{
							newLi.innerText+="Empty Word List"
						}
					}
				}
				newLi.setAttribute("number",i+1)
				newLi.onclick=function(){
					applyItem(this.getAttribute("number"))
				}
				document.getElementById("MyWordList").appendChild(newLi)
			}
		}
	}catch(e){
		for(var i=0;i<savedWordList.list.length;i++){
			if(typeof savedWordList.list[i]=="string"){
				savedWordList.list[i]=JSON.parse(savedWordList.list[i])
			}
		}
		loadMyWordList()
	}
}
function loadQuestion(){
	showAnswer=false
	document.getElementById("EnteredWord").value=""
	document.getElementById("EnteredDefinition").value=""
	document.getElementById("Progress").innerText=progress
	generateOrder()
	outOfOrder.push(wordIndex)
	correctWord=currentList[wordIndex-1].word
	correctDefinition=currentList[wordIndex-1].definition
	if(isEnabled("MultipleChoice")){
		document.getElementById("Option1").innerText=
		document.getElementById("Option2").innerText=
		document.getElementById("Option3").innerText=
		document.getElementById("Option4").innerText=""
		var optionIndex=0,optionStr=""
		correctInt=Math.round(Math.random()*3)
		var options=[wordIndex]
		if(isEnabled("AnswerWords")){
			optionStr=correctWord
		}else if(isEnabled("AnswerDefinitions")){
			optionStr=correctDefinition
		}
		switch(correctInt){
			case 0:
			document.getElementById("Option1").innerText=optionStr
			break
			case 1:
			document.getElementById("Option2").innerText=optionStr
			break
			case 2:
			document.getElementById("Option3").innerText=optionStr
			break
			case 3:
			document.getElementById("Option4").innerText=optionStr
		}
		var generateOption=function(){
			optionIndex=Math.round(Math.random()*currentList.length-1)+1
			if(arrayContains(optionIndex,options)||optionStr==null||optionIndex==0){
				generateOption()
			}else{
				if(isEnabled("AnswerWords")){
					optionStr=currentList[optionIndex-1].word
				}else if(isEnabled("AnswerDefinitions")){
					optionStr=currentList[optionIndex-1].definition
				}
				options.push(optionIndex)
			}
		}
		for(var i=0;i<4;i++){
			generateOption()
			if(document.getElementById("Option1").innerText==""){
				document.getElementById("Option1").innerText=optionStr
			}else if(document.getElementById("Option2").innerText==""){
				document.getElementById("Option2").innerText=optionStr
			}else if(document.getElementById("Option3").innerText==""){
				document.getElementById("Option3").innerText=optionStr
			}else if(document.getElementById("Option4").innerText==""){
				document.getElementById("Option4").innerText=optionStr
			}
		}
	}
	if(isEnabled("SpeakWords")){
		switch(language){
			case "SimplifiedChinese":
			document.getElementById("Show").innerText="没有可显示的内容"
			break
			default:
			document.getElementById("Show").innerText="There is nothing to show"
		}
	}else if(isEnabled("AnswerDefinitions")){
		document.getElementById("Show").innerText=correctWord
	}else if(isEnabled("AnswerWords")){
		document.getElementById("Show").innerText=correctDefinition
	}
	if(isEnabled("SpeakWords")){
		speakQuestion()
	}
}
function lookUp(word){
	if(!word){
		if(!document.getElementById("LookUpInput").value){
			showAlert([
				"Please enter the word you want to look up.",
				"请输入要查询的单词。"
			])
			return false
		}else{
			word=document.getElementById("LookUpInput").value
		}
	}
	openWindow("flashcard?"+encodeData({
		"word":word
	}))
}
function openDiv(className){
	newTitle.innerText=document.title
	switch(className){
		case "edit":
		if(!document.getElementsByClassName("edit")[0].style.display){
			scrollTo(0,0)
			document.getElementsByClassName("start")[0].style.display="none"
			document.getElementsByClassName("edit")[0].style.display="block"
			document.getElementsByClassName("quiz")[0].style.display=""
			document.getElementsByTagName("footer")[0].style.display="block"
			newBack.onclick=closeDoc
		}
		break
		case "quiz":
		if(!document.getElementsByClassName("quiz")[0].style.display){
			scrollTo(0,0)
			document.getElementsByClassName("start")[0].style.display="none"
			document.getElementsByClassName("edit")[0].style.display=""
			document.getElementsByClassName("quiz")[0].style.display="block"
			document.getElementsByTagName("footer")[0].style.display=""
			newBack.onclick=end
			restartQuiz()
		}
		break
		case "start":
		if(document.getElementsByClassName("start")[0].style.display){
			scrollTo(0,0)
			document.getElementsByClassName("start")[0].style.display=
			document.getElementsByClassName("edit")[0].style.display=
			document.getElementsByClassName("quiz")[0].style.display=
			document.getElementsByTagName("footer")[0].style.display=""
			newBack.onclick=function(){
				history.go(-1)
			}
		}
	}
}
function openLWL(file){
	var type=file.name.toLowerCase().split(".")[1]
	if(type=="json"||type=="rth"){
		var reader=new FileReader()
		reader.onload=function(){
			applyItem(0,convertFormat(this.result))
		}
		reader.readAsText(file)
	}else{
		showAlert([
			"Unable to open this type of file.",
			"无法打开此类文件。"
		])
	}
}
function optionClicked(clickedNum){
	if(document.getElementsByClassName("quiz")[0].style.display=="block"&&isEnabled("MultipleChoice")){
		if(clickedNum==correctInt){
			showAnswer=true
			next()
		}else{
			addMistake(correctWord,correctDefinition)
			showAlert([
				"Not this one.",
				"不是这个。"
			])
		}
	}
}
function next(){
	if(quizSettingsChanged){
		showAlert([
			"Click Restart to apply the settings.",
			"单击重新开始使设置生效。"
		])
	}else{
		if(!showAnswer&&isEnabled("MultipleChoice")){
			addMistake(correctWord,correctDefinition)
		}
		if(!showAnswer&&!isEnabled("MultipleChoice")){
			showAnswer=true
			if(isEnabled("AnswerWords")){
				if(document.getElementById("EnteredWord").value.toLowerCase().trim()==correctWord.toLowerCase()){
					switch(language){
						case "SimplifiedChinese":
						document.getElementById("EnteredWord").value+="（正确）"
						break
						default:
						document.getElementById("EnteredWord").value+=" (Correct)"
					}
				}else{
					addMistake(correctWord,correctDefinition)
					switch(language){
						case "SimplifiedChinese":
						document.getElementById("EnteredWord").value+=" ≠ "+correctWord+"（错误）"
						break
						default:
						document.getElementById("EnteredWord").value+=" ≠ "+correctWord+" (Incorrect)"
					}
				}
			}
			if(isEnabled("AnswerDefinitions")){
				if(document.getElementById("EnteredDefinition").value.toLowerCase().trim()==correctDefinition.toLowerCase()){
					switch(language){
						case "SimplifiedChinese":
						document.getElementById("EnteredDefinition").value+="（正确）"
						break
						default:
						document.getElementById("EnteredDefinition").value+=" (Correct)"
					}
				}else if(document.getElementById("EnteredDefinition").value&&correctDefinition.toLowerCase().indexOf(document.getElementById("EnteredDefinition").value.toLowerCase().trim())!=-1||document.getElementById("EnteredDefinition").value.toLowerCase().trim().indexOf(correctDefinition.toLowerCase())!=-1){
					switch(language){
						case "SimplifiedChinese":
						document.getElementById("EnteredDefinition").value+=" ≈ "+correctDefinition+"（正确）"
						break
						default:
						document.getElementById("EnteredDefinition").value+=" ≈ "+correctDefinition+" (Correct)"
					}
				}else{
					addMistake(correctWord,correctDefinition)
					switch(language){
						case "SimplifiedChinese":
						document.getElementById("EnteredDefinition").value+=" ≠ "+correctDefinition+"（错误）"
						break
						default:
						document.getElementById("EnteredDefinition").value+=" ≠ "+correctDefinition+" (Incorrect)"
					}
				}
			}
		}else{
			if(progress>=currentList.length){
				end()
			}else{
				progress+=1
				loadQuestion()
			}
		}
	}
}
function reload(){
	currentList=[]
	document.getElementById("WordListUl").innerHTML=
	document.getElementById("MyWordList").innerHTML=
	document.getElementById("FriendWordList").innerHTML=
	document.getElementById("AdminWordList").innerHTML=""
	if(!localStorage.getItem("WordList")){
		openDiv("start")
	}
	load()
}
function restartQuiz(){
	newTitle.innerHTML=document.getElementById("Quiz").innerText+" (<span id=\"Progress\">1</span>/"+currentList.length+")"
	quizSettingsChanged=false
	progress=1
	outOfOrder=[]
	mistakes.list=[]
	loadQuestion()
	if(isEnabled("MultipleChoice")){
		document.getElementById("AnswerUl").style.display="block"
		document.getElementById("AnswerWordDiv").style.display="none"
		document.getElementById("AnswerDefinitionDiv").style.display="none"
	}else{
		document.getElementById("AnswerUl").style.display=""
		if(isEnabled("AnswerWords")&&isEnabled("AnswerDefinitions")){
			document.getElementById("AnswerWordDiv").style.display=""
			document.getElementById("AnswerDefinitionDiv").style.display=""
		}else if(isEnabled("AnswerWords")&&!isEnabled("AnswerDefinitions")){
			document.getElementById("AnswerWordDiv").style.display=""
			document.getElementById("AnswerDefinitionDiv").style.display="none"
		}else if(!isEnabled("AnswerWords")&&isEnabled("AnswerDefinitions")){
			document.getElementById("AnswerWordDiv").style.display="none"
			document.getElementById("AnswerDefinitionDiv").style.display=""
		}else{
			document.getElementById("AnswerWordDiv").style.display="none"
			document.getElementById("AnswerDefinitionDiv").style.display="none"
		}
	}
	document.getElementById("NextButton").style.display=""
}
function save(callback,willReload,hideLoading){
	loginRequired(function(){
		if(currentItem){
			savedWordList.list[currentItem-1].list=currentList
			savedWordList.list[currentItem-1].title=document.getElementById("TitleInput").value
			submit(function(){
				if(callback){
					callback()
				}
				applyItem(currentItem,null,willReload)
			},JSON.stringify(savedWordList.list[currentItem-1]),getIndex(),hideLoading)
		}else{
			if(savedWordList.list[0]){
				savedWordList.list.push({
					"created":new Date().getTime(),
					"list":currentList,
					"title":document.getElementById("TitleInput").value
				})
			}else{
				savedWordList.list=[{
					"created":new Date().getTime(),
					"list":currentList,
					"title":document.getElementById("TitleInput").value
				}]
			}
			currentItem=savedWordList.list.length
			submit(function(){
				if(callback){
					callback()
				}
				applyItem(currentItem,null,willReload)
			},null,null,hideLoading)
		}
	})
}
function speakQuestion(){
	speak(correctWord,document.getElementsByTagName("select")[0].value)
}
function submit(callback,text,key,hideLoading){
	savedWordList.time=new Date().getTime()
	localStorage.setItem("SavedWordList",JSON.stringify(savedWordList))
	var postData={
		"dir":"wordlist/",
		"text":JSON.stringify(savedWordList),
		"token":login.token,
		"username":login.username
	}
	if(key){
		postData["key"]=key
		postData["text"]=text
		postData["time"]=savedWordList.time
	}
	ajax({
		"url":backend+"userdata/upload",
		"data":postData,
		"method":"POST",
		"showLoading":!hideLoading,
		"success":function(){
			if(callback){
				callback()
			}
			showToast([
				"Changes are saved",
				"更改已保存"
			])
		},
		"error":function(){
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
window.onkeydown=function(e){
	if(e.ctrlKey||e.metaKey){
		switch(e.keyCode){
			case 79:
			openDialog()
			return false
			case 83:
			save()
			return false
		}
	}else{
		switch(e.keyCode){
			case 49:
			optionClicked(0)
			break
			case 50:
			optionClicked(1)
			break
			case 51:
			optionClicked(2)
			break
			case 52:
			optionClicked(3)
		}
	}
}
document.getElementById("LookUpInput").onkeydown=function(e){
	if(e.keyCode==13&&this.value){
		lookUp()
	}
}
document.getElementById("LookUpButton").onclick=function(){
	lookUp()
}
document.getElementById("NewWL").onclick=function(){
	loginRequired(function(){
		document.getElementById("TitleInput").value=""
		openDiv("edit")
	})
}
document.getElementById("Open").onclick=openDialog
document.getElementById("SharingSettings").onclick=function(){
	if(!document.getElementsByClassName("popup")[0]){
		var newDiv=document.createElement("div"),
		newH1=document.createElement("h1"),
		newDescriptionDiv=document.createElement("div"),
		newInput=document.createElement("input"),
		newSharingButton=document.createElement("button"),
		newNotSharingButton=document.createElement("button"),
		newCloseDiv=document.createElement("div")
		newDiv.classList.add("popup")
		newDescriptionDiv.classList.add("description")
		newDescriptionDiv.style.marginBottom="20px"
		newInput.type="email"
		var friendEmail=localStorage.getItem("FriendEmail")
		if(friendEmail){
			newInput.value=friendEmail
		}
		if(savedWordList.sharing){
			newSharingButton.classList.add("active")
			newNotSharingButton.classList.remove("active")
		}else{
			newSharingButton.classList.remove("active")
			newNotSharingButton.classList.add("active")
		}
		newSharingButton.onclick=function(){
			newSharingButton.classList.add("active")
			newNotSharingButton.classList.remove("active")
		}
		newNotSharingButton.onclick=function(){
			newSharingButton.classList.remove("active")
			newNotSharingButton.classList.add("active")
		}
		newCloseDiv.classList.add("close")
		newCloseDiv.innerText="×"
		newCloseDiv.onclick=function(){
			localStorage.setItem("FriendEmail",newInput.value)
			if(newSharingButton.classList.contains("active")){
				savedWordList.sharing=true
			}else{
				savedWordList.sharing=false
			}
			ajax({
				"url":backend+"userdata/set",
				"data":{
					"appname":"wordlist",
					"key":"share",
					"token":login.token,
					"username":login.username,
					"value":savedWordList.sharing.toString()
				},
				"method":"POST",
				"success":reload,
				"error":error
			})
			newDiv.style.opacity=""
			setTimeout(function(){
				document.body.removeChild(newDiv)
			},250)
		}
		switch(language){
			case "SimplifiedChinese":
			newH1.innerText="共享设置"
			newDescriptionDiv.innerText="如果您的好友选择了共享，您可以在下方的输入框中输入他/她的电子邮箱地址来查看他/她的单词表。"
			newInput.placeholder="电子邮箱"
			newSharingButton.innerText="共享"
			newNotSharingButton.innerText="不共享"
			break
			default:
			newH1.innerText="Sharing Settings"
			newDescriptionDiv.innerText="If your friend selects Sharing, you can enter his/her email address in the input box below to get his/her word lists."
			newInput.placeholder="Email"
			newSharingButton.innerText="Sharing"
			newNotSharingButton.innerText="Not Sharing"
		}
		newDiv.appendChild(newH1)
		newDiv.appendChild(newDescriptionDiv)
		newDiv.appendChild(newInput)
		newDiv.appendChild(newSharingButton)
		newDiv.appendChild(newNotSharingButton)
		newDiv.appendChild(newCloseDiv)
		document.body.appendChild(newDiv)
		newDiv.style.top="calc(50% - "+(newDiv.offsetHeight/2)+"px)"
		setTimeout(function(){
			newDiv.style.opacity="1"
		},25)
	}
}
document.getElementById("ClearMistakes").onclick=function(){
	showConfirm([
		"Do you want to clear mistakes?",
		"您想清空错题吗？"
	],function(){
		for(var i=0;i<savedWordList.list.length;i++){
			if(/Mistakes|错题/.test(savedWordList.list[i].title)){
				savedWordList.list.splice(i,1)
				i=0
			}
		}
		if(login.username){
			submit()
		}
		closeDoc()
	})
}
document.getElementById("TitleInput").onkeydown=function(e){
	if(e.keyCode==13){
		save()
	}
}
document.getElementById("Quiz").onclick=function(){
	arrange("quiz")
}
document.getElementById("Add").onclick=function(){
	add()
}
document.getElementById("Save").onclick=function(){
	save()
}
document.getElementById("Export").onclick=expWL
document.getElementById("CloseDocument").onclick=closeDoc
document.getElementById("Share").onclick=function(){
	save(function(){
		ajax({
			"url":backend+"userdata/domain/add",
			"data":{
				"domain":getURL().domain,
				"redirect":302,
				"to":getURL().original,
				"token":login.token,
				"username":login.username
			},
			"method":"POST",
			"dataType":"json",
			"showLoading":true,
			"success":function(e){
				var url
				if(e.available){
					url=getURL().short
				}else{
					url=getURL().original
				}
				url=decodeURI(url)
				showPrompt(null,function(){
					openWebPage(url)
				},"url",url)
			},
			"error":error
		})
	})
}
document.getElementById("Delete").onclick=function(){
	showConfirm([
		"Do you want to delete this word list?",
		"您想删除此单词表吗？"
	],function(){
		if(currentItem){
			if(login.username){
				ajax({
					"url":backend+"userdata/domain/del",
					"data":{
						"domain":getURL().domain,
						"token":login.token,
						"username":login.username
					},
					"method":"POST",
					"showLoading":true,
					"success":function(){
						savedWordList.list.splice(currentItem-1,1)
						submit(closeDoc)
					},
					"error":function(){
						savedWordList.list.splice(currentItem-1,1)
						submit(closeDoc)
					}
				})
			}else{
				savedWordList.list.splice(currentItem-1,1)
				submit(closeDoc)
			}
		}else{
			closeDoc()
		}
	})
}
document.getElementById("FlashCard").onclick=function(){
	arrange("flashcard")
}
document.getElementById("EnteredWord").onkeydown=function(e){
	if(e.keyCode==13){
		if(this.value||e.ctrlKey||e.metaKey){
			if(isEnabled("AnswerDefinitions")){
				document.getElementById("EnteredDefinition").focus()
			}else{
				next()
			}
		}
	}
}
document.getElementById("EnteredDefinition").onkeydown=function(e){
	if(e.keyCode==13){
		if(this.value||e.ctrlKey||e.metaKey){
			next()
			if(!showAnswer&&isEnabled("AnswerWords")){
				document.getElementById("EnteredWord").focus()
			}
		}
	}
}
document.getElementById("Option1").onclick=function(){
	optionClicked(0)
}
document.getElementById("Option2").onclick=function(){
	optionClicked(1)
}
document.getElementById("Option3").onclick=function(){
	optionClicked(2)
}
document.getElementById("Option4").onclick=function(){
	optionClicked(3)
}
document.getElementById("NextButton").onclick=next
document.getElementById("Restart").onclick=function(){
	showConfirm([
		"Do you want to restart the quiz?",
		"您想重新开始测验吗？"
	],restartQuiz)
}
document.getElementById("Speak").onclick=speakQuestion
if(savedQuizSettings){
	for(var i=0;i<quizSettings.length;i++){
		var name=quizSettings[i].id.replace("Switch","")
		if(document.getElementById(name+"Switch")){
			if(savedQuizSettings[name]&&!isEnabled(name)){
				document.getElementById(name+"Switch").classList.add("mui-active")
			}else if(!savedQuizSettings[name]&&isEnabled(name)){
				document.getElementById(name+"Switch").classList.remove("mui-active")
			}
		}
	}
}
for(var i=0;i<switchDiv.length;i++){
	switchDiv[i].onclick=function(){
		if(this.classList.contains("mui-active")){
			this.classList.remove("mui-active")
		}else{
			this.classList.add("mui-active")
		}
		quizSettingsChanged=true
		if(!savedQuizSettings){
			savedQuizSettings={}
		}
		for(var i=0;i<quizSettings.length;i++){
			var name=quizSettings[i].id.replace("Switch","")
			savedQuizSettings[name]=isEnabled(name)
		}
		localStorage.setItem("QuizSettings",JSON.stringify(savedQuizSettings))
	}
}
document.getElementById("OpenFile").onchange=function(e){
	openLWL(e.target.files[0])
}
switch(language){
	case "SimplifiedChinese":
	document.title="单词表"
	document.getElementById("LookUpInput").placeholder="输入要查询的单词"
	document.getElementById("LookUpButton").innerText="查询"
	document.getElementById("NewWL").innerText="新单词表"
	document.getElementById("Open").innerText="打开单词表文件"
	document.getElementById("SharingSettings").innerText="共享设置"
	document.getElementById("ClearMistakes").innerText="清空错题"
	document.getElementById("TitleInput").placeholder="标题"
	document.getElementById("Save").innerText="保存"
	document.getElementById("Export").innerText="导出"
	document.getElementById("CloseDocument").innerText="关闭文档"
	document.getElementById("Share").innerText="共享"
	document.getElementById("Delete").innerText="删除"
	document.getElementById("FlashCard").innerText="学习卡"
	document.getElementById("Quiz").innerText="测验"
	document.getElementById("Add").innerText="添加"
	document.getElementById("WordLabel").innerText="单词"
	document.getElementById("EnteredWord").placeholder="在这里输入"
	document.getElementById("DefinitionLabel").innerText="释义"
	document.getElementById("EnteredDefinition").placeholder="在这里输入"
	document.getElementById("NextButton").innerText="下一题"
	document.getElementById("Restart").innerText="重新开始"
	document.getElementById("Speak").innerText="朗读"
	document.getElementById("MultipleChoice").innerText="选择题"
	document.getElementById("SpeakWords").innerText="朗读单词"
	document.getElementById("AnswerWords").innerText="问单词"
	document.getElementById("AnswerDefinitions").innerText="问释义"
	mistakes={
		"list":[],
		"title":"错题"
	}
	break
	default:
	document.title="Word List"
	document.getElementById("LookUpInput").placeholder="Enter the word you want to look up"
	document.getElementById("LookUpButton").innerText="Look Up"
	document.getElementById("NewWL").innerText="New Word List"
	document.getElementById("Open").innerText="Open Word List File"
	document.getElementById("SharingSettings").innerText="Sharing Settings"
	document.getElementById("ClearMistakes").innerText="Clear Mistakes"
	document.getElementById("TitleInput").placeholder="Title"
	document.getElementById("Save").innerText="Save"
	document.getElementById("Export").innerText="Export"
	document.getElementById("CloseDocument").innerText="Close Document"
	document.getElementById("Share").innerText="Share"
	document.getElementById("Delete").innerText="Delete"
	document.getElementById("FlashCard").innerText="Flash Card"
	document.getElementById("Quiz").innerText="Quiz"
	document.getElementById("Add").innerText="Add"
	document.getElementById("WordLabel").innerText="Word"
	document.getElementById("EnteredWord").placeholder="Enter here"
	document.getElementById("DefinitionLabel").innerText="Definition"
	document.getElementById("EnteredDefinition").placeholder="Enter here"
	document.getElementById("NextButton").innerText="Next"
	document.getElementById("Restart").innerText="Restart"
	document.getElementById("Speak").innerText="Speak"
	document.getElementById("MultipleChoice").innerText="Multiple Choice"
	document.getElementById("SpeakWords").innerText="Speak Words"
	document.getElementById("AnswerWords").innerText="Answer Words"
	document.getElementById("AnswerDefinitions").innerText="Answer Definitions"
	mistakes={
		"list":[],
		"title":"Mistakes"
	}
}
newTitle.innerText=document.title
for(var i=0;i<langOpt.length;i++){
	document.getElementsByTagName("select")[0].options.add(new Option(langOpt[i][0],langOpt[i][1]))
}
if(language=="English"){
	document.getElementsByTagName("select")[0].value="spa"
}else{
	document.getElementsByTagName("select")[0].value="en"
}
if(!isMobile){
	document.getElementById("LookUpInput").focus()
}
if(isiOS){
	document.getElementById("Export").style.display="none"
}
load()
if($_GET["index"]&&$_GET["username"]){
	newBack.onclick=function(){
		openWindow("index")
	}
	ajax({
		"url":backend+"userdata/getwordlist",
		"data":{
			"index":$_GET["index"],
			"username":$_GET["username"]
		},
		"dataType":"json",
		"showLoading":true,
		"success":function(e){
			applyItem(0,e)
		},
		"error":function(){
			showAlert([
				"This word list has been deleted.",
				"此单词表已被删除。"
			])
		}
	})
}else if(!login.username){
	loginDialog()
}
