// import { bodies, timeFrame } from "./test";

let frames = 0

let dark_mode = false;
let color_fore = dark_mode ? "white" : "black";
let color_fore2 = dark_mode ? "rgb(240,240,240)" : "rgb(180,180,180)";
let color_line = dark_mode ? "rgba(70, 70, 70, 0.01)" : "rgba(0, 0, 0, 0.01)";
let color_back = dark_mode ? "rgb(50,50,50)" : "rgb(245,245,245)";
let color_back2 = dark_mode ? "rgb(50,50,50,0.01)" : "rgba(245,245,245,0.01)";

function setup() {
    let width = sim.config.frameSize.width ? sim.config.frameSize.width : 600;
    let height = sim.config.frameSize.height ? sim.config.frameSize.height : 400;
    height += 150;
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
    rect(15, 408, 600, 150)

    if (!sim.stop) {
        return;
    }

    let y = 400;
    strokeWeight(0);
    fill(color_fore2);

    y += 20;
    text(`MASS  `, 30, y);
    text(`Velocity  `, 80, y);
    text(`Position  `, 190, y);

    strokeWeight(0);
    fill(color_fore2);
    text(`G : ${sim.config.G}`, 310, y);

    text(`FRAME : ${frames}`, 390, y);

    if (sim.stop) {
        strokeWeight(0);
        fill(color_fore2);
        text(sim.ended ? `END` : `PAUSED`, 490, y);
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

        // if (sim.stop) {
        text(`( ${round(e.velocityX)}, ${round(e.velocityY)} )`, 80, y);
        // }

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
    $("#toggle_pause").click((e) => {
        sim.toggle_pause();
    });
});