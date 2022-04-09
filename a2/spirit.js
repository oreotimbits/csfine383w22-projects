// ************************************************************** //

// Seed for Perlin Noise function
let seed = 0;

// ************************************************************** //

// Helper functions for the below class

// produces the hue value of the (r, g, b) tuple
function rgbHue(r, g, b) {
    let minim = min(r, g, b);
    let maxim = max(r, g, b);
    let delta = maxim - minim;
    let h;
    if ((maxim == 0) || (delta == 0)) {
        return 0;
    }

    if ( r == maxim ) {
        h = ( g - b ) / delta;         // between yellow & magenta
    } else if( g == maxim ) {
        h = 2 + ( b - r ) / delta;     // between cyan & yellow
    } else {
        h = 4 + ( r - g ) / delta;     // between magenta & cyan
    }
    h = int(h * 60);            // degrees
    if( h < 0 ) { h += 360; }

    return h;
}

// ****************************************** //

// produces the lightness (value) of the (r, g, b) tuple
function rgbValue(r, g, b) {
    return (max(r, g, b) / 255 * 100);
}

// ****************************************** //

// determines if (r, g, b) is black or near-black
function isblack(r, g, b) {
    return (rgbHue(r, g, b) == 0);
}

// ************************************************************** //

class Spirit {

    img;
    height;
    speed;
    gradient;
    moving;
    sensitivity;
    targetHue;
    targetValue;
    textbox;
    model;
    active;

    // ************************************** //

    constructor(img, gradient, textbox, model, speed = 15, height = 1, moving = true) {
        this.img = img;
        this.gradient = gradient;
        this.textbox = textbox;
        this.height = height;
        this.speed = speed;
        this.moving = moving;
        this.model = model;
        this.active = true;
        this.sensitivity = 0.5;
        this.pickColor();
    }

    // ************************************** //

    reset() {
        this.sensitivity = 0.5;
        this.moving = true;
        this.active = true;
        this.pickColor();
    }

    // ************************************** //

    /*
    setOutput() {
        this.textbox.getOutput();
    }
    */

    // ************************************** //

    setInput(inp) {
        //print("spirit setting input")
        this.textbox.setInput(inp);
        //this.textbox.getOutput();
    }

    // ************************************** //

    scoreOutput() {
        let prediction = this.model.predict(this.textbox.output);
        this.sensitivity = prediction.score;
        if (this.sensitivity >= 0.99) { // definitely positive
            print("here")
            this.active = false;
        }
    }

    // ************************************** //

    setSpeed(speed) {
        this.speed = speed;
    }

    // ************************************** //

    updateImage() {
        seed+= 0.5;
        this.img.loadPixels();
        for (let y = 0; y < this.img.height; y++) {
            for (let x = 0; x < this.img.width; x++) {
                let offset = ((y*this.img.width)+x)*4;
                if (!(isblack(this.img.pixels[offset], this.img.pixels[offset+1], 
                    this.img.pixels[offset+2]))) {
                    this.img.set(x, y, color('hsl('+this.targetHue+', '+ int(noise(seed) * 100)
                     + '%, ' + this.targetValue + '%)'))
                }
            }
        } this.img.updatePixels();
    }

    // ************************************** //

    pickColor() {
        let gx = this.gradient.width/2;
        let gy = int(this.gradient.height * this.sensitivity);
        this.gradient.loadPixels();
        let offset = ((gy*this.gradient.width)+gx)*4;
        let colorR = this.gradient.pixels[offset];
        let colorG = this.gradient.pixels[offset+1];
        let colorB = this.gradient.pixels[offset+2]; 
        this.targetHue = rgbHue(colorR, colorG, colorB);
        this.targetValue = rgbValue(colorR, colorG, colorB);
        this.updateImage();
    }

    // ************************************** //

    stopMoving() {
        this.moving = false;
        this.textbox.notifyStopped();
    }

    // ************************************** //

    startMoving() { this.moving = true; }

    // ************************************** //

    moveforward() {
        this.height+= this.speed;
        if (this.height >= (height-20)) {
            this.height = height - 20;
            this.stopMoving();
        } 
    }

    // ************************************** //

    draw() {

        push();

        translate(width/2, height/2);

        if (frameCount % 2 == 0) {
            this.pickColor(); // change the spirit's face colour
        }

        image(this.img, ceil(-this.height/6.25), -this.height/2, ceil(this.height/3.25), this.height);

        pop();

        if (this.moving) {
            this.moveforward();
        } else {
            this.textbox.draw();
            this.scoreOutput();
        }

    }

}

// ************************************************************** //