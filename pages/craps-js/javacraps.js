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

// I think the message pop up for moving bet behind the line allows the animation to roll
// in the background causing the chips to teleport

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
const minBet = 15;
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


//const chipVessel = []

let animationComplete = true;
let playSoundAfterAnimation = false;

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
const increment500 = document.getElementById('increment500');
const decrement500 = document.getElementById('decrement500');
const increment5000 = document.getElementById('increment5000');
const decrement5000 = document.getElementById('decrement5000');
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

let big = {
  6: {
    button: document.getElementById('big-6-button'),
    amount: 0,
    multiplier: 1,
    chips: {
      location: document.getElementById('big-6-chips'),
      chip: [],
      leftSpacing: 15
    }
  },
  8: {
    button: document.getElementById('big-8-button'),
    amount: 0,
    multiplier: 1,
    chips: {
      location: document.getElementById('big-8-chips'),
      chip: [],
      leftSpacing: 15
    }
  }
}

let bonus = {
  small: {
    button: document.getElementById('small-button'),
    amount: 0,
    multiplier: 30,
    chips: {
      location: document.getElementById('small-bonus-chips'),
      chip: [],
      leftSpacing: 45
    },
    hit: { 2: false, 3: false, 4: false, 5: false, 6: false },
    allHit: false,
    paid: false
  },
  all: {
    button: document.getElementById('all-button'),
    amount: 0,
    multiplier: 150,
    chips: {
      location: document.getElementById('all-bonus-chips'),
      chip: [],
      leftSpacing: 45
    },
    paid: false
  },
  tall: {
    button: document.getElementById('tall-button'),
    amount: 0,
    multiplier: 30,
    chips: {
      location: document.getElementById('tall-bonus-chips'),
      chip: [],
      leftSpacing: 45
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

let sevenBet = {
  button: document.getElementById('seven-bet-button'),
  amount: 0,
  multiplier: 4,
  chips: {
    location: document.getElementById('seven-bet-chips'),
    chip: [],
    leftSpacing: 100
  }
}

sevenBet.button.addEventListener('click', () => {
  if (pullBackInProgress == true) {
    seven_bet('pullBack');
  } else if (stagedBet == 0 || sevenBet.amount != 0) {
    // Do Nothing
  } else {
    seven_bet('place');
  }
  prevClicked = sevenBet.button;
});

function seven_bet(action) {
  switch (action) {
    case 'place':
      add_chips_to_table(sevenBet.chips, stagedBet, 'face', 'table', 'normal');
      sevenBet.amount = commit_bet(sevenBet.amount);
      break;
    case 'score':
      payout = sevenBet.amount * sevenBet.multiplier;
      master_timing_function(sevenBet, payout, 'return');
      message_display(`Won $${payout} on Any Seven Bet`);
      bankroll += sevenBet.amount;
      update_bankroll();
      playSound = false;
      break;
    case 'clear':
      message_display(`Lost $${sevenBet.amount} on Any Seven Bet`);
      master_timing_function(sevenBet, 0, 'lose');
      break;
    case 'pullBack':
      remove_chips_from_table(sevenBet.chips);
      sevenBet.amount = pull_back_bet(sevenBet.amount);
      break;
  }
}

let anyCraps = {
  button: document.getElementById('any-craps-button'),
  amount: 0,
  multiplier: 7,
  chips: {
    location: document.getElementById('any-craps-chips'),
    chip: [],
    leftSpacing: 120
  }
}

anyCraps.button.addEventListener('click', (e) => {
  if (pullBackInProgress == true) {
    any_craps('pullBack');
  } else if (stagedBet == 0 || anyCraps.amount != 0) {
    // Do Nothing
  } else {
    any_craps('place');
  }
  prevClicked = anyCraps.button;
});

function any_craps(action) {
  switch (action) {
    case 'place':
      add_chips_to_table(anyCraps.chips, stagedBet, 'face', 'table', 'normal');
      anyCraps.amount = commit_bet(anyCraps.amount);
      break;
    case 'score':
      if (anyCraps.amount != 0) {
        if (sum == 2 || sum == 3 || sum == 11 || sum == 12) {
          payout = anyCraps.amount * anyCraps.multiplier;
          action = 'return';
          master_timing_function(anyCraps, payout, action);
          message_display(`Won $${payout} on Any Craps Bet`);
          playSound = false;
        } else any_craps('clear');
      }
      break;
    case 'clear':
      message_display(`Lost $${anyCraps.amount} on Any Craps Bet`);
      master_timing_function(anyCraps, 0, 'lose');
      break;
    case 'pullBack':
      remove_chips_from_table(anyCraps.chips);
      anyCraps.amount = pull_back_bet(anyCraps.amount);
  }
}

let hard = {
  4: {
    name: 'one-roll',
    button: document.getElementById('hard-4-button'),
    amount: 0,
    multiplier: 7,
    chips: {
      location: document.getElementById('hard-4-chips'),
      chip: [],
      leftSpacing: 60
      }
  },
  6: {
    name: 'one-roll',
    button: document.getElementById('hard-6-button'),
    amount: 0,
    multiplier: 9,
    chips: {
      location: document.getElementById('hard-6-chips'),
      chip: [],
      leftSpacing: 60
    }
  },
  8: {
    name: 'one-roll',
    button: document.getElementById('hard-8-button'),
    amount: 0,
    multiplier: 9,
    chips: {
      location: document.getElementById('hard-8-chips'),
      chip: [],
      leftSpacing: 60
      }
  },
  10: {
    name: 'one-roll',
    button: document.getElementById('hard-10-button'),
    amount: 0,
    multiplier: 7,
    chips: {
      location: document.getElementById('hard-10-chips'),
      chip: [],
      leftSpacing: 60
    }
  }
}

let horn = {
  2: {
    name: 'one-roll',
    button: document.getElementById('horn-2-button'),
    amount: 0,
    multiplier: 30,
    chips: {
      location: document.getElementById('horn-2-chips'),
      chip: [],
      leftSpacing: 60
    }
  },
  3: {
    name: 'one-roll',
    button: document.getElementById('horn-3-button'),
    amount: 0,
    multiplier: 15,
    chips: {
      location: document.getElementById('horn-3-chips'),
      chip: [],
      leftSpacing: 60
    }
  },
  11: {
    name: 'one-roll',
    button: document.getElementById('horn-11-button'),
    amount: 0,
    multiplier: 15,
    chips: {
      location: document.getElementById('horn-11-chips'),
      chip: [],
      leftSpacing: 60
      }
  },
  12: {
    name: 'one-roll',
    button: document.getElementById('horn-12-button'),
    amount: 0,
    multiplier: 30,
    chips: {
      location: document.getElementById('horn-12-chips'),
      chip: [],
      leftSpacing: 60
    }
  }
}

let field = {
  name: 'field',
  button: document.getElementById('field-button'),
  amount: 0,
  multiplier: 1,
  chips: {
    location: document.getElementById('field-chips'),
    chip: [],
    leftSpacing: 200
  }
}

let dontPassBar = {
  vertButton: document.getElementById('vert-DP-button'),
  button: document.getElementById('dont-pass-button'),
  location: document.getElementById('dont-pass-chips'),
  amount: 0,
  multiplier: 1,
  chips: {
    location: document.getElementById('dont-pass-chips'),
    chip: [],
    leftSpacing: 155
  },
  odds: {
    location: document.getElementById('dont-pass-odss-chips'),
    amount: 0,
    chips: {
      location: document.getElementById('dont-pass-odds-chips'),
      chip: [],
      leftSpacing: 190
    },
    4: {multiplier: 0.5},
    5: {multiplier: 2/3},
    6: {multiplier: 5/6},
    8: {multiplier: 5/6},
    9: {multiplier: 2/3},
    10: {multiplier: 0.5},
  }
}

const original = {
  betElementStyle: betElement.style,
}

let placeBet = {
    4: {
      name: 'place-bet',
      button: document.getElementById('place-4-button'),
      amount: 0,
      multiplier: 9/5,
      chips: {
        location: document.getElementById('place-4-chips'),
        chip: [],
        rotation: [],
        leftSpacing: 70
      }
    },
    5: {
      name: 'place-bet',
      button: document.getElementById('place-5-button'),
      amount: 0,
      multiplier: 7/5,
      chips: {
        location: document.getElementById('place-5-chips'),
        chip: [],
        rotation: [],
        leftSpacing: 70
      }
    },
    6: {
      name: 'place-bet',
      button: document.getElementById('place-6-button'),
      amount: 0,
      multiplier: 7/6,
      chips: {
        location: document.getElementById('place-6-chips'),
        chip: [],
        rotation: [],
        leftSpacing: 70
      }
    },
    8: {
      name: 'place-bet',
      button: document.getElementById('place-8-button'),
      amount: 0,
      multiplier: 7/6,
      chips: {
        location: document.getElementById('place-8-chips'),
        chip: [],
        rotation: [],
        leftSpacing: 70
      }
    },
    9: {
      name: 'place-bet',
      button: document.getElementById('place-9-button'),
      amount: 0,
      multiplier: 7/5,
      chips : {
        location: document.getElementById('place-9-chips'),
        chip: [],
        rotation: [],
        leftSpacing: 70
      }
    },
    10: {
      name: 'place-bet',
      button: document.getElementById('place-10-button'),
      amount: 0,
      multiplier: 9/5,
      chips: {
        location: document.getElementById('place-10-chips'),
        chip: [],
        rotation: [],
        leftSpacing: 70
      }
    }
};


let come = {
  active: false,
  line: {
    name: 'come-line',
    button: document.getElementById('come-line-button'),
    amount: 0,
    multiplier: 1,
    chips: {
      location: document.getElementById('come-chips-display'),
      chip: [],
      rotation: [],
      leftSpacing: 262
    }
  },
  4: {
    name: 'come',
    amount: 0,
    multiplier: 1,
    chips: {
      location: document.getElementById('come-4'),
      chip: [],
      bottom: 25,
    },
    odds: {
      name: 'come-odds',
      amount: 0,
      multiplier: 2,
      chips: {
        location: document.getElementById('come-4-odds'),
        chip: [],
        leftSpacing: 70
      }
    }
  },
  5: {
    name: 'come',
    amount: 0,
    multiplier: 1,
    chips: {
      location: document.getElementById('come-5'),
      chip: [],
      bottom: 25,
    },
    odds: {
      name: 'come-odds',
      amount: 0,
      multiplier: 3/2,
      chips: {
        location: document.getElementById('come-5-odds'),
        chip: [],
        leftSpacing: 70
      }
    }
  },
  6: {
    name: 'come',
    amount: 0,
    multiplier: 1,
    chips: {
      location: document.getElementById('come-6'),
      chip: [],
      bottom: 25,
    },
    odds: {
      name: 'come-odds',
      amount: 0,
      multiplier: 6/5,
      chips: {
        location: document.getElementById('come-6-odds'),
        chip: [],
        leftSpacing: 70
      }
    }
  },
  8: {
    name: 'come',
    amount: 0,
    multiplier: 1,
    chips: {
      location: document.getElementById('come-8'),
      chip: [],
      bottom: 25,
    },
    odds: {
      name: 'come-odds',
      amount: 0,
      multiplier: 6/5,
      chips: {
        location: document.getElementById('come-8-odds'),
        chip: [],
        leftSpacing: 70
      },
    }
  },
  9: {
    name: 'come',
    amount: 0,
    multiplier: 1,
    chips: {
      location: document.getElementById('come-9'),
      chip: [],
      bottom: 25,
    },
    odds: {
      name: 'come-odds',
      amount: 0,
      multiplier: 3/2,
      chips: {
        location: document.getElementById('come-9-odds'),
        chip: [],
        leftSpacing: 70
      },
    }
  },
  10: {
    name: 'come',
    amount: 0,
    multiplier: 1,
    chips: {
      location: document.getElementById('come-10'),
      chip: [],
      bottom: 25,
    },
    odds: {
      name: 'come-odds',
      amount: 0,
      multiplier: 2,
      chips: {
        location: document.getElementById('come-10-odds'),
        chip: [],
        leftSpacing: 70
      },
    }
  }
}

let dontCome = {
  active: false,
  line: {
    name: 'dont-come-line',
    button: document.getElementById('DC-line-button'),
    button2: document.getElementById('DC-line-button-2'),
    button3: document.getElementById('DC-line-button-3'),
    amount: 0,
    multiplier: 1,
    chips: {
      location: document.getElementById('dont-come-chips-display'),
      chip: [],
      rotation: [],
      leftSpacing: 58
    },
  },
  4: {
    name: 'dont-come',
    button: document.getElementById('dc-4-button'),
    amount: 0,
    multiplier: 1,
    chips: {
      location: document.getElementById('dc-4'),
      chip: [],
      leftSpacing: 40
    },
    odds: {
      amount: 0,
      multiplier: 0.5,
      chips: {
        class: 'dc-odds',
        location: document.getElementById('dc-4-odds'),
        chip: [],
        leftSpacing: 65
      },
    }
  },
  5: {
    name: 'dont-come',
    button: document.getElementById('dc-5-button'),
    amount: 0,
    multiplier: 1,
    chips: {
      location: document.getElementById('dc-5'),
      chip: [],
      leftSpacing: 40
    },
    odds: {
      amount: 0,
      multiplier: 2/3,
      chips: {
        class: 'dc-odds',
        location: document.getElementById('dc-5-odds'),
        chip: [],
        leftSpacing: 65
      },
    }
  },
  6: {
    name: 'dont-come',
    button: document.getElementById('dc-6-button'),
    amount: 0,
    multiplier: 1,
    chips: {
      location: document.getElementById('dc-6'),
      chip: [],
      leftSpacing: 40
    },
    odds: {
      amount: 0,
      multiplier: 5/6,
      chips: {
        class: 'dc-odds',
        location: document.getElementById('dc-6-odds'),
        chip: [],
        leftSpacing: 65
      },
    }
  },
  8: {
    name: 'dont-come',
    button: document.getElementById('dc-8-button'),
    amount: 0,
    multiplier: 1,
    chips: {
      location: document.getElementById('dc-8'),
      chip: [],
      leftSpacing: 40,  
    },
    odds: {
      amount: 0,
      multiplier: 5/6,
      chips: {
        class: 'dc-odds',
        location: document.getElementById('dc-8-odds'),
        chip: [],
        leftSpacing: 65
      },
    }
  },
  9: {
    name: 'dont-come',
    button: document.getElementById('dc-9-button'),
    amount: 0,
    multiplier: 1,
    chips: {
      location: document.getElementById('dc-9'),
      chip: [],
      leftSpacing: 40
    },
    odds: {
      amount: 0,
      multiplier: 2/3,
      chips: {
        class: 'dc-odds',
        location: document.getElementById('dc-9-odds'),
        chip: [],
        leftSpacing: 65
      },
    }
  },
  10: {
    name: 'dont-come',
    button: document.getElementById('dc-10-button'),
    amount: 0,
    multiplier: 1,
    chips: {
      location: document.getElementById('dc-10'),
      chip: [],
      leftSpacing: 40
    },
    odds: {
      amount: 0,
      multiplier: 0.5,
      chips: {
        class: 'dc-odds',
        location: document.getElementById('dc-10-odds'),
        chip: [],
        leftSpacing: 65
      },
    }
  }
}

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


let passLine = {
  name: 'pass-line',
  vertButton: document.getElementById('vert-PL-button'),
  button: document.getElementById('pass-line-button'),
  amount: 0,
  multiplier: 1,
  chips: {
    location: document.getElementById('pass-line-chips'),
    chip: [],
    leftSpacing: 250
  },
  odds: {
    name: 'pass-line-odds',
    button: document.getElementById('pass-line-odds-button'),
    amount: 0,
    chips: {
      location: document.getElementById('pass-line-odds-chips'),
      chip: [],
      leftSpacing: 310
    }, 
    4: {multiplier: 2},
    5: {multiplier: 3/2},
    6: {multiplier: 6/5},
    8: {multiplier: 6/5},
    9: {multiplier: 3/2},
    10: {multiplier: 2}
  }
};

occurrences = {
  value: { 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0, 11:0, 12:0 },
  percent: { 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0, 11:0, 12:0 },
  element: {
    2: document.getElementById('stats-2'),
    3: document.getElementById('stats-3'),
    4: document.getElementById('stats-4'),
    5: document.getElementById('stats-5'),
    6: document.getElementById('stats-6'),
    7: document.getElementById('stats-7'),
    8: document.getElementById('stats-8'),
    9: document.getElementById('stats-9'),
    10: document.getElementById('stats-10'),
    11: document.getElementById('stats-11'),
    12: document.getElementById('stats-12')
  }
}

let firstLoad = true;

if (firstLoad == true) {
  window.addEventListener('load', (e) => {
  let rand = Math.ceil(Math.random() * 5);
  let location = `img/casino_0${rand}.jpg`;
  document.body.style.backgroundImage = "url('"+location+"')";
  load_bankroll_chips();
  firstLoad = false;
  get_staged_chip_offset();
});
}

let xMargin = 8;
let yMargin = 6;


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
function play_increment_sound() {
  pullBackInProgress = false;
  pullBackButton.style.boxShadow = 'none';
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
    let thisLength = 0;
    let index = 0;
    let chipCount = 0;
    let rotation;
    for (const img in stagedBetChips.chip) {
      stagedBetChips.chip[img].remove();
    }
    //stagedBetChips.chip = []
    let chipStructure = get_chip_structure(stagedBet); // of the stagedBet

    for (const color in chipStructure) {
      if (chipStructure[color] != 0) {
        thisLength += chipStructure[color];
      }
    }
    //alert(thisLength);

    difference = thisLength - stagedBetChips.prevLength;
    if (difference >= 0) keep = stagedBetChips.prevLength;
    if (difference < 0) keep = stagedBetChips.prevLength - Math.abs(difference);

    for (const color in chipStructure) {
      if (chipStructure[color] != 0) {
        for (i = 0; i < chipStructure[color]; i++) {
          index = stagedBetChips.chip.length;
          
          stagedBetChips.chip[index] = document.createElement('img');
          thisChip = stagedBetChips.chip[index];


        if (i < keep) {
          rotation = stagedBetChips.rotation[i];
        } else {
          rotation = Math.ceil(Math.random() * 6);
          stagedBetChips.rotation[i] = rotation;
        }


          thisChip.src = `img/chips/side/${chipDisplay}/${color}_chip_${rotation}.png`;
          thisChip.classList.add('side-chip-img');
          thisChip.style.marginBottom = `${chipCount * 6}px`;
          stagedBetChips.location.appendChild(thisChip);
          chipCount += 1;
          stagedBetChips.prevLength = chipCount;
        }
      }
    }
    update_bankroll_chips(bankroll-stagedBet);
    prevStagedBet = stagedBet;
    playSound = true;
  } else {
    playSound = false;
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
    let rotation = Math.ceil(Math.random() * 6);
    bankrollChips.black.rotation[i] = rotation;
    bankrollChips.black[i].src = `img/chips/side/blank/black_chip_${rotation}.png`;
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
  // ----------- generate whole new bankroll each timee -------------
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

        thisChip.src = `img/chips/side/blank/${color}_chip_${rotation}.png`;
        thisChip.classList.add('bankroll-chip-img');
        thisChip.style.marginBottom = `${i*5.4}px`;
        thisStack.appendChild(thisChip);
        prevLength = i + 1;
      }
      bankrollStack[color].prevLength = prevLength;
    }
  }

  check_roll_button();
  
}

function check_roll_button() {
  if (passLine.amount != 0 || dontPassBar.amount != 0) {
    rollButton.classList.remove('hidden');
  } else {
    rollButton.classList.add('hidden');
  }
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
          thisChip.src = `img/chips/${orientation}/${chipDisplay}/${color}_chip_${rotate}.png`;  
        } else {
          thisChip.src = `img/chips/${orientation}/${chipDisplay}/${color}_chip.png`;

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

const mouseXLocation = document.getElementById('mouse-x');
const mouseYLocation = document.getElementById('mouse-y');
const chipsX = document.getElementById('chips-x');
const chipsY = document.getElementById('chips-y');
const differenceX = document.getElementById('difference-x');
const differenceY = document.getElementById('difference-y');

window.addEventListener('mousemove', (e) => {


    // Get coordinates for mouse or touch
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    mouseXLocation.textContent = e.clientX;
    mouseYLocation.textContent = e.clientY;

    const rect = stagedBetChips.location.getBoundingClientRect();
    leftValue = Math.round(rect.left);
    topValue = Math.round(rect.top);
    chipsX.textContent = leftValue;
    chipsY.textContent = topValue;
    differenceX.textContent = leftValue - mouseX;
    differenceY.textContent = topValue - mouseY;


  // Set position, subtracting 50px to center the div (adjust based on div size)
  stagedBetChips.location.style.transform = `translate(${mouseX-zoom}px, ${mouseY+20}px)`;
  //alert(zoom)
});

let zoom;

function get_staged_chip_offset() {
  let ow = window.outerWidth;
  
  zoom = (ow - 1430)*110/213;
}

window.visualViewport.addEventListener('resize', (e) => {
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
    update_staged_bet_chips();
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

    update_staged_bet_chips();
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

const messageBoxDiv = document.getElementById('message-box');
let offsetX = 0, offsetY = 0;
let isDragging = false;

messageBoxDiv.addEventListener('mousedown', (e) => {
  isDragging = true;
  offsetX = e.clientX - messageBoxDiv.offsetLeft;
  offsetY = e.clientY - messageBoxDiv.offsetTop;
  messageBoxDiv.style.backgroundColor = 'black';
});

document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    messageBoxDiv.style.left = `${e.clientX - offsetX}px`;
    messageBoxDiv.style.top = `${e.clientY - offsetY}px`;
  }
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  messageBoxDiv.style.backgroundColor = 'rgb(0,0,0,0.7)';
})



let counter = 0;
function message_display(message) {
  //rollName = display_roll_message(sum);
  newMessage = sum + ' - ' + message;
  
  const newDiv = document.createElement('div');
  newDiv.textContent = newMessage;
  messageBoxDiv.insertBefore(newDiv, messageBoxDiv.firstChild);
  if (messageBoxDiv.childElementCount > 12) {
    messageBoxDiv.removeChild(messageBoxDiv.lastChild);
  }

}



async function clear_table() {
  message = 'All bets cleared';
  message_display(message);
  
  for (const key in big) {
    if (big[key].amount != 0) {
      master_timing_function(big[key], 0, 'lose')
    }
  }

  for (const key in placeBet) {
    if (placeBet[key].amount != 0) {
      master_timing_function(placeBet[key], 0, 'lose')
    }
  }
  for (const key in hard) {
    if (hard[key].amount != 0) {
      master_timing_function(hard[key], 0, 'lose')
    }
  }

  if (passLine.amount != 0) {
    master_timing_function(passLine, 0, 'lose');
  }
  if (passLine.odds.amount != 0) {
    master_timing_function(passLine.odds, 0, 'lose');
  }
}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%% DICE ROLL -- GAME ON/OFF %%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%% MAIN SCORE FUNCTION %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%



function update_stats() {
  occurrences.value[sum]++;
  for (value in occurrences.value) {
    percent = occurrences.value[value] / totalRolls * 100;
    occurrences.percent[value] = Math.round(percent);
    
    if (percent == 0) {
      // Skip
    } else {
      occurrences.element[value].textContent = `${occurrences.percent[value]}%`
    }
  }
}

function control_seven() {
  if ((occurrences.percent[7] > 15 && gameOn == true) || hotRoll.active == true) {
    do {
      dice1 = Math.ceil(Math.random()*6);
      dice2 = Math.ceil(Math.random()*6);
      sum = dice1 + dice2;
    } while (sum == 7)
  }
}


const hotRollRange = 25;
let hotRoll = {
  activationNumber: Math.ceil(Math.random()*hotRollRange),
  length: Math.ceil(Math.random()*20) + 10, // between 10 and 30
  counter: 0,
  active: false
}

let dcOdder = 0; // Use to keep track of the DC odds that was clicked to pull the index
let sevenCounter = 0;
let highRoller = false;
let totalRolls = 0;
let first = true;

function roll_dice() {
  totalRolls++;
  chainDelay = 1200;
  winIndex = 0;
  if (hotRoll.active == true) {
    hotRoll.counter++;
    if (hotRoll.counter == hotRoll.length) {
      hotRoll.active = false;
      sevenCounter = 0;
      hotRoll.counter = 0;
      hotRoll.activationNumber = Math.ceil(Math.random()*hotRollRange);
      hotRoll.length = Math.ceil(Math.random()*20) + 10;
    }
  }
  document.getElementById('total-rolls').textContent = totalRolls;
  pullBackInProgress = false;
  pullBackButton.style.boxShadow = 'none';
  if (passLine.amount == 0 && dontPassBar.amount == 0) {
    alert('You must play the pass line to roll');
    isCoolDown = false;
  } else {
    playSound = false;
    reset_stagedBet();
    dice1 = Math.floor(Math.random()*6) + 1;
    dice2 = Math.floor(Math.random()*6) + 1;

    //if (totalRolls == 1) dice1 = 2, dice2 = 2;
    //if (totalRolls == 2) dice1 = 2, dice2 = 3;
    //if (totalRolls == 3) dice1 = 2, dice2 = 4;
    //if (totalRolls == 4) dice1 = 4, dice2 = 4;
    //if (totalRolls == 5) dice1 = 4, dice2 = 5;
    //if (totalRolls == 6) dice1 = 5, dice2 = 5;
    //if (totalRolls > 6) dice1 = 3, dice2 = 4;
    sum = dice1 + dice2;

    if (sum == 7) {
      sevenCounter++;
      if (sevenCounter == hotRoll.activationNumber) {
        hotRoll.active = true;
      }
      control_seven();
    }

    update_stats();


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

    score_roll();
  }

  if (gameOn == true) {
    mainArea.style.boxShadow = '0 0 50px 5px goldenrod';
  } else {
    mainArea.style.boxShadow = 'none';
  }

  if (bankroll >= 5000) {
    document.getElementById('high-roller').classList.remove('hidden');
    document.getElementById('bet-control-buttons').style.gridTemplateColumns = 'repeat(6, 70px) 80px;';
    document.getElementById('bet-control-buttons').style.left = '-30px';
    highRoller = true;
  } 

  if (bankroll < 5000 && highRoller == true) {
    document.getElementById('high-roller').classList.add('hidden');
    document.getElementById('bet-control-buttons').style.gridTemplateColumns = 'grid-template-columns: repeat(5, 70px) 80px;';
    document.getElementById('bet-control-buttons').style.left = '0px';
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

function display_on_marker(number) {
  const onIMG = document.getElementById(`on-${number}`);
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


let askToMovePlaceBet = false;

function come_out_roll() {
  if (dontPassBar.amount != 0) {
    if (sum == 7 || sum == 11) {
      message = `Lost $${dontPassBar.amount} on the Don\'t Pass Line`;
      message_display(message);
      master_timing_function(dontPassBar, 0, 'lose');
    } else if (sum == 2 || sum == 3) {
      payout = dontPassBar.amount;
      action = 'keep';
      master_timing_function(dontPassBar, payout, action);
      message = 'Won $' + payout + ' on the Don\'t Pass Line';
      message_display(message);

    } else if (sum == 12) {
      message = 'Push on the Don\'t Pass Line';
      message_display(message);
    } else {
      target = sum; // Target assigned
      gameOn = true;
      message = 'Point established';
      message_display(message);
    }
  }
  if (passLine.amount != 0) {
    if (sum == 2 || sum == 3 || sum == 12) {
      message = 'Lost $' + passLine.amount + ' on the Pass Line';
      message_display(message);
      master_timing_function(passLine, 0, 'lose');
    } else if (sum == 7 || sum == 11) {
      payout = passLine.amount;
      master_timing_function(passLine, payout, 'keep');
      message = 'Won $' + payout + ' on the Pass Line';
      message_display(message);
    } else {
      target = sum; // Target assigned
      gameOn = true;
      message = 'Point Established';
      message_display(message);

      if (placeBet[target].amount != 0) {
        askToMovePlaceBet = true;
      }
    }
  }

}

let roundUp = {
  amount: 0,
  chips: {
    location: document.getElementById('round-up'),
    chip: [],
    rotation: [],
    leftSpacing: 100
  }

}

function move_behind_pass_line() {
  if (roundUpBet == true) {
    if (roundUpBet == true && bankroll != 0) {
      bankroll -= 1; 
      // *** // Theres a case where this will make the bankroll go negative, consider handling
      update_bankroll();
      update_moneyOnTable('add', 1);
    } else if (bankroll == 0) {
      passLine.odds.amount = placeBet[target].amount - 1;
      bankroll += 1;
      update_bankroll();
      update_moneyOnTable('add', 1);
    } else {
      moveBehindPassLine = false;
    }
  }

  if (moveBehindPassLine == true) {
    load_move_chips_array(placeBet[target], 'place-bet');
  } else {
    message = 'Player not moving Place Bet';
    message_display(message);
  }

  if (roundUpBet == true) {
    roundUp.amount = 1;
    load_move_chips_array(roundUp, 'round-up');
  }
}




function check_for_on_marker() {
  if (sum == 4 || sum == 5 || sum == 6 || sum==8 || sum == 9 || sum == 10) {
    display_on_marker(sum);
  } else return;
}

async function score_roll() {
  if (sum == target) {
    message = 'Player hit the target. Game goes off';
    message_display(message);
    remove_on_marker();
  }

  if (gameOn == false) {
    check_for_on_marker();
  }

  if (field.amount != 0) {
    score_field_bet();
  }

  if (horn[2].amount != 0 || horn[3].amount != 0 || 
    horn[11].amount != 0 || horn[12].amount != 0 ) {
      score_horn_bets();
  }
  
  if (come.active == true) {
    score_come_bets();
  }


  if (dontCome.active == true) {
    score_dont_come_bets();
  }


  any_craps('score');
  big_6_8('score', 'both');

  if (sevenBet.amount != 0) {
    if (sum == 7) seven_bet('score');
    else seven_bet('clear');
  }

  if (come.line.amount != 0) {
    on_the_come_line();
  }

  if (dontCome.line.amount != 0) {
    on_the_dont_come_line();
  }

  if (gameOn == true) {
    if (sum == 7) {

      clear_table();
      score_pass_line(); // See if Dont Pass is there
      //alert('broken')
      gameOn = false;
      remove_on_marker();
    }

    // Place Bets
    for (const key in placeBet) {
      if (placeBet[key].amount !== 0 && placeBet[key].amount != undefined && key == sum) {
        score_place_bets(sum);
        break;
      }
    }
    // Hard ways bets
      if (sum == 4 || sum == 6 || sum == 8 || sum == 10) {
        if (hard[sum].amount != 0 && dice1 != dice2) {
          message = `${sum} not hard. Lose your $${hard[sum].amount} bet.`;
          message_display(message);
          master_timing_function(hard[sum], 0, 'lose');
        } else if (hard[sum].amount !== 0 && dice1 == dice2) {
          score_hardways_bets(sum);
        }
      }

    

    if (sum == target) {
      gameOn = false;
      score_pass_line();
      target = 0;
    }
  } else {
    come_out_roll();
  }

  // Execute Animations
  await delay(1200);

  if (win.length > 0) {
    win_animation_drop_chips(0);
    await delay(totalDropTime+200);
    win_animation_move_chips(0);
    await delay(totalMoveTime+50);
  }

  if (askToMovePlaceBet == true) {
    moveBehindPassLine = confirm(`Would you like to move your $${placeBet[target].amount} 
Place Bet Behind the Pass Line for better odds?`);
    if (moveBehindPassLine == true) {
      if ((target == 5 || target == 9) && placeBet[target].amount % 2 != 0) {
        roundUpBet = confirm(`You need to round up your bet. Ok to confirm. Otherwise bet stays as is`);
      }
      move_behind_pass_line();
      await delay(100);
    }
    moveBehindPassLine = false;
    askToMovePlaceBet = false;
    roundUpBet = false;
  }
  

  if (moveChipsArr.length > 0) {
    move_chips(0);
    await delay(totalMoveChipsTime);
  }

  if (lose.length > 0) {
    lose_bet(0);
    await delay(totalLoseTime);
  }

  reset_animation_variables();
  await delay(100);
  isCoolDown = false;

}

function reset_animation_variables() {
    moveChipsIndex = 0;
    totalDropTime = 0;
    totalMoveTime = 0;
    win = [];
    lose = [];
    totalLoseTime = 0;
    loseIndex = 0;
    totalMoveChipsTime = 0;
    moveChipsArr = [];
}

// ########################################################################
// #################### BET PLACEMENT AND SCORING #########################
// ########################################################################

// PASS LINE AND DONT PASS BAR
function pass_line() { // adds bet to pass line
  if (stagedBet >= minBet) {
    add_chips_to_table(passLine.chips, stagedBet, 'face', 'table', 'normal');
    passLine.amount = commit_bet(passLine.amount);
    check_roll_button();

  } else {
    alert('The minimum bet is $' + minBet + '.');
  }
}



function pass_line_odds() {
  if (placeBet[target].amount != 0) {
    bankroll += placeBet[target].amount;
    remove_chips_from_table(placeBet[target].chips);
    placeBet[target].amount = 0;
  }
    add_chips_to_table(passLine.odds.chips, stagedBet, 'face', 'table', 'normal');
    passLine.odds.amount = commit_bet(passLine.odds.amount);
}

function dont_pass_line() {
  if (stagedBet >= minBet) {
    add_chips_to_table(dontPassBar.chips, stagedBet, 'face', 'table', 'normal');
    dontPassBar.amount = commit_bet(dontPassBar.amount);
    check_roll_button();
  } else {
    alert('The minimum bet is $' + minBet + '.');
  }
}

function dont_pass_odds() {
  if (stagedBet >= minBet) {
    add_chips_to_table(dontPassBar.odds.chips, stagedBet, 'side', 'odds', 'odds-rotation');
    dontPassBar.odds.amount = commit_bet(dontPassBar.odds.amount);
  }
}


function score_pass_line() { 

  if (dontPassBar.amount != 0) {

      if (sum == 7) { // Win on the Don't Pass Bar

        payout = dontPassBar.amount;
        action = 'keep';
        master_timing_function(dontPassBar, payout, action);
        message = `Won $${payout} on the Don\'t Pass Bar`;
        message_display(message);
        if (dontPassBar.odds.amount != 0) {
          payout = dontPassBar.odds.amount * dontPassBar.odds[target].multiplier;
          action = 'return';
          master_timing_function(dontPassBar.odds, payout, action);
        }

      } else { // Lose

        message = `Lost $${dontPassBar.amount} on the Don\'t Pass Bar`;
        message_display(message);
        master_timing_function(dontPassBar, 0, 'lose');
        if (dontPassBar.odds.amount != 0) {
          master_timing_function(dontPassBar.odds, 0, 'lose');
        }

      }
   
  }

  if (passLine.amount != 0) {
    if (passLine.odds.amount != 0) {
      payout = passLine.odds.amount * passLine.odds[target].multiplier;
      action = 'return';
      master_timing_function(passLine.odds, payout, action);
      message = `Won $${payout} on Pass Line Odds`;
      message_display(message);
    }
    payout = passLine.amount * passLine.multiplier;
    action = 'keep';
    master_timing_function(passLine, payout, action);

    message = `Won $${payout} on the Pass Line`;
    message_display(message);
    
  }
}

async function lose_bet(i) {
  lose_animation(lose[i].object.chips, lose[i].amountLost);
  
  await delay(lose[i].time);
  if (i < lose.length - 1) {
    i++;
    lose_bet(i);
  }
}

async function lose_animation(chips, amountLost) {
  update_moneyOnTable('remove', amountLost);
  // Animation Speed Control
  chips.location.animate([
    { transform: 'translate(0, 0)'},
    { transform: 'translate(0, -1000px)'}
  ], 
  { duration: 800}
  );
  await delay(780);
  remove_chips_from_table(chips);
  
}

function odds_winner(object) {
  bankroll += payout;
  update_bankroll();
  remove_chips_from_table(object.odds.chips);
  update_moneyOnTable('remove', object.odds.amount);
  object.odds.amount = 0;
  return payout;
}


let win = [];
let winIndex = 0;
let totalDropTime = 0;
let totalMoveTime = 0;
let lose = [];
let loseIndex = 0;
let totalLoseTime;
  // Animation Speed Control
let dropTime = 200;

function master_timing_function(object, payout, action) {

// ################ LOSE ###################################

  if (action == 'lose') { // Test this
    lose[loseIndex] = {
      object: object,
      amountLost: object.amount,
      // Animation Speed Control
      time: 200
    }
    totalLoseTime += 400;
    object.amount = 0;
    loseIndex++;
    return;
  } 

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// $$$$$$$$$$$$$$$$$$$$ WIN $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

  let winStructure = get_chip_structure(payout);
  let winLength = 0;
  
  for (const color in winStructure) {
    winLength += winStructure[color];
  }
  
  totalDropTime += dropTime * winLength;

  let startingLocation = object.chips.location;
  let startingLocationRect = startingLocation.getBoundingClientRect();
  let bankrollCollectionTargetRect = bankrollCollectionTarget.getBoundingClientRect();
  let distanceY = bankrollCollectionTargetRect.top - startingLocationRect.top;

  // Animation Speed Control
  let speed = Math.log(distanceY);
  let time = Math.round(100*speed);

  totalMoveTime += time;
  if (action == 'return') totalMoveTime += time; // Add again for original chips
  else if (action == 'return-odds') totalMoveTime += time*2; // Add again for odds

  win[winIndex] = {
    object: object,
    payout: payout,
    action: action, 
    winLength: winLength,
    winStructure: winStructure, 
    div: document.createElement('div'), 
    xOffset: 0,
    moveY: 0,
    time: time
  }

  winIndex++;
}

async function win_animation_drop_chips(z) {
  let index = 0;
  let chipCount = 0;
  let dropHeight = 120;
  let name = win[z].object.name;
  let xOffset = win[z].xOffset;
  // Create the vessel that will spawn chips and fall down onto stack next to table bet
  chipVessel = document.createElement('div');

  // Create the stack that will hold all the chips when they are done falling down
  // This is what will move over to the bankroll area
  win[z].object.chips.location.appendChild(chipVessel);
  win[z].object.chips.location.appendChild(win[z].div);

  stackClass = get_win_stack_class(name);
  win[z].div.classList.add(stackClass);
  chipVessel.classList.add(stackClass);

  // Get the length of the original bet to space the stack so it doesn't overlap
  let betStructure = get_chip_structure(win[z].object.amount);
  let betLength = 0;
  for (const color in betStructure) {
    betLength += betStructure[color];
  }

  if (win[z].object.chips.bottom == undefined) {
    xOffset = betLength * xMargin;
  } 

  win[z].xOffset = xOffset;
  let yOffset = win[z].winLength * yMargin;
  win[z].div.style.transform = `translateX(${xOffset}px)`;
  
  winText = document.createElement('div');
  winText.classList.add('win-text');
  winText.style.transform = `translate(${xOffset+50}px, -${yOffset+50}px)`;
  winText.textContent = '+$' + win[z].payout;
  win[z].object.chips.location.appendChild(winText);
  winText.animate([
    {transform: `translate(${xOffset+50}px, -${yOffset+50}px)`},
    { transform: `translate(${xOffset+50}px, -${yOffset+100}px)`}
  ], {duration: 750}
);
  setTimeout(() => {
    winText.remove();
  }, 750);

  for (const color in win[z].winStructure) {
    if (win[z].winStructure[color] != 0) {
      for (i = 0; i < win[z].winStructure[color]; i++) {
        let rotation = Math.ceil(Math.random() * 6);
        let thisChip = document.createElement('img');
        
        thisChip.src = `img/chips/side/blank/${color}_chip_${rotation}.png`;  
        thisChip.classList.add('win-chip-img');
        chipVessel.style.zIndex = index+5;

        chipVessel.appendChild(thisChip);

        let yStart = (yOffset + dropHeight) + chipCount*yMargin;
        let yEnd = chipCount * yMargin;
        let start = null;
        function step(timestamp) {
          if (start == undefined) start = timestamp;
          const elapsed = timestamp - start;
          if (elapsed < dropTime) {
            y = (yStart-yEnd)*elapsed/dropTime;
          }
          chipVessel.style.transform = `translate(${xOffset}px, ${y-yStart}px)`;
          requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        
        await delay(dropTime - 20);
        thisChip.style.marginBottom = `${chipCount * yMargin}px`;
        win[z].div.appendChild(thisChip);
        chipCount++;
      }
    }
  }

  chipVessel.remove();
  if (z < winIndex - 1) {
    z++;
    win_animation_drop_chips(z, dropTime);
  }
}

const bankrollCollectionTarget = document.getElementById('bankroll-collection-target');



async function win_animation_move_chips(z) {
  let start = null;
  let time = win[z].time;
  let xOffset2 = win[z].xOffset;
  let startingLocation = win[z].div.getBoundingClientRect();
  let bankrollCollectionTargetRect = bankrollCollectionTarget.getBoundingClientRect();
  let distanceX = bankrollCollectionTargetRect.left - startingLocation.left;
  let distanceY = bankrollCollectionTargetRect.top - startingLocation.top;

  function step(timestamp) {
    if (start == undefined) start = timestamp;
    const elapsed = timestamp - start;
    if (elapsed <= time) {
      x = elapsed*distanceX/time;
      y = elapsed*distanceY/time;
      win[z].div.style.transform = `translate(${x + xOffset2}px, ${y}px)`;
      requestAnimationFrame(step);
    } else requestAnimationFrame(step);
  }
  requestAnimationFrame(step);

  

  await delay(time - 30); // Might be causing glitch issues
  win[z].div.remove();

  bankroll += win[z].payout;
  update_bankroll();

  if (win[z].action == 'return') {
    return_chips_to_bankroll(win[z].object, time, z);
    await delay(time);
  } else if (win[z].action == 'return-odds') {
    return_chips_to_bankroll(win[z].object.odds, time, z);
    await delay(time);
    return_chips_to_bankroll(win[z].object, time, z);
    await delay(time);
  }

  // Gonna give issues when combined payout on come and dont come hits

  

  if (z < win.length-1) {
    z++;
    win_animation_move_chips(z);
  } else {
    win = [];
  }
}

async function return_chips_to_bankroll(object, time, z) {
  let chipsToReturn = object.chips.location.getBoundingClientRect();
  let bankrollCollectionTargetRect = bankrollCollectionTarget.getBoundingClientRect();
  let x = bankrollCollectionTargetRect.left - chipsToReturn.left;
  let y = bankrollCollectionTargetRect.top - chipsToReturn.top;
  object.chips.location.animate([
    { transform: 'translate(0, 0)'},
    { transform: `translate(${x}px, ${y}px)`},
  ], { duration: time});
  
  await delay(time-20);

  remove_chips_from_table(object.chips);
  bankroll += object.amount;
  update_bankroll();
  update_moneyOnTable('remove', object.amount);
  object.amount = 0;

  /*
  if (object.odds.amount != 0 && object.odds.amount != undefined) {
    remove_chips_from_table(object.odds.chips);
    bankroll += object.odds.amount;
    update_bankroll();
    update_moneyOnTable('remove', object.odds.amount);
    object.odds.amount = 0;
  }
    */
}

function get_win_stack_class(name) {

  if (name == 'come') stackClass = 'win-come';
  else if (name == 'come-odds') stackClass = 'win-come-odds';
  else if (name == 'one-roll') stackClass = 'win-one-roll';
  else if (name == 'come-line' ||
    name == 'pass-line-odds' || name == 'place-bet') stackClass = 'win-line';
  else if (name == 'dont-come') stackClass = 'win-dc';
  else stackClass = 'win-chip-stack';
  return stackClass;
}


function big_6_8(action, selector) {
  switch (action) {
    case 'place':
      if (big[selector].amount != 0) {
        press_bet(big[selector], 'face', 'table', 'normal');
      } else if (stagedBet >= minBet) {
        add_chips_to_table(big[selector].chips, stagedBet, 'face', 'table', 'normal');
        big[selector].amount = commit_bet(big[selector].amount);
      }
      break;
    case 'score':
      for (const key in big) {
        if (big[key].amount != 0 && sum == key) {
          payout = big[key].amount;
          master_timing_function(big[key], payout, 'keep');
          message_display(`Won $${payout} on the Big ${key}`);
        }
      }
      break;
  }
}




// PLACE BETS
function place_bet(selector) {
  if (stagedBet < minBet) {
    alert('The minimum bet is $' + minBet + '.');
  } else if (placeBet[selector].amount != 0) {
    press_bet(placeBet[selector], 'face', 'table', 'normal');
  } else if (passLine.odds.amount != 0 && target == selector) {
    // Do Nothing
  } else {
    add_chips_to_table(placeBet[selector].chips, stagedBet, 'face', 'table', 'normal');
    placeBet[selector].amount = commit_bet(placeBet[selector].amount);
  }
}


function score_place_bets(sum) {
  payout = placeBet[sum].amount * placeBet[sum].multiplier;
  master_timing_function(placeBet[sum], payout, 'keep');
  message_display(`Won $${payout} on place bet`);
}

// HARDWAYS BETS
function hardways_bet(selector) {
  if (stagedBet == 0) {
    // Do Nothing
  } else {
    if (hard[selector].amount != 0) {
      press_bet(hard[selector], 'face', 'table', 'normal');
    } else {
      add_chips_to_table(hard[selector].chips, stagedBet, 'face', 'table', 'normal');
      hard[selector].amount = commit_bet(hard[selector].amount);
    }
  }
}




function score_hardways_bets(sum) {
  payout = hard[sum].amount * hard[sum].multiplier;
  master_timing_function(hard[sum], payout, 'keep');
  message_display(`Won $${payout} on Hardways`);
}

// ONE ROLL BETS
function horn_bet(selector) {
  if (stagedBet == 0) {
    // Do nothing
  } else {
    if (horn[selector].amount != 0) {
      press_bet(horn[selector], 'face', 'table', 'normal');
  } else {
      add_chips_to_table(horn[selector].chips, stagedBet, 'face', 'table', 'normal');
      horn[selector].amount = commit_bet(horn[selector].amount);
    }
  }
}




function score_horn_bets() {
  for (const key in horn) {
    if (horn[key].amount != 0) {
      if (key == sum) {
        payout = horn[sum].amount * horn[sum].multiplier;
        action = 'return';
        message_display(`Won $${payout} on one-roll bet`);
      } else {
        payout = 0;
        action = 'lose'
      }
      master_timing_function(horn[key], payout, action);
    }
  }
}


// FIELD BETS
function field_bet() { // Place staged bet on Field
  if (stagedBet < minBet) {
    alert('The minimum bet is $' + minBet + '.');
  } else if (field.amount != 0) {
    press_bet(field, 'face', 'table', 'normal');
  } else {
    add_chips_to_table(field.chips, stagedBet, 'face', 'table', 'normal');
    field.amount = commit_bet(field.amount);
  }
}

function press_bet(object, chipOrientation, chipClass, oddsRotation) {
  if (object.amount != stagedBet) {
    remove_chips_from_table(object.chips);
    bankroll += object.amount;
    update_moneyOnTable('remove', object.amount);
    add_chips_to_table(object.chips, stagedBet, chipOrientation, chipClass, oddsRotation);
    object.amount = commit_bet(object.amount);
  }
  
}


function score_field_bet() {
// Lose
  if (sum == 5 || sum == 6 || sum == 7 || sum == 8) {
    message_display('Lost $' + field.amount + ' to the field.');
    payout = 0;
    action = 'lose';
  } else { // Win
    if (sum == 2 || sum == 12) {
      field.multiplier = 2;
    } else {
      field.multiplier = 1;
    }
    payout = field.amount * field.multiplier;
    action = 'keep';
    message_display('Won $' + payout + ' in the field.');
  }
  master_timing_function(field, payout, action);
}

// COME BETS

function come_bet() { // Place the Staged Bet on the Come Line
  if (stagedBet < minBet) {
    alert('The minimum bet is $' + minBet + '.');
  } else if (come.line.amount != 0) {
    alert(`You already have a Bet on the Come Line.
Pull back bet to change.`);
  } else {
    add_chips_to_table(come.line.chips, stagedBet, 'face', 'table', 'normal');
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
        add_chips_to_table(come[selection].odds.chips, stagedBet, 'side', 'odds', 'odds-rotation');
        come[selection].odds.amount = stagedBet;
        update_bankroll();
        update_moneyOnTable('add', stagedBet);
        goodToPlace = false;
      }
    }
    
  }
}

function on_the_come_line() { // Score Bets on Come Line or Move if Point
  if (sum == 2 || sum == 3 || sum == 12) {
    message_display('Lost $' + come.line.amount + ' on the Come Line');
    master_timing_function(come.line, 0, 'lose');
  } else if (sum == 11) {
    payout = come.line.amount;
    master_timing_function(come.line, payout, 'keep');
    message_display('Won $' + payout + ' on the Come Line');
  } else if (sum == 7) {
      payout = come.line.amount;
      master_timing_function(come.line, payout, 'return');
      message_display('Won $' + payout + ' on the Come Line');
  } else {
    load_move_chips_array(come, 'come');
    come.active = true;
  }
}


let moveChipsArr = [];
let moveChipsIndex = 0;
let totalMoveChipsTime = 0;

function load_move_chips_array(object, name) {
  let time;
  let startingLocationRect;
  let endingLocationRect;

  if (name == 'come' || name == 'dc') {
    startingLocationRect = object.line.chips.location.getBoundingClientRect();
    endingLocationRect = object[sum].chips.location.getBoundingClientRect();
  } else { // name == place-bet || round-up
    startingLocationRect = object.chips.location.getBoundingClientRect();
    endingLocationRect = passLine.odds.chips.location.getBoundingClientRect();
  }

  let distanceX = endingLocationRect.left - startingLocationRect.left;
  let distanceY = endingLocationRect.bottom - startingLocationRect.bottom;

  if (name == 'come') time = 600;
  else if (name == 'place-bet') time = 600;
  else if (name == 'dc') {
    time = Math.log(Math.abs(distanceX))*100;
  } else if (name == 'round-up') time = 400;

  totalMoveChipsTime += time;
  moveChipsArr[moveChipsIndex] = {
    name: name,
    finalX: distanceX,
    finalY: distanceY,
    time: time
  }
  moveChipsIndex++;
}


async function move_chips(i) {
  let start = null;
  let name = moveChipsArr[i].name;
  let time = moveChipsArr[i].time;
  let finalX = moveChipsArr[i].finalX;
  let finalY = moveChipsArr[i].finalY;
  let x;
  let y;


  switch (name) {
    case 'come':
      chips = come.line.chips;
      amount = come.line.amount;
      endObject = come[sum];
      break;
    case 'dc':
      chips = dontCome.line.chips;
      amount = dontCome.line.amount;
      endObject = dontCome[sum];
      break;
    case 'place-bet':
      chips = placeBet[target].chips;
      amount = placeBet[target].amount;
      endObject = passLine.odds;
      break;
    case 'round-up':
      chips = roundUp.chips;
      amount = roundUp.amount;
      endObject = passLine.odds;
      add_chips_to_table(roundUp.chips, roundUp.amount, 'face', 'table', 'normal');
      roundUpRotate = chips.rotation;
      chips.rotation = [];
      chips.rotation.push(placeBet[target].rotation);
      chips.rotation.push(roundUpRotate);
      break;
  }

  function step(timestamp) {
    if (start == undefined) start = timestamp;
    const elapsed = timestamp - start;
    if (elapsed < time) {
      x = finalX * elapsed/time;
      y = finalY * elapsed/time;
      chips.location.style.transform = `translate(${x}px, ${y}px)`;
      
      requestAnimationFrame(step);
    } else requestAnimationFrame(step);
  }
  requestAnimationFrame(step);

  await delay(time + 20);

  
  remove_chips_from_table(chips);

  if (name == 'round-up') {
    remove_chips_from_table(endObject.chips);
  }
  endObject.amount += amount;
  add_chips_to_table(endObject.chips, endObject.amount, 'face', 'table', chips.rotation);
  message_display(`$${amount} ${name} moved`);
  chips.location.style.transform = 'translate(0,0)';
  //alert('return chip display to original position')
  amount = 0;
  if (name == 'come') come.line.amount = 0;
  else if (name == 'dc') dontCome.line.amount = 0;
  else if (name == 'place-bet') placeBet[target].amount = 0;

  if (i < moveChipsArr.length) {
    i++;
    move_chips(i);
  } else {
    moveChipsArr = [];
  }

}

function score_come_bets() { // Score Come Bets
  if (sum == 2 || sum == 3 || sum == 11 || sum == 12) {
    payout = 0;
    action = 'none';
  } else if (sum == 7) {
    // Clear Come Bets
    for (const key in come) {
      if (key == 'line' || key == 'active') {
        //Skip
      } else {
        if (come[key].amount != 0) {
          message_display(`Lost $${come[key].amount} on the Come ${key}`);
          payout = 0;
          action = 'lose';
          master_timing_function(come[key], payout, action);

          if (come[key].odds.amount != 0) {
            if (gameOn == false) {
              payout = 0;
              action = 'return';
              master_timing_function(come[key].odds, payout, action);
              message_display(come[key].odds.amount + ' returned');
            } else {
              message_display(`Lost $${come[key].odds.amount} on Come ${key} Odds`);
              payout = 0;
              action = 'lose';
              master_timing_function(come[key].odds, payout, action);
            }
          }
        }
      }
    } // end Sum == 7
  } else if (come[sum].odds.amount != 0) {
    payout = come[sum].amount + come[sum].odds.amount * come[sum].odds.multiplier;
    action = 'return-odds';
    master_timing_function(come[sum], payout, action);
    message_display(`Won $${payout} on the Come Bet`);
  } else if (come[sum].amount != 0) { // If just the come bet is there
    payout = come[sum].amount;
    action = 'return';
    master_timing_function(come[sum], payout, action);
    message_display(`Won $${payout} on the ${sum} Come Bet`);
  }

  
  
}

function dont_come_bet() {
  if (stagedBet < minBet) {
    alert('The minimum bet is $' + minBet + '.');
  } else if (dontCome.line.amount != 0) {
    alert(`You already have a Bet on the Don\'t Come Line.
Pull back bet to change.`);
  } else {
    add_chips_to_table(dontCome.line.chips, stagedBet, 'face', 'table', 'normal');
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
        dcOdder = selection;
        add_chips_to_table(dontCome[selection].odds.chips, stagedBet, 'side', 'odds', 'odds-rotation');
        dontCome[selection].odds.amount = commit_bet(dontCome[selection].odds.amount);
        goodToPlace = false;
      }
    }
  }


async function on_the_dont_come_line() { // Score Bets on Come Line or Move if Point
  
  if (sum == 7 || sum == 11) {
    message = 'Lost $' + dontCome.line.amount + ' on the Don\'t Come Line';
    master_timing_function(dontCome.line, 0, 'lose');
  } else if (sum == 2 || sum == 3) {
    payout = dontCome.line.amount;
    master_timing_function(dontCome.line, payout, 'keep');
    message = 'Won $' + payout + ' on the Don\'t Come Line';
  } else if (sum == 12) {
    message = 'Push on the Don\'t Come Line'
  } else {
    message = `$${dontCome.line.amount} Don\'t Come Bet moved to the ${sum}`;

    load_move_chips_array(dontCome, 'dc');
    dontCome.active = true;
    
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
      if (key == 'line' || key == 'active') {
        break; // Skip
      } else {
        if (dontCome[key].amount != 0) {
        // Win 1:1 and get initial bet back
          payout = dontCome[key].amount;
          action = 'return';
          if (dontCome[key].odds.amount != 0 && gameOn == true) {
            payout += dontCome[key].odds.amount * dontCome[key].odds.multiplier;
            action = 'return-odds';
          }
          payoutSubTotal += payout;
          master_timing_function(dontCome[key], payout, action);
        }
        
      }
    }
    if (payoutSubTotal != 0) {
      //bankroll += payoutSubTotal;
      //update_bankroll();
      message = `Won $${payoutSubTotal} on the Don\'t Come Bets`;
    }
  } else { // Sum = 4, 5, 6, 8, 9, or 10
    if (dontCome[sum].amount != 0) {
      message_display(`Lost $${dontCome[sum].amount} on DC ${sum}`);
      master_timing_function(dontCome[sum], 0, 'lose');
      if (dontCome[sum].odds.amount != 0) {
        if (gameOn == true) {
          message_display(`Lost $${dontCome[sum].odds.amount} on DC ${sum} odds`);
          master_timing_function(dontCome[sum].odds, 0, 'lose');
        } else {
          //bankroll += dontCome[sum].odds.amount;
          message_display(`$${dontCome[sum].odds.amount} DC ${sum} odds returned`);
          master_timing_function(dontCome[sum].odds, 0, 'return');
        }
      }
    }
  }
}

// ((((((((((((((((((( BONUS BETS )))))))))))))))))))

function check_bonus_bet(sum) {
if (bonus.small.amount != 0 || bonus.all.amount != 0) {
    allNumbersCircles[sum].style.backgroundColor = 'gold';
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
  if (bonus.tall.amount != 0 || bonus.all.amount != 0) {
      allNumbersCircles[sum].style.backgroundColor = 'gold';
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
  payout = bonus.small.amount * bonus.small.multiplier;
  master_timing_function(bonus.small, payout, 'return');
  update_bankroll();
  for (i = 0; i < 4; i++) {
  message_display('All Small Bonus Bet Hit !');
  }
  message_display(`Won $${payout}`);
  master_timing_function(bonus.small, payout, 'return');
  bonus.small.paid = true;
  }
  if (bonus.tall.allHit == true && bonus.tall.paid == false) {
    payout = bonus.tall.amount * bonus.tall.multiplier;
    master_timing_function(bonus.tall, payout, 'return');
    update_bankroll();
    for (i = 0; i < 4; i++) {
    message_display('All Tall Bonus Bet Hit !');
    }
    message_display(`Won $${payout}`);
    master_timing_function(bonus.tall, payout, 'return');
    bonus.tall.paid = true;
  }
  if (bonus.tall.allHit == true && bonus.small.allHit == true && bonus.all.paid == false) {
    payout = bonus.all.amount * bonus.all.multiplier;
    master_timing_function(bonus.all, payout, 'return');
    update_bankroll();
    message_display('Make \'Em All Bonus Bet Hit!');
    message_display(`Won $${payout}`);
    master_timing_function(bonus.all, payout, 'return');
    bonus.all.paid = true;
    clear_bonus_bet();
  }
}
function clear_bonus_bet() {
  if (bonus.small.amount != 0) master_timing_function(bonus.small, 0, 'lose');
  if (bonus.tall.amount != 0) master_timing_function(bonus.tall, 0, 'lose');
  if (bonus.all.amount != 0) master_timing_function(bonus.all, 0, 'lose');

  bonus.small.allHit = false;
  bonus.small.paid = false;
  bonus.tall.allHit = false;
  bonus.tall.paid = false;
  bonus.all.paid = false;
  for (const key in bonus.small.hit) {
    bonus.small.hit[key] = false;
    bonus.tall.hit[key + 6] = false;
  }
  for (const key in allNumbersCircles) {
    allNumbersCircles[Number(key)].style.backgroundColor = 'transparent';
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
increment500.addEventListener('click', function() {increment(500)});
increment5000.addEventListener('click', function() {increment(5000)});
decrement1.addEventListener('click', function() {decrement(1)});
decrement5.addEventListener('click', function() {decrement(5)});
decrement25.addEventListener('click', function() {decrement(25)});
decrement100.addEventListener('click', function() {decrement(100)});
decrement500.addEventListener('click', function() {decrement(500)});
decrement5000.addEventListener('click', function() {decrement(5000)});


rollButton.addEventListener('click', function() {
  if (isCoolDown) return;
    roll_dice();
    isCoolDown = true;
});

pullBackButton.addEventListener('click', pull_back_in_progress);
clearBetButton.addEventListener('click', function() {
  playSound = false;

  reset_stagedBet();
});

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


placeBet[4].button.addEventListener('click', (e) => {
  if (pullBackInProgress == true) {
    remove_chips_from_table(placeBet[4].chips);
    placeBet[4].amount = pull_back_bet(placeBet[4].amount);
  } else {
    if (stagedBet % 5 != 0) {
      alert('4 pays out 9:5. Bet must be divisible by 5');
    } else place_bet(4);
  }
  prevClicked = placeBet[4].button;
});
placeBet[5].button.addEventListener('click', (e) => {
  if (pullBackInProgress == true) {
    remove_chips_from_table(placeBet[5].chips);
    placeBet[5].amount = pull_back_bet(placeBet[5].amount);
  } else {
    if (stagedBet % 5 != 0) {
      alert('5 pays out 7:5. Bet must be divisible by 5')
    } else {
      place_bet(5);
    }
  }
  prevClicked = placeBet[5].button;
});
placeBet[6].button.addEventListener('click', (e) => {
  if (pullBackInProgress == true) {
    remove_chips_from_table(placeBet[6].chips);
    placeBet[6].amount = pull_back_bet(placeBet[6].amount);
  } else {
    if (stagedBet % 6 != 0) {
      alert('6 pays out 7:6. Bet must be divisible by 6')
    } else {
      place_bet(6);
    }
  }
  prevClicked = placeBet[6].button;
});
placeBet[8].button.addEventListener('click', (e) => {
  if (pullBackInProgress == true) {
    remove_chips_from_table(placeBet[8].chips);
    placeBet[8].amount = pull_back_bet(placeBet[8].amount);
  } else {
    if (stagedBet % 6 != 0) {
      alert('8 pays out 7:6. Bet must be divisible by 6')
    } else {
      place_bet(8);
    }
  }
  prevClicked = placeBet[8].button;
});
placeBet[9].button.addEventListener('click', (e) => {
  if (pullBackInProgress == true) {
    remove_chips_from_table(placeBet[9].chips);
    placeBet[9].amount = pull_back_bet(placeBet[9].amount);
  } else {
    if (stagedBet % 5 != 0) {
      alert('9 pays out 7:5. Bet must be divisible by 5');
    } else {
      place_bet(9);
    }
  }
  prevClicked = placeBet[9].button;
});
placeBet[10].button.addEventListener('click', (e) => {
  if (pullBackInProgress == true) {
    remove_chips_from_table(placeBet[10].chips);
    placeBet[10].amount = pull_back_bet(placeBet[10].amount);
  } else {
    if (stagedBet % 5 != 0) {
      alert('10 pays out 9:5. Bet must be divisible by 5');
    } else place_bet(10);
  }
  prevClicked = placeBet[10].button;
});

// Dont Come Line
dontCome.line.button.addEventListener('click', (e) => {
  dont_come_line_event();
  prevClicked = dontCome.line.button;
});
dontCome.line.button2.addEventListener('click', (e) => {
  dont_come_line_event();
  prevClicked = dontCome.line.button2;
});
dontCome.line.button3.addEventListener('click', (e) => {
  dont_come_line_event();
  prevClicked = dontCome.line.button3;
});


function dont_come_line_event() {
  if (gameOn == false) {
    alert('You cannot bet on the Don\'t Come Line until a point has been established.');
  } else {
    dont_come_bet();
  }
}

dontCome[4].button.addEventListener('click', (e) => {
  if (stagedBet < minBet && pullBackInProgress != true) {
    alert('Minimum Bet is $' + minBet);
  } else if (pullBackInProgress == true) {
    remove_chips_from_table(dontCome[4].odds.chips);
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
    remove_chips_from_table(dontCome[5].odds.chips);
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
    remove_chips_from_table(dontCome[6].odds.chips);
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
    remove_chips_from_table(dontCome[8].odds.chips);
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
    remove_chips_from_table(dontCome[9].odds.chips);
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
    remove_chips_from_table(dontCome[10].odds.chips);
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
    remove_chips_from_table(come[4].odds.chips);
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
    remove_chips_from_table(come[5].odds.chips);
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
    remove_chips_from_table(come[6].odds.chips);
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
    remove_chips_from_table(come[8].odds.chips);
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
    remove_chips_from_table(come[9].odds.chips);
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
    remove_chips_from_table(come[10].odds.chips);
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
  if (pullBackInProgress == true && field.amount != 0) {
    remove_chips_from_table(field.chips);
    field.amount = pull_back_bet(field.amount);
  } else {
    field_bet();
  }
  prevClicked = field.button;
});

dontPassBar.button.addEventListener('click', (e) => {
  dont_pass_bar_event();
  prevClicked = dontPassBar.button;
});
dontPassBar.vertButton.addEventListener('click', (e) => {
  dont_pass_bar_event();
  prevClicked = dontPassBar.vertButton;
});
  
function dont_pass_bar_event () {
  if (pullBackInProgress == true && gameOn == false) { // Could probably branch these in pullbackinprogress
    remove_chips_from_table(dontPassBar.chips);
    dontPassBar.amount = pull_back_bet(dontPassBar.amount);
    check_roll_button();
  } else if (pullBackInProgress == true && gameOn == true) {
    alert('Cannont Pull Back While Game is On.');
    reset_stagedBet();
  } else if (dontPassBar.amount != 0) {
    dont_pass_odds();
  } else if (gameOn == false) {
    dont_pass_line();
  } // else game is on and click does nothing
}

passLine.button.addEventListener('click', function() {
  pass_line_event();
  prevClicked = passLine.button;
});
  
passLine.vertButton.addEventListener('click', function () {
  pass_line_event();
  prevClicked = passLine.vertButton;
});
  
function pass_line_event() {
  if (pullBackInProgress == true && gameOn == false) { // Could probably branch these in pullbackinprogress
    remove_chips_from_table(passLine.chips);
    passLine.amount = pull_back_bet(passLine.amount); // Sets value to 0
    check_roll_button();
  } else if (pullBackInProgress == true && gameOn == true) {
    alert('Cannont Pull Back Pass Line While Game is On.');
    reset_stagedBet();
  } else if (passLine.amount != 0) {
    press_bet(passLine, 'face', 'table', 'normal');
  } else if (gameOn == false) {
    pass_line();
  } // else game is on and click does nothing
}

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
  prevClicked = passLine.odds.button;
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

big[6].button.addEventListener('click', function() {
  big_6_8('place', 6);
  prevClicked = big[6].button;
});

big[8].button.addEventListener('click', function() {
  big_6_8('place', 8);
  prevClicked = big[8].button;
});

// ^^^^^^^^^^^^^^^^^^^^^^^^^ END EVENT LISTENERS ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


