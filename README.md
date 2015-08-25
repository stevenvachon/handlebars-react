# handlebars-react [![NPM Version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][david-image]][david-url]
> Compile Handlebars templates to [React](https://facebook.github.io/react/).

Compile this:
```handlebars
<div>
	text1
	{{variable1}}
	{{#if variable2}}<span>text2</span>{{else}}text3{{/if}}
	<span data-attr="{{#if variable3}}value1{{/if}} value2">text4</span>
</div>
```
into this:
```js
React.DOM.div(null,
	"text1",
	this.props.variable1,
	this.props.variable2 ? React.DOM.span(null,
		"text2"
	) : "text3",
	React.DOM.span({"data-attr":(this.props.variable3 ? "value1" : "") + " value2"},
		"text4"
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

### options.beautify
Type: `Boolean`  
Default value: `true`  
When `true`, output will be formatted for increased legibility.

### options.collapseWhitespace
Type: `Boolean`  
Default value: `true`  
When `true`, standard whitespace will be replaced with a single space. For more info, see [handlebars-html-parser](https://github.com/stevenvachon/handlebars-html-parser).

### options.useDomMethods
Type: `Boolean`  
Default value: `true`  
When `true`, available `React.DOM` convenience functions will be used instead of `React.createElement()`.


## Roadmap Features
* add `convertHbsComments` option for converting Handlebars comments to HTML comments
* add `ignoreHtmlComments` option when React supports such ([react#2810](https://github.com/facebook/react/issues/2810))


## Changelog
* 0.0.1–0.0.8 pre-releases


[npm-image]: https://img.shields.io/npm/v/handlebars-react.svg
[npm-url]: https://npmjs.org/package/handlebars-react
[travis-image]: https://img.shields.io/travis/stevenvachon/handlebars-react.svg
[travis-url]: https://travis-ci.org/stevenvachon/handlebars-react
[david-image]: https://img.shields.io/david/stevenvachon/handlebars-react.svg
[david-url]: https://david-dm.org/stevenvachon/handlebars-react
