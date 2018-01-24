/*Code written by Shangzhen Yang*/
try{
	if(navigator.language.indexOf("zh")!=-1){
		document.title="RTH 工具箱更新器"
		document.getElementsByClassName("drag")[0].innerText="RTH 工具箱更新器"
	}
	require("electron").webFrame.setZoomLevelLimits(1,1)
	if(process.platform=="darwin"){document.getElementsByClassName("drag")[0].style.textAlign="center"}
	else{document.getElementsByClassName("win")[0].style.display=""}
	let files,progress=0
	window.onload=function(){
		const xhr=new XMLHttpRequest()
		xhr.onreadystatechange=function(){
			switch(xhr.readyState){
				case 4:
					if(xhr.status==200){
						const json=JSON.parse(xhr.responseText)
						files=json.files
						document.getElementsByClassName("content")[0].innerText+=" Done"
						next()
					}else{document.getElementsByClassName("content")[0].innerText+=" Error ("+xhr.status+")\nFailed to update."}
					break
				default:break
			}
		}
		xhr.open("GET","http://t.rths.tk/web/toolbox/files.json?time="+(new Date).getTime())
		xhr.send()
	}
	function next(){
		if(progress<files.length){update(files[progress])}
		else{
			document.getElementsByClassName("content")[0].innerText+="\nUpdated successfully."
			window.location.href="../index.html"
		}
	}
	function update(file){
		document.getElementsByClassName("content")[0].innerText+="\nDownloading "+file+" . . ."
		const xhr=new XMLHttpRequest()
		xhr.onreadystatechange=function(){
			switch(xhr.readyState){
				case 4:
					if(xhr.status==200){
						require("fs").writeFileSync(require("path").join(__dirname,"../"+file.replace("web/toolbox/","")),xhr.responseText)
						document.getElementsByClassName("content")[0].innerText+=" Done"
						progress+=1
						next()
					}else{document.getElementsByClassName("content")[0].innerText+=" Error ("+xhr.status+")\nFailed to update."}
					break
				default:break
			}
		}
		xhr.open("GET","http://t.rths.tk/"+file+"?time="+(new Date).getTime())
		xhr.send()
	}
}catch(e){document.getElementsByClassName("content")[0].innerText+=" Error\n"+e.message+"\nFailed to update."}
function maximize(){
	const win=require("electron").remote.getCurrentWindow()
	if(win.isMaximized()){win.unmaximize()}
	else{win.maximize()}
}
