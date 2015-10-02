"use strict";
var objectAssign = require("object-assign");

var defaultOptions = 
{
	beautify: false,
	multipleTopLevelNodes: false,
	normalizeWhitespace: false,
	prefix: "",
	processCSS: false,
	processJS: false,
	suffix: "",
	useDomMethods: false
};



function parseOptions(customOptions)
{
	var presetOptions;
	
	if (customOptions != null)
	{
		// Presets
		switch (customOptions.env)
		{
			case "development":
			{
				presetOptions = 
				{
					beautify: true,
					normalizeWhitespace: true,
					processCSS: true,
					useDomMethods: true
				};
				break;
			}
			case "production":
			{
				presetOptions = 
				{
					normalizeWhitespace: true,
					processCSS: true,
					processJS: true
					// TODO :: does `useDomMethods` gzip smaller?
				};
				break;
			}
		}
	}
	
	return objectAssign({}, defaultOptions, presetOptions, customOptions);
}



module.exports = parseOptions;
