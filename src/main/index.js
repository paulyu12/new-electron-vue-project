import { app, protocol, BrowserWindow, globalShortcut, ipcMain, shell, dialog } from 'electron'
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
const isDevelopment = process.env.NODE_ENV !== "production";
const BrowserLikeWindow = require('./browserLikeWindow');

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

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

let browser;
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  browser = new BrowserLikeWindow({
    controlHeight: 99,
    // controlPanel: fileUrl(`${__dirname}/control-panel/controls.html`),
    controlPanel: winURL,
    startPage: 'https://lcdp.csuat.cmburl.cn',
    blankTitle: 'New tab',
    winOptions: {
      frame: false
    },
    debug: true // will open controlPanel's devtools
  });

  browser.on('closed', () => {
    browser = null;
  });

}

app.on('activate', () => {
  if (browser === null) {
    createWindow();
  }
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
