var browser = require('../')
var path = require('path')
var xhr = require('xhr')

var b = browser()
var id = 'fe4f71a4d666f85558a9fd638b6e3482b44ff25c367724a029011e6de86f09bb'

var cd = function(img, cwd) {
  xhr({url:'http://localhost:8000/v1/images/'+img+'/tree'+cwd, json:true}, function(err, response) {
    if (err) throw err

    var entries = response.body

    entries.sort(function(a, b) {
      return (a.type+'/'+a.path).localeCompare(b.type+'/'+b.path)
    })

    b.renderDirectory(cwd, entries)
  })
}

var cat = function(img, name) {
  xhr({url:'http://localhost:8000/v1/images/'+img+'/blobs'+name}, function(err, response) {
    if (err) throw err
    b.renderFile(name, response.body)
  })
}

b.on('directory', function(cwd) {
  window.location = '#!/tree/'+id+cwd
})

b.on('file', function(cwd, entry) {
  window.location = '#!/blob/'+entry.image+cwd
})

b.appendTo(document.body)

window.onhashchange = function() {
  var hash = window.location.hash.slice(1).replace(/\/$/, '')
  var parts = hash.split('/')
  var img = parts[2] || id
  var cwd = '/'+parts.slice(3).join('/')

  if (parts[0] !== '!') return cd(img, cwd)
  if (parts[1] === 'tree') return cd(img, cwd)
  if (parts[1] === 'blob') return cat(img, cwd)
}

window.onhashchange()