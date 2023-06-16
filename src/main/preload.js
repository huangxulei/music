const { contextBridge, ipcRenderer } = require("electron")
const { isMacOS, useCustomTrafficLight } = require("./env")

contextBridge.exposeInMainWorld("electronAPI", {
    //ipcRenderer,
    ipcRenderer: {
        ...ipcRenderer,
        on: ipcRenderer.on.bind(ipcRenderer)
    },
    isMacOS,
    useCustomTrafficLight
})
