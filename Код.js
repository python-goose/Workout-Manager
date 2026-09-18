// Добавление пользовательского меню при открытии таблицы
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('💪 Menu')
    .addItem('start of training', 'showTrainingModal')
    .addItem('тест', 'test')
    .addItem('версия 2.0', 'ver2')
    .addToUi();
}

// Открытие модального окна
function showTrainingModal() {
  var html = HtmlService.createHtmlOutputFromFile('Modal')
    .setWidth(1400)
    .setHeight(1400);
  
  var currentTrainingName = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('set').getRange('E4').getValue();
  SpreadsheetApp.getUi().showModalDialog(html, `Тренировка: ${currentTrainingName}`);
}

// Получение данных для модального окна
function getTrainingData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Получаем название текущей тренировки из листа "set" ячейки E4
  var setSheet = ss.getSheetByName('set');
  if (!setSheet) {
    throw new Error('Лист "set" не найден!');
  }
  var currentTrainingName = setSheet.getRange('E4').getValue();
  
  if (!currentTrainingName) {
    return { trainingName: 'Не указано в листе set (E4)', exercises: [] };
  }

  // 2. Загружаем справочник картинок из листа "exercises"
  var exercisesSheet = ss.getSheetByName('exercises');
  var imageMap = {}; // Словарь: "Название упражнения" -> "URL картинки"
  
  if (exercisesSheet) {
    var exData = exercisesSheet.getDataRange().getValues();
    var exFormulas = exercisesSheet.getDataRange().getFormulas(); // Берем формулы, чтобы достать IMAGE(...)
    
    // Проходим по всем строкам листа exercises
    for (var j = 0; j < exData.length; j++) {
      var rowVals = exData[j];
      var rowFarms = exFormulas[j];
      
      // Колонка B — индекс 1 (формула с изображением), Колонка C — индекс 2 (название упражнения)
      var cellForm = String(rowFarms[1] || rowVals[1] || ''); 
      var exerciseNameKey = String(rowVals[2] || '').trim(); // Колонка C (индекс 2)
      
      if (exerciseNameKey && cellForm.indexOf('IMAGE') !== -1) {
        // Ищем URL внутри кавычек формулы
        var match = cellForm.match(/"([^"]+)"/);
        if (match && match[1]) {
          imageMap[exerciseNameKey] = match[1];
        }
      }
    }
  }

  // 3. Получаем данные с листа "training"
  var trainingSheet = ss.getSheetByName('training');
  if (!trainingSheet) {
    throw new Error('Лист "training" не найден!');
  }
  
  var data = trainingSheet.getDataRange().getValues();
  var exercises = [];

  // Пропускаем шапку (начинаем с i = 1)
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var colB_TrainingName = row[1]; // Колонка B (индекс 1)
    
    // Если название тренировки совпадает
    if (colB_TrainingName === currentTrainingName) {
      var exName = String(row[2] || '').trim(); // Колонка C - название упражнения
      exercises.push({
        name: exName,                          // Название
        imageUrl: imageMap[exName] || '',      // Ссылка на картинку из листа exercises (по колонке C)
        defaultReps: row[3],                   // Колонка D - повторения
        weight: row[4],                        // Колонка E - вес
        timeSec: row[5]                        // Колонка F - время
      });
    }
  }

  return {
    trainingName: currentTrainingName,
    exercises: exercises
  };
}

// Сохранение результатов выполнения упражнения на лист "execution"
function saveExecution(exerciseData) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var executionSheet = ss.getSheetByName('execution');
  
  if (!executionSheet) {
    executionSheet = ss.insertSheet('execution');
    executionSheet.appendRow(['', 'Дата и время', 'Название упражнения', 'Количество повторений', 'Дополнительный вес (кг)']);
  }
  
  var timestamp = new Date();
  
  executionSheet.appendRow([
    '', 
    timestamp,
    exerciseData.name,
    exerciseData.reps,
    exerciseData.weight
  ]);
  
  return 'Успешно сохранено!';
}