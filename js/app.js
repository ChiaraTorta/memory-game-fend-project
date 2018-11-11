/*
 * TODO from  https://review.udacity.com/#!/rubrics/591/view :
 */

/*
 * Game variables:
 */

const fragment = document.createDocumentFragment();
const deck = document.querySelector('.deck');
let openedCards = [];
let matchedCards = [];
let counter = 0;
let clicks = 0;
let card1, card2;
const repeatBtn = document.querySelector('.restart');
const playAgainBtn = document.querySelector('.w3-button');
const congratDlg = document.querySelector('#modalDlg.w3-modal');
let startTime;
let endTime;
let timerInterval;
let timerCounter = 0;
let timerMin = 0;
let sec;
let starRating;


 let cards = ["fa fa-diamond", "fa fa-paper-plane", "fa fa-anchor", "fa fa-bolt",
"fa fa-cube", "fa fa-leaf", "fa fa-bicycle", "fa fa-bomb","fa fa-diamond", "fa fa-paper-plane",
"fa fa-anchor", "fa fa-bolt", "fa fa-cube", "fa fa-leaf", "fa fa-bicycle", "fa fa-bomb"];

/*
 * Shuffle cards
 */

// shuffle cards when game page starts and hide modal dialog
let shuffledCards = shuffle(cards);
congratDlg.style.display="none";

/*
 * Create new template
 */ 
 
// loop through each card and create its HTML, add each card's HTML to the page
newTemplate();

// delete previous children
deck.innerHTML = "";

// create new game deck
deck.appendChild(fragment);
 
/*
 * Game 
 */ 
 
//reset the counter
document.querySelector('.moves').innerText = 0;

// if the user is not clicking the deck and the card is not already open or matched open the card

deck.addEventListener('click', function(event) {
	if (event.target.className !== "deck" && event.target.classList.contains('open') === false && event.target.classList.contains('match') === false){ 
		clicks++;
		displaySymbol(event);
		openCard(event);
		if (clicks === 1) {
			timerInterval = setInterval('startTimer()', 1000);
         }
		if (openedCards.length === 2){
			//if the cards do match openedCards in the open position and empty openedCards...
			if (openedCards[0].className === openedCards[1].className){
				// ...lock cards
				lockCards(openedCards[0],openedCards[1]);
			}
			//if the cards do not match, remove them from the list and hide the card's symbol 
			else {	
				hideCards();
			}
			// increment the move counter	
			incrementCounter();
		}
		// if all cards match open dialog
		setRating(counter);
		if (matchedCards.length === 8){
			openCongratulations();
		}
	}
},false)

/*
 * Reset Button
 */
 
repeatBtn.addEventListener('click', resetGame)
		
/*
 * Play Again Button
 */	
 
playAgainBtn.addEventListener('click', function(){
	closeCongratulations()
})
	
/*
 * Functions
 */ 
 
 
// Shuffle function from http://stackoverflow.com/a/2450976 already provided by Udacity
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function newTemplate(){
	for (const card of shuffledCards) {
		const newHTMLElement = document.createElement("li");
		newHTMLElement.className = 'card';
		newHTMLElement.innerHTML = '<i class="' + card + '"></i>';
		fragment.appendChild(newHTMLElement);
	}
}
function setRating(counter){
	starRating = 3;
	if (counter > 13 && counter <= 19) {
		document.querySelector('.stars').children[2].firstChild.className = 'fa fa-star-o';
		starRating = 2;
	}else if (counter > 19 && counter < 25) {
		document.querySelector('.stars').children[1].firstChild.className = 'fa fa-star-o';
		starRating = 1;
	}else if (counter > 25) {
		document.querySelector('.stars').children[0].firstChild.className = 'fa fa-star-o';
		starRating = 0;
	}	
}

function startTimer() {
	timerCounter++
	sec = timerCounter;
	if (timerCounter === 60) {
		timerMin++;
		sec = 0;
		timerCounter = 0;
	}
	document.querySelector('.time').innerHTML = addZero(timerMin) + ':' + addZero(sec);
}

function stopTimer() {
	clearInterval(timerInterval);
	timerMin = 0;
	clicks = 0;
	timerCounter = 0;
}
    
function addZero(number) {
	if (number < 10) {
		return '0' + number;
	} else {
		return number;
	}   
}

function displaySymbol(event) {
	event.target.classList.add('open','show');
}

function openCard(event){
	openedCards.push(event.target.firstElementChild);
}

function lockCards(card1,card2){
	card1.parentNode.className = 'card show match';
	card2.parentNode.className = 'card show match';					
	matchedCards.push(card1.className);
	openedCards.shift();
	openedCards.shift();
}

function hideCards(){
	setTimeout(function () {
		for (let i = 0; i<2; i++){
			document.querySelector('.open').classList.remove('open', 'show');
				openedCards.shift();
				openedCards.shift();
		}
	}, 200);
}

function incrementCounter() {
	counter++;
	document.querySelector('.moves').innerText = counter;	
}
	
function resetGame(){
	document.querySelector('.moves').innerText = 0;
	counter = 0;
	if(document.querySelector('.match')) {
		for (let i = 0; i<matchedCards.length*2; i++){
		document.querySelector('.match').classList.remove('match', 'show');
		}}
	if (document.querySelector('.open')) {
		document.querySelector('.open').classList.remove('open', 'show');
	}
	openedCards = [];
	matchedCards = [];
	shuffle(cards);
	newTemplate();
	deck.innerHTML = "";
	deck.appendChild(fragment);
	stopTimer();
	document.querySelector('.time').innerHTML = '00:00';
	for (let i = 0; i < 3 ; i++){
		document.querySelector('.stars').children[i].firstChild.className = 'fa fa-star';
	}
}

function closeCongratulations () {
	congratDlg.style.display="none";
	congratDlg.classList.remove('open')
	resetGame();
}

function openCongratulations () {
	stopTimer();
	congratDlg.style.display="block";
	congratDlg.classList.add('open');
	document.querySelector('.totMoves').innerHTML = "Your number of moves: " + counter 
	document.querySelector('.starsRating').innerHTML = "You have still: " + starRating + " stars" 
	document.querySelector('.endTime').innerHTML = "Your time: " + addZero(timerMin) + ':' + addZero(sec);
}