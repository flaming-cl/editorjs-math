![](https://badgen.net/badge/Editor.js/v2.0/blue)

# Math Tool for Editor.js

Transform Tex syntax/plain text to pretty math equations  
Based on mathJax and mathjs
![image](https://user-images.githubusercontent.com/51183663/84605226-486fbd80-aece-11ea-9bc0-38c90cd8bc05.png)

## Usage

Add a new Tool to the `tools` property of the Editor.js initial config.

```javascript
var editor = EditorJS({
  ...
  
  tools: {
    ...
    Math: {
      class: Math,
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
Text can be plain text or Tex syntax($ can be omitted)
{
    "type" : "math",
    "data" : {
        "text" : "sqrt(9 / 3) - cos(pi / 4)^2",
    }
}
```
