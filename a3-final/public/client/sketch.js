let agents;
let font;
let mic;
let micLevel;

let socket;
let numbers = [];
let sweet_spot = 500; // lags out on my computer after this

function preload() {
  font = loadFont('public-pixel-font/PublicPixel-0W6DP.ttf')

  socket = io.connect('http://localhost:3000')
  socket.emit('setup', { type: "input" })

  socket.on('files', function(data) {
    //print("received")
    //print(data)
    for (let i = 0; i < data.length; i++) {
      let res = loadStrings('_private/debuglogs/'+data[i]);
      numbers = concat(numbers, res);
    }
  })

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

  // mic level changed
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

  // create Agents
  for (i = 0; i < sweet_spot; i++) {
    let a = new Agent(numbers[i]);
    agents.push(a);
  }


}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  createAgents()
}
