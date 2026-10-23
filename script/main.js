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















