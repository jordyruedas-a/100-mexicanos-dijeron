document.addEventListener('DOMContentLoaded', function() {
    const team1Result = document.getElementById('result-team1');
    const team2Result = document.getElementById('result-team2');
    const team1ScoreElement = team1Result.querySelector('.final-score');
    const team2ScoreElement = team2Result.querySelector('.final-score');
    const winnerText = document.getElementById('winner-text');
    const playAgainBtn = document.getElementById('play-again');
    const mainMenuBtn = document.getElementById('main-menu');
    const shareBtn = document.getElementById('share-results');
    const winnerSound = document.getElementById('winner-sound');
    const fireworksSound = document.getElementById('fireworks-sound');

    // Obtener puntuaciones del juego
    const team1Score = localStorage.getItem('team1Score') || 0;
    const team2Score = localStorage.getItem('team2Score') || 0;

    // Obtener nombres de equipos
    const team1Data = JSON.parse(localStorage.getItem('team1'));
    const team2Data = JSON.parse(localStorage.getItem('team2'));

    // Mostrar puntuaciones
    team1ScoreElement.textContent = team1Score;
    team2ScoreElement.textContent = team2Score;

    // Mostrar nombres de equipos
    team1Result.querySelector('h2').textContent = team1Data.name;
    team2Result.querySelector('h2').textContent = team2Data.name;

    // Determinar ganador
    if (parseInt(team1Score) > parseInt(team2Score)) {
        team1Result.classList.add('winner');
        winnerText.textContent = `¡${team1Data.name} Gana!`;
    } else if (parseInt(team2Score) > parseInt(team1Score)) {
        team2Result.classList.add('winner');
        winnerText.textContent = `¡${team2Data.name} Gana!`;
    } else {
        winnerText.textContent = '¡Empate!';
    }

    // Reproducir sonidos de victoria
    winnerSound.play();
    fireworksSound.play();

    // Botones de acción
    playAgainBtn.addEventListener('click', function() {
        // Reiniciar el juego
        window.location.href = 'selection.html';
    });

    mainMenuBtn.addEventListener('click', function() {
        // Volver al menú principal
        window.location.href = 'index.html';
    });

    shareBtn.addEventListener('click', function() {
        // Compartir resultados (implementación básica)
        const shareText = `¡Jugué 100 Mexicanos Dijeron y ${winnerText.textContent} Puntuación: ${team1Data.name} ${team1Score} - ${team2Data.name} ${team2Score}`;
        alert(`Compartir resultados: ${shareText}`);
        // En una implementación real, se usaría la Web Share API si está disponible
    });
});