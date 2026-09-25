// Добавление пользовательского меню при открытии таблицы
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('💪 Menu')
    .addItem('🏋️‍♂️ Start session', 'open_session_modal')
    .addItem('⚙️ Settings', 'open_settings_modal')
    .addToUi();
}

// Используеться для сборки файлов в один
// Вызываеться в index
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// Открыть модальное окно тренировки
function open_session_modal() {
  var template = HtmlService.createTemplateFromFile('session/index');
  var html = template.evaluate()
    .setWidth(1400)
    .setHeight(1200);
  SpreadsheetApp.getUi().showModalDialog(html, "v2");
}

// Открыть модальное окно настроек приложения
function open_settings_modal() {
  var template = HtmlService.createTemplateFromFile('settings/index');
  var html = template.evaluate()
    .setWidth(1400)
    .setHeight(1200);
  SpreadsheetApp.getUi().showModalDialog(html, "Settings");
}


function get_data_from_server_pro(){
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let training_sheet = ss.getSheetByName('training')
  let exercises_sheet = ss.getSheetByName('exercises')
  let training_last_row = training_sheet.getLastRow();
  let training_last_col = training_sheet.getLastColumn();

  let time_cong = {
    'wr-ls': 'main',
    'Norm': 'dop',
    'tes': 'tes',
    'wr-ls-2': 'wrls2',
    "pars": "pars"
  }

  
  // (строка_начала, колонка_начала, количество_строк, количество_колонок)
  let training_data = training_sheet.getRange(1, 1, training_last_row, training_last_col).getValues()
  let exercises_data = exercises_sheet.getRange(2, 1, exercises_sheet.getLastRow(), exercises_sheet.getLastColumn()).getValues()
  console.log(exercises_data)
  let workoutsMap = {}

  for(let i = 1; i < training_data.length; i++){
    if(!workoutsMap[training_data[i][1]]){
      workoutsMap[training_data[i][1]] = {
        id: time_cong[training_data[i][1]],
        name: training_data[i][1],
        archived: false,
        time: 0,
        exercises: []
      }
    }

    let photo = ''
    for(let j = 0; j < exercises_data.length; j++){
      if(exercises_data[j][2] === training_data[i][2]){
        photo = exercises_data[j][4]
        break;
      } 
    }

    workoutsMap[training_data[i][1]].exercises.push({
      id: i,
      name: training_data[i][2],
      reps: training_data[i][3],
      weight: training_data[i][4],
      time: Number(training_data[i][5] * training_data[i][3]),
      time_one_ex: training_data[i][5],
      photo_small: photo,
      photo_large: photo,
    })

    workoutsMap[training_data[i][1]].time += Number(training_data[i][5] * training_data[i][3])

  }

  let groupedTrainings = Object.values(workoutsMap);
  //let jsonString = JSON.stringify(groupedTrainings, null, 2);
  //console.log(jsonString)
  return {
    settings:{
      prepSeconds: 20, // Количество секунд, перед тренировкой, этап подготовки
      overtimeFactor: 0.2, // Мультипликатор для перетренерованности
      currentStreak: 22, // Текущая серия подряд
      maxStreak: 50 // максимальная серия за все время
    },
    workouts: groupedTrainings
  }
}

// Список тренировок для клиента
function get_data_from_server(){
  // ВАЖНО АЙДИШНИКИ ДОЛЖНЫ БЫТЬ УНИКАЛЬНЫЕ!!!
  return {
    settings:{
      prepSeconds: 20, // Количество секунд, перед тренировкой, этап подготовки
      overtimeFactor: 0.2 // Мультипликатор для перетренерованности
    },
    workouts: [
      {
      id: "main",
      name: "Основная",
      archived: false,
      time: 900,
      exercises: [{
        id: 1,
        name: "Школьная разминка всего тела",
        reps: 1,
        weight: 0,
        time: 180,
        photo_small: "https://lh3.googleusercontent.com/d/1Dp2CSTM_cT1NwqJMmHrtBjFCGKdPRDp4",
        photo_large: "https://lh3.googleusercontent.com/d/1Dp2CSTM_cT1NwqJMmHrtBjFCGKdPRDp4"},
        {
        id: 2,
        name: "Приседания",
        reps: 15,
        weight: 0,
        time: 30,
        photo_small: "https://lh3.googleusercontent.com/d/1uifSlNPIF6gR-1X1j8Fu0v7SX3yDqmmJ",
        photo_large: "https://lh3.googleusercontent.com/d/1uifSlNPIF6gR-1X1j8Fu0v7SX3yDqmmJ"},
        {
        id: 3,
        name: "Приседания",
        reps: 15,
        weight: 10,
        time: 30,
        photo_small: "https://lh3.googleusercontent.com/d/1uifSlNPIF6gR-1X1j8Fu0v7SX3yDqmmJ",
        photo_large: "https://lh3.googleusercontent.com/d/1uifSlNPIF6gR-1X1j8Fu0v7SX3yDqmmJ"},
        {
        id: 4,
        name: "Классические подъёмы на носки стоя",
        reps: 25,
        weight: 0,
        time: 25,
        photo_small: "https://lh3.googleusercontent.com/d/1Vwm4yETb2U-vWpvtivQnMn1JzevJWa1x",
        photo_large: "https://lh3.googleusercontent.com/d/1Vwm4yETb2U-vWpvtivQnMn1JzevJWa1x"},
        {
        id: 5,
        name: "Классические подъёмы на носки стоя",
        reps: 25,
        weight: 10,
        time: 25,
        photo_small: "https://lh3.googleusercontent.com/d/1Vwm4yETb2U-vWpvtivQnMn1JzevJWa1x",
        photo_large: "https://lh3.googleusercontent.com/d/1Vwm4yETb2U-vWpvtivQnMn1JzevJWa1x"},
        {
        id: 6,
        name: "Планка на локтях (или лодочка)",
        reps: 1,
        weight: 0,
        time: 30,
        photo_small: "https://lh3.googleusercontent.com/d/1cjCQbqTffmPeA-uccWD7gBHwDlkUPa5i",
        photo_large: "https://lh3.googleusercontent.com/d/1cjCQbqTffmPeA-uccWD7gBHwDlkUPa5i"},
        {
        id: 7,
        name: "Стойка на руках у стены",
        reps: 1,
        weight: 0,
        time: 30,
        photo_small: "https://lh3.googleusercontent.com/d/1Xp7R_PkGiZwhIKwykRH1oc2VJ5pAn0Fz",
        photo_large: "https://lh3.googleusercontent.com/d/1Xp7R_PkGiZwhIKwykRH1oc2VJ5pAn0Fz"},
        {
        id: 8,
        name: "Pike Push-ups / Уголок",
        reps: 10,
        weight: 0,
        time: 25,
        photo_small: "https://lh3.googleusercontent.com/d/1_8oWZb73iMuLcaTZFVnbiC-wzkd5Gm3m",
        photo_large: "https://lh3.googleusercontent.com/d/1_8oWZb73iMuLcaTZFVnbiC-wzkd5Gm3m"},
        {
        id: 9,
        name: "Жим фитнес резинки стоя",
        reps: 15,
        weight: 15,
        time: 30,
        photo_small: "https://lh3.googleusercontent.com/d/1cjr34HxQhIuh2VUbaUqToQiKx8tpnDHU",
        photo_large: "https://lh3.googleusercontent.com/d/1cjr34HxQhIuh2VUbaUqToQiKx8tpnDHU"},
        {
        id: 10,
        name: "Жим фитнес резинки стоя",
        reps: 15,
        weight: 25,
        time: 30,
        photo_small: "https://lh3.googleusercontent.com/d/1cjr34HxQhIuh2VUbaUqToQiKx8tpnDHU",
        photo_large: "https://lh3.googleusercontent.com/d/1cjr34HxQhIuh2VUbaUqToQiKx8tpnDHU"},
        {
        id: 11,
        name: "Французский жим стоя с резинкой",
        reps: 15,
        weight: 15,
        time: 30,
        photo_small: "https://lh3.googleusercontent.com/d/1YraXc4W1o_CcSvLyDO5MBIKOsUyrII3H",
        photo_large: "https://lh3.googleusercontent.com/d/1YraXc4W1o_CcSvLyDO5MBIKOsUyrII3H"},
        {
        id: 12,
        name: "Трапеция с гантелями (Шраги)",
        reps: 20,
        weight: 20,
        time: 30,
        photo_small: "https://lh3.googleusercontent.com/d/1LkonQXZY-rTO1C6Zhy8EDTGjGPZzCUdX",
        photo_large: "https://lh3.googleusercontent.com/d/1LkonQXZY-rTO1C6Zhy8EDTGjGPZzCUdX"}
      ]
      },
      {
        id: "dop",
        name: "Дополнительная",
        archived: false,
        time: 50,
        exercises: [{
          id: 1,
          name: "Планка на локтях (или лодочка)",
          reps: 1,
          weight: 0,
          time: 30,
          photo_small: "https://lh3.googleusercontent.com/d/1cjCQbqTffmPeA-uccWD7gBHwDlkUPa5i",
          photo_large: "https://lh3.googleusercontent.com/d/1cjCQbqTffmPeA-uccWD7gBHwDlkUPa5i"
        },{
          id: 2,
          name: "Стойка на руках у стены",
          reps: 1,
          weight: 0,
          time: 30,
          photo_small: "https://lh3.googleusercontent.com/d/1Xp7R_PkGiZwhIKwykRH1oc2VJ5pAn0Fz",
          photo_large: "https://lh3.googleusercontent.com/d/1Xp7R_PkGiZwhIKwykRH1oc2VJ5pAn0Fz"
        }]
      },
      {
        name: "Еще",
        id: "no",
        archived: true,
        time: 10,
        exercises: [{
          id: 1,
          name: "Pike Push-ups / Уголок",
          reps: 10,
          weight: 0,
          time: 25,
          photo_small: "https://lh3.googleusercontent.com/d/1_8oWZb73iMuLcaTZFVnbiC-wzkd5Gm3m",
          photo_large: "https://lh3.googleusercontent.com/d/1_8oWZb73iMuLcaTZFVnbiC-wzkd5Gm3m"
        }]
      }
    ]
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

// Получить новый адишник для записи
// На основе ссылки на лист и порядкового номера колонки
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
function calculateWorkoutStreak(){
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let workoutHistorySheet = ss.getSheetByName("workout_history");

  let lastRow = workoutHistorySheet.getLastRow();

  // Получаем список дат с колонки B
  let rawDates = workoutHistorySheet.getRange(2, 2, lastRow - 1, 1).getValues();

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
  console.log(streakCount)
  return streakCount
}


/**
 * Ищет самую длинную серию тренировок подряд за всё время (без пропусков)
 * среди дат из колонки B листа workout_history.
 *
 * @category model
 * @returns {Number} длина самой долгой серии дней подряд
 */
function findLongestStreak(){
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let workoutHistorySheet = ss.getSheetByName("workout_history");

  let lastRow = workoutHistorySheet.getLastRow();

  // Получаем список дат с колонки B
  let rawDates = workoutHistorySheet.getRange(2, 2, lastRow - 1, 1).getValues();

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















