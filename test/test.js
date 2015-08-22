"use strict";
var compiler = require("../");

var expect = require("chai").expect;

var options = { beautify:false };



// https://facebook.github.io/react/jsx-compiler.html



describe("Basic HTML", function()
{
	describe("with one top-level node", function()
	{
		it("should be supported", function(done)
		{
			var result = new compiler(options).compile('<tag></tag>');
			var expectedResult = 'React.createElement("tag")';
			
			expect(result).to.equal(expectedResult);
			done();
		});
		
		
		
		it("should support attributes", function(done)
		{
			var result = new compiler(options).compile('<tag attr="value"></tag>');
			var expectedResult = 'React.createElement("tag",{"attr":"value"})';
			
			expect(result).to.equal(expectedResult);
			done();
		});
		
		
		
		it("should support attributes and text content", function(done)
		{
			var result = new compiler(options).compile('<tag attr="value">text</tag>');
			var expectedResult = 'React.createElement("tag",{"attr":"value"},"text")';
			
			//console.log( require("uglify-js").minify(result,{fromString:true}) );
			
			expect(result).to.equal(expectedResult);
			done();
		});
		
		
		
		it("should support nested tags", function(done)
		{
			var result = new compiler(options).compile('<tag><tag/>text<tag/></tag>');
			var expectedResult = 'React.createElement("tag",null,React.createElement("tag"),"text",React.createElement("tag"))';
			
			expect(result).to.equal(expectedResult);
			done();
		});
		
		
		
		it("should support nested tags (#2)", function(done)
		{
			var result = new compiler(options).compile('<tag>text<tag/>text</tag>');
			var expectedResult = 'React.createElement("tag",null,"text",React.createElement("tag"),"text")';
			
			expect(result).to.equal(expectedResult);
			done();
		});
		
		
		
		it("should support nested tags and a convenience function", function(done)
		{
			var result = new compiler(options).compile('<div><tag/>text<tag/></div>');
			var expectedResult = 'React.DOM.div(null,React.createElement("tag"),"text",React.createElement("tag"))';
			
			expect(result).to.equal(expectedResult);
			done();
		});
		
		
		
		it("should support nested tags and a convenience function (#2)", function(done)
		{
			var result = new compiler(options).compile('<div>text<tag/>text</div>');
			var expectedResult = 'React.DOM.div(null,"text",React.createElement("tag"),"text")';
			
			expect(result).to.equal(expectedResult);
			done();
		});
	});
	
	
	
	// NOTE :: this is not supported by React, but it's here for completeness
	describe("with multiple top-level nodes", function()
	{
		it("should be supported", function(done)
		{
			var result = new compiler(options).compile('<tag/><tag/>');
			var expectedResult = '[React.createElement("tag"),React.createElement("tag")]';
			
			expect(result).to.equal(expectedResult);
			done();
		});
		
		
		
		it("should support attributes and text content", function(done)
		{
			var result = new compiler(options).compile('<tag attr="value">text</tag><tag attr="value">text</tag>');
			var expectedResult = '[React.createElement("tag",{"attr":"value"},"text"),React.createElement("tag",{"attr":"value"},"text")]';
			
			expect(result).to.equal(expectedResult);
			done();
		});
	});
});
