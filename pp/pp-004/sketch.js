var origin;

var radius = 100;
var layerWidth = 50;
var noiseIntensity = 70;
var layerCount = 5;

var buffer = 500;

var seed;

var layerCountSlider;
var layerWidthSlider;
var radiusSlider;

var prevLC;
var prevLW;
var prevRad;

var layers = [];

var bColor, fColor;

function setup() {
	createCanvas(900,600);
	pixelDensity(1);
	frameRate(60);

	origin = createVector(width/2, height/2);
	seed = millis();

	var angle = 0;
	angleMode(DEGREES);

	generateColors();
	console.log("Lerped Color");
	console.log(layerColor(1));

	createSliders();
	createRings();
}

function draw() {
	updateSliders();

	background(fColor);

	for (var i = 0; i < layers.length; i++) {
		var p = parallax(i);
		image(layers[i], p.x-buffer/2, p.y-buffer/2, width + 2*buffer, height + 2*buffer);
	}
}

// Should return the mouse position for layer 0
// and the origin for the last layer
function parallax(layer) {
	var mouse = createVector(mouseX - width/2, mouseY - height/2);
	var perc = (layer+1)/(layers.length); //will be 0 for layer 0, 1 for last layer
	var ret = createVector(0,0);
	ret.x = lerp(mouse.x, 0, perc);
	ret.y = lerp(mouse.y, 0, perc);
	return ret;
}

function layerColor(layer) {
	colorMode(HSB);
	var perc = (layer+1)/(layerCount);
	var retCol = lerpColor(fColor, bColor, perc);
	return retCol;
}

function generateColors() {
	colorMode(HSB);
	var rand1 = floor(random(360));
	var rand2 = rand1 + random(60, 180);
	if (abs(rand1 - rand2) < 50) rand2 = (rand2 + 50) % 360;
	fColor = color(rand1, 25, 35);
	bColor = color(rand2, 25, 95);
	console.log("Generated Colors");
	console.log(fColor);
	console.log(bColor);
}

function createRings() {
	//First clear any existing rings
	while(layers.length > 0) {
		layers[0].remove();
		layers[0] = null;
		layers.shift();
	}

	for (var l = 0; l < layerCount; l++) {
		var layer = createGraphics(900 + 2*buffer,600 + 2*buffer);
		layer.background('rgba(0,0,0,0.0)');
		layer.colorMode(HSB);
		layer.fill(layerColor(l));
		layer.strokeWeight(0);
		layer.beginShape();
		layer.vertex(width + buffer, 0 - buffer); //top right

		//Used for saving the first point to complete the circle
		var first; 

		//Iterate radially around our hole
		noiseSeed(seed + l);
		for (var i = 0; i <= 360; i+=2) {
			var pos = evalCircle(radius + l * layerWidth, i);
			if (i == 0) {first = pos;}
			if (i >= 360) {pos = first;}
			layer.vertex(pos.x + buffer/2, pos.y + buffer/2);
		}

		//Finish perimeter
		layer.vertex(width + buffer, 0 - buffer); //top right
		layer.vertex(0 - buffer, 0 - buffer);// top left
		layer.vertex(0 - buffer, height + buffer); // bottom left
		layer.vertex(width + buffer, height + buffer); // bottom right
		layer.endShape();

		layers.push(layer);
	}
}

function evalCircle(radius, angle) {

	//Sample next noise iteration
	var rad = radius + noise(angle * 0.1) * noiseIntensity;

	//Get our new point
	var pos = p5.Vector.add(origin, createVector(rad * cos(angle), rad * sin(angle)));

	return pos;
}

function createSliders() {
	layerCountSlider = createSlider(1, 10, layerCount, 1);
	layerCountSlider.position(width + 20, 20);
	layerWidthSlider = createSlider(5, 100, layerWidth, 1);	
	layerWidthSlider.position(width + 20, 40);
	radiusSlider = createSlider(1, 200, radius, 1);
	radiusSlider.position(width + 20, 60);
}

function updateSliders() {
	var changed = false;
	if (prevLC != layerCountSlider.value()) { changed = true; }
	if (prevLW != layerWidthSlider.value()) { changed = true; }
	if (prevRad != radiusSlider.value()) { changed = true; }

	prevLC = layerCountSlider.value();
	prevLW = layerWidthSlider.value();
	prevRad = radiusSlider.value();

	layerCount = layerCountSlider.value();
	layerWidth = layerWidthSlider.value();
	radius = radiusSlider.value();
	noiseIntensity = radius * 0.7;

	if (changed) console.log("Sliders changed, redrawing");
	if (changed) createRings();
}

function mouseClicked() {
	seed = millis();
	generateColors();

	createRings();
}