# file-browser-widget

File browser widget for the browser

```
npm install file-browser-widget
```

## Usage

``` js
var browser = require('file-browser-widget')
var br = browser()

br.appendTo(document.body)

// render a directory
br.directory('/', [{
  path: '/file.txt',
  type: 'file',
  size: 11,
  mtime: new Date('2014-10-06T06:33:22.950Z')
}, {
  path: '/dir',
  type: 'directory',
  mtime: new Date('2014-10-06T06:33:22.950Z')
}])

// or render a file
br.file('/file.txt', 'hello world')
```

## License

MIT