# JSON less.js file manager

# Usage
In LESS file, you can import JSON file as variables file.

```less
@import './variables.json';

body {
  border: @border--size @border--color;
}
```

# Use

```bash
lessc style.less --plugin=index.js
```

Inspired by https://github.com/fortes/less-plugin-load-json#readme.
