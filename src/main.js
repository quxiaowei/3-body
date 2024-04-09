// import { bodies, timeFrame } from "./test";

let frames = 0

let dark_mode = false;
let color_fore = dark_mode ? "white" : "black";
let color_fore2 = dark_mode ? "rgb(240,240,240)" : "rgb(150,150,150)";
let color_back = dark_mode ? "rgb(50,50,50)" : "rgb(245,245,245)";
let color_back2 = dark_mode ? "rgba(50,50,50,0.02)" : "rgba(245,245,245,0.02)";
let canvas_size = []
let bg;

function setup() {
    let width = sim.config.frameSize.width ? sim.config.frameSize.width : 600;
    let height = sim.config.frameSize.height ? sim.config.frameSize.height : 400;

    canvas_size = [width, height];

    createCanvas(width, height);

    bg && bg.remove();
    bg = createGraphics(width, height);
    bg.background(color_back);

    frameRate(60);
    frames = 0;
    if (legend) {
        legend.isOpen = false;
    }
}

function draw() {
    if (sim.stop) {
        if (!legend.isOpen) {
            image(legend(), 0, canvas_size[1] - (canvas_size[0] < 600 ? 130 : 100));
            legend.isOpen = true;
        }
        return;
    }

    legend.isOpen = false;

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

    sim.time_frame();
}

function grid() {
    let color_line = dark_mode ? "rgba(70,70,70,0.01)" : "rgba(0,0,0,0.01)";
    const step = 100;
    let width = canvas_size[0];
    let height = canvas_size[1];
    strokeWeight(1)
    stroke(color_line)
    for (let i = step; i < width; i += step) {
        line(i, 0, i, height);
    }
    for (let i = step; i < height; i += step) {
        line(0, i, width, i);
    }
}

function legend () {
    legend.buf && legend.buf.remove && legend.buf.remove();
    legend.buf = createGraphics(width, height);

    let lo = legend.buf;
    lo.strokeWeight(0);
    lo.textStyle(BOLDITALIC);

    let l_color_back = dark_mode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

    let xoffset = sim.config.frameSize.width < 600 ? 30 : 310;
    let yoffset = sim.config.frameSize.width < 600 ? 110 : 20;

    lo.strokeWeight(0);
    lo.fill(l_color_back)
    lo.rect(0, 0, canvas_size[0], canvas_size[1]);

    let y = 20;
    lo.strokeWeight(0);
    lo.fill("white");

    lo.text(`Mass`, 30, y);
    lo.text(`Velocity`, 80, y);
    lo.text(`Position`, 190, y);

    lo.text(`G : ${sim.config.G}`, xoffset, yoffset);
    lo.text(`Frame : ${frames}`, xoffset + 50, yoffset);
    lo.text(sim.ended ? `Ended` : `Paused`, xoffset + 160, yoffset);

    const round = function (num) {
        return Math.round(num * 100) / 100
    }

    sim.bodies.forEach(e => {
        y += 20;
        lo.strokeWeight(5);
        lo.stroke(e.color);
        lo.point(15 + 5, y - 5);

        lo.strokeWeight(0);
        lo.stroke("white");
        lo.fill("white");
        lo.text(e.mass, 30, y);

        lo.text(`( ${round(e.velocityX)}, ${round(e.velocityY)} )`, 80, y);
        lo.text(`( ${round(e.positionX)}, ${round(e.positionY)} )`, 190, y);
    });

    return lo;
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