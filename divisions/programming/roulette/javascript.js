

const spinButton = document.getElementById('spin-button');
const currentNumberDisplay = document.getElementById('current-number-display');
const spinHistory = {
    one: document.getElementById('spin-1'),
    two: document.getElementById('spin-2'),
    three: document.getElementById('spin-3'),
    four: document.getElementById('spin-4'),
    five: document.getElementById('spin-5'),
    six: document.getElementById('spin-6'),
    seven: document.getElementById('spin-7'),
    eight: document.getElementById('spin-8'),
    nine: document.getElementById('spin-9'),
    ten: document.getElementById('spin-10')
};
const rouletteWheelSound = new Audio('sounds/Roulette_Wheel_1.mp3');
const volumeSlider = document.getElementById('volume-slider');

volumeSlider.addEventListener('input', function() {
    rouletteWheelSound.volume = this.value;
});


let etherealNumber = 0;
let timeDelay = 10;
let spinRunning = false;


spinButton.addEventListener('click', (e) => {

    if (spinRunning == false) {
        spinRunning = true;
        etherealNumber = 0;
        timeDelay = 80;
        currentNumberDisplay.textContent = '';
        currentNumberDisplay.style.backgroundColor = 'rgb(30,90,1)';
        rouletteWheelSound.pause();
        rouletteWheelSound.currentTime = 0;
        rouletteWheelSound.play();
        setTimeout(spin_the_wheel, 100);
    } else {
        alert('Let it finish')
    }
    
});

let currentSpin = 0;

function spin_the_wheel() {
    currentSpin = Math.floor(Math.random()*37);
    currentNumberDisplay.textContent = currentSpin;
    if (currentSpin == 0) {
        currentNumberDisplay.style.backgroundColor = 'green';
    } else if (currentSpin % 2 != 0){
        currentNumberDisplay.style.backgroundColor = 'darkred';
    } else {
        currentNumberDisplay.style.backgroundColor = 'black';
    }
    if (etherealNumber < 15) {
        setTimeout(spin_the_wheel, timeDelay);
        etherealNumber++;
        if (etherealNumber <= 5) {
            timeDelay += 18;
        } else if (etherealNumber > 5 || etherealNumber <= 10) {
            timeDelay += 35;
        } else {
            timeDelay += 60;
        }
        
    } else {
        send_to_spin_history();
        spinRunning = false;
    }
}

function send_to_spin_history() {
    spinHistory.ten.textContent = spinHistory.nine.textContent;
    spinHistory.ten.style.backgroundColor = spinHistory.nine.style.backgroundColor;
    spinHistory.ten.style.border = spinHistory.nine.style.border;

    spinHistory.nine.textContent = spinHistory.eight.textContent;
    spinHistory.nine.style.backgroundColor = spinHistory.eight.style.backgroundColor;
    spinHistory.nine.style.border = spinHistory.eight.style.border;

    spinHistory.eight.textContent = spinHistory.seven.textContent;
    spinHistory.eight.style.backgroundColor = spinHistory.seven.style.backgroundColor;
    spinHistory.eight.style.border = spinHistory.seven.style.border;

    spinHistory.seven.textContent = spinHistory.six.textContent;
    spinHistory.seven.style.backgroundColor = spinHistory.six.style.backgroundColor;
    spinHistory.seven.style.border = spinHistory.six.style.border;

    spinHistory.six.textContent = spinHistory.five.textContent;
    spinHistory.six.style.backgroundColor = spinHistory.five.style.backgroundColor;
    spinHistory.six.style.border = spinHistory.five.style.border;

    spinHistory.five.textContent = spinHistory.four.textContent;
    spinHistory.five.style.backgroundColor = spinHistory.four.style.backgroundColor;
    spinHistory.five.style.border = spinHistory.four.style.border;

    spinHistory.four.textContent = spinHistory.three.textContent;
    spinHistory.four.style.backgroundColor = spinHistory.three.style.backgroundColor;
    spinHistory.four.style.border = spinHistory.three.style.border;

    spinHistory.three.textContent = spinHistory.two.textContent;
    spinHistory.three.style.backgroundColor = spinHistory.two.style.backgroundColor;
    spinHistory.three.style.border = spinHistory.two.style.border;

    spinHistory.two.textContent = spinHistory.one.textContent;
    spinHistory.two.style.backgroundColor = spinHistory.one.style.backgroundColor;
    spinHistory.two.style.border = spinHistory.one.style.border;

    spinHistory.one.textContent = currentSpin;
    spinHistory.one.style.backgroundColor = currentNumberDisplay.style.backgroundColor;
    if (currentSpin > 0 && currentSpin % 2 == 0) {
        spinHistory.one.style.border = '1px solid white';
    } else {
        spinHistory.one.style.border = 'none';
    }
}

