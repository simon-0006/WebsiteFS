const config = {
  // fraction of window height
  bodyClipPathHeightFraction: 0.6,
  headClipPathHeight: 64,
};

const elems = {
  main: document.querySelector("main"),
  targets: document.querySelectorAll(".target"),
};

const ids = {
  gradient: "myGradient",
  bottomStraightLine: "bottomStraightLine",
  topStraightLine: "topStraightLine",
  curveLine: "curveLine",
  topStraightLineHead: "topStraightLineHead",
  clipPathBody: "clipPathBody",
  clipPathBodyRect: "clipPathBodyRect",
  clipPathHead: "clipPathHead",
  clipPathHeadRect: "clipPathHeadRect",
};

let headClipStartY;

function setY(elem, y) {
  elem.setAttribute("y", y);
}

function moveBodyRect(scrollY) {
  setY(elems.clipPathBodyRect, scrollY);
}

function moveHeadRect(scrollY) {
  const newY = headClipStartY + scrollY;

  setY(elems.clipPathHeadRect, newY);
}

function rAFThrottle(callback) {
  let requestID;

  return function (...args) {
    const context = this;

    cancelAnimationFrame(requestID);

    requestID = requestAnimationFrame(() => {
      callback.call(context, ...args);
    });
  };
}

function getCurveCoords(x, y, isLeft) {
  if (isLeft) {
    return `
          L ${x} ${y - 120}
          c 0 60 -60 60 -60 120
          c 0 60 60 60 60 120
      `;
  }

  return `
          L ${x} ${y - 120}
          c 0 60 60 60 60 120
          c 0 60 -60 60 -60 120
      `;
}

function createCurveLine(x, height, targetsData) {
  const path = `
      <path
          id="${ids.curveLine}"
          d="
              M ${x} 0 
              ${targetsData
                .map(({ y, isLeft }) => getCurveCoords(x, y, isLeft))
                .join(" ")}
              L ${x} ${height}
          "
          vector-effect="non-scaling-stroke"
          clip-path="url(#${ids.clipPathBody})"
          stroke="url(#${ids.gradient})"
      />
      `;

  elems.svg.insertAdjacentHTML("beforeend", path);
}

function createStraightLine(x, height, id, clipPathId) {
  const line = `
      <line
          id="${id}"
          x1="${x}"
          y1="0"
          x2="${x}"
          y2="${height}"
          vector-effect="non-scaling-stroke"
          ${clipPathId ? `clip-path="url(#${clipPathId})"` : ``}
      />
    `;

  elems.svg.insertAdjacentHTML("beforeend", line);
}

function getTargetData(svgLeft) {
  return Array.from(elems.targets).map((target) => {
    const { left, height, top } = target.getBoundingClientRect();

    return { y: top + window.scrollY + height / 2, isLeft: left < svgLeft };
  });
}

// Everything outside this shape will be clipped (invisible)
function createClipPathBody(width, height) {
  const clipPath = `
      <clipPath id="${ids.clipPathBody}">
        <rect id="${ids.clipPathBodyRect}" x="0" y="0" width="${width}" height="${height}" />
      </clipPath>
    `;

  elems.defs.insertAdjacentHTML("beforeend", clipPath);
  elems.clipPathBodyRect = document.querySelector(`#${ids.clipPathBodyRect}`);
}

function createClipPathHead(width, height) {
  const clipPath = `
      <clipPath id="${ids.clipPathHead}">
        <rect id="${ids.clipPathHeadRect}" x="0" y="${headClipStartY}" width="${width}" height="${height}" />
      </clipPath>
    `;

  elems.defs.insertAdjacentHTML("beforeend", clipPath);
  elems.clipPathHeadRect = document.querySelector(`#${ids.clipPathHeadRect}`);
}

function createGradient() {
  const gradient = `
      <linearGradient
        id="${ids.gradient}"
        x1="0"
        y1="0"
        x2="1"
        y2="0"
      >
        <stop offset="0%"   stop-color="#c380f7" />
        <stop offset="50%"  stop-color="#6caef7" />
        <stop offset="100%" stop-color="#c380f7" />
      </linearGradient>
    `;

  elems.defs.insertAdjacentHTML("beforeend", gradient);
}

function createSvg() {
  const svg = `
      <svg>
        <defs></defs>
      </svg>
    `;

  elems.main.insertAdjacentHTML("beforeend", svg);
  elems.svg = document.querySelector(`svg`);
  elems.defs = document.querySelector(`defs`);
}

function onScroll() {
  const scrollY = +window.scrollY;
  moveBodyRect(scrollY);
  moveHeadRect(scrollY);
}

const onScrollThrottled = rAFThrottle(onScroll);

function onResize() {
  window.removeEventListener("scroll", onScrollThrottled);
  elems.svg.remove();

  init();
}

function init() {
  createSvg();
  createGradient();

  const { bodyClipPathHeightFraction, headClipPathHeight } = config;
  const bodyClipPathHeight = window.innerHeight * bodyClipPathHeightFraction;
  headClipStartY = bodyClipPathHeight - 24;
  const { left, width, height } = elems.svg.getBoundingClientRect();
  const x = width / 2;
  const targetsData = getTargetData(left);

  createStraightLine(x, height, ids.bottomStraightLine);
  createStraightLine(x, height, ids.topStraightLine, ids.clipPathBody);
  createCurveLine(x, height, targetsData);
  createStraightLine(x, height, ids.topStraightLineHead, ids.clipPathHead);
  createClipPathBody(width, bodyClipPathHeight);
  createClipPathHead(width, headClipPathHeight);

  window.addEventListener("scroll", onScrollThrottled);
  window.addEventListener("resize", onResize);
}

init();

// here comes the magic cursor

class PointerParticle {
  constructor(spread, speed, component) {
    const { ctx, pointer, hue } = component;

    this.ctx = ctx;
    this.x = pointer.x;
    this.y = pointer.y;
    this.mx = pointer.mx * 0.1;
    this.my = pointer.my * 0.1;
    this.size = Math.random() + 1;
    this.decay = 0.01;
    this.speed = speed * 0.08;
    this.spread = spread * this.speed;
    this.spreadX = (Math.random() - 0.5) * this.spread - this.mx;
    this.spreadY = (Math.random() - 0.5) * this.spread - this.my;
    this.color = `hsl(${hue}, 90%, 60%)`;
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.ctx.fill();
  }

  collapse() {
    this.size -= this.decay;
  }

  trail() {
    this.x += this.spreadX * this.size;
    this.y += this.spreadY * this.size;
  }

  update() {
    this.draw();
    this.trail();
    this.collapse();
  }
}

class PointerParticles extends HTMLElement {
  static register(tag = "pointer-particles") {
    if ("customElements" in window) {
      customElements.define(tag, this);
    }
  }

  static css = `
        :host {
          display: grid;
          width: 100%;
          height: 100%;
          user-select: none;
        }
      `;

  constructor() {
    super();

    this.canvas;
    this.ctx;
    this.fps = 35;
    this.msPerFrame = 1000 / this.fps;
    this.timePrevious;
    this.particles = [];
    this.pointer = {
      x: 0,
      y: 0,
      mx: 0,
      my: 0,
    };
    this.hue = 0;
  }

  connectedCallback() {
    const canvas = document.createElement("canvas");
    const sheet = new CSSStyleSheet();

    this.shadowroot = this.attachShadow({ mode: "open" });

    sheet.replaceSync(PointerParticles.css);
    this.shadowroot.adoptedStyleSheets = [sheet];

    this.shadowroot.append(canvas);

    this.canvas = this.shadowroot.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.setCanvasDimensions();
    this.setupEvents();
    this.timePrevious = performance.now();
    this.animateParticles();
  }

  createParticles(event, { count, speed, spread }) {
    this.setPointerValues(event);

    for (let i = 0; i < count; i++) {
      this.particles.push(new PointerParticle(spread, speed, this));
    }
  }

  setPointerValues(event) {
    this.pointer.x = event.x - this.offsetLeft;
    this.pointer.y = event.y - this.offsetTop;
    this.pointer.mx = event.movementX;
    this.pointer.my = event.movementY;
  }

  setupEvents() {
    const parent = this.parentNode;

    parent.addEventListener("click", (event) => {
      this.createParticles(event, {
        count: 1000,
        speed: Math.random() + 1,
        spread: Math.random() + 50,
      });
    });

    parent.addEventListener("pointermove", (event) => {
      this.createParticles(event, {
        count: 30,
        speed: this.getSpeed(event),
        spread: 1,
      });
    });

    window.addEventListener("resize", () => this.setCanvasDimensions());
  }

  getSpeed(event) {
    const a = event.movementX;
    const b = event.movementY;
    const c = Math.floor(Math.sqrt(a * a + b * b));

    return c;
  }

  handleParticles() {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update();

      if (this.particles[i].size <= 0.1) {
        this.particles.splice(i, 1);
        i--;
      }
    }
  }

  setCanvasDimensions() {
    const rect = this.parentNode.getBoundingClientRect();

    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  animateParticles() {
    requestAnimationFrame(() => this.animateParticles());

    const timeNow = performance.now();
    const timePassed = timeNow - this.timePrevious;

    if (timePassed < this.msPerFrame) return;

    const excessTime = timePassed % this.msPerFrame;

    this.timePrevious = timeNow - excessTime;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.hue = this.hue > 360 ? 0 : (this.hue += 3);

    this.handleParticles();
  }
}

PointerParticles.register();
