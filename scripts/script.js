const URL_API = "https://mock-api.bootcamp.respondeai.com.br/api/v4/buzzquizz";
const QUIZZES_API = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";
const APP = document.querySelector(".app");
let serverQuizz = undefined;
let quizzes;
let database1;

getQuizzes();
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



//============== TELA 03 ==============//


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
