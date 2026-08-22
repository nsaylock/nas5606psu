function update_staged_bet_chips() {
  if (stagedBet != prevStagedBet) {
    let thisLength = 0;
    let index = 0;
    let chipCount = 0;
    let rotation;
    let keep = 0;
    // Clear All imgs from stagedBetChips Div
    stagedBetChips.location.replaceChildren();

    let chipStructure = get_chip_structure(stagedBet);
    // Counts all chips that are needed provided by get_chip_structure
    // Need to loop because 25 -> 20 goes 1 green to 4 red
    for (const color in chipStructure) {
      if (chipStructure[color] != 0) {
        thisLength += chipStructure[color];
      }
    }

    difference = thisLength - stagedBetChips.prevLength;
    if (difference >= 0) keep = stagedBetChips.prevLength;
    if (difference < 0) keep = stagedBetChips.prevLength - Math.abs(difference);

    for (const color in chipStructure) {
      if (chipStructure[color] > 0) {
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

          thisChip.src = `../img/chips/side/${chipDisplay}/${color}_chip_${rotation}.png`;
          db(rotation);
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