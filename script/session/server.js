function get_data_from_server_pro() {
  const trainings = JSON.parse(JSON.stringify(TRAININGS));
  const exercises = JSON.parse(JSON.stringify(EXERCISES));

  // Пройтись по тренировкам и добавить к упражнениям, название и фото
  for (let i = 0; i < trainings.length; i++) {
    for (let j = 0; j < trainings[i].exercises.length; j++) {
      let needFind = trainings[i].exercises[j].id_e;
      let exercise = exercises.find(e => e.id === needFind);
      if (!exercise) throw new Error(`id: ${needFind} in EXERCISES not found`);
      trainings[i].exercises[j].name = exercise.name;
      trainings[i].exercises[j].photo_small = exercise.url_photo;
      trainings[i].exercises[j].photo_large = exercise.url_photo;
    }
  }

  // Взять все упржнения и сделать с них тренировку "Все упражнения"
  trainings.push({id: "all", name: "all", archived: false, time: 2000,  exercises: []})
  for (let i = 0; i < exercises.length; i++) {
    trainings[trainings.length - 1].exercises.push({
      id: i+1,
      id_e: exercises[i].id,
      name: exercises[i].name, 
      reps: 1,  
      weight: 0,  
      time: 10,
      photo_small: exercises[i].url_photo,
      photo_large: exercises[i].url_photo
    })
  }


  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let workoutHistorySheet = ss.getSheetByName("workout_history");
  if(!workoutHistorySheet) throw new Error('Лист "workout_history" не найден в таблице.')
  let lastRow = workoutHistorySheet.getLastRow();
  let rawDates = lastRow > 1 ? workoutHistorySheet.getRange(2, 2, lastRow - 1, 1).getValues() : [];

  return {
    settings: get_settings_data(),
    analytics:{
      currentStreak: calculateWorkoutStreak(rawDates),
      maxStreak: findLongestStreak(rawDates),
      heatmapMonths: calculateWorkoutHalfYear(rawDates),
    },
    workouts: trainings
  }
}


// Сохранить данные в таблицу, полученные от клиента
function seve_data_from_client(data){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var workout_history_sheet = ss.getSheetByName('workout_history');
  var execution_history_sheet = ss.getSheetByName('execution_history');

  let id = getNextId(1, workout_history_sheet)

  // Сохранить выполненую тренировку
  workout_history_sheet.appendRow([
    id, 
    new Date(data.dateStart), 
    new Date(data.dateEnd), 
    Math.floor(data.duration / 1000), 
    data.countSet, 
    data.countUniqueExercises, 
    data.totalWeightLifted,
    data.complexityAssessment,
    data.comment
    ])

  // Сохранить историю выполненых упражнений
  let executions = [];
  idex = getNextId(1, execution_history_sheet)
  for(let i = 0; i < data.exercise.length; i++){
    executions.push([
      idex+i,
      id,
      data.exercise[i].name,
      new Date(data.exercise[i].dateEnd),
      data.exercise[i].reps,
      data.exercise[i].weight,
      data.exercise[i].time,
      data.exercise[i].complexityAssessment,
      data.exercise[i].comment,
    ])
  }

  if(executions.length > 0){
    let startRow = execution_history_sheet.getLastRow() + 1
    // Получаем список всех значений с колонки с айдишником (строка_начала, колонка_начала, количество_строк, количество_колонок)
    execution_history_sheet.getRange(startRow, 1, executions.length, executions[0].length).setValues(executions);
  }
}

// Получить новый адишник для записи, На основе ссылки на лист и порядкового номера колонки
function getNextId(idColmn, sheet){

  // Номер строки до которой есть данные
  let lastRow = sheet.getLastRow()

  let id = 0;
  // Если есть хотябы одна строка данных
  if(lastRow > 1){
    // Получаем список всех значений с колонки с айдишником (строка_начала, колонка_начала, количество_строк, количество_колонок)
    let rows = sheet.getRange(2, idColmn, lastRow-1, 1).getValues();
    // Найти максимальный адишник
    for(let i = 0; i < rows.length; i++){
      if(rows[i][0] === "") continue;
      if(Number(rows[i][0]) > id) id = Number(rows[i][0]);
    }
  }
  
  // Увеличить айдишник на +1
  id+=1

  return id
}


/**
 * Считает текущую серию тренировок подряд (streak) — сколько дней подряд,
 * включая сегодня, пользователь занимался без пропусков. Даты читаются
 * из колонки B листа workout_history.
 *
 * @category model
 * @returns {Number} количество дней подряд (текущая серия + сегодняшний день)
 */
function calculateWorkoutStreak(rawDates){
  //let workoutHistorySheet = ss.getSheetByName("workout_history");
  //let lastRow = workoutHistorySheet.getLastRow();
  // Получаем список дат с колонки B
  //let rawDates = workoutHistorySheet.getRange(2, 2, lastRow - 1, 1).getValues();

  // Пропускаем все пустые строки
  // Записываем в новый список [[]] -> []
  let dateList = []
  for(let i = 0; i < rawDates.length; i++){
    if(rawDates[i][0] !== ''){
      dateList.push(rawDates[i][0])
    }
  }

  // Сортируем список по возрастанию (от старых дат к новым)
  dateList.sort((a, b) => a - b);

  // Текущая проверяемая дата, стартуем от сегодня
  let currentCheckDate = new Date()
  // Количество дней подряд, сегодня по умолчанию 1
  let streakCount = 1

  // Проходимся по датам, с конца (самые свежие) в начало (самые старые)
  for(let i = dateList.length - 1; i >= 0; i--){

    // Копируем текущую дату и вычитаем 1 день, так что бы expectedPrevDay остался Date
    // Проблема: expectedPrevDay.getDate() возвращает число,
    // и когда первое число месяца -1 будет 0 и всё ломается
    // Нужно создать "вчерашний день" именно через объект Date, до сравнения
    let expectedPrevDay = new Date(currentCheckDate);
    expectedPrevDay.setDate(expectedPrevDay.getDate() - 1);

    if(expectedPrevDay.toDateString() === dateList[i].toDateString()){
      // Обновляем текущую проверяемую дату на найденный вчерашний день
      currentCheckDate = dateList[i];
      // Увеличиваем счётчик
      streakCount += 1
    }
  }

  // Возвращаем текущую серию + сегодняшняя тренировка
  return streakCount
}


/**
 * Ищет самую длинную серию тренировок подряд за всё время (без пропусков)
 * среди дат из колонки B листа workout_history.
 *
 * @category model
 * @returns {Number} длина самой долгой серии дней подряд
 */
function findLongestStreak(rawDates){
  //let workoutHistorySheet = ss.getSheetByName("workout_history");
  //let lastRow = workoutHistorySheet.getLastRow();
  // Получаем список дат с колонки B
  //let rawDates = workoutHistorySheet.getRange(2, 2, lastRow - 1, 1).getValues();

  // Пропускаем все пустые строки
  // Записываем в новый список [[]] -> []
  let dateList = []
  for(let i = 0; i < rawDates.length; i++){
    if(rawDates[i][0] !== ''){
      dateList.push(rawDates[i][0])
    }
  }

  // Сортируем список по возрастанию (от старых дат к новым)
  dateList.sort((a, b) => a - b);

  // Удалить дуликаты так как это сбивает серию
  let uniqueDateList = []
  for(let i = 0; i < dateList.length; i++){
    if(i === 0 || dateList[i].toDateString() !== dateList[i-1].toDateString()){
      uniqueDateList.push(dateList[i])
    }
  }

  // Number копирует значение при присвоении, поэтому currentStreak
  // можно спокойно менять внутри цикла без побочных эффектов
  let currentStreak = 1
  let longestStreak = 0

  // Проходимся по датам от начала к концу (от старых к новым)
  for(let i = 0; i < uniqueDateList.length - 1; i++){
    // Ожидаемый следующий день относительно текущей даты
    let expectedNextDay = new Date(uniqueDateList[i]);
    expectedNextDay.setDate(expectedNextDay.getDate() + 1);

    // Сравниваем через toDateString, что бы избежать ситуации 02.08 === 03.09
    if(expectedNextDay.toDateString() === uniqueDateList[i+1].toDateString()){
      currentStreak += 1
    }else{
      // При прерывании серии сравниваем, набрали ли больше, чем было
      if(longestStreak < currentStreak) longestStreak = currentStreak;
      // Счётчик текущей серии нужно сбросить
      currentStreak = 1
    }
  }

  // Проверяем случай, когда самая длинная серия была в самом конце списка
  if(longestStreak < currentStreak){
    longestStreak = currentStreak
  }

  // Возвращаем самую длинную найденную серию
  console.log(longestStreak)
  return longestStreak
}

// Подготовить данные для графика активности за последние пол года
function calculateWorkoutHalfYear(data){
  let mainCount = 0
  let heatmapMonthsNew = []
  // Создать пустой список для 6 послежних месяцев
  // const date = new Date(); date.toLocaleString("ru-RU", { month: "short" }); // "сент."
  const crDate = new Date();
  for(let i = 0; i < 6; i++){
    let monthDate = new Date(crDate.getFullYear(), crDate.getMonth() - i, 1);
    let name = monthDate.toLocaleString("ru-RU", { month: "short" }).replace(".", "")
    let title = name.charAt(0).toUpperCase() + name.slice(1)
    let maxDaysInMonth = new Date(crDate.getFullYear(), crDate.getMonth()-i+1, 0).getDate()
    heatmapMonthsNew.push({
      label: title,
      year: monthDate.getFullYear(),
      month: monthDate.getMonth(),
      days: maxDaysInMonth,
      active: []
    })
  }

  // Заполянем active
  for(let i = 0; i < data.length; i++){
    let crDate = new Date(data[i])
    if (isNaN(crDate.getTime())) {console.warn("Неверная дата:", data[i]);continue;}

    for(let j = 0; j < heatmapMonthsNew.length; j++){
      if(crDate.getFullYear() === heatmapMonthsNew[j].year && crDate.getMonth() === heatmapMonthsNew[j].month){
        if(!heatmapMonthsNew[j].active.includes(crDate.getDate())){
          heatmapMonthsNew[j].active.push(crDate.getDate())
          mainCount += 1
          break;
        }
      }
    }
  }
  
  return {count: mainCount, data: heatmapMonthsNew.reverse()};

}


// вместо showModalDialog — точка входа для веб-приложения
// Интересно, изучить
// https://script.google.com/macros/s/AKfycbw9gtUNJ7I05sc0zgTXl3ielhy3s_t8hysSisWK3Wbt26Vabhyqfj6exGiygFWOHB-B/exec

/*
function doGet() {
  return HtmlService.createHtmlOutputFromFile('prod/training-client')
    .setTitle('Тренировка')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}*/

