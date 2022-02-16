const URL_API = "https://mock-api.bootcamp.respondeai.com.br/api/v4/buzzquizz";
const QUIZZES_API = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";
const APP = document.querySelector(".app");
let serverQuizz = undefined;


pegarQuizzes();
//============== TELA 01 ==============//
let ID_USUARIO_QUIZ = [];
function pegarQuizzes() {
    const promise = axios.get(`${URL_API}/quizzes`);
    promise.then(listarQuizzes);
    }

function listarQuizzes(resposta){
const seusQuizzes =""; 
//pegarQuizzesLocal();
//ID_USUARIO_QUIZ = seusQuizzes.map((quizz) => quizz.id);
    const filtrarQuizzId = filtrarQuizzes(resposta.data);
    console.log(filtrarQuizzId)

    APP.innerHTML = `
    <div class="seus-quizzes nao-criado">
        <p class="quiz-nao-criado">Você não criou nenhum quizz ainda :(</p>
        <button class="botao-criar-quiz" data-identifier="create-quizz" onclick="criarQuizz()">Criar Quizz</button>
    </div>
    <div class="quizzes-de-outros-users" data-identifier="general-quizzes">
        <p class="todos-quizzes">Todos os Quizzes</>
        <div class="quizzes-de-outros-users-list"></div>
    </div>
    `;

    //teste apagar dps
    /*
    if (filtrarQuizzId.user.length !== 0) {
        const seusQuizzesElemento = document.querySelector(".seus-quizzes");

        seusQuizzesElemento.innerHTML = `
        <div class="seus-quizzes">
        <div class="seus-quizzes-header">
            <p class="">Seus Quizzes</p>
            <ion-icon name="add-circle" class="add-quizz-btn" onclick="criarQuizz();"></ion-icon>
        </div>
        <div class="seus-quizzes-lista"></div>
        </div>  
        `;

        seusQuizzesElemento.classList.replace("nao-criados", "criados");

        const listaSeusQuizzes = document.querySelector(".lista-seus-quizzes");

        for (let i = 0; i < filtrarQuizzId.user.length; i++) {
        let seuQuizz = filtrarQuizzId.user[i];

        if(tituloQuizz === undefined) {
            listaSeusQuizzes.innerHTML += "";
        } else {

            listaSeusQuizzes.innerHTML += `
            <div class="seus-quizzes" onclick="carregaQuiz(this)">
                <img src='${yourQuizz.image}'/>
                <div class="gradient"></div>
                <p class="titulo-quizz">${tituloQuizz} </p>
                <span class="hidden">${yourQuizz.id}</span>
            </div>      
            `;
                }
            }
        }
        */



        const promise = axios.get(
            "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes"
        );
            promise.then(carregaQuiz);
}
    
    function filtrarQuizzes(quizzes) {
        let usuario = [];
        let deFora = [];
    
        usuario = quizzes.filter(function (quiz) {
        if (ID_USUARIO_QUIZ.includes(quiz.id)) {
        return true;
        }
        });
        deFora = quizzes.filter(function (quiz) {
            if (!ID_USUARIO_QUIZ.includes(quiz.id)) {
            return true;
        }
        });
    
    return {
        usuario,
        deFora,
    };
    }
    
    function carregaQuiz(resposta) {
        quizzes = resposta.data;
        const todosOsQuizzes = document.querySelector(".quizzes-de-outros-users-list");

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



//============== TELA 03 ==============//
