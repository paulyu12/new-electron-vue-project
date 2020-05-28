export function getFromMain (itemList, callback) {
  if (window.isElectron) {
    window.ipcRenderer.on('get-data-reply', callback)
    window.ipcRenderer.send('get-data', itemList)
  }
}

export function getFromMainSync (itemList) {
  if (window.isElectron) {
    return window.ipcRenderer.sendSync('get-data-sync', itemList)
  }
}

export function sendToMain (itemObject, callback) {
  if (window.isElectron) {
    window.ipcRenderer.on('send-data-reply', callback)
    window.ipcRenderer.send('send-data', itemObject)
  }
}

export function sendToMainSync (itemObject) {
  if (window.isElectron) {
    return window.ipcRenderer.sendSync('send-data-sync', itemObject)
  }
}
