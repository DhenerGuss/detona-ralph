const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        enemy: document.querySelector(".enemy"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        lives: document.querySelector("#lives"),
    },
    values: {
        gameVelocity: 1000,
        hitPosition: 0,
        result: 0,
        currentTime: 60,
        gameLives: 4,
    },
    action: {
        timerId: setInterval(randomSquare, 1000),
        countDownTimerId: setInterval(countDown, 1000),
    },
};

function countDown(){
    state.values.currentTime--;
    state.view.timeLeft.textContent = state.values.currentTime;

    if (state.values.currentTime <= 0){
        clearInterval(state.action.countDownTimerId);
        clearInterval(state.action.timerId);
        alert("Seu tempo acabou! O seu score foi de: " + state.values.result + "!" + "E você ficou com " + state.values.gameLives + " Vidas!");
        resetGame();
    }
}

function playSound(audioName){
    let audio = new Audio(`./src/audios/${audioName}.m4a`);
    audio.volume = 0.2;
    audio.play();
}

function lostLive(){
    // VERIFICA SE ESTÁ COM 0 VIDAS
    if (state.values.gameLives <= 0){
        return;
    }   
    // VERIFICA SE ERROU O CLIQUE
    if (state.values.hitPosition !== randomSquare.id){
        state.values.gameLives--;
        playSound("fail");
        } 
    // ATUALIZA A TELA DEPOIS QUE PERDEU VIDA
    state.view.lives.textContent = state.values.gameLives; 
    // SE CHEGOU A 0 VIDAS FINALIZA O JOGO
    if (state.values.gameLives === 0){
        playSound("over");
        alert("GAME OVER! Seu Score foi de: " + state.values.result);
        resetGame();
    }
    }

    function resetGame() {
    // Zera os valores
    state.values.currentTime = 60;
    state.values.result = 0;
    state.values.gameLives = 4;

    // Atualiza interface
    state.view.timeLeft.textContent = state.values.currentTime;
    state.view.score.textContent = state.values.result;
    state.view.lives.textContent = state.values.gameLives;

    // Limpa inimigos
    state.view.squares.forEach((square) => square.classList.remove("enemy"));

    // Reinicia timers
    clearInterval(state.action.timerId);
    clearInterval(state.action.countDownTimerId);
    state.action.countDownTimerId = setInterval(countDown, 1000);
}

    
function randomSquare(){
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    });
let randomNumber = Math.floor(Math.random() * 9);
let randomSquare = state.view.squares[randomNumber];
randomSquare.classList.add("enemy");
state.values.hitPosition = randomSquare.id;
}

function moveEnemy(){
    state.values.timerId = setInterval(randomSquare, state.values.gameVelocity);
}

function addListenerHitBox(){
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", () => {
           if(square.id === state.values.hitPosition){
            state.values.result++;
            state.view.score.textContent = state.values.result;
            state.values.hitPosition = null;
            playSound("hit");
           } else {
            lostLive();
           }
        });
    });
}

function initialize(){
    moveEnemy();
    addListenerHitBox();
}


initialize();