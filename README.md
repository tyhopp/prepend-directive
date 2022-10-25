# prepend-directive

Prepend a directive to the top of a file.

Useful as a [post build script](https://docs.npmjs.com/cli/v8/using-npm/scripts#pre--post-scripts) if your build tool (e.g. [microbundle](https://github.com/developit/microbundle)) strips comments and does not allow you to configure the behavior conditionally.

## CLI interface

```shell
npx prepend-directive@latest --directive=\"use strict\" --files=file-a.js,file-b.js
```

## Node CJS interface

```js
const prependDirective = require(`prepend-directive`);

prependDirective({
  directive: `use strict`,
  files: [`file-a.js`, `file-b.js`],
  cwd: __dirname, // Optional
});
```

### Before

file-a.js:

```js
const a = () => `a`;
```

file-b.js:

```js
const b = () => `b`;
```

### After

file-a.js:

```js
"use strict"
const a = () => `a`;
```

file-b.js:

```js
"use strict"
const b = () => `b`;
```
