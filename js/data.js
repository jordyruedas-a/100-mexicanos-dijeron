// Datos predefinidos para el juego
const predefinedQuestions = [{
        text: "Menciona algo que la gente desayuna en domingo",
        category: "comida",
        answers: [
            { text: "Huevos", votes: 35 },
            { text: "Pancakes", votes: 25 },
            { text: "Cereal", votes: 15 },
            { text: "Fruta", votes: 10 },
            { text: "Tacos", votes: 8 },
            { text: "Chilaquiles", votes: 7 }
        ]
    },
    {
        text: "Menciona un deporte que se juegue con pelota",
        category: "deportes",
        answers: [
            { text: "Fútbol", votes: 40 },
            { text: "Básquetbol", votes: 25 },
            { text: "Béisbol", votes: 15 },
            { text: "Tenis", votes: 10 },
            { text: "Voleibol", votes: 7 },
            { text: "Rugby", votes: 3 }
        ]
    },
    {
        text: "Menciona un animal que viva en el mar",
        category: "naturaleza",
        answers: [
            { text: "Pez", votes: 30 },
            { text: "Tiburón", votes: 20 },
            { text: "Delfín", votes: 15 },
            { text: "Ballena", votes: 12 },
            { text: "Pulpo", votes: 10 },
            { text: "Cangrejo", votes: 8 },
            { text: "Tortuga", votes: 5 }
        ]
    },
    {
        text: "Menciona un color primario",
        category: "arte",
        answers: [
            { text: "Rojo", votes: 35 },
            { text: "Azul", votes: 30 },
            { text: "Amarillo", votes: 25 },
            { text: "Verde", votes: 10 }
        ]
    },
    {
        text: "Menciona un país de América del Sur",
        category: "geografía",
        answers: [
            { text: "Brasil", votes: 25 },
            { text: "Argentina", votes: 20 },
            { text: "Colombia", votes: 15 },
            { text: "Perú", votes: 12 },
            { text: "Chile", votes: 10 },
            { text: "Venezuela", votes: 8 },
            { text: "Ecuador", votes: 5 },
            { text: "Bolivia", votes: 5 }
        ]
    }
];

// Funciones para gestionar datos en localStorage
function saveCustomQuestion(question) {
    let customQuestions = JSON.parse(localStorage.getItem('customQuestions')) || [];
    customQuestions.push(question);
    localStorage.setItem('customQuestions', JSON.stringify(customQuestions));
}

function getCustomQuestions() {
    return JSON.parse(localStorage.getItem('customQuestions')) || [];
}

function getPredefinedQuestions() {
    return predefinedQuestions;
}

function saveGameState(state) {
    localStorage.setItem('gameState', JSON.stringify(state));
}

function getGameState() {
    return JSON.parse(localStorage.getItem('gameState')) || null;
}

function clearGameState() {
    localStorage.removeItem('gameState');
}