// Game State
let player1MatchScore = 0;
let player2MatchScore = 0;
let currentRound = 1;
let isRolling = false;
let gameActive = true;
let currentRoundResult = null;

// DOM Elements
const dice1 = document.getElementById('dice1');
const dice2 = document.getElementById('dice2');
const player1ScoreEl = document.getElementById('player1Score');
const player2ScoreEl = document.getElementById('player2Score');
const roundNumberEl = document.getElementById('roundNumber');
const matchStatusEl = document.getElementById('matchStatus');
const roundResultEl = document.getElementById('roundResult');
const rollBtn = document.getElementById('rollBtn');
const resetBtn = document.getElementById('resetBtn');
const player1Card = document.getElementById('player1Card');
const player2Card = document.getElementById('player2Card');
const scoreProgress1 = document.getElementById('scoreProgress1');
const scoreProgress2 = document.getElementById('scoreProgress2');
const victoryModal = document.getElementById('victoryModal');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const modalCloseBtn = document.getElementById('modalCloseBtn');

// Helper: Random dice roll (1-6)
function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

// Helper: Update dice images
function updateDiceImage(diceElement, value) {
  diceElement.src = `images/dice${value}.png`;
}

// Helper: Add shake animation
function shakeDice() {
  dice1.classList.add('shake');
  dice2.classList.add('shake');
  setTimeout(() => {
    dice1.classList.remove('shake');
    dice2.classList.remove('shake');
  }, 400);
}

// Helper: Update score display and progress bar
function updateUI() {
  player1ScoreEl.textContent = player1MatchScore;
  player2ScoreEl.textContent = player2MatchScore;
  roundNumberEl.textContent = currentRound;
  
  const totalPoints = 5;
  const progress1 = (player1MatchScore / totalPoints) * 100;
  const progress2 = (player2MatchScore / totalPoints) * 100;
  
  scoreProgress1.style.width = `${progress1}%`;
  scoreProgress2.style.width = `${progress2}%`;
}

// Helper: Remove round highlight from cards
function removeRoundHighlights() {
  player1Card.classList.remove('winner-round');
  player2Card.classList.remove('winner-round');
}

// Helper: Show round winner animation
function showRoundWinner(winner) {
  removeRoundHighlights();
  if (winner === 1) {
    player1Card.classList.add('winner-round');
    roundResultEl.innerHTML = `🏆 PLAYER 1 WINS ROUND ${currentRound}! 🏆`;
    roundResultEl.style.color = '#ffd700';
  } else if (winner === 2) {
    player2Card.classList.add('winner-round');
    roundResultEl.innerHTML = `🏆 PLAYER 2 WINS ROUND ${currentRound}! 🏆`;
    roundResultEl.style.color = '#ffd700';
  } else {
    roundResultEl.innerHTML = `⚖️ ROUND ${currentRound} IS A DRAW! ⚖️`;
    roundResultEl.style.color = '#4ecdc4';
  }
  
  setTimeout(() => {
    if (!gameActive) return;
    removeRoundHighlights();
  }, 1500);
}

// Helper: Check for match winner
function checkMatchWinner() {
  if (player1MatchScore >= 5) {
    gameActive = false;
    matchStatusEl.innerHTML = '🏆 GAME OVER - PLAYER 1 IS THE CHAMPION! 🏆';
    modalTitle.textContent = 'PLAYER 1 WINS THE MATCH!';
    modalMessage.textContent = `Final Score: ${player1MatchScore} - ${player2MatchScore}`;
    victoryModal.classList.add('active');
    return true;
  } else if (player2MatchScore >= 5) {
    gameActive = false;
    matchStatusEl.innerHTML = '🏆 GAME OVER - PLAYER 2 IS THE CHAMPION! 🏆';
    modalTitle.textContent = 'PLAYER 2 WINS THE MATCH!';
    modalMessage.textContent = `Final Score: ${player2MatchScore} - ${player1MatchScore}`;
    victoryModal.classList.add('active');
    return true;
  }
  return false;
}

// Main function: Play a round
function playRound() {
  if (!gameActive) {
    matchStatusEl.innerHTML = '⚠️ Game is over! Press RESET to play again! ⚠️';
    return;
  }
  
  if (isRolling) return;
  
  isRolling = true;
  rollBtn.disabled = true;
  
  // Shake animation
  shakeDice();
  
  setTimeout(() => {
    // Roll both dice
    const value1 = rollDice();
    const value2 = rollDice();
    
    // Update dice images
    updateDiceImage(dice1, value1);
    updateDiceImage(dice2, value2);
    
    // Determine round winner
    let roundWinner = null;
    if (value1 > value2) {
      player1MatchScore++;
      roundWinner = 1;
      matchStatusEl.innerHTML = `🎲 Round ${currentRound}: Player 1 wins! (${value1} vs ${value2}) 🎲`;
    } else if (value2 > value1) {
      player2MatchScore++;
      roundWinner = 2;
      matchStatusEl.innerHTML = `🎲 Round ${currentRound}: Player 2 wins! (${value1} vs ${value2}) 🎲`;
    } else {
      matchStatusEl.innerHTML = `🎲 Round ${currentRound}: Draw! (${value1} vs ${value2}) 🎲`;
      roundWinner = 0;
    }
    
    // Update UI
    updateUI();
    showRoundWinner(roundWinner);
    
    // Check if match is over
    const matchEnded = checkMatchWinner();
    
    if (!matchEnded) {
      // Move to next round
      currentRound++;
      roundNumberEl.textContent = currentRound;
      matchStatusEl.innerHTML = `✅ Round ${currentRound} - Ready! Press ROLL to continue ✅`;
    } else {
      matchStatusEl.innerHTML = '🏆 MATCH COMPLETE! Press RESET to play again 🏆';
    }
    
    isRolling = false;
    rollBtn.disabled = false;
  }, 400);
}

// Reset the entire game
function resetGame() {
  player1MatchScore = 0;
  player2MatchScore = 0;
  currentRound = 1;
  gameActive = true;
  isRolling = false;
  currentRoundResult = null;
  
  // Reset dice images
  updateDiceImage(dice1, 6);
  updateDiceImage(dice2, 6);
  
  // Update UI
  updateUI();
  removeRoundHighlights();
  
  // Reset messages
  matchStatusEl.innerHTML = 'READY! First to 5 points wins the game! Press ROLL';
  roundResultEl.innerHTML = '⚔️ Battle Ready ⚔️';
  roundResultEl.style.color = '#ffd700';
  
  // Enable roll button
  rollBtn.disabled = false;
  
  // Close modal if open
  victoryModal.classList.remove('active');
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
  // R key to roll
  if (e.key === 'r' || e.key === 'R') {
    e.preventDefault();
    if (gameActive && !isRolling) {
      playRound();
    }
  }
  // ESC key to reset
  else if (e.key === 'Escape') {
    e.preventDefault();
    resetGame();
  }
});

// Event listeners
rollBtn.addEventListener('click', playRound);
resetBtn.addEventListener('click', resetGame);
modalCloseBtn.addEventListener('click', () => {
  resetGame();
  victoryModal.classList.remove('active');
});

// Initialize game
updateUI();
matchStatusEl.innerHTML = 'READY! First to 5 points wins the game! Press ROLL';

console.log('⚔️ Dice Battle Arena Loaded! Press R to roll, ESC to reset ⚔️');
