const StorageFileConfig = {
  exercises: {
    name: "_storage/exercises",
    varname: "EXERCISES",
    data: EXERCISES
  }
};


class AppScriptFiles {
  constructor(){
    if(!AppScriptFiles.ISLOAD){
      AppScriptFiles.FILES = AppScriptFiles._fetch()
      AppScriptFiles.ISLOAD = true
    }
  }

  static get _url() {
    return 'https://script.googleapis.com/v1/projects/' + ScriptApp.getScriptId() + '/content';
  }

  static get _headers() {
    return { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() };
  }

  static _fetch(){
    const response = UrlFetchApp.fetch(AppScriptFiles._url, {
      headers: AppScriptFiles._headers,
      muteHttpExceptions: true
    });

    if(response.getResponseCode() !== 200){
      throw new Error('Load failed: ' + response.getContentText());
    }
    return JSON.parse(response.getContentText()).files;
  }

  _write(){
    AppScriptFiles._backup();
    const response = UrlFetchApp.fetch(AppScriptFiles._url, {
      method: 'put',
      contentType: 'application/json',
      headers: AppScriptFiles._headers,
      payload: JSON.stringify({ files: AppScriptFiles.FILES }),
      muteHttpExceptions: true
    });
    if (response.getResponseCode() !== 200) throw new Error(response.getContentText());
  }

  static _backup() {
    const name = 'project_backup.json';
    const content = JSON.stringify({ files: AppScriptFiles.FILES });
    const it = DriveApp.getFilesByName(name);
    if (it.hasNext()) {
      it.next().setContent(content);
    } else {
      DriveApp.createFile(name, content, MimeType.PLAIN_TEXT);
    }
  }

  getFileByName(name){
    return AppScriptFiles.FILES.find(f => f.name === name);
  }
}


AppScriptFiles.ISLOAD = false;
AppScriptFiles.FILES = [];


class StorageFiles {
  constructor() {
    this.connect()
    this.models = []
  }

  connect(){
    this._appFiles = new AppScriptFiles()
  }

  commit(){
    this.models.forEach(m => m.save());
    this._appFiles._write()
  }

  register(model){
    if (this.models.some(m => m.name === model.name)) return;
    const file = this._appFiles.getFileByName(model.name);
    if (!file) throw new Error('File not found: ' + model.name);
    model.file = file;
    this.models.push(model);
  }
}

class ModelFile {
  constructor(storconf){
    this.name = storconf.name;
    this.varname = storconf.varname
    this.data = JSON.parse(JSON.stringify(storconf.data));
    this.file = null; // Назначаеться при регистрации
  }

  save(){
    if (!this.file) throw new Error('Model not registered: ' + this.name);
    let text = this.data.map(e => '  ' + JSON.stringify(e)).join(',\n')
    this.file.source = 'const ' + this.varname + ' = [\n' + text + '\n];\n'
  }
}


function testsss345645646() {
  const fileStor = new StorageFiles(); // скачать проект
  const ex = new ModelFile(StorageFileConfig.exercises); // пределить какой файл редактировать
  fileStor.register(ex); // регистрации что бы авто сохранения было

  // вносим правки
  // ex.data[0].id = 1;
  ex.data.push({"id":21,"name":"Произвольная растяжка","time":1000,"url_photo":"https://lh3.googleusercontent.com/d/1Jk_kdVIFbwZGn6H6IlKJ5Wf3LyleOtuy"})

  // сохраняем все изменения
  fileStor.commit();
}




