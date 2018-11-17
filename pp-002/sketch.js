// Fading Mountain Ranges
// 
// Using 3D perlin noise to represent a mountain
// range between foreground and background colors

//Colors
var fColor = [255, 255, 255];
var bColor = [0, 0, 0];

//Params
var hueMaxDif = 10;
var hueMinDif = 3;

var satMin = 5;
var satMax = 30;

var satMaxDif = 50;
var satMinDif = 50;

var valMin = 85;
var valMax = 90;

var ridgeMinCount = 3;
var ridgeMaxCount = 8;

var noiseShader;
var teapot;

function preload() {
	noiseShader = loadShader('/pp-002/noiseVert.glsl', '/pp-002/noiseFrag.glsl');
}

function setup() {
	//Basic setups
	createCanvas(900, 600, WEBGL);
	frameRate(30);
	//generate();

	// Need to reset pixel density on higher res machines
	// Who really needs those extra pixels
	pixelDensity(1);

	shader(noiseShader);
	//noStroke();

	noiseShader.setUniform("width", width);
	noiseShader.setUniform("height", height);
}

function draw() {
	noiseShader.setUniform("_Time", millis() / 1000)
	quad(-1, -1, 1, -1, 1, 1, -1, 1);
}

function generate() {
	//Set differences
	let hueDif = random(hueMinDif, hueMaxDif);
	let satDif = random(satMinDif, satMaxDif);

	//Select foreground color
	//fColor = [random(Math.abs(360)), random(satMin, max(satMax,satMax-satDif)), random(valMin, valMax)];

	//Select background color
	//bColor = [(fColor[0]+hueDif) % 360, fColor[1]+satDif, fColor[2] + 10];

	colorMode(HSB);
	background(bColor);

	//Create range
	console.log("Creating cutoff");
	var layer = createImage(900,600);
	layer.loadPixels();
	for (var x = 0; x < layer.width; x++) {
		for (var y = 0; y < layer.height; y++) {
			let col = evaluateCutoff(x, y);
			layer.set(x, y, col);
		}
	}
	layer.updatePixels();

	//Display image
	image(layer, 0, 0);
}

function evaluateCutoff(x, y) {

	var n = noise(x * 0.006, y * 0.005) * (y/(height));
	var col = n > 0.5 ? fColor : bColor;
	col.push(255);

	return col;
}

function mouseClicked() {
	generate();
}