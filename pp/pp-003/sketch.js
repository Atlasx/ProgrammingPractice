var origin;

var radius = 100;
var layerWidth = 50;
var noiseIntensity = 100;
var layerCount = 5;
var seed;

var layerCountSlider;
var layerWidthSlider;
var radiusSlider;

function setup() {
	createCanvas(900,600);
	pixelDensity(1);

	origin = createVector(width/2, height/2);
	seed = millis();

	var angle = 0;

	angleMode(DEGREES);

	createSliders();
}

function draw() {
	updateSliders();

	background(80);

	for (var l = 0; l < layerCount; l++) {
		fill(100 + l * 20);
		strokeWeight(0);
		beginShape();
		vertex(width, 0); //top right

		//Used for saving the first point to complete the circle
		var first; 

		//Iterate radially around our hole
		noiseSeed(seed + l);
		for (var i = 0; i <= 360; i+=2) {
			var pos = evalCircle(radius + l * layerWidth, i);
			if (i == 0) {first = pos;}
			if (i >= 360) {pos = first;}
			vertex(pos.x, pos.y);
		}

		//Finish perimeter
		vertex(width, 0); //top right
		vertex(0, 0);// top left
		vertex(0, height); // bottom left
		vertex(width, height); // bottom right
		endShape();
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
	radiusSlider = createSlider(1, 500, radius, 1);
	radiusSlider.position(width + 20, 60);
}

function updateSliders() {
	layerCount = layerCountSlider.value();
	layerWidth = layerWidthSlider.value();
	radius = radiusSlider.value();
}

function mouseClicked() {
	seed = millis();
}