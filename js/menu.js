document.addEventListener('DOMContentLoaded', function() {
    // Reproducir sonido de inicio
    const startSound = document.getElementById('start-sound');
    startSound.volume = 0.6;
    startSound.play();

    // Navegación entre pantallas
    document.getElementById('play-game').addEventListener('click', function() {
        window.location.href = 'selection.html';
    });

    document.getElementById('create-questions').addEventListener('click', function() {
        window.location.href = 'editor.html';
    });

    document.getElementById('quick-round').addEventListener('click', function() {
        // Modo rápido con preguntas aleatorias
        localStorage.setItem('gameMode', 'quick');
        window.location.href = 'selection.html';
    });

    document.getElementById('settings').addEventListener('click', function() {
        alert('Configuración. Implementación pendiente.');
    });

    document.getElementById('instructions').addEventListener('click', function() {
        alert('Instrucciones del juego:\n\n1. Dos equipos compiten por adivinar las respuestas más populares\n2. Cada ronda tiene una pregunta con hasta 10 respuestas\n3. Los equipos alternan turnos para dar respuestas\n4. Gana el equipo con más puntos al final de todas las rondas');
    });
});