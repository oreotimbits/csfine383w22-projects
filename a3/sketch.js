let agents;
let font;
let mic;
let micLevel;

function preload() {
  font = loadFont('public-pixel-font/PublicPixel-0W6DP.ttf')
}

function setup() {
  colorMode('HSL')
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.mousePressed(userStartAudio);
  background(0);
  textFont(font);
  mic = new p5.AudioIn();
  mic.start();


  createAgents()
}

function draw() {
  background(0);

  if (micLevel != mic.getLevel()) {
    micLevel = mic.getLevel();
  // update all the agents
    for (a of agents) {
      a.update(1/micLevel); // 0 < miclevel <= 1 so miclevel >= 1.
    }
  }

  // draw all the agents
  for (a of agents) {
    a.draw();
  }
}

// create the grid of agents, one agent per grid location
function createAgents() {

  // clear the background
  background(0);  

  // clear agent list
  agents = [];
  for (j = 0; j < 50; j++) {

  // create Agents
  for (i = 0; i < 100; i++) {
    let a = new Agent(i);
    agents.push(a);
  }
}
/*
  for (x = 100; x < width - 100; x += 5)
  for (y = 100; y < height - 100; y += 5) {
    let a = new Agent(x, y);
    agents.push(a);
  }
  */

}

function keyPressed() {
  // space to reset all agents
  if (key == ' ') {
    createAgents();
  }
  // SHIFT-S saves the current canvas
  if (key == 'S') {
    save('canvas.png')
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  createAgents()
}
