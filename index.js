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
	var nodeStack = this.parser.parse(str);
	var options = this.options;
	var result = [];
	var tokens = 
	{
		// Stacks indexed by parent tag depth -- first index is a "document" node (root/top-level nodes container)
		areDomMethods:  [false],  // React.DOM… or React.createElement per element in stack
		attrCounts:     [0],      // atributes per element in stack
		childCounts:    [0],      // child count per element in stack
		//hbsCounts:      [0],      // Handlebar expression count per element's text content in stack
		
		isAttribute:       false,  // <tag …
		isAttributeName:   false,  // <tag attr
		isAttributeValue:  false,  // <tag attr="value"
		isClosingTag:      false,  // </…
		isComment:         false,  // <!--…
		isStyleAttribute:  false,  // <tag style
		isTag:             false,  // <…>
		isTagName:         false,  // <tag
		isWithinScriptTag: false,  // <script>…
		isWithinStyleTag:  false   // <style>…
	};
	
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
				tokens.isAttribute = false;
				tokens.isStyleAttribute = false;
				break;
			}
			case HandlebarsHtmlParser.type.HTML_ATTR_START:
			{
				tokens.isAttribute = true;
				
				incrementTop(tokens.attrCounts);
				
				if (numAttributes(tokens) <= 1)
				{
					if (isDomMethod(tokens) === false)
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
				tokens.isAttributeName = false;
				break;
			}
			case HandlebarsHtmlParser.type.HTML_ATTR_NAME_START:
			{
				tokens.isAttributeName = true;
				break;
			}
			
			
			case HandlebarsHtmlParser.type.HTML_ATTR_VALUE_END:
			{
				tokens.isAttributeValue = false;
				break;
			}
			case HandlebarsHtmlParser.type.HTML_ATTR_VALUE_START:
			{
				tokens.isAttributeValue = true;
				
				append(':', result);
				
				break;
			}
			
			
			case HandlebarsHtmlParser.type.HTML_COMMENT_END:
			{
				tokens.isComment = false;
				break;
			}
			case HandlebarsHtmlParser.type.HTML_COMMENT_START:
			{
				tokens.isComment = true;
				break;
			}
			
			
			// …>
			case HandlebarsHtmlParser.type.HTML_TAG_END:
			{
				if (tokens.isClosingTag === true)
				{
					if (numAttributes(tokens)>0 && numChildren(tokens)<=0)
					{
						append('}', result);
					}
					
					append(')', result);
					
					removeTop(tokens.areDomMethods);
					removeTop(tokens.attrCounts);
					removeTop(tokens.childCounts);
					
					tokens.isWithinScriptTag = false;
					tokens.isWithinStyleTag = false;
				}
				
				tokens.isClosingTag = false;
				tokens.isTag = false;
				
				break;
			}
			// <…
			case HandlebarsHtmlParser.type.HTML_TAG_START:
			{
				tokens.isClosingTag = (node.closing === true);
				tokens.isTag = true;
				
				if (tokens.isClosingTag === false)
				{
					// TODO :: move to handlebars-html-parser
					addTop(tokens.areDomMethods, false);
					
					addTop(tokens.attrCounts);
					incrementTop(tokens.childCounts);
					addTop(tokens.childCounts);
					
					beforeChild(tokens, result, true);
					
					append('React.createElement(', result);
				}
				
				break;
			}
			
			
			case HandlebarsHtmlParser.type.HTML_TAG_NAME_END:
			{
				tokens.isTagName = false;
				break;
			}
			case HandlebarsHtmlParser.type.HTML_TAG_NAME_START:
			{
				tokens.isTagName = true;
				break;
			}
			
			
			case HandlebarsHtmlParser.type.TEXT:
			{
				if (tokens.isTag === true)
				{
					if (tokens.isTagName === true)
					{
						if (tokens.isClosingTag === false)
						{
							node.value = node.value.toLowerCase();
							
							if (options.useDomMethods === true)
							{
								// If tag name has a `React.DOM` function
								if (typeof React.DOM[node.value] === "function")
								{
									// Change stack's top value
									tokens.areDomMethods[tokens.areDomMethods.length-1] = true;
									
									// Change last/previous result index
									result[result.length-1] = 'React.DOM.' + node.value + '(';
									
									// Done -- no more code in this `case` will run
									break;
								}
							}
							
							switch (node.value)
							{
								case "script":  tokens.isWithinScriptTag = true; break;
								case "style":   tokens.isWithinStyleTag  = true; break;
							}
							
							// React.createElement("tag"
							append('"'+ node.value +'"', result);
						}
						// Else: closing tag name not appended
					}
					else if (tokens.isAttribute === true)
					{
						if (tokens.isAttributeName === true)
						{
							node.value = node.value.toLowerCase();
							
							if (node.value === "style") tokens.isStyleAttribute = true;
							
							// React.createElement("tag", {"attr"
							// React.DOM.tag({"attr"
							append('"'+ convertAttributeName(node.value) +'"', result);
						}
						else if (tokens.isAttributeValue === true)
						{
							if (tokens.isStyleAttribute === false)
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
					incrementTop(tokens.childCounts);
					
					beforeChild(tokens, result);
					
					if (tokens.isWithinScriptTag === true)
					{
						append( parseScript(node.value), result );
					}
					else if (tokens.isWithinStyleTag === true)
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
	if (numChildren(tokens) > 1)
	{
		if (this.options.multipleTopLevelNodes === true)
		{
			// Contain comma-separated list in an Array
			result.unshift('[');
			result.push(']');
		}
		else
		{
			throw new Error(numChildren(tokens) + "top-level nodes detected. Only one is currently supported by React.");
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



function beforeChild(tokens, resultArray, checkParent)
{
	var _isDomMethod   = checkParent!==true ? isDomMethod(tokens)   : isParentDomMethod(tokens);
	var _numAttributes = checkParent!==true ? numAttributes(tokens) : numParentAttributes(tokens);
	var _numChildren   = checkParent!==true ? numChildren(tokens)   : numParentChildren(tokens);
	
	var _isTopLevelChild = checkParent!==true ? tokens.childCounts.length>1 : tokens.childCounts.length>2;
	
	if (_isTopLevelChild === true)
	{
		if (_numAttributes <= 0)
		{
			if (_numChildren <= 1)
			{
				if (_isDomMethod !== true)
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
	else if (_numChildren > 1)
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



function getSecondLast(stack)
{
	return stack[stack.length - 2];
}



function incrementTop(stack)
{
	stack[stack.length - 1]++;
}



function isDomMethod(tokens)
{
	return getLast(tokens.areDomMethods);
}



function isParentDomMethod(tokens)
{
	var result = getSecondLast(tokens.areDomMethods);
	
	if (result === undefined) result = -1;
	
	return result;
}



function numAttributes(tokens)
{
	return getLast(tokens.attrCounts);
}



function numChildren(tokens)
{
	return getLast(tokens.childCounts);
}



function numParentAttributes(tokens)
{
	var result = getSecondLast(tokens.attrCounts);
	
	if (result === undefined) result = -1;
	
	return result;
}



function numParentChildren(tokens)
{
	var result = getSecondLast(tokens.childCounts);
	
	if (result === undefined) result = -1;
	
	return result;
}



function parseScript(script)
{
	// Converts whitespace, unicode chars, etc
	return JSON.stringify(script);
}



function parseInlineStyles(styles, options)
{
	// TODO :: autoprefix
	return JSON.stringify( domStyleParser(styles) );
}



function removeTop(stack)
{
	stack.pop();
}



module.exports = compiler;
