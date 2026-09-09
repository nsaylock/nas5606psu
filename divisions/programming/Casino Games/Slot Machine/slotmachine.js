/* Side Bar Motion */
const sideBarButton = document.getElementById('side-bar-button');
const sideBar = document.getElementById('side-bar');
sideBarButton.addEventListener('click', () => {
  sideBar.classList.toggle('open');
});

const spinButton = document.getElementById('spin-button');
spinButton.addEventListener('click', spin);
window.addEventListener('keydown', function(event) {
  if (event.key == 'Enter') spin();
});

// Use Getboundingclient to get position -----------------------------------------
// top position - imgRect.top - wheel.top = 33.3333
// middle position = 200
// bottom position = 366.6666


// debug display
const debug1 = document.getElementById('debug-1');
const debug2 = document.getElementById('debug-2');
const debug3 = document.getElementById('debug-3');

const colorSet = [
  'oneHundredK', 
  'fiftyK', 'fiftyK',
  'twentyFiveK', 'twentyFiveK', 'twentyFiveK',
  'platinum', 'platinum', 'platinum', 'platinum',
  'brown', 'brown', 'brown', 'brown', 'brown', 
  'gold', 'gold', 'gold', 'gold', 'gold', 'gold',
  'purple', 'purple', 'purple', 'purple', 'purple', 'purple',
  'black', 'black', 'black', 'black', 'black', 'black', 'black', 'black',
  'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green',
  'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red',
  'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white'
]



const oneHundredK = document.getElementById('oneHundredK');
const fiftyK = document.getElementById('fiftyK');
const twentyFiveK = document.getElementById('twentyFiveK');
const platinum = document.getElementById('platinum');
const brown = document.getElementById('brown');
const gold = document.getElementById('gold');
const purple = document.getElementById('purple');
const black = document.getElementById('black');
const green = document.getElementById('green');
const red = document.getElementById('red');
const white = document.getElementById('white');

oneHundredK.textContent = `100K : ${_getPercentChange('oneHundredK').toFixed(4)}%`;
fiftyK.textContent = `50K : ${_getPercentChange('fiftyK').toFixed(4)}%`;
twentyFiveK.textContent = `25K : ${_getPercentChange('twentyFiveK').toFixed(4)}%`;
platinum.textContent = `Platinum : ${_getPercentChange('platinum').toFixed(4)}%`;
brown.textContent = `Brown : ${_getPercentChange('brown').toFixed(4)}%`;
gold.textContent = `Gold : ${_getPercentChange('gold').toFixed(4)}%`;
purple.textContent = `Purple : ${_getPercentChange('purple').toFixed(4)}%`;
black.textContent = `Black : ${_getPercentChange('black').toFixed(4)}%`;
green.textContent = `Green : ${_getPercentChange('green').toFixed(4)}%`;
red.textContent = `Red : ${_getPercentChange('red').toFixed(4)}%`;
white.textContent = `White : ${_getPercentChange('white').toFixed(4)}%`;

function _getPercentChange(color) {
  // Probability that all 3 will land on the payline
  let value = colorSet.filter(str => str === color).length / colorSet.length;
  value = value ** 3;
  value *= 100;
  return value;
}

const maxColorIndex = colorSet.length - 1;

function _shuffle(element) {
  for (let i = element.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [element[i], element[j]] = [element[j], element[i]];
  }
}

let left = {
  element: document.getElementById('wheel-L'),
  colorArr: [...colorSet],
  chunk: [],
  index: 0,
  colorIndex: maxColorIndex
}

let middle = {
  element: document.getElementById('wheel-M'),
  colorArr: [...colorSet],
  chunk: [],
  index: 0,
  colorIndex: maxColorIndex
}

let right = {
  element: document.getElementById('wheel-R'),
  colorArr: [...colorSet],
  chunk: [],
  index: 0,
  colorIndex: maxColorIndex
}

_shuffle(left.colorArr);
_shuffle(middle.colorArr);
_shuffle(right.colorArr);

const maxChunks = left.colorArr.length / 3;
const blockerBtm = document.getElementById('blocker-btm');


const blockerBtmRect = blockerBtm.getBoundingClientRect();
//const middle.element = document.getElementById('wheel-M');
const wheelRect = middle.element.getBoundingClientRect();
const wheelTop = wheelRect.top;

let topIndex = {l: maxColorIndex, m: maxColorIndex, r: maxColorIndex}
let chunkIndex = {l: 0, m: 0, r: 0};
let wheel = {left: [], middle: [], right: []};

let stopSpinL = false;
let stopSpinM = false;
let stopSpinR = false;


let time = 800; // controls spin speed, time of animation
const distance = 650;
let spinDuration = 3210; // controls how long wheel spins, change to random number each spin
const bumpLength = 50; // px distance for stop animation

let stopTimerL;
let stopTimerM;
let stopTimerR;

let payline = [];

left.chunk[0] = _addChunk(left);
middle.chunk[0] = _addChunk(middle);
right.chunk[0] = _addChunk(right);

debug1.textContent = left.colorArr.length;
debug2.textContent = middle.colorArr.length;
debug3.textContent = right.colorArr.length;


// Functions ---------------------------------------------------

function _addChunk(wheel) {
  // creates div and adds 3 images using array to select img src
  const newChunk = document.createElement('div');
  newChunk.classList.add('chunk');
  for (i = 0; i < 3; i++) {
    wheel.colorIndex++;
    if (wheel.colorIndex == colorSet.length) wheel.colorIndex = 0;
    _addImg(wheel.colorArr[wheel.colorIndex], newChunk);
  }
  wheel.element.appendChild(newChunk);
  return newChunk;
}

function _addImg(id, chunk) {
  // creates img and adds to div
  const img = document.createElement('img');
  img.classList.add('wheel-img');
  img.id = id;
  img.src = `../img/chips/face/blank/${id}_chip.png`;
  chunk.appendChild(img);
}

async function spin() {
  // Needs first position because only travels half the distance
  let position = 'first';
  spinButton.disabled = true;
  stopSpinL = false;
  stopSpinM = false;
  stopSpinR = false;
  payline = [];
  // Finish resetting variables
  
  _waitStopTimers();
  await delay(50);
  _translateM(left.chunk[left.index], position);
  _translateM(middle.chunk[middle.index], position);
  _translateM(right.chunk[right.index], position);
  position = 'second';
  // Has delay in hide
  _hide(left.chunk[left.index]);
  _hide(middle.chunk[middle.index]);
  _hide(right.chunk[right.index]);
  _continueSpinLeft();
  _continueSpinMiddle();
  _continueSpinRight();
}

async function _waitStopTimers() {
  stopTimerL = Math.round(Math.ceil(Math.random()*2000 + 1000));
  stopTimerM = Math.round(Math.ceil(Math.random()*2000) + 300);
  stopTimerR = Math.round(Math.ceil(Math.random()*2000) + 300);
  await delay(stopTimerL);
  stopSpinL = true;
  await delay(stopTimerM);
  stopSpinM = true;
  await delay(stopTimerR);
  stopSpinR = true;
}

async function _continueSpinLeft() {
  // recursive function, updates left.index

  left.index++;
  if (left.index == maxChunks) left.index = 0;
  left.chunk[left.index] = _addChunk(left);
  _translateM(left.chunk[left.index], ' '); // Any string but 'first'
  _hide(left.chunk[left.index]);

  await delay(time/2);
  if (stopSpinL == true) {
    _stopSpin(left, left.chunk.length);
  } else {
    _continueSpinLeft();
  }
}

async function _continueSpinMiddle() {
  // recursive function, updates middle.index

  middle.index++;
  if (middle.index == maxChunks) middle.index = 0;
  middle.chunk[middle.index] = _addChunk(middle);
  _translateM(middle.chunk[middle.index], ' '); // Any string but 'first'
  _hide(middle.chunk[middle.index]);

  await delay(time/2);
  if (stopSpinM == true) {
    _stopSpin(middle, middle.chunk.length);
  } else {
    _continueSpinMiddle();
  }
}

async function _continueSpinRight() {
  // recursive function, updates right.index

  right.index++;
  if (right.index == maxChunks) right.index = 0;
  right.chunk[right.index] = _addChunk(right);
  _translateM(right.chunk[right.index], ' '); // Any string but 'first'
  _hide(right.chunk[right.index]);

  await delay(time/2);
  if (stopSpinR == true) {
    _stopSpin(right, right.chunk.length);
    spinButton.disabled = false;
  } else {
    _continueSpinRight();
  }
}

function _stopSpin(wheel, length) {
  // Find the index of the top img then use that to generate a new first chunk
  /*
  for (i = 0; i < length; i++) {
    for (q = 0; q < 3; q++) {
      imgRect = wheel.chunk[i].children[q].getBoundingClientRect();
      difference = imgRect.top - wheelTop;
      if (difference >= 0 && difference <= 83.33) {
        topImgId = wheel.chunk[i].children[q].id;
        break;
      }
    }
  }

  wheel.colorIndex = wheel.colorArr.indexOf(topImgId);
  wheel.colorIndex--;
  if (wheel.colorIndex == -1) wheel.colorIndex = 65;
  */
  // wow that was much simpler
  wheel.colorIndex -= 3;
  wheel.index = 0;
  wheel.element.replaceChildren();
  wheel.chunk[0] = _addChunk(wheel);
  _bumpAnimation(wheel.chunk[0]);
  // Get middle row img ids
  payline.push(wheel.chunk[0].children[1].id);
  if (payline.length == 3) {
    _scorePayline();
  }
  
}

function _scorePayline() {
  debug1.textContent = payline[0];
  debug2.textContent = payline[1];
  debug3.textContent = payline[2];
}


function _bumpAnimation(element) {
  element.animate([
    { transform: 'translateY(0)' },
    { transform: `translateY(${bumpLength}px)`},
    { transform: 'translateY(0)'}
  ], {
    duration: bumpLength*time*2/distance
  });

}

function _translateM(element, position) {
  // animate div down using translate, first div is in wheel so half distance required
  let start = null;
  function step(timestamp) {
    if (start == undefined) start = timestamp;
    const elapsed = timestamp - start;
    if (elapsed < time) {
      y = 200 * elapsed / time;
    }
    if (position == 'first') {
      element.style.transform = `translateY(${y}%)`;  
    } else {
      element.style.transform = `translateY(${y - 100}%)`;  
    }
    stepId = requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}





async function _hide(element) {
  // removes div when it is no longer in wheel
  await delay(time - 50);
  element.remove();
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

