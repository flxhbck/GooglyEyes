var theta, theta_prev;
var w, w0;

var roll = 0;
var pitch = 0;
var yaw = 0;
var radtodeg;


var img;

var perspCorrection = 0.2;


function setup(){
  createCanvas(windowWidth, windowHeight, WEBGL);
  img = loadImage("assets/iris.jpg");

  //ortho(-width/2, width/2, height/2, -height/2, 0, 500);


  xPos = windowWidth+1;
  stroke(255);
  strokeWeight(6);
  fill(70);

  size = windowHeight/5;
  radtodeg = 180/PI;
}


function draw(){
  //background(100);
  background(20 , 160, 255);

  rotationMath();

  var rX = (roll/3 + PI)%TWO_PI;
  var rY = pitch/3;



  push();
    //translate(width/2, height/2);
    translate(-size*1.5,0, 100);
    rotateZ(0);
    rotateX(rX);
    rotateY(rY - perspCorrection);
    texture(img);
    sphere(size);
  pop();

  push();
    //translate(width/2, height/2);
    translate(+size*1.5,0, 100);
    rotateZ(0);
    rotateX(rX);
    rotateY(rY + perspCorrection);
    texture(img);
    sphere(size);
  pop();

  // text("roll: "+ str(round(roll)), windowWidth/2,size);
  // text("pitch: "+str(round(pitch)), windowWidth/2,2*size);
  // text("yaw: "+str(round(yaw)), windowWidth/2,3*size);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  xPos = windowWidth+1;
  size = windowHeight/5;
  radtodeg = 180/PI;
}










function rotationMath(){
  // w0 is the quaternion for the original orientation
  if(frameCount < 5){
   w0 = quaternion(rotationX,rotationY,rotationZ);
  }

  w = quaternion(rotationX,rotationY,rotationZ);

  // we can extract roll, pitch, yaw from the quaternion
  roll  = Math.atan2(2*w[2]*w[0] - 2*w[1]*w[3], 1 - 2*w[2]*w[2] - 2*w[3]*w[3]);
  pitch = Math.atan2(2*w[1]*w[0] - 2*w[2]*w[3], 1 - 2*w[1]*w[1] - 2*w[3]*w[3]);
  yaw   = Math.asin(2*w[1]*w[2] + 2*w[3]*w[0]);

  if (deviceOrientation == "undefined"){
    roll += (mouseY - windowHeight/2)*0.01;
    pitch += -(mouseX-windowWidth/2)*0.01;
  }


  // quaternion values
  // text("Qw: " + str(round(w[0]*100)/100),windowWidth/2,4*size);
  // text("Qx: " + str(round(w[1]*100)/100),windowWidth/2,5*size);
  // text("Qy: " + str(round(w[2]*100)/100),windowWidth/2,6*size);
  // text("Qz: " + str(round(w[3]*100)/100),windowWidth/2,7*size);

  // tells us if the device is turned by 90 degrees
  //deviceTurned(w,w0)
}








function deviceTurned(w,w0){
  var radtodeg = 180/PI;

  // quaternion distance = 1 - <q1,q2>^2 is a measure of difference between orientations
  // Goes between 0 (identical orientations) to 1 (opposite orientations)
  // quaternion angle = arccos(2*<q1,q2>^2 - 1) converts this into an angle
  // this is the angle of rotation needed to get from one orientation to another
  // i.e. the angle between two orientations
  var quatDistance = quaternionDistance(w,w0);
  var quatAngleBetween = radtodeg*quaternionAngleBetween(w,w0);

  // define quaternion orientations for +/- 90 degree rotations in X, Y, Z
  var xcw = quaternion(90,0,0);
  var xccw = quaternion(-90,0,0);
  var ycw = quaternion(0,90,0);
  var yccw = quaternion(0,-90,0);
  var zcw = quaternion(0,0,90);
  var zccw = quaternion(0,0,-90);

  // quaternion distance = (1 - cos(quaternion angle))/2
  // so when the angle is 90 degrees, quaternion distance is 0.5
  if(quatDistance >= 0.5){
    //text("Device TURNED",windowWidth/2,10*size);
    if(quaternionDistance(w,quaternionMultiply(w0,xcw))<0.1){text("X",windowWidth/2,11*size);}
    else if (quaternionDistance(w,quaternionMultiply(w0,xccw))<0.1){text("-X",windowWidth/2,11*size);}
    else if (quaternionDistance(w,quaternionMultiply(w0,ycw))<0.1){text("Y",windowWidth/2,11*size);}
    else if (quaternionDistance(w,quaternionMultiply(w0,yccw))<0.1){text("-Y",windowWidth/2,11*size);}
    else if (quaternionDistance(w,quaternionMultiply(w0,zcw))<0.1){text("Z",windowWidth/2,11*size);}
    else if (quaternionDistance(w,quaternionMultiply(w0,zccw))<0.1){text("-Z",windowWidth/2,11*size);}
  }

}