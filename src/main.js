// import { bodies, timeFrame } from "./test";

let frames = 0

let dark_mode = false;
let color_fore = dark_mode ? "white" : "black";
let color_line = dark_mode ? "rgba(70, 70, 70, 0.01)" : "rgba(0, 0, 0, 0.01)";
let color_back = dark_mode ? "rgb(50,50,50)" : "rgb(245,245,245)";
let color_back2 = dark_mode ? "rgb(50,50,50,0.01)" : "rgba(245,245,245,0.01)";

function setup() {
    let width = sim.config.frameSize.width ? sim.config.frameSize.width : 600;
    let height = sim.config.frameSize.height ? sim.config.frameSize.height : 500;
    createCanvas(width, height);
    background(color_back);
    frameRate(60);
    frames = 0
}

function draw() {
    if (sim.stop) {
        legend();
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
    legend();
}

function grid() {
    const step = 100;
    let width = sim.config.frameSize.width ? sim.config.frameSize.width : 600;
    let height = sim.config.frameSize.height ? sim.config.frameSize.height : 500;
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
    rect(15, 8, 100, 150)

    let y = 8;
    strokeWeight(0);
    fill(color_fore);

    y += 20;
    text(`FRAME : ${frames}`, 15, y);

    y += 20;
    text(`MASS : `, 15, y);

    sim.bodies.forEach(e => {
        y += 20;
        strokeWeight(5);
        stroke(e.color);
        point(15 + 5, y - 5);
        strokeWeight(0);
        fill(color_fore);
        text(e.mass, 30, y);
    });

    strokeWeight(0);
    fill(color_fore);

    y += 20;
    text(`G : ${sim.config.G}`, 15, y);

    y += 20;
    if (sim.stop) {
        strokeWeight(0);
        fill(color_fore);
        text(sim.ended ? `END` : `PAUSED`, 15, y);
    }
}


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
    $("#toggle_pause").click((e) => {
        sim.toggle_pause();
    });
});