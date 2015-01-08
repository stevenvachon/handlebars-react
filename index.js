var parser = require("handlebars-html-parser");



function compiler(options)
{
	this.parser = new parser(options);
}



compiler.prototype.compile = function(str)
{
	var result = "";
	
	this.parser.parse(str).forEach( function(node)
	{
		switch (node.type)
		{
			case parser.types.HBS_COMMENT_END:
			{
				break;
			}
			case parser.types.HBS_COMMENT_START:
			{
				break;
			}
			
			
			case parser.types.HBS_HELPER_END:
			{
				break;
			}
			case parser.types.HBS_HELPER_START:
			{
				break;
			}
			
			
			case parser.types.HBS_SECTION_END:
			{
				break;
			}
			case parser.types.HBS_SECTION_START:
			{
				break;
			}
			
			
			case parser.types.HBS_VARIABLE:
			{
				break;
			}
			
			
			case parser.types.HTML_ATTR_END:
			{
				break;
			}
			case parser.types.HTML_ATTR_START:
			{
				break;
			}
			
			
			case parser.types.HTML_ATTR_NAME_END:
			{
				break;
			}
			case parser.types.HTML_ATTR_NAME_START:
			{
				break;
			}
			
			
			case parser.types.HTML_ATTR_VALUE_END:
			{
				break;
			}
			case parser.types.HTML_ATTR_VALUE_START:
			{
				break;
			}
			
			
			case parser.types.HTML_COMMENT_END:
			{
				break;
			}
			case parser.types.HTML_COMMENT_START:
			{
				break;
			}
			
			
			case parser.types.HTML_TAG_END:
			{
				break;
			}
			case parser.types.HTML_TAG_START:
			{
				break;
			}
			
			
			case parser.types.HTML_TAG_NAME_END:
			{
				break;
			}
			case parser.types.HTML_TAG_NAME_START:
			{
				break;
			}
			
			
			case parser.types.TEXT:
			{
				break;
			}
			
			
			default:
			{
				// oops?
			}
		}
	});
	
	return result;
};



module.exports = compiler;
