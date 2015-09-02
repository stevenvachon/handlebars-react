"use strict";
var compiler = require("../");

var expect = require("chai").expect;
var objectAssign = require("object-assign");

var defaultOptions = { beautify:false/*, multipleTopLevelNodes:true*/, normalizeWhitespace:false, useDomMethods:false };



function options(overrides)
{
	return objectAssign({}, defaultOptions, overrides);
}



// https://facebook.github.io/react/jsx-compiler.html



describe("Basic HTML", function()
{
	describe("with one top-level node", function()
	{
		it("should be supported", function(done)
		{
			var result = new compiler( options() ).compile('<tag></tag>');
			var expectedResult = 'React.createElement("tag")';
			
			expect(result).to.equal(expectedResult);
			done();
		});
		
		
		
		it("should support an attribute", function(done)
		{
			var result = new compiler( options() ).compile('<tag attr="value"></tag>');
			var expectedResult = 'React.createElement("tag",{"attr":"value"})';
			
			expect(result).to.equal(expectedResult);
			done();
		});
		
		
		
		it("should support attributes", function(done)
		{
			var result = new compiler( options() ).compile('<tag attr1="value1" attr-2="value2"></tag>');
			var expectedResult = 'React.createElement("tag",{"attr1":"value1","attr-2":"value2"})';
			
			expect(result).to.equal(expectedResult);
			done();
		});
		
		
		
		it("should support attributes and text content", function(done)
		{
			var result = new compiler( options() ).compile('<tag attr1="value1" attr-2="value2">text</tag>');
			var expectedResult = 'React.createElement("tag",{"attr1":"value1","attr-2":"value2"},"text")';
			
			//console.log( require("uglify-js").minify(result,{fromString:true}).code );
			
			expect(result).to.equal(expectedResult);
			done();
		});
		
		
		
		it("should support nested tags", function(done)
		{
			var result = new compiler( options() ).compile('<tag><tag/>text<tag/></tag>');
			var expectedResult = 'React.createElement("tag",null,React.createElement("tag"),"text",React.createElement("tag"))';
			
			expect(result).to.equal(expectedResult);
			done();
		});
		
		
		
		it("should support nested tags (#2)", function(done)
		{
			var result = new compiler( options() ).compile('<tag>text<tag/>text</tag>');
			var expectedResult = 'React.createElement("tag",null,"text",React.createElement("tag"),"text")';
			
			expect(result).to.equal(expectedResult);
			done();
		});
		
		
		
		it("should support nested tags and a convenience function", function(done)
		{
			var result = new compiler( options({ useDomMethods:true }) ).compile('<div><tag/>text<tag/></div>');
			var expectedResult = 'React.DOM.div(null,React.createElement("tag"),"text",React.createElement("tag"))';
			
			expect(result).to.equal(expectedResult);
			done();
		});
		
		
		
		it("should support nested tags and a convenience function (#2)", function(done)
		{
			var result = new compiler( options({ useDomMethods:true }) ).compile('<div>text<tag/>text</div>');
			var expectedResult = 'React.DOM.div(null,"text",React.createElement("tag"),"text")';
			
			expect(result).to.equal(expectedResult);
			done();
		});
		
		
		
		it("should support nested tags and a convenience function (#3)", function(done)
		{
			var result = new compiler( options({ useDomMethods:true }) ).compile('<div><div>text</div><tag>text</tag></div>');
			var expectedResult = 'React.DOM.div(null,React.DOM.div(null,"text"),React.createElement("tag",null,"text"))';
			
			expect(result).to.equal(expectedResult);
			done();
		});
	});
	
	
	
	// NOTE :: this is not supported by React, but it's here for completeness
	describe("with multiple top-level nodes", function()
	{
		it("should be supported", function(done)
		{
			var result = new compiler( options({ multipleTopLevelNodes:true }) ).compile('<tag/><tag/>');
			var expectedResult = '[React.createElement("tag"),React.createElement("tag")]';
			
			expect(result).to.equal(expectedResult);
			done();
		});
		
		
		
		it("should support attributes and text content", function(done)
		{
			var result = new compiler( options({ multipleTopLevelNodes:true }) ).compile('<tag attr="value">text</tag> <tag attr1="value1" attr-2="value2">text</tag>');
			var expectedResult = '[React.createElement("tag",{"attr":"value"},"text")," ",React.createElement("tag",{"attr1":"value1","attr-2":"value2"},"text")]';
			
			expect(result).to.equal(expectedResult);
			done();
		});
		
		
		
		it("should support nested tags", function(done)
		{
			var result = new compiler( options({ multipleTopLevelNodes:true, useDomMethods:true }) ).compile('<tag><tag/>text<tag/></tag> <tag>text<tag/>text</tag>');
			var expectedResult = '[React.createElement("tag",null,React.createElement("tag"),"text",React.createElement("tag"))," ",React.createElement("tag",null,"text",React.createElement("tag"),"text")]';
			
			expect(result).to.equal(expectedResult);
			done();
		});
		
		
		
		it("should support nested tags and a convenience function", function(done)
		{
			var result = new compiler( options({ multipleTopLevelNodes:true, useDomMethods:true }) ).compile('<div><tag/>text<tag/></div> <div>text<tag/>text</div>');
			var expectedResult = '[React.DOM.div(null,React.createElement("tag"),"text",React.createElement("tag"))," ",React.DOM.div(null,"text",React.createElement("tag"),"text")]';
			
			expect(result).to.equal(expectedResult);
			done();
		});
	});
	
	
	
	describe("edge cases", function()
	{
		it("should support <script> tags", function(done)
		{
			var result = new compiler( options() ).compile('<script>function a(arg){ b(arg) }</script>');
			var expectedResult = 'React.createElement("script",null,"function a(arg){ b(arg) }")';
			
			expect(result).to.equal(expectedResult);
			done();
		});
		
		
		
		it("should support <style> tags", function(done)
		{
			var result = new compiler( options() ).compile('<style>html { background-color:gray }</style>');
			var expectedResult = 'React.createElement("style",null,"html { background-color:gray }")';
			
			expect(result).to.equal(expectedResult);
			done();
		});
		
		
		
		it("should support style attributes", function(done)
		{
			var result = new compiler( options() ).compile('<div style="background-color:gray"></div>');
			var expectedResult = 'React.createElement("div",{"style":{"backgroundColor":"gray"}})';
			
			expect(result).to.equal(expectedResult);
			done();
		});
	});
	
	
	
	describe("options", function()
	{
		it.skip("autoPrefixCSS = true", function(done)
		{
			var result = new compiler( options({ autoPrefixCSS:true }) ).compile('<style>div { -webkit-border-radius:5px }</style>');
			var expectedResult = 'React.createElement("style",null,"div { border-radius:5px }")';
			
			expect(result).to.equal(expectedResult);
			done();
		});
		
		
		
		it("beautify = true", function(done)
		{
			var result = new compiler( options({ beautify:true }) ).compile('<tag attr1="value1" attr-2="value2">text</tag>');
			
			var expectedResult = '';
			expectedResult += 'React.createElement("tag", {\n';
			expectedResult += '  attr1: "value1",\n';
			expectedResult += '  "attr-2": "value2"\n';
			expectedResult += '}, "text");';
			
			expect(result).to.equal(expectedResult);
			done();
		});
	});
});
