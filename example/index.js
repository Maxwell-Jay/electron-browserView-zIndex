const { app, BrowserWindow, BrowserView } = require('electron')
const electronBrowserViewZIndex = require('../index.js')

electronBrowserViewZIndex.initialize()

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    title: 'test'
  })

  const bsv1 = new BrowserView()
  const bsv2 = new BrowserView()
  const bsv3 = new BrowserView()
  
bsv1.setBounds({ x: 0, y: 0, width: 500, height: 400 })
bsv2.setBounds({ x: 80, y: 40, width: 340, height: 400 })
bsv3.setBounds({ x: 160, y: 80, width: 500, height: 400 })

bsv1.webContents.loadFile('./burlywood.html')
bsv2.webContents.loadFile('./cadetblue.html')
bsv3.webContents.loadFile('./yellowgreen.html')

// bvs3(1) > bsv2(-5) > bsv1(-6)
win.addBrowserView(bsv1, 5)
win.addBrowserView(bsv2, -5)
win.addBrowserView(bsv3, 1)

// bvs3(1) > bsv2(-5) > bsv1(-6)
await wait(2000)
bsv1.zIndex = -6

// bsv2(3) > bsv3(1) > bsv1(-6)
await wait(2000)
bsv2.zIndex = 3

// bsv1(100) > bsv2(3) > bsv1(-6)
await wait(2000)
bsv1.zIndex = 100

// bsv3(101) > bsv1(100) > bsv1(-6)
await wait(2000)
bsv3.zIndex = 101
})

function wait (time) {
  return new Promise(resolve => setTimeout(() => resolve(), time))
}
