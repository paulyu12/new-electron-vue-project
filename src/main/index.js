import { app, BrowserWindow, globalShortcut, ipcMain } from 'electron'
// eslint-disable-next-line no-unused-expressions
'use strict'
// const path = require('path')

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
    center: true
  })

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

  const ret2 = globalShortcut.register('CommandOrControl+M', () => {
    console.log('CommandOrControl+M is pressed')
    mainWindow.webContents.openDevTools()
  })
  if (!ret2) {
    console.log('registration failed')
  }

  mainWindow.on('closed', () => {
    mainWindow = null
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

ipcMain.on('reloadUrl', function () {
  // console.log(mainWindow.webContents);
  mainWindow.webContents.loadURL('http://www.cmbchina.com/')
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
