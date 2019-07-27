console.log("Connect 4")

// global vars ----- 

const colors = ["", "red", "orange", "yellow", "green", "blue", "purple"]

const paletteMap = {
	red: {
		fill: "rgba(255, 0, 0, 1)",
		light: "rgba(255, 0, 0, 0.1)"
	},
	orange: {
		fill: "rgba(255, 165, 0, 1)",
		light: "rgba(255, 165, 0, 0.1)"
	},
	yellow: {
		fill: "rgba(255, 255, 0, 1)",
		light: "rgba(255, 255, 0, 0.1)"
	},
	green: {
		fill: "rgba(0, 128, 0, 1)",
		light: "rgba(0, 128, 0, 0.1)"
	}, 
	blue: {
		fill: "rgba(0, 0, 205, 1)",
		light: "rgba(0, 0, 205, 0.1)"
	},
	purple: {
		fill: "rgba(128, 0, 128, 1)",
		light: "rgba(128, 0, 128, 0.1)"
	}
}


// game logic ----- 

const app = {
	turn: 0,
	board: [],
	occupied: 0,
	emptyColor: "white",
	player1: "",
	player2: "",
	player1L: null,
	player2L: null,
	message: "",
	currPlayer: 1,
	active: false,
	overlay: null,
	firstGame: true,
	overlayAnimationId: null,
	dropAnimationOn: false,
	colStarts: [],
	rowStarts: [],
	diagRightStarts: [],
	diagLeftStarts: [],
	init(){
		this.active = true;
		this.resetBoard();

		// only do ONCE: 
		if (this.firstGame) {
			this.initStarts();
			this.printBoard();
			this.activateBoard();
			this.activateOverlayAnimation();
			this.translateColorSelections();
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
				const divEntered = evt.target; 
				this.setOverlay(divEntered);
			});
			space.addEventListener("mouseout", ()=>{
				this.clearOverlay();
			})
		})
	}, 
	resetBoard(){

		this.board = [];
		this.occupied = 0;

		let index = 0; 

		for (let y = 1; y <= 6; y++){
			for (let x = 1; x <= 7; x++) {
				this.board.push({
					col: x,
					row: y,
					owner: 0,
					id: `s-${x}-${y}`,
					index: index
				});

				index++;
			}
		}
	},
	printBoard(){

		let index = 0; 

		for (let y = 1; y <= 6; y++){
			const newRow = document.createElement("div");
			newRow.classList.add("row");
			newRow.dataset.row = y;

			for (let x = 1; x <= 7; x++){
				const newSpace = document.createElement("div");
				newSpace.classList.add("space");
				newSpace.classList.add(`col-${x}`)
				newSpace.dataset.col = x;
				newSpace.dataset.index = index;
				newSpace.id = `s-${x}-${y}`;
				newRow.appendChild(newSpace);
				index++;
			}

			board.appendChild(newRow);
		}
	},
	renderOverlay(){
		const spacesToShade = this.board.filter(space => space.owner == 0 && space.col == this.overlay) 

		spacesToShade.forEach(space => {
			document.getElementById(space.id).style.background = this["player" + this.currPlayer + "L"];
		})

		// Highlight last space: 

		const lastSpace = spacesToShade[spacesToShade.length - 1];

		if (lastSpace) {
			const lastSpaceDiv = document.getElementById(spacesToShade[spacesToShade.length - 1].id);
			lastSpaceDiv.style.border = "3px solid slategray";
		}
	},
	renderBoard(){

		this.board.forEach(space => {
		
			let fillColor = this.emptyColor; 

			if (space.owner == 1) {
				fillColor = this.player1;
			} 

			if (space.owner == 2) {
				fillColor = this.player2;
			} 

			const thisSpaceDiv = document.querySelector(`#s-${space.col}-${space.row}`);
			thisSpaceDiv.style.background = fillColor;

			if (space.owner) {
				thisSpaceDiv.style.border = "3px solid black";
			} else {
				thisSpaceDiv.style.border = "3px solid lightgray";
			}
		})
	},
	displayMessage(){
		const message = document.getElementById("message") 
		message.textContent = this.message;
		if (this.active) {
			message.style.color = this["player" + this.currPlayer]; 
		} else {
			message.style.color = "black";
		}
	},
	checkWin(){
		const colsWin = this.checkWinCondition(this.colStarts, 7);
		const rowsWin = this.checkWinCondition(this.rowStarts, 1);
		const diagsRightWin = this.checkWinCondition(this.diagRightStarts, 8);
		const diagsLeftWin = this.checkWinCondition(this.diagLeftStarts, 6);

		const winningPatterns = [];
		if(colsWin){
			winningPatterns.push(colsWin); 
		}

		if(rowsWin){
			winningPatterns.push(rowsWin); 
		}

		if(diagsRightWin){
			winningPatterns.push(diagsRightWin); 
		}

		if(diagsLeftWin){
			winningPatterns.push(diagsLeftWin); 
		}

		if (winningPatterns.length > 0) {
			this.gameOver(winningPatterns);
		} else {
			//check tie 
			if(this.occupied >= 42){
				this.gameOver();
			}			
		}

	},
	checkWinCondition(startsArr, skipNum){
		for (let i = 0; i < startsArr.length; i++){

			const index = startsArr[i];
			const maybeWinner = this.board[index].owner;
			const winningPattern = [];

			if (!maybeWinner){
				continue;
			}

			winningPattern.push(index);

			let count = 1;
			let skip = skipNum;

			for (let j = 1; j <= 3; j++){
				if (this.board[index].owner === this.board[index + skip].owner){
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
		let newMsg = "Game Over!"
		if (!pattern) {
			newMsg = newMsg + " " + "The Game is a Tie!";
		} else {
			newMsg = newMsg + " " + "Player " + this.currPlayer + " Wins!";			
		}

		this.message = newMsg;
		this.displayMessage();

		const winningSpaces = [];

		if (pattern) {
			pattern.forEach(subarr => {
				for (let j = 0; j < subarr.length; j++) {
					winningSpaces.push(subarr[j]);
				}
			});
		}

		this.displayEndGame(winningSpaces);
	},
	displayEndGame(winningSpaces){

		this.board.forEach(space => {
			if (space.owner != 0 && !winningSpaces.includes(space.index)){
				document.getElementById(space.id).style.background = this[`player${space.owner}L`];
			}
		})

		const newGameBtn = document.createElement("button");
		newGameBtn.textContent = "Play Again";
		newGameBtn.classList.add("smallBtn");
		newGameBtn.addEventListener("click", ()=>{
			this.newGame()
		})

		const quitBtn = document.createElement("button");
		quitBtn.textContent = "Quit";
		quitBtn.classList.add("smallBtn");
		quitBtn.id = "quit";
		quitBtn.addEventListener("click", ()=>{
			this.quit();
		})

		const btnDiv = document.createElement("div");
		btnDiv.appendChild(newGameBtn);
		btnDiv.appendChild(quitBtn);
		document.getElementById("message-display").appendChild(btnDiv);
	},
	newGame(){
		document.querySelector("#message-display div").remove();
		this.turn = 0; 
		this.currPlayer = 1;
		this.active = true;
		this.message = "";
		this.displayMessage();
		this.init();
	},
	handleInput(divSelected){
		if (!this.active){
			return false;
		}

		if (!this.dropAnimationOn) {
			const column = parseInt(divSelected.dataset.col);
			const validSelection = this.insertSelection(column);

			if (validSelection){
				this.dropAnimationOn = true; 
				this.animation(validSelection.col - 1, validSelection.index);
			} else {
				return false;
			}			
		} 
	},
	insertSelection(column){
		// note: return false to indicate invalid selection 

		const lowestOccupiedIndex = this.board.findIndex(space => space.col == column && space.owner > 0);
		let index; 

		if(lowestOccupiedIndex < 0){
			index = column + 34;
		} else if (lowestOccupiedIndex < 6) {
			return false;
		} else {
			index = lowestOccupiedIndex - 7;
		}

		const selection = this.board[index];
		selection.owner = this.currPlayer;
		this.occupied++;
		return selection;
	},
	finishTurn(){
		this.dropAnimationOn = false; 
		this.renderBoard();
		this.checkWin(); 
		this.changeTurn();
	},
	changeTurn(){
		this.turn++;
		this.currPlayer = (this.turn % 2) || 2;
		// if (this.active) {
		// 	this.message = `Player ${this.currPlayer}`;
		// 	this.displayMessage();
		// }
	},
	animation(currIndex, maxIndex){
		if (currIndex >= maxIndex) {
			this.finishTurn(); 
			return true;
		} else {
			const color = this["player" + this.currPlayer];
			const passingDiv = document.getElementById(this.board[currIndex].id);

			passingDiv.style.background = color;

			setTimeout(()=>{
				passingDiv.style.background = this.emptyColor;
				return this.animation(currIndex + 7, maxIndex);
			}, 20)
		}
	},
	setOverlay(target){
		const column = parseInt(target.dataset.col);
		this.overlay = column;
	},
	clearOverlay(){
		this.overlay = null;
	},
	activateOverlayAnimation(){
		this.overlayAnimationId = window.requestAnimationFrame(renderOverlay);
	},
	deactivateOverlayAnimation(){
		window.cancelAnimationFrame(this.overlayAnimationId);
	},
	handleColorSelectionPlayer1(evt){
		this.player1 = evt.target.value;

		const otherPlayerOpts = document.querySelectorAll("#player-two option");
		otherPlayerOpts.forEach(opt => {
			if (opt.value === evt.target.value) {
				opt.disabled = true;
			} else {
				opt.disabled = false;
			}
		})

		this.checkStartGame();
	},
	handleColorSelectionPlayer2(evt){
		this.player2 = evt.target.value; 

		const otherPlayerOpts = document.querySelectorAll("#player-one option");
		otherPlayerOpts.forEach(opt => {
			if (opt.value === evt.target.value) {
				opt.disabled = true;
			} else {
				opt.disabled = false;
			}
		})

		this.checkStartGame();
	},
	checkStartGame(){
		if (this.player1 && this.player2 && this.player1 !== this.player2) {
			startBtn.disabled = false;
		} else {
			startBtn.disabled = true;
		}
	},
	startGame(){

		// set defaults if choice hasn't been made 
		// or if user somehow got same colors for both fields via hack or mistake: 

		if (!this.player1 || !this.player2 || this.player1 == this.player2) {
			this.player1 = "red";
			this.player2 = "yellow";
		}

		startScreen.style.display = "none";
		gameArea.style.display = "flex";

		this.init();
	},
	translateColorSelections(){
		const p1F = paletteMap[this.player1].fill;
		const p1L = paletteMap[this.player1].light;
		this.player1 = p1F;
		this.player1L = p1L;

		const p2F = paletteMap[this.player2].fill;
		const p2L = paletteMap[this.player2].light;
		this.player2 = p2F;
		this.player2L = p2L;
	},
	quit(){
		location.reload();
	}
}


// cached elements ----- 

const container = document.getElementById("container");
const startScreen = document.getElementById("start-screen");
const startBtn = document.getElementById("start");
const quickStartBtn = document.getElementById("quick-start");
const gameArea = document.getElementById("game-area");
const board = document.getElementById("game-board");
const player1 = document.getElementById("player-one");
const player2 = document.getElementById("player-two");


// start screen init ----- 

colors.forEach(color => {
	const optionP1 = document.createElement("option");
	const optionP2 = document.createElement("option");

	if (!color) {
		optionP1.textContent = "-- Please Select Color --";
		optionP2.textContent = "-- Please Select Color --";

	} else {
		optionP1.textContent = color;
		optionP2.textContent = color;		
	}

	optionP1.value = color;
	optionP1.classList.add("colorChoice");
	optionP1.dataset.player = "one";

	optionP2.value = color;
	optionP2.classList.add("colorChoice");
	optionP2.dataset.player = "two";

	// append: 
	player1.appendChild(optionP1);
	player2.appendChild(optionP2);
})

player1.addEventListener("change", (evt)=>{
	app.handleColorSelectionPlayer1(evt);
});

player2.addEventListener("change", (evt)=>{
	app.handleColorSelectionPlayer2(evt);
});

startBtn.addEventListener("click", ()=>{
	app.startGame();
});

quickStartBtn.addEventListener("click", ()=> {
	app.startGame();
});

// global functions ----- 

function renderOverlay(){

	if(app.active && !app.dropAnimationOn) {

		if(app.overlay) {
			app.renderOverlay();
		} else {
			app.renderBoard();
		}

	}

	window.requestAnimationFrame(renderOverlay)
}

