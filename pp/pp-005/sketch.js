// Simple Spring Sim

var spring;

var stiffSlider, lengthSlider, massSlider;

var sliders = [];
var prevSliders = [];

function setup() {
	createCanvas(900,600);
	background(0);

	createSliders();
	sliders = [stiffSlider, lengthSlider, massSlider];
	prevSliders = [0,0,0];

	spring = new Spring(createVector(width/2,height-50), 1, 200, 10, 100, 20);
}

function draw() {
	if (checkSliders()) {
		// Sliders changed, update values
		spring.stiff = stiffSlider.value();
		spring.eqLength = lengthSlider.value();
		spring.mass = massSlider.value();
	}

	// Re-draw background
	background(0);

	//Update and draw our spring
	spring.update();
	spring.draw();
}

function createSliders() {
	stiffSlider = createSlider(0.1,5,1,0.1);
	lengthSlider = createSlider(10,300,100,1);
	massSlider = createSlider(0.1,50,20,0.1);

	stiffSlider.position(width + 20, 20);
	lengthSlider.position(width + 20, 40);
	massSlider.position(width + 20, 60);
}

function checkSliders() {
	var changed = false;
	for (var i = 0; i < sliders.length; i++) {
		if (sliders[i].value() != prevSliders[i]) { changed = true; }
		prevSliders[i] = sliders[i].value();
	}

	return changed;
}

function mousePressed() {
	if (spring.overHandle()) {
		spring.active = false;
	}
}

function mouseDragged() {
	if (!spring.active) {
		spring.length = spring.pos.y - mouseY;
	}
}

function mouseReleased() {
	spring.active = true;
}

class Spring {
	constructor(position, stiffness, length, mass, handleWidth, handleHeight) {
		this.pos = position;			// Position of start of the spring
		this.length = length;			// Current length (starts at equilibrium)
		this.acc = 0;
		this.vel = 0;
		this.stiff = stiffness;			// Stiffness constant factor
		this.eqLength = length;			// Equilibrium length
		this.mass = mass;
		this.dampen = 0.95;
		this.hWidth = handleWidth;
		this.hHeight = handleHeight;
		this.active = true;
	}

	draw() {
		noStroke();

		// Piston-like connection
		fill(100);
		rect(this.pos.x - 5, this.pos.y, 10, -this.length);

		// Fixed base
		fill(150);
		rect(this.pos.x-this.hWidth/2, this.pos.y-this.hHeight/2, this.hWidth, this.hHeight);

		// End of the spring
		fill(255);
		rect(this.pos.x-this.hWidth/2,
		 	this.pos.y - this.length - this.hHeight/2,
		 	this.hWidth,
		 	this.hHeight
		 );
	}

	update() {
		if (this.active == false) { return; }

		var f = -this.stiff * (this.length - this.eqLength);

		//Just going to sim in the y direction
		this.acc = f / this.mass;
		this.vel = this.dampen * (this.vel + this.acc);
		this.length = this.length + this.vel;
	}

	//Checks if the mouse is currently over our handle
	overHandle() {
		return (abs(mouseX - this.pos.x) < this.hWidth/2) && (abs(mouseY - this.pos.y + this.length) < this.hHeight/2)
	}
}