console.log("hello")
const orbHolder = document.getElementById('orb-holder');
const orb = document.getElementById('orb');
console.log(orb)

function waitForElm(selector) {
	return new Promise(resolve => {
		if (document.querySelector(selector)) {
			return resolve(document.querySelector(selector));
		}
		const observer = new MutationObserver(mutations => {
			if (document.querySelector(selector)) {
				observer.disconnect();
				resolve(document.querySelector(selector));
			}
		});
		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
	});
}

function parseDateDE(text) {
	const match = text.match(/(\d{1,2})\. (\w+) (\d{4}), (\d{1,2}:\d{2})/);
	day = parseInt(match[1])
	month = match[2]
	year = parseInt(match[3])
	time = match[4]

	const monthMap = {
		Januar: 0,
		Februar: 1,
		März: 2,
		April: 3,
		Mai: 4,
		Juni: 5,
		Juli: 6,
		August: 7,
		September: 8,
		Oktober: 9,
		November: 10,
		Dezember: 11
	};
	const [hours, minutes] = time.split(':').map(Number);
	return new Date(year, monthMap[month], day, hours, minutes);
}

waitForElm('td.overdue, td.timeremaining, tr.lastrow td.lastcol').then((cell) => {
	const container = document.createElement('div');
	container.id = 'orb-container'
	container.appendChild(orb);
	container.appendChild(orbHolder);
	cell.appendChild(container);

	const dates = document.querySelector('.activity-dates .description-inner');
	const openedText = dates.querySelector('div:nth-child(1)').textContent;
	const dueText = dates.querySelector('div:nth-child(2)').textContent;

	const openedDate = parseDateDE(openedText)
	const dueDate = parseDateDE(dueText)

	const now = new Date();
	orbHolder.style.display = '';
	orb.style.display = '';

	console.log(openedDate)
	console.log(dueDate)

	const totalTime = dueDate - openedDate;
	const timeElapsed = now - openedDate;
	const timeRemainingPercent = Math.max(0, Math.min(1, (timeElapsed / totalTime)));
	const pixels = Math.ceil(timeRemainingPercent * 67);
	console.log(pixels);
	const style = document.createElement('style');
	style.textContent = `
#orb-container{
position: relative;
width: 100px;
height: 67px;
}
#orb-holder {
position: absolute;
width: 100%;
height: 100%;
image-rendering: pixelated;
}
#orb{
position: absolute;
bottom: 0px;
width: 100%;
image-rendering: pixelated;
clip: rect(${pixels}px, 100px, 67px, 0);
}
td.overdue, td.timeremaining, tr.lastrow td.lastcol {
display: flex;
align-items: center;
justify-content: space-between;
}`;
	document.head.appendChild(style);
});