"use strict";
var HandlebarsHtmlParser = require("handlebars-html-parser");
var objectAssign = require("object-assign");
var React = require("react");
var uglify = require("uglify-js");

var defaultOptions = 
{
	beautify: true,
	collapseWhitespace: true,
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
		collapseWhitespace: this.options.collapseWhitespace
	});
}



compiler.prototype.compile = function(str)
{
	var attrCounts  = [0];  // indexed by parent tag depth -- first index is a "document" node (root/top-level nodes container)
	var childCounts = [0];  // indexed by parent tag depth -- first index is a "document" node (root/top-level nodes container)
	var isAttribute      = false;  // <tag …
	var isAttributeName  = false;  // <tag attr
	var isAttributeValue = false;  // <tag attr="value"
	var isClosingTag     = false;  // </…
	var isComment        = false;  // <!--…
	var isDomMethod      = false;  // React.DOM… or React.createElement
	var isTag            = false;  // <…
	var isTagName        = false;  // <tag
	var nodeStack = this.parser.parse(str);
	var result = [];
	var thisObj = this;
	
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
				break;
			}
			case HandlebarsHtmlParser.type.HTML_ATTR_START:
			{
				isAttribute = true;
				
				incrementSiblingCount(attrCounts);
				
				if (count(attrCounts) <= 1)
				{
					if (isDomMethod === false)
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
					if (count(attrCounts)>0 && count(childCounts)<=0)
					{
						append('}', result);
					}
					
					append(')', result);
					
					stopCount(attrCounts);
					stopCount(childCounts);
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
					beforeChild(attrCounts, childCounts, isDomMethod, result);
					
					startCount(attrCounts);
					incrementSiblingCount(childCounts);
					startCount(childCounts);
					
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
							if (thisObj.options.useDomMethods === true)
							{
								// If tag name has a `React.DOM` function
								if (typeof React.DOM[node.value.toLowerCase()] === "function")
								{
									isDomMethod = true;
									
									// Change last/previous result index
									result[result.length-1] = 'React.DOM.' + node.value.toLowerCase() + '(';
									
									break;
								}
							}
							
							// React.createElement("tag"
							append('"'+ node.value.toLowerCase() +'"', result);
						}
						// Else: closing tag name not appended
					}
					else if (isAttribute === true)
					{
						if (isAttributeName === true)
						{
							// React.createElement("tag", {"attr"
							// React.DOM.tag({"attr"
							append('"'+ convertAttributeName(node.value.toLowerCase()) +'"', result);
						}
						else if (isAttributeValue === true)
						{
							// React.createElement("tag", {"attr":"value"
							// React.DOM.tag({"attr":"value"
							append('"'+ node.value +'"', result);
						}
					}
				}
				else
				{
					// Support for non-html documents
					//if (siblingCount(childCounts) > 0)
					//{
						beforeChild(attrCounts, childCounts, isDomMethod, result);
					//}
					
					incrementSiblingCount(childCounts);
					
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
				
				break;
			}
			
			
			default:
			{
				// oops?
			}
		}
	});
	
	// If more than one top-level node
	if (childCounts[0] > 1)
	{
		// Contain comma-separated list in an Array
		result.unshift('[');
		result.push(']');
	}
	
	result = finalize(result, this.options);
	
	//console.log(nodeStack);
	//console.log(str);
	//console.log(result);
	
	return result;
};



//::: PRIVATE FUNCTIONS



function append(string, resultArray)
{
	if (string != null && string !== "")
	{
		resultArray.push(string);
	}
}



function beforeChild(attrCounts, childCounts, isDomMethod, resultArray)
{
	// If not top-level node
	if (childCounts.length > 1)
	{
		if (count(attrCounts) <= 0)
		{
			if (count(childCounts) <= 0)
			{
				if (isDomMethod === false)
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
	else if (count(childCounts) > 0)
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



function count(stack)
{
	return stack[stack.length - 1];
}



function finalize(resultArray, options)
{
	var js = options.prefix + resultArray.join("") + options.suffix;
	
	// Check that the compiled JavaScript code is valid
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



function incrementSiblingCount(stack)
{
	// Increase parent's children count
	stack[stack.length - 1]++;
}



function siblingCount(stack)
{
	var count;
	
	// If not "document" node
	if (stack.length > 1)
	{
		count = stack[stack.length - 2];
	}
	// Support for multiple top-level nodes
	else
	{
		count = stack[stack.length - 1];
	}
	
	// Siblings cannot include self
	count--;
	
	// No negative siblings
	// TODO :: is this necessary?
	count = Math.max(0, count);
	
	return count;
}



function startCount(stack)
{
	stack.push(0);
}



function stopCount(stack)
{
	stack.pop();
}



module.exports = compiler;
