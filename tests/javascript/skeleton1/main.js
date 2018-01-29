electron = require('electron');
path = require('path');
url = require('url');
RRGBApplicationTools = require('./js/requires/RRGBApplicationTools.js');

electronApp = electron.app;
electronWindow = electron.BrowserWindow;
interfaces = new RRGBApplicationTools.InterfaceConstructor();
utilities  = new RRGBApplicationTools.UtilityConstructor();

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electronApp.on('ready', function(){
  win1Id = utilities.windowManager.createWindow({width: 1000, height: 800}, path.join(__dirname, 'index.html'));
  win2Id = utilities.windowManager.createWindow({width: 800, height: 600}, path.join(__dirname, 'index.html'));
  win3Id = utilities.windowManager.createWindow({width: 600, height: 400}, path.join(__dirname, 'index.html'));
});

// Quit when all windows are closed.
/*
electronApp.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    electronApp.quit()
  }
})
*/

/*
electronApp.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})
*/

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.