console.log("Connect 4")


// palette 

const palette = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"]


// game logic ----- 

const app = {
	turn: 1,
	board: [],
	player1: null,
	player2: null,
	currPlayer: 1,
	// board methods: 
	resetBoard(){

		this.board = [];

		for (let i = 1; i <= 6; i++){
			for (let j = 1; j <= 7; j++) {
				this.board.push({
					x: j,
					y: i,
					owned: 0
				})
			}
		}
	},
	makeBoard(){

	},
	updateBoard(){

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



// global functions ----- 



// event listeners ----- 




