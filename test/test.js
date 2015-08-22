"use strict";
var compiler = require("../");

var expect = require("chai").expect;

var options = { beautify:false };



// https://facebook.github.io/react/jsx-compiler.html



describe("Basic HTML", function()
{
	it("should support a tag", function(done)
	{
		var result = new compiler(options).compile('<tag></tag>');
		var expectedResult = 'React.createElement("tag")';
		
		expect(result).to.equal(expectedResult);
		done();
	});
	
	
	
	it("should support a tag that has attributes", function(done)
	{
		var result = new compiler(options).compile('<tag attr="value"></tag>');
		var expectedResult = 'React.createElement("tag",{"attr":"value"})';
		
		expect(result).to.equal(expectedResult);
		done();
	});
	
	
	
	it("should support a tag that has attributes and text content", function(done)
	{
		var result = new compiler(options).compile('<tag attr="value">text</tag>');
		var expectedResult = 'React.createElement("tag",{"attr":"value"},"text")';
		
		//console.log( require("uglify-js").minify(result,{fromString:true}) );
		
		expect(result).to.equal(expectedResult);
		done();
	});
	
	
	
	it.skip("should support a tag that has nested tags", function(done)
	{
		var result = new compiler(options).compile('<tag><tag/>text<tag/></tag>');
		var expectedResult = 'React.createElement("tag",null,React.createElement("tag"),"text",React.createElement("tag"))';
		
		expect(result).to.equal(expectedResult);
		done();
	});
	
	
	
	it.skip("should support a tag with a convenience function that has nested tags", function(done)
	{
		var result = new compiler(options).compile('<div><tag/>text<tag/></div>');
		var expectedResult = 'React.DOM.div(null,React.createElement("tag"),"text",React.createElement("tag"))';
		
		expect(result).to.equal(expectedResult);
		done();
	});
});
