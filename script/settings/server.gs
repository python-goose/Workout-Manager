const DEFAULT_SETTINGS = {
  profile_height: 178,             // Рост в сантиметрах (например, 178)
  profile_weight: 75.5,            // Вес в килограммах (например, 75.5)
  profile_age: 28,                 // Возраст в годах
  profile_gender: "male",           // Пол: "male", "female"

  workoutSession_prepTimeSec: 10,              // Время подготовки перед стартом тренировки (в секундах)
  workoutSession_restTimeSec: 20,              // Время отдыха между подходами / сетами (в секундах)
  workoutSession_overtrainingMultiplier: 0.2,  // Мультипликатор перетренированности (0.2 = запас 20% к итоговому времени)
  workoutSession_exerciseViewMode: "table",    // Вид отображения списка упражнений: "table" | "list" | "card"

  style_theme_color: "light",                  // Стиль темы будстрап "light" | "dark"

  meta_lastSavedAt: "",                         // Метка времени последнего сохранения настроек
};

class Settings{
  constructor(){
    this.db = new Storage("settings");
    // Локальное гранилище
    this.data = null;
    this._init()
  }


  // Иницыализация, получить данные с бд
  // Или данные конфига записать в бд и взять их
  _init(){
    // Если база пустая, ее нужно заполнить дефолтными данными
    if(this.db.isEmpty()){
      // Локальное хранилище заполняеться дефолтными данными
      this.data = {...DEFAULT_SETTINGS}
      // Локальное хранилище передаеться в базу
      this.db.data =  this.data
      // База делает запись и сохраняет данные в памяти
      this.db.commit()
    }else{
      // Если данные есть, то в локальное хранилиже сохраняем данные с базы и дополняем
      // Новыми полямы которые есть в конфиге но нету в гранилище
      this.data = {...DEFAULT_SETTINGS, ...this.db.data}
    }
  }

  save(new_data){
    // Согланяем в локальное хранилище
    this.data = {...new_data}
    // Установить время сохранения
    this.data.meta_lastSavedAt = this._formatDate(new Date())
    // ЛОкальное хранилище передаем в базу
    this.db.data = this.data
    // База делает запись и сохраняет в память
    this.db.commit()
    // Возращаем обновленные данные
    return this.data
  }

  // Когда нужно сбросить все данные с хранилища
  reset(){
    return this.save(DEFAULT_SETTINGS)
  }

  _formatDate(date) {
    const pad = n => String(n).padStart(2, '0');
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1); // месяцы с 0
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }
}

// Передаем на сервер текущий конфиг с настройками
function get_settings_data(){
  let settings = new Settings();
  return settings.data
}

// Получаем запрос от клиента на сброску данных до базовых настроек
function reset_settings_data(){
  let settings = new Settings();
  return settings.reset()
}

function save_settings_data(data){
  let settings = new Settings();
  return settings.save(data)
}


















