/*
Author: Kevin Justice
File: test1.js
Date Created: 01/26/18

Various global scope tests
*/

let global.testObject

GlobalObject = function(){

	var scope = this;

	this.testObject = {testString:'none'};
};

GlobalObject.prototype.constructor = GLobalObject;

var global = new GlobalObject();