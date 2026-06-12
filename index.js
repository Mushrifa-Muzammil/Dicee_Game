// DICE BATTLE ARENA - Optimized for Laptop Screen Recording
// First to 5 points wins - Shows winner clearly with popup, no auto-reset

(function() {
  // DOM elements
  const dice1 = document.getElementById('dice1');
  const dice2 = document.getElementById('dice2');
  const titleEl = document.getElementById('title');
  const rollBtn = document.getElementById('rollBtn');
  const resetBtn = document.getElementById('resetBtn');
  const resultMsgSpan = document.getElementById('resultMessage');
  const resultEmojiSpan = document.getElementById('resultEmoji');
  const score1Span = document.getElementById('score1');
  const score2Span = document.getElementById('score2');
  const roundSpan = document.getElementById('roundIndicator');
  const player1Zone = document.getElementById('player1Zone');
  const player2Zone = document.getElementById('player2Zone');
  const trophyAnim = document.getElementById('trophyAnim');
  const winnerModal = document.getElementById('winnerModal');
  const winnerNameSpan = document.getElementById('winnerName');
  const winnerMessageSpan = document.getElementById('winnerMessage');
  const winnerCloseBtn = document.getElementById('winnerCloseBtn');
  
  // Game state
  let isRolling = false;
  let player1Score = 0;
  let player2Score = 0;
  let currentRound = 1;
  let gameActive = true;
  let gameWinner = null; // 'p1', 'p2', or null
  
  const imageBase = 'images/dice';
  const ext = '.png';
  
  // Helper: update UI scores and round
  function updateUI() {
    score1Span.textContent = player1Score;
    score2Span.textContent = player2Score;
    roundSpan.textContent = `ROUND ${currentRound}`;
  }
  
  // Show result with emoji + text with visual feedback
  function setResult(emoji, message) {
    resultEmojiSpan.textContent = emoji;
    resultMsgSpan.textContent = message;
    const resCard = document.querySelector('.result-card');
    if (resCard) {
      resCard.style.transform = 'scale(1.01)';
      setTimeout(() => { 
        if (resCard) resCard.style.transform = 'scale(1)'; 
      }, 150);
    }
  }
  
  // Highlight winner zone with glowing border
  function setWinnerHighlight(winner) {
    player1Zone.classList.remove('winner-zone');
    player2Zone.classList.remove('winner-zone');
    if (winner === 'p1') player1Zone.classList.add('winner-zone');
    else if (winner === 'p2') player2Zone.classList.add('winner-zone');
  }
  
  // Trigger trophy animation for recording excitement
  function triggerTrophy() {
    if (!trophyAnim) return;
    trophyAnim.classList.remove('trophy-show');
    void trophyAnim.offsetWidth;
    trophyAnim.classList.add('trophy-show');
    setTimeout(() => {
      trophyAnim.classList.remove('trophy-show');
    }, 850);
  }
  
  // Show Winner Modal with clear announcement
  function showWinnerModal(winner) {
    if (winner === 'p1') {
      winnerNameSpan.textContent = '👑 PLAYER 1 WINS! 👑';
      winnerMessageSpan.textContent = 'Congratulations! First to reach 5 points!';
    } else if (winner === 'p2') {
      winnerNameSpan.textContent = '⚡ PLAYER 2 WINS! ⚡';
      winnerMessageSpan.textContent = 'Congratulations! First to reach 5 points!';
    }
    winnerModal.style.display = 'flex';
  }
  
  // Hide winner modal and reset game
  function closeWinnerModalAndReset() {
    winnerModal.style.display = 'none';
    fullReset();
  }
  
  // Random number between 1 and 6
  function randDice() {
    return Math.floor(Math.random() * 6) + 1;
  }
  
  // Full game reset (keeps game active, clears scores)
  function fullReset() {
    if (isRolling) return;
    player1Score = 0;
    player2Score = 0;
    currentRound = 1;
    gameActive = true;
    gameWinner = null;
    
    // reset dice images to default dice6
    dice1.src = `${imageBase}6${ext}`;
    dice2.src = `${imageBase}6${ext}`;
    updateUI();
    setWinnerHighlight(null);
    setResult('🔄', 'Game reset! New battle starts now!');
    titleEl.innerHTML = '⚔️ DICE BATTLE ARENA ⚔️';
    
    // subtle container pulse for recording
    const containerDiv = document.querySelector('.container');
    if (containerDiv) {
      containerDiv.style.transform = 'scale(0.99)';
      setTimeout(() => { 
        if (containerDiv) containerDiv.style.transform = 'scale(1)'; 
      }, 120);
    }
  }
  
  // Main roll logic
  function performRoll() {
    // Don't roll if game has a winner (modal showing) or already rolling
    if (isRolling || !gameActive || gameWinner !== null) return;
    
    isRolling = true;
    
    // disable buttons during roll animation
    rollBtn.disabled = true;
    resetBtn.disabled = true;
    
    // add shake animation to both dice
    dice1.classList.add('shake');
    dice2.classList.add('shake');
    
    const val1 = randDice();
    const val2 = randDice();
    
    // slight delay to emphasize animation for recording clarity
    setTimeout(() => {
      // update dice images with new values
      dice1.src = `${imageBase}${val1}${ext}`;
      dice2.src = `${imageBase}${val2}${ext}`;
      
      let winner = null;
      let emojiFinal = '';
      let msgFinal = '';
      
      if (val1 > val2) {
        // Player 1 wins
        player1Score++;
        winner = 'p1';
        emojiFinal = '👑🏆👑';
        msgFinal = `PLAYER 1 WINS! (${val1} vs ${val2}) +1 POINT!`;
        titleEl.innerHTML = '🏆 PLAYER 1 VICTORY! 🏆';
        triggerTrophy();
      } 
      else if (val2 > val1) {
        // Player 2 wins
        player2Score++;
        winner = 'p2';
        emojiFinal = '⚡🏆⚡';
        msgFinal = `PLAYER 2 WINS! (${val2} vs ${val1}) +1 POINT!`;
        titleEl.innerHTML = '🏆 PLAYER 2 VICTORY! 🏆';
        triggerTrophy();
      } 
      else {
        // Draw - no points
        winner = null;
        emojiFinal = '🤝🎲🤝';
        msgFinal = `DRAW! Both rolled ${val1}. No points.`;
        titleEl.innerHTML = '🤝 DRAW! ROLL AGAIN 🤝';
      }
      
      // apply visual winner highlight for this round
      setWinnerHighlight(winner);
      setResult(emojiFinal, msgFinal);
      
      // update scores and round counter
      currentRound++;
      updateUI();
      
      // remove shake class after animation completes
      setTimeout(() => {
        dice1.classList.remove('shake');
        dice2.classList.remove('shake');
      }, 100);
      
      // CHECK FOR GAME WINNER (First to 5 points)
      if (player1Score >= 5) {
        gameActive = false;
        gameWinner = 'p1';
        setWinnerHighlight('p1');
        triggerTrophy();
        setResult('🏆🏆🏆', '🏆 PLAYER 1 WINS THE GAME! 🏆');
        titleEl.innerHTML = '🏆 PLAYER 1 - GAME WINNER! 🏆';
        // Show winner modal popup
        showWinnerModal('p1');
      } 
      else if (player2Score >= 5) {
        gameActive = false;
        gameWinner = 'p2';
        setWinnerHighlight('p2');
        triggerTrophy();
        setResult('🏆🏆🏆', '🏆 PLAYER 2 WINS THE GAME! 🏆');
        titleEl.innerHTML = '🏆 PLAYER 2 - GAME WINNER! 🏆';
        // Show winner modal popup
        showWinnerModal('p2');
      }
      
      // revert title to default after delay if no game winner
      if (!gameWinner) {
        setTimeout(() => {
          if (gameActive && titleEl) titleEl.innerHTML = '⚔️ DICE BATTLE ARENA ⚔️';
        }, 1500);
      }
      
      // re-enable buttons
      rollBtn.disabled = false;
      resetBtn.disabled = false;
      isRolling = false;
    }, 210);
  }
  
  // Keyboard controls: R / Space = roll, ESC = reset
  function onKeyDown(e) {
    const key = e.key;
    // Don't allow rolling if modal is open
    if (winnerModal.style.display === 'flex') {
      if (key === 'Escape') {
        e.preventDefault();
        closeWinnerModalAndReset();
      }
      return;
    }
    
    if (key === 'r' || key === 'R') {
      e.preventDefault();
      if (!isRolling && gameActive && gameWinner === null) performRoll();
    } else if (key === ' ' || key === 'Space' || key === 'Spacebar') {
      e.preventDefault();
      if (!isRolling && gameActive && gameWinner === null) performRoll();
    } else if (key === 'Escape') {
      e.preventDefault();
      fullReset();
    }
  }
  
  // Event listeners
  rollBtn.addEventListener('click', () => {
    if (!isRolling && gameActive && gameWinner === null) performRoll();
  });
  resetBtn.addEventListener('click', fullReset);
  winnerCloseBtn.addEventListener('click', closeWinnerModalAndReset);
  window.addEventListener('keydown', onKeyDown);
  
  // Preload all dice images for seamless experience
  for (let i = 1; i <= 6; i++) {
    const imgPre = new Image();
    imgPre.src = `${imageBase}${i}${ext}`;
  }
  
  // initial UI setup
  updateUI();
  setWinnerHighlight(null);
  setResult('🎲', 'READY! First to 5 points wins the game! Press ROLL');
  
  console.log('🎥 Laptop recording mode active — First to 5 wins, clear winner popup!');
})();