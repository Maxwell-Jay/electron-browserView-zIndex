# electron-browserView-zIndex
Support for BrowserView zIndex, allowing for more flexible layer management in Electron BrowserWindow.

## Installation

Install with [npm](https://www.npmjs.com/package/electron-browserview-zindex):

```
npm install electron-browserview-zindex
```

## Usage

In main process:

```javascript
const electronBrowserViewZIndex = require('electron-browserview-zindex')
electronBrowserViewZIndex.initialize()

// Add a browserView with zIndex 5
browserWindow.addBrowserView(browserView, 5)
```



```browserWindow.addBrowserView(browserView, 5)``` is syntactic sugar for calling ```browserView.zIndex = 5``` and ```browserWindow.addBrowserView(theBrowserView)``` in one line.  The  zIndex can be set to any integer.

```javascript
browserWindow.addBrowserView(browserView, 5)

// is equivalent to
browserView.zIndex = 5
browserWindow.addBrowserView(browserView)
```

If you modify the zIndex property of browserView, the browserWindow that the browserView  attatch to will update the layer of its browserViews on the z-axis.

## Example

Call ```npm run example``` to run example

```javascript
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

function wait (time) {
  return new Promise(resolve => setTimeout(() => resolve(), time))
}
```

![example](./example.gif)

## How

Implemented through ```browserWindow.setTopBrowserView```.
