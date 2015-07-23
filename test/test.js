"use strict";
var compiler = require("../");

var expect = require("chai").expect;



it("should work", function(done)
{
	var result = new compiler().compile("<tag/>text<tag/>");
	
	console.log(result);
	
	//expect(result).to.equal();
	
	done();
});



it.skip("should work", function(done)
{
	var result = new compiler().compile("<tag><tag/>text<tag/></tag>");
	
	console.log(result);
	
	//expect(result).to.equal();
	
	done();
});
