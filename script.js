// TOMAR LOS ELEMENTOS HTML QUE NECESITAMOS UTILIZAR

const board = document.getElementById('board')
const scoreBoard = document.getElementById('scoreBoard')
const startButton = document.getElementById('start')
const gameOverSing = document.getElementById('gameOver')


// game settings

const boardSize = 10;
const gameSpeed = 150;
const squareTypes = {
    emptySquare: 0,
    snakeSquare: 1,
    foodSquare: 2
}
const directions = {
    ArrowUp: -10,
    ArrowDown: 10,
    ArrowRight: 1,
    ArrowLeft: -1
}

// game variables

let snake;
let score;
let direction;
let boardSquares;
let emptySquares;
let moveInterval;

// functions

// pintar la snake

const drawSnake = () => {
    snake.forEach((square) => {
        drawSquare(square, 'snakeSquare')
    });
}


// rellenar cada cuadrado del tablero con la serpiente, fondo o comida
// square: posicion del cuadrado
// type: tipo de cuadrado( emptySquare, snakeSquare, foodSquare)
const drawSquare = (square, type) => {
    // separamos el square en fila y columna viene '01'
    const [row, column] = square.split('');
    boardSquares[row][column] = squareTypes[type];
    const squareElement = document.getElementById(square)
    squareElement.setAttribute('class', `square ${type}`)

    if (type === 'emptySquare') {
        emptySquares.push(square);
    } else if (emptySquares.indexOf(square) !== -1) {
        emptySquares.splice(emptySquares.indexOf(square), 1)
    }


}


// crear el div para desplazar la serpiente

const createBoard = () => {
    boardSquares.forEach((row, rowIndex) => {
        row.forEach((column, columnIndex) => {
            const squareValue = `${rowIndex}${columnIndex}`;
            const squareElement = document.createElement('div');
            squareElement.setAttribute('class', 'square emptySquare');
            squareElement.setAttribute('id', squareValue);
            board.appendChild(squareElement)
            emptySquares.push(squareValue)
        });
    });
}

// iniciar el juego

const setGame = () => {
    snake = ['00','01','02','03'];
    score = snake.length;
    direction = 'ArrowRight';
    boardSquares = Array.from(Array(boardSize), () => new Array(boardSize).fill(squareTypes.emptySquare))
    // console.log(boardSquares);
    board.innerHTML = '';
    emptySquares = [];
    createBoard();
}

// actualizar score
const updateScore = () => {
    scoreBoard.innerText = score;
}

// crear comida en posicion random

const createRandomFood = () => {
    // crea una comida en un lugar vacio
    const randomEmptySquare = emptySquares[Math.floor(Math.random() * emptySquares.length)]
    // console.log(randomEmptySquare);
    // pintamos la comida
    drawSquare(randomEmptySquare, 'foodSquare')
}

// recibe una nueva direccion y setea la direccion
const setDirection = newDirection => {
    direction = newDirection;
}


// funcion para mover la snake

const directionEvent = key => {
    switch (key.code) {
        case 'ArrowUp':
            direction != 'ArrowDown' && setDirection(key.code)
            break;
        case 'ArrowDown':
            direction != 'ArrowUp' && setDirection(key.code)
            break;
        case 'ArrowRight':
            direction != 'ArrowLeft' && setDirection(key.code)
            break;
        case 'ArrowLeft':
            direction != 'ArrowRight' && setDirection(key.code)
            break;
        default:
            break;
    }
}

// game over
const gameOver = () => {
    gameOverSing.style.display = 'block';
    clearInterval(moveInterval)
    startButton.disabled = false;
} 

// funcion que mueve automaticamente la snake

const moveSnake = () => {
    const newSquare = String(
        Number(snake[snake.length -1]) + directions[direction]).padStart(2,'0');

        const [row, column] = newSquare.split('');

        if ( newSquare < 0 || 
            newSquare > boardSize * boardSize || 
            (direction === "ArrowRight" && column == 0) || 
            (direction === "ArrowLeft" && column == 9) || 
            boardSquares[row][column] === squareTypes.snakeSquare) {
            gameOver();
        } else {
            snake.push(newSquare)
            if (boardSquares[row][column] === squareTypes.foodSquare) {
                addFood();
            } else {
                const emptySquare = snake.shift('');
                drawSquare(emptySquare, 'emptySquare')
            }
            drawSnake();
        }
}

const addFood = () => {
    score++;
    updateScore();
    createRandomFood();

}

// disparador para iniciar juego

const startGame = () => {
    setGame();
    gameOverSing.style.display = 'none'
    startButton.disabled = true
    drawSnake();
    updateScore();
    createRandomFood();
    document.addEventListener('keydown', directionEvent)
    moveInterval = setInterval ( ()=> moveSnake(), gameSpeed)
}



startButton.addEventListener('click', startGame);
