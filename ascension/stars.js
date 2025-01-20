const page = document.getElementById('page');
const content = document.getElementById('topofscroll');
content.style.zIndex = 2;

const container = document.createElement('div');
container.id = 'backdrop'
container.style.position = 'relative';
container.style.marginLeft = '-3rem';

w = page.clientWidth;
h = page.clientHeight;

const canvas = document.createElement('canvas');
canvas.id = 'stars';
canvas.width = w;
canvas.height = h;
canvas.style.pointerEvents = 'none';
canvas.style.position = 'fixed';

page.insertBefore(container, page.firstChild);
container.appendChild(canvas);

const ctx = canvas.getContext('2d');

let mouseX = w / 2;
let mouseY = h / 2;

document.addEventListener('mousemove', (event) => {
	mouseX = event.clientX;
	mouseY = event.clientY;
});

const vignetteImg = new Image();
const starsImg = new Image();

vignetteImg.src = 'img/shadedBordersSoft.png';
starsImg.src = 'img/starbg.jpg';

starsImg.onload = function () {
	animate();
}

CanvasRenderingContext2D.prototype.fillPattern = function (img, X, Y, W, H, iW, iH, offX, offY) {
	var offX = offX || 0;
	var offY = offY || 0;
	if (offX < 0) { offX = offX - Math.floor(offX / iW) * iW; } if (offX > 0) { offX = (offX % iW) - iW; }
	if (offY < 0) { offY = offY - Math.floor(offY / iH) * iH; } if (offY > 0) { offY = (offY % iH) - iH; }
	for (var y = offY; y < H; y += iH) { for (var x = offX; x < W; x += iW) { this.drawImage(img, X + x, Y + y, iW, iH); } }
}

function animate() {
	drawStars();
	requestAnimationFrame(animate);
}

function drawStars() {
	let x = mouseX / 16;
	let y = mouseY / 16;

	let time = Date.now() / 50.0;
	let parallax = 1.2;

	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, w, h);

	ctx.globalAlpha = 0.5;
	//100% + 5% cos oscillating zoom over time
	let s = 1 * (1 + Math.cos(time * 0.0027) * 0.05);
	ctx.fillPattern(
		starsImg,
		0, 0,
		w, h,
		1024 * s, 1024 * s,
		x * 0.25 * s,
		y * 0.25 * s);

	//50% + 30% sine oscillating opacity over time
	ctx.globalAlpha = 0.5 * (0.5 + Math.sin(time * 0.02) * 0.3);

	//100% + 7% sine-offset oscillating zoom over time
	s = 2 * (1 + Math.sin(time * 0.002) * 0.07);
	ctx.fillPattern(
		starsImg,
		0, 0,
		w, h,
		1024 * s, 1024 * s,
		parallax * x * 0.25 * s,
		parallax * y * 0.25 * s);
	
	ctx.globalAlpha = 1;
	ctx.drawImage(vignetteImg, 0, 0, w, h);
}