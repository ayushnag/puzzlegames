const gridSize = 5;
const gridContainer = document.getElementById('grid-container');

let turn = 0;
let words = [];
let secretWord = "";
let grid = new Array(gridSize).fill(new Array(gridSize).fill(''));

function createGrid(size) {
    for(let i = 0; i < size; i++) {
        rowBoxes = [];
        for (let j = 0; j < size; j++) {
            const box = document.createElement('input');
            box.type = 'text';
            box.maxLength = 1;
            box.className = 'box';
            box.disabled = true;
            box.addEventListener('keydown', (event) => {
                const row = grid[turn];
                const col = row.indexOf(box);
                if(event.key === "Backspace" && col > 0 && box.value === "") {
                    const prev = box.previousElementSibling;
                    if(prev) {
                        prev.disabled = false;
                        box.disabled = true;
                        prev.focus();
                    }
                } else if(event.key === "Enter") {
                    checkGuess();
                }
            });

            box.addEventListener('input', (event) => {
                box.value = box.value.toUpperCase();
                if (!box.value.match(/[A-Z]/)) {
                    event.target.value = ''; // Clear input if not a letter
                    return;
                }
                const row = grid[turn];
                const col = row.indexOf(box);
                if (event.inputType == "insertText" && col < gridSize - 1) {
                    const next = box.nextElementSibling;
                    if(next) {
                        next.disabled = false;
                        box.disabled = true;
                        next.focus();
                    }
                }
                else if (event.inputType == "deleteContentBackward" && box.value != "" && col > 0) {
                    const prev = box.previousElementSibling;
                    if(prev) {
                        prev.disabled = false;
                        box.disabled = true;
                        prev.focus();
                    }
                }
            });
            gridContainer.appendChild(box);
            rowBoxes.push(box);
        }
        grid[i] = rowBoxes;
    }
}

function nextTurn() {
    grid[turn][gridSize - 1].disabled = true;
    turn++;
    grid[turn][0].disabled = false;
    grid[turn][0].focus();
}

// Function to check the user's guess
function checkGuess() {
    const currentRow = grid[turn];
    const guess = grid[turn].map((box) => box.value).join('').toLowerCase();
    if (guess === secretWord) {
        alertUser("Congratulations! You guessed the word correctly", 3000);
        animateGuess(guess, currentRow);
        currentRow[gridSize - 1].disabled = true;
    } else if(guess.length < secretWord.length) {
        currentRow.forEach((box) => {
            box.classList.add("apply-shake");
            box.addEventListener("animationend", () => {
                box.classList.remove("apply-shake");
            });
        });
    } else if (!words.includes(guess)) {
        alertUser("That is not a recognized word");
        currentRow.forEach((box) => {
            box.classList.add("apply-shake");
            box.addEventListener("animationend", () => {
                box.classList.remove("apply-shake");
            });
        });
    } else {
        animateGuess(guess, currentRow);
        nextTurn();
    }
}

function animateGuess(guess, rowBoxes) {
    // set the color of the boxes based on the guess
    for (let i = 0; i < guess.length; i++) {
        setTimeout(() => {
            if (guess[i] === secretWord[i]) {
                rowBoxes[i].style = "background-color: #79A86B";
            } else if (secretWord.includes(guess[i])) {
                rowBoxes[i].style = "background-color: #C6B566";
            } else {
                rowBoxes[i].style = "background-color: #525252";
            }
        }, i * 500);
    }
}

function alertUser(message, duration = 1000) {
    const notificationBox = document.getElementById('notification-box');
    notificationBox.textContent = message;
    notificationBox.classList.add('show');
    setTimeout(() => {
        notificationBox.classList.remove('show');
    }, duration);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}


// Call the function to create the grid
createGrid(gridSize);
// Choose a random word from the list
fetch("words.txt")
  .then((res) => res.text())
  .then((text) => {
    words = text.split("\r\n");
    secretWord = words[getRandomInt(words.length)];
    console.log(secretWord);
   })
  .catch((e) => console.error(e));

// start the game
grid[0][0].disabled = false;