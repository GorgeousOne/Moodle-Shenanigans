document.getElementById('trigger').addEventListener('click', () => {
	document.querySelectorAll('.lid').forEach(lid => {
		lid.classList.add('lid-open')
	});
})

function getCenter(element) {
	const rect = element.getBoundingClientRect();
	const centerX = rect.left + rect.width / 2;
	const centerY = rect.top + rect.height / 2;
	return { x: centerX, y: centerY };
}

let maxIrisMove = 7;
let distZ = 500;

eyes = document.querySelectorAll('.eye')

document.addEventListener('mousemove', (event) => {
	eyes.forEach(eye => {
		const iris = eye.querySelector('.iris');
		const highlight = eye.querySelector('.highlight');
		const center = getCenter(iris);

		const deltaX = event.clientX - center.x;
		const deltaY = event.clientY - center.y;
		const distXY = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

		const yaw = Math.atan2(deltaY, deltaX);
		const pitch = Math.atan2(distZ, distXY);

		let irisX = Math.cos(yaw) * Math.cos(pitch) * maxIrisMove;
		let irisY = Math.sin(yaw) * Math.cos(pitch) * maxIrisMove;
		iris.style.transform = `translate(${irisX}px, ${irisY}px)`;
		highlight.style.transform = `translate(${irisX/2}px, ${irisY/2}px)`;
	});
});