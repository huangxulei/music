const { app, BrowserWindow, ipcMain } = require("electron")
const { isMacOS, useCustomTrafficLight, isDevEnv, USER_AGENT, AUDIO_EXTS, IMAGE_EXTS, APP_ICON } = require("./env")
const path = require("path")
const { scanDir, parseTracks, readText, FILE_PREFIX, randomTextWithinAlphabetNums } = require("./common")

let mainWin = null

const startup = () => {
    init()
    registryGlobalListeners()
}

const init = () => {
    app.whenReady().then(() => {
        app.userAgentFallback = USER_AGENT
        app.mainWin = createWindow()
    })
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            app.mainWin = createWindow()
        }
    })
}

const createWindow = () => {
    mainWin = new BrowserWindow({
        width: 1080,
        height: 720,
        minWidth: 1080,
        minHeight: 720,
        titleBarStyle: "hidden",
        trafficLightPosition: { x: 15, y: 15 },
        transparent: true,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true,
            webSecurity: false
        }
    })
    if (isDevEnv) {
        mainWin.loadURL("http://localhost:1000")
        mainWin.webContents.openDevTools()
    } else {
        // Load the index.html of the app.
        mainWin.loadFile("dist/index.html")
    }

    mainWin.once("ready-to-show", () => {
        setWindowButtonVisibility(!useCustomTrafficLight)
        mainWin.show()
    })

    //配置请求过滤
    const filter = {
        urls: ["*://*.qq.com/*", "*://music.163.com/*", "*://*.kuwo.cn/*", "*://*.kugou.com/*", "*://*.douban.com/*", "*://*.doubanio.com/*", "*://*.ridio.cn/*", "*://*.cnr.cn/*"]
    }

    const webSession = mainWindow.webContents.session
    webSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
        overrideRequest(details)
        callback({ requestHeaders: details.requestHeaders })
    })
    return mainWin
}

//全局事件监听
const registryGlobalListeners = () => {
    //主进程事件监听
    ipcMain.on("app-quit", () => {
        if (isDevEnv || isMacOS) {
            mainWin.close()
            return
        }
        app.quit()
    }).on("app-min", () => {
        if (mainWin.isFullScreen()) mainWin.setFullScreen(false)
        if (mainWin.isMaximized() || mainWin.isNormal()) mainWin.minimize()
    }).on("app-max", () => {
        const win = app.mainWin
        if (win.isMaximized()) {
            win.unmaximize()
            //win.setFullScreen(false)
        } else {
            win.maximize()
            //win.setFullScreen(true)
        }
    })
}

//覆盖(包装)请求
const overrideRequest = (details) => {
    let origin = null
    let referer = null
    let cookie = null
    let userAgent = null

    const url = details.url
    if (url.includes("qq.com")) {
        origin = "https://y.qq.com/"
        referer = origin
        /*
      cookie = 	"fqm_pvqid=336b8c0b-9988-4607-a98e-9242dcd55f0e"
        + "&fqm_sessionid=0fd12ef8-5cd6-409c-8ef0-b5b601e99737"
        + "&pac_uid=0_32f39be6c9607"
        + "&pgv_info=ssid=s7351377509"
        + "&pgv_pvid=357794096"
        + "&ts_last=y.qq.com/n/ryqq/player"
        + "&ts_uid=2524044556"
      */
    } else if (url.includes("music.163.com")) {
        origin = "https://music.163.com/"
        referer = origin
    } else if (url.includes("kuwo")) {
        const CSRF = randomTextWithinAlphabetNums(11).toUpperCase()
        origin = "https://www.kuwo.cn/"
        referer = origin
        cookie = "kw_token=" + CSRF
        details.requestHeaders["CSRF"] = CSRF
    } else if (url.includes("kugou")) {
        origin = "https://www.kugou.com/"
        referer = origin
        if (url.includes("mac.kugou.com/")) userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_16) AppleWebKit/605.1.15 (KHTML, like Gecko)"
    } else if (url.includes("douban")) {
        const bid = randomTextWithinAlphabetNums(11)
        origin = "https://fm.douban.com/"
        referer = origin
        cookie = "bid=" + bid
        //cookie = 'bid=' + bid + '; __utma=30149280.1685369897.1647928743.1648005141.1648614477.3; __utmz=30149280.1648005141.2.2.utmcsr=cn.bing.com|utmccn=(referral)|utmcmd=referral|utmcct=/; _pk_ref.100001.f71f=%5B%22%22%2C%22%22%2C1650723346%2C%22https%3A%2F%2Fmusic.douban.com%2Ftag%2F%22%5D; _pk_id.100001.f71f=5c371c0960a75aeb.1647928769.4.1650723346.1648618102.; ll="118306"; _ga=GA1.2.1685369897.1647928743; douban-fav-remind=1; viewed="2995812"; ap_v=0,6.0'
    } else if (url.includes("radio.cn") || url.includes("cnr.cn")) {
        origin = "http://www.radio.cn/"
        referer = origin
    }

    /*
    details.requestHeaders['Access-Control-Allow-Headers'] = "Origin, X-Requested-With, Content-Type, Accept"
    details.requestHeaders['Access-Control-Allow-Origin'] = "*"
    */

    //if(origin) details.requestHeaders['Origin'] = origin
    if (userAgent) details.requestHeaders["UserAgent"] = userAgent
    if (referer) details.requestHeaders["Referer"] = referer
    if (cookie) details.requestHeaders["Cookie"] = cookie
}

//设置系统交通灯按钮可见性
const setWindowButtonVisibility = (visible) => {
    if (!isMacOS) return
    try {
        app.mainWin.setWindowButtonVisibility(visible)
    } catch (error) {
        console.log(error)
    }
}

//启动应用
startup()
