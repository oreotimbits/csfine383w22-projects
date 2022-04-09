// ********************************************************************************************* //
// Main Sketch
// ********************************************************************************************* //


// Global variables

// seconds to midnight (from the Doomsday clock) 1947-2022
let doom_secs = [420, 420, 180, 180, 180, 180, 120, 120, 120, 120, 120, 120, 120, 420, 420,
  420, 720, 720, 720, 720, 720, 420, 600, 600, 600, 720, 720, 540, 540, 540, 540, 540, 540,
  420, 240, 240, 240, 180, 180, 180, 180, 360, 360, 600, 1020, 1020, 1020, 1020, 840, 840, 840,
  540, 540, 540, 540, 420, 420, 420, 420, 420, 300, 300, 300, 360, 360, 300, 300, 300, 180, 180,
  150, 120, 120, 100, 100, 100];

let maxradius;

let goodEarth;
let goodTexture;

let badEarth;
let badTexture;

let earth; // earth = either goodEarth or badEarth

let badmode = true; // default beginning - bad earth
let reduce = true; // default beginning - (bad) earth shrinking

// background
let fireimgs = [];
let floraimgs = [];

// sound
let click;

// ********************************************************************************************* //

// parameters
let p = {
  // toggle filling screen or not
  fillScreen: false,
  auto_forward: false,
  auto_backward: false,

  // year - "speed factor"
  Year: 1947,
  YearMin: 1947,
  YearMax: 2022,

  // optional speed up for videos and crits
  SpeedUp: 100,
  SpeeedUpMin: 1,
  SpeedUpMax: 100,
  SpeedUpStep: 0.25

}

// ********************************************************************************************* //

function preload() {

  // load earth textures
  goodTexture = loadImage("8k_earth_daymap.jpeg"); // thank you nasa
  badTexture = loadImage("burningearth.jpeg"); // thank you zahra for editing nasa's img

  // load fonts and strings for the background
  myFont = loadFont('assets/inconsolata.otf');
  sadSource = loadStrings("badnews.txt");
  happySource = loadStrings("goodnews.txt");

  // load images the background draws strings based off of
  for (let i = 0; i < 40; i++) {
    fireimgs.push(loadImage("fireframes/frame_" + i + ".jpg"))
  }
  for (let i = 0; i < 40; i++) {
    floraimgs.push(loadImage("leaf/frame_" + i + ".jpg"))
  }

  // sound
  click = loadSound("button-7.mp3")
}

function setup() {

  // default settings
  createCanvas(800, 800, WEBGL);
  background(0);
  textFont(myFont);

  maxradius = height / 3;
  sadSource = sadSource.join(' ');
  happySource = happySource.join(' ');

  // add params to a GUI
  createParamGui(p, paramChanged);

  // loaded images for the background are too large for the canvas
  for (let i = 0; i < 40; i++) {
    fireimgs[i].resize(50, 0);
  } for (let i = 0; i < 40; i++) {
    floraimgs[i].resize(50, 0);
  }

  // backgrounds

  sadbg = new BackGround(sadSource, fireimgs);
  happybg = new BackGround(happySource, floraimgs);

  // setup the window and create the agents (earths)
  createAgents()
}

// initial settings 
function createAgents() {
  // setup the canvas
  if (p.fillScreen) {
    resizeCanvas(windowWidth, windowHeight)
  } else {
    resizeCanvas(800, 800)
  }

  // clear the background
  background(0);

  // clear agent list
  goodEarth = new Earth(goodTexture, 1, maxradius);
  badEarth = new Earth(badTexture, maxradius, maxradius);

}

function draw() {

  background(0);
  // draw the year and the seconds to midnight
  if (badmode) {
    sadbg.draw();
  } else {
    happybg.draw();
  }

  // draw the year and the seconds to midnight 
  textSize(28);
  fill(255, 255, 255);
  textAlign(LEFT);
  text(str(p.Year) + " - " + str(doom_secs[p.Year - p.YearMin]) + " seconds to midnight", -width / 2 + 50, -height / 2 + 50);
  textSize(20);

  // draw the mode type, if we're in forward/backward mode
  if (p.auto_backward) {
    text(str("Backward"), width / 2 - 150, height / 2 - 150, 100, 100);
  } if (p.auto_forward) {
    text(str("Forward"), width / 2 - 150, height / 2 - 150, 100, 100);
  }

  if (badmode) {
    earth = badEarth;
  } else {
    earth = goodEarth;
  }
  earth.update(calcinc(), reduce)

  // checking if it's time to switch earths
  if (earth.radius == 1) {
    badmode = !(badmode);
    // reduce := false now, begin increasing radius
    reduce = !(reduce);
    click.play();
  } else if (earth.radius == maxradius) {
    // reduce := true now, begin decreasing radius
    reduce = !(reduce);
  }

  earth.draw();

  // if in forward/backward mode, change year when good earth has radius 1
  if (automode() && earth.radius == 1 && badmode) {
    changeYear();
  }

}

// ********************************************************************************************* //

function keyPressed() {
  // space to reset all agents
  if (key == ' ') {
    createAgents()
  // SHIFT-S saves the current canvas
  } if (key == 'S') {
    save('canvas.png')
  // Forward mode
  } if (key == 'F' || key == 'f') {
    p.auto_forward = true;
    p.auto_backward = false;
  // Backward mode
  } if (key == 'B' || key == 'b') {
    p.auto_backward = true;
    p.auto_forward = false;
  // Clear modes
  } if (key == 'X' || key == 'x') {
    p.auto_forward = false;
    p.auto_backward = false;
  }
}

/* don't want to do anything when window is resized for now 
   (so gui is visible on resizing when not in full screen)
function windowResized() {
  createAgents()
}
*/

// global callback from the settings GUI
function paramChanged(name) {
  if (name == "fillScreen" || name == "auto_forward" || name == "auto_backward") {
    if (p.auto_forward) {
      p.auto_backward = false;
    } if (p.auto_backward) {
      p.auto_forward = false;
    }
    createAgents();
  }
  if (name == "Year") {
    createAgents()
  }
}

// ********************************************************************************************* //

// return value: boolean
// determines if one of forward or backward mode is on
function automode() {
  return (p.auto_forward || p.auto_backward);
}

// calculates the increment to which increase/decrease earth by every second
function calcinc() {
  return maxradius * p.SpeedUp * 2 / (60 * doom_secs[p.Year - p.YearMin]);
}

// changes the year if in auto mode (and changes mode if we're at the end of the cycle)
function changeYear() {
  if (p.auto_forward) {
    p.Year++;
    if (p.Year >= p.YearMax) {
      p.auto_forward = false;
      p.auto_backward = true;
    }
  } if (p.auto_backward) {
    p.Year--;
    if (p.YearMax <= p.YearMin) {
      p.auto_backward = false;
      p.auto_forward = true;
    }
  }
}

  // ********************************************************************************************* //




