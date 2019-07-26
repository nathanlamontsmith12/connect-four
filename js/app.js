console.log("Connect 4")


// game logic ----- 

const app = {
	turn: 1,
	board: [],
	player1: "red",
	player2: "yellow",
	currPlayer: 1,
	palette: ["red", "orange", "yellow", "green", "blue", "purple", "black"],
	// board methods: 
	resetBoard(){

		this.board = [];

		for (let y = 1; y <= 6; y++){
			for (let x = 1; x <= 7; x++) {
				this.board.push({
					col: x,
					row: y,
					owned: 0,
					id: `s-${x}-${y}`
				})
			}
		}
	},
	printBoard(){
		for (let y = 1; y <= 6; y++){
			const newRow = document.createElement("div");
			newRow.classList.add("row");
			newRow.dataset.row = y;

			for (let x = 1; x <= 7; x++){
				const newSpace = document.createElement("div");
				newSpace.classList.add("space");
				newSpace.dataset.col = x;
				newSpace.id = `s-${x}-${y}`;
				newRow.appendChild(newSpace);
			}

			board.appendChild(newRow);
		}
	},
	renderBoard(){
		this.board.forEach(space => {
		
			let fillColor = "white"; 

			if (space.owned === 1) {
				fill = this.player1;
			} 

			if (space.owned === 2) {
				fill = this.player2;
			} 

			const thisSpaceDiv = document.querySelector(`#s-${space.col}-${space.row}`);
			thisSpaceDiv.style.background = fillColor;
		})
	},
	// win condition checking: 
	checkWins(){

		// check Columns: 
		const colsWin = this.checkWinCondition([], 0);

		// check Rows: 
		const rowsWin = this.checkWinCondition([], 0);

		// check Diagonals: 
		const diagsWin = this.checkWinCondition([], 0);
	},
	checkWinCondition(startsArr, skipNum){

		startsArr.forEach(start => {
			// maybeWinner for the start 
			// count = 1 
			// loop over this.board based on skipNum and check if next is same player; if yes, increment count 
			// if count >= 4 then WINNER 
			// return 0, 1, or 2 
		})

	},
	// input handling: 
	handleInput(){

		this.changeTurn();
	},
	changeTurn(){

	}
}


// cached elements ----- 

const container = document.getElementById("container");
const startScreen = document.getElementById("start-screen");
const startBtn = document.getElementById("start");
const gameArea = document.getElementById("game-area");
const messageDisplay = document.getElementById("message-display");
const board = document.getElementById("game-board");
const player1 = document.getElementById("player-one");
const player2 = document.getElementById("player-two");


// global functions ----- 



// event listeners ----- 




