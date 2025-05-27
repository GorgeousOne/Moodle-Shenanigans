//can be found in href of the database activity link on the course page
let dbActivityId = '495866'
//can be found in the <form> connected to the "add entry" submit button on the database activity page
//also with the HTML Search if you look for "?d=" I think
//could automate this, too lazy
let dbID = '1676'

let sesskey = getUserSessionKey();
let canvas;
let ctx;

let isMousePressed = false;
let lastX = 0;
let lastY = 0;

let lineWidth = 4;
let paint = "black";
const smooth = 0.3;
let svgPath = "";

setupCanvas();
loadPaths();

function getUserSessionKey() {
	const logoutLink = document.querySelector('.usermenu a[href*="logout"]');
	const url = new URL(logoutLink.href);
	return url.searchParams.get('sesskey');
}

function isAdmin() {
	return document.querySelector('.editmode-switch-form') !== null;
}

function setupCanvas() {
	listElem = document.querySelector(`li.activity[data-id="${dbActivityId}"]`);
	// Create container for color bar and canvas
	const container = document.createElement('div');
	container.style.display = 'flex';
	container.style.alignItems = 'center';

	// Create color selection bar
	const colorBar = document.createElement('div');
	colorBar.style.display = 'flex';
	colorBar.style.flexDirection = 'column';
	colorBar.style.marginRight = '10px';

	// Define colors
	const colors = ['#FF4500', '#FFA800', '#FED534', '#7DED56', '#00A267', '#50E8F3', '#3690EA', '#2450A4', '#801D9F', '#FF99AA', '#FFFFFF', '#000000'];

	// Create color buttons
	colors.forEach(color => {
		let colorBtn = document.createElement('div');
		colorBtn.style.width = '25px';
		colorBtn.style.height = '25px';
		colorBtn.style.backgroundColor = color;
		colorBtn.style.margin = '5px';
		colorBtn.style.cursor = 'pointer';
		colorBtn.style.border = '1px solid #ccc';
		colorBtn.style.borderRadius = '50%';

		colorBtn.addEventListener('click', () => {
			paint = color;
		});

		colorBar.appendChild(colorBtn);
	});

	// Create canvas
	canvas = document.createElement('canvas');
	canvas.width = 650;
	canvas.height = 500;
	canvas.style.border = '1px solid black';
	ctx = canvas.getContext('2d');
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	canvas.addEventListener("mousedown", startDrawing);
	canvas.addEventListener("mousemove", drawLine);
	canvas.addEventListener("mouseup", stopDrawing);

	const sliderBar = document.createElement('div');
	sliderBar.style.display = 'flex';
	sliderBar.style.flexDirection = 'column';
	sliderBar.style.alignItems = 'center';
	sliderBar.style.marginLeft = '10px';

	// Create a fixed-size wrapper for the preview dot
	const previewWrapper = document.createElement('div');
	previewWrapper.style.width = '40px'; // Fixed size
	previewWrapper.style.height = '40px'; // Fixed size
	previewWrapper.style.display = 'flex';
	previewWrapper.style.justifyContent = 'center';
	previewWrapper.style.alignItems = 'center';
	previewWrapper.style.marginBottom = '10px';

	// Create preview dot
	const preview = document.createElement('div');
	preview.style.width = `${lineWidth}px`;
	preview.style.height = `${lineWidth}px`;
	preview.style.borderRadius = '50%';
	preview.style.backgroundColor = 'black';
	preview.style.marginBottom = '10px';
	preview.style.transition = 'width 0.1s, height 0.1s';

	// Create input slider
	const sizeSlider = document.createElement('input');
	sizeSlider.type = 'range';
	sizeSlider.min = 1;
	sizeSlider.max = 30;
	sizeSlider.value = 5;
	sizeSlider.style.writingMode = 'vertical-lr'; // Vertical slider
	sizeSlider.style.appearance = 'slider-vertical';
	sizeSlider.style.direction = 'rtl';
	sizeSlider.style.appearance = 'slider-vertical';
	sizeSlider.style.height = '150px';
	sizeSlider.style.cursor = 'pointer';

	// Append elements
	container.appendChild(colorBar);
	container.appendChild(canvas);
	previewWrapper.appendChild(preview);
	sliderBar.appendChild(previewWrapper);
	sliderBar.appendChild(sizeSlider);
	container.appendChild(sliderBar);
	listElem.parentNode.insertBefore(container, listElem.nextElementSibling);

	// Update line width dynamically
	sizeSlider.addEventListener('input', () => {
		lineWidth = sizeSlider.value;
		preview.style.width = `${lineWidth}px`;
		preview.style.height = `${lineWidth}px`;
	});
	container.insertAdjacentHTML("afterend", "<p>This is a collabrative drawing board. Everyone in the course can see the drawings. Please be respectful and don't draw anything inappropriate.</p>");
	if (!isAdmin()) listElem.remove();
}

function loadPaths() {
	console.log("loading paths");

	fetch("htt" + `ps://moodle.uni-weimar.de/mod/data/view.php?d=${dbID}&perpage=1000`)
		.then(response => response.text()) // Convert response to text (HTML)
		.then(html => {
			const paths = listPaths(html);
			paths.forEach(path => {
				const path2d = deserializePath(path);
				if (path2d) {
					svgPath = path2d.d;
					paint = path2d.strokeColor;
					lineWidth = path2d.strokeWidth;
					draw();
				}
			});
			svgPath = "";
			paint = "black";
			lineWidth = 5;
		})
		.catch(error => console.error('Error fetching the page:', error));
}

function listPaths(htmlText) {
	const parser = new DOMParser();
	const doc = parser.parseFromString(htmlText, 'text/html');
	const keys = doc.querySelectorAll('.defaulttemplate-list-body .row div');

	// filter each div that has "Path" as innerHtml and get the next sibling (get value to key)
	const values = Array.from(keys).filter(key => key.innerHTML === "Path")
		.map(key => key.nextElementSibling.innerHTML);

	return values;
}

function deserializePath(text) {
	try {
		const parts = text.split(';');
		return {
			strokeColor: parts[0].split(':')[1],
			strokeWidth: parts[1].split(':')[1],
			d: parts[2].split(':')[1]
		}
	} catch (error) {
		console.error('Error deserializing path:', error);
		return null;
	}
}

function saveDbEntry(text) {
	let formData = new FormData();
	formData.append('d', dbID);
	formData.append('rid', '0');
	formData.append('sesskey', sesskey);
	formData.append('field_5241', text);
	formData.append('tags', '');
	console.log("lets save", dbID, sesskey);
	fetch('/mod/data/edit.php', {
			method: 'POST',
			body: formData
		})
		.then(response => console.log(response))
		.catch(error => console.error('Error:', error));
}


// ------------------------------

function startDrawing(event) {
	isMousePressed = true;
	lastX = event.offsetX;
	lastY = event.offsetY;
	svgPath += `M${lastX},${lastY}`;
}

function drawLine(event) {
	if (!isMousePressed) return;
	canvas.style.cursor = "crosshair";
	let mouseX = event.offsetX;
	let mouseY = event.offsetY;

	let x = Math.round(lastX + smooth * (mouseX - lastX));
	let y = Math.round(lastY + smooth * (mouseY - lastY));

	draw();
	svgPath += `l${x-lastX},${y-lastY}`;
	lastX = x;
	lastY = y;
}

function stopDrawing(event) {
	isMousePressed = false;
	canvas.style.cursor = "default";
	let mouseX = event.offsetX;
	let mouseY = event.offsetY;
	svgPath += `l${mouseX - lastX},${mouseY - lastY}`;
	draw();
	console.log(svgPath);
	saveDbEntry(`strokeColor:${paint};strokeWidth:${lineWidth};d:${svgPath}`);
	svgPath = "";
}

function draw() {
	ctx.strokeStyle = paint;
	ctx.lineWidth = lineWidth;
	ctx.lineCap = "round";
	ctx.lineJoin = "round";
	ctx.stroke(new Path2D(svgPath));
}