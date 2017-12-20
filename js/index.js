const {app, BrowserWindow}=require('electron')
const path=require('path')
const url=require('url')
let win
var blocker=require('electron').powerSaveBlocker.start('prevent-app-suspension')
function createWindow(){
    win=new BrowserWindow({width: 400, height: 700, titleBarStyle: "hiddenInset", backgroundColor: "#efeff4", autoHideMenuBar: true})
    win.loadURL(url.format({
        pathname: path.join(__dirname, '../index.html'),
        protocol: 'file:',
        slashes: true
    }))
    win.on('closed', () => {win=null})
}
app.on('ready', createWindow)
app.on('window-all-closed', () => {
    require('electron').powerSaveBlocker.stop(blocker)
    if (process.platform!=='darwin'){app.quit()}
})
app.on('activate', () => {if (win === null){createWindow()}})