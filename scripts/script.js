const URL_API = "https://mock-api.bootcamp.respondeai.com.br/api/v4/buzzquizz";
const QUIZZES_API = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";
const APP = document.querySelector(".lista-quiz");
let serverQuizz = undefined;
let quizzes;
let database;

getQuizzes(); 

//============== TELA 01 ==============//

let USER_QUIZZES_IDS = [];

function getQuizzes() {
    ocultaTodos();
    removeOculto(".lista-quiz");
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
        <button class="create-quizz-btn" data-identifier="create-quizz" onclick="loadQuizInfo()">Criar Quizz</button>
    </div>
    <div class="general-quizzes" data-identifier="general-quizzes" data-identifier="quizz-card">
        <p class="all-quizzes-title">Todos os Quizzes</>
        <div class="general-quizzes-list"></div>
    </div>
    `;

    if (filteresQuizzesIds.user.length !== 0) {
    const yourQuizzesElement = document.querySelector(".your-quizzes");

    yourQuizzesElement.innerHTML = `
    <div class="your-quizzes" data-identifier="quizz-card">
        <div class="your-quizzes-header">
        <p class="">Seus Quizzes</p>
        <ion-icon name="add-circle" class="add-quizz-btn" onclick="loadQuizInfo()"></ion-icon>
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
        <div class="your-quizz" data-identifier="user-quizzes" data-identifier="quizz-card" onclick="loadQuiz(this)">
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
        scrollToCard(next_element, 2000);
    }

    quizResult();
}
function loadQuiz(response) {
    ocultaTodos();
    removeOculto(".lista-quiz");
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
    scrollToCard(document.querySelector("#result-box"), 2000);
}
}



//============== TELA 03 ==============//

let titulo= ""; //mover para dentro de loadQuizQuestions()
let url= "";
let qtdPerguntas= 0;
let qtdNiveis= 0;
let body = {
    title: titulo,
    image: url,
    questions: [],
    levels: []
}
let bodyCopy;

function loadQuizInfo() {
    ocultaTodos();
    removeOculto(".criacao-quiz");
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
    `;
}
function validateQuizInfo() {
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
    }else if(validateUrl(urlInput) == false) {
        document.querySelector("input.titulo").value = "";
        document.querySelector("input.url").value = "";
        document.querySelector("input.qtd-perguntas").value = "";
        document.querySelector("input.qtd-nieveis").value = "";
        alert("Preecha os dados corretamente");
    }else {
        body.title = tituloInput;
        body.image = urlInput;
        qtdPerguntas = qtdPerguntasInput;
        qtdNiveis = qtdNieveisInput;
        loadQuizQuestions();
    }
}

function loadQuizQuestions() {
    const conteudo = document.querySelector(".criacao-quiz");
    let codigoHTML1 = `
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
        </div>
        
    </div>`;

    conteudo.innerHTML = codigoHTML1;
    const conteudo2 = document.querySelector(".criacao-quiz__perguntas");
    // qtdPerguntas = 3; //tirar isso dps
    
    for(let i = 1; i < qtdPerguntas; i++) {
        conteudo2.innerHTML += `
            <div class="criacao-quiz__pergunta${i+1}">
                <form>
                    <div>
                        <label >Pergunta ${i+1}</label>
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
            </div>`;
    }
    conteudo2.innerHTML += `
    <button onclick="validateQuizQuestions()">Prosseguir pra criar níveis</button>`;
}

function validateQuizQuestions() { 
    for(let i = 0; i < qtdPerguntas; i++){
        let perguntaInput = document.querySelector(`.criacao-quiz__pergunta${i+1} input.pergunta`).value;
        let corPerguntaInput = document.querySelector(`.criacao-quiz__pergunta${i+1} input.cor-pergunta`).value;
        let respostaCorretaInput = document.querySelector(`.criacao-quiz__pergunta${i+1} input.resposta-correta`).value;
        let urlRespostaCorretaInput = document.querySelector(`.criacao-quiz__pergunta${i+1} input.url-resposta-correta`).value;
        let respostaIncorreta1Input = document.querySelector(`.criacao-quiz__pergunta${i+1} input.resposta-incorreta1`).value ;
        let urlRespostaIncorreta1Input = document.querySelector(`.criacao-quiz__pergunta${i+1} input.url-resposta-incorreta1`).value;
        let respostaIncorreta2Input = document.querySelector(`.criacao-quiz__pergunta${i+1} input.resposta-incorreta2`).value;
        let urlRespostaIncorreta2Input = document.querySelector(`.criacao-quiz__pergunta${i+1} input.url-resposta-incorreta2`).value;
        let respostaIncorreta3Input = document.querySelector(`.criacao-quiz__pergunta${i+1} input.resposta-incorreta3`).value;
        let urlRespostaIncorreta3Input = document.querySelector(`.criacao-quiz__pergunta${i+1} input.url-resposta-incorreta3`).value;

        if(perguntaInput.length < 20) {
            document.querySelector(`.criacao-quiz__pergunta${i+1} input.pergunta`).value = "";
            document.querySelector(`.criacao-quiz__pergunta${i+1} input.cor-pergunta`).value = "";
            document.querySelector(`.criacao-quiz__pergunta${i+1} input.resposta-correta`).value = "";
            document.querySelector(`.criacao-quiz__pergunta${i+1} input.url-resposta-correta`).value = "";
            document.querySelector(`.criacao-quiz__pergunta${i+1} input.resposta-incorreta1`).value = "";
            document.querySelector(`.criacao-quiz__pergunta${i+1} input.url-resposta-incorreta1`).value = "";
            document.querySelector(`.criacao-quiz__pergunta${i+1} input.resposta-incorreta2`).value = "";
            document.querySelector(`.criacao-quiz__pergunta${i+1} input.url-resposta-incorreta2`).value = "";
            document.querySelector(`.criacao-quiz__pergunta${i+1} input.resposta-incorreta3`).value = "";
            document.querySelector(`.criacao-quiz__pergunta${i+1} input.url-resposta-incorreta3`).value = "";
            alert("Preecha os dados corretamente");
        }else if(respostaCorretaInput === "" || respostaIncorreta1Input === ""){
            document.querySelector(`.criacao-quiz__pergunta${i+1} input.pergunta`).value = "";
            document.querySelector(`.criacao-quiz__pergunta${i+1} input.cor-pergunta`).value = "";
            document.querySelector(`.criacao-quiz__pergunta${i+1} input.resposta-correta`).value = "";
            document.querySelector(`.criacao-quiz__pergunta${i+1} input.url-resposta-correta`).value = "";
            document.querySelector(`.criacao-quiz__pergunta${i+1} input.resposta-incorreta1`).value = "";
            document.querySelector(`.criacao-quiz__pergunta${i+1} input.url-resposta-incorreta1`).value = "";
            document.querySelector(`.criacao-quiz__pergunta${i+1} input.resposta-incorreta2`).value = "";
            document.querySelector(`.criacao-quiz__pergunta${i+1} input.url-resposta-incorreta2`).value = "";
            document.querySelector(`.criacao-quiz__pergunta${i+1} input.resposta-incorreta3`).value = "";
            document.querySelector(`.criacao-quiz__pergunta${i+1} input.url-resposta-incorreta3`).value = "";
            alert("Preecha os dados corretamente");
        }else if(validateUrl(urlRespostaCorretaInput) == false || urlRespostaIncorreta1Input == false) {
            document.querySelector(`.criacao-quiz__pergunta${i+1} input.pergunta`).value = "";
            document.querySelector(`.criacao-quiz__pergunta${i+1} input.cor-pergunta`).value = "";
            document.querySelector(`.criacao-quiz__pergunta${i+1} input.resposta-correta`).value = "";
            document.querySelector(`.criacao-quiz__pergunta${i+1} input.url-resposta-correta`).value = "";
            document.querySelector(`.criacao-quiz__pergunta${i+1} input.resposta-incorreta1`).value = "";
            document.querySelector(`.criacao-quiz__pergunta${i+1} input.url-resposta-incorreta1`).value = "";
            document.querySelector(`.criacao-quiz__pergunta${i+1} input.resposta-incorreta2`).value = "";
            document.querySelector(`.criacao-quiz__pergunta${i+1} input.url-resposta-incorreta2`).value = "";
            document.querySelector(`.criacao-quiz__pergunta${i+1} input.resposta-incorreta3`).value = "";
            document.querySelector(`.criacao-quiz__pergunta${i+1} input.url-resposta-incorreta3`).value = "";
            alert("Preecha os dados corretamente");
        }else if(validateHex(corPerguntaInput) == false) {
            document.querySelector(`.criacao-quiz__pergunta${i+1} input.pergunta`).value = "";
            document.querySelector(`.criacao-quiz__pergunta${i+1} input.cor-pergunta`).value = "";
            document.querySelector(`.criacao-quiz__pergunta${i+1} input.resposta-correta`).value = "";
            document.querySelector(`.criacao-quiz__pergunta${i+1} input.url-resposta-correta`).value = "";
            document.querySelector(`.criacao-quiz__pergunta${i+1} input.resposta-incorreta1`).value = "";
            document.querySelector(`.criacao-quiz__pergunta${i+1} input.url-resposta-incorreta1`).value = "";
            document.querySelector(`.criacao-quiz__pergunta${i+1} input.resposta-incorreta2`).value = "";
            document.querySelector(`.criacao-quiz__pergunta${i+1} input.url-resposta-incorreta2`).value = "";
            document.querySelector(`.criacao-quiz__pergunta${i+1} input.resposta-incorreta3`).value = "";
            document.querySelector(`.criacao-quiz__pergunta${i+1} input.url-resposta-incorreta3`).value = "";
            alert("Preecha os dados corretamente");
        }else {
            const pergunta = {
                title: perguntaInput,
                color: corPerguntaInput,
                answers: [
                    {
                        text: respostaCorretaInput,
                        image: urlRespostaCorretaInput,
                        isCorrectAnswer: true
                    },
                    {
                        text: respostaIncorreta1Input,
                        image: urlRespostaIncorreta1Input,
                        isCorrectAnswer: false
                    }
                ]
            }
            if(respostaIncorreta2Input !== "" ){
                pergunta.answers.push({
                    text: respostaIncorreta2Input,
                    image: urlRespostaIncorreta2Input,
                    isCorrectAnswer: false
                })
            }
            if(respostaIncorreta3Input !== "" ){
                pergunta.answers.push({
                    text: respostaIncorreta3Input,
                    image: urlRespostaIncorreta3Input,
                    isCorrectAnswer: false
                })
            }

            body.questions.push(pergunta);
            
            if(i+1 == qtdPerguntas) loadQuizLvls();
        }
    }
}

function loadQuizLvls() {
    const conteudo = document.querySelector(".criacao-quiz");
    let codigoHTML1 = `
    <div class="criacao-quiz__niveis">
        <span>Agora, decida os níveis!</span>
        <div class="criacao-quiz__nivel1">
            <form>
                <div>
                    <label >Nível 1</label>
                    <input class="titulo-nivel" type="text" placeholder="Título do nível">
                    <input class="acerto" type="text" placeholder="% de acerto mínima">
                    <input class="url-nivel" type="text" placeholder="URL da imagem do nível">
                    <input class="descricao-nivel" type="text" placeholder="Descrição do nível">
                </div>  
            </form>
        </div>
    </div>`;
    
    conteudo.innerHTML = codigoHTML1;
    const conteudo2 = document.querySelector(".criacao-quiz__niveis");
    qtdNiveis = 2; //tirar isso dps
    
    for(let i = 1; i < qtdNiveis; i++) {
        conteudo2.innerHTML += `
        <div class="criacao-quiz__nivel${i+1}">
            <form>
                <div>
                    <label >Nível ${i+1}</label>
                    <input class="titulo-nivel" type="text" placeholder="Título do nível">
                    <input class="acerto" type="text" placeholder="% de acerto mínima">
                    <input class="url-nivel" type="text" placeholder="URL da imagem do nível">
                    <input class="descricao-nivel" type="text" placeholder="Descrição do nível">
                </div>  
            </form>
        </div>`;
    }
    conteudo2.innerHTML += `
    <button onclick="validateQuizLvls()">Prosseguir pra criar níveis</button>`;
}
function validateQuizLvls() {//FALTA VALIDAR %DE ACERTO
    let aux = 0;
    let erros = 0;
    for(let i = 0; i < qtdNiveis; i++){
        let tituloNivelInput = document.querySelector(`.criacao-quiz__nivel${i+1} input.titulo-nivel`).value;
        let acertoInput = document.querySelector(`.criacao-quiz__nivel${i+1} input.acerto`).value;
        let urlNivelInput = document.querySelector(`.criacao-quiz__nivel${i+1} input.url-nivel`).value;
        let descricaoNivelCorretaInput = document.querySelector(`.criacao-quiz__nivel${i+1} input.descricao-nivel`).value;
        
        if(acertoInput == 0){
            aux ++;
        }

        if(tituloNivelInput.length < 10) {
            document.querySelector(`.criacao-quiz__nivel${i+1} input.titulo-nivel`).value = "";
            document.querySelector(`.criacao-quiz__nivel${i+1} input.acerto`).value = "";
            document.querySelector(`.criacao-quiz__nivel${i+1} input.url-nivel`).value = "";
            document.querySelector(`.criacao-quiz__nivel${i+1} input.descricao-nivel`).value = "";
            alert("Preecha os dados corretamente");
            erros++;
        }else if(acertoInput < 0 || acertoInput > 99) {
            document.querySelector(`.criacao-quiz__nivel${i+1} input.titulo-nivel`).value = "";
            document.querySelector(`.criacao-quiz__nivel${i+1} input.acerto`).value = "";
            document.querySelector(`.criacao-quiz__nivel${i+1} input.url-nivel`).value = "";
            document.querySelector(`.criacao-quiz__nivel${i+1} input.descricao-nivel`).value = "";
            alert("Preecha os dados corretamente");
            erros++;
        }else if(descricaoNivelCorretaInput.length < 30){
            document.querySelector(`.criacao-quiz__nivel${i+1} input.titulo-nivel`).value = "";
            document.querySelector(`.criacao-quiz__nivel${i+1} input.acerto`).value = "";
            document.querySelector(`.criacao-quiz__nivel${i+1} input.url-nivel`).value = "";
            document.querySelector(`.criacao-quiz__nivel${i+1} input.descricao-nivel`).value = "";
            alert("Preecha os dados corretamente");
            erros++;
        }else if(validateUrl(urlNivelInput) == false) {
            document.querySelector(`.criacao-quiz__nivel${i+1} input.titulo-nivel`).value = "";
            document.querySelector(`.criacao-quiz__nivel${i+1} input.acerto`).value = "";
            document.querySelector(`.criacao-quiz__nivel${i+1} input.url-nivel`).value = "";
            document.querySelector(`.criacao-quiz__nivel${i+1} input.descricao-nivel`).value = "";
            alert("Preecha os dados corretamente");
            erros++;
        } else if (i == qtdNiveis-1 && aux < 1){
            document.querySelector(`.criacao-quiz__nivel${i+1} input.titulo-nivel`).value = "";
            document.querySelector(`.criacao-quiz__nivel${i+1} input.acerto`).value = "";
            document.querySelector(`.criacao-quiz__nivel${i+1} input.url-nivel`).value = "";
            document.querySelector(`.criacao-quiz__nivel${i+1} input.descricao-nivel`).value = "";
            alert("Preecha os dados corretamente");
            erros++;
        } else if (i == qtdNiveis-1 && aux > 1){
            document.querySelector(`.criacao-quiz__nivel${i+1} input.titulo-nivel`).value = "";
            document.querySelector(`.criacao-quiz__nivel${i+1} input.acerto`).value = "";
            document.querySelector(`.criacao-quiz__nivel${i+1} input.url-nivel`).value = "";
            document.querySelector(`.criacao-quiz__nivel${i+1} input.descricao-nivel`).value = "";
            alert("Preecha os dados corretamente");
            erros++;
        }
        else if(erros == 0){
            const nivel = {           
                title: tituloNivelInput,
                image: urlNivelInput,
                text: descricaoNivelCorretaInput,
                minValue: acertoInput,
            }

            body.levels.push(nivel);

            if(i+1 == qtdNiveis) {
                console.log(body);
                bodyCopy = body;
                saveQuizz();
                getQuizzes(); 
                loadQuizFinished();
            }
        }
    }
}

function loadQuizFinished(id) { //FALTA COLOCAR O LINK DO QUIZ PRONTO
    ocultaTodos();
    removeOculto(".criacao-quiz");
    const conteudo = document.querySelector(".criacao-quiz");
    conteudo.innerHTML =  `
    <div class="criacao-quiz__sucesso">
        <div><span>Comece pelo começo</span></div>
        <div class="quizz" onclick="loadQuiz(this)">
            <img src="${body.image}">
            <div class="overlay"></div>
            <div class="hidden">${body.title}</div>
            <span class="oculto">${id}</span>
        </div>
        <button onclick="loadQuiz(id)">Acessar Quizz</button>
        <button onclick="returnHomePage()" class="home"">Voltar pra home</button>
    </div>`;
}

function returnHomePage() { //COMPLETAR CHAMANDO FUNCAO DE INICIALIZACAO DO SITE
    const conteudo = document.querySelector(".criacao-quiz");
    conteudo.innerHTML = ``;
    
    getQuizzes();
}

function clearHTML() {
    const tela1 = document.querySelector(".lista-quiz");
    const tela2 = document.querySelector(".pagina-quiz");
    const tela3 = document.querySelector(".criacao-quiz");
    tela1.innerHTML = "";
    tela2.innerHTML = "";
    tela3.innerHTML = "";
}
function ocultaTodos() {
    const tela1 = document.querySelector(".lista-quiz");
    const tela2 = document.querySelector(".pagina-quiz");
    const tela3 = document.querySelector(".criacao-quiz");
    tela1.classList.add("oculto");
    tela2.classList.add("oculto");
    tela3.classList.add("oculto");
}
function removeOculto(tela) {
    document.querySelector(tela).classList.remove("oculto");
}

function validateUrl(value) {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
}
function validateHex(value) {
    return /^#([A-Fa-f0-9]{6})$/i.test(value);
}

// loadQuizInfo();
// loadQuizQuestions();
// loadQuizLvls();
// loadQuizFinished();

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

    // createQuizzSuccess(quizz.id); //aqui????
    loadQuizFinished(quizz.key);
}

// function createQuizzSuccess(id) {
//     APP.innerHTML = `
//       <div class="page-create-quizz">
//         <div class="title">Seu quizz está pronto!</div>
   
//         <div class="quizz" onclick="loadQuiz(this)">
//           <img src="${CREATED_QUIZZ.image}">
//           <div class="overlay"></div>
//           <div class="title">${CREATED_QUIZZ.title}</div>
//           <span class="hidden">${id}</span>
//         </div>
   
//         <button class="access-quizz" onclick="loadQuiz("<span ${id}</span>")">Acessar Quizz</button>
//         <button class="go-back" onclick="getQuizzes()">Voltar pra home</button>
//       </div>  
//     `;
//   }

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
    return Math.round(Math.random()) - 0.5;
}


function saveQuizz() {
    const promise = axios.post(`${URL_API}/quizzes`, body);
    promise.then(saveQuizzLocalStorage);
}  


function scrollToCard(element, time) {
    function scroll() {
        element.scrollIntoView({ behavior: "smooth" });
    }
    setTimeout(scroll, time);
}

