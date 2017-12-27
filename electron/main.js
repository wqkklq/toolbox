/*Code written by Shangzhen Yang*/
const{app,BrowserWindow,ipcMain,powerSaveBlocker}=require("electron")
const path=require("path")
const url=require("url")
const id=powerSaveBlocker.start("prevent-app-suspension")
let win
function createWindow(){
    win=new BrowserWindow({width:1000,height:700,titleBarStyle:"hiddenInset",autoHideMenuBar:true,show:false})
    win.loadURL(url.format({
        pathname:path.join(__dirname,"../index.html"),
        protocol:"file:",
        slashes:true
    }))
    win.on("closed",()=>{win=null})
    win.once("ready-to-show",()=>{win.show()})
}
app.on("ready",createWindow)
app.on("window-all-closed",()=>{
    powerSaveBlocker.stop(id)
    if(process.platform!=="darwin"){app.quit()}
})
app.on("activate",()=>{if(win===null){createWindow()}})
global.sharedObj={path:null}
app.on("open-file",(e,path)=>{global.sharedObj.path=path})
ipcMain.on("restart-index",()=>{
    win.destroy()
    createWindow()
})
