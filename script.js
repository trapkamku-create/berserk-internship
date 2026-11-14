// --- Стартовый экран ---
document.getElementById('start-btn').addEventListener('click', () => {
    document.getElementById('splash-screen').style.display = 'none';
    document.getElementById('main-portal').classList.remove('hidden');
});

// --- Контент для дисциплин (Вы можете поменять текст позже) ---
const disciplines = {
    law: {
        title: "Законодательство",
        text: "<p>Здесь будет текст лекции по Законодательству.</p><br><p>Основные пункты Устава УФСИН, права и обязанности сотрудника ОСН.</p>"
    },
    med: {
        title: "Тактическая медицина",
        text: "<p>Здесь будет текст лекции по Тактической медицине.</p><br><p>Алгоритм действий при ранении: остановка кровотечения, наложение жгута, эвакуация.</p>"
    },
    negotiations: {
        title: "Переговоры",
        text: "<p>Здесь будет текст лекции по Переговорам.</p><br><p>Правила общения с преступником, захватившим заложников. Выявление психологического портрета.</p>"
    },
    assault: {
        title: "Штурм",
        text: "<p>Здесь будет текст лекции по Штурму.</p><br><p>Тактика входа в помещение, распределение ролей в группе (щит, штурм, прикрытие).</p>"
    },
    bomb: {
        title: "Разминирование СВУ",
        text: "<p>Здесь будет текст лекции по Разминированию СВУ.</p><br><p>Признаки взрывного устройства, правила эвакуации, работа сапера.</p>"
    }
};

// --- Открытие дисциплины ---
function openDiscipline(id) {
    const modal = document.getElementById('discipline-modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');

    if (disciplines[id]) {
        title.textContent = disciplines[id].title;
        body.innerHTML = disciplines[id].text;
        modal.classList.remove('hidden');
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
