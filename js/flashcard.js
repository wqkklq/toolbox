/*Code written by Shangzhen Yang*/
var Language=localStorage.getItem("Language"),
AudioURL,
Progress=1,
WordListText=localStorage.getItem("WordList"),
WLTSplit;
if(WordListText!=""&&WordListText!=null){WLTSplit=WordListText.split("\n");}
if(Language=="SimplifiedChinese"){
    document.getElementById("ShowDefinition").innerText="显示释义";
    document.getElementById("Previous").innerText="上一个";
    document.getElementById("Next").innerText="下一个";
}else{
    document.getElementById("ShowDefinition").innerText="Show Definition";
    document.getElementById("Previous").innerText="Previous";
    document.getElementById("Next").innerText="Next";
}
var reg=new RegExp("(^|&)word=([^&]*)(&|$)");
var r=window.location.search.substr(1).match(reg);
if(r!=null){
    var Word=unescape(r[2].replace(/_/g,"%"));
    if(Language=="SimplifiedChinese"){
        document.title="词典";
        document.getElementsByClassName("mui-title")[0].innerText="正在加载";
    }else{
        document.title="Dictionary";
        document.getElementsByClassName("mui-title")[0].innerText="Loading";
    }
    document.getElementById("CNDefinition").style.display="";
    document.getElementById("ENDefinition").style.display="";
    document.getElementById("ShowDefinition").style.display="none";
    document.getElementsByTagName("footer")[0].style.display="none";
    document.getElementById("Word").innerText=Word;
    var WordWithoutSpace=Word.replace(/^\s+|\s+$/g,"").toLowerCase();
    if(localStorage.getItem(WordWithoutSpace+"_CNDef")!=null){
        LoadTitle();
        var Pronunciation=localStorage.getItem(WordWithoutSpace+"_Pronunciation");
        if(Pronunciation!=null&&Pronunciation!=""){document.getElementById("Pronunciation").innerText="["+Pronunciation+"]";}
        AudioURL=localStorage.getItem(WordWithoutSpace+"_Audio");
        document.getElementById("CNDefinition").innerText=localStorage.getItem(WordWithoutSpace+"_CNDef");
        var ENDef=localStorage.getItem(WordWithoutSpace+"_ENDef");
        if(ENDef!=null&&ENDef!=""&&ENDef!="undefined"){document.getElementById("ENDefinition").innerText=ENDef;}
    }else if(navigator.userAgent.indexOf("Html5Plus")==-1&&navigator.userAgent.indexOf("Electron")==-1){Translate();}
    else{
        var xhr=new XMLHttpRequest();
        xhr.onreadystatechange=function(){
            switch(xhr.readyState){
                case 4:
                    if(xhr.status==200){
                        var Json=JSON.parse(xhr.responseText);
                        if(Json.msg=="SUCCESS"){
                            LoadTitle();
                            if(Json.data.pronunciation!=null&&Json.data.pronunciation!=""){document.getElementById("Pronunciation").innerText="["+Json.data.pronunciation+"]";}
                            AudioURL=Json.data.audio;
                            document.getElementById("CNDefinition").innerText=Json.data.cn_definition.defn;
                            if(Json.data.en_definition.defn!=null&&Json.data.en_definition.defn!=""){document.getElementById("ENDefinition").innerText=Json.data.en_definition.defn;}
                            if(WordWithoutSpace.indexOf(" ")==-1&&window.localStorage){
                                localStorage.setItem(WordWithoutSpace+"_Pronunciation",Json.data.pronunciation);
                                localStorage.setItem(WordWithoutSpace+"_Audio",Json.data.audio);
                                localStorage.setItem(WordWithoutSpace+"_CNDef",Json.data.cn_definition.defn);
                                localStorage.setItem(WordWithoutSpace+"_ENDef",Json.data.en_definition.defn);
                            }
                        }else{Translate();}
                    }else{Translate();}
                    break;
                default:break;
            }
        }
        xhr.open("GET","https://api.shanbay.com/bdc/search/?word="+Word);
        xhr.send();
    }
}else{
    if(Language=="SimplifiedChinese"){document.title="学习卡";}
    else{document.title="Flash Card";}
    document.getElementsByClassName("mui-title")[0].innerText=document.title;
    LoadWord();
}
Init(false);
function LoadTitle(){
    if(Language=="SimplifiedChinese"){document.getElementsByTagName("footer")[0].innerText="下载 RTH 工具箱，即可查看详细内容";}
    else{document.getElementsByTagName("footer")[0].innerText="Download RTH Toolbox to view the details";}
    document.getElementsByClassName("mui-title")[0].innerText=document.title;
    if(navigator.userAgent.indexOf("Html5Plus")==-1&&navigator.userAgent.indexOf("Electron")==-1){
        document.getElementsByTagName("footer")[0].style.display="";
        document.getElementsByTagName("footer")[0].onclick=function(){window.open("http://rths.tk/");}
    }
}
function Translate(){
    var salt=(new Date).getTime(),to,pattern=new RegExp("[A-Za-z]+");
    if(pattern.test(Word)){to="zh";}
    else{to="en";}
    var str1=appid+Word+salt+key;
    var sign=MD5(str1);
    $.ajax({
        url:"http://api.fanyi.baidu.com/api/trans/vip/translate",
        type:"get",
        dataType:"jsonp",
        data:{
            q:Word,
            appid:appid,
            salt:salt,
            from:"auto",
            to:to,
            sign:sign
        },
        success:function(data){
            LoadTitle();
            document.getElementById("CNDefinition").innerText=data.trans_result[0].dst;
        }
    });
}
function LoadWord(){
    if(WLTSplit[Progress*2-1]==null||WLTSplit[Progress*2]==null){return false;}
    document.getElementById("Word").innerText=WLTSplit[Progress*2-1];
    document.getElementById("CNDefinition").style.display="none";
    document.getElementById("ENDefinition").style.display="none";
    document.getElementById("ENDefinition").innerText=WLTSplit[Progress*2];
    var WordWithoutSpace=WLTSplit[Progress*2-1].replace(/^\s+|\s+$/g,"").toLowerCase();
    if(localStorage.getItem(WordWithoutSpace+"_CNDef")!=null){
        var Pronunciation=localStorage.getItem(WordWithoutSpace+"_Pronunciation");
        if(Pronunciation!=null&&Pronunciation!=""){document.getElementById("Pronunciation").innerText="["+Pronunciation+"]";}
        AudioURL=localStorage.getItem(WordWithoutSpace+"_Audio");
        document.getElementById("CNDefinition").innerText=localStorage.getItem(WordWithoutSpace+"_CNDef");
        var ENDef=localStorage.getItem(WordWithoutSpace+"_ENDef");
        if(ENDef!=null&&ENDef!=""){document.getElementById("ENDefinition").innerText=ENDef;}
    }else if(navigator.userAgent.indexOf("Html5Plus")!=-1||navigator.userAgent.indexOf("Electron")!=-1){
        document.getElementById("Previous").style.display="none";
        document.getElementById("Next").style.display="none";
        var xhr=new XMLHttpRequest();
        xhr.onreadystatechange=function(){
            switch(xhr.readyState){
                case 4:
                    if(xhr.status==200){
                        var Json=JSON.parse(xhr.responseText);
                        if(Json.msg=="SUCCESS"){
                            document.getElementById("ENDefinition").innerText=Json.data.en_definition.defn;
                            document.getElementById("CNDefinition").innerText=Json.data.cn_definition.defn;
                            document.getElementById("Pronunciation").innerText="["+Json.data.pronunciation+"]";
                            AudioURL=Json.data.audio;
                            if(WordWithoutSpace.indexOf(" ")==-1&&window.localStorage){
                                localStorage.setItem(WordWithoutSpace+"_Pronunciation",Json.data.pronunciation);
                                localStorage.setItem(WordWithoutSpace+"_Audio",Json.data.audio);
                                localStorage.setItem(WordWithoutSpace+"_CNDef",Json.data.cn_definition.defn);
                                localStorage.setItem(WordWithoutSpace+"_ENDef",Json.data.en_definition.defn);
                            }
                        }
                    }
                    document.getElementById("Previous").style.display="";
                    document.getElementById("Next").style.display="";
                    break;
                default:break;
            }
        }
        xhr.open("GET","https://api.shanbay.com/bdc/search/?word="+WLTSplit[Progress*2-1]);
        xhr.send();
    }
}
document.getElementById("Word").onclick=function(){
    if(navigator.userAgent.indexOf("Html5Plus")!=-1){
        var SearchURL=encodeURI("http://fanyi.baidu.com/#en/zh/"+document.getElementById("Word").innerText);
        plus.runtime.openURL(SearchURL);
    }else if(navigator.userAgent.indexOf("Electron")!=-1){require("electron").shell.openExternal("http://fanyi.baidu.com/#en/zh/"+document.getElementById("Word").innerText);}
    else{window.open("http://fanyi.baidu.com/#en/zh/"+document.getElementById("Word").innerText);}
}
document.getElementById("ENDefinition").onclick=function(){
    var query=document.getElementById("ENDefinition").innerText,pattern=new RegExp("[A-Za-z]+");
    if(pattern.test(query)){
        var salt=(new Date).getTime();
        var str1=appid+query+salt+key;
        var sign=MD5(str1);
        $.ajax({
            url:"http://api.fanyi.baidu.com/api/trans/vip/translate",
            type:"get",
            dataType:"jsonp",
            data:{
                q:query,
                appid:appid,
                salt:salt,
                from:"en",
                to:"zh",
                sign:sign
            },
            success:function(data){document.getElementById("ENDefinition").innerText=data.trans_result[0].dst;}
        });
    }else{
        var WordWithoutSpace=document.getElementById("Word").innerText.replace(/^\s+|\s+$/g,"").toLowerCase();
        document.getElementById("ENDefinition").innerText=localStorage.getItem(WordWithoutSpace+"_ENDef");
    }
}
document.getElementById("ShowDefinition").onclick=function(){
    if(document.getElementById("ENDefinition").style.display==""){
        document.getElementById("CNDefinition").style.display="none";
        document.getElementById("ENDefinition").style.display="none";
    }else{
        document.getElementById("CNDefinition").style.display="";
        document.getElementById("ENDefinition").style.display="";
    }
}
function Previous(){
    if(Progress<=1){
        if(Language=="SimplifiedChinese"){mui.alert("这是第一个单词","学习卡");}
        else{mui.alert("This is the first word","Flash Card","OK");}
    }else{
        AudioURL="";
        document.getElementById("CNDefinition").innerText="";
        document.getElementById("Pronunciation").innerText="";
        Progress-=1;
        LoadWord();
    }
}
function Next(){
    if(Progress>=(WLTSplit.length-2)/2){
        if(Language=="SimplifiedChinese"){mui.alert("这是最后一个单词","学习卡");}
        else{mui.alert("This is the last word","Flash Card","OK");}
    }else{
        AudioURL="";
        document.getElementById("CNDefinition").innerText="";
        document.getElementById("Pronunciation").innerText="";
        Progress+=1;
        LoadWord();
    }
}
