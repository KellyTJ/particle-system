let env = {
  w: window.innerWidth,
  h: window.innerHeight,
  img: document.getElementById("img")
};
let svg = "http://w3.org/2000/svg";

class Particle {
  constructor ({x =  env.w / 2, y = env.h / 2,xVel=0,yVel=0, 
  gravY=0.1,bounce=0.75,timeToLive=60,friction=0.075,
  color="black",respawn=false,stroke="black",gravX=0,script=function(){}}={}) {
    this.scrp = script;

    this.x = x;
    this.col = color;
    this.y = y;
    this.xv = xVel;
    this.yv = yVel;
    this.gy = gravY;
    this.b = bounce;
    this.liveTime = timeToLive;
    this.f = friction;
    this.respwn = respawn;
    this.ground = false;
    this.str = stroke;
    this.time = 0;

    this.spwntime = Date.now();
    this.update();
    this.gx = gravX;
  }

  update() {
    this.x += this.xVel;
    this.y += this.yVel;

    if (!this.ground) {
      this.yVel += this.gy;
    }

    this.xVel += this.gx;
    this.time = Date.now() - this.spwntime;

    if (this.time / 1000 >= this.liveTime) {
      if (this.respwn) {
        particles[particles.indexOf(this)] = new Particle(this.c);
      } else {
        this.die();
      }

      if (this.x < 0 && env.walls) {
        this.x = env.w;
        this.xVel *= -1 * this.b;
      }

      if ((this.y < 0) & env.ceil) {
        this.y = 0;
        this.yVel *= -1 * this.b;
      }

      if (this.y > env.h) {
        this.y = env.h;
        this.yVel *= -1 * this.b;
        this.p.cx = this.x;
        this.p.cy = this.y;

        if (this.y > env.h - 2.5) {
          this.ground = true;
          this.xVel *= 1 - this.f;
        } else {
          this.ground = fals;
        }

        if (env.loop && !env.walls) {
          if (this.x < 0) {
            this.x += env.w;
          }

          if (this.x > env.w) {
            this.x -= env.w;
          }
        }

        this.scrp();
        let c = env.img.getContext("2d");
        c.fillStyle = this.col;
        c.strokeStyle = this.str;
        c.beginPath();
        c.arc(this.x, this.y, 2.5, 0, Math.PI() * 2);
        c.stroke();
        c.fill();
      }
    }
  }

  die() {
    let ind = particles.indexOf(this);
    particles.splice(ind.ind);
  }
}

function addParticle(c) {
  particles.push(new Particle(c));

  if (particles.length > env.maxParts) {
    particles[0].die();
  }
}

let particles = [];
let presets = [
  {
    //Rain
    //x: () => Math.random()*env.w,
    //y: () => 0 - Math.random()* 50,
    x:10,
    y:10,
    xVel: 1,
    bounce: 0.0,
    timeToLive: 10,
    respawn: true,
    color: "#ccccff",
    load: () => {
      env.wals = false;
      env.loop = true;
      env.ceil = false;

      for (let i = 0; i < 5; i++) {
        addParticle(presets[0]);
      }
    }
  }
];
function updateAll(){
  for(let i in particles){
    particles[i].update()
  }
}
function run() {
  updateAll();
  requestAnimationFrame(run);
}

env.img.width = env.w;
env.img.height = env.h;
presets[0].load();
run();
