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





let left = {
  element: document.getElementById('wheel-L'),
  colorArr: ['twentyFiveK', 'white', 'red', 'black', 'oneHundredK', 
  'purple', 'green', 'brown', 'gold'],
  chunk: [],
  index: 0,
  colorIndex: 8
}

let middle = {
  element: document.getElementById('wheel-M'),
  colorArr: [ 
    'red',
    'green',
    'black',
    'white',
    'purple',
    'gold',
    'twentyFiveK',
    'brown',
    'oneHundredK'
  ],
  chunk: [],
  index: 0,
  colorIndex: 8
}

let right = {
  element: document.getElementById('wheel-R'),
  colorArr: ['oneHundredK', 'purple', 'red', 'gold', 'white', 'twentyFiveK',
  'black', 'brown', 'green'],
  chunk: [],
  index: 0,
  colorIndex: 8
}

const blockerBtm = document.getElementById('blocker-btm');

const blockerBtmRect = blockerBtm.getBoundingClientRect();
//const middle.element = document.getElementById('wheel-M');
const wheelRect = middle.element.getBoundingClientRect();
const wheelTop = wheelRect.top;

let topIndex = {l: 8, m: 8, r: 8}
let chunkIndex = {l: 0, m: 0, r: 0};
let wheel = {left: [], middle: [], right: []};

let stopSpinL = false;
let stopSpinM = false;
let stopSpinR = false;


let time = 800; // controls spin speed, time of animation
const distance = 650;
let spinDuration = 3210; // controls how long wheel spins, change to random number each spin
const bumpLength = 50; // px distance for stop animation

left.chunk[0] = _addChunk(left);
middle.chunk[0] = _addChunk(middle);
right.chunk[0] = _addChunk(right);



// Functions ---------------------------------------------------

function _addChunk(wheel) {
  // creates div and adds 3 images using array to select img src
  const newChunk = document.createElement('div');
  newChunk.classList.add('chunk');
  for (i = 0; i < 3; i++) {
    wheel.colorIndex++;
    if (wheel.colorIndex == 9) wheel.colorIndex = 0;
    _addImg(wheel.colorArr[wheel.colorIndex], newChunk);
  }
  wheel.element.appendChild(newChunk);
  return newChunk;
}

async function spin() {
  // Needs first position because only travels half the distance
  let position = 'first';
  stopSpinL = false;
  stopSpinM = false;
  stopSpinR = false;
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

async function _continueSpinLeft() {
  // recursive function, updates left.index
  left.index++;
  if (left.index == 3) left.index = 0;
  left.chunk[left.index] = _addChunk(left);
  _translateM(left.chunk[left.index], ' '); // Any string but 'first'
  _hide(left.chunk[left.index]);

  await delay(time/2);
  setTimeout(()=>{stopSpinL = true}, Math.round(Math.ceil(Math.random()*2000 + 500)))
  if (stopSpinL == true) {
    _stopSpin(left);
  } else {
    _continueSpinLeft();
  }
}

async function _continueSpinMiddle() {
  // recursive function, updates middle.index
  middle.index++;
  if (middle.index == 3) middle.index = 0;
  middle.chunk[middle.index] = _addChunk(middle);
  _translateM(middle.chunk[middle.index], ' '); // Any string but 'first'
  _hide(middle.chunk[middle.index]);

  await delay(time/2);
  setTimeout(()=>{stopSpinM = true}, Math.round(Math.ceil(Math.random()*2000 + 1000)))
  if (stopSpinM == true) {
    _stopSpin(middle);
  } else {
    _continueSpinMiddle();
  }
}

async function _continueSpinRight() {
  // recursive function, updates right.index
  right.index++;
  if (right.index == 3) right.index = 0;
  right.chunk[right.index] = _addChunk(right);
  _translateM(right.chunk[right.index], ' '); // Any string but 'first'
  _hide(right.chunk[right.index]);

  await delay(time/2);
  setTimeout(()=>{stopSpinR = true}, Math.round(Math.ceil(Math.random()*2000 + 1500)))
  if (stopSpinR == true) {
    _stopSpin(right);
  } else {
    _continueSpinRight();
  }
}

function _stopSpin(wheel) {
  // Find the index of the top img then use that to generate a new first chunk
  for (i = 0; i < 3; i++) {
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
  if (wheel.colorIndex == -1) wheel.colorIndex = 8;
  wheel.index = 0;
  wheel.element.replaceChildren();
  wheel.chunk[0] = _addChunk(wheel);
  _bumpAnimation(wheel.chunk[0]);
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
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}



function _addImg(id, chunk) {
  // creates img and adds to div
  const img = document.createElement('img');
  img.classList.add('wheel-img');
  img.id = id;
  img.src = `../img/chips/face/blank/${id}_chip.png`;
  chunk.appendChild(img);
}

async function _hide(element) {
  // removes div when it is no longer in wheel
  await delay(time - 50);
  element.remove();
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

