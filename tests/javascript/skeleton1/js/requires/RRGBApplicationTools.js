var InterfaceConstructor = function(){

  var scope = this;

  this.electronWindows = [];
  this.serialPorts = [];
};

var UtilityConstructor = function(){

  var scope = this;

  var windowManager = function(){
  	//createWindow(args, windowId)
  	//closeWindow(windowId)
  	//getWindow(windowId)
  	//generateWindowId()
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
  		interfaces.electronWindows.push(new electronWindow(args));
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

  this.windowManager = new windowManager();
};

var RRGBApplicationTools = function(){
	this.InterfaceConstructor = InterfaceConstructor;
	this.UtilityConstructor = UtilityConstructor;
};

module.exports = new RRGBApplicationTools();