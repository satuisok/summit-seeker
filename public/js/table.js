const button = document.querySelector('#route-button');
const table = document.querySelector('#route-table');

button.addEventListener('click', () => {
    table.classList.toggle('hidden');
    // toggle button inner text
    if (button.innerText === 'Hide Routes') {
        button.innerText = 'Show Availble Routes';
    }
    else {
        button.innerText = 'Hide Routes';
    }

});