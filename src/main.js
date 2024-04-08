// import { bodies, timeFrame } from "./test";

let frames = 0

let dark_mode = false;
let color_fore = dark_mode ? "white" : "black";
let color_fore2 = dark_mode ? "rgb(240,240,240)" : "rgb(150,150,150)";
let color_line = dark_mode ? "rgba(70,70,70,0.01)" : "rgba(0,0,0,0.01)";
let color_back = dark_mode ? "rgb(50,50,50)" : "rgb(245,245,245)";
let color_back2 = dark_mode ? "rgba(50,50,50,0.02)" : "rgba(245,245,245,0.02)";
let canvas_size = []
let bg;
let legend_opened = false;

function setup() {
    let width = sim.config.frameSize.width ? sim.config.frameSize.width : 600;
    let height = sim.config.frameSize.height ? sim.config.frameSize.height : 400;

    height += sim.config.frameSize.width < 600? 140 : 100;

    canvas_size = [width, height];

    createCanvas(width, height);
    
    bg = createGraphics(width, height);
    
    bg.background(color_back);
    frameRate(60);
    frames = 0;
    legend_opened = false;

}

function draw() {
    legend();
    if (sim.stop) {
        return;
    }

    legend_opened = false;
    
    frames += 1
    if (frames % 60 === 0) {
        bg.background(color_back2);
    }

    sim.bodies.forEach(e => {
        bg.stroke('white');
        bg.strokeWeight(4);
        bg.point(e.positionX, e.positionY);

        bg.stroke(e.color);
        bg.strokeWeight(4);
        bg.point(e.positionX, e.positionY);

        bg.stroke("black");
        bg.strokeWeight(2);
        bg.point(e.positionX, e.positionY);
    });

    image(bg, 0, 0);

    sim.timeFrame();
}

function grid() {
    const step = 100;
    let width = canvas_size[0];
    let height = canvas_size[0];
    strokeWeight(1)
    stroke(color_line)
    for (let i = step; i < width; i += step) {
        line(i, 0, i, height);
    }
    for (let i = step; i < height; i += step) {
        line(0, i, width, i);
    }
}

function legend() {
    if(!sim.stop){
        legend_opened = false;
        return;
    }

    if(legend_opened){
        return;
    }

    let lo = createGraphics(canvas_size[0], canvas_size[1]);

    lo.strokeWeight(0);
    // lo.fill(color_back)
    // lo.rect(0, 0, canvas_size[0], canvas_size[1]);

    let l_color_back = dark_mode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";

    let xoffset = sim.config.frameSize.width < 600 ? 30 : 310; 
    let yoffset = sim.config.frameSize.width < 600 ? 110 : 20; 

    lo.strokeWeight(0);
    lo.fill(l_color_back)
    lo.rect(0, 0, canvas_size[0], canvas_size[1]);
    
    let y = 20;
    lo.strokeWeight(0);
    lo.fill(color_fore2);

    lo.text(`Mass`, 30, y);
    lo.text(`Velocity`, 80, y);
    lo.text(`Position`, 190, y);
    
    lo.text(`G : ${sim.config.G}`, xoffset, yoffset);
    lo.text(`Frame : ${frames}`, xoffset+50, yoffset);
    lo.text(sim.ended ? `Ended` : `Paused`, xoffset+160, yoffset);

    const round = function (num) {
        return Math.round(num * 100) / 100
    }

    sim.bodies.forEach(e => {
        y += 20;
        lo.strokeWeight(5);
        lo.stroke(e.color);
        lo.point(15 + 5, y - 5);

        lo.strokeWeight(0);
        lo.fill(color_fore2);
        lo.text(e.mass, 30, y);

        lo.text(`( ${round(e.velocityX)}, ${round(e.velocityY)} )`, 80, y);
        lo.text(`( ${round(e.positionX)}, ${round(e.positionY)} )`, 190, y);
    });

    image(lo, 0, 400);

    legend_opened = true;
}

// legend = _.debounce(legend, 100, { 'maxWait': 100 });


/////////////
$(document).ready(function () {
    $("#random").click((e) => {
        setup();
        sim.start();
    });
    $("#figure8").click((e) => {
        setup();
        sim.start("figure8");
    });
    $("#euler").click((e) => {
        setup();
        sim.start("euler");
    });
    $("#lagrange").click((e) => {
        setup();
        sim.start("lagrange");
    });
    $("#toggle_pause").click((e) => {
        sim.toggle_pause();
    });
});