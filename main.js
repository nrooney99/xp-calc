document.getElementById('expCalculator').addEventListener('submit', function (e) {
    e.preventDefault();

    const currentLevel = parseInt(document.getElementById('currentLevel').value);
    const currentExp = parseInt(document.getElementById('currentExp').value);
    const targetLevel = parseInt(document.getElementById('targetLevel').value);

    if (currentLevel >= targetLevel) {
        document.getElementById('result').innerHTML = 'El nivel actual debe ser menor que el nivel deseado.';
        return;
    }

    fetch('data.csv')
        .then(response => response.text())
        .then(data => {
            const levels = parseCSV(data);
            const expNeeded = calculateExperience(levels, currentLevel, targetLevel) - currentExp;
            if (expNeeded > 0) {
                document.getElementById('result').innerHTML = `La cantidad de experiencia necesaria es: ${expNeeded}`;
            } else {
                document.getElementById('result').innerHTML = '¡Ya tienes suficiente experiencia para alcanzar ese nivel!';
            }
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
