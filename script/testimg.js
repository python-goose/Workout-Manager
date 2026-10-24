// https://developers.google.com/apps-script/api/reference/rest/v1/projects/getContent
function getFiles() {
  let url = 'https://script.googleapis.com/v1/projects/' + ScriptApp.getScriptId() + '/content'
  let head = { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() }

  const respons = UrlFetchApp.fetch(url, { headers: head })
  let files = JSON.parse(respons.getContentText()).files

  files.forEach(f => {
    if(f.name === '_storage/exercises'){
        console.log({
        name: f.name,               // имя файла
        type: f.type,               // SERVER_JS, HTML, JSON
        createTime: f.createTime,
        updateTime: f.updateTime,
        functionSet: f.functionSet, // функции верхнего уровня, если есть
        source: f.source         // содержимое файла
      })
    }
    
  })

  return files
}


function writeFile() {
  let name = '_storage/exercises'
  let dictName = 'EXERCISES'

  let url = 'https://script.googleapis.com/v1/projects/' + ScriptApp.getScriptId() + '/content'
  let head = { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() }

  // 1. берем список напрямую по имени переменной (копия)
  let data = JSON.parse(JSON.stringify(EXERCISES))

  // 2. работаем со списком как с обычным массивом
  data.push({ id: 21, name: 'Новое упражнение', time: 5, url_photo: '' })   // добавить

  // 3. получаем все файлы проекта
  let files = JSON.parse(UrlFetchApp.fetch(url, { headers: head }).getContentText()).files

  // 4. каждый объект в одну строку, объекты через перенос строки
  let text = data.map(e => '  ' + JSON.stringify(e)).join(',\n')

  files.find(f => f.name === name).source =
    'const ' + dictName + ' = [\n' + text + '\n]\n'

  // 5. отправляем все файлы обратно
  UrlFetchApp.fetch(url, {
    method: 'put',
    contentType: 'application/json',
    headers: head,
    payload: JSON.stringify({ files: files })
  })
}














