document.addEventListener("DOMContentLoaded", (event) => {
    stylePage();
    playSnake();
});
class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(vec) {
        return new Vec2(this.x + vec.x, this.y + vec.y);
    }
    sub(vec) {
        return new Vec2(this.x - vec.x, this.y - vec.y);
    }
    scale(scalar) {
        return new Vec2(this.x * scalar, this.y * scalar);
    }
    rot90() {
        return new Vec2(-this.y, this.x);
    }
    wrap(maxX, maxY) {
        return new Vec2((this.x + maxX) % maxX, (this.y + maxY) % maxY);
    }
}
const wrapCoord = (value, max) => (value + max) % max;
const lerp = (a, b, t) => a + t * (b - a);
const dirs = [
    new Vec2(1, 0),
    new Vec2(0, 1),
    new Vec2(-1, 0),
    new Vec2(0, -1),
];
class Snake {
    constructor(startX, startY, startDir, paint, bgPaint) {
        const start = new Vec2(startX, startY);
        this.pos = start.sub(dirs[startDir]);
        this.newPos = start;
        this.dir = startDir;
        this.newDir = startDir;

        this.p1 = new Vec2(0, 0);
        this.p2 = new Vec2(0, 0);
        this.pivot = new Vec2(0, 0);
        this.phi1 = this.phi2 = 0;
        this.stripes = 7;
        this.stroke = tile / this.stripes;
        this.paint1 = paint;
        this.paint2 = bgPaint;
        this.turn(0);
    }
    turn(dDir) {
        this.pos = this.newPos.wrap(maxX, maxY);
        this.dir = this.newDir;
        this.newDir = (this.newDir + dDir + 4) % 4;

        const dirVec = dirs[this.newDir];
        this.newPos = this.newPos.add(dirVec);

        if (dDir === 0) {
            this.p1 = dirVec.scale(-0.5).add(new Vec2(0.5, 0.5)).scale(tile);
            this.p2 = dirVec.scale(0.5).add(new Vec2(0.5, 0.5)).scale(tile);
        } else {
            this.pivot = new Vec2(-0.5, dDir * 0.5);
            this.phi1 = dDir === -1 ? Math.PI / 2 : (3 * Math.PI) / 2;
            this.phi2 = dDir === -1 ? 0 : 2 * Math.PI;

            for (let i = 0; i < this.dir; i++) {
                this.pivot = this.pivot.rot90();
                this.phi1 += Math.PI / 2;
                this.phi2 += Math.PI / 2;
            }
            this.pivot = this.pivot.add(new Vec2(0.5, 0.5)).scale(tile);
        }
    }
    display(time, ctx) {
        ctx.save();
        ctx.translate(this.pos.x * tile, this.pos.y * tile);
        ctx.lineCap = "butt";

        for (let i = 0; i < this.stripes; i++) {
            ctx.lineWidth = this.stroke * (this.stripes - i - 0.5);
            ctx.strokeStyle = i % 2 === 0 ? this.paint1 : this.paint2;

            ctx.beginPath();
            if (this.dir === this.newDir) {
                const progress = this.p1.add(this.p2.sub(this.p1).scale(time));
                ctx.moveTo(this.p1.x, this.p1.y);
                ctx.lineTo(progress.x, progress.y);
            } else {
                const [start, end] = this.phi1 < this.phi2 ? [this.phi1, lerp(this.phi1, this.phi2, time)] : [lerp(this.phi1, this.phi2, time), this.phi1];
                ctx.arc(this.pivot.x, this.pivot.y, tile / 2, start, end);
            }
            ctx.stroke();
        }
        ctx.restore();
    }
}
tile = 100;

function playSnake() {
    const page = document.getElementById('page');
    const content = document.getElementById('topofscroll');
    content.style.zIndex = 2;

    const footer = document.getElementById('page-footer');
    footer.style.zIndex = 2;

    const container = document.createElement('div');
    container.style.position = 'relative';
    container.style.marginLeft = '-3rem';

    w = page.clientWidth;
    h = page.clientHeight;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = w;
    canvas.height = h;
    canvas.style.position = 'fixed';
    canvas.style.pointerEvents = 'none';

    page.insertBefore(container, page.firstChild);
    container.appendChild(canvas);

    const buffer = document.createElement('canvas');
    const bufferCtx = buffer.getContext('2d');
    buffer.width = w;
    buffer.height = h;

    maxX = Math.ceil(w / tile);
    maxY = Math.ceil(h / tile);

    const rndInt = (low, high) => Math.floor(Math.random() * (high - low)) + low;

    snakes = []
    snakes.push(new Snake(0, rndInt(1, maxY - 1), 0, '#E3E3E3', '#EDEDED'));
    snakes.push(new Snake(0, rndInt(1, maxY - 1), 0, '#D5D5D5', '#EDEDED'));
    snakes.push(new Snake(maxX - 1, rndInt(1, maxY - 1), 2, '#C7C7C7', '#EDEDED'));
    let counter = 0;
    let speed = 0.008;
    let lastDraw = 0;
    let fps = 30;

    function draw(time) {
        if (time - lastDraw > fps) {
            counter += speed;
            ctx.clearRect(0, 0, w, h);
            ctx.drawImage(buffer, 0, 0);
            for (snake of snakes) {
                snake.display(counter, ctx);
            }
            if (counter > 1) {
                bufferCtx.clearRect(0, 0, w, h);
                bufferCtx.drawImage(canvas, 0, 0)
                counter -= 1;
                for (snake of snakes) {
                    snake.turn(rndInt(-1, 2));
                }
            }
            lastDraw = time;
        }
        requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
};

function addStyle(styleString) {
    const style = document.createElement('style');
    style.textContent = styleString;
    document.head.append(style);
}

function stylePage() {
    const top = document.getElementById('topofscroll');
    top.style.backgroundColor = 'rgba(255, 255, 255, .5)';
    top.style.backdropFilter = 'blur(5px)';
    document.getElementById('region-main').style.background = 'none';

    addStyle(`
.yui3-tabview-panel.clear-back {
background-color: transparent !important;
background: none;
}
.yui3-tab-panel-selected {
background-color: transparent !important;
}
`);
    //wait for main page content elements to load
    setTimeout(() => {
        document.querySelectorAll('.yui3-tabview-panel').forEach(e => {
            e.classList.add('clear-back');
        });
    }, 1500);
}