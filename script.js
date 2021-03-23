const gameContainer = document.getElementById("game");

let COLORS = [];
function randColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
function genRandColors(){
  COLORS = [];
  let input = document.querySelector('input').value;
  num = parseInt(input);

  while(num > 0) {
    color = randColor();
    COLORS.push(color);
    COLORS.push(color);
    num--;
  }
}

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}


// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors() {
  let shuffledColors = shuffle(COLORS);

  for (let color of shuffledColors) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add('hidden'); //added a hidden class to hide colors
    newDiv.style.backgroundColor = color;

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

function displayLowScore() {
  const displayScore = document.querySelector('h3 span');
  currentScore = localStorage.getItem('lowScore');
  if (!currentScore) {
    localStorage.setItem('lowScore', '9999');
  }
  displayScore.innerText = localStorage.getItem('lowScore');
}
displayLowScore();

function createCounter() {
  const counter = document.createElement('h2');
  const counterNum = document.createElement('span');

  counter.innerText = 'Move Count: ';
  counterNum.innerText = '0';
  counter.appendChild(counterNum);

  document.querySelector('#game').appendChild(counter);
}

function createRestartBtn() {
  const restartBtn = document.createElement('button');
  restartBtn.innerText = 'Restart Game';
  restartBtn.setAttribute('id', 'restart-btn');
  document.querySelector('body').append(restartBtn);

  restartBtn.addEventListener('click', function () {
    clearCounter();
    clearTiles();
    genRandColors();
    createDivsForColors();
    restartBtn.remove();
    createCounter();
    displayLowScore();
  });
}

// clear tiles
function clearTiles() {
  tiles = document.querySelectorAll("#game div");
  for (let tile of tiles) tile.remove();
}

// clear counter
function clearCounter() {
  document.querySelector('h2').remove();
}

// Add listeners to start button for starting game
startBtn = document.querySelector('#start-btn');
startBtn.addEventListener('click', function () {
  clearTiles();
  genRandColors();
  createDivsForColors();
  this.remove();
  createCounter();
});

// TODO: Implement this function!
let firstFlip = true;
let firstCard = null;
let secondCard = null;
function handleCardClick(e) {
  // you can use event.target to see which element was clicked
  card = e.target;
  if (card.classList.contains("hidden") && firstFlip && !firstCard) {
    card.classList.remove("hidden");
    firstCard = card;
    firstFlip = false;
  } else if (card.classList.contains("hidden") && !firstFlip && card != firstCard && !secondCard) {
    card.classList.remove("hidden");
    secondCard = card;
    evaluateColors(firstCard, secondCard);
    moveCount();
    firstFlip = true;
  }
}

function evaluateColors(first, second) { //specificity nuance: used the same names for variables and parameters and was unable to modify 'firstCard' and 'secondCard' sucessfully
  firstColor = first.style.backgroundColor;
  secondColor = second.style.backgroundColor;
  timer = 2000;
  if (firstColor != secondColor) {
    window.setTimeout(function(){
      first.classList.add('hidden');
      second.classList.add('hidden');
    }, timer);
  }
  window.setTimeout(function(){ 
    firstCard = null; // why can't I specify this as one line?
    secondCard = null;
  }, timer);
}

// Index the move counter
function moveCount() {
  count = document.querySelector('h2 span');
  count.innerText = parseInt(count.innerText) + 1;
}

// add event listener to check end of game
board = document.querySelector("#game");
board.addEventListener('click', function () {
  gameOver = true;
  for (let tile of board.children) {
    if (tile.classList.contains('hidden')) {
      gameOver = false;
    }
  }

  if (gameOver) {
    createRestartBtn();
    newLowScore();
  };
})

function newLowScore() {
  gScore = document.querySelector('h2 span').innerHTML;
  bScore = localStorage.getItem('lowScore');
  if (parseInt(gScore) < parseInt(bScore)) {
    localStorage.setItem('lowScore', gScore);
    displayLowScore();
  }
}