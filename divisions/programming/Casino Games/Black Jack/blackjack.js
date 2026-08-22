/* KNOWN ISSUES

1. Changing bet by clicking bet circle with different amount
  causes money to be subtracted from bankroll and ghost added
  to money on table
2. Pull back bet button does not work
3. Double down not working properly (didn't get there yet)
4. Split still not implemented
5. Dealer delay function entering end round more than once when total > 17
6. Decrement sound playing when reset staged bet

*/

const suits = ['H', 'D', 'C', 'S'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
let initialDeck = [];
let deck = [];
const minBet = 10;
//let discard = [];
  //discard = [];

for (const [index, suit] of suits.entries()) {
  for (const [index, rank] of ranks.entries()) {
    initialDeck.push(rank + suit);
  }
}
function shuffleDeck() {
  tempDeck = initialDeck;
  for (let i = tempDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tempDeck[i], tempDeck[j]] = [tempDeck[j], tempDeck[i]];
  }

  for (let k = 0; k < tempDeck.length - 1; k++) {
    face = tempDeck[k];
    if (tempDeck[k].at(0) == 'J' || tempDeck[k].at(0) == 'Q' || tempDeck[k].at(0) == 'K') {
      value = 10;
    } else if (tempDeck[k].at(0) == 'A') {
      value = 11;
    } else {
      value = parseInt(tempDeck[k], 10);
    }
    deck.push({face, value});

  }
}

shuffleDeck();

// Finish Initial Setup
const dealerHandDiv = document.getElementById('dealer-hand');
const playerHandDiv = document.getElementById('player-hand');
let dealerHand = [];
let dealerTotal = 0;
let dealerAces = {num:0};
let faceDownCardValue = 0;
let playerHand = [];
let playerTotal = 0;
let playerAces = {num:0};
let round = 0;

const dealButton = document.getElementById('deal-button');
dealButton.addEventListener('click', deal_round);
const hitButton = document.getElementById('hit-button');
hitButton.addEventListener('click', hit);
const playerTotalElement = document.getElementById('player-total');
const dealerTotalElement = document.getElementById('dealer-total');
const stayButton = document.getElementById('stay-button');
stayButton.addEventListener('click', stay);
const doubleDownButton = document.getElementById('double-down-button');
doubleDownButton.addEventListener('click', double_down);
const splitButton = document.getElementById('split-button');

const debugBox = document.getElementById('debug-box');
function db(message) {
  debugBox.textContent = `${message}`;
}

const messageBoxDiv = document.getElementById('message-box');

function message(message) {
  const newDiv = document.createElement('div');
  newDiv.textContent = message;
  messageBoxDiv.insertBefore(newDiv, messageBoxDiv.firstChild);
}


function new_round() {
  dealerHand = [];
  dealerTotal = 0;
  dealerAces = 0;
  dealerHandDiv.replaceChildren();
  playerHand = [];
  playerTotal = 0;
  playerAces = 0;
  playerHandDiv.replaceChildren();
  hide(splitButton);
  messageBoxDiv.replaceChildren();
}

function deal_round() {
  if (round > 0) new_round();
  deal_card('player', playerHand, playerHandDiv);
  deal_face_down_card();
  deal_card('player', playerHand, playerHandDiv);
  deal_card('dealer', dealerHand, dealerHandDiv);
  make_inactive(dealButton);
  if (playerHand[0].at(0) == playerHand[1].at(0)) {
    unhide(splitButton);
  }
  update_player_total();
  update_dealer_total();
  round++;
  if (playerTotal == 21) {
    end_round();
    dealer_reveal_card();
  }
}

function deal_face_down_card() {
  if (deck.length < 1) shuffleDeck();
  face = deck[deck.length-1].face;
  value = deck[deck.length-1].value;
  const img = document.createElement('img');
  img.src = `playing_cards/card_back.png`;
  img.className = 'card';
  img.id = 'dealer-card';
  dealerHandDiv.appendChild(img);
  dealerHand.push(face);
  faceDownCardValue = value;
  if (face.at(0) == 'A') dealerAces++;
  deck.pop();
}


function deal_card(id, hand, element) {
  reset_stagedBet();
  if (deck.length < 1) shuffleDeck();
  face = deck[deck.length-1].face;
  value = deck[deck.length-1].value;
  const img = document.createElement('img');
  img.src = `playing_cards/${face}.png`;
  img.className = 'card';
  element.appendChild(img);
  hand.push(face);

  if (face.at(0) == 'A') {
    if (id == 'player') playerAces++;
    else dealerAces++;
  }

  if (id == 'player') playerTotal += value;
  else dealerTotal += value;
  deck.pop();
}

function hit() {
  deal_card('player', playerHand, playerHandDiv);
  update_player_total();
  if (playerTotal == 21) {
    stay();
  } else if (playerTotal > 21 && playerAces > 0) {
    playerTotal -= 10;
    playerAces--;
    update_player_total();
  } else if (playerTotal > 21) {
    end_round();
  }
}

function stay() {
  dealer_turn();
}

function double_down() {
  hit();
  stay();
}

function dealer_reveal_card() {
  const dealerFaceDownCard = document.getElementById('dealer-card');
  dealerFaceDownCard.src = `playing_cards/${dealerHand[0]}.png`;
  dealerTotal += faceDownCardValue;
  update_dealer_total();
}

function dealer_turn() {
  dealer_reveal_card();
  if (dealerTotal < 17) dealer_delay_func();
  else end_round();
}

function dealer_delay_func() {
  setTimeout(()=> {
      deal_card('dealer', dealerHand, dealerHandDiv);
      update_dealer_total();
      if (dealerTotal < 17) {
        dealer_delay_func();
      } else if (dealerTotal > 21 && dealerAces > 0) {
        dealerTotal -= 10;
        dealerAces--;
        update_dealer_total;
        dealer_delay_func();
      } else {
        end_round();
      }
    }, 500);
}

function end_round() {
  if (playerTotal > 21) bust();
  else if (playerTotal == 21 && playerHand.length == 2) blackjack();
  else if (playerTotal > dealerTotal || dealerTotal > 21) {
    // Player Win
    let winAmount = mainBet.amount;
    win(winAmount);
    make_active(dealButton);
  } else if (playerTotal == dealerTotal) {
    // Push
    message('Push');
    make_active(dealButton);
  } else {
    // PlayerTotal < dealerTotal <= 21
    // Player Lose
    lose();
  }
  update_bankroll();
}

function win(amount) {
  bankroll += amount;
  message(`Player won $${amount}`);
}

function lose() {
  message(`Player lost $${mainBet.amount}`);
  update_moneyOnTable('remove', mainBet.amount);
  reset_mainBet();
  make_inactive(dealButton);
}

function blackjack() {
  let winAmount = Math.floor(mainBet.amount * 3 / 2);
  message('BLACKJACK');
  win(winAmount);
  make_active(dealButton);
}

function bust() {
  message('Bust');
  setTimeout(()=> {
    lose();
    dealer_reveal_card();
  }, 400);
}

function make_inactive(button) {
  button.classList.add('inactive');
  button.disabled = true;
}

function make_active(button) {
  button.classList.remove('inactive');
  button.disabled = false;
}

function hide(button) {
  button.classList.add('hidden');
}

function unhide(button) {
  if (button.classList.contains('hidden')) {
    button.classList.remove('hidden');
  }
}

function update_player_total() {
  playerTotalElement.textContent = playerTotal;
}

function update_dealer_total() {
  dealerTotalElement.textContent = dealerTotal;
}


let mainBet = {
  button: document.getElementById('main-bet-button'),
  amount: 0,
  chips: {
    location: document.getElementById('main-bet-chips'),
    chip: [],
    leftSpacing: 15,
    bottom: 0
  }
}

const mainBetAmount = document.getElementById('main-bet-amount');

mainBet.button.addEventListener('click', ()=>{
  main_bet();
});

function main_bet() {
  if (stagedBet > minBet) {

    //add_chips_to_table(mainBet.chips, stagedBet, 'side', 'side', 'normal');
    mainBet.chips.location.replaceChildren(...stagedBetChips.location.children);
    mainBet.chips.chip = stagedBetChips.chip;
    for (i = 0; i < mainBet.chips.chip.length; i++) {
      mainBet.chips.location.children[i].style.marginBottom = `${i*6}px`;
    }
    mainBet.amount = commit_bet(mainBet.amount);
    // comment out when working
    mainBetAmount.textContent = `$${mainBet.amount}`;
    reset_stagedBet();
    make_active(dealButton);
  } else {
    alert('The min bet is $10');
  }
}

function reset_mainBet() {
  mainBet.amount = 0;
  mainBet.chips.location.replaceChildren();
  mainBet.chips.chip = [];
  // Comment out when working
  mainBetAmount.textContent = '';
}

make_inactive(dealButton);
