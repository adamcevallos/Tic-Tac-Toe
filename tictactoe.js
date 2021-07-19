let cross = '✕';
let circle = 'O';


// add x and o
let space0 = document.getElementById('space0');
space0.textContent = cross;
space0.classList.remove('inactive');
space0.classList.add('x-on');

let space1 = document.getElementById('space1');
space1.textContent = circle;
space1.classList.remove('inactive');
space1.classList.add('o-on');

// remove x and o using restart btn
let restart = document.getElementById('restart-btn');
let animationDuration = 500;
restart.addEventListener('click', () => {
    let space0 = document.getElementById('space0');
    space0.classList.add('x-off');
    space0.classList.remove('x-on');
    setTimeout( function() {space0.textContent = ''}, animationDuration);

    let space1 = document.getElementById('space1');
    space1.classList.add('o-off');
    space1.classList.remove('o-on');
    setTimeout(function () { space1.textContent = '' }, animationDuration);
});

