
// Открытие модального окна
function test() {
  var html = HtmlService.createHtmlOutputFromFile('htmltest')
    .setWidth(500)
    .setHeight(500);
  
  SpreadsheetApp.getUi().showModalDialog(html, "test");
}

/**
 * Её вызывает клиентский JavaScript через google.script.run.
 * 
 * @return {Object} обьект который передаем на клиента
 */
function get_data_from_table(){
  return {
    name: 'test',
    count: 55
  }
}


// Загружаем данные в таблицу
function saveExecution2(data){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var executionSheet = ss.getSheetByName('execution');
  var rowsToInsert = [];


  for (var i = 0; i < data.length; i++) {
    var item = data[i];

    if(item.sets === 0){
      continue;
    }

    // Формируем массив для одной строки и добавляем его в общий список
    rowsToInsert.push([
      '', 
      item.timedone,
      item.name,
      item.reps,
      item.weight
    ]);
  }

  if (rowsToInsert.length > 0) {
    // Находим номер последней заполненной строки
    var lastRow = executionSheet.getLastRow();
    executionSheet.getRange(lastRow + 1, 1, rowsToInsert.length, rowsToInsert[0].length).setValues(rowsToInsert);
  }

  return 'Успешно сохранено!';

}


function getTrainingData2(){
  // Список основных упражнений
  const rawMain = [
    {name: 'Школьная разминка всего тела', 
      reps: 1,  weight: 0,  time: 180, sets: 0, timedone: 0,
      photoSmall: "https://lh3.googleusercontent.com/d/1Dp2CSTM_cT1NwqJMmHrtBjFCGKdPRDp4", 
      photoLarge: "https://lh3.googleusercontent.com/d/1Dp2CSTM_cT1NwqJMmHrtBjFCGKdPRDp4"},
    {name: 'Приседания', 
      reps: 15, weight: 0,  time: 30,  sets: 0, timedone: 0,
      photoSmall: "https://lh3.googleusercontent.com/d/1uifSlNPIF6gR-1X1j8Fu0v7SX3yDqmmJ", 
      photoLarge: "https://lh3.googleusercontent.com/d/1uifSlNPIF6gR-1X1j8Fu0v7SX3yDqmmJ"},
    {name: 'Приседания', 
      reps: 15, weight: 10, time: 30,  sets: 0, timedone: 0,
      photoSmall: "https://lh3.googleusercontent.com/d/1uifSlNPIF6gR-1X1j8Fu0v7SX3yDqmmJ", 
      photoLarge: "https://lh3.googleusercontent.com/d/1uifSlNPIF6gR-1X1j8Fu0v7SX3yDqmmJ"},
    {name: 'Классические подъёмы на носки стоя', 
      reps: 25, weight: 0,  time: 25,  sets: 0, timedone: 0,
      photoSmall: "https://lh3.googleusercontent.com/d/1Vwm4yETb2U-vWpvtivQnMn1JzevJWa1x", 
      photoLarge: "https://lh3.googleusercontent.com/d/1Vwm4yETb2U-vWpvtivQnMn1JzevJWa1x"},
    {name: 'Классические подъёмы на носки стоя', 
      reps: 25, weight: 10, time: 25,  sets: 0, timedone: 0,
      photoSmall: "https://lh3.googleusercontent.com/d/1Vwm4yETb2U-vWpvtivQnMn1JzevJWa1x", 
      photoLarge: "https://lh3.googleusercontent.com/d/1Vwm4yETb2U-vWpvtivQnMn1JzevJWa1x"},
    {name: 'Планка на локтях (или лодочка)', 
      reps: 1,  weight: 0,  time: 30,  sets: 0, timedone: 0, 
      photoSmall: "https://lh3.googleusercontent.com/d/1cjCQbqTffmPeA-uccWD7gBHwDlkUPa5i", 
      photoLarge: "https://lh3.googleusercontent.com/d/1cjCQbqTffmPeA-uccWD7gBHwDlkUPa5i"},
    {name: 'Стойка на руках у стены', 
      reps: 1,  weight: 0,  time: 30,  sets: 0, timedone: 0, 
      photoSmall: "https://lh3.googleusercontent.com/d/1Xp7R_PkGiZwhIKwykRH1oc2VJ5pAn0Fz", 
      photoLarge: "https://lh3.googleusercontent.com/d/1Xp7R_PkGiZwhIKwykRH1oc2VJ5pAn0Fz"},
    {name: 'Pike Push-ups / Уголок', 
      reps: 10, weight: 0,  time: 25,  sets: 0, timedone: 0, 
      photoSmall: "https://lh3.googleusercontent.com/d/1_8oWZb73iMuLcaTZFVnbiC-wzkd5Gm3m", 
      photoLarge: "https://lh3.googleusercontent.com/d/1_8oWZb73iMuLcaTZFVnbiC-wzkd5Gm3m"},
    {name: 'Жим фитнес резинки стоя', 
      reps: 15, weight: 15, time: 30,  sets: 0, timedone: 0, 
      photoSmall: "https://lh3.googleusercontent.com/d/1cjr34HxQhIuh2VUbaUqToQiKx8tpnDHU", 
      photoLarge: "https://lh3.googleusercontent.com/d/1cjr34HxQhIuh2VUbaUqToQiKx8tpnDHU"},
    {name: 'Жим фитнес резинки стоя', 
      reps: 15, weight: 25, time: 30,  sets: 0, timedone: 0, 
      photoSmall: "https://lh3.googleusercontent.com/d/1cjr34HxQhIuh2VUbaUqToQiKx8tpnDHU", 
      photoLarge: "https://lh3.googleusercontent.com/d/1cjr34HxQhIuh2VUbaUqToQiKx8tpnDHU"},
    {name: 'Французский жим стоя с резинкой', 
      reps: 15, weight: 15, time: 30,  sets: 0, timedone: 0, 
      photoSmall: "https://lh3.googleusercontent.com/d/1YraXc4W1o_CcSvLyDO5MBIKOsUyrII3H", 
      photoLarge: "https://lh3.googleusercontent.com/d/1YraXc4W1o_CcSvLyDO5MBIKOsUyrII3H"},
    {name: 'Трапеция с гантелями (Шраги)', 
      reps: 20, weight: 20, time: 30,  sets: 0, timedone: 0, 
      photoSmall: "https://lh3.googleusercontent.com/d/1LkonQXZY-rTO1C6Zhy8EDTGjGPZzCUdX", 
      photoLarge: "https://lh3.googleusercontent.com/d/1LkonQXZY-rTO1C6Zhy8EDTGjGPZzCUdX"},
  ]

  const rawExtra = [
    {name: 'Школьная разминка всего тела2', 
      reps: 1,  weight: 0,  time: 180, sets: 0, timedone: 0, 
      photoSmall: "https://cataas.com/cat?width=45&height=45&i=1", 
      photoLarge: "https://cataas.com/cat?width=488&height=366&i=1"},
    {name: 'Приседания2', 
      reps: 15, weight: 0,  time: 30,  sets: 0, timedone: 0, 
      photoSmall: "https://cataas.com/cat?width=45&height=45&i=2", 
      photoLarge: "https://cataas.com/cat?width=488&height=366&i=2"}
  ]
  return {
    rawMain: rawMain,
    rawExtra: rawExtra
  }

}
