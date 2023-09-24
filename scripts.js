const grid = document.querySelector(".grid");
const resultsDisplay = document.querySelector(".results");
const gameOver = document.querySelector(".game-over");
const finalResult = document.querySelector(".final-result");
let currentShooterIndex = 202;
let width = 15;
let height = 15;
let direction = 1;
let invadersId;
let goingRight = true;
let aliensRemoved = [];
let results = 0;

for (let i = 0; i < 225; i++) {
  const square = document.createElement("div");
  grid.appendChild(square);
}

const squares = Array.from(document.querySelectorAll(".grid div"));

const alienInvaders = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 30, 31,
  32, 33, 34, 35, 36, 37, 38, 39,
];

function draw() {
  for (i = 0; i < alienInvaders.length; i++) {
    if (!aliensRemoved.includes(i)) {
      squares[alienInvaders[i]].classList.add("invader");
    }
  }
}

function remove() {
  for (i = 0; i < alienInvaders.length; i++) {
    const alienInvadersElements = alienInvaders[i];
    squares[alienInvadersElements].classList.remove("invader");
  }
}

draw();

squares[currentShooterIndex].classList.add("shooter");

function moveShooter(e) {
  if (
    resultsDisplay.innerHTML == "GAME OVER" ||
    resultsDisplay.innerHTML == "YOU WIN"
  ) {
    return null;
  } else if (
    resultsDisplay.innerHTML !== "GAME OVER" ||
    resultsDisplay.innerHTML != "YOU WIN"
  ) {
    squares[currentShooterIndex].classList.remove("shooter");
    switch (e.key) {
      case "ArrowLeft":
        if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
        // console.log(currentShooterIndex % width)
        break;
      case "ArrowRight":
        if (currentShooterIndex % width < width - 1) currentShooterIndex += 1;
        break;
    }

    squares[currentShooterIndex].classList.add("shooter");
    // console.log(currentShooterIndex, width)
  }
}

document.addEventListener("keydown", moveShooter);

function moveInvaders() {
  const leftEdge = alienInvaders[0] % width == 0;
  const rightEdge =
    alienInvaders[alienInvaders.length - 1] % width == width - 1;

  if ((leftEdge && direction == 1) || (rightEdge && direction == -1)) {
    console.log(height);
    height -= 1;
  }

  remove();

  if (rightEdge && goingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width + 1;
      direction = -1;
      goingRight = false;
    }
  }

  if (leftEdge && !goingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width - 1;
      direction = 1;
      goingRight = true;
    }
  }

  for (let i = 0; i < alienInvaders.length; i++) {
    alienInvaders[i] += direction;
  }

  draw();

  if (squares[currentShooterIndex].classList.contains("invader", "shooter")) {
    gameOver.classList.add("displayed");
    resultsDisplay.innerHTML = "GAME OVER";
    finalResult.innerHTML = results;
    clearInterval(invadersId);
  }

  for (let i = 0; i < alienInvaders.length; i++) {
    if (alienInvaders[i] > squares.length - width) {
      gameOver.classList.add("displayed");
      resultsDisplay.innerHTML = "GAME OVER";
      finalResult.innerHTML = results;
      clearInterval(invadersId);
    }
  }

  if (aliensRemoved.length === alienInvaders.length) {
    gameOver.classList.add("displayed");
    resultsDisplay.innerHTML = "YOU WIN";
    finalResult.innerHTML = results;
    clearInterval(invadersId);
  }
}
invadersId = setInterval(moveInvaders, 250);

function shoot(e) {
  let laserId;
  let currentLaserIndex = currentShooterIndex;

  function moveLaser() {
    if (
      resultsDisplay.innerHTML == "GAME OVER" ||
      resultsDisplay.innerHTML == "YOU WIN"
    ) {
      return null;
    }
    if (
      resultsDisplay.innerHTML !== "GAME OVER" ||
      resultsDisplay.innerHTML != "YOU WIN"
    ) {
      if (squares[currentLaserIndex]) {
        squares[currentLaserIndex].classList.remove("laser");
        currentLaserIndex = currentLaserIndex - width;

        if (!squares[currentLaserIndex] == 0) {
          squares[currentLaserIndex].classList.add("laser");

          if (squares[currentLaserIndex].classList.contains("invader")) {
            squares[currentLaserIndex].classList.remove("laser");
            squares[currentLaserIndex].classList.remove("invader");
            squares[currentLaserIndex].classList.add("boom");

            setTimeout(
              () => squares[currentLaserIndex].classList.remove("boom"),
              300
            );
            clearInterval(laserId);

            const alienRemoed = alienInvaders.indexOf(currentLaserIndex);
            aliensRemoved.push(alienRemoed);
            results = results + height;
            resultsDisplay.innerHTML = results;
          }
        }
      }
    }
  }

  switch (e.key) {
    case "ArrowUp":
      laserId = setInterval(moveLaser, 100);
  }
}

document.addEventListener("keydown", shoot);

const reload = document.querySelector(".restart");
restart.addEventListener("click", reloadFunc);
const start = document.querySelector(".start");
start.addEventListener("click", reloadFunc);

function reloadFunc() {
  window.location.href = window.location.href;
}
