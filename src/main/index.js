import { app, BrowserWindow, globalShortcut, ipcMain, shell, dialog } from 'electron'

// eslint-disable-next-line no-unused-expressions
'use strict'
const path = require('path')
const log = require('electron-log')

log.transports.file.file = './main.log'
log.transports.console.level = 'warn' // error, warn, info, verbose, debug, silly
log.transports.file.level = 'info'
log.transports.remote.level = 'info'
// let remote = log.transports.remote
// remote.url = 'http://192.168.247.131:8080/electron'
// log.transports.remote = remote

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
      preload: path.resolve(__dirname, 'preload.js'),
      nodeIntegration: true,
      webSecurity: false
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

app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', async (event, navigationUrl) => {
    // In this example, we'll ask the operating system
    // to open this event's url in the default browser.
    event.preventDefault()
    await shell.openExternal(navigationUrl)
  })
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('reloadUrl', function (event, username, password) {
  console.log(mainWindow.webContents)
  console.log('Username: ' + username + ', Password: ' + password)
  mainWindow.webContents.loadURL('http://192.168.247.135:8080/electron', {
    postData: [{
      type: 'rawData',
      bytes: Buffer.from("{a: '1'}")
    }],
    extraHeaders: 'Content-Type: application/json'
  })
  // mainWindow.webContents.loadURL('http://english.cmbchina.com/')
})

ipcMain.on('notification', function (event, message) {
  dialog.showMessageBox({
    type: 'info',
    message: message,
    buttons: ['好的']
  })
})

// ipcMain.on('verifyOTP', function (event, username, password, otp) {
//   // console.log(mainWindow.webContents);
//   console.log('Username: ' + username + ', Password: ' + password + ', OTP: ' + otp)
//   var request = require('request')

//   request('http://192.168.247.130:5001/validate/check?user=' + username + '&pass=' + otp, (error, response, body) => {
//     console.log('Here')
//     if (!error && response.statusCode === 200) {
//       console.log(body)
//     }
//   })
// })

ipcMain.on('get-data', function (event, itemList) {
  console.log(itemList)
  event.reply('get-data-reply', 'this is a response')
})

ipcMain.on('get-data-sync', function (event, itemList) {
  console.log(itemList)
  event.returnValue = 'this is a sync response'
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
