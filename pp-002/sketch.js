// Fading Mountain Ranges
// 
// Using 3D perlin noise to represent a mountain
// range between foreground and background colors

//Colors
var fColor = [0.427, 0.63, 0.8196];
var bColor = [0.753, 0.788, 0.8196];

var noiseShader;

function preload() {
	noiseShader = loadShader('./pp-002/noiseVert.glsl', './pp-002/noiseFrag.glsl');
}

function setup() {
	//Basic setups
	createCanvas(900, 600, WEBGL);
	frameRate(30);

	// Need to reset pixel density on higher res machines
	// Who really needs those extra pixels
	pixelDensity(1);

	shader(noiseShader);

	noiseShader.setUniform("width", width);
	noiseShader.setUniform("height", height);
	noiseShader.setUniform("seed", second());
	noiseShader.setUniform("fColor", fColor);
	noiseShader.setUniform("bColor", bColor);
	noiseShader.setUniform("shiftSpeed", random(10));
}

function draw() {
	quad(-1, -1, 1, -1, 1, 1, -1, 1);
	noiseShader.setUniform("time", millis()/1000);
}

function mouseClicked() {
	var hue = random(1);
	var light = 0.5;
	var sat = 0.5;

	fColor = hsvToRgb(hue, sat - 0.3, light + 0.3);
	bColor = hsvToRgb(hue, sat, light);

	noiseShader.setUniform("fColor", fColor);
	noiseShader.setUniform("bColor", bColor);
	noiseShader.setUniform("seed", second());
	noiseShader.setUniform("shiftSpeed", random(10));
}


//HSV and RGB conversion functions taken from https://gist.github.com/mjackson/5311256
//Modified to accept values ranged [0, 1]
function hsvToRgb(h, s, v){
    var r, g, b;

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch(i % 6){
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return [r, g, b];
}

function rgbToHsv(r, g, b) {

  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, v = max;

  var d = max - min;
  s = max == 0 ? 0 : d / max;

  if (max == min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  return [ h, s, v ];
}