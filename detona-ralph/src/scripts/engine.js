const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        enemy: document.querySelector(".enemy"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        lives: document.querySelector("#lives"),
        level: document.querySelector("#levels"),
        start: document.querySelector("#start-game"),
    },
    values: {
        gameVelocity: 1000,
        hitPosition: 0,
        result: 0,
        currentTime: 60,
        gameLives: 3,
    },
    action: {
        timerId: null,
        countDownTimerId: null,
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

//AJUSTES DAS DIFICULDADES
function setDificulty(level){
    switch(level){
        case "Fácil":
            state.values.gameVelocity = 1200;
            break;
        
        case "Médio":
            state.values.gameVelocity = 800;
            break;
        
        case "Difícil":
            state.values.gameVelocity = 500;
            break;
        default:
            state.values.gameVelocity = 1000;
            break;    
    }
}
// CRIA O EVENTO DE CLIQUE PARA INICIAR O JOGO AO SELECIONAR A DIFICULDADE E CLICAR EM INICIAR JOGO
state.view.start.addEventListener("click", () => {
    const level = document.querySelector("#difficulty").value;

    //MENSAGEM CASO NÃO SELECIONE UM NÍVEL VALIDO
    if (!level) {
    alert("Por favor, selecione uma dificuldade antes de iniciar o jogo.");
    return;
  }
  // DEFINE A VELOCIDADE COM BASE NO NIVEL
    setDificulty(level); 
    // INICIA O JOGO
    initialize();        
    // OCULTA O MENU DE SELEÇÃO DO NÍVEL 
    document.querySelector("#levels").style.display = "none"; 
});



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
        document.querySelector("#levels").style.display = "block";
        resetGame();
    }
    }

    function resetGame() {
    // ZERA OS VALORES
    state.values.currentTime = 60;
    state.values.result = 0;
    state.values.gameLives = 3;

    // ATUALIZA A INTERFACE
    state.view.timeLeft.textContent = state.values.currentTime;
    state.view.score.textContent = state.values.result;
    state.view.lives.textContent = state.values.gameLives;

    // LIMPA INIMIGOS
    state.view.squares.forEach((square) => square.classList.remove("enemy"));

    // LIMPA TIMER CORRETAMENTE
    clearInterval(state.action.timerId); // ⬅ parar o movimento do inimigo
    clearInterval(state.action.countDownTimerId); // ⬅ parar o countdown

    // MOSTRA O MENU DE DIFICULDADE
    document.querySelector("#levels").style.display = "block";
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
    state.action.timerId = setInterval(randomSquare, state.values.gameVelocity);
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


let listenersAdded = false; // ⬅ Evita que os eventos de clique acumulem

function initialize(){
    moveEnemy();
    state.action.countDownTimerId = setInterval(countDown, 1000);

    // VERIFICA SE OS LISTENER DE CLIQUE JÁ FORAM ADICIONADOS E CASO NÃO ELE CHAMA A FUNÇÃO
    if (!listenersAdded) {
        addListenerHitBox();
        listenersAdded = true;
    }
}


