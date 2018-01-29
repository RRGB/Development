/*
Author: Kevin Justice
File: servoserial.js
Date Created: 01/26/18

Servo serial testing
*/

/*
cd 'directory of this file'
node
require('./servoserial.js')
*/

serial = require('serialport');
port = new serial('COM9');

center = 95;
near = 140;
away = 50;

getDeviceInfo = function(){
	serial.list(function(e,r){console.log(r)});
};

move = function(angle){
	port.write([angle, 0x00, 0x00, 0x00, 0x00, 0x00]);
};