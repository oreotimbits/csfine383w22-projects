// ********************************************************************************************* //
// Background
// Heavily inspired by https://thecodingtrain.com/CodingChallenges/166-ascii-image.html
// ********************************************************************************************* //

class BackGround {

    txt;
    imgs;
    start;
    frames;
    atframe;


    constructor(txt, imgs) {
        this.txt = txt;
        this.imgs = imgs;
        this.start = 0;
        this.frames = 40;
        this.atframe = 0;

    }

    draw() {
        push();

        translate(-width / 2, -height / 2);
        // choose frame to base drawing the text location
        let img = this.imgs[this.atframe]
        let charIndex = this.start;

        // text size -> w (so it increases and decreases with resizing)
        let w = width / img.width;
        let h = height / img.height;
        img.loadPixels();

        // draw as many characters as can fit
        for (let j = 0; j < img.height; j++) {
            for (let i = 0; i < img.width; i++) {
                let pixelIndex = (i + j * img.width) * 4;
                let r = img.pixels[pixelIndex + 0];
                let g = img.pixels[pixelIndex + 1];
                let b = img.pixels[pixelIndex + 2];
                let avg = (r + g + b) / 3;

                noStroke();
                fill(r, g, b, avg);
                textSize(w);
                text(this.txt.charAt(charIndex % this.txt.length), i * w, j * h);
                charIndex++;
            }
        }
        // switch frames 10 times a second
        if (frameCount % 6 == 0) {
            // move forward with the text
            this.start++;
            this.atframe++;
            if (this.atframe == this.frames) {
                this.atframe = 0;
            }
        }
        // newton's 3rd law of p5.js: for every push there is an equal and opposite pop :)
        pop()
    }

}
