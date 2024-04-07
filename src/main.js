// import { bodies, timeFrame } from "./test";

let frames = 0

let dark_mode = false;
let color_fore = dark_mode ? "white" : "black";
let color_fore2 = dark_mode ? "rgb(240,240,240)" : "rgb(150,150,150)";
let color_line = dark_mode ? "rgba(70,70,70,0.01)" : "rgba(0,0,0,0.01)";
let color_back = dark_mode ? "rgb(50,50,50)" : "rgb(245,245,245)";
let color_back2 = dark_mode ? "rgb(50,50,50,0.02)" : "rgba(245,245,245,0.02)";
let canvas_size = []

function setup() {
    let width = sim.config.frameSize.width ? sim.config.frameSize.width : 600;
    let height = sim.config.frameSize.height ? sim.config.frameSize.height : 400;

    height += sim.config.frameSize.width < 600? 140 : 100;

    canvas_size = [width, height];

    createCanvas(width, height);
    background(color_back);
    frameRate(60);
    frames = 0
}

function draw() {
    legend();
    if (sim.stop) {
        return;
    }

    frames += 1
    if (frames % 60 === 0) {
        background(color_back2);
        // grid()
    }

    sim.bodies.forEach(e => {
        stroke('white');
        strokeWeight(4);
        point(e.positionX, e.positionY);

        stroke(e.color);
        strokeWeight(4);
        point(e.positionX, e.positionY);

        stroke("black");
        strokeWeight(2);
        point(e.positionX, e.positionY);
    });

    sim.timeFrame();
    // legend();
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
    strokeWeight(0);
    fill(color_back);
    rect(0, 400, 310, 100)

    let xoffset = sim.config.frameSize.width < 600 ? 30 : 310; 
    let yoffset = sim.config.frameSize.width < 600 ? 520 : 420; 

    fill(color_back)
    rect(xoffset, yoffset-20, 80, 22)
    rect(xoffset+50, yoffset-20, 100, 22)
    rect(xoffset+160, yoffset-20, 50, 22)
    
    if (!sim.stop) {
        return;
    }

    let y = 400;
    strokeWeight(0);
    fill(color_fore2);

    y += 20;
    text(`Mass`, 30, y);
    text(`Velocity`, 80, y);
    text(`Position`, 190, y);

    
    strokeWeight(0);
    fill(color_fore2);
    text(`G : ${sim.config.G}`, xoffset, yoffset);
 
    fill(color_fore2);
    text(`Frame : ${frames}`, xoffset+50, yoffset);

    if (sim.stop) {
        strokeWeight(0);
        fill(color_fore2);
        text(sim.ended ? `Ended` : `Paused`, xoffset+160, yoffset);
    }

    const round = function (num) {
        return Math.round(num * 100) / 100
    }

    sim.bodies.forEach(e => {
        y += 20;
        strokeWeight(5);
        stroke(e.color);
        point(15 + 5, y - 5);

        strokeWeight(0);
        fill(color_fore2);
        text(e.mass, 30, y);

        text(`( ${round(e.velocityX)}, ${round(e.velocityY)} )`, 80, y);
        text(`( ${round(e.positionX)}, ${round(e.positionY)} )`, 190, y);

    });

}

legend = _.debounce(legend, 100, { 'maxWait': 100 });


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