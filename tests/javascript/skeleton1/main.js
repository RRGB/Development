electron = require('electron');
path = require('path');
url = require('url');
serialport = require('serialport');
events = require('events');
RRGBApplicationTools = require('./js/requires/RRGBApplicationTools.js');

interfaces = new RRGBApplicationTools.InterfaceConstructor();
utilities  = new RRGBApplicationTools.UtilityConstructor();

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron.app.on('ready', function(){
  win2Id = utilities.windowManager.createWindow({width: 800, height: 600}, path.join(__dirname, 'html/index.html'));
});

// Quit when all windows are closed.
electron.app.on('window-all-closed', function(){
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if(process.platform !== 'darwin'){
    electron.app.quit();
  };
});

utilities.ipcManager.on('message', function(data){console.log(data.message);});
utilities.serialManager.on('serialConnection', function(data){console.log(data);});
utilities.serialManager.on('serialData', function(data){console.log(data);});
utilities.serialManager.connectToDevice([0x01]);

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