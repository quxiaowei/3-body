const deltaT = 0.00001;


class AObject {
    positionX;
    positionY;

    velocityX;
    velocityY;

    color;

    mass;

    constructor(color, { fixed = false, center = false, config } = {}) {
        if (center) {
            this.positionX = config.frameSize.width / 2;
            this.positionY = config.frameSize.height / 2;
        } else {
            this.positionX = Math.random() * config.range.width + (config.frameSize.width - config.range.width) / 2;
            this.positionY = Math.random() * config.range.height + (config.frameSize.height - config.range.height) / 2;
        }

        this.fixed = fixed;
        this.color = color;
        this.stop = false;

        let velocity = Math.random() * config.initvelocityRange;
        let angle = Math.random() * Math.PI * 2;
        this.velocityX = Math.cos(angle) * velocity;
        this.velocityY = Math.sin(angle) * velocity;

        this.mass = Math.random() * (config.initMassRange[1] - config.initMassRange[0]) + config.initMassRange[0];
    }

    move() {
        if (this.stop) {
            return
        }

        if (this.fixed) {
            return
        }
        this.positionX += this.velocityX * deltaT;
        this.positionY += this.velocityY * deltaT;
    }
}


export class Simultor {
    stop;
    config = {};
    bodies = [];
    ended = false;

    default = {
        frameSize: { width: $(window).width() < 600 ? $(window).width() - 28 : 600, height: 400.00 },
        range: { width: 300, height: 300 },
        initvelocityRange: 5.0,
        initMassRange: [50, 50],
        G: 15,
    };

    constructor() {
        this.stop = false;
    };

    start(mode) {
        this.config = _.cloneDeep(this.default);
        this.bodies = [
            new AObject("red", { config: this.config }),
            new AObject("green", { fixed: false, center: true, config: this.config }),
            new AObject("Goldenrod", { config: this.config })];
        this.stop = false;
        this.ended = false;

        if (mode === "figure8") {
            this.figure8();
        } else if (mode === "euler") {
            this.euler_orbit();
        } else if (mode === "lagrange") {
            this.lagrange_orbit();
        } else {
            this.re_speed();
        }

    };

    re_speed() {
        let velocity = [0, 0];
        let position = [0, 0];
        this.bodies.forEach(e => {
            velocity[0] += e.velocityX;
            velocity[1] += e.velocityY;
            position[0] += e.positionX - this.config.frameSize.width / 2;
            position[1] += e.positionY - this.config.frameSize.height / 2;
        });
        let length = this.bodies.length;
        this.bodies.forEach((e, i) => {
            this.bodies[i].velocityX -= velocity[0] / length;
            this.bodies[i].velocityY -= velocity[1] / length;
            this.bodies[i].positionX -= position[0] / length;
            this.bodies[i].positionY -= position[1] / length;
        });
    };

    figure8() {
        let fieldRange = 250;
        let mass = 300;
        let G = 2;
        this.config.G = G;
        this.config.range = { width: fieldRange, height: fieldRange };

        this.bodies[0].mass = this.bodies[1].mass = this.bodies[2].mass = mass;

        this.bodies[0].positionX = this.config.frameSize.width / 2 - fieldRange / 2;
        this.bodies[0].positionY = this.config.frameSize.height / 2;
        this.bodies[1].positionX = this.config.frameSize.width / 2;
        this.bodies[1].positionY = this.config.frameSize.height / 2;
        this.bodies[2].positionX = this.config.frameSize.width / 2 + fieldRange / 2;
        this.bodies[2].positionY = this.config.frameSize.height / 2;

        // important!!
        // best record for (fr: 300, mass:300, G:15) 1.905311503426659,  2.9206385905128274 !!BY GUESS!!
        // docs record for (fr:200, mass:100, G:1 !!BY GUESS!!) vx = 0.3471128135672417 and vy = 0.53272685176767
        //     https://www.maths.ed.ac.uk/~ateckent/vacation_reports/Report_Faustino.pdf
        // v ∝ sqrt(1/r)
        // v ∝ sqrt(mass)
        // v ∝ sqrt(G)
        // vx' = vx / sqrt(300/200) / sqrt(100/300) / sqrt(1/15) => vx' = vx * sqrt(30)
        // reverse-reasoning calculation (fr:300, mass:300, G:15) 
        // vx' = 1.901215179898636  and vy' = 2.917865137018638
        // vx` = 1.9012151798986356 and vy' = 2.9178651370186373

        let velocityX = 1.9012151798986356;
        let velocityY = 2.9178651370186373;

        velocityX = velocityX * Math.sqrt(mass * G / fieldRange / 15); //Math.sqrt(300 / fieldRange) * Math.sqrt(mass / 300) * Math.sqrt(G / 15);
        velocityY = velocityY * Math.sqrt(mass * G / fieldRange / 15); //Math.sqrt(300 / fieldRange) * Math.sqrt(mass / 300) * Math.sqrt(G / 15);

        this.bodies[0].velocityY = velocityY;
        this.bodies[0].velocityX = velocityX;
        this.bodies[1].velocityY = - 2 * velocityY;
        this.bodies[1].velocityX = - 2 * velocityX;
        this.bodies[2].velocityY = velocityY;
        this.bodies[2].velocityX = velocityX;
        console.log(velocityX, velocityY);
    }

    euler_orbit() {
        let fieldRange = 200;
        let mass = 100;
        let G = 5;
        this.config.G = G;
        this.config.range = { width: fieldRange, height: fieldRange };
        this.bodies[0].mass = this.bodies[1].mass = this.bodies[2].mass = mass;

        this.bodies[0].positionX = this.config.frameSize.width / 2 - fieldRange / 2;
        this.bodies[0].positionY = this.config.frameSize.height / 2;
        this.bodies[1].positionX = this.config.frameSize.width / 2;
        this.bodies[1].positionY = this.config.frameSize.height / 2;
        this.bodies[2].positionX = this.config.frameSize.width / 2 + fieldRange / 2;
        this.bodies[2].positionY = this.config.frameSize.height / 2;

        this.bodies[1].fixed = true;
        this.bodies[0].velocityX = 0;
        this.bodies[0].velocityY = Math.sqrt(G * mass * 2.5 / fieldRange);
        this.bodies[2].velocityX = 0;
        this.bodies[2].velocityY = -Math.sqrt(G * mass * 2.5 / fieldRange);
    }

    lagrange_orbit() {
        let fieldRange = 200;
        let mass = 100;
        let G = 5;
        this.config.G = G;
        this.config.range = { width: fieldRange, height: fieldRange };
        this.bodies[0].mass = this.bodies[1].mass = this.bodies[2].mass = mass;

        this.bodies[0].positionX = this.config.frameSize.width / 2 - fieldRange / 2;
        this.bodies[0].positionY = this.config.frameSize.height / 2;
        this.bodies[1].positionX = this.config.frameSize.width / 2 + fieldRange / 4;
        this.bodies[1].positionY = this.config.frameSize.height / 2 - fieldRange * Math.sqrt(3) / 4;
        this.bodies[2].positionX = this.config.frameSize.width / 2 + fieldRange / 4;
        this.bodies[2].positionY = this.config.frameSize.height / 2 + fieldRange * Math.sqrt(3) / 4;

        let velocity = Math.sqrt(G * mass * 2 / fieldRange / Math.sqrt(3));
        this.bodies[0].velocityX = 0;
        this.bodies[0].velocityY = -velocity;
        this.bodies[1].velocityX = velocity * Math.sqrt(3) / 2;
        this.bodies[1].velocityY = velocity / 2;
        this.bodies[2].velocityX = -velocity * Math.sqrt(3) / 2;
        this.bodies[2].velocityY = velocity / 2;
    }

    stop_all() {
        for (let i = 0; i < this.bodies.length; i++) {
            this.bodies[i].stop = true;
        }
        this.stop = true
    }

    end() {
        this.stop_all();
        this.ended = true;
    }

    toggle_pause() {
        if (this.ended) {
            return
        }
        this.stop = this.stop !== true;
        for (let i = 0; i < this.bodies.length; i++) {
            this.bodies[i].stop = this.stop;
        }
    }

    time_frame = function () {
        for (let t = 0; t < 10000; t++) {
            this.bodies.forEach(e => e.move());

            for (let i = 0; i < this.bodies.length - 1; i++) {
                for (let j = i + 1; j < this.bodies.length; j++) {
                    this.react(this.bodies[i], this.bodies[j], this.config.G);
                }
            }
        }
    }

    react = function (a, b) {
        let G = this.config.G;

        let distance = Math.pow((a.positionX - b.positionX), 2)
            + Math.pow((a.positionY - b.positionY), 2)

        let delX = b.positionX - a.positionX;
        let delY = b.positionY - a.positionY;

        if (distance <= 0.01) {
            this.end();
            return;
        }

        let delV_a = G * b.mass / distance * deltaT
        let delV_b = G * a.mass / distance * deltaT

        a.velocityX += delV_a * delX / Math.sqrt(distance)
        a.velocityY += delV_a * delY / Math.sqrt(distance)
        b.velocityX -= delV_b * delX / Math.sqrt(distance)
        b.velocityY -= delV_b * delY / Math.sqrt(distance)
    }
}