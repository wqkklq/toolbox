/*Code written by Shangzhen Yang*/
function Init(ad){
    if(navigator.userAgent.indexOf("Html5Plus")!=-1&&navigator.userAgent.indexOf("Android")!=-1){mui.init({swipeBack:true});}
    else{mui.init({swipeBack:false});}
    if(window.location.href.indexOf("rths.tk")!=-1&&ad){document.write("<script async src='\/\/pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'><\/script><ins class='adsbygoogle' style='display:block' data-ad-client='ca-pub-3063060312105983' data-ad-slot='4806317432' data-ad-format='auto'><\/ins><script>(adsbygoogle = window.adsbygoogle || []).push({});<\/script><script async src='https://www.googletagmanager.com/gtag/js?id=UA-109975281-1'><\/script><script>window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','UA-109975281-1');<\/script>");}
    if(navigator.userAgent.indexOf("Electron")!=-1){
        require("electron").webFrame.setZoomLevelLimits(1,1);
        document.getElementsByClassName("mui-action-back")[0].onclick=function(){window.close();}
    }
}
function OpenWindow(name){
    var Suffix=".html";
    if(name.indexOf(Suffix)!=-1){Suffix="";}
    if(navigator.userAgent.indexOf("Html5Plus")!=-1){
        plus.webview.create(name+".html",name,{"popGesture":"hide"});
        plus.webview.show(name,"pop-in");
    }else if(navigator.userAgent.indexOf("Electron")!=-1){
        const BrowserWindow=require("electron").remote.BrowserWindow;
        const path=require("path");
        let win=new BrowserWindow({width:1000,height:700,titleBarStyle:"hiddenInset",autoHideMenuBar:true,show:false});
        win.on("close",function(){win=null});
        win.loadURL(path.join("file://",__dirname,name+Suffix));
        win.once("ready-to-show",() => {win.show()});
    }else{window.location.href=name+Suffix;}
    if(window.localStorage){localStorage.setItem("Recent",name);}
}
function OpenWebPage(href){
    if(navigator.userAgent.indexOf("Html5Plus")!=-1){plus.runtime.openURL(href);}
    else if(navigator.userAgent.indexOf("Electron")!=-1){require("electron").shell.openExternal(href);}
    else{window.open(href);}
}
function AddZero(num,length){return (Array(length).join("0")+num).slice(-length);}
var appid="20171109000093780",key="ZR6EGbP8ZzwU7GookTvy";