document.addEventListener('DOMContentLoaded', function() {
    const answersList = document.getElementById('answers-list');
    const addAnswerBtn = document.getElementById('add-answer');
    const totalVotesSpan = document.getElementById('total-votes');
    const votesError = document.getElementById('votes-error');
    const saveBtn = document.getElementById('save-btn');
    const previewBtn = document.getElementById('preview-btn');
    const backBtn = document.getElementById('back-to-menu');
    const modal = document.getElementById('preview-modal');
    const closeModal = document.querySelector('.close');
    const previewContent = document.getElementById('preview-content');

    let answerCount = 0;

    // Volver al menú principal
    backBtn.addEventListener('click', function() {
        window.location.href = 'index.html';
    });

    // Añadir respuesta
    addAnswerBtn.addEventListener('click', function() {
        if (answerCount >= 10) {
            alert('Máximo 10 respuestas permitidas');
            return;
        }

        answerCount++;
        const answerItem = document.createElement('div');
        answerItem.className = 'answer-item';
        answerItem.innerHTML = `
            <input type="text" class="answer-text" placeholder="Respuesta ${answerCount}">
            <input type="number" class="answer-votes" placeholder="Votos" min="0" max="100">
            <button class="remove-answer">×</button>
        `;

        answersList.appendChild(answerItem);

        // Añadir evento al botón de eliminar
        const removeBtn = answerItem.querySelector('.remove-answer');
        removeBtn.addEventListener('click', function() {
            answersList.removeChild(answerItem);
            answerCount--;
            updateVotesTotal();
        });

        // Añadir evento para actualizar votos
        const votesInput = answerItem.querySelector('.answer-votes');
        votesInput.addEventListener('input', updateVotesTotal);
    });

    // Actualizar total de votos
    function updateVotesTotal() {
        let total = 0;
        const votesInputs = document.querySelectorAll('.answer-votes');

        votesInputs.forEach(input => {
            const value = parseInt(input.value) || 0;
            total += value;
        });

        totalVotesSpan.textContent = total;

        if (total > 100) {
            votesError.textContent = '¡Demasiados votos! El total no puede exceder 100.';
            saveBtn.disabled = true;
        } else if (total < 100 && answerCount > 0) {
            votesError.textContent = `Faltan ${100 - total} votos para completar 100.`;
            saveBtn.disabled = true;
        } else if (total === 100) {
            votesError.textContent = '¡Votos completados! Puedes guardar la pregunta.';
            votesError.style.color = '#009900';
            saveBtn.disabled = false;
        } else {
            votesError.textContent = '';
            saveBtn.disabled = true;
        }
    }

    // Vista previa
    previewBtn.addEventListener('click', function() {
        const questionText = document.getElementById('question-text').value;
        const category = document.getElementById('question-category').value;

        if (!questionText) {
            alert('Por favor, escribe una pregunta primero.');
            return;
        }

        let previewHTML = `<h3>${questionText}</h3>`;
        if (category) {
            previewHTML += `<p><strong>Categoría:</strong> ${category}</p>`;
        }

        previewHTML += '<h4>Respuestas:</h4><ul>';

        const answerItems = document.querySelectorAll('.answer-item');
        answerItems.forEach(item => {
            const text = item.querySelector('.answer-text').value || '[Sin texto]';
            const votes = item.querySelector('.answer-votes').value || '0';
            previewHTML += `<li>${text} - <strong>${votes} votos</strong></li>`;
        });

        previewHTML += '</ul>';
        previewContent.innerHTML = previewHTML;
        modal.style.display = 'block';
    });

    // Cerrar modal
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Guardar pregunta
    saveBtn.addEventListener('click', function() {
        const questionText = document.getElementById('question-text').value;
        const category = document.getElementById('question-category').value;

        if (!questionText) {
            alert('Por favor, escribe una pregunta.');
            return;
        }

        const answers = [];
        const answerItems = document.querySelectorAll('.answer-item');

        answerItems.forEach(item => {
            const text = item.querySelector('.answer-text').value;
            const votes = parseInt(item.querySelector('.answer-votes').value) || 0;

            if (text) {
                answers.push({ text, votes });
            }
        });

        if (answers.length === 0) {
            alert('Por favor, añade al menos una respuesta.');
            return;
        }

        // Guardar en localStorage (en una app real, se enviaría a un servidor)
        const question = {
            text: questionText,
            category: category,
            answers: answers,
            date: new Date().toISOString()
        };

        let savedQuestions = JSON.parse(localStorage.getItem('customQuestions')) || [];
        savedQuestions.push(question);
        localStorage.setItem('customQuestions', JSON.stringify(savedQuestions));

        alert('¡Pregunta guardada correctamente!');

        // Limpiar formulario
        document.getElementById('question-text').value = '';
        document.getElementById('question-category').selectedIndex = 0;
        answersList.innerHTML = '';
        answerCount = 0;
        totalVotesSpan.textContent = '0';
        votesError.textContent = '';
        saveBtn.disabled = true;
    });
});