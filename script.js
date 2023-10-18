//Setup for text selectors, and resetBTN event listener.
let gridContainer= document.querySelector(".gridContainer")
let playerText = document.querySelector(".mainText")
let resetButton = document.querySelector(".resetButton").addEventListener("click",()=> reset());

let gameBoard = ["","","","","","","","",""]
let gameEnded = false;

//Factory Function to create players.
function createPlayer(name,token){
    return{
        name: name,
        token: token,
        tokenIndex: []
    }
}

//Player Creation.
const player1 = createPlayer("Player 1","X")
const player2 = createPlayer("Player 2","O")

let currentPlayer = player1

//Arrays within an array that contain every winning combination.
const winCondition = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], //filas
    [0, 3, 6], [1, 4, 7], [2, 5, 8], //columnas
    [0, 4, 8], [2, 4, 6]             //diagonales
];

//Main render section, could easily be shorten if DOM elements were there from the start, instead of created since the beginning and overwritten every time.
let renderScreen = function(){
    gridContainer.innerHTML = "";
    for (i=0; i<gameBoard.length;i++){
        gridElement = document.createElement("div")
        gridElement.classList.add("gridElement")
        gridElement.setAttribute("index",i)
        gridElement.innerHTML=`${gameBoard[i]}`      
        gridContainer.append(gridElement)
    }
    //Checks each loop for "gameEnded" flag, if true=game has already ended and we have a winner, so no need to re-add the eventlistener so no one can keep playing.
    if(!gameEnded){
    playerText.innerHTML = `${currentPlayer.name}'s (${currentPlayer.token}) Turn`
    document.querySelectorAll(".gridElement").forEach(item=>{
        item.addEventListener("click",(e)=>cellClick(e))})
    }
    
}

let checkWin = function(){
    //Compares they player's individual array with they many arrays inside "WinCondition", if it finds that a players array contains any combination inside the wincon arrays,
    //it will end the game and display a message, otherwise, if the board is full and nobody won ever, display a "Draw" Message.
    const isSubset = (winCondition, tokenIndex) =>{
        return winCondition.some(winArray => {
            return winArray.every((element) => tokenIndex.includes(element));
        });
    };
    
    if (isSubset(winCondition,currentPlayer.tokenIndex) == true){
        gameEnded = true;
        playerText.innerHTML = `${currentPlayer.name} Wins!`
        return
    }

    if (!gameBoard.includes("")){
        gameEnded = true
        playerText.innerHTML = "It's a Draw!"
        return
    }

}

//Handles every click on a square, where it gets the "index" attribute from each cell, parses it into an int and fills the main "gameboard" array with current player's token
//in the array's position equal to the int we got.
let cellClick = function(e){
    const cellIndex = parseInt(e.target.getAttribute('index'));
    //If space has already been taken, just return to render screen so they cant be overwritten.
    if (gameBoard[cellIndex] == ""){
    gameBoard[cellIndex] = currentPlayer.token
    currentPlayer.tokenIndex.push(cellIndex)
    //Checks if win conditions have been met, before switching players.
    checkWin()
    //Switches players 
    currentPlayer = currentPlayer === player1 ? player2 : player1
    }
    else{
        return
    }
    renderScreen()
}

//Sets every variable, array and message to their default state.
let reset = function(){
    gameEnded = false;
    gameDraw = false;
    currentPlayer = player1
    player1.tokenIndex = []
    player2.tokenIndex = []
    playerText.innerHTML = `${currentPlayer.name}'s (${currentPlayer.token}) Turn`
    gameBoard = ["","","","","","","","",""]
    renderScreen()
}

renderScreen();

