const fs = require('fs');
const path = require('path');

// Читает models.html, убирает теги <script> и возвращает нужные классы
function loadClasses() {
  // Путь к нужнофу файлц
  const file = path.join(__dirname, '../script/session/models.html');
  const code = fs.readFileSync(file, 'utf8').replace(/<\/?script>/g, '');
  return new Function(code + '; return { Exercise, Workout };')();
}

const { Exercise, Workout } = loadClasses();

// 1. Работа конструктора
describe("Workout.constructor", ()=>{
  test("сохраняет все переданные поля", ()=>{
    let workout_data = {
      id: 1, 
      name: "main", 
      archived: false, 
      time: 200, 
      exercises: [{
        id: 1,
        name: "Отжимания",
        reps: 10,
        weight: 100,
        time: 25,
        photo_small: "https://example.com/small.jpg",
        photo_large: "https://example.com/large.jpg",
      }]
    }

    let workout = new Workout(workout_data)
    expect(workout.id).toBe(1)
    expect(workout.name).toBe("main")
    expect(workout.archived).toBe(false)
    expect(workout.time).toBe(200)
    expect(workout.exercises.length).toBe(1)
  })

  test("все упражнения являются экземплярами Exercise", ()=>{
    let workout_data = {
      id: 1, 
      name: "main", 
      archived: false, 
      time: 200, 
      exercises: [{
        id: 1,
        name: "Отжимания",
        reps: 10,
        weight: 100,
        time: 25,
        photo_small: "https://example.com/small.jpg",
        photo_large: "https://example.com/large.jpg",
      },{
        id: 2,
        name: "Бег",
        reps: 10,
        weight: 110,
        time: 25,
        photo_small: "https://example.com/small.jpg",
        photo_large: "https://example.com/large.jpg",
      }]
    }

    let workout = new Workout(workout_data)
    expect(workout.exercises.every(e => e instanceof Exercise)).toBe(true)
  })

  test("порядок ключей не влияет на результат", ()=>{
    let workout_data = {
      id: 1, 
      name: "main", 
      archived: false, 
      time: 200, 
      exercises: [{
        id: 1,
        name: "Отжимания",
        reps: 10,
        weight: 100,
        time: 25,
        photo_small: "https://example.com/small.jpg",
        photo_large: "https://example.com/large.jpg",
      }]
    }

    let revers = Object.fromEntries(Object.entries(workout_data).reverse())
    expect(new Workout(workout_data)).toEqual(new Workout(revers))
  })
})

// 2. Найти упражнения по его айдишнику
describe("Workout.getExerciseById", ()=>{
  test("несуществующий id даёт undefined", ()=>{
    let workout_data = {
      id: 1, 
      name: "main", 
      archived: false, 
      time: 200, 
      exercises: [{
        id: 100,
        name: "Отжимания",
        reps: 10,
        weight: 100,
        time: 25,
        photo_small: "https://example.com/small.jpg",
        photo_large: "https://example.com/large.jpg",
      }]
    }

    let workout = new Workout(workout_data)
    expect(workout.getExerciseById(1)).toBeUndefined();
  })

  test("возвращает упражнение с нужным id", ()=>{
    let workout_data = {
      id: 1, 
      name: "main", 
      archived: false, 
      time: 200, 
      exercises: [{
        id: 100,
        name: "Отжимания",
        reps: 10,
        weight: 100,
        time: 25,
        photo_small: "https://example.com/small.jpg",
        photo_large: "https://example.com/large.jpg",
      }]
    }

    let workout = new Workout(workout_data)
    let exercise = workout.getExerciseById(100)

    expect(exercise.id).toBe(100)
    expect(exercise.name).toBe("Отжимания")
  })

  test("возвращает ссылку на объект из списка, а не копию", ()=>{
    let workout_data = {
      id: 1, 
      name: "main", 
      archived: false, 
      time: 200, 
      exercises: [{
        id: 100,
        name: "Отжимания",
        reps: 10,
        weight: 100,
        time: 25,
        photo_small: "https://example.com/small.jpg",
        photo_large: "https://example.com/large.jpg",
      }]
    }

    let workout = new Workout(workout_data)
    let exercise = workout.getExerciseById(100)

    expect(exercise).toBe(workout.exercises[0])
  })

})