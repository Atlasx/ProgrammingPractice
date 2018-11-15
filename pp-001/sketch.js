var tree;
var bLength  = 200;			// Branch Length: 			length of the initial branch
var bFactor  = 2;			// Branch Factor: 			branches per branch
var bLFactor = 0.625;		// Branch Length Factor: 	reduce length of branches by a factor
var bWidth   = 30;			// Branch Width: 			width of the branch
var bWFactor = 0.625;		// Branch Width Factor: 	reduce width of branches by a factor
var bAngle   = Math.PI/8;	// Branch Angle: 			angle between branches
var tDepth   = 5;			// Tree Depth: 				number of levels of branches
var bMax 	 = 500; 		// Branch Max: 				maximum number of branches

var bRandChance = 0.1; 		// Branch Random Chance: 	chance a branch will be deleted
var bRandAngle	= Math.PI/16;
var bRandLFactor = 0.2;		// Branch Random Length Factor

var bAngleSlider;
var prevBAngleSlider = -1;
var bFactorSlider;
var prevBFactorSlider = -1;
var tDepthSlider;
var prevTDepthSlider = -1;


function setup() {
	createCanvas(900, 600);
  	background(0);
  	stroke(255);

	createSliders();
  	createTree();
}

function draw() {
	//Clear Background
	background(0);

	//If any sliders changed, re-build the tree
	if (checkSliders()) {
		createTree();
	}

	//Drawa all elements of the
	for (var i = 0; i < tree.length; i++) {
  		tree[i].draw();
  	}

  	//Update tracking values for sliders
  	updatePrevSliders();
}

function mouseClicked() {
	createTree();
}

function createTree() {
	//Clear tree
	tree = [];

	//Create root
	tree = [ new Branch(createVector(width/2, height),
		bLength, 
		bWidth, 
		(random(2)-1)*bRandAngle)
	];

	//Recursively generate branches
	branch(0, tDepthSlider.value());
}

function branch(index, depth) {
	depth--;

	if (tree.length > bMax) return;

	//Create x branches
	if (depth > 0) {
		for (var i = 0; i < bFactorSlider.value(); i++) {

			//Random chance branch will not grow
			if (random(1) < bRandChance) continue;

			//Create branch params
			let p = tree[index];
			let curBrA = bAngleSlider.value();
			let a = map(i, 0, bFactorSlider.value()-1, p.angle - curBrA, p.angle + curBrA)
				+ (random(2)-1) * bRandAngle;
			let w = p.thick * bWFactor > 1 ? p.thick * bWFactor : 1;
			let bLF = bLFactor + (random(2)-1) * bRandLFactor;

			//Create the branch
			var b = new Branch(p.endPos(), p.len * bLF, w, a);

			tree.push(b);

			//Recurse per branch
			branch(tree.length-1, depth);
		}
	}
}

function createSliders() {
	bAngleSlider = createSlider(-PI/2, PI/2, bAngle, 0.01);
  	bAngleSlider.position(width + 20, 20);

  	bFactorSlider = createSlider(1, 8, bFactor, 1);
  	bFactorSlider.position(width + 20, 40);

  	tDepthSlider = createSlider(0, 8, tDepth, 1);
  	tDepthSlider.position(width + 20, 60);
}

//Checks all sliders for a change
function checkSliders() {
	var changed = false;

	if (bAngleSlider.value() != prevBAngleSlider) {
		changed = true;
	}
	if (bFactorSlider.value() != prevBFactorSlider) {
		changed = true;
	}
	if (tDepthSlider.value() != prevTDepthSlider) {
		changed = true;
	}

	return changed;
}

function updatePrevSliders() {
	prevBAngleSlider = bAngleSlider.value();
  	prevBFactorSlider = bFactorSlider.value();
  	prevTDepthSlider = tDepthSlider.value();
}

class Branch {
	constructor(pos, len, thick, angle) {
		this.pos = createVector(pos.x, pos.y);
		this.len = len;
		this.thick = thick;
		this.angle = angle;
	}

	draw() {
		push();
		let ePos = this.endPos();
		strokeWeight(this.thick);
		line(this.pos.x, this.pos.y, ePos.x, ePos.y);
		pop();
	}

	endPos() {
		var endPos = createVector(this.pos.x, this.pos.y);
		var rotVec = createVector(0, -this.len).rotate(this.angle);
		endPos.add(rotVec);
		return endPos;
	}
}