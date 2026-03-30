// Things to do:
// 3) Need buy options on the 4 and 10
// 5) Come/Dont come odds formatting gets messed up
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
let passLineBet = 0;
let passLineOdds = 0;
let dontPassBet = 0;
let placeBet = {4:0, 5:0, 6:0, 8:0, 9:0, 10:0};
let payout = 0;
let hardwaysBet = {4:0, 6:0, 8:0, 10:0};
let crapsBet = {2:0, 3:0, 11:0, 12:0};
let fieldBet = 0;
let stagedComeBet = 0;
let comeBet = {4:0, 5:0, 6:0, 8:0, 9:0, 10:0};
let comeBetOdds = {4:0, 5:0, 6:0, 8:0, 9:0, 10:0};
let stagedDontComeBet = 0;
let dontComeBet = {4:0, 5:0, 6:0, 8:0, 9:0, 10:0};
let dontComeBetOdds = {4:0, 5:0, 6:0, 8:0, 9:0, 10:0};
let chipStructure = {
  platinum: 0,
  brown: 0,
  gold: 0,
  purple: 0,
  black: 0,
  green: 0,
  red: 0,
  white: 0};
let prevChipStructure = {
  platinum: 0,
  brown: 0,
  gold: 0,
  purple: 0,
  black: 5,
  green: 0,
  red: 0,
  white: 0};
let prevStagedBet = 0;

let smallNumbersHit = {2:false, 3:false, 4:false, 5:false, 6:false};
let tallNumbersHit = {8:false, 9:false, 10:false, 11:false, 12:false};
let smallNumbersBet = 0;
let allSmallTrue = false;
let allSmallPaid = false;
let allNumbersBet = 0;
let makeEmAllPaid = false;
let tallNumbersBet = 0;
let allTallTrue = false;
let allTallPaid = false;

// Animation Variable
let soundDelay = 0;

window.addEventListener('load', (e) => {
  let rand = Math.ceil(Math.random() * 5);
  let location = `img/casino_0${rand}.jpg`;
  document.body.style.backgroundImage = "url('"+location+"')";
  load_bankroll_chips();
});

// Numbers/Messages
const betElement = document.getElementById('staged-bet');
const betContainerElement = document.getElementById('staged-bet-container');
const bankrollElement = document.getElementById('bankroll-amount');

const dice1Element = document.getElementById('dice1');
const dice2Element = document.getElementById('dice2');

//const rollMessageElement = document.getElementById('roll-box');
// Goodbye roll box
//const messageElement = document.getElementById('message-box');
// Testing Elements
const moneyOnTableElement = document.getElementById('money-on-table');

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
  two: document.getElementById('small-2'),
  three: document.getElementById('small-3'),
  four: document.getElementById('small-4'),
  five: document.getElementById('small-5'),
  six: document.getElementById('small-6'),
  eight: document.getElementById('small-8'),
  nine: document.getElementById('small-9'),
  ten: document.getElementById('small-10'),
  eleven: document.getElementById('small-11'),
  twelve: document.getElementById('small-12')
}
const smallNumbersButton = document.getElementById('small-button');
const allNumbersButton = document.getElementById('all-button');
const tallNumbersButton = document.getElementById('tall-button');

const numberBoxElement = {
  four: document.getElementById('number-box-4'),
  five: document.getElementById('number-box-5'),
  six: document.getElementById('number-box-6'),
  eight: document.getElementById('number-box-8'),
  nine: document.getElementById('number-box-9'),
  ten: document.getElementById('number-box-10')
}
const comeLineElement = document.getElementById('come');
const comeLineChipsDisplayElement = document.getElementById('come-chips-display');
const comeBetChipsDisplayElement = {
  four: document.getElementById('come-4'),
  five: document.getElementById('come-5'),
  six: document.getElementById('come-6'),
  eight: document.getElementById('come-8'),
  nine: document.getElementById('come-9'),
  ten: document.getElementById('come-10')
}
const comeBetOddsElement = {
  four: document.getElementById('come-4-odds'),
  five: document.getElementById('come-5-odds'),
  six: document.getElementById('come-6-odds'),
  eight: document.getElementById('come-8-odds'),
  nine: document.getElementById('come-9-odds'),
  ten: document.getElementById('come-10-odds')
}

const dontComeLineElement = document.getElementById('dont-come');
const dontComeBottom = document.getElementById('place-blank');
const dontComeLineChipsDisplayElement = document.getElementById('dont-come-chips-display');
const dontComeButton = {
  four: document.getElementById('dont-come-container-4'),
  five: document.getElementById('dont-come-container-5'),
  six: document.getElementById('dont-come-container-6'),
  eight: document.getElementById('dont-come-container-8'),
  nine: document.getElementById('dont-come-container-9'),
  ten: document.getElementById('dont-come-container-10')
}
const dontComeBetChipsDisplayElement = {
  four: document.getElementById('dc-4'),
  five: document.getElementById('dc-5'),
  six: document.getElementById('dc-6'),
  eight: document.getElementById('dc-8'),
  nine: document.getElementById('dc-9'),
  ten: document.getElementById('dc-10')
}
const dontComeBetOddsElement = {
  four: document.getElementById('dc-4-odds'),
  five: document.getElementById('dc-5-odds'),
  six: document.getElementById('dc-6-odds'),
  eight: document.getElementById('dc-8-odds'),
  nine: document.getElementById('dc-9-odds'),
  ten: document.getElementById('dc-10-odds')
}

const placeBetElement = {
  four: document.getElementById('place-4-button'),
  five: document.getElementById('place-5-button'),
  six: document.getElementById('place-6-button'),
  eight: document.getElementById('place-8-button'),
  nine: document.getElementById('place-9-button'),
  ten: document.getElementById('place-10-button')
}
const dontcomeLineChipsDisplayElement = {
  four: document.getElementById('dc-4'),
  five: document.getElementById('dc-5'),
  six: document.getElementById('dc-6'),
  eight: document.getElementById('dc-8'),
  nine: document.getElementById('dc-9'),
  ten: document.getElementById('dc-10')
}

const hardwaysElement = {
  four: document.getElementById('hard-4-button'),
  six: document.getElementById('hard-6-button'),
  eight: document.getElementById('hard-8-button'),
  ten: document.getElementById('hard-10-button')
}

const hardwaysTextElement = {
  four: document.getElementById('hw-4-text'),
  six: document.getElementById('hw-6-text'),
  eight: document.getElementById('hw-8-text'),
  ten: document.getElementById('hw-10-text')
}

const crapsElement = {
  two: document.getElementById('craps-2-button'),
  three: document.getElementById('craps-3-button'),
  eleven: document.getElementById('craps-11-button'),
  twelve: document.getElementById('craps-12-button')
}
const crapsTextElement = {
  two: document.getElementById('craps-2-text'),
  three: document.getElementById('craps-3-text'),
  eleven: document.getElementById('craps-11-text'),
  twelve: document.getElementById('craps-12-text')
}



const fieldElement = document.getElementById('field');
const fieldChipsDisplayElement = document.getElementById('field-chips-display');

const dontPassBarElement = document.getElementById('dont-pass');
const dontPassBarChipsDisplay = document.getElementById('dont-pass-chips-display');

const passLineElement = document.getElementById('pass-line');


const passLineOddsElement = document.getElementById('pass-line-odds');

const original = {
  passLineElement: passLineElement.textContent,
  betElementStyle: betElement.style,
  hardwaysTextElementStyle: hardwaysTextElement.four.textContent
}
// $$$$$$$$$$$$$$$$$$ CHIPS DISPLAY OBJECTS $$$$$$$$$$$$$$$$ //
let placeBetFourChips = {
  location: document.getElementById('place-4-chips'),
  chip: [],
  leftSpacing: 194
};

let placeBetFiveChips = {
  location: document.getElementById('place-5-chips'),
  chip: [],
  leftSpacing: 336
};

let placeBetSixChips = {
  location: document.getElementById('place-6-chips'),
  chip: [],
  leftSpacing: 478
};

let placeBetEightChips = {
  location: document.getElementById('place-8-chips'),
  chip: [],
  leftSpacing: 620
};

let placeBetNineChips = {
  location: document.getElementById('place-9-chips'),
  chip: [],
  leftSpacing: 762
};

let placeBetTenChips = {
  location: document.getElementById('place-10-chips'),
  chip: [],
  leftSpacing: 900
};

let hardwaysChips = {
  six: {
    location: document.getElementById('hard-6-chips'),
    chip: [],
    leftSpacing: 1092

  },
  eight: {
    location: document.getElementById('hard-8-chips'),
    chip: [],
    leftSpacing: 1092
  },
  ten: {
    location: document.getElementById('hard-10-chips'),
    chip: [],
    leftSpacing: 1262
  },
  four: {
    location: document.getElementById('hard-4-chips'),
    chip: [],
    leftSpacing: 1262
  }
}

let crapsChips = {
  three: {
    location: document.getElementById('craps-3-chips'),
    chip: [],
  leftSpacing: 1092
  },
  twelve: {
    location: document.getElementById('craps-12-chips'),
    chip: [],
  leftSpacing: 1262
  },
  two: {
    location: document.getElementById('craps-2-chips'),
    chip: [],
  leftSpacing: 1262
  },
  eleven: {
    location: document.getElementById('craps-11-chips'),
    chip: [],
  leftSpacing: 1092
  }
}

let comeBetChips = {
  line: {
    location: document.getElementById('come-chips-display'),
    chip: [],
    leftSpacing: 75
  },
  4: {
    location: document.getElementById('come-4'),
    chip: [],
    leftSpacing: 32
  },
  5: {
    location: document.getElementById('come-5'),
    chip: [],
    leftSpacing: 32
  },
  6: {
    location: document.getElementById('come-6'),
    chip: [],
    leftSpacing: 32
  },
  8: {
    location: document.getElementById('come-8'),
    chip: [],
    leftSpacing: 32
  },
  9: {
    location: document.getElementById('come-9'),
    chip: [],
    leftSpacing: 32
  },
  10: {
    location: document.getElementById('come-10'),
    chip: [],
    leftSpacing: 32
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


let passLineChips = {
  location: document.getElementById('pass-line-chips'),
  chip: []
};

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

  

function add_chips_to_table(object, stagedBet) {
//chip structure
// object.location is the div element where the chips are going
// object.chip is an array where each chip img will get stored
// class table-chip-img is the size of the chip 60px x 60px
  let index = 0;
  let chipCount = 0;
  object.chip = [];
  chipStructure = get_chip_structure(stagedBet); // of the stagedBet

  for (const color in chipStructure) {
    if (chipStructure[color] != 0) {
      for (i = 0; i < chipStructure[color]; i++) {
        index = object.chip.length;
        object.chip[index] = document.createElement('img');
        thisChip = object.chip[index];
        thisChip.src = `img/chips/face/${chipDisplay}/${color}_chip.png`;
        thisChip.classList.add('table-chip-img');
        thisChip.style.marginLeft = `${chipCount * 12}px`;
        object.location.appendChild(thisChip);
        chipCount += 1;
      }
    }
  }
  object.location.style.left = `${object.leftSpacing - (chipCount-1) * 6}px`;
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
    playSound = true;
    play_decrement_sound();
    update_staged_bet_chips();
  }
  
}

function update_moneyOnTable() {
  moneyOnTableElement.textContent = '$' + moneyOnTable;
}

function message_display(message) {
  rollName = display_roll_message(sum);
  newMessage = rollName + ' - ' + message;
  document.getElementById('message-5').textContent = document.getElementById('message-4').textContent;
  document.getElementById('message-4').textContent = document.getElementById('message-3').textContent;
  document.getElementById('message-3').textContent = document.getElementById('message-2').textContent;
  document.getElementById('message-2').textContent = document.getElementById('message-1').textContent;
  document.getElementById('message-1').textContent = newMessage;
}

function clear_table() {
  message = 'All bets cleared';
  message_display(message);
  if (dontPassBet != 0) {
    moneyOnTable = dontPassBet;
  } else {
    moneyOnTable = 0;
  }
  update_moneyOnTable();

  remove_chips_from_table(passLineChips);
  passLineBet = 0;
  passLineOddsElement.textContent = '';
  passLineOdds = 0;

  for (const key in placeBet) {
    placeBet[key] = 0;
    //reset_place_bet_text(key);
  }

  hardwaysTextElement.four.style = original.hardwaysTextElementStyle;
  hardwaysTextElement.six.style = original.hardwaysTextElementStyle;
  hardwaysTextElement.eight.style = original.hardwaysTextElementStyle;
  hardwaysTextElement.ten.style = original.hardwaysTextElementStyle;
  hardwaysTextElement.four.textContent = '7 to 1';
  hardwaysTextElement.six.textContent = '9 to 1';
  hardwaysTextElement.eight.textContent = '9 to 1';
  hardwaysTextElement.ten.textContent = '7 to 1';
  hardwaysBet[4] = 0;
  hardwaysBet[6] = 0;
  hardwaysBet[8] = 0;
  hardwaysBet[10] = 0;
  // Clear Come Bets
  for (const key in comeBet) {
    comeBet[key] = 0;
    reset_come_bet_text(key);
  }
// Clear Come Bet Odds
  for (const key in comeBetOdds) {
    comeBetOdds[key] = 0;
    reset_come_bet_odds_text(key);
  }
}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%% DICE ROLL -- GAME ON/OFF %%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%% MAIN SCORE FUNCTION %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function roll_dice() {
  pullBackInProgress = false;
  if (passLineBet == 0 && dontPassBet == 0) {
    alert('You must play the pass line to roll')
  } else {
    reset_stagedBet();
    //messageElement.textContent = ''; probable need to delete
    dice1 = Math.floor(Math.random()*6) + 1;
    dice2 = Math.floor(Math.random()*6) + 1;
    sum = dice1 + dice2;

    if (smallNumbersBet != 0 || allNumbersBet != 0 || tallNumbersBet != 0) {
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
    if (gameOn == false) {
      come_out_roll();
    } else {
      score_roll();
    }
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function diceThrowAnimation() {
  diceDisplay.classList.toggle('dice-move');
  dice.one.classList.toggle('dice-grow');
  dice.two.classList.toggle('dice-grow');
  await delay(1500);
  diceDisplay.classList.toggle('dice-move');
  dice.one.classList.toggle('dice-grow');
  dice.two.classList.toggle('dice-grow');
}

function display_on_marker() {
const onIMG = document.getElementById(`on-${target}`);
  onIMG.classList.toggle('hidden');
  onIMG.style.zIndex = '20';
  document.getElementById(`dont-come-container-${target}`).style.zIndex = '0';
  offPuckElement.classList.toggle('hidden');
}
function remove_on_marker() {
  document.getElementById(`on-${target}`).classList.toggle('hidden');
  document.getElementById(`on-${target}`).style.zIndex = '-1';
  document.getElementById(`dont-come-container-${target}`).style.zIndex = '1';
  offPuckElement.classList.toggle('hidden');
}

function display_roll_message(sum) {
  if (sum == 2) {
    rollName = 'Snake Eyes';
  } else if (sum == 3) {
    rollName = 'Craps ' + sum;
  } else if (sum == 7) {
    if (gameOn == false) {
      rollName = '7 Winner';
    } else {
      rollName = '7 Out';
    }
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
  if (dontPassBet != 0) {
    if (sum == 7 || sum == 11) {
      message = `Lost $${dontPassBet} on the Don\'t Pass Line`;
      message_display(message);
      dontPassBarChipsDisplay.textContent = '';
      moneyOnTable -= dontPassBet;
      dontPassBet = 0;
      update_moneyOnTable();
    } else if (sum == 2 || sum == 3) {
      message = 'Won $' + dontPassBet + ' on the Don\'t Pass Line';
      message_display(message);
      bankroll += dontPassBet;
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
  if (passLineBet != 0) {
    if (sum == 2 || sum == 3 || sum == 12) {
      message = 'Lost $' + passLineBet + ' on the Pass Line';
      message_display(message);
      remove_chips_from_table(passLineChips);
      moneyOnTable -= passLineBet;
      passLineBet = 0;
      update_moneyOnTable();
    } else if (sum == 7 || sum == 11) {
      message = 'Won $' + passLineBet + ' on the Pass Line';
      message_display(message);
      bankroll += passLineBet;
      update_bankroll();
    } else {
      target = sum; // Target assigned
      gameOn = true;
      message = 'Point Established';
      message_display(message);
      display_on_marker();
      if (placeBet[target] != 0) {
        move_behind_pass_line();
      }
    }
  }

  if (comeBet[sum] != 0 && comeBet[sum] != undefined) {
    score_come_bets();
  }
  // Have to score any existing DC bets
  if (dontComeBet[sum] != 0 && dontComeBet[sum] != undefined) {
    score_dont_come_bets();
  }

  score_craps_bets();
}

function move_behind_pass_line() {
  setTimeout (() => { 
    moveBehindPassLine = confirm(`Would you like to move your $${placeBet[target]} 
Place Bet Behind the Pass Line for better odds?`)
}, 1500);
  if (moveBehindPassLine == true) {
    if ((target == 5 || target == 9) && placeBet[target] % 2 != 0) {
      roundUpBet = confirm(`You need to round up your bet. Ok to confirm. Otherwise bet stays as is`);
      if (roundUpBet == true) {
        passLineOdds = placeBet[target] + 1;
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
    if (passLineOdds == 0) {
      passLineOdds = placeBet[target];
    }
    placeBet[target] = 0;
    passLineOddsElement.textContent = '$' + passLineOdds;
    switch (target) {
      case 4:
        placeBetElement.four.textContent = '';
        break;
      case 5:
        placeBetElement.five.textContent = '';
        break;
      case 6:
        placeBetElement.six.textContent = '';
        break;
      case 8:
        placeBetElement.eight.textContent = '';
        break;
      case 9:
        placeBetElement.nine.textContent = '';
        break;
      case 10:
        placeBetElement.ten.textContent = '';
        break;
    }
  } else {
    message = 'Player not moving Place Bet';
    message_display(message);
  }
}

function score_roll() {
  // Score bets on come line first in case of 7 out

  if (sum == 7) {
  //on_the_come_line(); // To score that elusive come line before it gets cleared
    score_dont_come_bets();
    clear_table();
    score_pass_line();
    gameOn = false;
    remove_on_marker();
  }
  // Place Bets
  for (const key in placeBet) {
    if (placeBet[key] !== 0 && placeBet[key] != undefined && key == sum) {
      score_place_bets(sum);
      break;
    }
  }
  // Hard ways bets
    if (sum == 4 || sum == 6 || sum == 8 || sum == 10) {
      if (hardwaysBet[sum] != 0 && dice1 != dice2) {
        switch (sum) {
          case 4:
            hardwaysTextElement.four.textContent = '7 to 1';
            hardwaysTextElement.four.style = original.hardwaysTextElementStyle;
            break;
          case 6:
            hardwaysTextElement.six.textContent = '9 to 1';
            hardwaysTextElement.six.style = original.hardwaysTextElementStyle;
            break;
          case 8:
            hardwaysTextElement.eight.textContent = '9 to 1';
            hardwaysTextElement.eight.style = original.hardwaysTextElementStyle;
            break;
          case 10:
            hardwaysTextElement.ten.textContent = '7 to 1';
            hardwaysTextElement.ten.style = original.hardwaysTextElementStyle;
            break;
        }
        message = `${sum} not hard. Lose your $${hardwaysBet[sum]} bet.`;
        message_display(message);
        hardwaysBet[sum] = lose_bet(hardwaysBet[sum]);
      } else if (hardwaysBet[sum] !== 0 && dice1 == dice2) {
        score_hardways_bets(sum);
      }
    }
  // One Roll Bets
  score_craps_bets();
  // Field Bet
  if (fieldBet != 0) {
  score_field_bet();
  }

  // Come Line
  // Score the come bets that have been moved first so they don't get moved and
  // scored on the same roll

  // Come Bet Still working when game goes off - wins when number hit - loses on 7
  // Come Bet odds go off when game is off
  // Initial bet returned to the player when win

  if (comeBet[sum] != 0 && comeBet[sum] != undefined) {
  score_come_bets();
  }

  if (stagedComeBet != 0) {
  on_the_come_line();
  }
  // Dont Come Bets
  // This one won't give you point but only take away when dontComeBet # is hit
  if (dontComeBet[sum] != 0 && dontComeBet[sum] != undefined) {
  score_dont_come_bets();
  }

  if (stagedDontComeBet != 0) {
  on_the_dont_come_line();
  }

  if (sum == target) {
    gameOn = false;
    score_pass_line();
    message = 'Player hit the target. Game goes off';
    message_display(message);
    remove_on_marker();
    target = 0;
    passLineOddsElement.textContent = '';
  }
}

// ########################################################################
// #################### BET PLACEMENT AND SCORING #########################
// ########################################################################

// PASS LINE AND DONT PASS BAR
function pass_line() { // adds bet to pass line
  if (stagedBet >= minBet) {
    add_chips_to_table(passLineChips, stagedBet);
    passLineBet = commit_bet(passLineBet);

  } else {
    alert('The minimum bet is $' + minBet + '.');
  }
}



function pass_line_odds() {
  if (placeBet[target] != 0) {
    bankroll += placeBet[target];
    placeBet[target] = 0;
    //reset_place_bet_text(target);
  }
    passLineOdds = stagedBet;
    update_bankroll();
    moneyOnTable += passLineOdds;
    update_moneyOnTable;
    passLineOddsElement.textContent = `$${passLineOdds}`;
}

function dont_pass_line() {
  if (stagedBet >= minBet) {
    dontPassBet = commit_bet(dontPassBet);
    dontPassBarChipsDisplay.textContent = `$${dontPassBet}`;
  } else {
    alert('The minimum bet is $' + minBet + '.');
  }
}

function score_pass_line() { // After game is on
  if (sum == 7) {
    if (dontPassBet != 0) {
      bankroll += dontPassBet;
      update_bankroll();
      message = `Won $${dontPassBet} on the Don\'t Pass Bar`;
      message_display(message);
      }
  } else {
    if (dontPassBet != 0) {
      dontPassBet = lose_bet(dontPassBet);
      dontPassBarChipsDisplay.textContent = '';
      message = `Lost $${dontPassBet} on the Don\'t Pass Bar`;
      message_display(message);
    }
    if (passLineBet != 0) {
      bankroll += passLineBet;
      update_bankroll();
      message = `Won $${passLineBet} on the Pass Line`;
      message_display(message);
      if (passLineOdds != 0) {
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
      payout = passLineOdds * 2;
      break;
    case 5:
    case 9:
      payout = passLineOdds * 3 / 2;
      break;
    case 6:
    case 8:
      payout = passLineOdds * 6 / 5;
      break;
  }
  bankroll += payout;
  bankroll += passLineOdds;
  update_bankroll();
  moneyOnTable -= passLineOdds;
  update_moneyOnTable();
  message = `Won $${payout} on Pass Line Odds`;
  message_display(message);
  passLineOdds = 0;
}


// PLACE BETS
function place_bet(selector) {
  if (stagedBet < minBet) {
    alert('The minimum bet is $' + minBet + '.');
  } else if (placeBet[selector] != 0) {
    alert(`You already have a Place Bet on ${selector}. 
Pull back bet to change.`);
  } else if (passLineOdds != 0 && target == selector) {
    // Do Nothing
  } else {
    switch (selector) {
      case 4:
        add_chips_to_table(placeBetFourChips, stagedBet);
        placeBet[4] = commit_bet(placeBet[4]);
        break;
      case 5:
        add_chips_to_table(placeBetFiveChips, stagedBet);
        placeBet[5] = commit_bet(placeBet[5]);
        break;
      case 6:
        add_chips_to_table(placeBetSixChips, stagedBet);
        placeBet[6] = commit_bet(placeBet[6]);
        break;
      case 8:
        add_chips_to_table(placeBetEightChips, stagedBet);
        placeBet[8] = commit_bet(placeBet[8]);
        break;
      case 9:
        add_chips_to_table(placeBetNineChips, stagedBet);
        placeBet[9] = commit_bet(placeBet[9]);
        break;
      case 10:
        add_chips_to_table(placeBetTenChips, stagedBet);
        placeBet[10] = commit_bet(placeBet[10]);
        break;
    }
  }
}

function score_place_bets(sum) {
  switch (sum) {
    case 4:
      payout = placeBet[4]*9/5;
      break;
    case 5:
      payout = placeBet[5]*7/5;
      break;
    case 6:
      payout = placeBet[6]*7/6;
      break;
    case 8:
      payout = placeBet[8]*7/6;
      break;
    case 9:
      payout = placeBet[9]*7/5;
      break;
    case 10:
      payout = placeBet[10]*9/5;
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
    if (hardwaysBet[selector] != 0) {
      alert(`You already have a Hardways Bet on ${selector}. 
      Pull back bet to change.`);
    } else {
      switch (selector) {
        case 4:
          add_chips_to_table(hardwaysChips.four, stagedBet);
          hardwaysBet[4] = commit_bet(hardwaysBet[4]);
        break;
          case 6:
          add_chips_to_table(hardwaysChips.six, stagedBet);
          hardwaysBet[6] = commit_bet(hardwaysBet[6]);
          break;
        case 8:
          add_chips_to_table(hardwaysChips.eight, stagedBet);
          hardwaysBet[8] = commit_bet(hardwaysBet[8]);
          break;
        case 10:
          add_chips_to_table(hardwaysChips.ten, stagedBet);
          hardwaysBet[10] = commit_bet(hardwaysBet[10]);
          break;
      }
    }
  }
}

function score_hardways_bets(sum) {
  switch (sum) {
    case 4:
      payout = hardwaysBet[4]*7;
      break;
    case 6:
      payout = hardwaysBet[6]*9;
      break;
    case 8:
      payout = hardwaysBet[8]*9;
      break;
    case 10:
      payout = hardwaysBet[10]*7;
      break;
  }
  bankroll += payout;
  update_bankroll();
  message = `Won $${payout} on Hardways`;
  message_display(message);
}

// ONE ROLL BETS
function craps_bet(selector) {
  if (stagedBet == 0) {
    // Do nothing
  } else {
    if (crapsBet[selector] != 0) {
      alert(`You already have a Craps Bet on ${selector}. 
      Pull back bet to change.`);
  } else {
    switch (selector) {
      case 2:
        add_chips_to_table(crapsChips.two, stagedBet);
        crapsBet[2] = commit_bet(crapsBet[2]);
        break;
      case 3:
        add_chips_to_table(crapsChips.three, stagedBet);
        crapsBet[3] = commit_bet(crapsBet[3]);
        break;
      case 11:
        add_chips_to_table(crapsChips.eleven, stagedBet);
        crapsBet[11] = commit_bet(crapsBet[11]);
        break;
      case 12:
        add_chips_to_table(crapsChips.twelve, stagedBet);
        crapsBet[12] = commit_bet(crapsBet[12]);
        break;
    }
    }
  }
}

function score_craps_bets() {
  for (const key in crapsBet) {
    if (key == sum && crapsBet[key] != 0) {
      switch (sum) {
        case 2:
          payout = crapsBet[2] * 30;
          oneRollWinner = 2;
          break;
        case 3:
          payout = crapsBet[3] * 15;
          oneRollWinner = 3;
          break;
        case 11:
          payout = crapsBet[11] * 15;
          oneRollWinner = 11;
          break;
        case 12:
          payout = crapsBet[12] * 30;
          oneRollWinner = 12;
          break;
      }
      bankroll += payout;
      update_bankroll();
      message = `Won $${payout} on one-roll bet`;
      message_display(message);
    } else {
      crapsBet[key] = lose_bet(crapsBet[key]);
    }
  }
  reset_craps_bets_text();
}

function reset_craps_bets_text() {
  if (oneRollWinner == 2) {
    // Keep bet down
  } else {
    remove_chips_from_table(crapsChips.two);
  }
  if (oneRollWinner == 12) {
    // Keep Chips Down
  } else {
    remove_chips_from_table(crapsChips.twelve);
  }
  if (oneRollWinner == 11) {
    // Keep chips down
  } else {
    remove_chips_from_table(crapsChips.eleven);
  }
  if (oneRollWinner == 3) {
    // Keep Chips Down
  } else {
    remove_chips_from_table(crapsChips.three);
  }
  oneRollWinner = 0;
}

// FIELD BETS
function field_bet() { // Place staged bet on Field
  if (stagedBet < minBet) {
    alert('The minimum bet is $' + minBet + '.');
  } else if (fieldBet != 0) {
    alert(`You already have a Bet in the field. 
Pull back bet to change.`);
  } else {
    fieldBet = commit_bet(fieldBet);
    fieldChipsDisplayElement.textContent = '$' + fieldBet;
  }
}

function score_field_bet() {
// Lose
  if (sum == 5 || sum == 6 || sum == 8) {
    message = 'Lost $' + fieldBet + ' to the field.';
    message_display(message);
    fieldBet = lose_bet(fieldBet);
    fieldChipsDisplayElement.textContent = '';
    // Win
  } else {
    if (sum == 2 || sum == 12) {
      payout = fieldBet * 2;
    } else {
      payout = fieldBet;
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
  } else if (stagedComeBet != 0) {
    alert(`You already have a Bet on the Come Line.
Pull back bet to change.`);
  } else {
    add_chips_to_table(comeBetChips.line, stagedBet);
    stagedComeBet = commit_bet(stagedComeBet);
  }
}

function come_bet_odds(selection) {
  if (comeBet[selection] != 0) {
    if (comeBetOdds[selection] != 0) {
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
            if (selection == 5) {
              comeBetOddsElement.five.textContent = '$' + stagedBet;
            } else {
              comeBetOddsElement.nine.textContent = '$' + stagedBet;
            }
            }
            break;
          case 6:
          case 8:
            if (stagedBet % 5 != 0) {
              alert(`Come Bet Odds on ${selection} pays out 6:5.
Bet must be divisible by 5`);
            } else {
              goodToPlace = true;
              if (selection == 6) {
                comeBetOddsElement.six.textContent = '$' + stagedBet;
              } else {
                comeBetOddsElement.eight.textContent = '$' + stagedBet;
              }
            }
            break;
          case 4:
          case 10:
            goodToPlace = true;
            if (selection == 4) {
              comeBetOddsElement.four.textContent = '$' + stagedBet;
            } else {
              comeBetOddsElement.ten.textContent = '$' + stagedBet;
            }
            break;
      }
      if (goodToPlace == true) {
        comeBetOdds[selection] = stagedBet;
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
    message = 'Lost $' + stagedComeBet + ' on the Come Line';
    message_display(message);
    remove_chips_from_table(comeBetChips.line);
    moneyOnTable -= stagedComeBet;
    stagedComeBet = 0;
    update_moneyOnTable();
  } else if (sum == 7 || sum == 11) {
    message = 'Won $' + stagedComeBet + ' on the Come Line';
    message_display(message);
    bankroll += stagedComeBet;
    update_bankroll();
    if (sum == 7) {
      bankroll += stagedComeBet;
      update_bankroll();
      remove_chips_from_table(comeBetChips.line);
      stagedComeBet = lose_bet(stagedComeBet);
      message = `Won $${stagedComeBet} on the Come Line`;
      message_display(message);
    }
  } else {
    move_come_bet();
    remove_chips_from_table(comeBetChips.line);
    stagedComeBet = 0;
  }
}

function move_come_bet() { // Move the Come Line to Come Bet area
  comeBet[sum] = stagedComeBet;
  add_chips_to_table(comeBetChips[sum], stagedComeBet);
  message = `$${stagedComeBet} Come Bet moved`;
  message_display(message);
}
function score_come_bets() { // Score Come Bets
  payout = comeBet[sum];
  bankroll += payout * 2;
  update_bankroll();
  message = `Won $${payout} on the Come Bet`;
  message_display(message);
  comeBet[sum] = lose_bet(comeBet[sum]);
  reset_come_bet_text(sum);
  if (comeBetOdds[sum] != 0) {
    reset_come_bet_odds_text(sum);
    if (sum == 4 || sum == 10) {
      payout = comeBetOdds[sum] * 2;
    } else if (sum == 5 || sum == 9) {
      payout = comeBetOdds[sum] * 3 / 2;
    } else {
      payout = comeBetOdds[sum] * 6 / 5;
    }
    bankroll += (payout + comeBetOdds[sum]);
    update_bankroll();
    message = `Won $${payout} on the Come Bet Odds`;
    message_display(message);
    comeBetOdds[sum] = lose_bet(comeBetOdds[sum]);
  }
}
function reset_come_bet_text(number) {
  i = Number(number);
  switch (i) {
    case 4:
      comeBetChipsDisplayElement.four.textContent = '';
      break;
    case 5:
      comeBetChipsDisplayElement.five.textContent = '';
      break;
    case 6:
      comeBetChipsDisplayElement.six.textContent = '';
      break;
    case 8:
      comeBetChipsDisplayElement.eight.textContent = '';
      break;
    case 9:
      comeBetChipsDisplayElement.nine.textContent = '';
      break;
    case 10:
      comeBetChipsDisplayElement.ten.textContent = '';
      break;
  }
}
function reset_come_bet_odds_text(number) {
  i = Number(number);
  switch (i) {
    case 4:
      comeBetOddsElement.four.textContent = '';
      break;
    case 5:
      comeBetOddsElement.five.textContent = '';
      break;
    case 6:
      comeBetOddsElement.six.textContent = '';
      break;
    case 8:
      comeBetOddsElement.eight.textContent = '';
      break;
    case 9:
      comeBetOddsElement.nine.textContent = '';
      break;
    case 10:
      comeBetOddsElement.ten.textContent = '';
      break;
  }
}
function dont_come_bet() {
  if (stagedBet < minBet) {
    alert('The minimum bet is $' + minBet + '.');
  } else if (stagedDontComeBet != 0) {
    alert(`You already have a Bet on the Don\'t Come Line.
Pull back bet to change.`);
  } else {
    stagedDontComeBet = commit_bet(stagedDontComeBet);
    dontComeLineChipsDisplayElement.textContent = '$' + stagedDontComeBet;
  }
}

function dont_come_bet_odds(selection) {
  if (dontComeBet[selection] != 0) {
    if (dontComeBetOdds[selection] != 0) {
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
            if (selection == 5) {
              dontComeBetOddsElement.five.textContent = '$' + stagedBet;
            } else {
              dontComeBetOddsElement.nine.textContent = '$' + stagedBet;
            }
          }
          break;
        case 6:
        case 8:
          if (stagedBet % 5 != 0) {
            alert(`Don\'t Come Bet Odds on ${selection} pays out 5:6.
            Bet must be divisible by 6`);
          } else {
            goodToPlace = true;
            if (selection == 6) {
              dontComeBetOddsElement.six.textContent = '$' + stagedBet;
            } else {
              dontComeBetOddsElement.eight.textContent = '$' + stagedBet;
            }
          }
          break;
        case 4:
        case 10:
          if (stagedBet % 2 != 0) {
            alert(`Don\'t Come Bet Odds on ${selection} pays out 1:2.
            Bet must be divisible by 2`);
          } else {
            goodToPlace = true;
            if (selection == 4) {
              dontComeBetOddsElement.four.textContent = '$' + stagedBet;
            } else {
              dontComeBetOddsElement.ten.textContent = '$' + stagedBet;
            }
          break;
        }

      }
      if (goodToPlace == true) {
        dontComeBetOdds[selection] = stagedBet;
        update_bankroll();
        moneyOnTable += stagedBet;
        update_moneyOnTable();
        goodToPlace = false;
      }
    }
  }
}

function on_the_dont_come_line() { // Score Bets on Come Line or Move if Point
  if (sum == 7 || sum == 11) {
    message = 'Lost $' + stagedDontComeBet + ' on the Don\'t Come Line';
    dontComeLineChipsDisplayElement.textContent = '';
    stagedDontComeBet = 0;
  } else if (sum == 2 || sum == 3) {
    message = 'Won $' + stagedDontComeBet + ' on the Don\'t Come Line';
    bankroll += stagedDontComeBet;
    update_bankroll();
  } else if (sum == 12) {
    message = 'Push on the Don\'t Come Line'
  } else {
    message = `$${stagedDontComeBet} Don\'t Come Bet moved`;
    move_dont_come_bet();
    //if (moveDCBet == true) {
    dontComeLineChipsDisplayElement.textContent = '';
    stagedDontComeBet = 0;
    //}
  }
  message_display(message);
}
function move_dont_come_bet() { // Move the Come Line to Come Bet area
//moveDCBet = false;
//moveDCBet = confirm(`Would you like to move your Don\'t Come Bet to the ${sum}?`);
//if (moveDCBet == true) {
  switch (sum) {
    case 4:
      dontComeBet[4] = stagedDontComeBet;
      dontComeBetChipsDisplayElement.four.textContent = '$' + dontComeBet[4];
      break;
    case 5:
      dontComeBet[5] = stagedDontComeBet;
      dontComeBetChipsDisplayElement.five.textContent = '$' + dontComeBet[5];
      break;
    case 6:
      dontComeBet[6] = stagedDontComeBet;
      dontComeBetChipsDisplayElement.six.textContent = '$' + dontComeBet[6];
      break;
    case 8:
      dontComeBet[8] = stagedDontComeBet;
      dontComeBetChipsDisplayElement.eight.textContent = '$' + dontComeBet[8];
      break;
    case 9:
      dontComeBet[9] = stagedDontComeBet;
      dontComeBetChipsDisplayElement.nine.textContent = '$' + dontComeBet[9];
      break;
    case 10:
      dontComeBet[10] = stagedDontComeBet;
      dontComeBetChipsDisplayElement.ten.textContent = '$' + dontComeBet[10];
      break;
  }
//} else {
// Do Nothing
//}
}

function score_dont_come_bets() {
  if (sum == 7) {
  let payoutSubTotal = 0;
    for (const key in dontComeBet) {
      if (dontComeBet[key] != 0) {
      // Win 1:1 and get initial bet back
        payoutSubTotal += (dontComeBet[key] * 2);
        dontComeBet[key] = lose_bet(dontComeBet[key]);
        reset_dont_come_bet(key);
      }
      if (dontComeBetOdds[key] != 0 && gameOn == true) {
        number = Number(key)
        switch (number) {
          case 4:
          case 10:
            payout = dontComeBetOdds[number] / 2;
            break;
          case 5:
          case 9:
            payout = dontComeBetOdds[number] * 2 / 3;
            break;
          case 6:
          case 8:
            payout = dontComeBetOdds[number] * 5 / 6;
            break;
        }
        payoutSubTotal += (payout + dontComeBetOdds[key]);
        reset_dont_come_odds_bet(key);
        dontComeBetOdds[key] = lose_bet(dontComeBetOdds[key]);
      }
    }
  payout = payoutSubTotal;
    if (payout != 0) {
      bankroll += payout;
      update_bankroll();
      message = `Won $${payout} on the Don\'t Come Bets`;
    }
  } else if (sum == 2 || sum == 3 || sum == 12) {
  // Do nothing on dont come bets
  } else {
    let lose = 0;
    lose = dontComeBet[sum] + dontComeBetOdds[sum];
    message = `Lost $${lose} on the Don\'t Come Bet`;
    dontComeBet[sum] = lose_bet(dontComeBet[sum]);
    dontComeBetOdds[sum] = lose_bet(dontComeBetOdds[sum]);
    reset_dont_come_bet(sum);
    reset_dont_come_odds_bet(sum);
  }
  message_display(message);
}

function reset_dont_come_bet(number) {
let i = Number(number);
  switch (i) {
    case 4:
      dontComeBetChipsDisplayElement.four.textContent = '';
      break;
    case 5:
      dontComeBetChipsDisplayElement.five.textContent = '';
      break;
    case 6:
      dontComeBetChipsDisplayElement.six.textContent = '';
      break;
    case 8:
      dontComeBetChipsDisplayElement.eight.textContent = '';
      break;
    case 9:
      dontComeBetChipsDisplayElement.nine.textContent = '';
      break;
    case 10:
      dontComeBetChipsDisplayElement.ten.textContent = '';
      break;
  }
}
function reset_dont_come_odds_bet(number) {
let i = Number(number);
  switch (i) {
    case 4:
      dontComeBetOddsElement.four.textContent = '';
      break;
    case 5:
      dontComeBetOddsElement.five.textContent = '';
      break;
    case 6:
      dontComeBetOddsElement.six.textContent = '';
      break;
    case 8:
      dontComeBetOddsElement.eight.textContent = '';
      break;
    case 9:
      dontComeBetOddsElement.nine.textContent = '';
      break;
    case 10:
      dontComeBetOddsElement.ten.textContent = '';
      break;
  }
}


// ####################################################################################
// ###################### EVENT LISTENERS #############################################
// ####################################################################################

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
  }, 1500);
});
pullBackButton.addEventListener('click', pull_back_in_progress);
clearBetButton.addEventListener('click', reset_stagedBet);

// -------------------------------- Table ---------------------------------



smallNumbersButton.addEventListener('click', (e) => {
  if (stagedBet == 0 || stagedBet > bankroll || allSmallPaid == true) {
  // Do nothing
  } else if (gameOn == true) {
    alert('Warning: Can only place bonus bets while game is off');
  } else {
    smallNumbersBet = commit_bet(smallNumbersBet);
    set_bonus_bet();
  }

});
allNumbersButton.addEventListener('click', (e) => {
  if (stagedBet == 0 || stagedBet > bankroll || makeEmAllPaid == true) {
  // Do nothing
  } else if (gameOn == true) {
    alert('Warning: Can only place bonus bets while game is off');
  } else {
    allNumbersBet = commit_bet(allNumbersBet);
    set_bonus_bet();
  }
});
tallNumbersButton.addEventListener('click', (e) => {
  if (stagedBet == 0 || stagedBet > bankroll || allTallPaid == true) {
  // Do nothing
  } else if (gameOn == true) {
    alert('Warning: Can only place bonus bets while game is off');
  } else {
    tallNumbersBet = commit_bet(tallNumbersBet);
    set_bonus_bet();
  }
});

function set_bonus_bet() {
  if (smallNumbersBet != 0) {
    smallNumbersButton.style.backgroundImage = "url('img/chips/face/"+chipDisplay+"/red_chip.png')";
  }
  if (allNumbersBet != 0) {
    allNumbersButton.style.backgroundImage = "url('img/chips/face/"+chipDisplay+"/red_chip.png')";
  }
  if (tallNumbersBet != 0) {
    tallNumbersButton.style.backgroundImage = "url('img/chips/face/"+chipDisplay+"/red_chip.png')";
  }
}
function check_bonus_bet(sum) {
if (smallNumbersBet != 0) {
  switch (sum) {
    case 2:
      allNumbersCircles.two.style.backgroundColor = 'gold';
      allNumbersCircles.two.textContent = '';
      smallNumbersHit[2] = true;
      break;
    case 3:
      allNumbersCircles.three.style.backgroundColor = 'gold';
      allNumbersCircles.three.textContent = '';
      smallNumbersHit[3] = true;
      break;
    case 4:
      allNumbersCircles.four.style.backgroundColor = 'gold';
      allNumbersCircles.four.textContent = '';
      smallNumbersHit[4] = true;
      break;
    case 5:
      allNumbersCircles.five.style.backgroundColor = 'gold';
      allNumbersCircles.five.textContent = '';
      smallNumbersHit[5] = true;
      break;
    case 6:
      allNumbersCircles.six.style.backgroundColor = 'gold';
      allNumbersCircles.six.textContent = '';
      smallNumbersHit[6] = true;
      break;
  }
  for (const key in smallNumbersHit) {
    if (smallNumbersHit[key] == true) {
      allSmallTrue = true;
    } else {
      allSmallTrue = false;
      break;
    }
  }
  if (allSmallTrue == true) {
    score_bonus_bet();
  }
  }
  if (tallNumbersBet != 0) {
    switch (sum) {
      case 8:
        allNumbersCircles.eight.style.backgroundColor = 'gold';
        allNumbersCircles.eight.textContent = '';
        tallNumbersHit[8] = true;
        break;
      case 9:
        allNumbersCircles.nine.style.backgroundColor = 'gold';
        allNumbersCircles.nine.textContent = '';
        tallNumbersHit[9] = true;
        break;
      case 10:
        allNumbersCircles.ten.style.backgroundColor = 'gold';
        allNumbersCircles.ten.textContent = '';
        tallNumbersHit[10] = true;
        break;
      case 11:
        allNumbersCircles.eleven.style.backgroundColor = 'gold';
        allNumbersCircles.eleven.textContent = '';
        tallNumbersHit[11] = true;
        break;
      case 12:
        allNumbersCircles.twelve.style.backgroundColor = 'gold';
        allNumbersCircles.twelve.textContent = '';
        tallNumbersHit[12] = true;
        break;
    }
    for (const key in tallNumbersHit) {
      if (tallNumbersHit[key] == true) {
        allTallTrue = true;
      } else {
        allTallTrue = false;
        break;
      }
    }
    if (allTallTrue == true) {
      score_bonus_bet();
    }
  }
}

function score_bonus_bet() {
  if (allSmallTrue == true && allSmallPaid == false) {
  payout = smallNumbersBet * 30;
  bankroll += (payout + smallNumbersBet);
  update_bankroll();
  for (i = 0; i < 4; i++) {
  message_display('All Small Bonus Bet Hit !');
  }
  message_display(`Won $${payout}`);
  smallNumbersBet = lose_bet(smallNumbersBet);
  smallNumbersButton.style.backgroundImage = "url('')";
  allSmallPaid = true;
  }
  if (allTallTrue == true && allTallPaid == false) {
    payout = tallNumbersBet * 30;
    bankroll += (payout + tallNumbersBet);
    update_bankroll();
    for (i = 0; i < 4; i++) {
    message_display('All Tall Bonus Bet Hit !');
    }
    message_display(`Won $${payout}`);
    tallNumbersBet = lose_bet(tallNumbersBet);
    tallNumbersButton.style.backgroundImage = "url('')";
    allTallPaid = true;
  }
  if (allTallTrue == true && allSmallTrue == true && makeEmAllPaid == false) {
    payout = allNumbersBet * 150;
    bankroll += (payout + allNumbersBet);
    update_bankroll();
    message_display('Make \'Em All Bonus Bet Hit!');
    message_display(`Won $${payout}`);
    allNumbersBet = lose_bet(allNumbersBet);
    allNumbersButton.style.backgroundImage = "url('')";
    makeEmAllPaid = true;
  }
}
function clear_bonus_bet() {
  smallNumbersBet = 0;
  allNumbersBet = 0;
  tallNumbersBet = 0;
  allSmallTrue = false;
  allSmallPaid = false;
  allTallTrue = false;
  allTallPaid = false;
  makeEmAllPaid = false;

  for (const key in smallNumbersHit) {
    smallNumbersHit[key] = false;
    tallNumbersHit[key + 6] = false;
  }
  smallNumbersButton.style.backgroundImage = "url('')";
  allNumbersButton.style.backgroundImage = "url('')";
  tallNumbersButton.style.backgroundImage = "url('')";
  allNumbersCircles.two.style.backgroundColor = 'rgb(20, 90, 30)';
  allNumbersCircles.two.textContent = '2';
  allNumbersCircles.three.style.backgroundColor = 'rgb(20, 90, 30)';
  allNumbersCircles.three.textContent = '3';
  allNumbersCircles.four.style.backgroundColor = 'rgb(20, 90, 30)';
  allNumbersCircles.four.textContent = '4';
  allNumbersCircles.five.style.backgroundColor = 'rgb(20, 90, 30)';
  allNumbersCircles.five.textContent = '5';
  allNumbersCircles.six.style.backgroundColor = 'rgb(20, 90, 30)';
  allNumbersCircles.six.textContent = '6';
  allNumbersCircles.eight.style.backgroundColor = 'rgb(20, 90, 30)';
  allNumbersCircles.eight.textContent = '8';
  allNumbersCircles.nine.style.backgroundColor = 'rgb(20, 90, 30)';
  allNumbersCircles.nine.textContent = '9';
  allNumbersCircles.ten.style.backgroundColor = 'rgb(20, 90, 30)';
  allNumbersCircles.ten.textContent = '10';
  allNumbersCircles.eleven.style.backgroundColor = 'rgb(20, 90, 30)';
  allNumbersCircles.eleven.textContent = '11';
  allNumbersCircles.twelve.style.backgroundColor = 'rgb(20, 90, 30)';
  allNumbersCircles.twelve.textContent = '12';
}

placeBetElement.four.addEventListener('click', (e) => {
  if (pullBackInProgress == true) {
    remove_chips_from_table(placeBetFourChips);
    placeBet[4] = pull_back_bet(placeBet[4]);
  } else {
    place_bet(4);
  }
});
placeBetElement.five.addEventListener('click', (e) => {
  if (pullBackInProgress == true) {
    remove_chips_from_table(placeBetFiveChips);
    placeBet[5] = pull_back_bet(placeBet[5]);
  } else {
    if (stagedBet % 5 != 0) {
      alert('5 pays out 7:5. Bet must be divisible by 5')
    } else {
      place_bet(5);
    }
  }
});
placeBetElement.six.addEventListener('click', (e) => {
  if (pullBackInProgress == true) {
    remove_chips_from_table(placeBetSixChips);
    placeBet[6] = pull_back_bet(placeBet[6]);
  } else {
    if (stagedBet % 6 != 0) {
      alert('6 pays out 7:6. Bet must be divisible by 6')
    } else {
      place_bet(6);
    }

  }
});
placeBetElement.eight.addEventListener('click', (e) => {
  if (pullBackInProgress == true) {
    remove_chips_from_table(placeBetEightChips);
    placeBet[8] = pull_back_bet(placeBet[8]);
  } else {
    if (stagedBet % 6 != 0) {
      alert('8 pays out 7:6. Bet must be divisible by 6')
    } else {
      place_bet(8);
    }

  }
});
placeBetElement.nine.addEventListener('click', (e) => {
  if (pullBackInProgress == true) {
    remove_chips_from_table(placeBetNineChips);
    placeBet[9] = pull_back_bet(placeBet[9]);
  } else {
    if (stagedBet % 5 != 0) {
      alert('9 pays out 7:5. Bet must be divisible by 5')
    } else {
      place_bet(9);
    }

  }
});
placeBetElement.ten.addEventListener('click', (e) => {
  if (pullBackInProgress == true) {
    remove_chips_from_table(placeBetTenChips);
    placeBet[10] = pull_back_bet(placeBet[10]);
  } else {
    place_bet(10);
  }
});

// Dont Come Line
dontComeLineElement.addEventListener('click', (e) => {
  if (gameOn == false) {
    alert('You cannot bet on the Don\'t Come Line until a point has been established.');
  } else {
    dont_come_bet();
  }
});
dontComeBottom.addEventListener('click', (e) => {
  if (gameOn == false) {
    alert('You cannot bet on the Don\'t Come Line until a point has been established.');
  } else {
    dont_come_bet();
  }
});
dontComeButton.four.addEventListener('click', (e) => {
  if (stagedBet < minBet && pullBackInProgress != true) {
    alert('Minimum Bet is $' + minBet);
  } else if (pullBackInProgress == true) {
    reset_dont_come_odds_bet(4);
    dontComeBetOdds[4] = pull_back_bet(dontComeBetOdds[4]);
  } else if (stagedBet == 0) {
  // Do nothing
  } else {
    dont_come_bet_odds(4);
  }
});
dontComeButton.five.addEventListener('click', (e) => {
  if (stagedBet < minBet && pullBackInProgress != true) {
    alert('Minimum Bet is $' + minBet);
  } else if (pullBackInProgress == true) {
    reset_dont_come_odds_bet(5);
    dontComeBetOdds[5] = pull_back_bet(dontComeBetOdds[5]);
  } else if (stagedBet == 0) {
  // Do nothing
  } else {
    dont_come_bet_odds(5);
  }
});
dontComeButton.six.addEventListener('click', (e) => {
  if (stagedBet < minBet && pullBackInProgress != true) {
    alert('Minimum Bet is $' + minBet);
  } else if (pullBackInProgress == true) {
    reset_dont_come_odds_bet(6);
    dontComeBetOdds[6] = pull_back_bet(dontComeBetOdds[6]);
  } else if (stagedBet == 0) {
  // Do nothing
  } else {
    dont_come_bet_odds(6);
  }
});
dontComeButton.eight.addEventListener('click', (e) => {
  if (stagedBet < minBet && pullBackInProgress != true) {
    alert('Minimum Bet is $' + minBet);
  } else if (pullBackInProgress == true) {
    reset_dont_come_odds_bet(8);
    dontComeBetOdds[8] = pull_back_bet(dontComeBetOdds[8]);
  } else if (stagedBet == 0) {
  // Do nothing
  } else {
    dont_come_bet_odds(8);
  }
});
dontComeButton.nine.addEventListener('click', (e) => {
  if (stagedBet < minBet && pullBackInProgress != true) {
    alert('Minimum Bet is $' + minBet);
  } else if (pullBackInProgress == true) {
    reset_dont_come_odds_bet(9);
    dontComeBetOdds[9] = pull_back_bet(dontComeBetOdds[9]);
  } else if (stagedBet == 0) {
  // Do nothing
  } else {
    dont_come_bet_odds(9);
  }
});
dontComeButton.ten.addEventListener('click', (e) => {
  if (stagedBet < minBet && pullBackInProgress != true) {
    alert('Minimum Bet is $' + minBet);
  } else if (pullBackInProgress == true) {
    reset_dont_come_odds_bet(10);
    dontComeBetOdds[10] = pull_back_bet(dontComeBetOdds[10]);
  } else if (stagedBet == 0) {
  // Do nothing
  } else {
    dont_come_bet_odds(10);
  }
});

// Come Line
// Cannot place bet on come line until point is established
numberBoxElement.four.addEventListener('click', (e) => {
  // need pull back bet
  if (stagedBet < minBet && pullBackInProgress != true) {
    alert('Minimum Bet is $' + minBet);
  } else if (pullBackInProgress == true) {
    comeBetOddsElement.four.textContent = '';
    comeBetOdds[4] = pull_back_bet(comeBetOdds[4]);
  } else if (stagedBet == 0) {
  // Do nothing
  } else {
    come_bet_odds(4);
  }
});
numberBoxElement.five.addEventListener('click', (e) => {
  if (stagedBet < minBet && pullBackInProgress != true) {
    alert('Minimum Bet is $' + minBet);
  } else if (pullBackInProgress == true) {
    comeBetOddsElement.five.textContent = '';
    comeBetOdds[5] = pull_back_bet(comeBetOdds[5]);
  } if (stagedBet == 0) {
  // Do nothing
  } else {
    come_bet_odds(5);
  }
});
numberBoxElement.six.addEventListener('click', (e) => {
  if (stagedBet < minBet && pullBackInProgress != true) {
    alert('Minimum Bet is $' + minBet);
  } else if (pullBackInProgress == true) {
    comeBetOddsElement.six.textContent = '';
    comeBetOdds[6] = pull_back_bet(comeBetOdds[6]);
  } else if (stagedBet == 0) {
  // Do nothing
  } else {
    come_bet_odds(6);
  }
});
numberBoxElement.eight.addEventListener('click', (e) => {
  if (stagedBet < minBet && pullBackInProgress != true) {
    alert('Minimum Bet is $' + minBet);
  } else if (pullBackInProgress == true) {
    comeBetOddsElement.eight.textContent = '';
    comeBetOdds[8] = pull_back_bet(comeBetOdds[8]);
  } else if (stagedBet == 0) {
  // Do nothing
  } else {
    come_bet_odds(8);
  }
});
numberBoxElement.nine.addEventListener('click', (e) => {
  if (stagedBet < minBet && pullBackInProgress != true) {
    alert('Minimum Bet is $' + minBet);
  } else if (pullBackInProgress == true) {
    comeBetOddsElement.nine.textContent = '';
    comeBetOdds[9] = pull_back_bet(comeBetOdds[9]);
  } else if (stagedBet == 0) {
  // Do nothing
  } else {
    come_bet_odds(9);
  }
});
numberBoxElement.ten.addEventListener('click', (e) => {
  if (stagedBet < minBet && pullBackInProgress != true) {
    alert('Minimum Bet is $' + minBet);
  } else if (pullBackInProgress == true) {
    comeBetOddsElement.ten.textContent = '';
    comeBetOdds[10] = pull_back_bet(comeBetOdds[10]);
  } else if (stagedBet == 0) {
  // Do nothing
  } else {
    come_bet_odds(10);
  }
});
comeLineElement.addEventListener('click', (e) => {
  if (gameOn == false) {
    alert('You cannot bet on the Come Line until a point has been established.');
  } else {
    come_bet();
  }
});

// Field
fieldElement.addEventListener('click', (e) => {
  if (pullBackInProgress == true && fieldBet != 0) {
    fieldBet = pull_back_bet(fieldBet);
    fieldChipsDisplayElement.textContent = '';
  } else {
    field_bet();
  }
});

dontPassBarElement.addEventListener('click', (e) => {
  if (pullBackInProgress == true && gameOn == false) { // Could probably branch these in pullbackinprogress
    dontPassBarChipsDisplay.textContent = '';
    dontPassBet = pull_back_bet(dontPassBet);
  } else if (pullBackInProgress == true && gameOn == true) {
    alert('Cannont Pull Back While Game is On.');
    reset_stagedBet();
  } else if (dontPassBet != 0) {
  //Do nothing
  } else if (gameOn == false) {
    dont_pass_line();
  } // else game is on and click does nothing
});

passLineElement.addEventListener('click', (e) => {
  if (pullBackInProgress == true && gameOn == false) { // Could probably branch these in pullbackinprogress
    remove_chips_from_table(passLineChips);
    passLineBet = pull_back_bet(passLineBet); // Sets value to 0
  } else if (pullBackInProgress == true && gameOn == true) {
    alert('Cannont Pull Back Pass Line While Game is On.');
    reset_stagedBet();
  } else if (passLineBet != 0) {
  //Do nothing
  } else if (gameOn == false) {
    
    pass_line();
  } // else game is on and click does nothing
});

passLineOddsElement.addEventListener('click', (e) => {
  if (pullBackInProgress == true && passLineOdds != 0) {
    passLineOddsElement.textContent = '';
    passLineOdds = pull_back_bet(passLineOdds);
  } else if (stagedBet == 0) {
  // Do nothing
  } else {
    if (target == 0) {
      alert('Cannot place Pass Line Odds until point is established');
    } else if (passLineOdds != 0) {
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
});

// ---------------- HARDWAYS -------------------------- HARDWAYS----------------------

hardwaysElement.four.addEventListener('click', (e) => {
  if (pullBackInProgress == true) {
    remove_chips_from_table(hardwaysChips.four);
    hardwaysBet[4] = pull_back_bet(hardwaysBet[4]);
  } else {
    hardways_bet(4);
  }
});
hardwaysElement.six.addEventListener('click', (e) => {
  if (pullBackInProgress == true) {
    remove_chips_from_table(hardwaysChips.six);
    hardwaysBet[6] = pull_back_bet(hardwaysBet[6]);
  } else {
    hardways_bet(6);
  }
});
hardwaysElement.eight.addEventListener('click', (e) => {
  if (pullBackInProgress == true) {
    remove_chips_from_table(hardwaysChips.eight);
    hardwaysBet[8] = pull_back_bet(hardwaysBet[8]);
  } else {
    hardways_bet(8);
  }
});
hardwaysElement.ten.addEventListener('click', (e) => {
  if (pullBackInProgress == true) {
    remove_chips_from_table(hardwaysChips.ten);
    hardwaysBet[10] = pull_back_bet(hardwaysBet[10]);
  } else {
    hardways_bet(10);
  }
});

// -------------- CRAPS BETS --------------------------- CRAPS BETS -------------------

crapsElement.two.addEventListener('click', (e) => {
  if (pullBackInProgress == true) {
    remove_chips_from_table(crapsChips.two);
    crapsBet[2] = pull_back_bet(crapsBet[2]);
  } else {
    craps_bet(2);
  }
});
crapsElement.three.addEventListener('click', (e) => {
  if (pullBackInProgress == true) {
    remove_chips_from_table(crapsChips.three);
    crapsBet[3] = pull_back_bet(crapsBet[3]);
  } else {
    craps_bet(3);
  } 
});
crapsElement.eleven.addEventListener('click', (e) => {
  if (pullBackInProgress == true) {
    remove_chips_from_table(crapsChips.eleven);
    crapsBet[11] = pull_back_bet(crapsBet[11]);
  } else {
    craps_bet(11);
  }
});
crapsElement.twelve.addEventListener('click', (e) => {
  if (pullBackInProgress == true) {
    remove_chips_from_table(crapsChips.twelve);
    crapsBet[12] = pull_back_bet(crapsBet[12]);
  } else {
    craps_bet(12);
  }
});
// ^^^^^^^^^^^^^^^^^^^^^^^^^ END EVENT LISTENERS ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^



