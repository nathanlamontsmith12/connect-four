console.log("Connect 4")


// game logic ----- 

const app = {
	turn: 0,
	board: [],
	unoccupied: "lightgray",
	player1: "red",
	player2: "yellow",
	currPlayer: 1,
	active: false,
	firstGame: true,
	animationOn: false,
	palette: ["red", "orange", "yellow", "green", "blue", "purple", "black"],
	colStarts: [],
	rowStarts: [],
	diagRightStarts: [],
	diagLeftStarts: [],
	init(){
		this.resetBoard();

		// only do ONCE: 
		if (this.firstGame) {
			this.initStarts();
			this.printBoard();
			this.activateBoard();
			this.firstGame = false;			
		}

		this.renderBoard();
		this.changeTurn();
	},
	initStarts(){
		for (let i = 0; i < 42; i++){
			if (i <= 20) {
				this.colStarts.push(i);
			}

			if (i % 7 === 0) {
				for (let j = i; j <= i + 3; j++) {
					this.rowStarts.push(j);
					if(i <= 14){
						this.diagRightStarts.push(j);
						this.diagLeftStarts.push(j + 3);
					}
				}
			}
		}
	},
	activateBoard(){
		const allSpaces = document.querySelectorAll(".space");
		allSpaces.forEach(space => {
			space.addEventListener("click", (evt)=>{
				const divClicked = evt.target;
				this.handleInput(divClicked);
			});
			space.addEventListener("mouseover", (evt)=>{
				console.log("mouseover:")
				console.log(evt);
				this.setOverlay();
			});
			space.addEventListener("mouseout", (evt)=>{
				console.log("mouseout:")
				console.log(evt);
				this.clearOverlay();
			})
		})
	}, 
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

		this.board.forEach((space, i)=>{
			space.index = i;
		})
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
		
			let fillColor = this.unoccupied; 

			if (space.owned == 1) {
				fillColor = this.player1;
			} 

			if (space.owned == 2) {
				fillColor = this.player2;
			} 

			const thisSpaceDiv = document.querySelector(`#s-${space.col}-${space.row}`);
			thisSpaceDiv.style.background = fillColor;
		})
	},
	checkWin(){
		const colsWin = this.checkWinCondition(this.colStarts, 7);
		const rowsWin = this.checkWinCondition(this.rowStarts, 1);
		const diagsRightWin = this.checkWinCondition(this.diagRightStarts, 8);
		const diagsLeftWin = this.checkWinCondition(this.diagLeftStarts, 6);

		if(colsWin){
			this.gameOver(colsWin);
		}

		if(rowsWin){
			this.gameOver(rowsWin);
		}

		if(diagsRightWin){
			this.gameOver(diagsRightWin);
		}

		if(diagsLeftWin){
			this.gameOver(diagsLeftWin);
		}
	},
	checkWinCondition(startsArr, skipNum){
		for (let i = 0; i < startsArr.length; i++){

			const index = startsArr[i];
			const maybeWinner = this.board[index].owned;
			const winningPattern = [];

			if (!maybeWinner){
				continue;
			}

			winningPattern.push(index);

			let count = 1;
			let skip = skipNum;

			for (let j = 1; j <= 3; j++){
				if (this.board[index].owned === this.board[index + skip].owned){
					winningPattern.push(index + skip);
					count++;
					skip += skipNum;
				}
			}

			if (count >= 4) {
				return winningPattern;
			} 
		}

		return false;
	},
	gameOver(pattern){
		this.active = false;
		console.log("GAME OVER")
		console.log("PLAYER " + this.currPlayer + " WINS!")
		console.log(pattern);
	},
	newGame(){
		this.resetBoard();
		this.renderBoard();
		this.turn = 1; 
		this.currPlayer = 1;
		this.active = true;
	},
	handleInput(divSelected){
		if (!this.active){
			console.log("Game is over! Start a new game to continue playing...")
			return false;
		}

		const column = parseInt(divSelected.dataset.col);
		const validSelection = this.insertSelection(column);

		if (validSelection){
			this.animationOn = true; 
			this.animation(validSelection.col - 1, validSelection.index);
		} else {
			console.log("Invalid Selection! Try again, Player" + this.currPlayer + ".");
			return false;
		}
	},
	insertSelection(column){
		// note: return false to indicate invalid selection 

		const lowestOccupiedIndex = this.board.findIndex(space => space.col == column && space.owned > 0);
		let index; 

		if(lowestOccupiedIndex < 0){
			index = column + 34;
		} else if (lowestOccupiedIndex < 6) {
			return false;
		} else {
			index = lowestOccupiedIndex - 7;
		}

		const selection = this.board[index];
		selection.owned = this.currPlayer;
		return selection;
	},
	finishTurn(){
		this.animationOn = false; 
		this.renderBoard();
		this.checkWin(); 
		this.changeTurn();
	},
	changeTurn(){
		this.turn++;
		this.currPlayer = (this.turn % 2) || 2;
	},
	animation(currIndex, maxIndex){
		if (currIndex >= maxIndex) {
			this.finishTurn(); 
			return true;
		} else {
			const color = this["player" + this.currPlayer];
			const passingDiv = document.getElementById(this.board[currIndex].id);
			const unoccupiedColor = this.unoccupied; 

			passingDiv.style.background = color;

			setTimeout(()=>{
				passingDiv.style.background = unoccupiedColor;
				return this.animation(currIndex + 7, maxIndex);
			}, 20)
		}
	},
	setOverlay(){
		console.log("setOverlay called!")
	},
	clearOverlay(){
		console.log("clearOverlay called!")
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




