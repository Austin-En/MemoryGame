let cards = document.querySelectorAll("div.card");// This const variable grabs all of the div cards in the html page to know how many cards are in play
const buttons = document.querySelectorAll("button.d-button");// Contains all of the buttons on the website that choose the difficulty
const frameworkArray = [];//keeps all framework options in an const array, this is something that should never change
let chosenFrameworkArray = [];//this keeps all select s

let hasFlippedCard = false;// If the card has already been flipped 
let matchedCards = 0;// Keeps track of the number of matched cards the user has completed during their current game
let lockBoard = false;// Allows the code to know when the board is locked
let firstCard, secondCard;// Track the first and second card the customer has flipped to check if its a pair
let resultText = document.querySelector("h2");//This is the text that is shown on the html page thats purpose is for display the results of the users turn
let timerText = document.querySelector("h3");// Text for the timer shown to the user during gameplay
let moveText = document.querySelector("h4");// Display the amount of moves based on the variable moveCount
let matchText = document.querySelector("h5");
let moveCount = 0;// Running total number of moves the user has made during the gameplay
let difficulty;// this keeps what difficulty is being played/chosen by the user
let totalCards = cards.length;// the total cards in play right now 
let removeSet;// This is used to keep what number of set of cards should be 
let matches = 0;// running total to show the players how many matches were done, not the amount of cards matched but the matches completed 



/*
startTimer is the function that keeps the running timer during the whole remainder of the game until the timer runs out to end the game or all matches have been
completed by the user.

this function also has correct usage to ensure gameplay is suspend onces not in active

*/
function startTimer(duration) {
    var timer = duration, minutes, seconds;
    timerText.style.display = "block";
    moveText.style.display = "block";
    matchText.style.display = "block";
    lockBoard = false;
    resultText.innerHTML = "Match the Item Card!";
    matchText.innerHTML = "Matches: " + matches;
    moveText.innerHTML = "Moves: " + moveCount;
    var runningTimer = setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        timerText.textContent = "Timer: " + minutes + ":" + seconds;
        if (--timer < 0) {
            unFlipCards();
            resultText.textContent = "Game Over";
            setTimeout(function() {
                cards.forEach(card => card.classList.add('flip'));
                setTimeout(function() {
                    cards.forEach(card => card.classList.remove('flip'));
                    buttons.forEach(button => button.addEventListener('click', gameStart));
                    buttons.forEach(button => button.style.display = "block");
                },2500); 
            },2500); 

            clearInterval(runningTimer);
        }
        else if(matchedCards === totalCards){
            setTimeout(function() {
                cards.forEach(card => card.classList.remove('flip'));
                buttons.forEach(button => button.addEventListener('click', gameStart));
                buttons.forEach(button => button.style.display = "block");
            },2500); 
            clearInterval(runningTimer);
        }
    }, 1000);
}

/*
gameStart has the functionality of getting the user to start playing the game like showing the element of the game and hidding the selection buttons from the 
start.

based on the user chosen start difficulty, a timer is selected to match it 

*/
function gameStart() {
    difficulty = this.textContent;
    moveCount = 0;
    matchedCards = 0;
    matches = 0;
    var currentTime = 60 * 1;
    buttons.forEach(button => button.removeEventListener('click', gameStart));
    buttons.forEach(button => button.style.display = "none");
    resultText.style.display = "block";
    shuffle();
    // The grabs the previously mentioned cards we got from the divs from the html page and add the eventListener to ensure when the user clicks its triggered
    cards.forEach(card => card.addEventListener('click', flipCard));
    cards.forEach(card => card.hidden = false);
    cards.forEach(card => {
        chosenFrameworkArray.forEach(framework => {
            if(card.dataset.framework === framework){
                 card.hidden = true;
            }
        });
    });
    if(difficulty === "Medium"){
        currentTime = 60 * 2
    }
    else if(difficulty === "Easy"){
        currentTime = 60 * 3
    }
    startTimer(currentTime);
};

/*
setFrameworkArray function is to grab all available frameworks available in the game, purpose is for later use to figure out which one should be in play

*/
function setFrameworkArray(){
    let cardId = 0;
    let arrayId = 0;
    cards.forEach(card => {
        if(cardId % 2 == 0){
           frameworkArray[arrayId] = card.dataset.framework;
           arrayId += 1;
        }
        cardId += 1;
    });
}

/*
FlipCard is the bread and butter of the game that allows the user to trigger the flip event for everycard that is played.

during the run of the code it also has coverage to ensure that a card that is already flipped to not be flipped again.
*/
function flipCard() {
    if (lockBoard) return; 
    if(this === firstCard) return;// User shouldn't be able to flip the first card they already flipped

    this.classList.add('flip');// Works with the current div that was flipped, the code understands this because it knows what card event was triggered by user click

    if(!hasFlippedCard){
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    
    checkForMatch();
}

/*
checkForMatch checks the framework of the currently flipped cards to see if they match

function also has functionality to display the results to the user through changing the html text.
*/
function checkForMatch(){
    moveCount += 1;
    moveText.textContent = "Moves: " + moveCount;
    if(firstCard.dataset.framework === secondCard.dataset.framework){
        disableCards();
        matchedCards += 2;
        matches += 1;
        matchText.innerHTML = "Matches: " + matches;
        result();
        return;
    }
    resultText.innerHTML = "Your Move Missed!"
    unFlipCards();
}

/*
disableCards ensures that once a match is completed they are taken to this function to remove the eventListener so the user can not longer select the
previously flipped cards
*/
function disableCards(){
    firstCard.removeEventListener('click', flipCard)
    secondCard.removeEventListener('click', flipCard)
    resetBoard();
}

/*
unFlipCards uses the lockBoard variable, this is used to stop the play of the game while it displays the results of the two flipped cards the user chose

during this time they unFlip the two chosen cards as a match hasnt been made.
*/
function unFlipCards(){
    lockBoard = true;

    setTimeout(() => {  
        if(firstCard != null && firstCard != undefined){
            firstCard.classList.remove('flip');
        }
        if(secondCard != null && secondCard != undefined){
            secondCard.classList.remove('flip');
            resetBoard();
        }
        
    }, 1500);
}

/*
resetBoard cleans up the variables to reset to a fresh playable state for the users next turn (unlocking the board, forgetting the previously flipped cards etc)

*/
function resetBoard(){
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
    resultText.innerHTML = "Match the Item Card!";
}

/*
shuffle is the most important function for the replayability of the card game as this shuffle the cards in play to ensure everytime you play 
the cards are placed in a different order

also has the added function of getting what cards will be in play depending on the difficulty chosen by the user

*/
function shuffle(){ 
    chosenFrameworkArray = [];
    if(difficulty == "Easy"){
        totalCards = cards.length * 0.50 + 2;
        removeSet = frameworkArray.length * 0.50 + 1;
        chooseFramework();
    }
    else if(difficulty == "Medium"){
        totalCards = cards.length * 0.75 + 1;
        removeSet = frameworkArray.length * 0.75;
        chooseFramework();
    }
    else{
        removeSet = frameworkArray.length;
        chosenFrameworkArray = [];
    }
    
    cards.forEach(card => {
        let randomPostion = Math.floor(Math.random() * cards.length);
        card.style.order = randomPostion;
    });
  
}

/*
chooseFramework is the previously mentioned function that allows the game to select a random pair images to be played in the current game, this is important to

keep the game interesting for the user to play so its not the same images each time.
*/
function chooseFramework (){
    let dup = false;
    for (let i = 0; i <= (frameworkArray.length - removeSet) - 1; i++) {
        let randomPostion = Math.floor(Math.random() * frameworkArray.length);
        chosenFrameworkArray.forEach(type => {
            if(type == frameworkArray[randomPostion]){
                dup = true;
                i -= 1;
            }
        })
            if(!dup){
              chosenFrameworkArray[i] = frameworkArray[randomPostion];
            }   
            else {
                dup = false;
            }  
    }
}

/*
result is just a simple function with an if statement that determines what result text should be displayed to the user

*/
function result (){
    if(matchedCards === totalCards){
        resultText.innerHTML = "Pokémon League Champion!"
    }
    else{
        resultText.innerHTML = "Thats a Match!"
    }

    if(!matchedCards === totalCards){
    setTimeout(() => {      
        resultText.innerHTML = "Match the Item Card!";
    }, 1500);
    }
}

/*
onLoad general function that gets the page ready for user play by hiding elements of the page that should be shown yet and setups on the button for difficulty

*/
window.onload = function () {
    lockBoard = true;
    resultText.style.display = "none";
    timerText.style.display = "none";
    moveText.style.display = "none";
    matchText.style.display = "none";
    cards.forEach(card => card.hidden = true);
    const buttons = document.querySelectorAll("button.d-button");
    buttons.forEach(button => button.addEventListener('click', gameStart));
    setFrameworkArray();
 };
 