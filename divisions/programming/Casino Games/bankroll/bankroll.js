// variables
let stagedBet = 0;
let bankroll = 500;
let bankrollOnRack = bankroll;
let moneyOnTable = 0;
let soundSelector = 0;
let pullBackInProgress = false;
let roundUpBet = false;
let goodToPlace = false;
let chipDisplay = 'blank';
let xMargin = 8;
let yMargin = 6;


// Table Bet Storage Variables
let payout = 0;
let prevStagedBet = 0;


let prevChipStructure = { 
  oneHundredK: 0,  fiftyK: 0,
  platinum: 0, brown: 0, gold: 0, purple: 0,
  black: 5, green: 0, red: 0, white: 0
}

// Animation Variable
let soundDelay = 0;
let playSound = true;
let chainDelay = 1000;
let isCoolDown = false;
let playSoundAfterAnimation = false;

const betElement = document.getElementById('staged-bet');
const betContainerElement = document.getElementById('staged-bet-container');

const moneyContainer = document.getElementById('money-container');
const bankrollElement = document.getElementById('bankroll-amount');
const moneyOnTableElement = document.getElementById('money-on-table');
const showMoneyButton = document.getElementById('show-money-button');
const doubleArrow = document.getElementById('double-arrow');
showMoneyButton.addEventListener('click', show_money);

function show_money() {
  moneyContainer.classList.toggle('open');
  doubleArrow.classList.toggle('open');
}

// Betting Buttons
const increment1 = document.getElementById('increment1');
const decrement1 = document.getElementById('decrement1');
const increment5 = document.getElementById('increment5');
const decrement5 = document.getElementById('decrement5');
const increment25 = document.getElementById('increment25');
const increment100 = document.getElementById('increment100');
const decrement25 = document.getElementById('decrement25');
const decrement100 = document.getElementById('decrement100');
const increment500 = document.getElementById('increment500');
const decrement500 = document.getElementById('decrement500');
const increment5000 = document.getElementById('increment5000');
const decrement5000 = document.getElementById('decrement5000');
const rollButton = document.getElementById('roll-button');
const pullBackButton = document.getElementById('pull-back-button');
const clearBetButton = document.getElementById('clear-bet');
increment1.addEventListener('click', function() {increment(1)});
increment5.addEventListener('click', function() {increment(5)});
increment25.addEventListener('click', function() {increment(25)});
increment100.addEventListener('click', function() {increment(100)});
increment500.addEventListener('click', function() {increment(500)});
increment5000.addEventListener('click', function() {increment(5000)});
decrement1.addEventListener('click', function() {decrement(1)});
decrement5.addEventListener('click', function() {decrement(5)});
decrement25.addEventListener('click', function() {decrement(25)});
decrement100.addEventListener('click', function() {decrement(100)});
decrement500.addEventListener('click', function() {decrement(500)});
decrement5000.addEventListener('click', function() {decrement(5000)});
pullBackButton.addEventListener('click', pull_back_in_progress);
clearBetButton.addEventListener('click', function() {
  playSound = false;

  reset_stagedBet();
});

const original = {
  betElementStyle: betElement.style,
}

// Staged Bet and Bankroll Stuff!!
const stagedBetChips = {
  location: document.getElementById('staged-bet-chips'),
  chip: [],
  rotation: [],
  prevLength: 0
}

const bankrollDiv = document.getElementById('bankroll-chips');

let bankrollChips = {
  oneHundredK: {chip: [], rotation: []},
  fiftyK: {chip: [], rotation: []},
  platinum: {chip: [], rotation: []},
  brown: {chip: [], rotation: []},
  gold: {chip: [], rotation: []},
  purple: {chip: [], rotation: []},
  black: {chip: [], rotation: []},
  green: {chip: [], rotation: []},
  red: {chip: [], rotation: []},
  white: {chip: [], rotation: []},
}

let bankrollStack = {
  oneHundredK: {div: 0, prevLength: 0},
  fiftyK: {div: 0, prevLength: 0},
  platinum: {div: 0, prevLength: 0},
  brown: {div: 0, prevLength: 0},
  gold: {div: 0, prevLength: 0},
  purple: {div: 0, prevLength: 0},
  black: {div: 0, prevLength: 0},
  green: {div: 0, prevLength: 0},
  red: {div: 0, prevLength: 0},
  white: {div: 0, prevLength: 0}
}

let firstLoad = true;

if (firstLoad == true) {
  window.addEventListener('load', (e) => {
  load_bankroll_chips();
  firstLoad = false;
  get_staged_chip_offset();
});
}

function increment(amount) {
  if (stagedBet + amount <= bankroll) {
    stagedBet += amount;
    betElement.textContent = '$' + stagedBet;
    update_staged_bet_chips();
    play_increment_sound();
  }
}

function decrement(amount) {
  if (stagedBet - amount < 0) {
    //do nothing
  } else {
    stagedBet -= amount;
    betElement.textContent = '$' + stagedBet;
    if (stagedBet == 0) {
      betElement.textContent = '';
    }
    update_staged_bet_chips();
    play_decrement_sound();
  }
}

function play_decrement_sound() {
  if (playSound = true) {
    soundSelector = Math.floor(Math.random()*3)+1;
    decrementSound = new Audio(`../sounds/Chips_Remove_${soundSelector}.mp3`);
    decrementSound.play();
  }
  
}
function play_increment_sound() {
  pullBackInProgress = false;
  pullBackButton.style.boxShadow = 'none';
  if (playSoundAfterAnimation == true) {
    setTimeout(() => {
    if (playSound == true) {
    soundSelector = Math.floor(Math.random()*4)+1;
    incrementSound = new Audio(`../sounds/Chips_Add_${soundSelector}.mp3`);
    incrementSound.play();
    }
  }, duration/1.5);
  } else {
    if (playSound == true) {
    soundSelector = Math.floor(Math.random()*4)+1;
    incrementSound = new Audio(`../sounds/Chips_Add_${soundSelector}.mp3`);
    incrementSound.play();
    }
  }
}

// -------------------------- //

// Previous staged bet chip structure
let prevSBCS = get_chip_structure(0);

function update_staged_bet_chips() {
    let rotation;
    let newChip;
    // Current staged bet Chip Structure
    let currentSBCS = get_chip_structure(stagedBet);
    let step = {color: 'none', num: 0, operation: 'none'}
    let instructions = [];
    
    // Calculate difference then figure out how many chips to remove and how many to add
    for (const color in currentSBCS) {
      if (currentSBCS[color] > 0 || prevSBCS[color] > 0) {
        difference = currentSBCS[color] - prevSBCS[color];
        step.color = color;
        step.num = Math.abs(difference);
        if (difference > 0) {
          step.operation = 'add';
        } else {
          step.operation = 'remove';
        }
        // pushes a copy of step so the next one doesn't update it in the array
        // Called Array Spread Syntax
        instructions.push({ ...step });
      }
    }
    for (const step in instructions) {
      if (instructions[step].operation == 'remove') {
        for (i = 0; i < instructions[step].num; i++) {
          // Get last index of chip to be removed so it doesn't pull from bottom of stack
          index = stagedBetChips.chip.lastIndexOf(instructions[step].color);
          stagedBetChips.chip.splice(index, 1);
          stagedBetChips.location.removeChild(stagedBetChips.location.children[index]);
          // Need to adjust margins after removing chips from middle of stack
          for (j = index; j < stagedBetChips.chip.length; j++) {
            stagedBetChips.location.children[j].style.marginBottom = `${j * 6}px`;
          }
          
        }
      }
    }
    for (const step in instructions) {
      if (instructions[step].operation == 'add') {
        for(i = 0; i < instructions[step].num; i++) {
          newChip = document.createElement('img');
          rotation = Math.ceil(Math.random()*6);
          newChip.src = `../img/chips/side/${chipDisplay}/${instructions[step].color}_chip_${rotation}.png`;
          newChip.classList.add('side-chip-img');
          newChip.style.marginBottom = `${stagedBetChips.chip.length * 6}px`;
          stagedBetChips.chip.push(instructions[step].color);
          stagedBetChips.location.appendChild(newChip);
        }
      }
    }
    
    // All done, update previous, sbAdd, sbRemove for next change
    prevSBCS = currentSBCS;
    update_bankroll_chips(bankroll - stagedBet);
}

// ---------------------- //

function load_bankroll_chips() {
  //create 1 div for stack of black chips
    bankrollStack.black = document.createElement('div');
    bankrollStack.black.classList.add('chip-stack');
    bankrollDiv.appendChild(bankrollStack.black);
// create 5 imgs of black_chip for $500 starting bankroll
  for (i = 0; i < 5; i++) {
    bankrollChips.black[i] = document.createElement('img');
    let rotation = Math.ceil(Math.random() * 6);
    bankrollChips.black.rotation[i] = rotation;
    bankrollChips.black[i].src = `../img/chips/side/blank/black_chip_${rotation}.png`;
    bankrollChips.black[i].classList.add('bankroll-chip-img');
    bankrollChips.black[i].style.marginBottom = `${i*5}px`;
    bankrollStack.black.appendChild(bankrollChips.black[i]);
  }
  bankrollStack.black.prevLength = 5;
}


function update_bankroll_chips(amount) {
  let chipStructure = get_chip_structure(amount);
  let rotation;
  let keep;
  // ----------- generate whole new bankroll each time -------------
  for (const divs in bankrollStack) {
    if (bankrollDiv.firstChild) {
      bankrollDiv.removeChild(bankrollDiv.firstChild);
    }
  }
  for (const color in chipStructure) {
    if (chipStructure[color] != 0) {
      
      bankrollStack[color].div = document.createElement('div');
      thisStack = bankrollStack[color].div;
      thisStack.classList.add('chip-stack');
      bankrollDiv.appendChild(thisStack);
      
      difference = chipStructure[color] - bankrollStack[color].prevLength;
      
      if (difference >= 0) keep = bankrollStack[color].prevLength;
      if (difference < 0) keep = bankrollStack[color].prevLength + difference;
      for (i = 0; i < chipStructure[color]; i++) {
        bankrollChips[color].chip[i] = document.createElement('img');
        thisChip = bankrollChips[color].chip[i];

        if (i < keep) {
          rotation = bankrollChips[color].rotation[i];
        } else {
          rotation = Math.ceil(Math.random() * 6);
          bankrollChips[color].rotation[i] = rotation;
        }

        thisChip.src = `../img/chips/side/blank/${color}_chip_${rotation}.png`;
        thisChip.classList.add('bankroll-chip-img');
        thisChip.style.marginBottom = `${i*5.4}px`;
        thisStack.appendChild(thisChip);
        prevLength = i + 1;
      }
      bankrollStack[color].prevLength = prevLength;
    }
  }

  // Craps specific
  //check_roll_button();
  
}

function add_chips_to_table(object, bet, orientation, imgClass, rotation) {
//chip structure
// object.location is the div element where the chips are going
// object.chip is an array where each chip img will get stored
// class table-chip-img is the size of the chip 60px x 60px
  let index = 0;
  let chipCount = 0;
  let totalChips = 0;
  object.chip = [];
  chipStructure = get_chip_structure(bet); // of the stagedBet
  
  for (const color in chipStructure) {
    totalChips += chipStructure[color];
  }
  
  for (const color in chipStructure) {
    if (chipStructure[color] != 0) {
      for (i = 0; i < chipStructure[color]; i++) {
        index = object.chip.length;
        object.chip[index] = document.createElement('img');
        thisChip = object.chip[index];

        if (orientation == 'side') {
          let rotate = Math.ceil(Math.random() * 6);
          thisChip.src = `../img/chips/${orientation}/${chipDisplay}/${color}_chip_${rotate}.png`;  
        } else {
          thisChip.src = `../img/chips/${orientation}/${chipDisplay}/${color}_chip.png`;

          if (Array.isArray(rotation)) {
            rotate = rotation[index];
          } else {
            rotate = Math.ceil(Math.random() * 60);
            if (object.rotation != undefined) object.rotation[index] = rotate;
          }
          thisChip.style.transform = `rotate(${rotate}deg)`;
        }
        
        thisChip.classList.add(`${imgClass}-chip-img`);

        if (object.bottom != undefined) {
          thisChip.style.marginBottom = `${chipCount *8}px`;
          object.location.style.bottom = `${object.bottom - (chipCount-1) *4}px`;
        } else {
          if (rotation == 'odds-rotation') {
            if (object.class == 'dc-odds') {
              thisChip.classList.add('dc-odds');
              object.location.style.left = `${object.leftSpacing
              + dontCome[dcOdder].chips.chip.length * xMargin/2 }px`;
            } else thisChip.classList.add(`come-odds`);
            thisChip.style.marginLeft = `${chipCount *6}px`;
          } else {
            object.location.style.left = `${object.leftSpacing - (totalChips*4)}px`;
            thisChip.style.marginLeft = `${chipCount * xMargin}px`;
            
          }
        }
        object.location.appendChild(thisChip);
        chipCount += 1;
      }
    }
  }
}

function remove_chips_from_table(object) {
  for (const img in object.chip) {
    object.chip[img].remove();
  }
}

function get_chip_structure(amount) {
  temp = amount;
  if (temp >= 100000) {
    oneHundredK = Math.floor(temp/100000);
    temp = temp % 100000;
  } else {
    oneHundredK = 0;
  }
  if (temp >= 50000) {
    fiftyK = Math.floor(temp/50000);
    temp = temp % 50000;
  } else {
    fiftyK = 0;
  }
  if (temp >= 15000) {
    platinum = Math.floor(temp/15000);
    temp = temp % 15000;
  } else {
    platinum = 0;
  }
  if (temp >= 5000) {
    brown = Math.floor(temp/5000);
    temp = temp % 5000;
  } else {
    brown = 0;
  }
  if (temp >= 1000) {
    gold = Math.floor(temp/1000);
    temp = temp % 1000;
  } else {
    gold = 0;
  }
  if (temp >= 500) {
    purple = Math.floor(temp/500);
    temp = temp % 500;
  } else {
    purple = 0;
  }
  if (temp >= 100) {
    black = Math.floor(temp/100);
    temp = temp % 100;
  } else {
    black = 0;
  }
  if (temp >= 25) {
    green = Math.floor(temp/25);
    temp = temp % 25;
  } else {
    green = 0;
  }
  if (temp >= 5) {
    red = Math.floor(temp/5);
    temp = temp % 5;
  } else {
    red = 0;
  }
  if (temp >= 1) {
    white = temp;
  } else {
    white = 0;
  }
  return {oneHundredK, fiftyK, platinum, brown, gold, purple, black, green, red, white};
}

// ####################### USEFUL FUNCTIONS ################################



window.addEventListener('mousemove', (e) => {

    // Get coordinates for mouse or touch
    const mouseX = e.clientX;
    const mouseY = e.clientY;

  // Set position, subtracting 50px to center the div (adjust based on div size)
  stagedBetChips.location.style.transform = `translate(${mouseX-zoom}px, ${mouseY+20}px)`;
  //alert(zoom)
});

let zoom;
let ow = window.outerWidth;


function get_staged_chip_offset() {
  zoom = (ow - 100)*110/213;
}

window.visualViewport.addEventListener('resize', (e) => {
  ow = window.outerWidth;
  get_staged_chip_offset();
});


function update_bankroll() {
  bankroll -= stagedBet;
  if (stagedBet > bankroll) {
    stagedBet = bankroll;
    if (stagedBet == 0) {
      betElement.textContent = '';
    } else {
      betElement.textContent = '$' + stagedBet;
    }
  }
  bankrollElement.textContent = '$' + bankroll;
  update_bankroll_chips(bankroll);
}

function commit_bet(bet) {
  bet = stagedBet;
  update_moneyOnTable('add', bet);
  update_bankroll();
  playSound = true;
  play_increment_sound();
  return bet;
}

function change_bet(betToCommit) {
  bankroll += betToCommit;
  moneyOnTable -= betToCommit; // Testing Purposes
  betToCommit = commit_bet(betToCommit);
  return betToCommit;
}

function pull_back_in_progress() {
  stagedBet = 0;
  update_staged_bet_chips();
  if (pullBackInProgress == false) {
    pullBackInProgress = true;
    pullBackButton.style.boxShadow = '0 0 4px 3px goldenrod';
  } else {
    pullBackInProgress = false;
    pullBackButton.style.boxShadow = 'none';
  }
  betElement.textContent = '';
  
}

function pull_back_bet(amount) {
  bankroll += amount;
  update_moneyOnTable('remove', amount);
  stagedBet = 0;
  if (amount != 0) {
    play_decrement_sound();
  }
  update_bankroll();
  amount = 0;
  return amount;
}

function reset_stagedBet() {
  if (stagedBet != 0 || pullBackInProgress == true) {
    stagedBet = 0;
    betElement.textContent = '';
    betElement.style.fontSize = '30px';
    pullBackButton.style.boxShadow = 'none';
    if (playSound == true) {
      play_decrement_sound();
    }
    playSound = true;
    prevSBCS = get_chip_structure(0);
    stagedBetChips.location.replaceChildren();
    stagedBetChips.chip = [];
    play_decrement_sound();
  }
}

function update_moneyOnTable(action, amount) {
  if (action == 'add') {
    moneyOnTable += amount;
  } else {
    moneyOnTable -= amount;
  }
  moneyOnTableElement.textContent = '$' + moneyOnTable;
}