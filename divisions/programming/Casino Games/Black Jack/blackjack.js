const suits = ['H', 'D', 'C', 'S'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
let initialDeck = [];
let deck = [];
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


function new_round() {
  dealerHand = [];
  dealerTotal = 0;
  dealerAces = 0;
  dealerHandDiv.replaceChildren();
  playerHand = [];
  playerTotal = 0;
  playerAces = 0;
  playerHandDiv.replaceChildren();
  unhide(hitButton);
  unhide(stayButton);
  unhide(doubleDownButton);
  hide(splitButton);
  
}

function deal_round() {
  if (round > 0) new_round();
  deal_card('player', playerHand, playerHandDiv);
  deal_face_down_card();
  deal_card('player', playerHand, playerHandDiv);
  deal_card('dealer', dealerHand, dealerHandDiv);
  hide(dealButton);
  if (playerHand[0].at(0) == playerHand[1].at(0)) {
    unhide(splitButton);
  }
  update_player_total();
  update_dealer_total();
  round++;
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
    hide(hitButton);
    hide(stayButton);
    hide(doubleDownButton);
    unhide(dealButton);
    setTimeout(()=> {
      alert('Player Bust');
      dealer_reveal_card();
    }, 400);
  }
}

function stay() {
  hide(hitButton);
  hide(stayButton);
  hide(doubleDownButton);
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
  if (dealerTotal >= 17) unhide(dealButton);
}

function dealer_turn() {
  dealer_reveal_card();
  if (dealerTotal < 17) dealer_delay_func();
}

function dealer_delay_func() {
  setTimeout(()=> {
      deal_card('dealer', dealerHand, dealerHandDiv);
      update_dealer_total();
      if (dealerTotal < 17) dealer_delay_func();
      if (dealerTotal > 21 && dealerAces > 0) {
        dealerTotal -= 10;
        dealerAces--;
        update_dealer_total;
        dealer_delay_func();
      } else {
        unhide(dealButton);
      }
    }, 500);
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

