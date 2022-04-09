// ************************************************************** //

// Global Constants

const NUM_SPIRITS = 10;

// ****************************************** //

// Global variables and objects

let pixelFont; 
let vid; // for background
let speech; // for read-aloud
let speechRec; // voice recognition
let model; // ml5 sentiment prediction model
let bg;

let time = 0; 
let interim = 0;

let vibes;
let keysounds = [];
let gradient;
let noface; // sprit image
let spirits = []; // array of spirit objects
let on_spirit = 0;
let API_KEY = '';

let draw_spirit = true;

function loaded() {print("model ready")}
function loadedSound() { 
  //vibes.play()
}

// ************************************************************** //


function windowResized() {
  resizeCanvas(width, height);
}

// ****************************************** //

function gotInput() {
  print("got input")
  if (speechRec.resultValue) {
    spirits[on_spirit].setInput(speechRec.resultString);
  } //print("input is: "+speechRec.resultString)
}

// ****************************************** //

function createSpirits() {
  for (let i = 0; i < NUM_SPIRITS; i++) {
    textbox = new TextBox(speech, API_KEY);
    spirit = new Spirit(noface, gradient, textbox, model, int(random(10, 20)));
    spirits.push(spirit);
  } //vibes.play();

}

// ************************************************************** //

function preload() {

  loadJSON("_private/auth.json", auth => {
    API_KEY = auth.API_KEY
  });

  vibes = loadSound("media/forever.mp3", loadedSound);

  pixelFont = loadFont('assets/PublicPixel.ttf');
  vid = createVideo("media/tunnelslow.mp4");
  model = ml5.sentiment('movieReviews', loaded);

  noface = loadImage("media/pixelatedface.png")
  gradient = loadImage("media/gradient.png")

}

// ****************************************** //

function setup() {
  //colorMode(HSL);
  frameRate(5);
  //createCanvas(windowWidth, windowHeight)
  createCanvas(800, 600);

  vid.size(width, height);
  gradient.resize(300, 0);
  noface.resize(0, 700);
  vid.volume(0);
  vid.loop();
  vid.hide();

  // set colour for your frame
  select('body').style('background: #000000;')
  textFont(pixelFont);

  speech = new p5.Speech()
  speechRec = new p5.SpeechRec('en-US', gotInput)
  speechRec.start(true, false);
  bg = new Background(vid);

  //textbox = new TextBox("");
  //spirit = new Spirit(noface, gradient, textbox, 15);

  vibes.setVolume(0.1);
  vibes.setLoop(true);

  createSpirits()
  
}

// ****************************************** //

function draw() {
  ///background(240)
  bg.draw()
  if ((draw_spirit) && (millis() >= (time + interim*1000))) {
    spirits[on_spirit].draw();
    if (!(spirits[on_spirit].moving)) {
      bg.pause();
     }
  }

  // check if i need to update the spirit
  if (!(spirits[on_spirit].active)) { // time to update
    spirits[on_spirit].reset();
    on_spirit++;
    time = millis();
    interim = int(random(2, 12));
    if (on_spirit == NUM_SPIRITS) { on_spirit == 0; } // loop to the start
    bg.unpause();
  }

}

// ************************************************************** //
