// ********************************************************************************************* //
// Earth
// ********************************************************************************************* //

let angle = 0;

class Earth {

  txtr; // texture map on sphere
  radius; // current radius
  maxrad; // maximum radius


  constructor(txtr, r, maxr) {
    this.txtr = txtr;
    this.radius = r;
    this.maxrad = maxr;
  }

  // increase or decrease radius by inc (determined by flag reduce)
  update(inc, reduce) {
    if (reduce) {
      this.reduceRadius(inc);
    } else {
      this.increaseRadius(inc);
    }

  }

  // reduces radius by n (until it reaches 1)
  reduceRadius(n) {
    if (this.radius - n >= 1) {
      this.radius -= n;
    } else {
      this.radius = 1;
    }
  }

  // increases radius by n (up to a maximum value)
  increaseRadius(n) {
    if (this.radius + n <= this.maxrad) {
      this.radius += n;
    } else {
      this.radius = this.maxrad;
    }
  }

  draw() {
    // if you use stroke there's a mesh on the sphere
    noStroke(); 
    texture(this.txtr);
    rotateY(angle);
    angle += 0.01; // this increment looked smooth 
    sphere(this.radius);
  }
}