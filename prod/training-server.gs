// Добавление пользовательского меню при открытии таблицы
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('💪 Menu')
    .addItem('Тренировка', 'open_training_modal')
    .addToUi();
}

// Открыть модальное окно тренировки
function open_training_modal() {
  var html = HtmlService.createHtmlOutputFromFile('prod/training-client').setWidth(1400).setHeight(1200);
  SpreadsheetApp.getUi().showModalDialog(html, "v2");
}

// Список тренировок для клиента
function get_data_from_server(){
  // ВАЖНО АЙДИШНИКИ ДОЛЖНЫ БЫТЬ УНИКАЛЬНЫЕ!!!
  return [{
    id: "main",
    name: "Основная",
    archived: false,
    exercises: [{
      id: 1,
      name: "Школьная разминка всего тела",
      reps: 1,
      weight: 0,
      time: 180,
      photo_small: "https://lh3.googleusercontent.com/d/1Dp2CSTM_cT1NwqJMmHrtBjFCGKdPRDp4",
      photo_large: "https://lh3.googleusercontent.com/d/1Dp2CSTM_cT1NwqJMmHrtBjFCGKdPRDp4"
    },{
      id: 2,
      name: "Приседания",
      reps: 15,
      weight: 0,
      time: 30,
      photo_small: "https://lh3.googleusercontent.com/d/1uifSlNPIF6gR-1X1j8Fu0v7SX3yDqmmJ",
      photo_large: "https://lh3.googleusercontent.com/d/1uifSlNPIF6gR-1X1j8Fu0v7SX3yDqmmJ"
    },{
      id: 3,
      name: "Классические подъёмы на носки стоя",
      reps: 25,
      weight: 0,
      time: 25,
      photo_small: "https://lh3.googleusercontent.com/d/1Vwm4yETb2U-vWpvtivQnMn1JzevJWa1x",
      photo_large: "https://lh3.googleusercontent.com/d/1Vwm4yETb2U-vWpvtivQnMn1JzevJWa1x"
    },{
      id: 4,
      name: "Классические подъёмы на носки стоя",
      reps: 25,
      weight: 10,
      time: 25,
      photo_small: "https://lh3.googleusercontent.com/d/1Vwm4yETb2U-vWpvtivQnMn1JzevJWa1x",
      photo_large: "https://lh3.googleusercontent.com/d/1Vwm4yETb2U-vWpvtivQnMn1JzevJWa1x"
    },{
      id: 5,
      name: "Планка на локтях (или лодочка)",
      reps: 1,
      weight: 0,
      time: 30,
      photo_small: "https://lh3.googleusercontent.com/d/1cjCQbqTffmPeA-uccWD7gBHwDlkUPa5i",
      photo_large: "https://lh3.googleusercontent.com/d/1cjCQbqTffmPeA-uccWD7gBHwDlkUPa5i"
    },{
      id: 6,
      name: "Стойка на руках у стены",
      reps: 1,
      weight: 0,
      time: 30,
      photo_small: "https://lh3.googleusercontent.com/d/1Xp7R_PkGiZwhIKwykRH1oc2VJ5pAn0Fz",
      photo_large: "https://lh3.googleusercontent.com/d/1Xp7R_PkGiZwhIKwykRH1oc2VJ5pAn0Fz"
    },{
      id: 7,
      name: "Pike Push-ups / Уголок",
      reps: 10,
      weight: 0,
      time: 25,
      photo_small: "https://lh3.googleusercontent.com/d/1_8oWZb73iMuLcaTZFVnbiC-wzkd5Gm3m",
      photo_large: "https://lh3.googleusercontent.com/d/1_8oWZb73iMuLcaTZFVnbiC-wzkd5Gm3m"
    },{
      id: 8,
      name: "Жим фитнес резинки стоя",
      reps: 15,
      weight: 15,
      time: 30,
      photo_small: "https://lh3.googleusercontent.com/d/1cjr34HxQhIuh2VUbaUqToQiKx8tpnDHU",
      photo_large: "https://lh3.googleusercontent.com/d/1cjr34HxQhIuh2VUbaUqToQiKx8tpnDHU"
    },{
      id: 9,
      name: "Жим фитнес резинки стоя",
      reps: 15,
      weight: 25,
      time: 30,
      photo_small: "https://lh3.googleusercontent.com/d/1cjr34HxQhIuh2VUbaUqToQiKx8tpnDHU",
      photo_large: "https://lh3.googleusercontent.com/d/1cjr34HxQhIuh2VUbaUqToQiKx8tpnDHU"
    },{
      id: 10,
      name: "Французский жим стоя с резинкой",
      reps: 15,
      weight: 15,
      time: 30,
      photo_small: "https://lh3.googleusercontent.com/d/1YraXc4W1o_CcSvLyDO5MBIKOsUyrII3H",
      photo_large: "https://lh3.googleusercontent.com/d/1YraXc4W1o_CcSvLyDO5MBIKOsUyrII3H"
    },{
      id: 11,
      name: "Трапеция с гантелями (Шраги)",
      reps: 20,
      weight: 20,
      time: 30,
      photo_small: "https://lh3.googleusercontent.com/d/1LkonQXZY-rTO1C6Zhy8EDTGjGPZzCUdX",
      photo_large: "https://lh3.googleusercontent.com/d/1LkonQXZY-rTO1C6Zhy8EDTGjGPZzCUdX"
    }]
  },{
    id: "dop",
    name: "Дополнительная",
    archived: false,
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
  },{
    name: "Еще",
    id: "no",
    archived: true,
    exercises: [{
      id: 1,
      name: "Pike Push-ups / Уголок",
      reps: 10,
      weight: 0,
      time: 25,
      photo_small: "https://lh3.googleusercontent.com/d/1_8oWZb73iMuLcaTZFVnbiC-wzkd5Gm3m",
      photo_large: "https://lh3.googleusercontent.com/d/1_8oWZb73iMuLcaTZFVnbiC-wzkd5Gm3m"
    }]
  }]
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





















