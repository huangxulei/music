const { app, BrowserWindow, ipcMain } = require("electron")
const path = require("path")
//关闭警告提示
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true"
const isDevEnv = true

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 999,
        height: 666,
        minwidth: 999,
        minHeight: 666,
        titleBarStyle: "hidden",
        transparent: true,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true,
            webSecurity: false
        }
    })
    if (isDevEnv) {
        mainWindow.loadURL("http://localhost:1000")
        mainWindow.webContents.openDevTools()
    }
    return mainWindow
}

app.whenReady().then(() => {
    app.mainWin = createWindow()
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            app.mainWin = createWindow()
        }
    })
})
