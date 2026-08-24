/* KNOWN ISSUES

1. Changing bet by clicking bet circle with different amount
  causes money to be subtracted from bankroll and ghost added
  to money on table
2. Pull back bet button does not work
3. Bet remains doubled after doubled down win
4. Split still not implemented
5. Dealer delay function entering end round more than once when total > 17
6. Decrement sound playing when reset staged bet
7. Still only using 1 deck of cards

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
let dealerHand = [];
let dealerTotal = 0;
let dealerAces = {num:0};
let faceDownCardValue = 0;
let player = [{
  div: document.getElementById('player-hand'),
  hand: [],
  total: 0,
  aces: 0
}];
let numOfPlayerHands = 1;
let round = 0;
let handIndex = 0;

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
splitButton.addEventListener('click', split);

const debugBox = document.getElementById('debug-box');
function db(message) {
  debugBox.textContent = `${message}`;
}

const messageBoxDiv = document.getElementById('message-box');

let splitBet = [];

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
  for (i = 0; i < handIndex + 1; i++) {
    player[handIndex].hand = [];
    player[handIndex].total = 0;
    player[handIndex].aces = 0;
  }
  
  playerHandDiv.replaceChildren();
  hide(splitButton);
  messageBoxDiv.replaceChildren();
  make_active(hitButton);
  make_active(stayButton);
  make_active(doubleDownButton);
}

document.addEventListener('keydown', function(event) {
  event.preventDefault();
  if (event.key == 'h' && !hitButton.classList.contains('inactive')) {
    hit();
  } else if (event.key == 's' && !stayButton.classList.contains('inactive')) {
    stay();
  } else if (event.key == 'Enter' && !dealButton.classList.contains('inactive')) {
    deal_round();
  } else if (event.key == 'p' && !splitButton.classList.contains('hidden')) {
    split();
  }
})

function deal_round() {
  if (round > 0) new_round();
  deal_card('player', player[handIndex].hand, player[handIndex].div);
  deal_face_down_card();
  deal_card('player', player[handIndex].hand, player[handIndex].div);
  deal_card('dealer', dealerHand, dealerHandDiv);
  make_inactive(dealButton);
  make_active(hitButton);
  make_active(stayButton);
  make_active(doubleDownButton);
  if (player[handIndex].hand[0].at(0) == player[handIndex].hand[1].at(0)) {
    unhide(splitButton);
  }
  update_player_total();
  check_aces('player');
  update_dealer_total();
  round++;
  if (player[handIndex].total == 21) {
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
  //face = deck[deck.length-1].face;
  //value = deck[deck.length-1].value;
  face = '8H';
  value = 8;
  const img = document.createElement('img');
  img.src = `playing_cards/${face}.png`;
  img.className = 'card';
  element.appendChild(img);
  hand.push(face);
  for (i = 0; i < hand.length; i++) {
    if (id == 'player') {
      element.children[i].style.margin = `0 0 ${i*25}px ${i*120}px`
    } else if (id == 'dealer') {
      element.children[i].style.marginLeft = `${i*120}px`
    }
  }

  if (face.at(0) == 'A') {
    if (id == 'player') player[handIndex].aces++;
    else dealerAces++;
  }

  if (id == 'player') player[handIndex].total += value;
  else dealerTotal += value;
  deck.pop();
}

function check_aces(id) {
  if (id == 'player') {
    if (player[handIndex].total > 21 && player[handIndex].aces > 0) {
      player[handIndex].total -= 10;
      player[handIndex].aces--;
      update_player_total();
    }
  } else if (id == 'dealer') {
    if (dealerTotal > 21 && dealerAces > 0) {
      dealerTotal -= 10;
      dealerAces--;
      update_dealer_total();
    }
  }
}

function hit() {
  deal_card('player', player[handIndex].hand, player[handIndex].div);
  update_player_total();
  check_aces('player');
  if (player[handIndex].hand[0].at(0) == player[handIndex].hand[1].at(0)) {
    unhide(splitButton);
  }
  make_inactive(doubleDownButton);
  if (player[handIndex].total == 21) {
    stay();
  } else if (player[handIndex].total > 21) {
    end_round();
  }
}

function stay() {
  if (handIndex + 1 < numOfPlayerHands) {
    handIndex++;
    // Then move the UI indicator here
  } else {
    dealer_turn();
  }
}

function double_down() {
  // Return the current main bet to staged bet, set to prev sb chip structure,
  // double then update staged bet and commit back to main bet
  // . . . spread syntax unpacks array into individual arguments
  stagedBetChips.location.replaceChildren(...mainBet.chips.location.children);
  stagedBetChips.chip = mainBet.chips.chip;
  bankroll += mainBet.amount;
  prevSBCS = get_chip_structure(mainBet.amount);
  stagedBet = mainBet.amount * 2;
  update_staged_bet_chips(stagedBet);
  main_bet();
  hit();
  stay();
}

const playerHandContainer = document.getElementById('player-hand-container');
let splitIndex = 0;

function split() {
  numOfPlayerHands = 2;

  splitBet.push({
    amount: 0,
    chips: {
      location: document.createElement('div'),
      chip: [],
      leftSpacing: 0,
      bottom: 0
    }
  });
  splitBet[splitIndex].amount = mainBet.amount;

  splitIndex++;
  hide(splitButton);

  player.push({
    div: document.createElement('div'),
    hand: [],
    total: 0,
    aces: 0
  });

  // Here we go ...
  player[splitIndex].div.id = 'player-split-hand';
  playerHandContainer.appendChild(player[splitIndex].div);
  
  
  let card = player[handIndex].hand.splice(1, 1);
  player[splitIndex].hand.push(card);
  player[splitIndex].div.replaceChildren(player[handIndex].div.children[1]);
  player[splitIndex].div.children[0].style.margin = '0 0 0 0';
  player[handIndex].total = player[handIndex].total/2;
  playerTotalElement.textContent = player[handIndex].total;
  player[splitIndex].total = player[handIndex].total;


  playerHandContainer.appendChild(splitBet[splitIndex-1].chips.location);
  splitBet[splitIndex-1].chips.location.classList.add('split-bet-chips');
  // Get position of left side of player split hand div
  for (i = 1; i < player.length; i++) {
    rect = player[i].div.getBoundingClientRect();
    splitBet[i-1].chips.location.style.left = `${rect.left - 50}px`;
  }
  
  add_chips_to_table(splitBet[splitIndex-1].chips, splitBet[splitIndex-1].amount, 'side', 'side', 'normal');
  bankroll -= splitBet[splitIndex-1].amount;
  update_bankroll();
  play_increment_sound();
}

function dealer_reveal_card() {
  const dealerFaceDownCard = document.getElementById('dealer-card');
  dealerFaceDownCard.src = `playing_cards/${dealerHand[0]}.png`;
  dealerTotal += faceDownCardValue;
  update_dealer_total();
  check_aces('dealer');
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
        check_aces('dealer');
        dealer_delay_func();
      } else {
        end_round();
      }
    }, 500);
}

function end_round() {
  make_inactive(hitButton);
  make_inactive(stayButton);
  make_inactive(doubleDownButton);
  if (player[handIndex].total > 21) bust();
  else if (player[handIndex].total == 21 && player[handIndex].hand.length == 2) blackjack();
  else if (player[handIndex].total > dealerTotal || dealerTotal > 21) {
    // Player Win
    let winAmount = mainBet.amount;
    win(winAmount);
    make_active(dealButton);
  } else if (player[handIndex].total == dealerTotal) {
    // Push
    message('Push');
    make_active(dealButton);
  } else {
    // player.total < dealerTotal <= 21
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
  if (button.classList.contains('inactive') == false) {
    button.classList.add('inactive');
    button.disabled = true;
  }
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
  playerTotalElement.textContent = player[handIndex].total;
}

function update_dealer_total() {
  dealerTotalElement.textContent = dealerTotal;
}




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
make_inactive(hitButton);
make_inactive(stayButton);
make_inactive(doubleDownButton);
