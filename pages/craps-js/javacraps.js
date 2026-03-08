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
const original = {};
const minBet = 25;

let gameOn = false;

// Table Bet Storage Variables
let passLineBet = 0;
let placeBet = {4:0, 5:0, 6:0, 8:0, 9:0, 10:0};


// Numbers/Messages
const betElement = document.getElementById('staged-bet');
const betContainerElement = document.getElementById('bet-left');
const bankrollElement = document.getElementById('bankroll');

const dice1Element = document.getElementById('dice1');
const dice2Element = document.getElementById('dice2');

// Betting Buttons
const incrementButton = document.getElementById('increment1');
const decrementButton = document.getElementById('decrement1');
const plus5button = document.getElementById('increment5');
const minus5button = document.getElementById('decrement5');
const twentyFive = document.getElementById('twenty-five');
const thirty = document.getElementById('thirty');
const oneHundred = document.getElementById('one-hundred');
const twoFifty = document.getElementById('two-fifty');
const rollButton = document.getElementById('roll-button');
const pullBackButton = document.getElementById('pull-back-button');

// Table Buttons
const passLineElement = document.getElementById('pass-line');
original.passLineElement = passLineElement.textContent;
const placeBetElement = {
    four: document.getElementById('placebet-4'),
    five: document.getElementById('placebet-5'),
    six: document.getElementById('placebet-6'),
    eight: document.getElementById('placebet-8'),
    nine: document.getElementById('placebet-9'),
    ten: document.getElementById('placeet-10')
};
const placeBetChipsDisplayElement = {
    four: document.getElementById('pb-4-chips'),
    five: document.getElementById('pb-5-chips'),
    six: document.getElementById('pb-6-chips'),
    eight: document.getElementById('pb-8-chips'),
    nine: document.getElementById('pb-9-chips'),
    ten: document.getElementById('pb-10-chips')
};
const dontComeChipsDisplayElement = {
    four: document.getElementById('dc-4'),
    five: document.getElementById('dc-5'),
    six: document.getElementById('dc-6'),
    eight: document.getElementById('dc-8'),
    nine: document.getElementById('dc-9'),
    ten: document.getElementById('dc-10')
}


// ON puck images loaded dynamically in F come out roll
// Place Bet spaces


const rollMessageElement = document.getElementById('roll-box');
const messageElement = document.getElementById('message-box');
// Testing Elements
const moneyOnTableElement = document.getElementById('money-on-table');


// Functions
function check_for_chip_img() {
    if (stagedBet == 0) {
        betContainerElement.style.backgroundImage = "url('')";
    } else {
        betContainerElement.style.backgroundImage = "url('img/chip_red.png')";
    }
}
function incrementbyone() {
    if (stagedBet < bankroll) {
    stagedBet++;
    betElement.textContent = '$' + stagedBet;
    play_increment_sound();
    check_for_chip_img();
    }
}
function incrementbyfive() {
    if (stagedBet < bankroll) {
    stagedBet += 5;
    betElement.textContent = '$' + stagedBet;
    play_increment_sound();
    check_for_chip_img();
    }
}
function decrementbyone() {
    if (stagedBet > 0) {
    stagedBet--;
    betElement.textContent = '$' + stagedBet;
    play_decrement_sound();
    check_for_chip_img();
    }
}
function decrementbyfive() {
    if (stagedBet >= 5) {
    stagedBet = stagedBet - 5;
    betElement.textContent = '$' + stagedBet;
    play_decrement_sound();
    check_for_chip_img();
    }
}
function make_twenty_five() {
    if (stagedBet < bankroll) {
    stagedBet = 25;
    betElement.textContent = '$' + stagedBet;
    play_increment_sound();
    check_for_chip_img();
    }
}
function make_thirty() {
    if (stagedBet < bankroll) {
    stagedBet = 30;
    betElement.textContent = '$' + stagedBet;
    play_increment_sound();
    check_for_chip_img();
    }
}
function make_one_hundred() {
    if (stagedBet < bankroll) {
    stagedBet = 100;
    betElement.textContent = '$' + stagedBet;
    play_increment_sound();
    check_for_chip_img();
    }
}
function make_two_fifty() {
    if (stagedBet < bankroll) {
    stagedBet = 250;
    betElement.textContent = '$' + stagedBet;
    play_increment_sound();
    check_for_chip_img();
    }
}
function play_decrement_sound() {
    soundSelector = Math.floor(Math.random()*3)+1;
    decrementSound = new Audio(`sounds/Chips_Remove_${soundSelector}.mp3`);
    decrementSound.play();
}
function play_increment_sound() {
    soundSelector = Math.floor(Math.random()*4)+1;
    incrementSound = new Audio(`sounds/Chips_Add_${soundSelector}.mp3`);
    incrementSound.play();
}

function update_bankroll() {
    bankroll -= stagedBet;
    bankrollElement.textContent = '$' + bankroll;
}
function commit_bet(betToPlace) {
    betToPlace = stagedBet;
    moneyOnTable += betToPlace; // Testing purposes
    moneyOnTableElement.textContent = '$' + moneyOnTable; // Testing purposes
    update_bankroll();
    reset_stagedBet();
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
    betElement.style.fontSize = '20px';
    betElement.textContent = 'Select Bet to Pull Back';
    pullBackInProgress = true;
}
function pull_back_bet(amount) {
    bankroll += amount;
    moneyOnTable -= amount;
    moneyOnTableElement.textContent = '$' + moneyOnTable;
    reset_stagedBet();
    update_bankroll();
    play_decrement_sound();
    pullBackInProgress = false;
    amount = 0;
    return amount;
}

function reset_stagedBet() {
    stagedBet = 0;
    betElement.textContent = '$0';
    betElement.style.fontSize = '30px';
    check_for_chip_img();
}

// Placing Bets on the table

function pass_line() {
    if (stagedBet >= minBet) {
        //if (passLineBet == 0) {
        passLineBet = commit_bet(passLineBet);
        passLineElement.textContent = `PASS LINE $${passLineBet}`;
        //} else {
            //if (confirm('Do you want to change your bet?')) {
            //    passLineBet = change_bet(passLineBet);
            //    passLineElement.textContent = 'PASS LINE $' + passLineBet;
            //}
        //}
    } else {
        alert('The minimum bet is $' + minBet + '.');
    }
}
function place_bet(selector) {
    if (stagedBet < minBet) {
        alert('The minimum bet is $' + minBet + '.');
    } else {
        switch (selector) {
            case 4:
                placeBet[4] = commit_bet(placeBet[4]);
                placeBetChipsDisplayElement.four.textContent = '$' + placeBet[4];
                

        }
    }
}
// ^^^^^^^^^^ end placing bets ^^^^^^^^^^^^^^^^^^^

function roll_dice() {
    reset_stagedBet();
    messageElement.textContent = '';
    if (passLineBet == 0) {
        alert('You must play the pass line to roll')
    } else {
        dice1 = Math.floor(Math.random()*6) + 1;
        dice2 = Math.floor(Math.random()*6) + 1;
        sum = dice1 + dice2;
        rollMessageElement.textContent = 'Player Rolled ' + sum;
        dice1Element.src = `img/red_${dice1}.png`;
        dice2Element.src = `img/red_${dice2}.png`;

        soundSelector = Math.floor(Math.random()*3)+1;
        diceRollSound = new Audio(`sounds/Dice_Roll_${soundSelector}.mp3`);
        diceRollSound.play();
        score_roll();
}
}

function score_roll() {
    if (gameOn == false) {
        come_out_roll();
    }
}

function come_out_roll() {
    if (sum == 2 || sum == 3 || sum == 12) {
        messageElement.textContent = 'Craps';
        passLineElement.textContent = original.passLineElement;
        passLineBet = 0;
    } else if (sum == 7 || sum == 11) {
        messageElement.textContent = 'You won $' + passLineBet;
        bankroll += passLineBet;
        update_bankroll();
    } else {
        target = sum; // Target assigned
        gameOn = true;
        display_on_marker();
    }
}

function display_on_marker() {
    const onIMG = document.getElementById(`on-${target}`);
    onIMG.src = 'img/on.png';
    onIMG.style.zIndex = 20;
    document.getElementById(`dc-${target}`).style.zIndex = '0';
    messageElement.textContent = `Point established on ${target}`;

}

// STOPPING HERE OBVIOUSLY THESE NEED TO BE ChANGED

// Add event listeners
incrementButton.addEventListener('click', incrementbyone);
decrementButton.addEventListener('click', decrementbyone);
plus5button.addEventListener('click', incrementbyfive);
minus5button.addEventListener('click', decrementbyfive);
twentyFive.addEventListener('click', make_twenty_five);
thirty.addEventListener('click', make_thirty);
oneHundred.addEventListener('click', make_one_hundred);
twoFifty.addEventListener('click', make_two_fifty);
rollButton.addEventListener('click', roll_dice);

pullBackButton.addEventListener('click', pull_back_in_progress)


// ################### Table ############################


passLineElement.addEventListener('click', (e) => {
    if (pullBackInProgress == true && gameOn == false) { // Could probably branch these in pullbackinprogress
        passLineElement.textContent = original.passLineElement;
        passLineBet = pull_back_bet(passLineBet);
    } else if (pullBackInProgress == true && gameOn == true) {
        alert('Cannont Pull Back Pass Line While Game is On.');
        reset_stagedBet();
    } else if (gameOn == false) {
        pass_line();
    } // else game is on and click does nothing
});

placeBetElement.four.addEventListener('click', (e) => {
    if (pullBackInProgress == true) {
        placeBetChipsDisplayElement.four.textContent = '';
        placeBet[4] = pull_back_bet(placeBet[4]);
    } else {
        place_bet(4);
    }
});

// ^^^^^^^^^^^^^^^^ END Table ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^



