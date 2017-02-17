var theta, theta_prev;
var w, w0;

var roll = 0;
var pitch = 0;
var yaw = 0;
var radtodeg;


var img;
var perspCorrection = 0.3;

var cnvs;
var ctracker;
var faceX, faceY = 0;
var lastRollCorrection, lastPitchCorrection = 0;


function setup(){

  var videoInput = createCapture();
  videoInput.size(200, 200);
  videoInput.position(0, 0);
  //videoInput.hide();

  cnvs = createCanvas(windowWidth, windowHeight, WEBGL);
  img = loadImage("assets/iris.jpg");

  ctracker = new clm.tracker();
  ctracker.init(pModel);
  ctracker.start(videoInput.elt);

  stroke(255);
  strokeWeight(6);
  fill(70);

  if(windowHeight < windowWidth){
    size = windowHeight/5;
  } else {
    size = windowWidth/5;
  }
  radtodeg = 180/PI;
}


function draw(){
  clear();
  background(100);

  rotationMath();


  var positions = ctracker.getCurrentPosition();
  if(positions.length > 0){
      fill(255,0,0);
      // draw ellipse at each position point
      //ellipse(200-positions[33][0],  positions[33][1]-windowHeight/2, 6, 6);

      faceX = 200-positions[33][0];
      faceY = positions[33][1];

      print(faceY);

      roll += (faceY - 100)*0.01;
      pitch += -(faceX-100)*0.01;
  }

  var rX = (roll/3 + PI + 0.5)%TWO_PI;
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









function rotationMath(){
  // w0 is the quaternion for the original orientation
  if(frameCount < 2){
   w0 = quaternion(rotationX,rotationY,rotationZ);
  }

  w = quaternion(rotationX,rotationY,rotationZ);

  // we can extract roll, pitch, yaw from the quaternion
  roll  = Math.atan2(2*w[2]*w[0] - 2*w[1]*w[3], 1 - 2*w[2]*w[2] - 2*w[3]*w[3]);
  pitch = Math.atan2(2*w[1]*w[0] - 2*w[2]*w[3], 1 - 2*w[1]*w[1] - 2*w[3]*w[3]);
  yaw   = Math.asin(2*w[1]*w[2] + 2*w[3]*w[0]);
  roll  -= HALF_PI;

  // if (deviceOrientation == "undefined"){
  //   roll += (mouseY - windowHeight/2)*0.01;
  //   pitch += -(mouseX-windowWidth/2)*0.01;
  // }

  // tells us if the device is turned by 90 degrees
  // deviceTurned(w,w0)
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
    // if(quaternionDistance(w,quaternionMultiply(w0,xcw))<0.1){text("X",windowWidth/2,11*size);}
    // else if (quaternionDistance(w,quaternionMultiply(w0,xccw))<0.1){text("-X",windowWidth/2,11*size);}
    // else if (quaternionDistance(w,quaternionMultiply(w0,ycw))<0.1){text("Y",windowWidth/2,11*size);}
    // else if (quaternionDistance(w,quaternionMultiply(w0,yccw))<0.1){text("-Y",windowWidth/2,11*size);}
    // else if (quaternionDistance(w,quaternionMultiply(w0,zcw))<0.1){text("Z",windowWidth/2,11*size);}
    // else if (quaternionDistance(w,quaternionMultiply(w0,zccw))<0.1){text("-Z",windowWidth/2,11*size);}
  }

}