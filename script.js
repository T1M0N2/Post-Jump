<!DOCTYPE html>
<html>
<head>
  <title>Post Jump</title>
  <link rel="icon" href="home.png">
  <link rel="manifest" href="manifest.json">
  <link rel="stylesheet" type="text/css" href="style.css">
  <script>
    // Variables
    const leaderboardSize = 3; // Größe der Bestenliste
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
  </script>
</head>
<body>
  <center><img src="titel.png" alt="Mein Spiel Logo"></center> 
  <div id="game">
    <div id="score">Score: 0</div>
    <div id="mario"></div>
    <div id="obstacle"></div>
    <button id="start-button">Start</button>
    <div id="game-over">
      <img src="gameover1.png" alt="Game Over">
      <p id="score-text"></p>
      <button id="restart-button"></button>
    </div>
  </div>
  <div id="leaderboard">
    <h2>Bestenliste</h2>
    <ol id="leaderboard-list"></ol>
  </div>
  <script src="script.js"></script>
  <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/serviceworker.js')
          .then(registration => {
            console.log('Service Worker registered: ', registration);
          })
          .catch(error => {
            console.log('Service Worker registration failed: ', error);
          });
      });
    }
  </script>
</body>
</html>
