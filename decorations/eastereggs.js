

function addStyle(styleString) {
    const style = document.createElement('style');
    style.textContent = styleString;
    document.head.append(style);
}

document.body.style.fontFamily = 'Comic Sans MS, sans-serif';
const bar = document.querySelector('[role=\'menubar\']');
const item = document.createElement('li');
item.setAttribute('data-key', '');
item.setAttribute('class', 'nav-item');
item.setAttribute('role', 'none');
item.setAttribute('data-forceintomoremenu', 'false');
item.innerHTML = `<a role='menuitem' class='nav-link' href='https://eelslap.com/' tabindex='-1'>🐟</a>`;
bar.appendChild(item);

const button = document.createElement('button');
button.textContent = 'DO A BARREL ROLL!';
button.style.width = '10rem';
document.getElementById('page').appendChild(button);

button.addEventListener('click', () => {
    document.body.style.animation = 'none';
    document.body.offsetWidth;
    document.body.style.animation = '';
    addStyle(`
@-webkit-keyframes roll {
    from { -webkit-transform: rotate(0deg); }
    to   { -webkit-transform: rotate(360deg); }
}
@-moz-keyframes roll {
    from { -moz-transform: rotate(0deg); }
    to   { -moz-transform: rotate(360deg); }
}
@keyframes roll {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
}
body {
    -moz-animation-name: roll;
    -moz-animation-duration: 4s;
    -moz-animation-iteration-count: 1;
    -webkit-animation-name: roll;
    -webkit-animation-duration: 4s;
    -webkit-animation-iteration-count: 1;
    animation-name: roll;
    animation-duration: 4s;
    animation-iteration-count: 1;
}`);
});