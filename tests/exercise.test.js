const fs = require('fs');
const path = require('path');

// Читает models.html, убирает теги <script> и возвращает нужные классы
function loadClasses() {
    // Путь к нужнофу файлц
    const file = path.join(__dirname, '../script/session/models.html');
    const code = fs.readFileSync(file, 'utf8').replace(/<\/?script>/g, '');
    return new Function(code + '; return { Exercise };')();
}

const { Exercise } = loadClasses();

// Проверка создания обькта упражнения
describe("Exercise.constructor", ()=>{
    test("сохраняет все переданные поля", ()=>{
        let exercise = new Exercise({
            name: "Отжимания",
            reps: 10,
            weight: 100,
            time: 25,
            id: 1,
            id_e: 12,
            photo_small: "https://example.com/small.jpg",
            photo_large: "https://example.com/large.jpg",
        })

        expect(exercise.name).toBe("Отжимания");
        expect(exercise.reps).toBe(10);
        expect(exercise.weight).toBe(100);
        expect(exercise.time).toBe(25);
        expect(exercise.id).toBe(1);
        expect(exercise.idE).toBe(12);
        expect(exercise.photoLarge).toBe("https://example.com/large.jpg");
        expect(exercise.photoSmall).toBe("https://example.com/small.jpg");
        expect(exercise.photoLarge).toBe("https://example.com/large.jpg");
    })

    test("порядок ключей не влияет на результат", ()=>{
        let exercise_data = {
            name: "Отжимания",
            reps: 10,
            weight: 100,
            time: 25,
            id: 1,
            id_e: 12,
            photo_small: "https://example.com/small.jpg",
            photo_large: "https://example.com/large.jpg",
        }

        let revers = Object.fromEntries(Object.entries(exercise_data).reverse())
        expect(new Exercise(exercise_data)).toEqual(new Exercise(revers))
    })

    test("Количество сетов по умолчанию 0", ()=>{
        let exercise = new Exercise({
            id_e: 12,
            name: "Отжимания",
            reps: 10,
            weight: 100,
            time: 25,
            id: 1,
            photo_small: "https://example.com/small.jpg",
            photo_large: "https://example.com/large.jpg",
        })
        expect(exercise.sets).toBe(0)
    })
})