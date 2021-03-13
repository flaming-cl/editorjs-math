![](https://badgen.net/badge/Editor.js/v2.0/blue)

# Math Tool for Editor.js
![image](https://user-images.githubusercontent.com/51183663/86523997-4c787500-bea7-11ea-8f96-36b96d6ff96d.png)

Transform laTex text to pretty math equations

Demo: https://flaming-cl.github.io/editorPlugin  
This is a plugin for Editor.js. To use this package, you need to install [editorjs](https://www.npmjs.com/package/@editorjs/editorjs) first   
Here are the supported functions: https://katex.org/docs/supported.html  

### Install via NPM

Get the package

```shell
npm i --save-dev editorjs-math
```

Include module at your application

```javascript
const mathTex = require('editorjs-math');
// or import MathTex from 'editorjs-math';
```

### Load from CDN
<script src="https://cdn.jsdelivr.net/npm/editorjs-math@1.0.2/dist/bundle.js"></script>

## Usage

Add a new Tool to the `tools` property of the Editor.js initial config.

```javascript
var editor = EditorJS({
  ...
  
  tools: {
    ...
    math: {
      class: MathTex, // for CDN: window.MathTex
    },
  }
  
  ...
});
```

## Config Params

This Tool has no config params

## Output data

| Field  | Type     | Description      |
| ------ | -------- | ---------------- |
| text   | `string` | Math text |

```json
  {
        "type" : "math",
        "data" : {
            "text" : "\\{1,2,3,\\ldots ,n\\}",
        }
    }
```

## Credits
Katex: https://github.com/KaTeX/KaTeX
