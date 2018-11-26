var sh;

function preload() {
	sh = loadShader('./vert.glsl', './frag.glsl');
}

function setup() {
	createCanvas(900,600,WEBGL);
	var fov = 60 / 180 * PI;
  	var cameraZ = height / 2.0 / tan(fov / 2.0);
	perspective(fov, width / height, cameraZ * 0.1, cameraZ * 10);
	noStroke();
	shader(sh);
}

function draw() {
	background(30);
	push();
	translate(0,0,200);
	sphere(100);
	pop();
}