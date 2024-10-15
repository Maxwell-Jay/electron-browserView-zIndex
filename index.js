const { app, BrowserWindow, BrowserView } = require('electron')

const addedZIndexBrowserViewIds = []

/**
 * 初始化electronBrowserViewZIndex，所有browserView自动支持zIndex
 */
function initialize () {
  // 监听browser-window-created事件，覆写browserWindow.webContents上关于browserView的方法
  app.on('browser-window-created', (event, browserWindow) => {
    hookMethod(browserWindow, 'addBrowserView', (browserView, zIndex) => {
      // 初始化browserView的zIndex属性
      if (browserView instanceof BrowserView && !addedZIndexBrowserViewIds.includes(browserView.webContents.id)) {
        // 为browserView定义zIndex
        addZIndexPropertyForBrowserView(browserView)
        // 记录该browserView已经定义zIndex
        addedZIndexBrowserViewIds.push(browserView.webContents.id)
        // webContents销毁后同步移除记录
        browserView.webContents.once('destroyed', () => {
          const idIndex = addedZIndexBrowserViewIds.indexOf(browserView.webContents.id)
          if (idIndex > -1) {
            addedZIndexBrowserViewIds.splice(idIndex, 1)
          }
        })
      }

      if (Number.isInteger(zIndex)) {
        // 若addBrowserView的第二个参数为整数，则直接设置到browserView（此时browserView已经定义了zIndex属性）
        browserView.zIndex = zIndex
      } else {
        // 重排browserView
        reorderBrowserViews(browserWindow)
      }
    }, 'post')
  })
}

/**
 * 为browserView定义zIndex属性
 * @param {BrowserView} browserView
 */
function addZIndexPropertyForBrowserView (browserView) {
  let zIndex = 0
  if (Number.isInteger(browserView.zIndex)) {
    zIndex = browserView.zIndex
  }
  
  Object.defineProperty(browserView, 'zIndex', {
    enumerable: true,
    get () {
      return zIndex
    },
    set (val) {
      // 设置
      zIndex = val
      // 重排
      const browserWindow = BrowserWindow.fromBrowserView(this)
      if (browserWindow) {
        reorderBrowserViews(browserWindow)
      }
    }
  })
}

/**
 * 对某个方法进行hook
 * @param {*} target 要hook的方法所在对象
 * @param {string} methodName 要hook的方法
 * @param {function} hook hook逻辑
 * @param {'pre'|'post'} preOrPost 要在原方法之前还是之后执行
 */
function hookMethod (target, methodName, hook, preOrPost = 'post') {
  const originMethod = target[methodName]
  
  if (typeof originMethod !== 'function') {
    throw new Error(`Failed to hook method, ${methodName} is not a valid method.`)
  }
  if (preOrPost === 'pre') {
    target[methodName] = function (...args) {
      hook.call(this, ...args)
      originMethod.call(this, ...args)
    }
  } else {
    target[methodName] = function (...args) {
      originMethod.call(this, ...args)
      hook.call(this, ...args)
    }
  }
}

/**
 * 重新排列browserViews
 * @param {BrowserWindow} browserWindow 需要重排browserViews的browserWindow
 */
function reorderBrowserViews (browserWindow) {
  const allBrowserViews = (browserWindow.getBrowserViews() || []).filter(bsv => {
    return Number.isInteger(bsv.zIndex)
  })
  allBrowserViews.sort((a, b) => a.zIndex - b.zIndex)
  allBrowserViews.forEach(bsv => {
    browserWindow.setTopBrowserView(bsv)
  })
}

module.exports = {
  initialize,
  addZIndexPropertyForBrowserView,
  reorderBrowserViews
}