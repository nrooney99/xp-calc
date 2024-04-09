document.getElementById('expCalculator').addEventListener('submit', function (e) {
    e.preventDefault();

    const currentLevel = parseInt(document.getElementById('currentLevel').value);
    const inputMode = document.getElementById('inputMode').value;
    const targetLevel = parseInt(document.getElementById('targetLevel').value);

    let currentExp = 0;
    if (inputMode === 'points') {
        currentExp = parseInt(document.getElementById('currentExp').value);
    } else if (inputMode === 'percentage') {
        const percentage = parseInt(document.getElementById('currentExp').value);
        currentExp = Math.round(calculateExperience(levels, currentLevel, currentLevel + 1) * (percentage / 100));
    }

    if (currentLevel >= targetLevel) {
        document.getElementById('result').innerHTML = 'El nivel actual debe ser menor que el nivel deseado.';
        return;
    }

    fetch('data.csv')
        .then(response => response.text())
        .then(data => {
            const levels = parseCSV(data);
            let totalExpNeeded = 0;
            let expNeeded = 0;
            for (let level = currentLevel; level < targetLevel; level++) {
                expNeeded = levels[level] - currentExp;
                totalExpNeeded += expNeeded;
                currentExp = 0; // Después del primer nivel, la experiencia actual se reinicia
            }
            document.getElementById('result').innerHTML += `La cantidad total de experiencia necesaria hasta el nivel ${targetLevel} es: ${totalExpNeeded}`;

        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
            document.getElementById('result').innerHTML = 'Error al obtener los datos.';
        });
});



function parseCSV(csv) {
    const lines = csv.split('\n');
    const levels = {};

    lines.forEach(line => {
        const [level, exp] = line.split(',');
        levels[parseInt(level)] = parseInt(exp);
    });

    return levels;
}

function calculateExperience(levels, currentLevel, targetLevel) {
    let totalExp = 0;

    for (let level = currentLevel; level < targetLevel; level++) {
        totalExp += levels[level];
    }

    return totalExp;
}
const toggleDarkModeButton = document.getElementById('toggleDarkMode');

toggleDarkModeButton.addEventListener('click', function () {
    const body = document.body;
    body.classList.toggle('dark-mode');

    // Guardar preferencia del usuario en el almacenamiento local
    const isDarkModeEnabled = body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkModeEnabled);
});

// Cargar el estado del modo nocturno al cargar la página
window.addEventListener('load', function () {
    const isDarkModeEnabled = localStorage.getItem('darkMode') === 'true';
    const body = document.body;
    if (isDarkModeEnabled) {
        body.classList.add('dark-mode');
    }
});
