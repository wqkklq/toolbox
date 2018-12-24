/*Code written by Shangzhen Yang*/
var engines={
	"Baidu":"https://www.baidu.com/s?wd=",
	"Bing":"https://bing.com/search?q=",
	"DuckDuckGo":"https://www.duckduckgo.com/?q=",
	"Google":"https://www.google.com/search?q=",
	"Sogou":"https://www.sogou.com/web?query=",
	"Yahoo":"https://search.yahoo.com/search?p=",
	"Q360SearchEngine":"https://www.so.com/s?q=",
	"BaiduEncyclopedia":"https://baike.baidu.com/search?word=",
	"HudongEncyclopedia":"http://www.baike.com/wiki/",
	"Wikipedia":"https://en.wikipedia.org/wiki/",
	"DictionaryCom":"https://www.dictionary.com/browse/",
	"CambridgeDictionary":"https://dictionary.cambridge.org/us/dictionary/english/",
	"KingsoftPowerword":"http://www.iciba.com/",
	"OxfordDictionaries":"https://en.oxforddictionaries.com/definition/",
	"Wiktionary":"https://en.wiktionary.org/wiki/",
	"YoudaoDictionary":"http://www.youdao.com/w/",
	"BaiduTranslate":"https://fanyi.baidu.com/#en/zh/",
	"GoogleTranslate":"https://translate.google.cn/#en/zh-CN/",
	"AcFun":"http://www.acfun.cn/search/?#query=",
	"IQIYI":"http://so.iqiyi.com/so/q_",
	"Bilibili":"https://search.bilibili.com/all?keyword=",
	"SohuTV":"https://so.tv.sohu.com/mts?wd=",
	"TencentVideo":"https://v.qq.com/x/search/?q=",
	"Youku":"http://www.soku.com/search_video/q_",
	"YouTube":"https://www.youtube.com/results?search_query=",
	"YinYueTai":"http://so.yinyuetai.com/?keyword=",
	"Q360Image":"https://image.so.com/i?q=",
	"QQMusic":"https://y.qq.com/portal/search.html#w=",
	"NetEaseCloudMusic":"https://music.163.com/#/search/m/?s="
}
function categoryChanged(){
	document.getElementsByTagName("select")[1].options.length=0
	switch(document.getElementsByTagName("select")[0].value){
		case "Web":
		switch(language){
			case "SimplifiedChinese":
			document.getElementsByTagName("select")[1].options.add(new Option("自动","Automatic"))
			document.getElementsByTagName("select")[1].options.add(new Option("百度","Baidu"))
			document.getElementsByTagName("select")[1].options.add(new Option("必应","Bing"))
			document.getElementsByTagName("select")[1].options.add(new Option("DuckDuckGo","DuckDuckGo"))
			document.getElementsByTagName("select")[1].options.add(new Option("谷歌","Google"))
			document.getElementsByTagName("select")[1].options.add(new Option("搜狗","Sogou"))
			document.getElementsByTagName("select")[1].options.add(new Option("雅虎","Yahoo"))
			document.getElementsByTagName("select")[1].options.add(new Option("360搜索","Q360SearchEngine"))
			break
			default:
			document.getElementsByTagName("select")[1].options.add(new Option("Automatic","Automatic"))
			document.getElementsByTagName("select")[1].options.add(new Option("Baidu","Baidu"))
			document.getElementsByTagName("select")[1].options.add(new Option("Bing","Bing"))
			document.getElementsByTagName("select")[1].options.add(new Option("DuckDuckGo","DuckDuckGo"))
			document.getElementsByTagName("select")[1].options.add(new Option("Google","Google"))
			document.getElementsByTagName("select")[1].options.add(new Option("Sogou","Sogou"))
			document.getElementsByTagName("select")[1].options.add(new Option("Yahoo","Yahoo"))
			document.getElementsByTagName("select")[1].options.add(new Option("360 Search Engine","Q360SearchEngine"))
		}
		break
		case "Encyclopedia":
		switch(language){
			case "SimplifiedChinese":
			document.getElementsByTagName("select")[1].options.add(new Option("百度百科","BaiduEncyclopedia"))
			document.getElementsByTagName("select")[1].options.add(new Option("互动百科","HudongEncyclopedia"))
			document.getElementsByTagName("select")[1].options.add(new Option("维基百科","Wikipedia"))
			break
			default:
			document.getElementsByTagName("select")[1].options.add(new Option("Baidu Encyclopedia","BaiduEncyclopedia"))
			document.getElementsByTagName("select")[1].options.add(new Option("Hudong Encyclopedia","HudongEncyclopedia"))
			document.getElementsByTagName("select")[1].options.add(new Option("Wikipedia","Wikipedia"))
		}
		break
		case "Dictionary":
		switch(language){
			case "SimplifiedChinese":
			document.getElementsByTagName("select")[1].options.add(new Option("Dictionary.com","DictionaryCom"))
			document.getElementsByTagName("select")[1].options.add(new Option("剑桥词典","CambridgeDictionary"))
			document.getElementsByTagName("select")[1].options.add(new Option("金山词霸","KingsoftPowerword"))
			document.getElementsByTagName("select")[1].options.add(new Option("牛津词典","OxfordDictionaries"))
			document.getElementsByTagName("select")[1].options.add(new Option("维基词典","Wiktionary"))
			document.getElementsByTagName("select")[1].options.add(new Option("有道词典","YoudaoDictionary"))
			break
			default:
			document.getElementsByTagName("select")[1].options.add(new Option("Dictionary.com","DictionaryCom"))
			document.getElementsByTagName("select")[1].options.add(new Option("Cambridge Dictionary","CambridgeDictionary"))
			document.getElementsByTagName("select")[1].options.add(new Option("Kingsoft Powerword","KingsoftPowerword"))
			document.getElementsByTagName("select")[1].options.add(new Option("Oxford Dictionaries","OxfordDictionaries"))
			document.getElementsByTagName("select")[1].options.add(new Option("Wiktionary","Wiktionary"))
			document.getElementsByTagName("select")[1].options.add(new Option("Youdao Dictionary","YoudaoDictionary"))
		}
		break
		case "Translate":
		switch(language){
			case "SimplifiedChinese":
			document.getElementsByTagName("select")[1].options.add(new Option("百度翻译","BaiduTranslate"))
			document.getElementsByTagName("select")[1].options.add(new Option("谷歌翻译","GoogleTranslate"))
			break
			default:
			document.getElementsByTagName("select")[1].options.add(new Option("Baidu Translate","BaiduTranslate"))
			document.getElementsByTagName("select")[1].options.add(new Option("Google Translate","GoogleTranslate"))
		}
		break
		case "Video":
		switch(language){
			case "SimplifiedChinese":
			document.getElementsByTagName("select")[1].options.add(new Option("AcFun","AcFun"))
			document.getElementsByTagName("select")[1].options.add(new Option("爱奇艺","IQIYI"))
			document.getElementsByTagName("select")[1].options.add(new Option("哔哩哔哩","Bilibili"))
			document.getElementsByTagName("select")[1].options.add(new Option("搜狐视频","SohuTV"))
			document.getElementsByTagName("select")[1].options.add(new Option("腾讯视频","TencentVideo"))
			document.getElementsByTagName("select")[1].options.add(new Option("优酷","Youku"))
			document.getElementsByTagName("select")[1].options.add(new Option("YouTube","YouTube"))
			document.getElementsByTagName("select")[1].options.add(new Option("音悦台","YinYueTai"))
			break
			default:
			document.getElementsByTagName("select")[1].options.add(new Option("AcFun","AcFun"))
			document.getElementsByTagName("select")[1].options.add(new Option("IQIYI","IQIYI"))
			document.getElementsByTagName("select")[1].options.add(new Option("Bilibili","Bilibili"))
			document.getElementsByTagName("select")[1].options.add(new Option("Sohu TV","SohuTV"))
			document.getElementsByTagName("select")[1].options.add(new Option("Tencent Video","TencentVideo"))
			document.getElementsByTagName("select")[1].options.add(new Option("Youku","Youku"))
			document.getElementsByTagName("select")[1].options.add(new Option("YouTube","YouTube"))
			document.getElementsByTagName("select")[1].options.add(new Option("YinYueTai","YinYueTai"))
		}
		break
		case "Picture":
		switch(language){
			case "SimplifiedChinese":
			document.getElementsByTagName("select")[1].options.add(new Option("360 图片","Q360Image"))
			break
			default:
			document.getElementsByTagName("select")[1].options.add(new Option("360 Image","Q360Image"))
		}
		break
		case "Music":
		switch(language){
			case "SimplifiedChinese":
			document.getElementsByTagName("select")[1].options.add(new Option("QQ音乐","QQMusic"))
			document.getElementsByTagName("select")[1].options.add(new Option("网易云音乐","NetEaseCloudMusic"))
			break
			default:
			document.getElementsByTagName("select")[1].options.add(new Option("QQ Music","QQMusic"))
			document.getElementsByTagName("select")[1].options.add(new Option("NetEase Cloud Music","NetEaseCloudMusic"))
		}
	}
}
function search(){
	var engine,searchTerm=document.getElementsByTagName("input")[0].value
	if(document.getElementsByTagName("select")[1].value=="Automatic"){
		if(isEnglish.test(searchTerm)){
			switch(language){
				case "SimplifiedChinese":
				engine=engines.Bing
				break
				default:
				engine=engines.Google
				break
			}
		}else{
			engine=engines.Baidu
		}
	}else{
		engine=engines[document.getElementsByTagName("select")[1].value]
	}
	if(!searchTerm){
		showAlert([
			"Please enter the text you want to search for",
			"请输入要搜索的文本"
		])
	}else{
		openWebPage(engine+encodeURIComponent(searchTerm))
	}
}
document.getElementsByTagName("select")[0].onchange=categoryChanged
document.getElementsByTagName("input")[0].onkeydown=function(e){
	if(e.keyCode==13&&this.value){
		search()
	}
}
document.getElementsByTagName("button")[0].onclick=search
switch(language){
	case "SimplifiedChinese":
	document.title="搜索"
	document.getElementsByTagName("select")[0].options.add(new Option("网页","Web"))
	document.getElementsByTagName("select")[0].options.add(new Option("百科","Encyclopedia"))
	document.getElementsByTagName("select")[0].options.add(new Option("词典","Dictionary"))
	document.getElementsByTagName("select")[0].options.add(new Option("翻译","Translate"))
	document.getElementsByTagName("select")[0].options.add(new Option("视频","Video"))
	document.getElementsByTagName("select")[0].options.add(new Option("图片","Picture"))
	document.getElementsByTagName("select")[0].options.add(new Option("音乐","Music"))
	document.getElementsByTagName("input")[0].placeholder="输入搜索词"
	document.getElementsByTagName("button")[0].innerText="搜索"
	break
	default:
	document.title="Search"
	document.getElementsByTagName("select")[0].options.add(new Option("Web","Web"))
	document.getElementsByTagName("select")[0].options.add(new Option("Encyclopedia","Encyclopedia"))
	document.getElementsByTagName("select")[0].options.add(new Option("Dictionary","Dictionary"))
	document.getElementsByTagName("select")[0].options.add(new Option("Translate","Translate"))
	document.getElementsByTagName("select")[0].options.add(new Option("Video","Video"))
	document.getElementsByTagName("select")[0].options.add(new Option("Picture","Picture"))
	document.getElementsByTagName("select")[0].options.add(new Option("Music","Music"))
	document.getElementsByTagName("input")[0].placeholder="Enter a search term"
	document.getElementsByTagName("button")[0].innerText="Search"
}
newTitle.innerText=document.title
document.getElementsByTagName("select")[0].value="Web"
categoryChanged()
document.getElementsByTagName("select")[1].value="Automatic"
if(!isMobile){
	document.getElementsByTagName("input")[0].focus()
}
