class Storage{
  constructor(key){
    this.key = key
    this.properties = PropertiesService.getDocumentProperties();
    // Хранилище
    this.data = {}
    this._load() // Сразу загружаем данные
  }

  // Получить данные
  _load(){
    let raw = this.properties.getProperty(this.key);
    this.data = raw ? JSON.parse(raw) : {};
  }

  // Проверить хранилище пустое или нет
  isEmpty(){
    return Object.keys(this.data).length === 0;
  }


  // Сохранить данные
  commit(){
    const json = JSON.stringify(this.data);
    if(json !== undefined){
      this.properties.setProperty(this.key, json)
    }
  }

  clean(){
    this.data = {}
    this.properties.deleteProperty(this.key)
  }
}


function testStop(){
  let storage = new Storage("settings1")
  console.log(storage.data)
  storage.clean()
  console.log(storage.data)
}

