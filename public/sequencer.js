function Sequencer(opts) {
    var self= this;
    opts= opts||{};
    this.nodes= opts.nodes||[0,0,0,0,0,0,0,0,0,0];
    if(this.nodes.length!=10) { throw("Only 10 nodes are allowed") }
    this.time= opts.time||200; // In milisecs
    if(this.time < 100) { throw("time should be 100 or greater") }

    var snds= ["tac.ogg","beep.ogg"];
    var sound= opts.sound ? new Audio(snds[opts.sound]) : new Audio(snds[0]);

    var stage= 0
    this.interval= function() {
	    if(stage > 9) { stage = 0 }
	    opts.onNode ? opts.onNode(stage, self.nodes[stage]) : null;
	    if(self.nodes[stage++]) { 
	        sound.play() 
	    }
    };
}

Sequencer.prototype.start= function() {
    this.intervalId= setInterval(this.interval, this.time);
};

Sequencer.prototype.stop= function() {
    clearInterval(this.intervalId);
};

function SequencerControl(opts) {
    var self= this;
    opts= opts||{};

    this.el= $(".sequencer.layout").clone();
    var $el= this.el;
    $el.removeClass("layout");
    $("body .sequencer-list").append($el.show());

    opts.onNode= function(node) {
	    $el.find("li.pass").removeClass("pass");
	    var $li= $el.find("li:eq("+node+")");
	    $li.addClass("pass");
    }
    Sequencer.call(this, opts);
    this.reset();

    $el.find("li.node").click(function(e) {
	    $(this).toggleClass("on");
	    var index= $(this).attr("id").split("-")[1];
	    self.nodes[index]= $(this).hasClass("on") ? 1 : 0;
    });
    
    $el.find("button#start").click(function(e) {
        $(this).blur();
        self.start();
        $el.find("li.start").hide();
        $el.find("li.stop").show();
    });

    $el.find("button#stop").click(function(e) {
        $(this).blur();
        self.stop();
        $el.find("li.start").show();
        $el.find("li.stop").hide();
    });
}
SequencerControl.prototype= Sequencer.prototype;

SequencerControl.prototype.reset= function() {
    var $el= this.el;
    $el.find("li.on").removeClass("on");
    for(var i=0; i<this.nodes.length; i++) {
    	var $li= $el.find("li:eq("+i+")");
	    if(this.nodes[i]) {
	        $li.addClass("on");
	    }
    }
};

$(document).ready(function() {
    var seqs= [];
    $("#new").click(function() {
        $(this).blur();
        seqs.push(new SequencerControl());
    });
});