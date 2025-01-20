const main = document.getElementById('topofscroll');
const hat = document.getElementById('santa-hat');
let style = document.createElement('style');

style.textContent = `
#santa-hat {
    position: absolute;
    transform: translate(-45%, -45%)  rotate(-15deg);
    width: 250px;
    z-index:1;
    pointer-events: none;
}
`;
document.head.appendChild(style);
main.insertBefore(hat, main.firstChild);


const content = document.getElementById('page-content');
const twigs = document.getElementById('twigs');
style = document.createElement('style');
style.textContent = `
#twigs {
    position: absolute;
    width: 150px;
    right: 100px;
    bottom: -100px;
    z-index:1;
    pointer-events: none;
}
`;
document.head.appendChild(style);
content.insertBefore(twigs, content.lastChild);