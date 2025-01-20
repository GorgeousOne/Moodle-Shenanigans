let mouseX = 0;
let mouseY = 0;
console.log("hello");

document.addEventListener('mousemove', (event) => {
	mouseX = event.clientX;
	mouseY = event.clientY;
});
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
const shadeImg = document.getElementById('border');
const starImg = document.getElementById('starbg');

function fillPattern(img, X, Y, W, H, iW, iH, offX, offY) {
	if (offX < 0) {
		offX = offX - Math.floor(offX / iW) * iW;
	}
	if (offX > 0) {
		offX = (offX % iW) - iW;
	}
	if (offY < 0) {
		offY = offY - Math.floor(offY / iH) * iH;
	}
	if (offY > 0) {
		offY = (offY % iH) - iH;
	}
	for (var y = offY; y < H; y += iH) {
		for (var x = offX; x < W; x += iW) {
			ctx.drawImage(img, X + x, Y + y, iW, iH);
		}
	}
}

function drawStars() {
	let x = (mouseX + w / 2) / 16;
	let y = (mouseY + h / 2) / 16;
	let time = Date.now() / 10.0;
	let parallax = 1.2;

	ctx.globalAlpha = 1;
	//100% + 5% cos oscillating zoom over time
	let s = 1 * (1 + Math.cos(time * 0.0027) * 0.05);
	fillPattern(
		starImg,
		0, 0,
		w, h,
		1024 * s, 1024 * s,
		w / 2 + x * 0.25 * s,
		h / 2 + y * 0.25 * s);
	//50% + 30% sine oscillating opacity over time
	ctx.globalAlpha = 0.5 * (0.5 + Math.sin(time * 0.02) * 0.3);

	//100% + 7% sine-offset oscillating zoom over time
	s = 2 * (1 + Math.sin(time * 0.002) * 0.07);
	fillPattern(
		starImg,
		0, 0,
		w, h,
		1024 * s, 1024 * s,
		w / 2 + parallax * x * 0.25 * s,
		h / 2 + parallax * y * 0.25 * s);

	ctx.globalAlpha = 1;
	ctx.drawImage(shadeImg, 0, 0, w, h);
}

let lastDraw = 0;
const fps = 1000.0 / 30;

function animate(time) {
	if (time - lastDraw >= fps) {
		drawStars();
		lastDraw = time;
	}
	requestAnimationFrame(animate);
}
starImg.onload = function() {
	console.log(starImg.complete);
	console.log(starImg);
	animate();
}
//-------------------------------
const imgs = {
	border: document.getElementById("border"),
	noise: document.getElementById("darkNoise"),
	frame: document.getElementById("frameBorder"),
	featherLeft: document.getElementById("featherLeft"),
	featherRight: document.getElementById("featherRight")
};

	const style = document.createElement('style');

	style.textContent = `
@keyframes rainbowCycle {
	0% {color: #ff1d87;}
	16% {color: #a071ff;}
	33% {color: #40b9ff;}
	50% {color: #15ff57;}
	66% {color: #ffed29;}
	83% {color: #ff5f2e;}
	100% {color: #ff1d87;}
}

/* noble font */
body {
	font-family: Georgia, 'Times New Roman', Times, serif;
	font-variant: small-caps;
	color: #fff;
}

.material-symbols-outlined {
font-variant: normal;
filter: invert();
}

/* humble navigation bar */
.navbar.fixed-top {
	background-color: #000 !important;
	background-image: url(${imgs.border.src}), url(${imgs.noise.src});
	background-size: 100% 100%, auto;
	box-shadow: inset 0 0 7px rgba(255, 255, 255, 0.2);
	border: 0;
}

.navbar-brand {
	color: white !important;
}

/* prevent white flickering before images load */
#page {
	background-color: #000;
}

/* dignified main area */
#topofscroll {
	background-color: #000 !important;
	border: 3px solid transparent;
	border-image: url(${imgs.frame.src}) 3 round;
	border-radius: 2px;
	background-image: url(${imgs.border.src}), url(${imgs.noise.src});
	background-size: 100% 100%, auto;
}

#region-main {
	background-color: transparent !important;
}
.activity-header {
	background-color:transparent !important;
}


/* many illegal things to center title */
.assessment { display: none; }
.w-100 .d-flex { display: block !important; }
.mr-auto { margin-right: 0 !important; }
.page-context-header { justify-content: center; }

.navicon-seperator {
	filter: invert();
}

/* striking title */
.h2 {
	color: #ece2b6;
	text-shadow: 0px 1px 0px #733726, 0px 2px 0px #875626, 0px 2px 1px #000, 0px 2px 3px #000;
}

/* fancy ornaments */
.h2:before {
	background: url(${imgs.featherLeft.src}) no-repeat;
	left: -39px;
}
.h2:after {
	background: url(${imgs.featherRight.src}) no-repeat;
	right: -39px;
}
.h2:before, .h2:after {
	content: '';
	display: block;
	width: 39px;
	height: 23px;
	position: absolute;
	top: 8px;
}

/* arcane submission button */
div[role="main"] .btn-primary {
	background: linear-gradient(to bottom, transparent 0%, currentColor 500%);
	padding: 8px 16px;
	animation: rainbowCycle 5s infinite ease-in-out;
	box-shadow: 0px 0px 0px 1px #000, 0px 0px 1px 2px currentcolor !important;
	background: linear-gradient(to bottom, transparent 0%, currentColor 500%);
	border-color: #ece2b6 #875526 #733726 #dfbc9a;
	border-radius: 0;
	font-family: Georgia, 'Times New Roman', Times, serif;
	font-variant: small-caps;
}
div[role=main] .row {
	justify-content: center;
}


.generaltable {
	color: white;
	font-family: Georgia, 'Times New Roman', Times, serif;
	font-variant: small-caps;
}

.generaltable tbody tr:hover {
	color: white;
}

.custom-select {
	background-color: #181A1B !important;
}`;


document.head.appendChild(style);