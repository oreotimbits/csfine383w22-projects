// ************************************************************** //

let lag = false;
let spoken = false;
let t;
let url = "http://www.cleverbot.com/getreply?key=";
let ret;

// ************************************************************** //


function equivalent(a, b) {
    let punctuationlessa = a.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    let finala = punctuationlessa.replace(/\s{2,}/g," ");
    let punctuationlessb = b.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    let finalb = punctuationlessb.replace(/\s{2,}/g," ");
    return(finala == finalb);
}

// ************************************************************** //

class TextBox {

    voice;
    output;
    input;
    displaying;
    speech;
    speechRec;
    fadelevel;
    cs;
    url;

    // ************************************** //

    constructor(speech, API_KEY) {
        this.speech = speech;
        //this.speechRec = new p5.SpeechRec('en-US', this.setInput)
        this.output = "hello";
        this.input = " ";
        this.displaying = false;
        this.fadelevel = 0;
        this.url = "http://www.cleverbot.com/getreply?key="+API_KEY; 
    }

    // ************************************** //

    setInput(s) {
        let str = s;
        //if (this.speechRec.resultValue) {
            //let s = this.speechRec.resultString;
            if (!(equivalent(s.toLowerCase(),this.output.toLowerCase()))) {
                //print("on set input")
                //print(this.input)
                //print(str);
                this.input = str;
                this.getOutput();
            }
          //} 
        //print("on set input")
        //print(s);
        //this.getOutput();
    }

    // ************************************** //

    getOutput() {
        let url = this.url;
        if (this.cs) {
            url = this.url+"&input="+this.input+"&cs="+this.cs
        }
        loadJSON(url, function(response) { print("on api ");
            ret = response; });
        //this.chatjson = ret;
        if (ret) {
            this.output = ret.output;
            this.cs = ret.cs;
            spoken = false;
        }

    }

    // ************************************** //

    notifyStopped() {

        this.displaying = true;
        this.speech.setVoice(int(random(10)));
        lag = true;
        t = millis();

        //this.speechRec.start(true, false);

    }

    // ************************************** //

    draw() {

        push();

        stroke(255);
        strokeWeight(10);
        fill(0);
        rect(width/16, (5*height/8), (7*width/8), height/4);

        if (this.displaying && (!(lag)) ) {

            translate(width/16, (5*height/8));
            noStroke();
            textSize(16);
            fill("#ffd700");
            if (!(spoken)) {
                this.speech.speak(this.output);
                spoken = true;
            } text(this.output, 10, 10, (7*width/8)-10, height/8-10);
            fill(240);
            //print("printing input: "+this.input)
            text(this.input, 10, height/8, (7*width/8)-10, height/8-10);
        } else if (this.displaying && lag) {

            if ((millis() - t) >= 1000) {
                lag = false;
            }
        }

        pop();

    }

}

// ************************************************************** //