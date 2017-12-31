/*Code written by Shangzhen Yang*/
const{app,BrowserWindow,ipcMain,Menu,powerSaveBlocker}=require("electron")
const path=require("path")
const url=require("url")
const id=powerSaveBlocker.start("prevent-app-suspension")
let options,win
if(process.platform!=="darwin"){
    options={
        frame:false,
        height:700,
        icon:__dirname+"/icon.png",
        width:1000
    }
}else{
    options={
        height:700,
        titleBarStyle:"hiddenInset",
        width:1000,
        show:false
    }
}
let template=[{
    label:"RTH Toolbox",
    submenu:[{
      label:"About RTH Toolbox",
      role:"about"
    },{
      type:"separator"
    },{
      label:"Services",
      role:"services",
      submenu:[]
    },{
      type:"separator"
    },{
      label:"Hide RTH Toolbox",
      accelerator:"Command+H",
      role:"hide"
    },{
      label:"Hide Others",
      accelerator:"Command+Alt+H",
      role:"hideothers"
    },{
      label:"Show All",
      role:"unhide"
    },{
      type:"separator"
    },{
      label:"Quit",
      accelerator:"Command+Q",
      click:function(){app.quit()}
    }]
},{
    label:"Edit",
    submenu:[{
        abel:"Undo",
        accelerator:"CmdOrCtrl+Z",
        role:"undo"
    },{
        label:"Redo",
        accelerator:"Shift+CmdOrCtrl+Z",
        role:"redo"
    },{
        type:"separator"
    },{
        label:"Cut",
        accelerator:"CmdOrCtrl+X",
        role:"cut"
    },{
        label:"Copy",
        accelerator:"CmdOrCtrl+C",
        role:"copy"
    },{
        label:"Paste",
        accelerator:"CmdOrCtrl+V",
        role:"paste"
    },{
        label:"Select All",
        accelerator:"CmdOrCtrl+A",
        role:"selectall"
    }]
}]
function createWindow(){
    win=new BrowserWindow(options)
    win.loadURL(url.format({
        pathname:path.join(__dirname,"../index.html"),
        protocol:"file:",
        slashes:true
    }))
    win.once("ready-to-show",()=>{win.show()})
}
app.on("ready",()=>{
    createWindow()
    const menu=Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
})
app.on("window-all-closed",()=>{
    powerSaveBlocker.stop(id)
    app.quit()
})
global.sharedObj={path:null}
app.on("open-file",(e,path)=>{global.sharedObj.path=path})
if(process.platform=="win32"){global.sharedObj.path=process.argv}
ipcMain.on("restart-index",()=>{
    win.destroy()
    createWindow()
})
