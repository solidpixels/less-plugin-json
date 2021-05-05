# JSON less.js file manager

# Usage
In LESS file, you can import JSON file as variables file. Regular JSON property will be flattened with `--` separator. To produce LESS maps or lists, prefix variable with dollar.


```json
{
  "border": {
    "size": "10px",
    "color": "red"
  },
  "$features": ["a", "b"],
  "$colors": {
    "red": "#ff0000",
    "green": "#00ff00"
  }
}
```

```less
@import './variables.json';

body {
  border: @border--size @border--color;
  features: @features;
  color: @colors[red];
}
```

Will compile to:

```css
body {
  border: 10px red;
  features: a, b;
  colors red;
}
```


# Use

```bash
lessc style.less --plugin=index.js
```

Inspired by https://github.com/fortes/less-plugin-load-json#readme.
