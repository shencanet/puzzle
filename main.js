const elts = {
  text1: document.getElementById("text1"),
  text2: document.getElementById("text2"),
};

// The strings to morph between. You can change these to anything you want!
const texts = ["PERDIDOS", "LOST", "is", "so", "satisfying", "to", "watch?"];

// Controls the speed of morphing.
const morphTime = 1;
const cooldownTime = 0.25;

let textIndex = texts.length - 1;
let time = new Date();
let morph = 0;
let cooldown = cooldownTime;

elts.text1.textContent = texts[textIndex % texts.length];
elts.text2.textContent = texts[(textIndex + 1) % texts.length];

function doMorph() {
  morph -= cooldown;
  cooldown = 0;

  let fraction = morph / morphTime;

  if (fraction > 1) {
    cooldown = cooldownTime;
    fraction = 1;
  }

  setMorph(fraction);
}

// A lot of the magic happens here, this is what applies the blur filter to the text.
function setMorph(fraction) {
  // fraction = Math.cos(fraction * Math.PI) / -2 + .5;

  elts.text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
  elts.text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

  fraction = 1 - fraction;
  elts.text1.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
  elts.text1.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

  elts.text1.textContent = texts[textIndex % texts.length];
  elts.text2.textContent = texts[(textIndex + 1) % texts.length];
}

function doCooldown() {
  morph = 0;

  elts.text2.style.filter = "";
  elts.text2.style.opacity = "100%";

  elts.text1.style.filter = "";
  elts.text1.style.opacity = "0%";
}

// Animation loop, which is called every frame.
function animate() {
  requestAnimationFrame(animate);

  let newTime = new Date();
  let shouldIncrementIndex = cooldown > 0;
  let dt = (newTime - time) / 5000;
  time = newTime;

  cooldown -= dt;

  if (cooldown <= 0) {
    if (shouldIncrementIndex) {
      textIndex++;
    }

    doMorph();
  } else {
    doCooldown();
  }
}

// Start the animation.
animate();

/* fila*columna
[0.0],[0.1].[0.2]
[1.0],[1.1].[1.2]
[2.0],[2.1].[2.2]
*/
let Matrix = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "", "8"],
];
let matriz =  Matrix || shuffleMatrix();

let board = document.querySelector(".board");
//console.log(board);

drawTokens();
addEventListeners();

function drawTokens() {
  board.innerHTML = "";
  matriz.forEach((row) =>
    row.forEach((element) => {
      if (element == "") {
        board.innerHTML += `<div class ='empty'>${element}</div>`;
      } else {
        board.innerHTML += `<div class ='token'>${element}</div>`;
      }
    })
  );
}

function addEventListeners() {
  let tokens = document.querySelectorAll(".token");
  tokens.forEach((token) =>
    token.addEventListener("click", () => {
      let actualPosition = searchPosition(token.innerText);
      let emptyPosition = searchPosition("");
      let movement = canItMove(actualPosition, emptyPosition);
      updateMatrix(token.innerHTML, actualPosition, emptyPosition);
      if (movement !== false) {
        updateMatrix(token.innerText, actualPosition, emptyPosition);

        let resultado = compareMatrix();
        console.log(resultado);
        if (resultado == true) {
          confetti();
          
        }
      
        drawTokens();
        addEventListeners();
      }
    })
  );
}

function searchPosition(element) {
  let rowIndex = 0;
  let columnIndex = 0;
  matriz.forEach((row, index) => {
    let rowElement = row.findIndex((item) => item == element);
    if (rowElement !== -1) {
      //console.log(rowElement, index);
      rowIndex = index;
      columnIndex = rowElement;
    }
  });
  return [rowIndex, columnIndex];
}
//refactor canitmove
function nextMovement(actualPosition, emptyPosition) {
  if (actualPosition[1] == emptyPosition[1]) {
    if (actualPosition[0] - emptyPosition[0] == -1) {
      return "down";
    } else if (actualPosition[0] - emptyPosition[0] == 1) {
      return "up";
    } else {
      return "noMove";
    }
  } else if (actualPosition[0] == emptyPosition[0]) {
    if (actualPosition[1] - emptyPosition[1] == -1) {
      return "right";
    } else if (actualPosition[1] - emptyPosition[1] == 1) {
      return "left";
    } else {
      return "noMove";
    }
  } else {
    return "noMove";
  }
}

function canItMove(actualPosition, emptyPosition) {
  if (actualPosition[1] == emptyPosition[1]) {
    if (
      actualPosition[0] - emptyPosition[0] > 1 ||
      actualPosition[0] - emptyPosition[0] < -1
    ) {
      return "noMove";
    } //58
  } else if (actualPosition[0] == emptyPosition[0]) {
    //67
    if (
      actualPosition[1] - emptyPosition[1] > 1 ||
      actualPosition[1] - emptyPosition[1] < -1
    ) {
      return false; //70
    } //71
  } else {
    //80
    return false;
  } //82
}

function updateMatrix(element, actualPosition, emptyPosition) {
  matriz[actualPosition[0]][actualPosition[1]] = "";
  matriz[emptyPosition[0]][emptyPosition[1]] = element;
  console.log(matriz);
}

function shuffleMatrix() {
  let shuffleMatrix = [[], [], []];
  let column = 0;
  let row = 0;

  let array = ["1", "2", "3", "4", "5", "6", "7", "8", ""];
  let shuffleArray = array.sort(() => Math.random() - 0.5);
  shuffleArray.forEach((element) => {
    shuffleMatrix[row].push(element);
    if (column < 2) {
      column++;
    } else {
      column = 0;
      row++;
    }
  });
  return shuffleMatrix;
}

function compareMatrix() {
  let counter = 0;
  let finalMatrix = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", ""],
  ];
  Matrix.forEach((row, indexRow) => {
    row.forEach((element, indexColum) => {
      if (element == finalMatrix[indexRow][indexColum]) {
      counter++;
      } 
    })
  })
  console.log(counter);
  if (counter == 9) {
    return true;
  } else {
    return false;
  }
}
