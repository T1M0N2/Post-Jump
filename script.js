// Variables
let isJumping = false;
let position = 55;
let obstaclePosition = 600;
let score = 0;
let gameInterval;
let speedIncreaseInterval;
const jumpSpeed = 10;
const topSpeed = 12; // Maximalgeschwindigkeit für Hindernisse
let obstacleSpeed = 5;
const leaderboardSize = 5; // Größe der Bestenliste
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

// Functions
function updateLeaderboard() {
  let leaderboardList = document.getElementById("leaderboard-list");
  leaderboardList.innerHTML = ""; // Clear previous entries
  leaderboard.forEach((score, index) => {
    let listItem = document.createElement("li");
    listItem.textContent = "Run " + (index + 1) + ": " + score;
    leaderboardList.appendChild(listItem);
  });
}

function gameOver() {
  clearInterval(gameInterval); // stop the game loop
  let endScreen = document.getElementById("game-over");
  endScreen.style.display = "block"; // show the game over screen
  
  // Save score to leaderboard
  leaderboard.push(score);
  leaderboard.sort((a, b) => b - a); // Sort in descending order
  leaderboard = leaderboard.slice(0, leaderboardSize); // Keep only the top scores
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard)); // Save to local storage

  // Display leaderboard
  updateLeaderboard();

  let restartButton = document.getElementById("restart-button");
  restartButton.addEventListener("click", () => {
    location.reload(); // refresh the page to restart the game
  });
}

// Main
document.getElementById("start-button").addEventListener("click", () => {
  startGame();
});

// Initialize leaderboard on page load
updateLeaderboard();

function jump() {
  let mario = document.getElementById("mario");
  if (!isJumping) {
    isJumping = true;
    let upInterval = setInterval(() => {
      if (position >= 207) {
        clearInterval(upInterval);
        let downInterval = setInterval(() => {
          if (position <= 57) {
            clearInterval(downInterval);
            isJumping = false;
          } else {
            position -= jumpSpeed;
            mario.style.bottom = position + "px";
          }
        }, 29);
      } else {
        position += jumpSpeed;
        mario.style.bottom = position + "px";
      }
    }, 25);  
  }
}

function update() {
  let mario = document.getElementById("mario");
  let obstacle = document.getElementById("obstacle");
  let obstacles = [obstacle];
  
  if (obstaclePosition < 585) {
    obstaclePosition += obstacleSpeed;
    obstacle.style.right = obstaclePosition + "px";
  } else {
    obstaclePosition = -35;
    score += 1;
    document.getElementById("score").innerHTML = "Score: " + score;
  }
  
  if (score % 200 === 0 && score > 0 && obstacleSpeed < topSpeed) {
    clearInterval(speedIncreaseInterval);
    obstacleSpeed += 1;
    if (obstacleSpeed >= topSpeed) {
      obstacleSpeed = topSpeed;
    }
    speedIncreaseInterval = setInterval(() => {
      if (obstacleSpeed < topSpeed) {
        obstacleSpeed += 1;
      }
      if (obstacleSpeed >= topSpeed) {
        clearInterval(speedIncreaseInterval);
      }
    }, 23000);
  }

  for (let i = 0; i < obstacles.length; i++) {
    let obstacleWidth = parseInt(window.getComputedStyle(obstacles[i]).getPropertyValue('width'));
    let marioHeight = parseInt(window.getComputedStyle(mario).getPropertyValue('height'));
    let marioWidth = parseInt(window.getComputedStyle(mario).getPropertyValue('width'));
    let marioBottom = position + marioHeight;
    let obstacleLeft = parseInt(window.getComputedStyle(obstacles[i]).getPropertyValue('left'));
    let obstacleBottom = parseInt(window.getComputedStyle(obstacles[i]).getPropertyValue('bottom'));
    
    if (
      (obstacleLeft < marioWidth && obstacleLeft > 0) 
      && (marioBottom >= obstacleBottom)
      && (obstacleBottom + obstacleWidth >= position)
    ) {
      gameOver();
    }
  }

  score += 1;
  document.getElementById("score").innerHTML = "Score: " + score;

  mario.style.bottom = position + "px";
}

function startGame() {
  document.getElementById("start-button").style.display = "none";
  document.getElementById("game").setAttribute("tabindex", "0");
  document.getElementById("game").focus();
  gameInterval = setInterval(() => { // update the global variable instead of creating a new one
    update();
  }, 20);

  document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
      jump();
    }
  });

  // Added event listener for touchstart event
  document.addEventListener("touchstart", () => {
    jump();
  });
}
