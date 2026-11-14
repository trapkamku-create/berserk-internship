// --- Стартовый экран ---
document.getElementById('start-btn').addEventListener('click', () => {
    document.getElementById('splash-screen').style.display = 'none';
    document.getElementById('main-portal').classList.remove('hidden');
});

// --- База данных вопросов ---
const testData = {
    law: [
        {
            question: "О чем гласит 14 статья УИС?",
            options: [
                "О правах и обязанностях сотрудников",
                "О запрете ношения оружия",
                "О правилах дорожного движения",
                "О сроках содержания под стражей"
            ],
            correct: 0
        },
        {
            question: "Что такое задержание?",
            options: [
                "Краткосрочное лишение свободы передвижения лица, подозреваемого в совершении преступления",
                "Принудительное лечение",
                "Изъятие водительских прав",
                "Обыск личных вещей"
            ],
            correct: 0
        },
        {
            question: "Что обязан сделать сотрудник во время задержания?",
            options: [
                "Представиться, разъяснить причину задержания и права задержанному",
                "Сразу надеть наручники и избить",
                "Отпустить задержанного",
                "Вызвать такси"
            ],
            correct: 0
        }
    ],
    med: "Тест по тактической медицине в разработке.",
    negotiations: "Тест по переговорам в разработке.",
    assault: "Тест по штурму в разработке.",
    bomb: "Тест по разминированию в разработке."
};

let currentDiscipline = null;
let currentQuestionIndex = 0; // Индекс текущего вопроса
let userAnswers = []; // Массив для сохранения ответов пользователя
let timerInterval = null; 
let timeLeft = 15; 

// --- Открытие дисциплины ---
function openDiscipline(id) {
    currentDiscipline = id;
    const modal = document.getElementById('discipline-modal');
    const title = document.getElementById('modal-title');
    const startBtn = document.getElementById('start-test-btn');
    const testContainer = document.getElementById('test-container');
    const timerDisplay = document.getElementById('timer-display');
    const resultMsg = document.getElementById('result-message');

    // Сброс состояния
    testContainer.classList.add('hidden');
    resultMsg.classList.add('hidden');
    timerDisplay.classList.add('hidden');
    clearInterval(timerInterval);
    currentQuestionIndex = 0;
    userAnswers = [];
    
    const titles = {
        law: "Законодательство",
        med: "Тактическая медицина",
        negotiations: "Переговоры",
        assault: "Штурм",
        bomb: "Разминирование СВУ"
    };
    title.textContent = titles[id] || "Дисциплина";

    startBtn.classList.remove('hidden');
    startBtn.textContent = "Начать тест";

    modal.classList.remove('hidden');
}

// --- Запуск теста ---
function startTest() {
    const startBtn = document.getElementById('start-test-btn');
    const testContainer = document.getElementById('test-container');
    
    startBtn.classList.add('hidden');
    testContainer.classList.remove('hidden');

    const data = testData[currentDiscipline];

    // Если это заглушка (строка)
    if (typeof data === 'string') {
        document.getElementById('questions-list').innerHTML = `<p style="color: var(--text-color); text-align: center;">${data}</p>`;
        document.getElementById('test-next-btn').classList.add('hidden'); // Прячем кнопку далее
        return;
    }

    // Запускаем первый вопрос
    currentQuestionIndex = 0;
    userAnswers = []; // Очищаем старые ответы
    showQuestion();
}

// --- Показ текущего вопроса ---
function showQuestion() {
    const data = testData[currentDiscipline];
    const questionsList = document.getElementById('questions-list');
    const timerDisplay = document.getElementById('timer-display');
    
    // Настраиваем кнопку "Далее" или "Завершить"
    let nextBtn = document.getElementById('test-next-btn');
    if (!nextBtn) {
        // Если кнопки нет в HTML, создадим её динамически (или можно добавить в HTML, но я сделаю через JS)
        nextBtn = document.createElement('button');
        nextBtn.id = 'test-next-btn';
        nextBtn.className = 'download-btn';
        nextBtn.style.marginTop = '15px';
        document.getElementById('test-container').appendChild(nextBtn);
    }
    
    // Очищаем прошлый вопрос
    questionsList.innerHTML = '';
    
    // Если вопросы закончились — показываем результат
    if (currentQuestionIndex >= data.length) {
        finishTest();
        return;
    }

    const q = data[currentQuestionIndex];
    
    // Формируем HTML вопроса
    let optionsHtml = '';
    q.options.forEach((opt, optIndex) => {
        optionsHtml += `
            <label class="option-label">
                <input type="radio" name="current_q" value="${optIndex}">
                ${opt}
            </label>
        `;
    });

    questionsList.innerHTML = `
        <div class="question-block">
            <div class="question-text">Вопрос ${currentQuestionIndex + 1} из ${data.length}. ${q.question}</div>
            ${optionsHtml}
        </div>
    `;

    // Настройка кнопки "Далее" / "Завершить"
    nextBtn.classList.remove('hidden');
    if (currentQuestionIndex === data.length - 1) {
        nextBtn.textContent = "Завершить";
    } else {
        nextBtn.textContent = "Далее";
    }

    // Удаляем старые обработчики и вешаем новый
    nextBtn.onclick = () => {
        saveAnswer();
        currentQuestionIndex++;
        showQuestion();
    };

    // Запускаем таймер на этот вопрос
    startQuestionTimer();
}

// --- Сохранение ответа ---
function saveAnswer() {
    const selected = document.querySelector('input[name="current_q"]:checked');
    if (selected) {
        userAnswers.push(parseInt(selected.value));
    } else {
        userAnswers.push(-1); // -1 означает, что ответ не выбран
    }
}

// --- Таймер на вопрос ---
function startQuestionTimer() {
    const timerDisplay = document.getElementById('timer-display');
    timeLeft = 15;
    timerDisplay.classList.remove('hidden');
    timerDisplay.textContent = `00:${timeLeft < 10 ? '0' + timeLeft : timeLeft}`;
    timerDisplay.style.color = '#f87171';

    clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `00:${timeLeft < 10 ? '0' + timeLeft : timeLeft}`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            // Время вышло! Автоматически сохраняем пустой ответ и идем дальше
            saveAnswer(); 
            currentQuestionIndex++;
            showQuestion(); // Переход к следующему вопросу
        }
    }, 1000);
}

// --- Завершение теста ---
function finishTest() {
    clearInterval(timerInterval);
    document.getElementById('timer-display').classList.add('hidden');
    document.getElementById('test-next-btn').classList.add('hidden');

    const data = testData[currentDiscipline];
    let correctCount = 0;

    // Сверяем ответы
    data.forEach((q, index) => {
        if (userAnswers[index] === q.correct) {
            correctCount++;
        }
    });

    const resultMsg = document.getElementById('result-message');
    const questionsList = document.getElementById('questions-list');
    
    questionsList.innerHTML = ''; // Убираем вопросы
    resultMsg.classList.remove('hidden');

    if (correctCount === data.length) {
        resultMsg.textContent = `Отлично! Вы ответили правильно на все ${data.length} вопросов. Тест сдан.`;
        resultMsg.style.color = "#4ade80";
    } else {
        resultMsg.textContent = `Вы ответили правильно на ${correctCount} из ${data.length}. Попробуйте еще раз.`;
        resultMsg.style.color = "#f87171";
    }
}

// --- Закрытие модального окна ---
function closeModal() {
    clearInterval(timerInterval);
    document.getElementById('timer-display').classList.add('hidden');
    document.getElementById('discipline-modal').classList.add('hidden');
}

// --- Переключение темы ---
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'light') {
    document.body.classList.add('light');
    themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    themeToggle.textContent = isLight ? '☀️' : '🌙';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
});
