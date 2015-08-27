"use strict";
var domStyleParser = require("dom-style-parser");
var HandlebarsHtmlParser = require("handlebars-html-parser");
var objectAssign = require("object-assign");
var React = require("react");
var uglify = require("uglify-js");

var defaultOptions = 
{
	//autoPrefixCSS: false,
	beautify: true,
	//minifyCSS: false,
	//minifyJS: false,
	multipleTopLevelNodes: false,
	normalizeWhitespace: true,
	prefix: "",
	suffix: "",
	useDomMethods: true
};



/*var NodeType = 
{
	HBS_EXPRESSION: "hbsExpression",
	
	HBS_EXPRESSION_END:        "hbsExpressionEnd",
	HBS_EXPRESSION_HASH_PARAM: "hbsExpressionHashParam",
	HBS_EXPRESSION_PARAM:      "hbsExpressionParam",
	HBS_EXPRESSION_PATH:       "hbsExpressionPath",
	HBS_EXPRESSION_START:      "hbsExpressionStart",
	HBS_TAG_END:               "hbsTagEnd",
	HBS_TAG_START:             "hbsTagStart",
	
	HTML_ATTR_END:             "htmlAttrEnd",
	HTML_ATTR_NAME_END:        "htmlAttrNameEnd",
	HTML_ATTR_NAME_START:      "htmlAttrNameStart",
	HTML_ATTR_START:           "htmlAttrStart",
	HTML_ATTR_VALUE_END:       "htmlAttrValueEnd",
	HTML_ATTR_VALUE_START:     "htmlAttrValueStart",
	HTML_COMMENT_END:          "htmlCommentEnd",
	HTML_COMMENT_START:        "htmlCommentStart",
	HTML_TAG_END:              "htmlTagEnd",
	HTML_TAG_NAME_END:         "htmlTagNameEnd",
	HTML_TAG_NAME_START:       "htmlTagNameStart",
	HTML_TAG_START:            "htmlTagStart",
	
	TEXT: "text"
};*/



function compiler(options)
{
	this.options = objectAssign({}, defaultOptions, options);
	
	this.parser = new HandlebarsHtmlParser(
	{
		normalizeWhitespace: this.options.normalizeWhitespace
	});
}



compiler.prototype.compile = function(str)
{
	// Stacks indexed by parent tag depth -- first index is a "document" node (root/top-level nodes container)
	var areDomMethods = [false];  // React.DOM… or React.createElement per element in stack
	var attrCounts    = [0];      // atributes per element in stack
	var childCounts   = [0];      // child count per element in stack
	//var hbsCounts     = [0];      // Handlebar expression count per element's text content in stack
	
	var isAttribute       = false;  // <tag …
	var isAttributeName   = false;  // <tag attr
	var isAttributeValue  = false;  // <tag attr="value"
	var isClosingTag      = false;  // </…
	var isComment         = false;  // <!--…
	var isStyleAttribute  = false;  // <tag style
	var isTag             = false;  // <…>
	var isTagName         = false;  // <tag
	var isWithinScriptTag = false;  // <script>…
	var isWithinStyleTag  = false;  // <style>…
	var nodeStack = this.parser.parse(str);
	var options = this.options;
	var result = [];
	
	//console.log(nodeStack);
	//console.log(str);
	
	nodeStack.forEach( function(node, nodeIndex)
	{
		switch (node.type)
		{
			case HandlebarsHtmlParser.type.HBS_EXPRESSION_END:
			{
				break;
			}
			case HandlebarsHtmlParser.type.HBS_EXPRESSION_START:
			{
				break;
			}
			
			
			case HandlebarsHtmlParser.type.HBS_EXPRESSION_HASH_PARAM:
			{
				break;
			}
			
			
			case HandlebarsHtmlParser.type.HBS_EXPRESSION_PARAM:
			{
				break;
			}
			
			
			case HandlebarsHtmlParser.type.HBS_EXPRESSION_PATH:
			{
				break;
			}
			
			
			case HandlebarsHtmlParser.type.HTML_ATTR_END:
			{
				isAttribute = false;
				isStyleAttribute = false;
				break;
			}
			case HandlebarsHtmlParser.type.HTML_ATTR_START:
			{
				isAttribute = true;
				
				incrementTop(attrCounts);
				
				if (getLast(attrCounts) <= 1)
				{
					if (getLast(areDomMethods) === false)
					{
						// React.createElement("tag",
						append(',', result);
					}
					
					// React.createElement("tag", {
					// React.DOM.tag({
					append('{', result);
				}
				else
				{
					// React.createElement("tag", {attr:"value",
					// React.DOM.tag({attr:value,
					append(',', result);
				}
				
				break;
			}
			
			
			case HandlebarsHtmlParser.type.HTML_ATTR_NAME_END:
			{
				isAttributeName = false;
				break;
			}
			case HandlebarsHtmlParser.type.HTML_ATTR_NAME_START:
			{
				isAttributeName = true;
				break;
			}
			
			
			case HandlebarsHtmlParser.type.HTML_ATTR_VALUE_END:
			{
				isAttributeValue = false;
				break;
			}
			case HandlebarsHtmlParser.type.HTML_ATTR_VALUE_START:
			{
				isAttributeValue = true;
				
				append(':', result);
				
				break;
			}
			
			
			case HandlebarsHtmlParser.type.HTML_COMMENT_END:
			{
				isComment = false;
				break;
			}
			case HandlebarsHtmlParser.type.HTML_COMMENT_START:
			{
				isComment = true;
				break;
			}
			
			
			// …>
			case HandlebarsHtmlParser.type.HTML_TAG_END:
			{
				if (isClosingTag === true)
				{
					if (getLast(attrCounts)>0 && getLast(childCounts)<=0)
					{
						append('}', result);
					}
					
					append(')', result);
					
					removeTop(areDomMethods);
					removeTop(attrCounts);
					removeTop(childCounts);
					
					isWithinScriptTag = false;
					isWithinStyleTag = false;
				}
				
				isClosingTag = false;
				isTag = false;
				
				break;
			}
			// <…
			case HandlebarsHtmlParser.type.HTML_TAG_START:
			{
				isClosingTag = (node.closing === true);
				isTag = true;
				
				if (isClosingTag === false)
				{
					beforeChild(areDomMethods, attrCounts, childCounts, result);
					
					addTop(areDomMethods, false);
					
					addTop(attrCounts);
					incrementTop(childCounts);
					addTop(childCounts);
					
					append('React.createElement(', result);
				}
				
				break;
			}
			
			
			case HandlebarsHtmlParser.type.HTML_TAG_NAME_END:
			{
				isTagName = false;
				break;
			}
			case HandlebarsHtmlParser.type.HTML_TAG_NAME_START:
			{
				isTagName = true;
				break;
			}
			
			
			case HandlebarsHtmlParser.type.TEXT:
			{
				if (isTag === true)
				{
					if (isTagName === true)
					{
						if (isClosingTag === false)
						{
							node.value = node.value.toLowerCase();
							
							if (options.useDomMethods === true)
							{
								// If tag name has a `React.DOM` function
								if (typeof React.DOM[node.value] === "function")
								{
									// Change stack's top value
									areDomMethods[areDomMethods.length-1] = true;
									
									// Change last/previous result index
									result[result.length-1] = 'React.DOM.' + node.value + '(';
									
									// Done -- no more code in this `case` will run
									break;
								}
							}
							
							switch (node.value)
							{
								case "script":  isWithinScriptTag = true; break;
								case "style":   isWithinStyleTag  = true; break;
							}
							
							// React.createElement("tag"
							append('"'+ node.value +'"', result);
						}
						// Else: closing tag name not appended
					}
					else if (isAttribute === true)
					{
						if (isAttributeName === true)
						{
							node.value = node.value.toLowerCase();
							
							if (node.value === "style") isStyleAttribute = true;
							
							// React.createElement("tag", {"attr"
							// React.DOM.tag({"attr"
							append('"'+ convertAttributeName(node.value) +'"', result);
						}
						else if (isAttributeValue === true)
						{
							if (isStyleAttribute === false)
							{
								// React.createElement("tag", {"attr":"value"
								// React.DOM.tag({"attr":"value"
								append('"'+ node.value +'"', result);
							}
							else
							{
								// React.createElement("tag", {"style":{…}
								// React.DOM.tag({"style":{…}
								append( parseInlineStyles(node.value, options), result );
							}
						}
					}
				}
				else
				{
					beforeChild(areDomMethods, attrCounts, childCounts, result);
					
					incrementTop(childCounts);
					
					if (isWithinScriptTag === true)
					{
						append( parseScript(node.value), result );
					}
					else if (isWithinStyleTag === true)
					{
						// TODO :: autoprefix
						append('"'+ node.value +'"', result);
					}
					else
					{
						//if (typeof node.value==="string" || node.value instanceof String===true)
						//{
							append('"'+ node.value +'"', result);
						//}
						//else
						//{
							// Support for null, undefined, numbers
						//	append(node.value, result);
						//}
					}
				}
				
				break;
			}
			
			
			default:
			{
				// oops?
			}
		}
	});
	
	// If more than one top-level node
	if (getLast(childCounts) > 1)
	{
		if (this.options.multipleTopLevelNodes === true)
		{
			// Contain comma-separated list in an Array
			result.unshift('[');
			result.push(']');
		}
		else
		{
			throw new Error(getLast(childCounts) + "top-level nodes detected. Only one is currently supported by React.");
		}
	}
	
	//console.log(result);
	
	result = finalize(result, this.options);
	
	//console.log(result);
	
	return result;
};



//::: PRIVATE FUNCTIONS



function addTop(stack, value)
{
	if (value === undefined) value = 0;
	
	stack.push(value);
}



function append(string, resultArray)
{
	if (string != null && string !== "")
	{
		resultArray.push(string);
	}
}



function beforeChild(areDomMethods, attrCounts, childCounts, resultArray)
{
	// If not top-level node
	if (childCounts.length > 1)
	{
		if (getLast(attrCounts) <= 0)
		{
			if (getLast(childCounts) <= 0)
			{
				if (getLast(areDomMethods) === false)
				{
					// React.createElement("tag",
					append(',', resultArray);
				}
				
				// React.createElement("tag", null,
				// React.DOM.tag(null,
				append('null', resultArray);
				append(',', resultArray);
			}
			else
			{
				// React.createElement("tag", {"attr":"value"}, sibling,
				// React.DOM.tag({"attr":"value"}, sibling,
				append(',', resultArray);
			}
		}
		else
		{
			// React.createElement("tag", {"attr":"value"},
			// React.DOM.tag({"attr":"value"},
			append('}', resultArray);
			append(',', resultArray);
		}
	}
	// If top-level node with siblings
	else if (getLast(childCounts) > 0)
	{
		// React.createElement(…),
		// React.DOM.tag(…),
		// "text",
		append(',', resultArray);
	}
}



function convertAttributeName(attrName)
{
	// TODO :: is this necessary?
	// TODO :: find a lib for this as there're more?
	switch (attrName)
	{
		case "class":
		{
			attrName = "className";
			break;
		}
		case "for":
		{
			attrName = "htmlFor";
			break;
		}
		default:
		{
			// TODO :: camel-case it?
		}
	}
	
	return attrName;
}


function finalize(resultArray, options)
{
	var js = options.prefix + resultArray.join("") + options.suffix;
	
	// Check that the compiled code is valid
	try
	{
		Function("", js);
	}
	catch (error)
	{
		console.log(js);
		throw error;
	}
	
	if (options.beautify === true)
	{
		js = uglify.parse(js).print_to_string(
		{
			beautify: true,
			comments: true,
			indent_level: 2
		});
	}
	
	return js;
}



function getLast(stack)
{
	return stack[stack.length - 1];
}



function incrementTop(stack)
{
	stack[stack.length - 1]++;
}



function parseScript(script)
{
	// Converts whitespace, unicode chars, etc
	return JSON.stringify(script);
}



function parseInlineStyles(styles, options)
{
	return JSON.stringify( domStyleParser(styles) );
}



function removeTop(stack)
{
	stack.pop();
}



module.exports = compiler;
