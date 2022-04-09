// ************************************************************** //

class Background {

    pixelation; // integer
    vid; // video
    corner; // angle of rounded rectangle corner
    increasecorner; // boolean

    // ************************************** //

    constructor(v) {
        this.pixelation = 25; // default - gets slow if smaller
        this.vid = v;
        this.vid.loadPixels();
        this.corner = 0;
        this.increasecorner = true;

    }

    // ************************************** //

    pause() { this.vid.pause(); }

    // ************************************** //

    unpause() { this.vid.play(); }

    // ************************************** //

    draw() {

        background(0);
        this.vid.loadPixels();
        // pixelate the video 
        for (let y = 0; y < height; y += this.pixelation) {
            for (let x = 0; x < width; x += this.pixelation) {
                let offset = ((y*width)+x)*4;
                fill(this.vid.pixels[offset], this.vid.pixels[offset+1], 
                    this.vid.pixels[offset+2])//, this.vid.pixels[offset+3]);
                rect(x, y, this.pixelation, this.pixelation, max(this.corner, 0)); 
            }
        // change the corner angle at every call (transforms square to circle and back)
        } if (this.corner >= this.pixelation) {
            this.increasecorner = false;
        } else if (this.corner <= 0) {
            this.increasecorner = true;
        } if (this.increasecorner) { this.corner++; } 
        else { this.corner--; }

    }
    
}

// ************************************************************** //