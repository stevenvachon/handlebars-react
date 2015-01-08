# handlebars-react
> Compile Handlebars templates to [React](https://facebook.github.io/react/).

Compile this:
```handlebars
<div>
	value1
	{{variable1}}
	{{#if variable2}}<span>value2</span>{{else}}nothing{{/if}}
	<span data-attr="{{#if variable3}}value3{{/if}} value4">value5</span>
</div>
```
into this:
```js
React.DOM.div(null,
	"value1",
	this.props.variable1,
	this.props.variable2 ? React.DOM.span(null,
		"value2"
	) : "nothing",
	React.DOM.span({"data-attr":(this.props.variable3 ? "value3" : "") + " value4"},
		"value5"
	)
);
```

## Usage
### Server/Browserify
```js
var handlebarsReact = require("handlebars-react");
var result = new handlebarsReact(options).compile("<h1>{{title}}</h1>");
```
### AMD/etc
Accessible via `define()` or `windows.handlebarsReact`.

## Options
See [handlebars-html-parser](https://github.com/stevenvachon/handlebars-html-parser).
