document.addEventListener('DOMContentLoaded', function() {
    // Variables del juego
    let currentQuestion = {};
    let currentTeam = 1; // 1 o 2
    let team1Score = 0;
    let team2Score = 0;
    let team1Strikes = 0;
    let team2Strikes = 0;
    let timerInterval;
    let timeLeft = 30; // 30 segundos por turno
    let gameQuestions = [];
    let currentQuestionIndex = 0;
    let answeredAnswers = [];
    let revealMode = false;
    let revealedAnswers = []; // Para llevar cuenta de las respuestas reveladas en modo revelar

    // Elementos DOM
    const team1Element = document.getElementById('team1');
    const team2Element = document.getElementById('team2');
    const team1ScoreElement = team1Element.querySelector('.score');
    const team2ScoreElement = team2Element.querySelector('.score');
    const team1StrikesElement = team1Element.querySelector('.strikes');
    const team2StrikesElement = team2Element.querySelector('.strikes');
    const questionElement = document.getElementById('current-question');
    const answersContainer = document.querySelector('.answers-container');
    const timerBar = document.querySelector('.timer-bar');
    const correctSound = document.getElementById('correct-sound');
    const errorSound = document.getElementById('error-sound');
    const stealSound = document.getElementById('steal-sound');
    const winnerSound = document.getElementById('winner-sound');
    const startSound = document.getElementById('start-sound');
    const transitionSound = document.getElementById('transition-sound');
    const timerSound = document.getElementById('timer-sound');

    // Botones de control
    const correctBtn = document.getElementById('correct-answer');
    const wrongBtn = document.getElementById('wrong-answer');
    const stealBtn = document.getElementById('steal-points');
    const revealBtn = document.getElementById('reveal-answers');
    const nextRoundBtn = document.getElementById('next-round');

    // Inicializar el juego
    function initGame() {
        // Cargar equipos
        const team1Data = JSON.parse(localStorage.getItem('team1'));
        const team2Data = JSON.parse(localStorage.getItem('team2'));

        team1Element.querySelector('h2').textContent = team1Data.name;
        team2Element.querySelector('h2').textContent = team2Data.name;

        // Cargar preguntas según el modo
        const gameMode = localStorage.getItem('gameMode');
        if (gameMode === 'custom') {
            const selectedQuestions = JSON.parse(localStorage.getItem('selectedQuestions'));
            const customQuestions = JSON.parse(localStorage.getItem('customQuestions'));
            gameQuestions = selectedQuestions.map(index => customQuestions[index]);
        } else {
            // Cargar preguntas predefinidas
            gameQuestions = predefinedQuestions;
        }

        // Configurar primera pregunta
        loadQuestion(0);

        // Iniciar primer turno
        startTurn();

        // Reproducir sonido de transición en lugar de inicio
        transitionSound.play();
    }

    // Preguntas predefinidas
    // Preguntas sencillas de cultura general
    const predefinedQuestions = [{

            text: "Superhéroes famosos",
            answers: [
                { text: "Spider-Man", votes: 35 },
                { text: "Superman", votes: 25 },
                { text: "Batman", votes: 15 },
                { text: "Iron Man", votes: 10 },
                { text: "Capitán América", votes: 7 }
            ]
        },
        {
            text: "Bebidas comunes",
            answers: [
                { text: "Agua", votes: 35 },
                { text: "Coca-Cola", votes: 25 },
                { text: "Café", votes: 15 },
                { text: "Jugo", votes: 10 },
                { text: "Leche", votes: 7 }
            ]
        },
        {
            text: "Ciudades de México",
            answers: [
                { text: "Ciudad de México", votes: 35 },
                { text: "Monterrey", votes: 25 },
                { text: "Guadalajara", votes: 15 },
                { text: "Puebla", votes: 10 },
                { text: "Cancún", votes: 7 }
            ]
        },
        {
            text: "Aplicaciones de redes sociales",
            answers: [
                { text: "Facebook", votes: 35 },
                { text: "Instagram", votes: 25 },
                { text: "TikTok", votes: 15 },
                { text: "Twitter/X", votes: 10 },
                { text: "WhatsApp", votes: 7 }
            ]
        },
        {
            text: "Comidas mexicanas típicas",
            answers: [
                { text: "Tacos", votes: 35 },
                { text: "Tamales", votes: 25 },
                { text: "Pozole", votes: 15 },
                { text: "Enchiladas", votes: 10 },
                { text: "Mole", votes: 7 }
            ]
        },
        {
            text: "Comidas dulces",
            answers: [
                { text: "Pastel", votes: 35 },
                { text: "Helado", votes: 25 },
                { text: "Galletas", votes: 15 },
                { text: "Chocolate", votes: 10 },
                { text: "Dulces", votes: 7 }
            ]
        },
        {
            text: "Países de Europa",
            answers: [
                { text: "España", votes: 35 },
                { text: "Francia", votes: 25 },
                { text: "Alemania", votes: 15 },
                { text: "Italia", votes: 10 },
                { text: "Portugal", votes: 7 }
            ]
        },
        {
            text: "Festividades importantes",
            answers: [
                { text: "Navidad", votes: 35 },
                { text: "Año Nuevo", votes: 25 },
                { text: "Día de Muertos", votes: 15 },
                { text: "Pascua", votes: 10 },
                { text: "San Valentín", votes: 7 }
            ]
        },
        {
            text: "Nombres de pila más comunes",
            answers: [
                { text: "Juan", votes: 35 },
                { text: "María", votes: 25 },
                { text: "José", votes: 15 },
                { text: "Ana", votes: 10 },
                { text: "Luis", votes: 7 }
            ]
        },
        {
            text: "Películas de superhéroes",
            answers: [
                { text: "Avengers", votes: 35 },
                { text: "Spider-Man", votes: 25 },
                { text: "Batman", votes: 15 },
                { text: "Superman", votes: 10 },
                { text: "Iron Man", votes: 7 }
            ]
        },
        {
            text: "Marcas de celulares",
            answers: [
                { text: "Apple", votes: 35 },
                { text: "Samsung", votes: 25 },
                { text: "Huawei", votes: 15 },
                { text: "Xiaomi", votes: 10 },
                { text: "Motorola", votes: 7 }
            ]
        }
    ];




    function loadQuestion(index) {
        currentQuestion = gameQuestions[index];
        questionElement.textContent = currentQuestion.text;
        revealedAnswers = []; // Reiniciar contador de respuestas reveladas
        renderAnswers();

    }

    function renderAnswers() {
        answersContainer.innerHTML = '';
        answeredAnswers = [];

        currentQuestion.answers.forEach((answer, index) => {
            const answerElement = document.createElement('div');
            answerElement.className = 'answer-item';
            answerElement.innerHTML = `
                <div class="answer-inner">
                    <div class="answer-front">
                        <div class="answer-number">${index + 1}</div>
                    </div>
                    <div class="answer-back">
                        <div class="answer-text">${answer.text}</div>
                        <div class="answer-votes">${answer.votes}</div>
                    </div>
                </div>
            `;

            // Configurar el evento de clic
            setupAnswerClickHandler(answerElement, answer, index);

            answersContainer.appendChild(answerElement);
        });
    }

    // Configurar el manejador de clic para las respuestas
    function setupAnswerClickHandler(answerElement, answer, index) {
        answerElement.addEventListener('click', () => {
            if (revealMode) {
                // En modo revelar, mostrar la respuesta sin sumar puntos
                if (!answerElement.classList.contains('flipped')) {
                    answerElement.classList.add('flipped');
                    revealedAnswers.push(answer); // Añadir a respuestas reveladas
                    // Reproducir sonido de robo en lugar de transición
                    stealSound.play();

                    // Verificar si se han revelado todas las respuestas
                    checkAllRevealed();
                }
                return;
            }

            // Lógica normal del juego
            if (answerElement.classList.contains('flipped')) return;

            answerElement.classList.add('flipped');
            answeredAnswers.push(answer);

            // Calcular puntos y actualizar marcador
            const points = answer.votes;
            if (currentTeam === 1) {
                team1Score += points;
                team1ScoreElement.textContent = team1Score;
            } else {
                team2Score += points;
                team2ScoreElement.textContent = team2Score;
            }

            // Reproducir sonido de acierto
            correctSound.play();

            // Verificar si se ha ganado la ronda
            checkRoundWin();
        });
    }

    function startTurn() {
        // Resetear timer
        timeLeft = 30;
        timerBar.style.width = '100%';

        // Resaltar equipo actual
        team1Element.classList.toggle('active', currentTeam === 1);
        team2Element.classList.toggle('active', currentTeam === 2);

        // Iniciar temporizador
        clearInterval(timerInterval);
        timerInterval = setInterval(updateTimer, 1000);
    }

    function updateTimer() {
        timeLeft--;
        timerBar.style.width = (timeLeft / 30 * 100) + '%';

        // Reproducir sonido de alerta cuando quedan 5 segundos
        if (timeLeft === 5) {
            timerSound.play();
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            // Time's up!
            wrongAnswer();
        }
    }

    function wrongAnswer() {
        errorSound.play();

        if (currentTeam === 1) {
            team1Strikes++;
            updateStrikes(team1StrikesElement, team1Strikes);
        } else {
            team2Strikes++;
            updateStrikes(team2StrikesElement, team2Strikes);
        }

        // Cambiar turno
        currentTeam = currentTeam === 1 ? 2 : 1;
        startTurn();
    }

    function updateStrikes(strikesElement, strikes) {
        const strikeDots = strikesElement.querySelectorAll('.strike');
        for (let i = 0; i < strikeDots.length; i++) {
            if (i < strikes) {
                strikeDots[i].classList.add('used');
            } else {
                strikeDots[i].classList.remove('used');
            }
        }
    }

    function checkRoundWin() {
        // Verificar si todas las respuestas han sido reveladas
        const allRevealed = answeredAnswers.length === currentQuestion.answers.length;

        if (allRevealed) {
            // Ronda terminada
            clearInterval(timerInterval);
            nextRoundBtn.style.display = 'block';
        }
    }

    // Función para verificar si se han revelado todas las respuestas en modo revelar
    function checkAllRevealed() {
        // Verificar si todas las respuestas han sido reveladas en modo revelar
        const allRevealed = revealedAnswers.length === currentQuestion.answers.length;

        if (allRevealed) {
            // Mostrar botón de siguiente ronda
            nextRoundBtn.style.display = 'block';
        }
    }

    // Función para activar el modo revelar
    function activateRevealMode() {
        revealMode = true;

        // Pausar el temporizador
        clearInterval(timerInterval);

        // Cambiar estilo del botón
        revealBtn.classList.add('active');
        revealBtn.innerHTML = 'Modo Revelar Activado';
    }

    // Función para desactivar el modo revelar
    function deactivateRevealMode() {
        revealMode = false;

        // Restaurar botón de revelar
        revealBtn.classList.remove('active');
        revealBtn.innerHTML = 'Revelar Respuestas';

        // Reiniciar temporizador
        startTurn();
    }

    // Event listeners para los botones de control
    correctBtn.addEventListener('click', function() {
        // Simular una respuesta correcta (para testing)
        const randomAnswer = currentQuestion.answers.find(a => !answeredAnswers.includes(a));
        if (randomAnswer) {
            // Encontrar el elemento de respuesta y clickearlo
            const answerIndex = currentQuestion.answers.indexOf(randomAnswer);
            const answerElement = answersContainer.children[answerIndex];
            answerElement.click();
        }
    });

    wrongBtn.addEventListener('click', function() {
        wrongAnswer();
    });

    stealBtn.addEventListener('click', function() {
        stealSound.play();
        // Robar puntos: cambiar turno y dar puntos al otro equipo
        currentTeam = currentTeam === 1 ? 2 : 1;
        // Aquí se podrían implementar las reglas específicas de robo
        startTurn();
    });

    revealBtn.addEventListener('click', function() {
        if (revealMode) {
            deactivateRevealMode();
        } else {
            activateRevealMode();
        }
    });

    nextRoundBtn.addEventListener('click', function() {
        transitionSound.play();
        // Pasar a la siguiente pregunta
        currentQuestionIndex++;
        if (currentQuestionIndex < gameQuestions.length) {
            loadQuestion(currentQuestionIndex);

            // Asegurarse de desactivar el modo revelar si estaba activo
            if (revealMode) {
                deactivateRevealMode();
            } else {
                startTurn();
            }
        } else {
            // Juego terminado, ir a resultados
            // Guardar puntuaciones finales
            localStorage.setItem('team1Score', team1Score);
            localStorage.setItem('team2Score', team2Score);
            window.location.href = 'results.html';
        }
    });
    document.addEventListener('keydown', function(event) {
        const key = event.key.toLowerCase();

        // Teclas numéricas → Revelar respuestas
        if (!isNaN(key) && key !== '0') {
            const answerIndex = parseInt(key) - 1; // 1 → índice 0, 2 → índice 1...
            if (answerIndex >= 0 && answerIndex < currentQuestion.answers.length) {
                const answerElement = answersContainer.children[answerIndex];
                if (answerElement && !answerElement.classList.contains('flipped')) {
                    answerElement.click(); // Usa la misma lógica del clic manual
                }
            }
        }

        // Tecla "x" → Respuesta incorrecta
        if (key === 'x') {
            wrongAnswer();
        }

        // Tecla "o" → Activar/Desactivar modo revelar
        if (key === 'o') {
            if (revealMode) {
                deactivateRevealMode();
            } else {
                activateRevealMode();
            }
        }

        // Tecla "q" → Pasar a la siguiente ronda
        if (key === 'q') {
            nextRoundBtn.click();
        }
    });

    // Iniciar el juego
    initGame();
});