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
            correct: 0 // индекс правильного ответа (0 - первый вариант)
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
    // Для остальных дисциплин заглушки (можно потом добавить вопросы)
    med: "Тест по тактической медицине в разработке.",
    negotiations: "Тест по переговорам в разработке.",
    assault: "Тест по штурму в разработке.",
    bomb: "Тест по разминированию в разработке."
};

let currentDiscipline = null;

// --- Открытие дисциплины ---
function openDiscipline(id) {
    currentDiscipline = id;
    const modal = document.getElementById('discipline-modal');
    const title = document.getElementById('modal-title');
    const startBtn = document.getElementById('start-test-btn');
    const testContainer = document.getElementById('test-container');
    const closeBtn = document.getElementById('close-modal-btn');

    // Сброс состояния модального окна
    testContainer.classList.add('hidden');
    document.getElementById('result-message').classList.add('hidden');
    
    // Устанавливаем заголовок в зависимости от ID
    const titles = {
        law: "Законодательство",
        med: "Тактическая медицина",
        negotiations: "Переговоры",
        assault: "Штурм",
        bomb: "Разминирование СВУ"
    };
    title.textContent = titles[id] || "Дисциплина";

    // Если есть вопросы, показываем кнопку "Начать тест"
    if (Array.isArray(testData[id])) {
        startBtn.classList.remove('hidden');
        startBtn.textContent = "Начать тест";
    } else {
        startBtn.classList.remove('hidden');
        startBtn.textContent = "Начать тест";
    }

    modal.classList.remove('hidden');
}

// --- Запуск теста ---
function startTest() {
    const startBtn = document.getElementById('start-test-btn');
    const testContainer = document.getElementById('test-container');
    const questionsList = document.getElementById('questions-list');

    startBtn.classList.add('hidden');
    testContainer.classList.remove('hidden');
    questionsList.innerHTML = '';

    const data = testData[currentDiscipline];

    // Если это заглушка (строка), выводим текст
    if (typeof data === 'string') {
        questionsList.innerHTML = `<p style="color: var(--text-color); text-align: center;">${data}</p>`;
        return;
    }

    // Генерация вопросов
    data.forEach((q, index) => {
        const block = document.createElement('div');
        block.className = 'question-block';
        
        let optionsHtml = '';
        q.options.forEach((opt, optIndex) => {
            optionsHtml += `
                <label class="option-label">
                    <input type="radio" name="q${index}" value="${optIndex}">
                    ${opt}
                </label>
            `;
        });

        block.innerHTML = `
            <div class="question-text">${index + 1}. ${q.question}</div>
            ${optionsHtml}
        `;
        questionsList.appendChild(block);
    });
}

// --- Проверка ответов ---
function checkAnswers() {
    const data = testData[currentDiscipline];
    if (typeof data === 'string') return; // Если это заглушка, ничего не проверяем

    let correctCount = 0;
    let total = data.length;

    data.forEach((q, index) => {
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        if (selected && parseInt(selected.value) === q.correct) {
            correctCount++;
        }
    });

    const resultMsg = document.getElementById('result-message');
    resultMsg.classList.remove('hidden');

    if (correctCount === total) {
        resultMsg.textContent = `Отлично! Вы ответили правильно на все ${total} вопросов. Тест сдан.`;
        resultMsg.style.color = "#4ade80"; // Зеленый
    } else {
        resultMsg.textContent = `Вы ответили правильно на ${correctCount} из ${total}. Попробуйте еще раз.`;
        resultMsg.style.color = "#f87171"; // Красный
    }
}

// --- Закрытие модального окна ---
function closeModal() {
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
