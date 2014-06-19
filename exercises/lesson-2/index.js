var drawTriangle = require('a-big-triangle')
var throttle     = require('frame-debounce')
var fit          = require('canvas-fit')
var getContext   = require('gl-context')
var compare      = require('gl-compare')
var createShader = require('glslify')
var fs           = require('fs')

var container  = document.getElementById('container')
var canvas     = container.appendChild(document.createElement('canvas'))
var readme     = fs.readFileSync(__dirname + '/README.md', 'utf8')
var gl         = getContext(canvas, render)
var comparison = compare(gl, actual, expected)

comparison.mode = 'slide'
comparison.amount = 0.5

require('../common')({
    description: readme
  , compare: comparison
  , canvas: canvas
})

window.addEventListener('resize', fit(canvas), false)

var actualShader = createShader({
  vertex: './shaders/expected.vert',
  fragment: './shaders/expected.frag'
})(gl)


var expectedShader = createShader({
    frag: './shaders/expected.frag'
  , vert: './shaders/expected.vert'
})(gl)

function render() {
  comparison.run()
  comparison.render()
}

function actual(fbo) {
  fbo.shape = [canvas.height, canvas.width]
  fbo.bind()
  actualShader.bind()
  actualShader.uniforms.screenSize = [canvas.width, canvas.height]
  drawTriangle(gl)
}

function expected(fbo) {
  fbo.shape = [canvas.height, canvas.width]
  fbo.bind()
  expectedShader.bind()
  expectedShader.uniforms.screenSize = [canvas.width, canvas.height]
  drawTriangle(gl)
}