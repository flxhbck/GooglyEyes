var num = 3; 


var spring, originSpring;

var leftOrigin, leftEye;
var righOrigin, rightEye;

var leftAnchor, rightAnchor;

var canvas;

function setup() {
	var w = window.innerWidth;
	canvas = createCanvas(w, w/2);
	noStroke();

	leftAnchor = createVector(width/2 - width/4, height/2);
	rightAnchor = createVector(width/2 + width/4, height/2);

	var radius = windowWidth/6;

	leftOrigin = new Spring(leftAnchor.x, leftAnchor.y, radius/1.5, 0.85, 8.0, 0.5, leftAnchor, 0, null, radius);
	leftEye = new Spring(leftAnchor.x, leftAnchor.y, radius/1.5, 0.9, 8.0, 0.5, leftAnchor, 1, leftOrigin, radius);

	rightOrigin = new Spring(rightAnchor.x, rightAnchor.y, radius/1.5, 0.85, 8.0, 0.5, rightAnchor, 0, null, radius);
	rightEye = new Spring(rightAnchor.x, rightAnchor.y, radius/1.5, 0.9, 8.0, 0.5, rightAnchor, 1, rightOrigin, radius);
}

function draw() {
	background(100, 40, 200);
	//background(0);
	leftOrigin.update();
	leftEye.update();

	rightOrigin.update();
	rightEye.update();

	leftOrigin.display();
	rightOrigin.display();

	leftEye.display();
	rightEye.display();
}


function mousePressed() {
	leftOrigin.pressed();
	rightOrigin.pressed();
}

function mouseReleased() {
	leftOrigin.released();
	rightOrigin.released();
}

function windowResized() {
	var w = window.innerWidth;
	resizeCanvas(w, w/2);

	leftAnchor = createVector(width/2 - width/4, height/2);
	rightAnchor = createVector(width/2 + width/4, height/2);

	var radius = windowWidth/6;

	leftOrigin = new Spring(leftAnchor.x, leftAnchor.y, radius/1.5, 0.85, 8.0, 0.5, leftAnchor, 0, null, radius);
	leftEye = new Spring(leftAnchor.x, leftAnchor.y, radius/1.5, 0.9, 8.0, 0.5, leftAnchor, 1, leftOrigin, radius);

	rightOrigin = new Spring(rightAnchor.x, rightAnchor.y, radius/1.5, 0.85, 8.0, 0.5, rightAnchor, 0, null, radius);
	rightEye = new Spring(rightAnchor.x, rightAnchor.y, radius/1.5, 0.9, 8.0, 0.5, rightAnchor, 1, rightOrigin, radius);

}



function Spring (x, y, s, d, m, k_in, origin, id, anchorSpring, radius) { 
	// Screen values 
	this.xpos = x;
	this.ypos = y;

	this.tempxpos = x;
	this.tempypos = y; 

	this.size = s; 
	this.over = false; 
	this.move = false; 

	this.radius = radius;

	// Spring simulation constants 
	this.mass = m;       // Mass 
	this.k = k_in;    // Spring constant 
	this.damp = d;       // Damping 

	this.rest_posx = origin.x;  // Rest position X 
	this.rest_posy = origin.y;  // Rest position Y 

	// Spring simulation variables 
	//float pos = 20.0; // Position 
	this.velx = 0.0;   // X Velocity 
	this.vely = 0.0;   // Y Velocity 
	this.accel = 0;    // Acceleration 
	this.force = 0;    // Force 

	this.anchorSpring = anchorSpring;
	this.me = id;

	this.accVector = createVector(0,0);


	this.update = function() {
		if (this.move) { 
		  	this.tempxpos = mouseX; 
		  	this.tempypos = mouseY;
		}

		// if parent, adjust position based on acc values
		if(id == 0 && ((accelerationX != 0) | (accelerationY != 0))) {
			this.move == true;
		 	this.accVector = createVector(accelerationY, accelerationX);
		  	this.accVector.mult(15);
		  	this.accVector.add(this.rest_posx, this.rest_posy);
		  	this.tempxpos = this.accVector.x;
		  	this.tempypos = this.accVector.y;
		}


		// is it the "child spring"? If yes, update anchor to follow the parent.
		if(id == 1){
			this.rest_posx = anchorSpring.tempxpos;
			this.rest_posy = anchorSpring.tempypos;
		}



		this.force = -(this.k) * (this.tempypos - this.rest_posy);  // f=-ky 
		this.accel = this.force / this.mass;                 // Set the acceleration, f=ma == a=f/m 
		this.vely = this.damp * (this.vely + this.accel);         // Set the velocity 
		this.tempypos = this.tempypos + this.vely;           // Updated position 

		this.force = -(this.k) * (this.tempxpos - this.rest_posx);  // f=-ky 
		this.accel = this.force / this.mass;                // Set the acceleration, f=ma == a=f/m 
		this.velx = this.damp * (this.velx + this.accel);         // Set the velocity 
		this.tempxpos = this.tempxpos + this.velx;           // Updated position


		// limit the outer circle
		if(id == 1){\
			var tempVector = createVector(this.tempxpos, this.tempypos);
			tempVector.sub(this.anchorSpring.rest_posx, this.anchorSpring.rest_posy);

			if(tempVector.mag() > this.radius){
				this.velx = -(this.tempxpos - this.anchorSpring.rest_posx)*0.2;
				this.vely = -(this.tempypos - this.anchorSpring.rest_posy)*0.2;
			}
		}

		if ((this.overEvent() || this.move)) {
			this.over = true;
		} else { 
			this.over = false;
		}
	}


	// Test to see if mouse is over this spring
	this.overEvent = function() {
		var disX = this.tempxpos - mouseX;
		var disY = this.tempypos - mouseY;
		var dis = createVector(disX, disY);
		if (dis.mag() < this.size/2 ) {
			return true;
		} else {
			return false;
		}
	}


	this.display = function() {
	  	// is it the parent? Then draw the outline circle.
	    if(id == 0){
	    	fill(255);
	    	noStroke();
	    	ellipse(this.rest_posx, this.rest_posy, this.radius*2);
	    }

	  	fill(255,0,0);
	  	//ellipse(this.rest_posx, this.rest_posy, 5,5);
	  	//line(this.rest_posx, this.rest_posy, this.tempxpos, this.tempypos);

	    if (this.over) { 
	    	fill(50);
	    } else { 
	    	fill(0);
	    }
	    if(this.me == 1){
	    	ellipse(this.tempxpos, this.tempypos, this.size, this.size);
	    }

	    if(id == 0){
	    	stroke(1);
			//line(this.rest_posx, this.rest_posy, this.accVector.x, this.accVector.y);
	    }
	    

	}


	this.pressed = function() { 
	    if (this.over) { 
	    	this.move = true;
	    } else { 
	    	this.move = false;
	    }
	} 

	this.released = function() { 
	  	if(!this.over) return;
	    this.move = false; 
	    this.tempxpos = mouseX;
	    this.tempypos = mouseY;
	}
};