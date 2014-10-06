var react = require('react')
var path = require('path')
var relative = require('relative-date')
var pretty = require('pretty-bytes')
var events = require('events')
var defaultcss = require('defaultcss')
var fs = require('fs')
var DOM = react.DOM

var style = fs.readFileSync(__dirname+'/style.css')
var proto = {}

var toDate = function(d) {
  if (typeof d === 'number' || typeof d === 'string') return new Date(d)
  return d
}

proto.getInitialState = function() {
  return {
    cwd:this.props.cwd || '/',
    blob:this.props.blobs || null,
    entries: this.props.entries || []
  }
}

proto.renderDirectory = function() {
  var self = this

  var li = this.state.entries.map(function(entry) {
    var onclick = function(e) {
      e.preventDefault()
      self.props.onentry(entry)
    }

    var name = path.basename(entry.name || entry.path)
    var modified = entry.mtime || entry.modified
    var size = entry.size
    var type = entry.type || 'file'

    return DOM.li({className:type+' entry', key:entry.path, onClick:onclick},
      DOM.a({href:'javascript:void(0)'},
        DOM.span({className:'name'}, name),
        modified ? DOM.span({className:'modified'}, relative(toDate(modified))) : undefined,
        typeof size === 'number' ? DOM.span({className:'size'}, pretty(size)) : undefined
      )
    )
  })

  var onprev = function(e) {
    e.preventDefault()
    self.props.onentry({path:path.join(self.state.cwd, '..'), type:'directory'})
  }

  if (this.state.cwd !== '/') {
    li.unshift(DOM.li({className:'entry previous directory', key:'..', onClick:onprev},
      DOM.a({href:'javascript:void(0)'}, DOM.span({className:'name'}, '..'))
    ))
  }

  return DOM.ul({className:'entries'}, li)
}

proto.renderFile = function() {
  return DOM.pre(null, this.state.blob)
}

proto.render = function() {
  return DOM.div({className:'file-browser'},
    this.state.blob ? this.renderFile() : this.renderDirectory()
  )
}

var Browser = react.createClass(proto)

module.exports = function(opts) {
  if (!opts) opts = {}

  var that = new events.EventEmitter()

  opts.onentry = function(entry) {
    that.emit('entry', entry)
    that.emit(entry.type === 'directory' ? 'directory' : 'file', entry.path, entry)
  }

  that.directory = function(cwd, entries) {
    opts.cwd = cwd
    opts.entries = entries
    opts.blob = null
    if (comp) comp.setState(opts)
  }

  that.file = function(cwd, blob) {
    opts.cwd = cwd
    opts.entries = null
    opts.blob = blob
    if (comp) comp.setState(opts)
  }

  that.appendTo = function(el) {
    if (opts.style !== false) defaultcss('file-browser', style)
    comp = react.renderComponent(Browser(opts), el)
  }

  return that
}