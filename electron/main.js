/*Code written by Shangzhen Yang*/
const electron=require("electron");
const {app,BrowserWindow}=electron;
const path=require("path");
const url=require("url");
const ipc=electron.ipcMain;
let win;
var blocker=electron.powerSaveBlocker.start("prevent-app-suspension");
function createWindow(){
    win=new BrowserWindow({width:1000,height:700,titleBarStyle:"hiddenInset",autoHideMenuBar:true,show:false});
    win.loadURL(url.format({
        pathname:path.join(__dirname,"../index.html"),
        protocol:"file:",
        slashes:true
    }));
    win.on("closed",() => {win=null;});
    win.once("ready-to-show",() => {win.show();});
}
app.on("ready",createWindow);
app.on("window-all-closed",() => {
    electron.powerSaveBlocker.stop(blocker);
    if(process.platform!=="darwin"){app.quit();}
});
app.on("activate",() => {if (win === null){createWindow();}});
global.sharedObj={path:null};
app.on("open-file",(e,path) => {global.sharedObj.path=path;});
ipc.on("restart-index",() => {
    win.destroy();
    createWindow();
});