
import { ipcRenderer } from 'electron'

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})

function init () {
  // add global variables to your web page
  window.isElectron = true
  window.ipcRenderer = ipcRenderer
}

init()