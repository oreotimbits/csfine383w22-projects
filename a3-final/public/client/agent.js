let seed = 0;

class Agent {

   x;
   y;
   size;
   n;
   hue;
   shaking;
   

    constructor(n) {
        // random starting position
        this.x = int(random(0, windowWidth))
        this.y = int(random(0, windowHeight))
        this.size = int(noise(this.x, this.y)*36)
        this.n = n;
        this.hue = int(random(0, 360))
        this.shaking = 1;
        
    }

    update(amp) {
        amp = ceil(amp);
        this.shaking = amp;

    }

    draw() {
        //strokeWeight(10);
        fill(this.hue, int(random(0, 100)), int(random(0, 100)))
        textSize(this.size);
        //textFont(font);
        text(this.n, this.x, this.y)
        let p = random(0, 1);
        if (p >= 0.5) {
            this.x += this.shaking;
        } else {this.x -= this.shaking};
        this.hue += 1;
        if (this.hue == 360) {
            this.hue = 0;
        }
    }
}