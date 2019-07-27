console.log("Connect 4")


// classes ----- 

class Board {
	constructor(){
		this.spaces = []; 
		this.colStarts = [];
		this.rowStarts = [];
		this.diagRightStarts = [];
		this.diagLeftStarts = [];
	}
	init(){
		this.reset();
		this.makeStarts();
	}
	reset(){
		this.spaces = [];
		let index = 0; 
		for (let y = 1; y <= 6; y++){
			for (let x = 1; x <= 7; x++) {
				this.spaces.push({
					col: x,
					row: y,
					owner: 0,
					id: `s-${x}-${y}`,
					index: index
				});
				index++;
			}
		}
	}
	makeStarts(){
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
	}
	isFull(){
		return this.spaces.every(space => space.owner != 0); 
	}
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
			return winningPatterns;
		} else {
			return false;
		}
	}
	checkWinCondition(startsArr, skipNum){
		for (let i = 0; i < startsArr.length; i++){

			const index = startsArr[i];
			const maybeWinner = this.spaces[index].owner;
			const winningPattern = [];

			if (!maybeWinner){
				continue;
			}

			winningPattern.push(index);

			let count = 1;
			let skip = skipNum;

			for (let j = 1; j <= 3; j++){
				if (this.spaces[index].owner === this.spaces[index + skip].owner){
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
	}
}


// start object ----- 

const start = {
	options: [
		{
			color: null, 
			value: "",
			text: "-- Please Select Color --",
			fill: null,
			light: null
		},
		{
			color: "red",
			value: "red",
			text: "red",
			fill: "rgba(255, 0, 0, 1)",
			light: "rgba(255, 0, 0, 0.2)"
		},
		{
			color: "orange",
			value: "orange",
			text: "orange",
			fill: "rgba(255, 165, 0, 1)",
			light: "rgba(255, 165, 0, 0.2)"			
		},
		{
			color: "yellow",
			value: "yellow",
			text: "yellow",
			fill: "rgba(255, 255, 0, 1)",
			light: "rgba(255, 255, 0, 0.2)"
		},
		{
			color: "green",
			value: "green",
			text: "green",
			fill: "rgba(0, 128, 0, 1)",
			light: "rgba(0, 128, 0, 0.2)"
		},
		{
			color: "blue",
			value: "blue",
			text: "blue",
			fill: "rgba(0, 0, 205, 1)",
			light: "rgba(0, 0, 205, 0.2)"
		},
		{
			color: "purple",
			value: "purple",
			text: "purple",
			fill: "rgba(128, 0, 128, 1)",
			light: "rgba(128, 0, 128, 0.2)"			
		}
	],
	p1Select: 0,
	p2Select: 0,
	handleColorSelection(selection, pNum){
		this[`p${pNum}Select`] = selection;
		let other = (pNum + 1) % 2 || 2; 
		const otherPlayerOpts = document.querySelectorAll(`#player-${other} option`);
		otherPlayerOpts.forEach((opt) => {
			if (opt.value == selection && selection != 0) {
				opt.disabled = true;
			} else {
				opt.disabled = false;
			}
		})

		if (this.p1Select && this.p2Select && this.p1Select !== this.p2Select) {
			startBtn.disabled = false;
		} else {
			startBtn.disabled = true;
		}
	},
	translateColorSelections(){
		app.player1 = {
			num: 1,
			fill: this.options[this.p1Select].fill,
			light: this.options[this.p1Select].light
		}

		app.player2 = {
			num: 2,
			fill: this.options[this.p2Select].fill,
			light: this.options[this.p2Select].light
		}
	},
	game(){
		if (!this.p1Select || !this.p2Select || this.p1Select == this.p2Select) {
			this.p1Select = 1;
			this.p2Select = 3;
		}
		document.getElementById("start-screen").style.display = "none";
		document.getElementById("game-area").style.display = "flex";

		// transfer color selections to display object: 
		this.translateColorSelections();
		app.init(); 
	}
}


// game logic ----- 

const app = {
	player1: null,
	player2: null,
	turn: 0,
	board: null,
	currPlayer: null,
	active: false,
	firstGame: true,
	init(){
		this.active = true;
		this.board = new Board();
		this.board.init();

		if (this.firstGame) {
			display.printBoard();
			this.activateUI();
			activateOverlayAnimation();
			this.firstGame = false;	
		}

		display.renderBoard();
		this.finishTurn();
	},
	activateUI(){
		const allSpaces = document.querySelectorAll(".space");
		allSpaces.forEach(space => {
			space.addEventListener("click", (evt)=>{
				const divClicked = evt.target;
				this.handleInput(divClicked);
			})
			space.addEventListener("mouseover", (evt)=>{
				const column = evt.target.dataset.col; 
				display.overlay = column; 
			})
			space.addEventListener("mouseout", ()=>{
				display.overlay = null;
			})
		})
	}, 
	handleInput(divSelected){
		if (!this.active){
			return false;
		}

		if (!display.dropAnimationOn) {
			const column = parseInt(divSelected.dataset.col);
			const validSelection = this.insertSelection(column);

			if (validSelection){
				display.dropAnimationOn = true; 
				display.dropAnimation(validSelection.col - 1, validSelection.index);
				// note: when display.dropAnimation finishes, it calls app.finishTurn()
			} else {
				return false;
			}			
		} 
	},
	insertSelection(column){
		// note: return false to indicate invalid selection 

		const lowestOccupiedIndex = this.board.spaces.findIndex(space => space.col == column && space.owner != 0);
		let index; 

		if(lowestOccupiedIndex < 0){
			index = column + 34;
		} else if (lowestOccupiedIndex < 6) {
			return false;
		} else {
			index = lowestOccupiedIndex - 7;
		}

		const selection = this.board.spaces[index];
		selection.owner = this.currPlayer.num;
		return selection;
	},
	finishTurn(){
		display.dropAnimationOn = false; 
		display.renderBoard();

		// check win / tie: 
		const winningPatterns = this.board.checkWin(); 
		if (winningPatterns) {
			this.gameOver(winningPatterns);
			return;
		}

		if (this.board.isFull()){
			this.gameOver(null);
			return;
		}

		this.turn++;
		const playerNumber = (this.turn % 2) || 2;
		this.currPlayer = this[`player${playerNumber}`];
	},
	gameOver(pattern){
		this.active = false;
		let newMsg = "Game Over!"
		if (!pattern) {
			newMsg = newMsg + " " + "The Game is a Tie!";
		} else {
			newMsg = newMsg + " " + "Player " + this.currPlayer.num + " Wins!";			
		}

		display.message = newMsg;
		display.printMessage();

		const winningSpaces = [];

		if (pattern) {
			pattern.forEach(subarr => {
				for (let j = 0; j < subarr.length; j++) {
					winningSpaces.push(subarr[j]);
				}
			});
		}

		display.endGamePattern(winningSpaces);
	},
	newGame(){
		document.querySelector("#message-display div").remove();
		this.turn = 0; 
		this.currPlayer = this.player1;
		this.active = true;
		display.message = "";
		display.printMessage();
		this.init();
	}
}


const display = {
	emptyFill: "white",
	message: "",
	overlay: null,
	overlayAnimationId: null,
	dropAnimationOn: false,
	printBoard(){
		let index = 0; 
		const gameBoardDisplay = document.getElementById("game-board");
		
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

			gameBoardDisplay.appendChild(newRow);
		}
	},
	renderBoard(){
		app.board.spaces.forEach(space => {
			let fillColor = this.emptyFill;

			if (space.owner == 1) {
				fillColor = app.player1.fill;
			} 
			if (space.owner == 2) {
				fillColor = app.player2.fill;
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
	renderOverlay(){
		const spacesToShade = app.board.spaces.filter(space => space.owner == 0 && space.col == this.overlay) 

		spacesToShade.forEach(space => {
			document.getElementById(space.id).style.background = app.currPlayer.light;
		})

		const lastSpace = spacesToShade[spacesToShade.length - 1];

		if (lastSpace) {
			const lastSpaceDiv = document.getElementById(spacesToShade[spacesToShade.length - 1].id);
			lastSpaceDiv.style.border = "3px solid slategray";
		}
	},
	dropAnimation(currIndex, maxIndex){
		if (currIndex >= maxIndex) {
			app.finishTurn(); 
			return true;
		} else {
			const color = app.currPlayer.fill;
			const passingDiv = document.getElementById(app.board.spaces[currIndex].id);

			passingDiv.style.background = color;

			setTimeout(()=>{
				passingDiv.style.background = this.emptyFill;
				return this.dropAnimation(currIndex + 7, maxIndex);
			}, 20)
		}
	},
	printMessage(){
		const messageElement = document.getElementById("message") 
		messageElement.textContent = this.message;
		if (app.active) {
			messageElement.style.color = app.currPlayer.fill; 
		} else {
			messageElement.style.color = "black";
		}
	},
	endGamePattern(winningSpaces){

		app.board.spaces.forEach(space => {
			if (space.owner != 0 && !winningSpaces.includes(space.index)){
				document.getElementById(space.id).style.background = app[`player${space.owner}`].light;
			}
		})

		const newGameBtn = document.createElement("button");
		newGameBtn.textContent = "Play Again";
		newGameBtn.classList.add("smallBtn");
		newGameBtn.addEventListener("click", ()=>{
			app.newGame()
		})

		const quitBtn = document.createElement("button");
		quitBtn.textContent = "Quit";
		quitBtn.classList.add("smallBtn");
		quitBtn.id = "quit";
		quitBtn.addEventListener("click", ()=>{
			location.reload();
		})

		const btnDiv = document.createElement("div");
		btnDiv.appendChild(newGameBtn);
		btnDiv.appendChild(quitBtn);
		document.getElementById("message-display").appendChild(btnDiv);
	}
}


// cached elements ----- 

const startBtn = document.getElementById("start");
const quickStartBtn = document.getElementById("quick-start");
const playerOneDropdown = document.getElementById("player-1");
const playerTwoDropdown = document.getElementById("player-2");


// global functions ----- 

function animateOverlay(){
	if(app.active && !display.dropAnimationOn) {
		if(display.overlay) {
			display.renderOverlay();
		} else {
			display.renderBoard();
		}
	}

	window.requestAnimationFrame(animateOverlay)
}

function activateOverlayAnimation(){
	display.overlayAnimationId = window.requestAnimationFrame(animateOverlay);
}

function deactivateOverlayAnimation(){
	window.cancelAnimationFrame(display.overlayAnimationId);
}


// add initial event listeners -----  

playerOneDropdown.addEventListener("change", (evt)=>{
	start.handleColorSelection(parseInt(evt.target.value), 1);
})

playerTwoDropdown.addEventListener("change", (evt)=>{
	start.handleColorSelection(parseInt(evt.target.value), 2);
})	

startBtn.addEventListener("click", ()=>{
	start.game();
})

quickStartBtn.addEventListener("click", ()=> {
	start.game();
})	


// wind it up... and let it run: 

start.options.forEach((opt, i) => {
	const optionP1 = document.createElement("option");
	const optionP2 = document.createElement("option");

	optionP1.value = i;
	optionP1.textContent = opt.text;
	optionP1.dataset.player = "one";

	optionP2.value = i;
	optionP2.text = opt.text;
	optionP2.dataset.player = "two";

	playerOneDropdown.appendChild(optionP1);
	playerTwoDropdown.appendChild(optionP2);
})