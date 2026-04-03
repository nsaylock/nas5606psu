// Things to do:
// 3) Need buy options on the 4 and 10
// 6) Case where auto-rounding to place odds will make bankroll go negative when close to 0
// 7) Add tips button for how to play
// 8) Add a link to a new page that shows the code

// 10) Dont come/dc odds can be removed after the point is established
//          -- once placed, can not be turned off
// 10.5) can call no action on dont come bar
// 11) Dont pass bar can be taken back at any time??
// 12) Dont pass bar odds - pays on 7 based on target number
// 13) Pull back bet on the dont come doesnt clear the amount

// BUGS

// Come roll will pay on come out roll but not the odds
// dice roll animations glitches when a message pops up to move a bet behind the line
// will let you place a bet that is more than your current bankroll if a bigger number is already staged

// variables
let stagedBet = 0;
let bankroll = 500;
let bankrollOnRack = bankroll;
let moneyOnTable = 0;
let dice1 = 0;
let dice2 = 0;
let sum = 0;
let target = 0;
let soundSelector = 0;
let pullBackInProgress = false;
let oneRollWinner = 0;
const minBet = 25;
let message = '';
let newMessage = '';
let moveBehindPassLine = false;
let roundUpBet = false;
let goodToPlace = false;
//let moveDCBet = false;
let gameOn = false;
let oneOrTwo;
let chipDisplay = 'blank';

// Table Bet Storage Variables
let payout = 0;
let prevStagedBet = 0;
let chipStructure = {
  platinum: 0, brown: 0, gold: 0, purple: 0,
  black: 0, green: 0, red: 0, white: 0
}

let prevChipStructure = { 
  platinum: 0, brown: 0, gold: 0, purple: 0,
  black: 5, green: 0, red: 0, white: 0
}

// Animation Variable
let soundDelay = 0;

// Numbers/Messages
const betElement = document.getElementById('staged-bet');
const betContainerElement = document.getElementById('staged-bet-container');

const dice1Element = document.getElementById('dice1');
const dice2Element = document.getElementById('dice2');

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

const offPuckElement = document.getElementById('off-puck');
const diceDisplay = document.getElementById('dice-display');
const dice = {
  one: document.getElementById('dice1'),
  two: document.getElementById('dice2')
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
const rollButton = document.getElementById('roll-button');
const pullBackButton = document.getElementById('pull-back-button');
const clearBetButton = document.getElementById('clear-bet');

// Table Buttons
const allNumbersCircles = {
  2: document.getElementById('small-2'),
  3: document.getElementById('small-3'),
  4: document.getElementById('small-4'),
  5: document.getElementById('small-5'),
  6: document.getElementById('small-6'),
  8: document.getElementById('small-8'),
  9: document.getElementById('small-9'),
  10: document.getElementById('small-10'),
  11: document.getElementById('small-11'),
  12: document.getElementById('small-12')
}

let bonus = {
  small: {
    button: document.getElementById('small-button'),
    amount: 0,
    chips: {
      location: document.getElementById('small-bonus-chips'),
      chip: [],
      leftSpacing: 0
    },
    hit: { 2: false, 3: false, 4: false, 5: false, 6: false },
    allHit: false,
    paid: false
  },
  all: {
    button: document.getElementById('all-button'),
    amount: 0,
    chips: {
      location: document.getElementById('all-bonus-chips'),
      chip: [],
      leftSpacing: 0
    },
    paid: false
  },
  tall: {
    button: document.getElementById('tall-button'),
    amount: 0,
    chips: {
      location: document.getElementById('tall-bonus-chips'),
      chip: [],
      leftSpacing: 0
    },
    hit: { 8: false, 9: false, 10: false, 11: false, 12: false },
    allHit: false,
    paid: false
  }
}

const numberBoxElement = {
  four: document.getElementById('number-box-4'),
  five: document.getElementById('number-box-5'),
  six: document.getElementById('number-box-6'),
  eight: document.getElementById('number-box-8'),
  nine: document.getElementById('number-box-9'),
  ten: document.getElementById('number-box-10')
}

let hard = {
  4: {
    button: document.getElementById('hard-4-button'),
    amount: 0,
    chips: {
      location: document.getElementById('hard-4-chips'),
      chip: [],
      leftSpacing: 1260
      },
  },
  6: {
    button: document.getElementById('hard-6-button'),
    amount: 0,
    chips: {
      location: document.getElementById('hard-6-chips'),
      chip: [],
      leftSpacing: 1105
    },
  },
  8: {
    button: document.getElementById('hard-8-button'),
    amount: 0,
    chips: {
      location: document.getElementById('hard-8-chips'),
      chip: [],
      leftSpacing: 1105
      },
  },
  10: {
    button: document.getElementById('hard-10-button'),
    amount: 0,
    chips: {
      location: document.getElementById('hard-10-chips'),
      chip: [],
      leftSpacing: 1260
      }
  }
}

let horn = {
  2: {
    button: document.getElementById('horn-2-button'),
    amount: 0,
    chips: {
      location: document.getElementById('horn-2-chips'),
      chip: [],
      leftSpacing: 1260
      },
    multiplier: 30
  },
  3: {
    button: document.getElementById('horn-3-button'),
    amount: 0,
    chips: {
      location: document.getElementById('horn-3-chips'),
      chip: [],
      leftSpacing: 1105
    },
    multiplier: 15
  },
  11: {
    button: document.getElementById('horn-11-button'),
    amount: 0,
    chips: {
      location: document.getElementById('horn-11-chips'),
      chip: [],
      leftSpacing: 1105
      },
    multiplier: 15
  },
  12: {
    button: document.getElementById('horn-12-button'),
    amount: 0,
    chips: {
      location: document.getElementById('horn-12-chips'),
      chip: [],
      leftSpacing: 1260
    },
    multiplier: 30
  }
}

let field = {
  button: document.getElementById('field-button'),
  bet: 0,
  chips: {
    location: document.getElementById('field-chips'),
    chip: [],
    leftSpacing: 750
  }
}

let dontPassBar = {
  button: document.getElementById('dont-pass-button'),
  bet: 0,
  chips: {
    location: document.getElementById('dont-pass-chips'),
    chip: [],
    leftSpacing: 200
  },
  oddsBet: 0,
  oddsChips: {
    location: document.getElementById('dont-pass-chips'),
    chip: [],
    leftSpacing: 300
  }
}

const original = {
  betElementStyle: betElement.style,
}

let placeBet = {
  button: {
    4: document.getElementById('place-4-button'),
    5: document.getElementById('place-5-button'),
    6: document.getElementById('place-6-button'),
    8: document.getElementById('place-8-button'),
    9: document.getElementById('place-9-button'),
    10: document.getElementById('place-10-button')
  },
  bet: { 4:0, 5:0, 6:0, 8:0, 9:0, 10:0 },
  chips: {
    4: {
      location: document.getElementById('place-4-chips'),
      chip: [],
      leftSpacing: 194
    },
    5: {
      location: document.getElementById('place-5-chips'),
      chip: [],
      leftSpacing: 338
    },
    6: {
      location: document.getElementById('place-6-chips'),
      chip: [],
      leftSpacing: 482
    },
    8: {
      location: document.getElementById('place-8-chips'),
      chip: [],
      leftSpacing: 630
    },
    9: {
      location: document.getElementById('place-9-chips'),
      chip: [],
      leftSpacing: 772
    },
    10: {
      location: document.getElementById('place-10-chips'),
      chip: [],
      leftSpacing: 920
      }
    }
};

let come = {
  line: {
    button: document.getElementById('come-line-button'),
    location: document.getElementById('come-chips-display'),
    amount: 0,
    chip: [],
    leftSpacing: 75
  },
  4: {
    location: document.getElementById('come-4'),
    amount: 0,
    chip: [],
    bottom: 42,
    odds: {
      location: document.getElementById('come-4-odds'),
      amount: 0,
      chip: [],
      leftSpacing: 70
    }
  },
  5: {
    location: document.getElementById('come-5'),
    amount: 0,
    chip: [],
    bottom: 42,
    odds: {
      location: document.getElementById('come-5-odds'),
      amount: 0,
      chip: [],
      leftSpacing: 70
    }
  },
  6: {
    location: document.getElementById('come-6'),
    amount: 0,
    chip: [],
    bottom: 42,
    odds: {
      location: document.getElementById('come-6-odds'),
      amount: 0,
      chip: [],
      leftSpacing: 70
    }
  },
  8: {
    location: document.getElementById('come-8'),
    amount: 0,
    chip: [],
    bottom: 42,
    odds: {
      location: document.getElementById('come-8-odds'),
      amount: 0,
      chip: [],
      leftSpacing: 70
    }
  },
  9: {
    location: document.getElementById('come-9'),
    amount: 0,
    chip: [],
    bottom: 42,
    odds: {
      location: document.getElementById('come-9-odds'),
      amount: 0,
      chip: [],
      leftSpacing: 70
    }
  },
  10: {
    location: document.getElementById('come-10'),
    amount: 0,
    chip: [],
    bottom: 42,
    odds: {
      location: document.getElementById('come-10-odds'),
      amount: 0,
      chip: [],
      leftSpacing: 70
    }
  }
}

let dontCome = {
  line: {
    button: document.getElementById('dont-come-line-button'),
    location: document.getElementById('dont-come-chips-display'),
    amount: 0,
    chip: [],
    leftSpacing: 58
  },
  4: {
    button: document.getElementById('dc-4-button'),
    location: document.getElementById('dc-4'),
    amount: 0,
    chip: [],
    leftSpacing: 40,
    odds: {
      location: document.getElementById('dc-4-odds'),
      amount: 0,
      chip: [],
      leftSpacing: 80
    }
  },
  5: {
    button: document.getElementById('dc-5-button'),
    location: document.getElementById('dc-5'),
    amount: 0,
    chip: [],
    leftSpacing: 40,
    odds: {
      location: document.getElementById('dc-5-odds'),
      amount: 0,
      chip: [],
      leftSpacing: 80
    }
  },
  6: {
    button: document.getElementById('dc-6-button'),
    location: document.getElementById('dc-6'),
    amount: 0,
    chip: [],
    leftSpacing: 40,
    odds: {
      location: document.getElementById('dc-6-odds'),
      amount: 0,
      chip: [],
      leftSpacing: 80
    }
  },
  8: {
    button: document.getElementById('dc-8-button'),
    location: document.getElementById('dc-8'),
    amount: 0,
    chip: [],
    leftSpacing: 40,
    odds: {
      location: document.getElementById('dc-8-odds'),
      amount: 0,
      chip: [],
      leftSpacing: 80
    }
  },
  9: {
    button: document.getElementById('dc-9-button'),
    location: document.getElementById('dc-9'),
    amount: 0,
    chip: [],
    leftSpacing: 40,
    odds: {
      location: document.getElementById('dc-9-odds'),
      amount: 0,
      chip: [],
      leftSpacing: 80
    }
  },
  10: {
    button: document.getElementById('dc-10-button'),
    location: document.getElementById('dc-10'),
    amount: 0,
    chip: [],
    leftSpacing: 40,
    odds: {
      location: document.getElementById('dc-10-odds'),
      amount: 0,
      chip: [],
      leftSpacing: 80
    }
  }
}

const stagedBetChips = {
  location: document.getElementById('staged-bet-chips'),
  chip: []
}

const bankrollDiv = document.getElementById('bankroll-chips');

let bankrollChips = {
  platinum: [],
  brown: [],
  gold: [],
  purple: [],
  black: [],
  green: [],
  red: [],
  white: []
}

let bankrollStack = {
  platinum: 0,
  brown: 0,
  gold: 0,
  purple: 0,
  black: 0,
  green: 0,
  red: 0,
  white: 0
};

let passLine = {
  button: document.getElementById('pass-line-button'),
  amount: 0,
  chips: {
    location: document.getElementById('pass-line-chips'),
    chip: [],
    leftSpacing: 700
  },
  odds: {
    button: document.getElementById('pass-line-odds-button'),
    amount: 0,
    chips: {
      location: document.getElementById('pass-line-odds-chips'),
      chip: [],
      leftSpacing: 800
    }
  }
};

let firstLoad = true;

if (firstLoad == true) {
  window.addEventListener('load', (e) => {
  let rand = Math.ceil(Math.random() * 5);
  let location = `img/casino_0${rand}.jpg`;
  document.body.style.backgroundImage = "url('"+location+"')";
  load_bankroll_chips();
  firstLoad = false;
});
}

// $$$$$$$$$$$$$$$$$$$$$ BET STAGING AREA AND BUTTON $$$$$$$$$$$$$$$$$$$$$$$


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
    decrementSound = new Audio(`sounds/Chips_Remove_${soundSelector}.mp3`);
    decrementSound.play();
  }
  
}
let playSound = true;
function play_increment_sound() {
  pullBackInProgress = false;
  if (playSoundAfterAnimation == true) {
    setTimeout(() => {
    if (playSound == true) {
    soundSelector = Math.floor(Math.random()*4)+1;
    incrementSound = new Audio(`sounds/Chips_Add_${soundSelector}.mp3`);
    incrementSound.play();
    }
  }, duration/1.5);
  } else {
    if (playSound == true) {
    soundSelector = Math.floor(Math.random()*4)+1;
    incrementSound = new Audio(`sounds/Chips_Add_${soundSelector}.mp3`);
    incrementSound.play();
    }
  }
}

function update_staged_bet_chips() {
  if (stagedBet != prevStagedBet) {
    let index = 0;
    let chipCount = 0;
    for (const img in stagedBetChips.chip) {
      stagedBetChips.chip[img].remove();
    }
    //stagedBetChips.chip = []
    chipStructure = get_chip_structure(stagedBet); // of the stagedBet
    for (const color in chipStructure) {
      if (chipStructure[color] != 0) {
        for (i = 0; i < chipStructure[color]; i++) {
          index = stagedBetChips.chip.length;
          stagedBetChips.chip[index] = document.createElement('img');
          thisChip = stagedBetChips.chip[index];
          thisChip.src = `img/chips/side/${chipDisplay}/${color}_chip.png`;
          thisChip.classList.add('side-chip-img');
          thisChip.style.marginBottom = `${chipCount * 8}px`;
          stagedBetChips.location.appendChild(thisChip);
          chipCount += 1;
        }
      }
    }
    reset_chip_structure();
    update_bankroll_chips(bankroll-stagedBet);
    prevStagedBet = stagedBet;
    playSound = true;
  } else {
    playSound = false;
  }
}

const chipVessel = {
  bottomContainer: document.getElementById('bottom-container'),
  chip: []
}

let animationComplete = true;
let playSoundAfterAnimation = false;

function move_chips_animation(area) {
  let exitAnimationFunction = false;
  //if (animationComplete == false) {
  //  exitAnimationFunction = true;
  //}
  switch (area) {
    case 'staged-bet':
      amount = stagedBet - prevStagedBet;
      chipOrientation = 'side';
      if (amount > 0) {
        origin = 'bottomContainer';
        startingLocation = 'chips-animation-bankroll-location';
        endingLocation = 'staged-bet';
        animation = 'move-chips-bankroll-to-staged-bet';
        duration = 250;
        break;
        
      } else if (amount < 0) {
        startingLocation = 'move-chips-staged-bet-location';
        endingLocation = 'move-chips-bankroll-location';
        break;
      } else {
        exitAnimationFunction = true;
        break;
      }
  }

  if (exitAnimationFunction == false) {
    //animationComplete = false;
    let index = 0;
    let chipCount = 0;
    chipVessel.chip = []
    chipStructure = get_chip_structure(amount); //amount to move

    newDiv = document.createElement('div');
    newDiv.id = startingLocation;
    chipVessel[origin].appendChild(newDiv);
    // loading the boat
    for (const color in chipStructure) {
      if (chipStructure[color] != 0) {
        for (i = 0; i < chipStructure[color]; i++) {
          index = chipVessel.chip.length;
          chipVessel.chip[index] = document.createElement('img');
          thisChip = chipVessel.chip[index];
          thisChip.src = `img/chips/${chipOrientation}/${chipDisplay}/${color}_chip.png`;
          thisChip.classList.add(`${chipOrientation}-chip-img`);
          thisChip.style.marginBottom = `${chipCount * 9}px`;
          newDiv.appendChild(thisChip);
          chipCount += 1;
        }
      }
    }
    newDiv.classList.add(animation);
    setTimeout(() => {
      newDiv.remove();
      update_animation_end_location(endingLocation);
    }, duration);

    reset_chip_structure();
  }
}

function update_animation_end_location(location) {
  switch (location) {
    case 'staged-bet':
      animated_update_staged_bet_chips();
      break;
  }
}

function load_bankroll_chips() {
  //create 1 div for stack of black chips
    
    bankrollStack.black = document.createElement('div');
    bankrollStack.black.classList.add('chip-stack');
    bankrollDiv.appendChild(bankrollStack.black);
// create 5 imgs of black_chip for $500 starting bankroll
  for (i = 0; i < 5; i++) {
    bankrollChips.black[i] = document.createElement('img');
    bankrollChips.black[i].src = 'img/chips/side/blank/black_chip.png';
    bankrollChips.black[i].classList.add('bankroll-chip-img');
    bankrollChips.black[i].style.marginBottom = `${i*5.4}px`;
    bankrollStack.black.appendChild(bankrollChips.black[i]);
  }

}

function update_bankroll_chips(amount) {
  //object is bankrollChips {stack[], plat[], brown[], gold[], purple[], etc}
  chipStructure = get_chip_structure(amount);

  // ----------- generate whole new bankroll each timee -------------
  for (const divs in bankrollStack) {
    if (bankrollDiv.firstChild) {
      bankrollDiv.removeChild(bankrollDiv.firstChild);
    }
  }
  for (const color in chipStructure) {
    if (chipStructure[color] != 0) {
      
      bankrollStack[color] = document.createElement('div');
      thisStack = bankrollStack[color];
      thisStack.classList.add('chip-stack');
      bankrollDiv.appendChild(thisStack);
      
      for (i = 0; i < chipStructure[color]; i++) {
        bankrollChips[color][i] = document.createElement('img');
        thisChip = bankrollChips[color][i];
        thisChip.src = `img/chips/side/blank/${color}_chip.png`;
        thisChip.classList.add('bankroll-chip-img');
        thisChip.style.marginBottom = `${i*5.4}px`;
        thisStack.appendChild(thisChip);
      }
        
    }
  }
  reset_chip_structure();
}

  

function add_chips_to_table(object, bet, orientation, imgClass, rotation) {
//chip structure
// object.location is the div element where the chips are going
// object.chip is an array where each chip img will get stored
// class table-chip-img is the size of the chip 60px x 60px
  let index = 0;
  let chipCount = 0;
  let totalChips = 0;
  let firstChip = true;
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
        thisChip.src = `img/chips/${orientation}/${chipDisplay}/${color}_chip.png`;
        thisChip.classList.add(`${imgClass}-chip-img`);

        if (object.bottom != undefined) {
          thisChip.style.marginBottom = `${chipCount *8}px`;
          object.location.style.bottom = `${object.bottom - (chipCount-1) *4}px`;
        } else {
          if (rotation == 'rotated') {
            
            thisChip.classList.add(`rotate-odds-bet`);
            thisChip.style.marginLeft = `${chipCount *6}px`;
            object.location.style.left = `${object.leftSpacing - (totalChips * 3)}px`;
          } else {
            object.location.style.left = `${object.leftSpacing - (totalChips*4)}px`;
            thisChip.style.marginLeft = `${chipCount * 8}px`;
            
          }
        }
        object.location.appendChild(thisChip);
        chipCount += 1;
      }
    }
  }
  reset_chip_structure();
}

function reset_chip_structure() {
  chipStructure = {
    platinum: 0,
    brown: 0,
    gold: 0,
    purple: 0,
    black: 0,
    green: 0,
    red: 0,
    white: 0
  };
}

function remove_chips_from_table(object) {
  for (const img in object.chip) {
    object.chip[img].remove();
  }
}

function get_chip_structure(amount) {
  temp = amount;
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
  return {platinum, brown, gold, purple, black, green, red, white};
}

// ####################### USEFUL FUNCTIONS ################################
function update_bankroll() {
  bankroll -= stagedBet;
  if (stagedBet > bankroll) {
    stagedBet = bankroll;
    betElement.textContent = '$' + stagedBet;
    update_staged_bet_chips();
  }
  bankrollElement.textContent = '$' + bankroll;
  update_bankroll_chips(bankroll);
}

function commit_bet(betToPlace) {
  betToPlace = stagedBet;
  moneyOnTable += betToPlace;
  update_moneyOnTable();
  update_bankroll();
  playSound = true;
  play_increment_sound();
  return betToPlace;
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
  betElement.textContent = 'Pull';
  pullBackInProgress = true;
}

function pull_back_bet(amount) {
  bankroll += amount;
  moneyOnTable -= amount;
  update_moneyOnTable();
  update_bankroll();
  stagedBet = 0;
  update_staged_bet_chips();
  if (amount != 0) {
    play_decrement_sound();
  }
  amount = 0;
  return amount;
}

function lose_bet(amount) {
  moneyOnTable -= amount;
  update_moneyOnTable();
  amount = 0;
  return amount;
}

function reset_stagedBet() {
  if (stagedBet != 0 || pullBackInProgress == true) {
    stagedBet = 0;
    betElement.textContent = '';
    betElement.style.fontSize = '30px';
    if (playSound == true) {
      play_decrement_sound();
    }

    playSound = true;

    update_staged_bet_chips();
  }
  
}

function update_moneyOnTable() {
  moneyOnTableElement.textContent = '$' + moneyOnTable;
}

function message_display(message) {
  //rollName = display_roll_message(sum);

  newMessage = sum + ' - ' + message;
  document.getElementById('message-5').textContent = document.getElementById('message-4').textContent;
  document.getElementById('message-4').textContent = document.getElementById('message-3').textContent;
  document.getElementById('message-3').textContent = document.getElementById('message-2').textContent;
  document.getElementById('message-2').textContent = document.getElementById('message-1').textContent;
  document.getElementById('message-1').textContent = newMessage;
}

function clear_table() {
  message = 'All bets cleared';
  message_display(message);
  if (dontPassBar.bet != 0) {
    moneyOnTable = dontPassBar.bet;
  } else {
    moneyOnTable = 0;
  }
  update_moneyOnTable();


  remove_chips_from_table(passLine.chips);
  passLine.amount = 0;
  rollButton.classList.add('hidden');
  remove_chips_from_table(passLine.odds.chips);
  passLine.odds.amount = 0;

  for (const key in placeBet.bet) {
    placeBet.bet[key] = 0;
    //reset_place_bet_text(key);
  }
  for (const key in hard) {
    remove_chips_from_table(hard[key].chips);
    hard[key].amount = 0;
  }

  
  /*
  for (const key in comeBetOdds) {
    comeBetOdds[key] = 0;
    remove_chips_from_table(comeBetOddsChips[key]);
    
  }
    */
}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%% DICE ROLL -- GAME ON/OFF %%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%% MAIN SCORE FUNCTION %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function roll_dice() {
  pullBackInProgress = false;
  if (passLine.amount == 0 && dontPassBar.bet == 0) {
    alert('You must play the pass line to roll')
  } else {
    playSound = false;
    reset_stagedBet();
    //messageElement.textContent = ''; probable need to delete
    dice1 = Math.floor(Math.random()*6) + 1;
    dice2 = Math.floor(Math.random()*6) + 1;
    sum = dice1 + dice2;
    //alert(sum);

    if (bonus.small.amount != 0 || bonus.all.amount != 0 || bonus.tall.amount != 0) {
      if (sum == 7) {
        clear_bonus_bet();
      } else {
        check_bonus_bet(sum);
      }
    }

    oneOrTwo = Math.ceil(Math.random()*2);
    if (dice1 == 6) {
      dice1Element.src = `img/dice/red_6_${oneOrTwo}.png`;
    } else {
      dice1Element.src = `img/dice/red_${dice1}.png`;
    }
    if (dice2 == 6) {
      if (oneOrTwo == 1) {
        dice2Element.src = 'img/dice/red_6_2.png';
      } else {
        dice2Element.src = 'img/dice/red_6_1.png';
      }
    } else {
      dice2Element.src = `img/dice/red_${dice2}.png`;
    }
    // animation
    diceThrowAnimation();

    soundSelector = Math.floor(Math.random()*3)+1;
    diceRollSound = new Audio(`sounds/Dice_Roll_${soundSelector}.mp3`);
    diceRollSound.play();
    score_horn_bets();
    score_come_bets();
    score_dont_come_bets();
    if (gameOn == false) {
      come_out_roll();
    } else {
      score_roll();
    }
  }
  if (gameOn == true) {
    mainArea.style.boxShadow = '0 0 50px 5px goldenrod';
  } else {
    mainArea.style.boxShadow = 'none';
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function diceThrowAnimation() {
  diceDisplay.classList.toggle('dice-move');
  dice.one.classList.toggle('dice-grow');
  dice.two.classList.toggle('dice-grow');
  await delay(1200);
  diceDisplay.classList.toggle('dice-move');
  dice.one.classList.toggle('dice-grow');
  dice.two.classList.toggle('dice-grow');
}

function display_on_marker() {
  const onIMG = document.getElementById(`on-${target}`);
  onIMG.classList.toggle('hidden');
  onIMG.style.zIndex = '20';
  offPuckElement.classList.toggle('hidden');
}
function remove_on_marker() {
  document.getElementById(`on-${target}`).classList.toggle('hidden');
  document.getElementById(`on-${target}`).style.zIndex = '-1';
  //document.getElementById(`dont-come-container-${target}`).style.zIndex = '1';
  offPuckElement.classList.toggle('hidden');
}

function display_roll_message(sum) {
  if (sum == 2) {
    rollName = 'Snake Eyes';
  } else if (sum == 3) {
    rollName = 'Craps ' + sum;
  } else if (sum == 7) {
    rollName = 'Big Red';
  } else if (sum == 11) {
    rollName = 'Yo';
  } else if (sum == 12) {
    rollName = 'Midnight';
  } else if (dice1 == dice2) {
    rollName = sum + ' Hard';
  } else {
    return sum;
  }
  return rollName;
}

function come_out_roll() {
  if (dontPassBar.bet != 0) {
    if (sum == 7 || sum == 11) {
      message = `Lost $${dontPassBar.bet} on the Don\'t Pass Line`;
      message_display(message);
      remove_chips_from_table(dontPassBar.chips);
      moneyOnTable -= dontPassBar.bet;
      dontPassBar.bet = 0;
      rollButton.classList.add('hidden');
      update_moneyOnTable();
    } else if (sum == 2 || sum == 3) {
      message = 'Won $' + dontPassBar.bet + ' on the Don\'t Pass Line';
      message_display(message);
      bankroll += dontPassBar.bet;
      update_bankroll();
    } else if (sum == 12) {
      message = 'Push on the Don\'t Pass Line';
      message_display(message);
    } else {
      target = sum; // Target assigned
      gameOn = true;
      message = 'Point established';
      message_display(message);
      display_on_marker();
    }
  }
  if (passLine.amount != 0) {
    if (sum == 2 || sum == 3 || sum == 12) {
      message = 'Lost $' + passLine.amount + ' on the Pass Line';
      message_display(message);
      remove_chips_from_table(passLine.chips);
      moneyOnTable -= passLine.amount;
      passLine.amount = 0;
      rollButton.classList.add('hidden');
      update_moneyOnTable();
    } else if (sum == 7 || sum == 11) {
      message = 'Won $' + passLine.amount + ' on the Pass Line';
      message_display(message);
      bankroll += passLine.amount;
      update_bankroll();
    } else {
      target = sum; // Target assigned
      gameOn = true;
      message = 'Point Established';
      message_display(message);
      display_on_marker();
      if (placeBet.bet[target] != 0) {
        move_behind_pass_line();
      }
    }
  }

  if (field.bet != 0) {
    score_field_bet();
  }
}

function move_behind_pass_line() {
  setTimeout (() => { 
    moveBehindPassLine = confirm(`Would you like to move your $${placeBet.bet[target]} 
Place Bet Behind the Pass Line for better odds?`)

    if (moveBehindPassLine == true) {
      if ((target == 5 || target == 9) && placeBet.bet[target] % 2 != 0) {
        roundUpBet = confirm(`You need to round up your bet. Ok to confirm. Otherwise bet stays as is`);
        if (roundUpBet == true) {
          passLine.odds.amount = placeBet.bet[target] + 1;
          bankroll -= 1; 
          // *** // Theres a case where this will make the bankroll go negative, consider handling
          update_bankroll();
          moneyOnTable += 1;
          update_moneyOnTable();
        } else {
          moveBehindPassLine = false;
        }
      }
    }
    if (moveBehindPassLine == true) {
      if (passLine.odds.amount == 0) {
        passLine.odds.amount = placeBet.bet[target];
      }
      add_chips_to_table(passLine.odds.chips, passLine.odds.amount, 'face', 'table', 'normal');
      placeBet.bet[target] = 0;
      remove_chips_from_table(placeBet.chips[target]);
    } else {
      message = 'Player not moving Place Bet';
      message_display(message);
    }
  }, 1200);
}

function score_roll() {
  // Score bets on come line first in case of 7 out
  if (sum == 7) {
    clear_table();
    score_pass_line();
    gameOn = false;
    remove_on_marker();
  }

  // Place Bets
  for (const key in placeBet.bet) {
    if (placeBet.bet[key] !== 0 && placeBet.bet[key] != undefined && key == sum) {
      score_place_bets(sum);
      break;
    }
  }
  // Hard ways bets
    if (sum == 4 || sum == 6 || sum == 8 || sum == 10) {
      if (hard[sum].amount != 0 && dice1 != dice2) {
        message = `${sum} not hard. Lose your $${hard[sum].amount} bet.`;
        message_display(message);
        remove_chips_from_table(hard[sum].chips);
        hard[sum].amount = lose_bet(hard[sum].amount);
      } else if (hard[sum].amount !== 0 && dice1 == dice2) {
        score_hardways_bets(sum);
      }
    }
  // One Roll Bets
  // Field Bet
  if (field.bet != 0) {
    score_field_bet();
  }

  // Come Line
  // Score the come bets that have been moved first so they don't get moved and
  // scored on the same roll

  // Come Bet Still working when game goes off - wins when number hit - loses on 7
  // Come Bet odds go off when game is off
  // Initial bet returned to the player when win

    



  if (come.line.amount != 0) {
    on_the_come_line();
  }

  // Dont Come Bets


  if (dontCome.line.amount != 0) {
    on_the_dont_come_line();
  }


  if (sum == target) {
    gameOn = false;
    score_pass_line();
    message = 'Player hit the target. Game goes off';
    message_display(message);
    remove_on_marker();
    target = 0;
    remove_chips_from_table(passLine.odds.chips);
  }
}


// ########################################################################
// #################### BET PLACEMENT AND SCORING #########################
// ########################################################################

// PASS LINE AND DONT PASS BAR
function pass_line() { // adds bet to pass line
  if (stagedBet >= minBet) {
    add_chips_to_table(passLine.chips, stagedBet, 'face', 'table', 'not-rotated');
    passLine.amount = commit_bet(passLine.amount);
    rollButton.classList.remove('hidden');

  } else {
    alert('The minimum bet is $' + minBet + '.');
  }
}



function pass_line_odds() {
  if (placeBet.bet[target] != 0) {
    bankroll += placeBet.bet[target];
    remove_chips_from_table(placeBet.chips[target]);
    placeBet.bet[target] = 0;
  }
  alert('1')
    add_chips_to_table(passLine.odds.chips, stagedBet, 'face', 'table', 'normal');
    passLine.odds.amount = commit_bet(passLine.odds.amount);
}

function dont_pass_line() {
  if (stagedBet >= minBet) {
    add_chips_to_table(dontPassBar.chips, stagedBet, 'face', 'table', 'normal');
    dontPassBar.bet = commit_bet(dontPassBar.bet);
    rollButton.classList.remove('hidden');
  } else {
    alert('The minimum bet is $' + minBet + '.');
  }
}

function score_pass_line() { // After game is on
  if (sum == 7) {
    if (dontPassBar.bet != 0) {
      bankroll += dontPassBar.bet;
      update_bankroll();
      message = `Won $${dontPassBar.bet} on the Don\'t Pass Bar`;
      message_display(message);
      }
  } else {
    if (dontPassBar.bet != 0) {
      remove_chips_from_table(dontPassBar.chips);
      dontPassBar.bet = lose_bet(dontPassBar.bet);
      rollButton.classList.add('hidden');
      message = `Lost $${dontPassBar.bet} on the Don\'t Pass Bar`;
      message_display(message);
    }
    if (passLine.amount != 0) {
      bankroll += passLine.amount;
      update_bankroll();
      message = `Won $${passLine.amount} on the Pass Line`;
      message_display(message);
      if (passLine.odds.amount != 0) {
      score_pass_line_odds(target);
      }
    }
  }
}

////// COULD HAVE DONT PASS BAR ODDS pays inverse true odds

function score_pass_line_odds(target) {
  switch (target) {
    case 4:
    case 10:
      payout = passLine.odds.amount * 2;
      break;
    case 5:
    case 9:
      payout = passLine.odds.amount * 3 / 2;
      break;
    case 6:
    case 8:
      payout = passLine.odds.amount * 6 / 5;
      break;
  }
  bankroll += payout;
  bankroll += passLine.odds.amount;
  update_bankroll();
  moneyOnTable -= passLine.odds.amount;
  update_moneyOnTable();
  message = `Won $${payout} on Pass Line Odds`;
  message_display(message);
  passLine.odds.amount = 0;
}


// PLACE BETS
function place_bet(selector) {
  if (stagedBet < minBet) {
    alert('The minimum bet is $' + minBet + '.');
  } else if (placeBet.bet[selector] != 0) {
    alert(`You already have a Place Bet on ${selector}. 
Pull back bet to change.`);
  } else if (passLine.odds.amount != 0 && target == selector) {
    // Do Nothing
  } else {
    add_chips_to_table(placeBet.chips[selector], stagedBet, 'face', 'table', 'not-rotated');
    placeBet.bet[selector] = commit_bet(placeBet.bet[selector]);
  }
}

function score_place_bets(sum) {
  switch (sum) {
    case 4:
      payout = placeBet.bet[4]*9/5;
      break;
    case 5:
      payout = placeBet.bet[5]*7/5;
      break;
    case 6:
      payout = placeBet.bet[6]*7/6;
      break;
    case 8:
      payout = placeBet.bet[8]*7/6;
      break;
    case 9:
      payout = placeBet.bet[9]*7/5;
      break;
    case 10:
      payout = placeBet.bet[10]*9/5;
      break;
  }
  bankroll += payout;
  update_bankroll();
  message = `Won $${payout} on place bet`;
  message_display(message);
}

// HARDWAYS BETS
function hardways_bet(selector) {
  if (stagedBet == 0) {
    // Do Nothing
  } else {
    if (hard[selector].amount != 0) {
      alert(`You already have a Hardways Bet on ${selector}. 
      Pull back bet to change.`);
    } else {
      add_chips_to_table(hard[selector].chips, stagedBet, 'face', 'table', 'normal');
      hard[selector].amount = commit_bet(hard[selector].amount);
    }
  }
}

function score_hardways_bets(sum) {
  switch (sum) {
    case 4:
      payout = hard[4].amount*7;
      break;
    case 6:
      payout = hard[6].amount*9;
      break;
    case 8:
      payout = hard[8].amount*9;
      break;
    case 10:
      payout = hard[10].amount*7;
      break;
  }
  bankroll += payout;
  update_bankroll();
  message = `Won $${payout} on Hardways`;
  message_display(message);
}

// ONE ROLL BETS
function horn_bet(selector) {
  if (stagedBet == 0) {
    // Do nothing
  } else {
    if (horn[selector].amount != 0) {
      alert(`You already have a Horn Bet on ${selector}. 
      Pull back bet to change.`);
  } else {
      add_chips_to_table(horn[selector].chips, stagedBet, 'face', 'table', 'not-rotated');
      horn[selector].amount = commit_bet(horn[selector].amount);
    }
  }
}

function score_horn_bets() {
  for (const key in horn) {
    if (key == sum && horn[key].amount != 0) {
      payout = horn[sum].amount * horn[sum].multiplier;
      bankroll += payout;
      update_bankroll();
      message = `Won $${payout} on one-roll bet`;
      message_display(message);
    } else {
      remove_chips_from_table(horn[key].chips);
      horn[key].amount = lose_bet(horn[key].amount);
    }
  }
}


// FIELD BETS
function field_bet() { // Place staged bet on Field
  if (stagedBet < minBet) {
    alert('The minimum bet is $' + minBet + '.');
  } else if (field.bet != 0) {
    alert(`You already have a Bet in the field. 
Pull back bet to change.`);
  } else {
    add_chips_to_table(field.chips, stagedBet, 'face', 'table', 'normal');
    field.bet = commit_bet(field.bet);
  }
}

function score_field_bet() {
// Lose
  if (sum == 5 || sum == 6 || sum == 7 || sum == 8) {
    message = 'Lost $' + field.bet + ' to the field.';
    message_display(message);
    remove_chips_from_table(field.chips);
    field.bet = lose_bet(field.bet);
    // Win
  } else {
    if (sum == 2 || sum == 12) {
      payout = field.bet * 2;
    } else {
      payout = field.bet;
    }
    bankroll += payout;
    update_bankroll();
    message = 'Won $' + payout + ' in the field.';
    message_display(message);
  }

}

// COME BETS

function come_bet() { // Place the Staged Bet on the Come Line
  if (stagedBet < minBet) {
    alert('The minimum bet is $' + minBet + '.');
  } else if (come.line.amount != 0) {
    alert(`You already have a Bet on the Come Line.
Pull back bet to change.`);
  } else {
    add_chips_to_table(come.line, stagedBet, 'face', 'table', 'not-rotated');

    // try global version
    come.line.amount = commit_bet(come.line.amount);
  }
}

function come_bet_odds(selection) {
  if (come[selection].amount != 0) {
    if (come[selection].odds.amount != 0) {
      alert('Come Bet Odds already placed, pull back bet to change');
    } else {
    // Good to place
      switch (selection) {
        case 5:
        case 9:
          if (stagedBet % 2 != 0) {
            alert(`Come Bet Odds on ${selection} pays out 3:2.
Bet must be divisible by 2`);
          } else {
            goodToPlace = true;
          }
          break;
        case 6:
        case 8:
          if (stagedBet % 5 != 0) {
            alert(`Come Bet Odds on ${selection} pays out 6:5.
Bet must be divisible by 5`);
          } else {
            goodToPlace = true;
          }
          break;
        case 4:
        case 10:
          goodToPlace = true;
          break;
      }
      if (goodToPlace == true) {
        add_chips_to_table(come[selection].odds, stagedBet, 'side', 'odds', 'rotated');
        come[selection].odds.amount = stagedBet;
        update_bankroll();
        moneyOnTable += stagedBet;
        update_moneyOnTable();
        goodToPlace = false;
      }
    }
    
  }
}

function on_the_come_line() { // Score Bets on Come Line or Move if Point
  if (sum == 2 || sum == 3 || sum == 12) {
    message = 'Lost $' + come.line.amount + ' on the Come Line';
    message_display(message);
    remove_chips_from_table(come.line);
    come.line.amount = lose_bet(come.line.amount);
  } else if (sum == 11) {
    message = 'Won $' + come.line.amount + ' on the Come Line';
    message_display(message);
    bankroll += come.line.amount;
    update_bankroll();
  } else if (sum == 7) {
      bankroll += come.line.amount;
      update_bankroll();
      remove_chips_from_table(come.line);
      message = `Won $${come.line.amount} on the Come Line`;
      message_display(message);
      come.line.amount = lose_bet(come.line.amount);
  } else {
    move_come_bet();
  }
}

function move_come_bet() { // Move the Come Line to Come Bet area
  come[sum].amount = come.line.amount;
  
  add_chips_to_table(come[sum], come.line.amount, 'face', 'table', 'normal');
  message = `$${come.line.amount} Come Bet moved`;
  message_display(message);
  remove_chips_from_table(come.line);
  come.line.amount = 0;
}

function score_come_bets() { // Score Come Bets
  if (sum == 2 || sum == 3 || sum == 11 || sum == 12) {
    return; // Do Nothing
  } else if (sum == 7) {
    // Clear Come Bets
    for (const key in come) {
      if (String(key) != 'line') {
        come[key].amount = 0;
        remove_chips_from_table(come[key]);
        if (come[key].odds.amount != 0) {
          if (gameOn == false) {
            bankroll += come[key].odds.amount;
            message_display(come[key].odds.amount + ' returned');
          }
          come[key].odds.amount = 0;
          remove_chips_from_table(come[key].odds);
        }
      }
    }
  } else if (come[sum].amount != 0) {
    payout = come[sum].amount;
    bankroll += payout * 2;
    update_bankroll();
    message = `Won $${payout} on the Come Bet`;
    message_display(message);
    come[sum].amount = lose_bet(come[sum].amount);
    remove_chips_from_table(come[sum]);
    if (come[sum].odds.amount != 0) {
      remove_chips_from_table(come[sum].odds);
      if (sum == 4 || sum == 10) {
        payout = come[sum].odds.amount * 2;
      } else if (sum == 5 || sum == 9) {
        payout = come[sum].odds.amount * 3 / 2;
      } else {
        payout = come[sum].odds.amount * 6 / 5;
      }
      bankroll += (payout + come[sum].odds.amount);
      update_bankroll();
      message = `Won $${payout} on the Come Bet Odds`;
      message_display(message);
      come[sum].odds.amount = lose_bet(come[sum].odds.amount);
    }
  }
}

function dont_come_bet() {
  if (stagedBet < minBet) {
    alert('The minimum bet is $' + minBet + '.');
  } else if (dontCome.line.amount != 0) {
    alert(`You already have a Bet on the Don\'t Come Line.
Pull back bet to change.`);
  } else {
    add_chips_to_table(dontCome.line, stagedBet, 'face', 'table', 'not-rotated');
    dontCome.line.amount = commit_bet(dontCome.line.amount);
  }
}

function dont_come_bet_odds(selection) {
  if (dontCome[selection].amount != 0) {
    if (dontCome[selection].odds.amount != 0) {
      alert('Don\'t Come Bet Odds already placed, pull back bet to change');
    } else {
      // Good to place
      switch (selection) {
        case 5:
        case 9:
          if (stagedBet % 3 != 0) {
            alert(`Don\'t Come Bet Odds on ${selection} pays out 2:3.
Bet must be divisible by 3`);
          } else {
            goodToPlace = true;
          }
          break;
        case 6:
        case 8:
          if (stagedBet % 5 != 0) {
            alert(`Don\'t Come Bet Odds on ${selection} pays out 5:6.
Bet must be divisible by 6`);
          } else {
            goodToPlace = true;
          }
          break;
        case 4:
        case 10:
          if (stagedBet % 2 != 0) {
            alert(`Don\'t Come Bet Odds on ${selection} pays out 1:2.
Bet must be divisible by 2`);
          } else {
            goodToPlace = true;
            break;
          }
        }
      }
      if (goodToPlace == true) {
        add_chips_to_table(dontCome[selection].odds, stagedBet, 'side', 'odds', 'rotated');
        dontCome[selection].odds.amount = commit_bet(dontCome[selection].odds.amount);
        goodToPlace = false;
      }
    }
  }


function on_the_dont_come_line() { // Score Bets on Come Line or Move if Point
  if (sum == 7 || sum == 11) {
    message = 'Lost $' + dontCome.line.amount + ' on the Don\'t Come Line';
    remove_chips_from_table(dontCome.line);
    dontCome.line.amount = 0;
  } else if (sum == 2 || sum == 3) {
    message = 'Won $' + dontCome.line.amount + ' on the Don\'t Come Line';
    bankroll += dontCome.line.amount;
    update_bankroll();
  } else if (sum == 12) {
    message = 'Push on the Don\'t Come Line'
  } else {
    message = `$${dontCome.line.amount} Don\'t Come Bet moved`;
    dontCome[sum].amount = dontCome.line.amount;
    add_chips_to_table(dontCome[sum], dontCome.line.amount, 'face', 'table', 'normal');
    //if (moveDCBet == true) {
    remove_chips_from_table(dontCome.line);
    dontCome.line.amount = 0;
    //}
  }
  message_display(message);
}


function score_dont_come_bets() {
  message = '';
  if (sum == 2 || sum == 3 || sum == 11 || sum == 12) {
    return; // Do Nothing
  } else if (sum == 7) {
    // Win
    let payoutSubTotal = 0;
    for (const key in dontCome) {
      if (key == 'line') {
        break; // Skip
      } else {
        if (dontCome[key].amount != 0) {
        // Win 1:1 and get initial bet back
          payoutSubTotal += (dontCome[key].amount * 2);
          dontCome[key].amount = lose_bet(dontCome[key].amount);
          remove_chips_from_table(dontCome[key]);
        }
        if (dontCome[key].odds.amount != 0 && gameOn == true) {
          number = Number(key)
          switch (number) {
            case 4:
            case 10:
              payout = dontCome[number].odds.amount / 2;
              break;
            case 5:
            case 9:
              payout = dontCome[number].odds.amount * 2 / 3;
              break;
            case 6:
            case 8:
              payout = dontCome[number].odds.amount * 5 / 6;
              break;
          }
          payoutSubTotal += (payout + dontCome[key].odds.amount);
          remove_chips_from_table(dontCome[key].odds);
          dontCome[key].odds.amount = lose_bet(dontCome[key].odds.amount);
        }
      }
    }
    payout = payoutSubTotal;
    if (payout != 0) {
      bankroll += payout;
      update_bankroll();
      message = `Won $${payout} on the Don\'t Come Bets`;
    }
  } else {
    let lose = 0;
    lose = dontCome[sum].amount;
    if (lose != 0) {
      dontCome[sum].amount = lose_bet(dontCome[sum].amount);
      if (gameOn == true) {
        lose += dontCome[sum].odds.amount;
      } else {
        bankroll +- dontCome[sum].odds.amount;
        message_dispaly(`$${dontCome[sum].odds.amount} dc odds returned`)
      }
      dontCome[sum].odds.amount = lose_bet(dontCome[sum].odds.amount);
      message = `Lost $${lose} on the Don\'t Come Bet`;
      remove_chips_from_table(dontCome[sum]);
      remove_chips_from_table(dontCome[sum].odds);
    }
  }
  if (message != '') {message_display(message);}
}

// ((((((((((((((((((( BONUS BETS )))))))))))))))))))

function check_bonus_bet(sum) {
if (bonus.small.amount != 0) {
    allNumbersCircles[sum].style.backgroundColor = 'gold';
    allNumbersCircles[sum].textContent = '';
    bonus.small.hit[sum] = true;
  for (const key in bonus.small.hit) {
    if (bonus.small.hit[key] == true) {
      bonus.small.allHit = true;
    } else {
      bonus.small.allHit = false;
      break;
    }
  }
  if (bonus.small.allHit == true) {
    score_bonus_bet();
  }

  }
  if (bonus.tall.amount != 0) {
      allNumbersCircles[sum].style.backgroundColor = 'gold';
      allNumbersCircles[sum].textContent = '';
      bonus.tall.hit[sum] = true;
    for (const key in bonus.tall.hit) {
      if (bonus.tall.hit[key] == true) {
        bonus.tall.allHit = true;
      } else {
        bonus.tall.allHit = false;
        break;
      }
    }
    if (bonus.tall.allHit == true) {
      score_bonus_bet();
    }
  }
}

function score_bonus_bet() {
  if (bonus.small.allHit == true && bonus.small.paid == false) {
  payout = bonus.small.amount * 30;
  bankroll += (payout + bonus.small.amount);
  update_bankroll();
  for (i = 0; i < 4; i++) {
  message_display('All Small Bonus Bet Hit !');
  }
  message_display(`Won $${payout}`);
  remove_chips_from_table(bonus.small.chips);
  bonus.small.amount = lose_bet(bonus.small.amount);
  bonus.small.paid = true;
  }
  if (bonus.tall.allHit == true && bonus.tall.paid == false) {
    payout = bonus.tall.amount * 30;
    bankroll += (payout + bonus.tall.amount);
    update_bankroll();
    for (i = 0; i < 4; i++) {
    message_display('All Tall Bonus Bet Hit !');
    }
    message_display(`Won $${payout}`);
    remove_chips_from_table(bonus.tall.chips);
    bonus.tall.amount = lose_bet(bonus.tall.amount);
    bonus.tall.paid = true;
  }
  if (bonus.tall.allHit == true && bonus.small.allHit == true && bonus.all.paid == false) {
    payout = bonus.all.amount * 150;
    bankroll += (payout + bonus.all.amount);
    update_bankroll();
    message_display('Make \'Em All Bonus Bet Hit!');
    message_display(`Won $${payout}`);
    remove_chips_from_table(bonus.all.chips);
    bonus.all.amount = lose_bet(bonus.all.amount);
    bonus.all.paid = true;
  }
}
function clear_bonus_bet() {
  bonus.small.amount = 0;
  bonus.all.amount = 0;
  bonus.tall.amount = 0;
  bonus.small.allHit = false;
  bonus.small.paid = false;
  bonus.tall.allHit = false;
  bonus.tall.paid = false;
  bonus.all.paid = false;

  for (const key in bonus.small.hit) {
    bonus.small.hit[key] = false;
    bonus.tall.hit[key + 6] = false;
  }
}

// ####################################################################################
// ###################### EVENT LISTENERS #############################################
// ####################################################################################
let prevClicked;
const mainArea = document.getElementById('main-area');

mainArea.addEventListener('keydown', (event) => {
  if (event.key == 'Enter') {
    rollButton.click();
    prevClicked.blur();
    rollButton.focus();
  }
});

increment1.addEventListener('click', function() {increment(1)});
increment5.addEventListener('click', function() {increment(5)});
increment25.addEventListener('click', function() {increment(25)});
increment100.addEventListener('click', function() {increment(100)});
decrement1.addEventListener('click', function() {decrement(1)});
decrement5.addEventListener('click', function() {decrement(5)});
decrement25.addEventListener('click', function() {decrement(25)});
decrement100.addEventListener('click', function() {decrement(100)});
let isCoolDown = false;

rollButton.addEventListener('click', function() {
  if (isCoolDown) return;
    roll_dice();
    isCoolDown = true;
    setTimeout (() => {
      isCoolDown = false;
    }, 1200);
});

pullBackButton.addEventListener('click', pull_back_in_progress);
clearBetButton.addEventListener('click', reset_stagedBet);

// -------------------------------- Table ---------------------------------




bonus.small.button.addEventListener('click', (e) => {
  if (stagedBet == 0 || stagedBet > bankroll || bonus.small.paid == true) {
  // Do nothing
  } else if (gameOn == true) {
    alert('Warning: Can only place bonus bets while game is off');
  } else {
    add_chips_to_table(bonus.small.chips, stagedBet, 'face', 'table', 'normal');
    bonus.small.amount = commit_bet(bonus.small.amount);
  }
  prevClicked = bonus.small.button;
});
bonus.all.button.addEventListener('click', (e) => {
  if (stagedBet == 0 || stagedBet > bankroll || bonus.all.paid == true) {
  // Do nothing
  } else if (gameOn == true) {
    alert('Warning: Can only place bonus bets while game is off');
  } else {
    add_chips_to_table(bonus.all.chips, stagedBet, 'face', 'table', 'normal');
    bonus.all.amount = commit_bet(bonus.all.amount);
  }
  prevClicked = bonus.all.button;
});
bonus.tall.button.addEventListener('click', (e) => {
  if (stagedBet == 0 || stagedBet > bankroll || bonus.tall.paid == true) {
  // Do nothing
  } else if (gameOn == true) {
    alert('Warning: Can only place bonus bets while game is off');
  } else {
    add_chips_to_table(bonus.tall.chips, stagedBet, 'face', 'table', 'normal');
    bonus.tall.amount = commit_bet(bonus.tall.amount);
  }
  prevClicked = bonus.tall.button;
});


placeBet.button[4].addEventListener('click', (e) => {
  if (pullBackInProgress == true) {
    remove_chips_from_table(placeBet.chips[4]);
    placeBet.bet[4] = pull_back_bet(placeBet.bet[4]);
  } else {
    place_bet(4);
  }
  prevClicked = placeBet.button[4];
});
placeBet.button[5].addEventListener('click', (e) => {
  if (pullBackInProgress == true) {
    remove_chips_from_table(placeBet.chips[5]);
    placeBet.bet[5] = pull_back_bet(placeBet.bet[5]);
  } else {
    if (stagedBet % 5 != 0) {
      alert('5 pays out 7:5. Bet must be divisible by 5')
    } else {
      place_bet(5);
    }
  }
  prevClicked = placeBet.button[5];
});
placeBet.button[6].addEventListener('click', (e) => {
  if (pullBackInProgress == true) {
    remove_chips_from_table(placeBet.chips[6]);
    placeBet.bet[6] = pull_back_bet(placeBet.bet[6]);
  } else {
    if (stagedBet % 6 != 0) {
      alert('6 pays out 7:6. Bet must be divisible by 6')
    } else {
      place_bet(6);
    }
  }
  prevClicked = placeBet.button[6];
});
placeBet.button[8].addEventListener('click', (e) => {
  if (pullBackInProgress == true) {
    remove_chips_from_table(placeBet.chips[8]);
    placeBet.bet[8] = pull_back_bet(placeBet.bet[8]);
  } else {
    if (stagedBet % 6 != 0) {
      alert('8 pays out 7:6. Bet must be divisible by 6')
    } else {
      place_bet(8);
    }
  }
  prevClicked = placeBet.button[8];
});
placeBet.button[9].addEventListener('click', (e) => {
  if (pullBackInProgress == true) {
    remove_chips_from_table(placeBet.chips[9]);
    placeBet.bet[9] = pull_back_bet(placeBet.bet[9]);
  } else {
    if (stagedBet % 5 != 0) {
      alert('9 pays out 7:5. Bet must be divisible by 5')
    } else {
      place_bet(9);
    }
  }
  prevClicked = placeBet.button[9];
});
placeBet.button[10].addEventListener('click', (e) => {
  if (pullBackInProgress == true) {
    remove_chips_from_table(placeBet.chips[10]);
    placeBet.bet[10] = pull_back_bet(placeBet.bet[10]);
  } else {
    place_bet(10);
  }
  prevClicked = placeBet.button[10];
});

// Dont Come Line
dontCome.line.button.addEventListener('click', (e) => {
  if (gameOn == false) {
    alert('You cannot bet on the Don\'t Come Line until a point has been established.');
  } else {
    dont_come_bet();
  }
  prevClicked = line.button;
});

dontCome[4].button.addEventListener('click', (e) => {
  if (stagedBet < minBet && pullBackInProgress != true) {
    alert('Minimum Bet is $' + minBet);
  } else if (pullBackInProgress == true) {
    remove_chips_from_table(dontCome[4].odds);
    dontCome[4].odds.amount = pull_back_bet(dontCome[4].odds.amount);
  } else if (stagedBet == 0) {
  // Do nothing
  } else {
    dont_come_bet_odds(4);
  }
  prevClicked = dontCome[4].button;
});
dontCome[5].button.addEventListener('click', (e) => {
  if (stagedBet < minBet && pullBackInProgress != true) {
    alert('Minimum Bet is $' + minBet);
  } else if (pullBackInProgress == true) {
    remove_chips_from_table(dontCome[5].odds);
    dontCome[5].odds.amount = pull_back_bet(dontCome[5].odds.amount);
  } else if (stagedBet == 0) {
  // Do nothing
  } else {
    dont_come_bet_odds(5);
  }
  prevClicked = dontCome[5].button;
});
dontCome[6].button.addEventListener('click', (e) => {
  if (stagedBet < minBet && pullBackInProgress != true) {
    alert('Minimum Bet is $' + minBet);
  } else if (pullBackInProgress == true) {
    remove_chips_from_table(dontCome[6].odds);
    dontCome[6].odds.amount = pull_back_bet(dontCome[6].odds.amount);
  } else if (stagedBet == 0) {
  // Do nothing
  } else {
    dont_come_bet_odds(6);
  }
  prevClicked = dontCome[6].button;
});
dontCome[8].button.addEventListener('click', (e) => {
  if (stagedBet < minBet && pullBackInProgress != true) {
    alert('Minimum Bet is $' + minBet);
  } else if (pullBackInProgress == true) {
    remove_chips_from_table(dontCome[8].odds);
    dontCome[8].odds.amount = pull_back_bet(dontCome[8].odds.amount);
  } else if (stagedBet == 0) {
  // Do nothing
  } else {
    dont_come_bet_odds(8);
  }
  prevClicked = dontCome[8].button;
});
dontCome[9].button.addEventListener('click', (e) => {
  if (stagedBet < minBet && pullBackInProgress != true) {
    alert('Minimum Bet is $' + minBet);
  } else if (pullBackInProgress == true) {
    remove_chips_from_table(dontCome[9].odds);
    dontCome[9].odds.amount = pull_back_bet(dontCome[9].odds.amount);
  } else if (stagedBet == 0) {
  // Do nothing
  } else {
    dont_come_bet_odds(9);
  }
  prevClicked = dontCome[9].button;
});
dontCome[10].button.addEventListener('click', (e) => {
  if (stagedBet < minBet && pullBackInProgress != true) {
    alert('Minimum Bet is $' + minBet);
  } else if (pullBackInProgress == true) {
    remove_chips_from_table(dontCome[10].odds);
    dontCome[10].odds.amount = pull_back_bet(dontCome[10].odds.amount);
  } else if (stagedBet == 0) {
  // Do nothing
  } else {
    dont_come_bet_odds(10);
  }
  prevClicked = dontCome[10].button;
});

// Come Line
// Cannot place bet on come line until point is established
numberBoxElement.four.addEventListener('click', (e) => {
  // need pull back bet
  if (stagedBet < minBet && pullBackInProgress != true) {
    alert('Minimum Bet is $' + minBet);
  } else if (pullBackInProgress == true) {
    remove_chips_from_table(come[4].odds);
    come[4].odds.amount = pull_back_bet(come[4].odds.amount);
  } else if (stagedBet == 0) {
  // Do nothing
  } else {
    come_bet_odds(4);
  }
  prevClicked = numberBoxElement.four;
});
numberBoxElement.five.addEventListener('click', (e) => {
  if (stagedBet < minBet && pullBackInProgress != true) {
    alert('Minimum Bet is $' + minBet);
  } else if (pullBackInProgress == true) {
    remove_chips_from_table(come[5].odds);
    come[5].odds.amount = pull_back_bet(come[5].odds.amount);
  } if (stagedBet == 0) {
  // Do nothing
  } else {
    come_bet_odds(5);
  }
  prevClicked = numberBoxElement.five;
});
numberBoxElement.six.addEventListener('click', (e) => {
  if (stagedBet < minBet && pullBackInProgress != true) {
    alert('Minimum Bet is $' + minBet);
  } else if (pullBackInProgress == true) {
    remove_chips_from_table(come[6].odds);
    come[6].odds.amount = pull_back_bet(come[6].odds.amount);
  } else if (stagedBet == 0) {
  // Do nothing
  } else {
    come_bet_odds(6);
  }
  prevClicked = numberBoxElement.six;
});
numberBoxElement.eight.addEventListener('click', (e) => {
  if (stagedBet < minBet && pullBackInProgress != true) {
    alert('Minimum Bet is $' + minBet);
  } else if (pullBackInProgress == true) {
    remove_chips_from_table(come[8].odds);
    come[8].odds.amount = pull_back_bet(come[8].odds.amount);
  } else if (stagedBet == 0) {
  // Do nothing
  } else {
    come_bet_odds(8);
  }
  prevClicked = numberBoxElement.eight;
});
numberBoxElement.nine.addEventListener('click', (e) => {
  if (stagedBet < minBet && pullBackInProgress != true) {
    alert('Minimum Bet is $' + minBet);
  } else if (pullBackInProgress == true) {
    remove_chips_from_table(come[9].odds);
    come[9].odds.amount = pull_back_bet(come[9].odds.amount);
  } else if (stagedBet == 0) {
  // Do nothing
  } else {
    come_bet_odds(9);
  }
  prevClicked = numberBoxElement.nine;
});
numberBoxElement.ten.addEventListener('click', (e) => {
  if (stagedBet < minBet && pullBackInProgress != true) {
    alert('Minimum Bet is $' + minBet);
  } else if (pullBackInProgress == true) {
    remove_chips_from_table(come[10].odds);
    come[10].odds.amount = pull_back_bet(come[10].odds.amount);
  } else if (stagedBet == 0) {
  // Do nothing
  } else {
    come_bet_odds(10);
  }
  prevClicked = numberBoxElement.ten;
});
come.line.button.addEventListener('click', (e) => {
  if (gameOn == false) {
    alert('You cannot bet on the Come Line until a point has been established.');
  } else {
    come_bet();
  }
  prevClicked = come.line.button;
});

// Field
field.button.addEventListener('click', (e) => {
  if (pullBackInProgress == true && field.bet != 0) {
    remove_chips_from_table(field.chips);
    field.bet = pull_back_bet(field.bet);
  } else {
    field_bet();
  }
  prevClicked = field.button;
});

dontPassBar.button.addEventListener('click', (e) => {
  if (pullBackInProgress == true && gameOn == false) { // Could probably branch these in pullbackinprogress
    remove_chips_from_table(dontPassBar.chips);
    dontPassBar.bet = pull_back_bet(dontPassBar.bet);
  } else if (pullBackInProgress == true && gameOn == true) {
    alert('Cannont Pull Back While Game is On.');
    reset_stagedBet();
  } else if (dontPassBar.bet != 0) {
  //Do nothing
  } else if (gameOn == false) {
    dont_pass_line();
  } // else game is on and click does nothing
  prevClicked = dontPassBar.button;
});

passLine.button.addEventListener('click', (e) => {
  if (pullBackInProgress == true && gameOn == false) { // Could probably branch these in pullbackinprogress
    remove_chips_from_table(passLine.chips);
    passLine.amount = pull_back_bet(passLine.amount); // Sets value to 0
    rollButton.classList.add('hidden');
  } else if (pullBackInProgress == true && gameOn == true) {
    alert('Cannont Pull Back Pass Line While Game is On.');
    reset_stagedBet();
  } else if (passLine.amount != 0) {
  //Do nothing
  } else if (gameOn == false) {
    
    pass_line();
  } // else game is on and click does nothing
  prevClicked = passLine.button;
});

passLine.odds.button.addEventListener('click', (e) => {
  if (pullBackInProgress == true && passLine.odds.amount != 0) {
    remove_chips_from_table(passLine.odds.chips);
    passLine.odds.amount = pull_back_bet(passLine.odds.amount);
  } else if (stagedBet == 0) {
  // Do nothing
  } else {
    if (target == 0) {
      alert('Cannot place Pass Line Odds until point is established');
    } else if (passLine.odds.amount != 0) {
      alert('Already have Pass Line Odds, pull back bet to change');
    } else if (stagedBet < minBet) {
      alert('Minimum Bet is' + minBet);
    } else if ((target == 5 || target == 9) && stagedBet % 2 != 0) {
      alert(`Payout for Pass Line Odds on the ${target} is 3:2. Bet must be divisible by 2`);
    } else if ((target == 6 || target == 8) && stagedBet % 5 != 0) {
      alert(`Payout for Pass Line Odds on the ${target} is 6:5. Bet must be divisible by 5`);
    } else {
      pass_line_odds();
    }
  }
  prevClicked = passLine.oddsButton;
});

// ---------------- HARDWAYS -------------------------- HARDWAYS----------------------

hard[4].button.addEventListener('click', (e) => {
  if (pullBackInProgress == true) {
    remove_chips_from_table(hard[4].chips);
    hard[4].amount = pull_back_bet(hard[4].amount);
  } else {
    hardways_bet(4);
  }
  prevClicked = hard[4].button;
});
hard[6].button.addEventListener('click', (e) => {
  if (pullBackInProgress == true) {
    remove_chips_from_table(hard[6].chips);
    hard[6].amount = pull_back_bet(hard[6].amount);
  } else {
    hardways_bet(6);
  }
  prevClicked = hard[6].button;
});
hard[8].button.addEventListener('click', (e) => {
  if (pullBackInProgress == true) {
    remove_chips_from_table(hard[8].chips);
    hard[8].amount = pull_back_bet(hard[8].amount);
  } else {
    hardways_bet(8);
  }
  prevClicked = hard[8].button;
});
hard[10].button.addEventListener('click', (e) => {
  if (pullBackInProgress == true) {
    remove_chips_from_table(hard[10].chips);
    hard[10].amount = pull_back_bet(hard[10].amount);
  } else {
    hardways_bet(10);
  }
  prevClicked = hard[10].button;
});

// -------------- horn BETS --------------------------- horn BETS -------------------

horn[2].button.addEventListener('click', (e) => {
  if (pullBackInProgress == true) {
    remove_chips_from_table(horn[2].chips);
    horn[2].amount = pull_back_bet(horn[2].amount);
  } else {
    horn_bet(2);
  }
  prevClicked = horn[2].button;
});
horn[3].button.addEventListener('click', (e) => {
  if (pullBackInProgress == true) {
    remove_chips_from_table(horn[3].chips);
    horn[3].amount = pull_back_bet(horn[3].amount);
  } else {
    horn_bet(3);
  } 
  prevClicked = horn[3].button;
});
horn[11].button.addEventListener('click', (e) => {
  if (pullBackInProgress == true) {
    remove_chips_from_table(horn[11].chips);
    horn[11].amount = pull_back_bet(horn[11].amount);
  } else {
    horn_bet(11);
  }
  prevClicked = horn[11].button;
});
horn[12].button.addEventListener('click', (e) => {
  if (pullBackInProgress == true) {
    remove_chips_from_table(horn[12].chips);
    horn[12].amount = pull_back_bet(horn[12].amount);
  } else {
    horn_bet(12);
  }
  prevClicked = horn[12].button;
});
// ^^^^^^^^^^^^^^^^^^^^^^^^^ END EVENT LISTENERS ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^



