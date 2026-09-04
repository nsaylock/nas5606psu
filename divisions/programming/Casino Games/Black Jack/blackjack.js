/* KNOWN ISSUES

5. Dealer delay function entering end round more than once when total > 17
6. Decrement sound playing when reset staged bet
9. Dealer aces do not subtract propertly
10. When hitting on the last hand of a split pair does not check_aces to subtract 10
11. Double down doesn't work correctly on split pairs... ugh split pairs again
12. If second hand in split pair wins but first doesn't, it lets you deal again
-- Doesn't let you pull back bet in between rounds after split hand only ???
- Double down animation doesnt work
- split animation deals the same card to both hands immediately
- animation showing the split would be cool
- Make animation to remove cards
- Make animation to show winning chips/remove chips



*/

const suits = ['H', 'D', 'C', 'S'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
let initialDeck = [];
let deck = [];
const minBet = 10;
//let discard = [];
  //discard = [];
for (i = 0; i < 6; i++) {
  for (const [index, suit] of suits.entries()) {
    for (const [index, rank] of ranks.entries()) {
      initialDeck.push(rank + suit);
    }
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
let gameInProgress = false;
let doubleDown = false;
let outcome = 'none';
let handsToBeScored = [0];

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

const playerHandContainer = document.getElementById('player-hand-container');
const splitChipsContainer = document.getElementById('split-chips-container');
let splitIndex = 0;
const currentHandIndicatorDiv = document.getElementById('current-hand-indicator-container');
const currentHandIndicator = document.createElement('img');
currentHandIndicator.src = '../img/decrease.png';
const settingsMenuDiv = document.getElementById('settings-menu');
const settingsButton = document.getElementById('settings-button');
settingsButton.addEventListener('click', settings_menu);
const settingsExitButton = document.getElementById('settings-exit-button');
settingsExitButton.addEventListener('click', settings_menu);
const dealTimeSlider = document.getElementById('dealTime-slider');
const dealTimeSliderValue = document.getElementById('dealTime-slider-value');
dealTimeSlider.addEventListener('input', (e)=> {
  dealTime = Number(e.target.value);
  dealDelay = dealTime + 50 + flipTime * 30;
  dealTimeSliderValue.textContent = e.target.value;
});

function settings_menu() {
  if (settingsMenuDiv.classList.contains('hidden')) {
    // Open Menu => remove hidden
    settingsMenuDiv.classList.remove('hidden');
  } else settingsMenuDiv.classList.add('hidden');
}

const debugBox = document.getElementById('debug-box');
function db(message) {
  debugBox.textContent = `${message}`;
}

const messageBoxDiv = document.getElementById('message-box');

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
let dealTime = 400;
const flipTime = 5;
// Total flip time = flipTime * 30
let dealDelay = dealTime + flipTime*30 + 50;

bet[0].button.addEventListener('click', ()=>{
  if (pullBackInProgress == true) {
    bet[0].amount = pull_back_bet(bet[0].amount);
    bet[0].chips.location.replaceChildren();
  } else if (bet[0].amount != 0 && stagedBet != 0) {
    add_to_bet(stagedBet, handIndex);
  } else {
    main_bet(handIndex);
  }
});

function add_to_bet(amountIncrease, handIndex) {
  // Return the current main bet to staged bet, set to prev sb chip structure,
  // double then update staged bet and commit back to main bet
  // . . . spread syntax unpacks array into individual arguments
  stagedBetChips.location.replaceChildren(...bet[handIndex].chips.location.children);
  stagedBetChips.chip = bet[handIndex].chips.chip;
  bankroll += bet[handIndex].amount;
  prevSBCS = get_chip_structure(bet[0].amount);
  stagedBet = bet[handIndex].amount + amountIncrease;
  update_staged_bet_chips(stagedBet);
  main_bet(handIndex);
}

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
  currentHandIndicatorDiv.replaceChildren();
  if (splitIndex > 0) reset_split();
  
  player[0].div.replaceChildren();
  player = [{
    div: document.getElementById('player-hand'),
    hand: [],
    total: 0,
    aces: 0
  }];

  if (outcome == 'win' && doubleDown == true) {
    // Might need logic for split bet double down reset
    tempBet = bet[0].amount/2;
    reset_bet();
    add_to_bet(tempBet, 0);
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

async function deal_round() {
  bet[0].button.disabled = true;
  make_inactive(dealButton);

  if (round > 0) new_round();
  deal_card('player', player[handIndex].hand, player[handIndex].div, handIndex);
  await delay(dealDelay);
  deal_face_down_card();
  await delay(dealTime + 30);
  deal_card('player', player[handIndex].hand, player[handIndex].div, handIndex);
  await delay(dealDelay);
  deal_card('dealer', dealerHand, dealerHandDiv, handIndex);
  await delay(dealDelay);
  make_active(hitButton);
  make_active(stayButton);
  if (bankroll < bet[0].amount) {
    make_inactive(doubleDownButton)
  } else {
    make_active(doubleDownButton);
  }

  check_for_split();
  update_player_total();
  check_aces('player');
  update_dealer_total();
  round++;
  if (player[handIndex].total == 21) {
    blackjack();
    dealer_reveal_card('bj');
  }
}

async function deal_face_down_card() {
  if (deck.length < 1) shuffleDeck();
  face = deck[deck.length-1].face;
  value = deck[deck.length-1].value;
  const img = document.createElement('img');
  img.src = `playing_cards/card_back.png`;
  img.className = 'card';
  img.id = 'dealer-card';
  const target = document.createElement('div');
  target.classList.add('card');
  dealerHandDiv.appendChild(target);

  deal_animation(target, 'face-down');
  await delay(dealTime);

  dealerHandDiv.removeChild(target);
  dealerHandDiv.appendChild(img);

  dealerHand.push(face);
  faceDownCardValue = value;
  if (face.at(0) == 'A') dealerAces++;
  deck.pop();
}

async function deal_card(id, hand, element, handIndex) {
  reset_stagedBet();
  if (deck.length < 1) shuffleDeck();
  face = deck[deck.length-1].face;
  value = deck[deck.length-1].value;
  // Split Testing
  //face = 'AH';
  //value = 11;
  const img = document.createElement('img');
  img.className = 'card';
  img.src = `playing_cards/${face}.png`;

  // For the animation, create a target to append so the animation function
  // can grab its location, afterwards remove the target and add the img
  const target = document.createElement('div');
  target.classList.add('card');
  element.appendChild(target);
  hand.push(face);

  adjust_hand_layout(id, element, hand);

  deal_animation(target, 'normal');
  await delay(dealDelay);
  element.removeChild(target);
  element.appendChild(img);

  adjust_hand_layout(id, element, hand);

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

function adjust_hand_layout(id, element, hand) {
  for (i = 0; i < hand.length; i++) {
    if (id == 'player') {
      element.children[i].style.margin = `0 0 ${i*25}px ${i*120}px`;
    } else if (id == 'dealer') {
      element.children[i].style.marginLeft = `${i*120}px`;
    }
  }
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

function blackjack() {
  let winAmount = Math.floor(bet[0].amount * 3 / 2);
  message('BLACKJACK');
  win(winAmount);
  make_inactive_all();
  make_active(dealButton);
}


async function hit() {
  deal_card('player', player[handIndex].hand, player[handIndex].div, handIndex);
  await delay(dealDelay + 50);
  update_player_total();
  check_aces('player');
  
  make_inactive(doubleDownButton);
  if (player[handIndex].total == 21) {
    // Player has 21 no further action needed -- auto stay
    stay();
  } else if (player[handIndex].total > 21) {
    // Bust
    message('Bust');
    outcome = 'lose';
    await delay(400);
    lose(handIndex);
    if (handsToBeScored.length == 1) {
      dealer_reveal_card('bust');
      outcome = 'lose';
    } else if (handIndex + 1 < numOfPlayerHands) {
      handsToBeScored.splice(handIndex, 1);
      move_to_next_hand();
    } else {
      handsToBeScored.splice(handIndex, 1);
      dealer_reveal_card('bust');
    }
  }
}

function stay() {
  if (handIndex + 1 < numOfPlayerHands) {
    hide(splitButton);
    move_to_next_hand();
  } else {
    hide(splitButton);
    dealer_reveal_card('dealer-turn');
  }
}

function double_down() {
  doubleDown = true;
  add_to_bet(bet[handIndex].amount, handIndex);
  hit();
  if (player[handIndex].total < 21) stay();
}

async function split() {
  splitIndex++;
  handsToBeScored.push(splitIndex);

  if (numOfPlayerHands == 1) {
    const blank = document.createElement('div');
    blank.classList.add('split-bet-chips');
    splitChipsContainer.appendChild(blank);
    currentHandIndicatorDiv.appendChild(document.createElement('div'));
    currentHandIndicatorDiv.children[0].classList.add('split-bet-chips');
    currentHandIndicatorDiv.children[0].appendChild(currentHandIndicator);

  }
  currentHandIndicatorDiv.appendChild(document.createElement('div'));
  currentHandIndicatorDiv.children[splitIndex].classList.add('split-bet-chips');
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
  await delay(dealDelay);
  deal_card('player', player[splitIndex].hand, player[splitIndex].div, splitIndex);
  await delay(dealDelay);
  update_player_total();
  check_aces('player');
  check_for_split();
}

function check_for_split() {
  if (bankroll < bet[0].amount) return;
  if (player[handIndex].hand[0].at(0) == player[handIndex].hand[1].at(0) 
    && numOfPlayerHands < 4) {
    unhide(splitButton);
  }
}

async function dealer_reveal_card(action) {
  make_inactive_all();

  const dealerFaceDownCard = document.getElementById('dealer-card');
  card_flip_animation(dealerFaceDownCard, 1);
  await delay(flipTime * 30 + 50);
  dealerFaceDownCard.src = `playing_cards/${dealerHand[0]}.png`;
  dealerFaceDownCard.classList.remove('card-flip');
  dealerFaceDownCard.classList.add('card');
  dealerTotal += faceDownCardValue;
  update_dealer_total();
  check_aces('dealer');
  if (dealerTotal < 17 && action == 'dealer-turn') dealer_delay_func();
  else if (action == 'bust' || action == 'bj') check_for_end_round();
  else score_hand();
}

async function dealer_delay_func() {
    deal_card('dealer', dealerHand, dealerHandDiv, handIndex);
    await delay(dealDelay);
    update_dealer_total();
    if (dealerTotal < 17) {
      dealer_delay_func();
    } else if (dealerTotal > 21 && dealerAces > 0) {
      check_aces('dealer');
      dealer_delay_func();
    } else {
      score_hand();
    }
}

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
  currentHandIndicatorDiv.children[handIndex].replaceChildren();
  handIndex++;
  currentHandIndicatorDiv.children[handIndex].appendChild(currentHandIndicator);
  make_active(doubleDownButton);
  check_for_split();
}

function end_round() {
  
  handIndex = 0;
  bet[0].button.disabled = false;
  if (outcome == 'lose') {
    make_inactive(dealButton);
    reset_bet();
  } else make_active(dealButton);
}



function main_bet(handIndex) {
  if (stagedBet >= minBet) {

    //add_chips_to_table(bet[0].chips, stagedBet, 'side', 'side', 'normal');
    bet[handIndex].chips.location.replaceChildren(...stagedBetChips.location.children);
    bet[handIndex].chips.chip = stagedBetChips.chip;
    // asd654f
    for (i = 0; i < bet[handIndex].chips.chip.length; i++) {
      bet[handIndex].chips.location.children[i].style.marginBottom = `${i*6}px`;
    }
    update_moneyOnTable('remove', bet[handIndex].amount);
    bet[handIndex].amount = commit_bet(bet[handIndex].amount);
    // comment out when working
    mainBetAmount.textContent = `$${bet[handIndex].amount}`;
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

function make_inactive_all() {
  make_inactive(hitButton);
  make_inactive(stayButton);
  make_inactive(doubleDownButton);
  hide(splitButton);
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

// Animations
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% //

const cardSpawnerDiv = document.getElementById('card-spawner');
const cardWidth = 150;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function deal_animation(destination, flipType) {
  let start = null;
  // Card Spawner Rect
  let CSRect = cardSpawnerDiv.getBoundingClientRect();
  let targetRect = destination.getBoundingClientRect();
  let distanceX = targetRect.left - CSRect.left;
  let distanceY = targetRect.top - CSRect.top;

  let blank = document.createElement('img');
  blank.classList.add('card');
  blank.src = 'playing_cards/card_back.png';
  cardSpawnerDiv.appendChild(blank);

  function step(timestamp) {
    if (start == undefined) start = timestamp;
    const elapsed = timestamp - start;
    if (elapsed <= dealTime) {
      x = elapsed*distanceX/dealTime;
      y = elapsed*distanceY/dealTime;
      blank.style.transform = `translate(${x}px, ${y}px)`;
      requestAnimationFrame(step);
    } else requestAnimationFrame(step);
  }
  requestAnimationFrame(step);

  await delay(dealTime + 10);
  let index = 1;
  if (flipType == 'face-down') {
    // Stop here
    cardSpawnerDiv.replaceChildren();
  } else {
    card_flip_animation(blank, index, x, y);
  }
}

function card_flip_animation(blank, index, x, y) {
  blank.classList.remove('card');
  blank.src = 'Card_Flip_Animation/1.png';
  blank.classList.add('card-flip');
  blank.style.transform = `translate(${x - 55}px, ${y-10}px)`;
  update_animation_pic(blank, index);
}

async function update_animation_pic(blank, index) {
  await delay(flipTime);
  if (index < 30) {
    blank.src = `Card_Flip_Animation/${index}.png`;
    index++;
    update_animation_pic(blank, index);
  } else {
    // Animation complete, remove the img
    cardSpawnerDiv.replaceChildren();
  }
}