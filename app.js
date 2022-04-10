let app = {
    timer: document.querySelector("#timer"),
    lastTime: document.querySelector(".last-time"),
    list: "https://picsum.photos/v2/list?page=2&limit=8",
    especific: "https://picsum.photos/id/",
    board: document.querySelector(".board"),
    deck: [],
    contador: 0, 
    totalTime: 0, 
    gameStatus: 'loss',
    win: document.querySelector('.win'),
    boardContainer: document.querySelector('.board-container'),
    gameStatus: false,
    loop: null,
    restart: document.querySelector('#restart'),
    bestTime: localStorage.getItem('totalTime'),

    getList: function () {
        return new Promise((resolve) => {
            fetch(this.list)
                .then((res) => res.json())
                .then((res) => {
                    resolve(res.flatMap((i) => [i, i]));
                });
        })
    },
    seDeck: async function () {
        await this.getList().then((res) => { this.deck = [...res] });
    },
    unSortDeck: function () {
        return this.deck.sort(() => Math.random() - 0.5);
    },
    creatBoard(deck) {
        deck.forEach(card => {
            let imgCard = document.createElement("img");
            imgCard.src = this.especific + card.id + "/100" + "/100";
            this.board.innerHTML += `
            <div class="card">
            <img class="card-face card-front" src="${imgCard.src}">
            <img class=" card-face card-back" src="bk2.png">
        </div>`
        });
    },
    generateGame: async function () {
        this.lastTime.innerHTML = `O Melhor Tempo: ${this.bestTime} sec`
        await this.seDeck();
        this.creatBoard(this.deck);
    },
    unsortBoard: function () {
        this.board.replaceChildren();
        this.unSortDeck();
        this.creatBoard(this.deck);
    },
    turnAllcards: function () {
        cards = document.querySelectorAll('.card'),
            setTimeout(() => {
                cards.forEach(card => card.classList.toggle('is-flipped'))
                this.gameStatus = true;
            }, 3000);
    },
    cardAction: function (e) {
        let pair = [];
        if (this.gameStatus) {
            e.classList.toggle('is-flipped');
            let flipped = document.querySelectorAll('.card:not(.is-flipped):not(.pair)');
            flipped.forEach(flipped => pair.push(flipped));
            if (pair.length === 2) {
                this.gameStatus = false;
            }
            let flag = this.compair(pair)
            setTimeout(() => {
                if (flag === false) {
                    flipped.forEach(vira => vira.classList.toggle('is-flipped'));
                    this.gameStatus = true;
                } if (flag === true) {
                    flipped.forEach(vira => vira.classList.toggle('pair'));
                    this.gameStatus = true;
                }
            }, 1500)
        }
    },
    compair: function (pair) {
        if (pair.length === 2) {
            if (pair[0].innerHTML === pair[1].innerHTML) {
                ++this.contador
                return true;
            } else {
                return false;
            }
        }
    },
    endGame: function () {
        setTimeout(() => {
            clearInterval(this.loop)
            if (this.bestTime > this.totalTime) {
                localStorage.setItem('totalTime', this.totalTime);
            }
            this.board.style.display = 'none'
            this.win.style.display = 'block'
            document.querySelector('.win-time').innerHTML = this.totalTime
        }, 1000)
        this.restart.style.display = 'block'
        this.restart.onclick = () => { document.location.reload(true) }
    },
    start: function () {
        this.unsortBoard()
        this.turnAllcards();
        this.board.addEventListener('click', (e) => {
            this.cardAction(e.target.parentElement);
            if (this.contador === 8) {
                this.endGame();
            }
        })
        this.loop = setInterval(() => {
            this.totalTime++
            this.timer.innerText = `Tempo atual: ${this.totalTime} sec`
        }, 1000)
    }
};
(() => {
    app.generateGame();
    let btn = document.querySelector("#start");
    btn.onclick = () => {
        btn.style.display = 'none'
        app.start();
    };
})();

