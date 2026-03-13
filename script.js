
        const board = document.getElementById("board");
        const movesText = document.getElementById("moves");
        const timerText = document.getElementById("timer");
        const matchesText = document.getElementById("matches");
        const popup = document.getElementById("popup");
        const message = document.getElementById("message");
        const pauseBtn = document.getElementById("pauseBtn");
        const restartBtn = document.getElementById("restartBtn");
        const closePopup = document.getElementById("closePopup");
        const popupMoves = document.getElementById("popupMoves");
        const popupTime = document.getElementById("popupTime");

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
        let time = 80;
        let timer = null;
        let paused = false;
        let gameStarted = false;

        function startGame() {
            board.innerHTML = "";
            moves = 0;
            matches = 0;
            time = 80;
            paused = false;
            gameStarted = true;
            firstCard = null;
            secondCard = null;
            lockBoard = false;

            movesText.textContent = moves;
            timerText.textContent = time;
            matchesText.textContent = `0/${emojis.length}`;
            pauseBtn.textContent = "Pause";

            let shuffled = [...cards];
            shuffle(shuffled);

            shuffled.forEach(emoji => {
                const card = document.createElement("div");
                card.className = "card";
                card.dataset.value = emoji;

                card.innerHTML = `
                    <div class="card-inner">
                        <div class="front"></div>
                        <div class="back">${emoji}</div>
                    </div>
                `;

                card.addEventListener("click", function() {
                    flipCard.call(this);
                });

                board.appendChild(card);
            });

            startTimer();
        }

        function flipCard() {
            if (paused || lockBoard || !gameStarted) return;
            if (this.classList.contains("flip")) return;

            this.classList.add("flip");

            if (!firstCard) {
                firstCard = this;
                return;
            }

            secondCard = this;
            lockBoard = true;
            moves++;
            movesText.textContent = moves;

            if (firstCard.dataset.value === secondCard.dataset.value) {
                firstCard.classList.add("match");
                secondCard.classList.add("match");
                matches++;
                matchesText.textContent = `${matches}/${emojis.length}`;

                if (matches === emojis.length) {
                    clearInterval(timer);
                    gameStarted = false;
                    showPopup("🎉 You Win!", "win");
                } else {
                    resetBoard();
                }
            } else {
                setTimeout(() => {
                    firstCard.classList.remove("flip");
                    secondCard.classList.remove("flip");
                    resetBoard();
                }, 700);
            }
        }

        function resetBoard() {
            firstCard = null;
            secondCard = null;
            lockBoard = false;
        }

        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        function startTimer() {
            clearInterval(timer);
            timer = setInterval(() => {
                if (!paused && gameStarted) {
                    time--;
                    timerText.textContent = time;

                    if (time <= 0) {
                        clearInterval(timer);
                        gameStarted = false;
                        showPopup("⏰ Time Up! You Lost!", "lose");
                        lockBoard = true;
                    }
                }
            }, 1000);
        }

        function showPopup(msg, className) {
            message.textContent = msg;
            message.className = className;
            popupMoves.textContent = moves;
            popupTime.textContent = time;
            popup.classList.add("show");
        }

        function hidePopup() {
            popup.classList.remove("show");
            startGame();
        }

        pauseBtn.addEventListener("click", () => {
            if (!gameStarted) return;
            paused = !paused;
            pauseBtn.textContent = paused ? "Resume" : "Pause";
        });

        restartBtn.addEventListener("click", () => {
            startGame();
        });

        closePopup.addEventListener("click", () => {
            hidePopup();
        });

        startGame();
