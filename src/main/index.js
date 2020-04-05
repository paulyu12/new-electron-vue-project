import { app, BrowserWindow, globalShortcut, ipcMain } from 'electron'

// eslint-disable-next-line no-unused-expressions
'use strict'
const path = require('path')
const log = require('electron-log')

log.transports.file.file = './main.log'
log.transports.console.level = 'warn' // error, warn, info, verbose, debug, silly
log.transports.file.level = 'info'
log.transports.remote.level = 'info'
let remote = log.transports.remote
remote.url = 'http://192.168.247.131:8080/electron'
log.transports.remote = remote

// if (require('electron-squirrel-startup')) app.quit()
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 800,
    useContentSize: true,
    width: 1200,
    // frame: false,
    resizable: false,
    skipTaskbar: false,
    transparent: false,
    title: '招商银行企业银行',
    autoHideMenuBar: true,
    center: true,
    // show: false,
    // backgroundColor: '#FFFFFF',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
      // nodeIntegration: false
      // preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  log.info('Info: New window created.')
  log.warn('Warn: NodeIntegration is on.')

  // 异常捕获并上传
  try {
    mainWindow.aNotExistMethod()
  } catch (e) {
    log.error('Error occurred', { error: e })
    // expected output: ReferenceError: nonExistentFunction is not defined
    // Note - error messages will vary depending on browser
  }

  // console.log(path.join(__dirname, 'preload.js'))

  mainWindow.loadURL(winURL)

  // 注册系统快捷键
  const ret1 = globalShortcut.register('CommandOrControl+D', () => {
    console.log('CommandOrControl+D is pressed')
    mainWindow.webContents.openDevTools()
  })
  if (!ret1) {
    console.log('registration failed')
  }

  const ret2 = globalShortcut.register('CommandOrControl+B', () => {
    console.log('CommandOrControl+B is pressed')
    if (mainWindow.webContents.canGoBack()) {
      mainWindow.webContents.goBack()
    }
  })
  if (!ret2) {
    console.log('registration failed')
  }

  log.info('Info: Shortcut registered.', { error: 'Hello' })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  // 页面跳转控制器
  mainWindow.webContents.on('will-navigate', function (event, url) {
    console.log(url)
    if (url === 'http://english.cmbchina.com/Personal') {
      event.preventDefault()
    }
  })

  // 页面跳转控制器
  mainWindow.webContents.on('new-window', (event, url, frameName, disposition, options) => {
    event.preventDefault()
    const win = new BrowserWindow({
      webContents: options.webContents, // use existing webContents if provided
      show: false
    })
    // win.once('ready-to-show', () => win.show())
    win.once('ready-to-show', function () {
      win.show()
    })
    if (!options.webContents) {
      win.loadURL(url) // existing webContents will be navigated automatically
    }
    event.newGuest = win
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('reloadUrl', function (event, username, password) {
  // console.log(mainWindow.webContents);
  console.log('Username: ' + username + ', Password: ' + password)
  mainWindow.webContents.loadURL('http://english.cmbchina.com/')
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
