const fs = require('fs');
const path = require('path');

// Читает models.html, убирает теги <script> и возвращает нужные классы
function loadClasses() {
    // Путь к нужнофу файлц
    const file = path.join(__dirname, '../script/session/models.html');
    const code = fs.readFileSync(file, 'utf8').replace(/<\/?script>/g, '');
    return new Function(code + '; return { Exercise, Workout, CompletedExercise, CompletedWorkout, WorkoutSession };')();
}

const { Exercise, Workout, CompletedExercise, CompletedWorkout, WorkoutSession } = loadClasses();