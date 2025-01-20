//adds an edit button to all activities if you are a course editor
//which skips having to toggle the edit switch and having to drop down the 3 dot menu
window.addEventListener('DOMContentLoaded', function() {
    let key = getAdminKey();
    if (key !== null) {
        addEditButtons(key);
    }
});
function getAdminKey() {
    let keyHolder = document.querySelector('[name="sesskey"]');
    if (keyHolder) {
        console.log('found admin edit button', keyHolder.value);
        return keyHolder.value;
    }
    return null;
}
function addEditButtons(key) {
    let activities = document.querySelectorAll('li.activity');
    for (let activity of activities) {
        let activityId = activity.getAttribute('data-id')
        let editUrl = 'htt' + 'ps://moodle.uni-weimar.de/course/mod.php?sesskey=' + key + '&sr=0&update=' + activityId
        console.log(editUrl);
        let row = activity.querySelector('.flex-column');
        createEditButton(row, editUrl);
    }
}
function createEditButton(parent, editUrl) {
    let box = document.createElement('div');
    box.className = 'col custom-right-flex';

    let anchor = document.createElement('a');
    anchor.href = editUrl;
    anchor.setAttribute('role', 'button');

    let icon = document.createElement('i');
    icon.className = 'material-symbols-outlined icon-sized';
    icon.textContent = 'settings';

    anchor.appendChild(icon);
    box.appendChild(anchor);
    parent.appendChild(box);
}