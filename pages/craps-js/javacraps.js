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

let gameOn = false;

// Table Bet Storage Variables
let passLineBet = 0;
let placeBet = {4:0, 5:0, 6:0, 8:0, 9:0, 10:0};
let payout = 0;
let hardwaysBet = {4:0, 6:0, 8:0, 10:0};
let crapsBet = {2:0, 3:0, 11:0, 12:0};


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


const placeBetElement = {
    four: document.getElementById('placebet-4'),
    five: document.getElementById('placebet-5'),
    six: document.getElementById('placebet-6'),
    eight: document.getElementById('placebet-8'),
    nine: document.getElementById('placebet-9'),
    ten: document.getElementById('placebet-10')
}
const placeBetChipsDisplayElement = {
    four: document.getElementById('pb-4-chips'),
    five: document.getElementById('pb-5-chips'),
    six: document.getElementById('pb-6-chips'),
    eight: document.getElementById('pb-8-chips'),
    nine: document.getElementById('pb-9-chips'),
    ten: document.getElementById('pb-10-chips')
}
const dontComeChipsDisplayElement = {
    four: document.getElementById('dc-4'),
    five: document.getElementById('dc-5'),
    six: document.getElementById('dc-6'),
    eight: document.getElementById('dc-8'),
    nine: document.getElementById('dc-9'),
    ten: document.getElementById('dc-10')
}

const hardwaysElement = {
    four: document.getElementById('hardways-4'),
    six: document.getElementById('hardways-6'),
    eight: document.getElementById('hardways-8'),
    ten: document.getElementById('hardways-10')
}

const hardwaysTextElement = {
    four: document.getElementById('hw-4-text'),
    six: document.getElementById('hw-6-text'),
    eight: document.getElementById('hw-8-text'),
    ten: document.getElementById('hw-10-text')
}

const crapsElement = {
    two: document.getElementById('craps-2'),
    three: document.getElementById('craps-3'),
    eleven: document.getElementById('craps-11'),
    twelve: document.getElementById('craps-12')
}
const crapsTextElement = {
    two: document.getElementById('craps-2-text'),
    three: document.getElementById('craps-3-text'),
    eleven: document.getElementById('craps-11-text'),
    twelve: document.getElementById('craps-12-text')
}

const original = {
    passLineElement: passLineElement.textContent,
    hardwaysTextElementStyle: hardwaysTextElement.four.textContent
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
    update_moneyOnTable();
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
    update_moneyOnTable();
    reset_stagedBet();
    update_bankroll();
    play_decrement_sound();
    pullBackInProgress = false;
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
    stagedBet = 0;
    betElement.textContent = '$0';
    betElement.style.fontSize = '30px';
    check_for_chip_img();
}

function update_moneyOnTable() {
    moneyOnTableElement.textContent = '$' + moneyOnTable;
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
    } else if (placeBet[selector] != 0) {
        alert(`You already have a Place Bet on ${selector}. 
Pull back bet to change.`);
    } else {
        switch (selector) {
            case 4:
                placeBet[4] = commit_bet(placeBet[4]);
                placeBetChipsDisplayElement.four.textContent = '$' + placeBet[4];
                break;
            case 5:
                placeBet[5] = commit_bet(placeBet[5]);
                placeBetChipsDisplayElement.five.textContent = '$' + placeBet[5];
                break;
            case 6:
                placeBet[6] = commit_bet(placeBet[6]);
                placeBetChipsDisplayElement.six.textContent = '$' + placeBet[6];
                break;
            case 8:
                placeBet[8] = commit_bet(placeBet[8]);
                placeBetChipsDisplayElement.eight.textContent = '$' + placeBet[8];
                break;
            case 9:
                placeBet[9] = commit_bet(placeBet[9]);
                placeBetChipsDisplayElement.nine.textContent = '$' + placeBet[9];
                break;
            case 10:
                placeBet[10] = commit_bet(placeBet[10]);
                placeBetChipsDisplayElement.ten.textContent = '$' + placeBet[10];
                break;
        }
    }
}
function hardways_bet(selector) {
    if (hardwaysBet[selector] != 0) {
        alert(`You already have a Hardways Bet on ${selector}. 
Pull back bet to change.`);
    } else {
        switch (selector) {
            case 4:
                hardwaysBet[4] = commit_bet(hardwaysBet[4]);
                hardwaysTextElement.four.textContent = '$' + hardwaysBet[4];
                hardwaysTextElement.four.style.color = 'yellow';
                hardwaysTextElement.four.style.fontSize = '25px';
                break;
            case 6:
                hardwaysBet[6] = commit_bet(hardwaysBet[6]);
                hardwaysTextElement.six.textContent = '$' + hardwaysBet[6];
                hardwaysTextElement.six.style.color = 'yellow';
                hardwaysTextElement.six.style.fontSize = '25px';
                break;
            case 8:
                hardwaysBet[8] = commit_bet(hardwaysBet[8]);
                hardwaysTextElement.eight.textContent = '$' + hardwaysBet[8];
                hardwaysTextElement.eight.style.color = 'yellow';
                hardwaysTextElement.eight.style.fontSize = '25px';
                break;
            case 10:
                hardwaysBet[10] = commit_bet(hardwaysBet[10]);
                hardwaysTextElement.ten.textContent = '$' + hardwaysBet[10];
                hardwaysTextElement.ten.style.color = 'yellow';
                hardwaysTextElement.ten.style.fontSize = '25px';
                break;
            }
        }
    }

function craps_bet(selector) {
    if (crapsBet[selector] != 0) {
        alert(`You already have a Craps Bet on ${selector}. 
Pull back bet to change.`);
    } else {
        switch (selector) {
            case 2:
                crapsBet[2] = commit_bet(crapsBet[2]);
                crapsTextElement.two.textContent = '$' + crapsBet[2];
                crapsTextElement.two.style.color = 'yellow';
                crapsTextElement.two.style.fontSize = '25px';
                break;
            case 3:
                crapsBet[3] = commit_bet(crapsBet[3]);
                crapsTextElement.three.textContent = '$' + crapsBet[3];
                crapsTextElement.three.style.color = 'yellow';
                crapsTextElement.three.style.fontSize = '25px';
                break;
            case 11:
                crapsBet[11] = commit_bet(crapsBet[11]);
                crapsTextElement.eleven.textContent = '$' + crapsBet[11];
                crapsTextElement.eleven.style.color = 'yellow';
                crapsTextElement.eleven.style.fontSize = '25px';
                break;
            case 12:
                crapsBet[12] = commit_bet(crapsBet[12]);
                crapsTextElement.twelve.textContent = '$' + crapsBet[12];
                crapsTextElement.twelve.style.color = 'yellow';
                crapsTextElement.twelve.style.fontSize = '25px';
                break;
        }
    }
}

// ^^^^^^^^^^ end placing bets ^^^^^^^^^^^^^^^^^^^

function roll_dice() {
    if (passLineBet == 0) {
        alert('You must play the pass line to roll')
    } else {
        reset_stagedBet();
        messageElement.textContent = '';
        dice1 = Math.floor(Math.random()*6) + 1;
        dice2 = Math.floor(Math.random()*6) + 1;
        sum = dice1 + dice2;
        display_roll_message();
        dice1Element.src = `img/red_${dice1}.png`;
        dice2Element.src = `img/red_${dice2}.png`;

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

function display_roll_message() {
    if (dice1 == dice2) {
            rollMessageElement.textContent = 'Hard ' + sum;
        } else if (sum == 3) {
            rollMessageElement.textContent = 'Craps ' + sum;
        } else if (sum == 2) {
            rollMessageElement.textContent = 'Snake Eyes';
        } else if (sum == 7) {
            if (gameOn == false) {
                rollMessageElement.textContent = 'Good 7';
            } else {
                rollMessageElement.textContent = 'Ouch';
            }
        } else if (sum == 11) {
            rollMessageElement.textContent = 'Yo';
        } else if (sum == 12) {
            rollMessageElement.textContent = 'Midnight';
        } else {
            rollMessageElement.textContent = 'Player Rolled ' + sum;
        }
}

function come_out_roll() {
    if (sum == 2 || sum == 3 || sum == 12) {
        messageElement.textContent = 'Craps. Lose Pass Line';
        passLineElement.textContent = original.passLineElement;
        moneyOnTable -= passLineBet;
        passLineBet = 0;
        update_moneyOnTable();
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

function score_roll() {
    if (sum == 7) {
        clear_table();
        gameOn = false;
        remove_on_marker();
    }
    // Place Bets
    for (const key in placeBet) {
        if (placeBet[key] !== 0) {
        score_place_bets();
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
            messageElement.textContent = `${sum} not hard. Lose your $${hardwaysBet[sum]} bet.`;
            hardwaysBet[sum] = lose_bet(hardwaysBet[sum]);
        } else if (hardwaysBet[sum] !== 0 && dice1 == dice2) {
            score_hardways_bets();
        }
    }
    // One Roll Bets
    score_craps_bets();
}

function clear_table() {
    messageElement.textContent = 'Seven Out. All bets cleared.'
    update_moneyOnTable();

    passLineElement.textContent = original.passLineElement;
    passLineBet = 0;

    placeBetChipsDisplayElement.four.textContent = '';
    placeBet[4] = 0;
    placeBetChipsDisplayElement.five.textContent = '';
    placeBet[5] = 0;
    placeBetChipsDisplayElement.six.textContent = '';
    placeBet[6] = 0;
    placeBetChipsDisplayElement.eight.textContent = '';
    placeBet[8] = 0;
    placeBetChipsDisplayElement.nine.textContent = '';
    placeBet[9] = 0;
    placeBetChipsDisplayElement.ten.textContent = '';
    placeBet[10] = 0;

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
}

function score_place_bets() {
    if (placeBet[4] != 0 && sum == 4) {
        payout = placeBet[4]*9/5;
        bankroll += payout;
        update_bankroll();
        messageElement.textContent = `Player wins $${payout}!`;
    }
    if (placeBet[5] != 0 && sum == 5) {
        payout = placeBet[5]*7/5;
        bankroll += payout;
        update_bankroll();
        messageElement.textContent = `Player wins $${payout}!`;
    }
    if (placeBet[6] != 0 && sum == 6) {
        payout = placeBet[6]*7/6;
        bankroll += payout;
        update_bankroll();
        messageElement.textContent = `Player wins $${payout}!`;
    }
    if (placeBet[8] != 0 && sum == 8) {
        payout = placeBet[8]*7/6;
        bankroll += payout;
        update_bankroll();
        messageElement.textContent = `Player wins $${payout}!`;
    }
    if (placeBet[9] != 0 && sum == 9) {
        payout = placeBet[9]*7/5;
        bankroll += payout;
        update_bankroll();
        messageElement.textContent = `Player wins $${payout}!`;
        }
    if (placeBet[10] != 0 && sum == 10) {
        payout = placeBet[10]*9/5;
        bankroll += payout;
        update_bankroll();
        messageElement.textContent = `Player wins $${payout}!`;
    }
    
}

function score_hardways_bets() {
    if (hardwaysBet[4] != 0 && sum == 4) {
        payout = hardwaysBet[4]*7;
        bankroll += payout;
        update_bankroll();
        messageElement.textContent = `Player Wins $${payout} on Hard 4`;
    }
    if (hardwaysBet[6] != 0 && sum == 6) {
        payout = hardwaysBet[6]*9;
        bankroll += payout;
        update_bankroll();
        messageElement.textContent = `Player Wins $${payout} on Hard 6`;
    }
    if (hardwaysBet[8] != 0 && sum == 8) {
        payout = hardwaysBet[8]*9;
        bankroll += payout;
        update_bankroll();
        messageElement.textContent = `Player Wins $${payout} on Hard 8`;
    }
    if (hardwaysBet[10] != 0 && sum == 10) {
        payout = hardwaysBet[10]*7;
        bankroll += payout;
        update_bankroll();
        messageElement.textContent = `Player Wins $${payout} on Hard 10`;
    }
}

function score_craps_bets() {
    for (const key in crapsBet) {
        if (key == sum) {
            switch (sum) {
                case 2:
                    payout = crapsBet[2] * 30;
                    crapsBet[2] = lose_bet(crapsBet[2]);
                    oneRollWinner = 2;
                    break;
                case 3:
                    payout = crapsBet[3] * 15;
                    crapsBet[3] = lose_bet(crapsBet[3]);
                    oneRollWinner = 3;
                    break;
                case 11:
                    payout = crapsBet[11] * 15;
                    crapsBet[11] = lose_bet(crapsBet[11]);
                    oneRollWinner = 11;
                    break;
                case 12:
                    payout = crapsBet[12] * 30;
                    crapsBet[12] = lose_bet(crapsBet[12]);
                    oneRollWinner = 12;
                    break;
            }
            bankroll += payout;
            update_bankroll();
            messageElement.textContent = `Player Wins $${payout} on ${sum}.
One Roll Bets Cleared.`;
        } else {
            crapsBet[key] = lose_bet(crapsBet[key]);
        }
    }
    reset_craps_bets_text();
}

function reset_craps_bets_text() {
    if (oneRollWinner == 2) {
        crapsTextElement.two.textContent = 'WINNER!';
    } else {
        crapsTextElement.two.textContent = '30 to 1';
        crapsTextElement.two.style = original.hardwaysTextElementStyle;
    }
    if (oneRollWinner == 12) {
        crapsTextElement.twelve.textContent = 'WINNER!';
    } else {
        crapsTextElement.twelve.textContent = '30 to 1';
        crapsTextElement.twelve.style = original.hardwaysTextElementStyle;
    }
    if (oneRollWinner == 11) {
        crapsTextElement.eleven.textContent = 'WINNER!';
    } else {
        crapsTextElement.eleven.textContent = '15 to 1';
        crapsTextElement.eleven.style = original.hardwaysTextElementStyle;
    }
    if (oneRollWinner == 3) {
        crapsTextElement.three.textContent = '15 to 1';
    } else {
        crapsTextElement.three.textContent = '15 to 1';
        crapsTextElement.three.style = original.hardwaysTextElementStyle;
    }
}


function display_on_marker() {
    const onIMG = document.getElementById(`on-${target}`);
    onIMG.src = 'img/on.png';
    onIMG.style.zIndex = '20';
    document.getElementById(`dc-${target}`).style.zIndex = '0';
    messageElement.textContent = `Point established on ${target}`;
}
function remove_on_marker() {
    document.getElementById(`on-${target}`).src = 'img/on-placeholder.png';
    document.getElementById(`on-${target}`).style.zIndex = '-1';
    document.getElementById(`dc-${target}`).style.zIndex = '1';
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
    } else if (passLineBet != 0) {
        //Do nothing
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
placeBetElement.five.addEventListener('click', (e) => {
    if (pullBackInProgress == true) {
        placeBetChipsDisplayElement.five.textContent = '';
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
        placeBetChipsDisplayElement.six.textContent = '';
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
        placeBetChipsDisplayElement.eight.textContent = '';
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
        placeBetChipsDisplayElement.nine.textContent = '';
        placeBet[8] = pull_back_bet(placeBet[9]);
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
        placeBetChipsDisplayElement.ten.textContent = '';
        placeBet[10] = pull_back_bet(placeBet[10]);
    } else {
        place_bet(10);
    }
});

// ---------------- HARDWAYS -------------------------- HARDWAYS
hardwaysElement.four.addEventListener('click', (e) => {
    if (pullBackInProgress == true) {
        hardwaysTextElement.four.textContent = '7 to 1';
        hardwaysTextElement.four.style = original.hardwaysTextElementStyle;
        hardwaysBet[4] = pull_back_bet(hardwaysBet[4]);
    } else {
        hardways_bet(4);
    }
});
hardwaysElement.six.addEventListener('click', (e) => {
    if (pullBackInProgress == true) {
        hardwaysTextElement.six.textContent = '9 to 1';
        hardwaysTextElement.six.style = original.hardwaysTextElementStyle;
        hardwaysBet[6] = pull_back_bet(hardwaysBet[6]);
    } else {
        hardways_bet(6);
    }
});
hardwaysElement.eight.addEventListener('click', (e) => {
    if (pullBackInProgress == true) {
        hardwaysTextElement.eight.textContent = '9 to 1';
        hardwaysTextElement.eight.style = original.hardwaysTextElementStyle;
        hardwaysBet[8] = pull_back_bet(hardwaysBet[8]);
    } else {
        hardways_bet(8);
    }
});
hardwaysElement.ten.addEventListener('click', (e) => {
    if (pullBackInProgress == true) {
        hardwaysTextElement.ten.textContent = '7 to 1';
        hardwaysTextElement.ten.style = original.hardwaysTextElementStyle;
        hardwaysBet[10] = pull_back_bet(hardwaysBet[10]);
    } else {
        hardways_bet(10);
    }
});

// -------------- CRAPS BETS ---------------------------
crapsElement.two.addEventListener('click', (e) => {
    if (pullBackInProgress == true) {
        crapsTextElement.two.textContent = '30 to 1';
        crapsTextElement.two.style = original.hardwaysTextElementStyle;
        crapsBet[2] = pull_back_bet(crapsBet[2]);
    } else {
        craps_bet(2);
    }
});
crapsElement.three.addEventListener('click', (e) => {
    if (pullBackInProgress == true) {
        crapsTextElement.three.textContent = '30 to 1';
        crapsTextElement.three.style = original.hardwaysTextElementStyle;
        crapsBet[3] = pull_back_bet(crapsBet[3]);
    } else {
        craps_bet(3);
    }
});
crapsElement.eleven.addEventListener('click', (e) => {
    if (pullBackInProgress == true) {
        crapsTextElement.eleven.textContent = '30 to 1';
        crapsTextElement.eleven.style = original.hardwaysTextElementStyle;
        crapsBet[11] = pull_back_bet(crapsBet[11]);
    } else {
        craps_bet(11);
    }
});
crapsElement.twelve.addEventListener('click', (e) => {
    if (pullBackInProgress == true) {
        crapsTextElement.twelve.textContent = '30 to 1';
        crapsTextElement.twelve.style = original.hardwaysTextElementStyle;
        crapsBet[12] = pull_back_bet(crapsBet[12]);
    } else {
        craps_bet(12);
    }
});
// ^^^^^^^^^^^^^^^^ END Table ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^



