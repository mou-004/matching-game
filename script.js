const board = document.getElementById("board");
const movesText = document.getElementById("moves");
const timerText = document.getElementById("timer");
const popup = document.getElementById("popup");
const message = document.getElementById("message");
const pauseBtn = document.getElementById("pauseBtn");

const emojis = [
"🍎","🍌","🍇","🍉","🍒","🥝",
"🍍","🍑","🍋","🍓","🥥","🍈"
];

let cards = [...emojis, ...emojis];

let firstCard = null;
let secondCard = null;
let lockBoard = false;

let moves = 0;
let matches = 0;

let time = 60;
let timer;
let paused = false;

function startGame(){

board.innerHTML = "";

cards.sort(()=>0.5 - Math.random());

cards.forEach(emoji => {

const card = document.createElement("div");
card.classList.add("card");

card.innerHTML = `
<div class="card-inner">
<div class="front"></div>
<div class="back">${emoji}</div>
</div>
`;

card.dataset.value = emoji;

card.addEventListener("click", flipCard);

board.appendChild(card);

});

startTimer();
}

function flipCard(){

  if(paused) return;
  if(lockBoard) return;
  if(popup.classList.contains("show")) return;
  if(this.classList.contains("match")) return;
  if(this === firstCard) return;

  this.classList.add("flip");

  if(!firstCard){
    firstCard = this;
    return;
  }

  secondCard = this;

  lockBoard = true;

  moves++;
  movesText.textContent = moves;

  checkMatch();
}

function checkMatch(){

if(firstCard.dataset.value === secondCard.dataset.value){

firstCard.classList.add("match");
secondCard.classList.add("match");

matches++;

resetTurn();

if(matches === 12){
clearInterval(timer);
message.textContent = "🎉 You Win!";
message.className = "win";
popup.classList.add("show");
}

}else{

setTimeout(()=>{

firstCard.classList.remove("flip");
secondCard.classList.remove("flip");

resetTurn();

},800)

}

}

function resetTurn(){
firstCard = null;
secondCard = null;
lockBoard = false;
}

function startTimer(){

timer = setInterval(()=>{

if(!paused){
time--;
timerText.textContent = time;
}

if(time === 0){

clearInterval(timer);

message.textContent = "⏰ Time Up! You Lost!";
message.className = "lose";

popup.classList.add("show");

lockBoard = true;

}

},1000)

}

pauseBtn.addEventListener("click",()=>{

paused = !paused;

pauseBtn.textContent = paused ? "Resume" : "Pause";

});

function restartGame(){
location.reload();
}

startGame();
