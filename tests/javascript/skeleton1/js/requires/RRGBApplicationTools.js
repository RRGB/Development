var InterfaceConstructor = function(){

  var scope = this;

  this.electronWindows = [];
  this.serialPorts = [];
};

var UtilityConstructor = function(){

  var scope = this;

  var windowManager = function(){

  	var windowIds = [];

  	var generateWindowId = function(){
  		return(Math.random().toString(36).substr(2, 10));
  	};

  	var purgeWindow = function(windowId){
  		var currentWindowIndex = windowIds.indexOf(windowId);
  		interfaces.electronWindows[currentWindowIndex] = null;
  		windowIds[currentWindowIndex] = null;
  		windowIds.splice(currentWindowIndex, 1);
  		interfaces.electronWindows.splice(currentWindowIndex, 1);
  	};

  	var createWindow = function(args, startPage){
  		var windowId = generateWindowId();
  		interfaces.electronWindows.push(new electron.BrowserWindow(args));
  		windowIds.push(windowId);
  		var currentWindowIndex = windowIds.indexOf(windowId);
  		interfaces.electronWindows[currentWindowIndex].loadURL(url.format({pathname: startPage, protocol: 'file:', slashes: true}));
  		interfaces.electronWindows[currentWindowIndex].on('closed', function(){purgeWindow(windowId);});
  		return(windowId);
  	};

  	var closeWindow = function(windowId){
  		var currentWindowIndex = windowIds.indexOf(windowId);
  		interfaces.electronWindows[currentWindowIndex].close();
  	};

  	var maximizeWindow = function(windowId){
  		var currentWindowIndex = windowIds.indexOf(windowId);
  		interfaces.electronWindows[currentWindowIndex].maximize();
  	};

  	var minimizeWindow = function(windowId){
  		var currentWindowIndex = windowIds.indexOf(windowId);
  		interfaces.electronWindows[currentWindowIndex].minimize();
  	};

  	this.createWindow = createWindow;
  	this.closeWindow = closeWindow;
  	this.maximizeWindow = maximizeWindow;
  	this.minimizeWindow = minimizeWindow;
  };

  var ipcManager = function(){

    var subScope = this;

    var sortAndEmit = function(event, data){
      subScope.emit(data.dataType, data);
    };

    var sendData = function(data){
      for(var i = 0; i<interfaces.electronWindows.length; i++){
        interfaces.electronWindows[i].webContents.send('data', data);
      };
    };

    electron.ipcMain.on('data', sortAndEmit);

    this.sendData = sendData;
  };
  ipcManager.prototype.__proto__ = events.EventEmitter.prototype;

  var serialManager = function(){

    var subScope = this;

    var serialIds = [];

    var generateSerialId = function(){
      return(Math.random().toString(36).substr(2, 10));
    };

    var connectToDevice = function(pingResponse){

      var pingBuffer = [0x01, 0x00];

      var deviceTestLoop = function(error, devices){

        var deviceConnected = true;
        var isDesiredDevice = false;

        var isEquivalent = function(a, b){
          var aProps = Object.getOwnPropertyNames(a);
          var bProps = Object.getOwnPropertyNames(b);
          if(aProps.length != bProps.length) {
              return(false);
          };
          for(var i = 0; i < aProps.length; i++) {
              var propName = aProps[i];
              if (a[propName] !== b[propName]) {
                  return(false);
              };
          };
          return (true);
        };

        var deviceConnectFail = function(error){
          deviceConnected = false;
        };

        var testPingResponse = function(data){
          if(isEquivalent([...data], pingResponse)){
            isDesiredDevice = true;
          };
        };

        var cleanUp = function(){

          var emitData = function(data, serialId){
            subScope.emit('serialData', {serialId:serialId, data:data});
          };

          var addPort = function(){
            var serialId = generateSerialId();
            interfaces.serialPorts.push(new serialport(devices[0].comName));
            serialIds.push(serialId)
            var currentSerialIndex = serialIds.indexOf(serialId);
            interfaces.serialPorts[currentSerialIndex].on('data', function(data){emitData(data, serialId)});
            subScope.emit('serialConnection', {status:'connect', pingResponse:pingResponse, serialId:serialId});
          };

          testPort.close();
          testPort = null;
          if(isDesiredDevice){
            setTimeout(addPort, 1);
          }
          else{
            devices.splice(0,1);
            deviceTestLoop(error, devices);
          };
        };

        if(devices.length >= 1){
          var testPort = (new serialport(devices[0].comName)).on('error', deviceConnectFail);
          if(deviceConnected){
            testPort.on('data', testPingResponse);
            testPort.write(pingBuffer);
            setTimeout(cleanUp, 1000);
          }
          else{
            testPort.close();
            testPort = null;
            devices.splice(0,1);
            deviceTestLoop(error, devices);
          }
        }
        else{
          subScope.emit('serialConnection', {status:'failedToConnect', pingResponse:pingResponse});
        }
      };

      serialport.list(deviceTestLoop);
    };

    this.connectToDevice = connectToDevice;
  };
  serialManager.prototype.__proto__ = events.EventEmitter.prototype;

  this.windowManager = new windowManager();
  this.ipcManager = new ipcManager();
  this.serialManager = new serialManager();
};

var RRGBApplicationTools = function(){
	this.InterfaceConstructor = InterfaceConstructor;
	this.UtilityConstructor = UtilityConstructor;
};

module.exports = new RRGBApplicationTools();