const URL_API = "https://mock-api.bootcamp.respondeai.com.br/api/v4/buzzquizz";
const QUIZZES_API = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";
const APP = document.querySelector(".app");
let serverQuizz = undefined;
let quizzes;
let database;

// getQuizzes(); 

//============== TELA 01 ==============//

let USER_QUIZZES_IDS = [];

function getQuizzes() {
    const promise = axios.get(`${URL_API}/quizzes`);
    promise.then(listQuizzes);
}

function listQuizzes(response) {
const yourQuizzes = getQuizzesLocalStorage();

USER_QUIZZES_IDS = yourQuizzes.map((quizz) => quizz.id);
const filteresQuizzesIds = filterQuizzes(response.data);

console.log(filteresQuizzesIds)

APP.innerHTML = `
    <div class="your-quizzes not-created">
        <p class="quizz-not-created">Você não criou nenhum quizz ainda :(</p>
        <button class="create-quizz-btn" data-identifier="create-quizz" onclick="generateQuizz()">Criar Quizz</button>
    </div>
    <div class="general-quizzes" data-identifier="general-quizzes">
        <p class="all-quizzes-title">Todos os Quizzes</>
        <div class="general-quizzes-list"></div>
    </div>
    `;

    if (filteresQuizzesIds.user.length !== 0) {
    const yourQuizzesElement = document.querySelector(".your-quizzes");

    yourQuizzesElement.innerHTML = `
    <div class="your-quizzes">
        <div class="your-quizzes-header">
        <p class="">Seus Quizzes</p>
        <ion-icon name="add-circle" class="add-quizz-btn" onclick="generateQuizz();"></ion-icon>
        </div>
        <div class="your-quizzes-list"></div>
    </div>  
    `;

    yourQuizzesElement.classList.replace("not-created", "created");

    const yourQuizzesList = document.querySelector(".your-quizzes-list");

    for (let i = 0; i < filteresQuizzesIds.user.length; i++) {
    let yourQuizz = filteresQuizzesIds.user[i];

    if(yourQuizz.title === undefined) {
        yourQuizzesList.innerHTML += "";
    } else {

    yourQuizzesList.innerHTML += `
        <div class="your-quizz" onclick="loadQuiz(this)">
            <img src='${yourQuizz.image}'/>
            <div class="gradient"></div>
            <p class="quizz-title">${yourQuizz.title} </p>
            <span class="hidden">${yourQuizz.id}</span>
        </div>      
    `;
    }
    }
}

    const promise = axios.get(
    "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes"
    );
    promise.then(loadQuizzes);
}

function filterQuizzes(quizzes) {
    let user = [];
    let others = [];

    user = quizzes.filter(function (quizz) {
    if (USER_QUIZZES_IDS.includes(quizz.id)) {
        return true;
    }
    });
    others = quizzes.filter(function (quizz) {
    if (!USER_QUIZZES_IDS.includes(quizz.id)) {
        return true;
    }
});

    return {
    user,
    others,
    };
}

function loadQuizzes(answer) {

quizzes = answer.data;

const allQuizzes = document.querySelector(".general-quizzes-list");
for (let i = 0; i < quizzes.length; i++) {
    serverQuizz = quizzes[i];

    if ("questions" in serverQuizz) {
        allQuizzes.innerHTML += `
        <div class="server-quizz" onclick="loadQuiz(this)">
            <img src='${serverQuizz.image}'/>
            <div class="gradient">
            </div>
            <p class="quizz-title">${serverQuizz.title}</p>
            <span class="hidden">${serverQuizz.id}</span>
        </div>
    `;
    }
}
}

//============== TELA 02 ==============//

let quiz_point = 0; 
let promisse_quiz_selected = axios.get(QUIZZES_API);
let quiz_data; 
let quiz_selecionado; 
let result;
let counter = 0;
let levels;

function onSelectedAnswer(element) {
    counter++;
    element.classList.add(".selecionado");
    let myElementParent = element.parentNode.querySelector("#true");
    element.parentNode.classList.remove("normal-style");
    element.classList.add("selected");
    if (element == myElementParent) {
    quiz_point++;
    }
    element.parentNode.classList.add("transparent");
    let next_element =
    element.parentNode.parentNode.nextSibling.nextElementSibling;
    if (next_element != null) {
        scrollToCard2(next_element, 2000);
    }

    quizResult();
}
function loadQuiz(response) {
    result = 0;
    counter = 0;
    levels = 0;
    quiz_point = 0;
    database = response;

    quiz_data = response.querySelector("span").innerHTML;
    quiz_selecionado = quizzes.filter((p) => p.id == quiz_data)[0]; 

    let questions = quiz_selecionado.questions;

    levels = quiz_selecionado.levels;

    APP.innerHTML = `   
    <div class="top-quiz-container">
        <img class ="icon-main-image"src="${quiz_selecionado.image}" alt="">
        <span  class="quiz-title">${quiz_selecionado.title}</span>
    </div>
    <div class="quiz-container">         
    </div>
    `;
    document.querySelector(".quiz-container").scrollIntoView();
    for (let i = 0; i < questions.length; i++) {
    let answers = questions[i].answers.sort(randomize);

    APP.querySelector(".quiz-container").innerHTML += `
    <div class="question-container" data-identifier="question">
        <div style="background-color: ${questions[i].color}" class="question-title"><span>${questions[i].title}</span></div>
        <div class="quiz-answers normal-style">
        </div>
    </div>    
    `;

    for (let p = 0; p < answers.length; p++) {
        APP.querySelector(".quiz-container").lastElementChild.querySelector(
        ".quiz-answers"
        ).innerHTML += `        
        <div class="answer" onclick="onSelectedAnswer(this)" id="${answers[p].isCorrectAnswer}" data-identifier="answer">
            <img class = "answer-img"src="${answers[p].image}" alt="">
            <p class="normal-style">${answers[p].text}</p>
        </div>
    `;
    }
}
}
function reload() {
    loadQuiz(database);
}
function quizResult() {
    let total_points = quiz_selecionado.questions.length;
    result = Math.ceil((quiz_point / total_points) * 100);
    let levels = quiz_selecionado.levels;
    const min_value = levels.map((p) => p.minValue);
    let my_level = min_value.filter((value) => {
        return value <= result;
    });
    let level_selected = levels[my_level.length - 1];

    if (quiz_selecionado.questions.length == counter) {

    APP.querySelector(".quiz-container").innerHTML += `   
    <div class="question-container" id="result-box"  data-identifier="quizz-result">
        <div class="result-title-container">
        <p>${result} % de acerto: ${level_selected.title} </p>
        </div>
        <div class="box-result">
        <img class ="image-result"src="${level_selected.image}" alt="">
        <p class="text-result">${level_selected.text}</p>
        </div>    
    </div>
    <button class="reload-button" onclick="reload()"6>Reiniciar Quizz</button>
    <p class="go-back-button" onclick="getQuizzes()">Voltar pra home</p>
    `;
    scrollToCard2(document.querySelector("#result-box"), 2000);
}
}



//============== TELA 03 ==============//

let titulo= ""; //mover para dentro de loadQuizQuestions()
let url= "";
let qtdPerguntas= 0;
let qtdNiveis= 0;



function loadQuizInfo() {
    const conteudo = document.querySelector(".criacao-quiz");
    conteudo.innerHTML = `
    <div class="criacao-quiz__infos">
        <span>Comece pelo começo</span>
        <form name="comeco-quiz">
            <input class="titulo" type="text" placeholder="Título do seu quizz">
            <input class="url" type="text" placeholder="URL da imagem do seu quizz">
            <input class="qtd-perguntas" type="text" placeholder="Quantidade de perguntas do quizz">
            <input class="qtd-nieveis" type="text" placeholder="Quantidade de níveis do quizz">
        </form>
        <button onclick="validateQuizInfo()">Prosseguir pra criar perguntas</button>
    </div>    
    `
}
function validateQuizInfo() {//FALTA VALIDAR URL
    let tituloInput = document.querySelector("input.titulo").value;
    let urlInput = document.querySelector("input.url").value;
    let qtdPerguntasInput = document.querySelector("input.qtd-perguntas").value;
    let qtdNieveisInput = document.querySelector("input.qtd-nieveis").value;
    
    if(tituloInput.length < 20 || tituloInput.length > 65) {
        document.querySelector("input.titulo").value = "";
        document.querySelector("input.url").value = "";
        document.querySelector("input.qtd-perguntas").value = "";
        document.querySelector("input.qtd-nieveis").value = "";
        alert("Preecha os dados corretamente");
    }else if(qtdPerguntasInput < 3){
        document.querySelector("input.titulo").value = "";
        document.querySelector("input.url").value = "";
        document.querySelector("input.qtd-perguntas").value = "";
        document.querySelector("input.qtd-nieveis").value = "";
        alert("Preecha os dados corretamente");
    }else if(qtdNieveisInput < 2){
        document.querySelector("input.titulo").value = "";
        document.querySelector("input.url").value = "";
        document.querySelector("input.qtd-perguntas").value = "";
        document.querySelector("input.qtd-nieveis").value = "";
        alert("Preecha os dados corretamente");
    }else {
        titulo = tituloInput;
        url = urlInput;
        qtdPerguntas = qtdPerguntasInput;
        qtdNiveis = qtdNieveisInput;
        console.log("quiz valido");
        // loadQuizQuestions(); LIMPAR TELA E CHAMAR FUNC
    }
}

function loadQuizQuestions() { //FALTA CRIAR A QUANTIDADE DE PERGUNTAS DINAMICAMENTE E FAZER DISPLAY:NONE NELAS
    const conteudo = document.querySelector(".criacao-quiz");
    conteudo.innerHTML = `
    <div class="criacao-quiz__perguntas">
        <span>Crie suas perguntas</span>
        <div class="criacao-quiz__pergunta1">
            <form>
                <div>
                    <label >Pergunta 1</label>
                    <input class="pergunta" type="text" placeholder="Texto da pergunta">
                    <input class="cor-pergunta" type="text" placeholder="Cor de fundo da pergunta">
                </div>  
                <div>
                    <label >Resposta correta</label>
                    <input class="resposta-correta" type="text" placeholder="Resposta correta">
                    <input class="url-resposta-correta" type="text" placeholder="URL da imagem">
                </div>
                <div>
                    <label >Resposta incorreta</label>
                    <input class="resposta-incorreta1" type="text" placeholder="Resposta incorreta 1">
                    <input class="url-resposta-incorreta1" type="text" placeholder="URL da imagem 1">
                </div>
                <div>
                    <input class="resposta-incorreta2" type="text" placeholder="Resposta incorreta 2">
                    <input class="url-resposta-incorreta2" type="text" placeholder="URL da imagem 2">
                </div>
                <div>
                    <input class="resposta-incorreta3" type="text" placeholder="Resposta incorreta 3">
                    <input class="url-resposta-incorreta3" type="text" placeholder="URL da imagem 3">
                </div>
            </form>
            <button onclick="validateQuizQuestions()">Prosseguir pra criar níveis</button>
        </div>
    </div>       
    `
}
function validateQuizQuestions() { //FALTA VALIDAR COR E FALTA VALIDAR URL
    let perguntaInput = document.querySelector("input.pergunta").value;
    let corPerguntaInput = document.querySelector("input.cor-pergunta").value;
    let respostaCorretaInput = document.querySelector("input.resposta-correta").value;
    let urlRespostaCorretaInput = document.querySelector("input.url-resposta-correta").value;
    let respostaIncorreta1Input = document.querySelector("input.resposta-incorreta1").value;
    let urlRespostaIncorreta1Input = document.querySelector("input.url-resposta-incorreta1").value;
    let respostaIncorreta2Input = document.querySelector("input.resposta-incorreta2").value;
    let urlRespostaIncorreta2Input = document.querySelector("input.url-resposta-incorreta2").value;
    let respostaIncorreta3Input = document.querySelector("input.resposta-incorreta3").value;
    let urlRespostaIncorreta3Input = document.querySelector("input.url-resposta-incorreta3").value;
    console.log(perguntaInput);
    console.log(corPerguntaInput);
    console.log(respostaCorretaInput);
    console.log(urlRespostaCorretaInput);
    console.log(respostaIncorreta1Input);
    console.log(urlRespostaIncorreta1Input);
    console.log(respostaIncorreta2Input);
    console.log(urlRespostaIncorreta2Input);
    console.log(respostaIncorreta3Input);
    console.log(urlRespostaIncorreta3Input);
    
    if(perguntaInput.length < 20) {
        console.log("ERRO 1");
        document.querySelector("input.pergunta").value = "";
        document.querySelector("input.cor-pergunta").value = "";
        document.querySelector("input.resposta-correta").value = "";
        document.querySelector("input.url-resposta-correta").value = "";
        document.querySelector("input.resposta-incorreta1").value = "";
        document.querySelector("input.url-resposta-incorreta1").value = "";
        document.querySelector("input.resposta-incorreta2").value = "";
        document.querySelector("input.url-resposta-incorreta2").value = "";
        document.querySelector("input.resposta-incorreta3").value = "";
        document.querySelector("input.url-resposta-incorreta3").value = "";
        alert("Preecha os dados corretamente");
    }else if(respostaCorretaInput === "" || respostaIncorreta1Input === ""){
        console.log("ERRO 2");
        document.querySelector("input.pergunta").value = "";
        document.querySelector("input.cor-pergunta").value = "";
        document.querySelector("input.resposta-correta").value = "";
        document.querySelector("input.url-resposta-correta").value = "";
        document.querySelector("input.resposta-incorreta1").value = "";
        document.querySelector("input.url-resposta-incorreta1").value = "";
        document.querySelector("input.resposta-incorreta2").value = "";
        document.querySelector("input.url-resposta-incorreta2").value = "";
        document.querySelector("input.resposta-incorreta3").value = "";
        document.querySelector("input.url-resposta-incorreta3").value = "";
        alert("Preecha os dados corretamente");
    }else {
        console.log("quiz valido");
    }
}
// loadQuizInfo();
// loadQuizQuestions();

//Testes
function saveQuizzLocalStorage(res) {
    const quizz = res.data;
    const localData = getQuizzesLocalStorage();
    localData.push({
        id: quizz.id,
        image: quizz.image,
        title: quizz.title,
        key: quizz.key,
    });

    localStorage.setItem("quizzes", JSON.stringify(localData));

    createQuizzSuccess(quizz.id);
}


//mais testes!
function getQuizzesLocalStorage() {
    let data = localStorage.getItem("quizzes");

    if (data !== null) {
        const parsedData = JSON.parse(data);
        return parsedData;
    } else {
        return [];
    }
}

function randomize() {
    //função para misturar respostas
    return Math.round(Math.random()) - 0.5;
}



// let quizData { formato que vou usar para enviar o quiz pro servidor 
// 	title: "",
// 	image: "",
// 	questions: [
// 		{
// 			title: "",
// 			color: "",
// 			answers: [
// 				{
// 					text: "",
// 					image: "",
// 					isCorrectAnswer: true
// 				},
// 				{
// 					text: "",
// 					image: "",
// 					isCorrectAnswer: false
// 				}
// 			]
// 		},

// 	],
// 	levels: [
// 		{
// 			title: "",
// 			image: "",
// 			text: "",
// 			minValue: 0
// 		},
		
// 	]
// }