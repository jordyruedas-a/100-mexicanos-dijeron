document.addEventListener('DOMContentLoaded', function() {
    const backBtn = document.getElementById('back-to-menu');
    const predefinedBtn = document.getElementById('predefined-mode');
    const customBtn = document.getElementById('custom-mode');
    const team1Input = document.getElementById('team1-name');
    const team2Input = document.getElementById('team2-name');
    const customQuestionsContainer = document.getElementById('custom-questions-container');
    const customQuestionsList = document.getElementById('custom-questions-list');
    const startBtn = document.getElementById('start-game');

    let selectedQuestions = [];
    let gameMode = 'predefined'; // 'predefined' or 'custom'

    // Volver al menú principal
    backBtn.addEventListener('click', function() {
        window.location.href = 'index.html';
    });

    // Cambiar modo de juego
    predefinedBtn.addEventListener('click', function() {
        gameMode = 'predefined';
        predefinedBtn.classList.add('active');
        customBtn.classList.remove('active');
        customQuestionsContainer.style.display = 'none';
        validateForm();
    });

    customBtn.addEventListener('click', function() {
        gameMode = 'custom';
        customBtn.classList.add('active');
        predefinedBtn.classList.remove('active');
        customQuestionsContainer.style.display = 'block';
        loadCustomQuestions();
        validateForm();
    });

    // Validar formulario
    team1Input.addEventListener('input', validateForm);
    team2Input.addEventListener('input', validateForm);

    function validateForm() {
        const team1Valid = team1Input.value.trim() !== '';
        const team2Valid = team2Input.value.trim() !== '';

        if (gameMode === 'predefined') {
            startBtn.disabled = !(team1Valid && team2Valid);
        } else {
            startBtn.disabled = !(team1Valid && team2Valid && selectedQuestions.length > 0);
        }
    }

    // Cargar preguntas personalizadas
    function loadCustomQuestions() {
        const customQuestions = JSON.parse(localStorage.getItem('customQuestions')) || [];
        customQuestionsList.innerHTML = '';

        if (customQuestions.length === 0) {
            customQuestionsList.innerHTML = '<p>No tienes preguntas guardadas. Ve al editor para crear algunas.</p>';
            return;
        }

        customQuestions.forEach((question, index) => {
            const questionItem = document.createElement('div');
            questionItem.className = 'question-item';
            questionItem.dataset.index = index;
            questionItem.innerHTML = `
                <h3>${question.text}</h3>
                <p>Categoría: ${question.category || 'Sin categoría'}</p>
                <p>Respuestas: ${question.answers.length}</p>
            `;

            questionItem.addEventListener('click', function() {
                const questionIndex = parseInt(this.dataset.index);
                const isSelected = this.classList.contains('selected');

                if (isSelected) {
                    this.classList.remove('selected');
                    selectedQuestions = selectedQuestions.filter(i => i !== questionIndex);
                } else {
                    this.classList.add('selected');
                    selectedQuestions.push(questionIndex);
                }

                validateForm();
            });

            customQuestionsList.appendChild(questionItem);
        });
    }

    // Iniciar juego
    startBtn.addEventListener('click', function() {
        const team1Name = team1Input.value.trim();
        const team2Name = team2Input.value.trim();

        // Guardar datos en localStorage para usar en el juego
        localStorage.setItem('team1', JSON.stringify({
            name: team1Name,
            score: 0,
            strikes: 0
        }));

        localStorage.setItem('team2', JSON.stringify({
            name: team2Name,
            score: 0,
            strikes: 0
        }));

        localStorage.setItem('gameMode', gameMode);

        if (gameMode === 'custom') {
            localStorage.setItem('selectedQuestions', JSON.stringify(selectedQuestions));
        }

        // Redirigir al juego
        window.location.href = 'game.html';
    });
});