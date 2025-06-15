// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let dropMaker; // Will store our timer that creates drops regularly
let score = 0; // Track clean drops collected

let timerInterval; // For the game timer
let timeLeft = 45; // Default game time changed to 45 seconds
let dropInterval = 1000; // Initial drop interval (ms)
let dropSpeed = 4; // Initial drop speed (seconds)

// Wait for button click to start the game
document.getElementById("start-btn").addEventListener("click", startGame);

function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;

  gameRunning = true;
  score = 0;
  updateScore();
  timeLeft = 45;
  dropInterval = 1000;
  dropSpeed = 4;
  updateTimer();

  // Start the timer
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft % 15 === 0 && timeLeft !== 45 && timeLeft > 0) {
      // Increase difficulty every 20 seconds (except at start)
      increaseDifficulty();
    }
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);

  // Create new drops every second (1000 milliseconds)
  dropMaker = setInterval(createDrop, dropInterval);
}

function updateScore() {
  document.getElementById("score").textContent = score;
}

function updateTimer() {
  document.getElementById("time").textContent = timeLeft;
}

function increaseDifficulty() {
  // Increase drop speed and frequency
  if (dropInterval > 400) dropInterval -= 200; // Faster drop creation
  if (dropSpeed > 1.5) dropSpeed -= 0.7; // Faster fall

  clearInterval(dropMaker);
  dropMaker = setInterval(createDrop, dropInterval);
}

function showGameOver() {
  // Remove all drops
  document.querySelectorAll('.water-drop, .bad-emoji').forEach(el => el.remove());
  // Create overlay
  let overlay = document.createElement('div');
  overlay.id = 'game-over-overlay';
  overlay.innerHTML = `
    <div class="game-over-box">
      <h2>Game Over!</h2>
      <button id="try-again-btn">Try Again</button>
    </div>
  `;
  document.body.appendChild(overlay);
  document.getElementById('try-again-btn').onclick = () => {
    overlay.remove();
    startGame();
  };
}

function endGame() {
  gameRunning = false;
  clearInterval(timerInterval);
  clearInterval(dropMaker);
  showGameOver();
}

function createDrop() {
  // Create a new div element that will be our water drop
  const drop = document.createElement("div");

  // Randomly decide if this is a water drop or a bad emoji
  const badEmojis = ["🌿", "🪱", "🪵"];
  if (Math.random() < 0.25) { // 25% chance for a bad emoji
    drop.className = "bad-emoji";
    drop.textContent = badEmojis[Math.floor(Math.random() * badEmojis.length)];
    drop.style.fontSize = `${Math.floor(Math.random() * 20 + 40)}px`;
    drop.addEventListener("click", () => {
      if (gameRunning) endGame();
    });
  } else {
    drop.className = "water-drop";

    // Make drops different sizes for visual variety
    const initialSize = 60;
    const sizeMultiplier = Math.random() * 0.8 + 0.5;
    const size = initialSize * sizeMultiplier;
    drop.style.width = drop.style.height = `${size}px`;

    // Position the drop randomly across the game width
    // Subtract 60 pixels to keep drops fully inside the container
    const gameWidth = document.getElementById("game-container").offsetWidth;
    const xPosition = Math.random() * (gameWidth - 60);
    drop.style.left = xPosition + "px";

    // Make drops fall for 4 seconds
    drop.style.animationDuration = dropSpeed + "s";

    // Add the new drop to the game screen
    document.getElementById("game-container").appendChild(drop);

    // Remove drops that reach the bottom (weren't clicked)
    drop.addEventListener("animationend", () => {
      drop.remove(); // Clean up drops that weren't caught
    });

    drop.addEventListener("click", () => {
      // Only count if it's a clean drop (not a bad one)
      if (!drop.classList.contains("bad-emoji")) {
        score++;
        updateScore();
        drop.remove();
      }
    });
  }

  // Add the new drop to the game screen
  document.getElementById("game-container").appendChild(drop);

  // Remove drops that reach the bottom (weren't clicked)
  drop.addEventListener("animationend", () => {
    drop.remove(); // Clean up drops that weren't caught
  });
}
