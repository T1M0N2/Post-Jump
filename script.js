<!DOCTYPE html>
<html>
<head>
  <title>Post Jump</title>
  <link rel="icon" href="home.png">
  <link rel="manifest" href="manifest.json">
  <link rel="stylesheet" type="text/css" href="style.css">
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
  <script src="script.js">
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


