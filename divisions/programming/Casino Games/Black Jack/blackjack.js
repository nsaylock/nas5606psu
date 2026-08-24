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
8. Cannot double down on a split hand
9. Dealer aces do not subtract propertly
10. When hitting on the last hand of a split pair does not check_aces to subtract 10
11. Double down doesn't work correctly on split pairs... ugh split pairs again


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

let bet = [{
  button: document.getElementById('main-bet-button'),
  amount: 0,
  chips: {
    location: 'none-yet',
    chip: [],
    leftSpacing: 15,
    bottom: 0
  }
}]

bet[0].chips.location = document.getElementById('main-bet-chips');

const mainBetAmount = document.getElementById('main-bet-amount');

bet[0].button.addEventListener('click', ()=>{
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
  
  if (splitIndex > 0) reset_split();
  
  player[0].div.replaceChildren();
  player = [{
    div: document.getElementById('player-hand'),
    hand: [],
    total: 0,
    aces: 0
  }];

  if (outcome == 'win' && doubleDown == true) {
    bet[0].chips.location.removeChild(bet[0].chips.location.lastElementChild);
    bet[0].amount = bet[0].amount/2;
    mainBetAmount.textContent = `$${bet[0].amount}`;
    update_moneyOnTable('remove', bet[0].amount);
    bankroll += bet[0].amount;
    update_bankroll_chips(bankroll);
  }
  doubleDown = false;
  
  hide(splitButton);
  messageBoxDiv.replaceChildren();
  make_active(hitButton);
  make_active(stayButton);
  make_active(doubleDownButton);
}

function reset_split() {
  handIndex = 0;
  splitIndex = 0;
  numOfPlayerHands = 1;
  handsToBeScored = [0];
  for (i = 1; i < player.length; i++) {
    player[i].div.remove();
    update_moneyOnTable('remove', bet[i].amount);
  }
  splitChipsContainer.replaceChildren();
}

document.addEventListener('keydown', function(event) {
  if (event.key != 'F12') event.preventDefault();
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
  deal_card('player', player[handIndex].hand, player[handIndex].div, handIndex);
  deal_face_down_card();
  deal_card('player', player[handIndex].hand, player[handIndex].div, handIndex);
  deal_card('dealer', dealerHand, dealerHandDiv, handIndex);
  make_inactive(dealButton);
  make_active(hitButton);
  make_active(stayButton);
  make_active(doubleDownButton);
  check_for_split();
  update_player_total();
  check_aces('player');
  update_dealer_total();
  round++;
  if (player[handIndex].total == 21) {
    blackjack();
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


function deal_card(id, hand, element, handIndex) {
  reset_stagedBet();
  if (deck.length < 1) shuffleDeck();
  face = deck[deck.length-1].face;
  value = deck[deck.length-1].value;
  // Split Testing
  //face = 'AH';
  //value = 11;
  const img = document.createElement('img');
  img.src = `playing_cards/${face}.png`;
  img.className = 'card';
  element.appendChild(img);
  hand.push(face);
  for (i = 0; i < hand.length; i++) {
    if (id == 'player') {
      element.children[i].style.margin = `0 0 ${i*25}px ${i*120}px`;
    } else if (id == 'dealer') {
      element.children[i].style.marginLeft = `${i*120}px`;
    }
  }

  if (id == 'player' && doubleDown == true) {
    element.children[2].style.transform = 'rotate(90deg)';
    element.children[2].style.margin = '0 0 230px 275px';
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
  deal_card('player', player[handIndex].hand, player[handIndex].div, handIndex);
  update_player_total();
  check_aces('player');
  
  make_inactive(doubleDownButton);
  if (player[handIndex].total == 21) {
    stay();
  } else if (player[handIndex].total > 21) {
    bust();
  }
}



function stay() {
  if (handIndex + 1 < numOfPlayerHands) {
    hide(splitButton);
    move_to_next_hand();
  } else {
    hide(splitButton);
    dealer_turn();
  }
}

let doubleDown = false;

function double_down() {
  doubleDown = true;
  // Return the current main bet to staged bet, set to prev sb chip structure,
  // double then update staged bet and commit back to main bet
  // . . . spread syntax unpacks array into individual arguments
  stagedBetChips.location.replaceChildren(...bet[0].chips.location.children);
  stagedBetChips.chip = bet[0].chips.chip;
  bankroll += bet[0].amount;
  prevSBCS = get_chip_structure(bet[0].amount);
  stagedBet = bet[0].amount * 2;
  update_staged_bet_chips(stagedBet);
  main_bet();
  hit();
  if (player[handIndex].total < 21) stay();
  
}

const playerHandContainer = document.getElementById('player-hand-container');
const splitChipsContainer = document.getElementById('split-chips-container');
let splitIndex = 0;

function split() {
  splitIndex++;
  handsToBeScored.push(splitIndex);

  if (numOfPlayerHands == 1) {
    const blank = document.createElement('div');
    blank.classList.add('split-bet-chips');
    splitChipsContainer.appendChild(blank);
    player[0].div.classList.add('current-hand-indicator');
  }
  numOfPlayerHands++;

  bet.push({
    button: 'none',
    amount: 0,
    chips: {
      location: document.createElement('div'),
      chip: [],
      leftSpacing: 0,
      bottom: 0
    }
  });

  
  bet[splitIndex].amount = bet[splitIndex-1].amount;
  update_moneyOnTable('add', bet[splitIndex].amount);

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
  
  
  let card = player[handIndex].hand[1];
  player[handIndex].hand.pop();
  player[splitIndex].hand.push(card);
  player[splitIndex].div.replaceChildren(player[handIndex].div.children[1]);
  player[splitIndex].div.children[0].style.margin = '0 0 0 0';
  if (player[handIndex].hand[0].at(0) != 'A') {
    player[handIndex].total = player[handIndex].total/2;
  } else player[handIndex].total = 11;
  player[splitIndex].total = player[handIndex].total;


  splitChipsContainer.appendChild(bet[splitIndex].chips.location);
  bet[splitIndex].chips.location.classList.add('split-bet-chips');
  // Get position of left side of player split hand div
  
  
  add_chips_to_table(bet[splitIndex].chips, bet[splitIndex].amount, 'side', 'side', 'normal');
  bankroll -= bet[splitIndex].amount;
  update_bankroll();
  play_increment_sound();


  deal_card('player', player[handIndex].hand, player[handIndex].div, handIndex);

  deal_card('player', player[splitIndex].hand, player[splitIndex].div, splitIndex);

  update_player_total();
  check_aces('player');
  check_for_split();
}

function check_for_split() {
  if (player[handIndex].hand[0].at(0) == player[handIndex].hand[1].at(0) 
    && numOfPlayerHands < 4) {
    unhide(splitButton);
  }
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
  else score_hand();
}

function dealer_delay_func() {
  setTimeout(()=> {
      deal_card('dealer', dealerHand, dealerHandDiv, handIndex);
      update_dealer_total();
      if (dealerTotal < 17) {
        dealer_delay_func();
      } else if (dealerTotal > 21 && dealerAces > 0) {
        check_aces('dealer');
        dealer_delay_func();
      } else {
        score_hand();
      }
    }, 500);
}

let outcome = 'none';
let handsToBeScored = [0];

function score_hand() {
  for (x = 0; x < handsToBeScored.length; x++) {
    if (player[handsToBeScored[x]].total > dealerTotal || dealerTotal > 21) {
      let winAmount = bet[handsToBeScored[x]].amount;
      win(winAmount);
      outcome = 'win';
    } else if (player[handsToBeScored[x]].total == dealerTotal) {
      message('Push');
      outcome = 'push';
    } else {
      outcome = 'lose';
      lose(handsToBeScored[x]);
    }
    // Uses i in this function so cannot use i in above for loop
    update_bankroll_chips(bankroll);
  }
  check_for_end_round();
}

function win(amount) {
  bankroll += amount;
  message(`Player won $${amount}`);
  update_bankroll();
}

function lose(handIndex) {
  message(`Player lost $${bet[handIndex].amount}`);
  update_moneyOnTable('remove', bet[handIndex].amount);
  bet[handIndex].chips.location.replaceChildren();
}

function check_for_end_round() {
  if (handIndex + 1 == numOfPlayerHands) {
    end_round();
  } else {
    move_to_next_hand();
    playerTotalElement.textContent = `${player[handIndex].total}`;
  }
}

function move_to_next_hand() {
  player[handIndex].div.classList.remove('current-hand-indicator');
  handIndex++;
  player[handIndex].div.classList.add('current-hand-indicator');
  check_for_split();
}

function end_round() {
  make_inactive(hitButton);
  make_inactive(stayButton);
  make_inactive(doubleDownButton);
  if (outcome == 'lose') {
    make_inactive(dealButton);
    reset_bet();
  } else make_active(dealButton);

  
}

function blackjack() {
  let winAmount = Math.floor(bet[0].amount * 3 / 2);
  message('BLACKJACK');
  win(winAmount);
  make_inactive(hitButton);
  make_inactive(stayButton);
  make_inactive(doubleDownButton);
  make_active(dealButton);
}

function bust() {
  message('Bust');
  setTimeout(()=> {
    lose(handIndex);
    if (handsToBeScored.length == 1) {
      dealer_reveal_card();
      outcome = 'lose';
      end_round();
    } else if (handIndex + 1 < numOfPlayerHands) {
      handsToBeScored.splice(handIndex, 1);
      move_to_next_hand();
    } else {
      handsToBeScored.splice(handIndex, 1);
      dealer_turn();
    }
    
  }, 400);
}



function main_bet() {
  if (stagedBet > minBet) {

    //add_chips_to_table(bet[0].chips, stagedBet, 'side', 'side', 'normal');
    bet[0].chips.location.replaceChildren(...stagedBetChips.location.children);
    bet[0].chips.chip = stagedBetChips.chip;
    for (i = 0; i < bet[0].chips.chip.length; i++) {
      bet[0].chips.location.children[i].style.marginBottom = `${i*6}px`;
    }
    update_moneyOnTable('remove', bet[0].amount);
    bet[0].amount = commit_bet(bet[0].amount);
    // comment out when working
    mainBetAmount.textContent = `$${bet[0].amount}`;
    reset_stagedBet();
    make_active(dealButton);
  } else {
    alert('The min bet is $10');
  }
}

function reset_bet() {
  for (i = 0; i < bet.length; i++) {
    bet[i].amount = 0;
    bet[i].chips.location.replaceChildren();
    bet[i].chips.chip = [];
  }
  
  // Comment out when working
  mainBetAmount.textContent = '';
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

make_inactive(dealButton);
make_inactive(hitButton);
make_inactive(stayButton);
make_inactive(doubleDownButton);