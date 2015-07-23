# handlebars-react [![NPM Version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][david-image]][david-url]
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
var HandlebarsReact = require("handlebars-react");
var result = new HandlebarsReact(options).compile("<h1>{{title}}</h1>");
```
### AMD/etc
Accessible via `define()` or `window.HandlebarsReact`.

## Options
See [handlebars-html-parser](https://github.com/stevenvachon/handlebars-html-parser).


[npm-image]: https://img.shields.io/npm/v/handlebars-react.svg
[npm-url]: https://npmjs.org/package/handlebars-react
[travis-image]: https://img.shields.io/travis/stevenvachon/handlebars-react.svg
[travis-url]: https://travis-ci.org/stevenvachon/handlebars-react
[david-image]: https://img.shields.io/david/stevenvachon/handlebars-react.svg
[david-url]: https://david-dm.org/stevenvachon/handlebars-react
