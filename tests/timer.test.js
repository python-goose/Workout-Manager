const fs = require('fs');
const path = require('path');

// Читает models.html, убирает теги <script> и возвращает нужные классы
function loadClasses() {
    // Путь к нужнофу файлц
    const file = path.join(__dirname, '../script/session/models.html');
    const code = fs.readFileSync(file, 'utf8').replace(/<\/?script>/g, '');
    return new Function(code + '; return { Timer };')();
}

const { Timer } = loadClasses();

// 1. Форматирования таймера в формат строки
describe('Timer.formatTime', () => {
  test('0 секунд', () => {
    expect(Timer.formatTime(0)).toBe('00:00:00');
  });

  test('секунды меньше минуты', () => {
    expect(Timer.formatTime(59)).toBe('00:00:59');
  });

  test('ровно минута', () => {
    expect(Timer.formatTime(60)).toBe('00:01:00');
  });

  test('час, минута и секунда', () => {
    expect(Timer.formatTime(3661)).toBe('01:01:01');
  });
});


// 2. Логика расчета общего времени тренировки
describe("Timer.build", ()=>{
    
  test("считает общее время: (prep + train) / (1 - overtime)", ()=>{
    let timer = new Timer(20, 0.2)
    timer.build(100)
    expect(timer.totalSeconds).toBe(150)
  });  
    
  test("считает общее время: (prep + train) / (1 - overtime) при overtime = 0", ()=>{
    let timer = new Timer(20, 0)
    timer.build(100)
    expect(timer.totalSeconds).toBe(120)
  });

  test("округляет вверх", ()=>{
    let timer = new Timer(20, 0.3)
    timer.build(100)
    expect(timer.totalSeconds).toBe(172)
  })

});


// 3. Таймер создаеться только один раз
describe("Timer.isBuild", ()=>{

  test("isBuild = false по умолчанию", ()=>{
    let timer = new Timer(20, 0.2)
    expect(timer.isBuild).toBe(false)
  })

  test("isBuild = true после иницыализации", ()=>{
    let timer = new Timer(20, 0.2)
    timer.build(100)
    expect(timer.isBuild).toBe(true)
  })

  test("повторный build не меняет значения", ()=>{
    let timer = new Timer(20, 0.2)
    timer.build(100)
    timer.build(500)
    expect(timer.trainSeconds).toBe(100)
    expect(timer.totalSeconds).toBe(150)
  })

})


// 4. Фаза тренировки
describe("Timer.getPhase", ()=>{

  test("Фаза подготовки к тренировки (prep)", ()=>{
    let timer = new Timer(100, 0.2)
    // Прошло 50 секунд с момента старта таймера
    timer.currentSeconds = 50
    timer.build(100)
    expect(timer.getPhase()).toBe("prep")
  })

  test("Фаза подготовки к тренировки (prep) (граница)", ()=>{
    let timer = new Timer(100, 0.2)
    timer.currentSeconds = 100
    timer.build(100)
    expect(timer.getPhase()).toBe("prep")
  })

  test("Фаза тренировки (train)", ()=>{
    let timer = new Timer(20, 0.2)
    timer.build(100)
    timer.currentSeconds = 25
    expect(timer.getPhase()).toBe("train")
  })

  test("Фаза тренировки (train) (граница)", ()=>{
    let timer = new Timer(20, 0.2)
    timer.build(100)
    timer.currentSeconds = 120
    expect(timer.getPhase()).toBe("train")
  })

  test("Фаза перетренированности (overtrain)", ()=>{
    let timer = new Timer(20, 0.2)
    timer.build(100)
    timer.currentSeconds = 121
    expect(timer.getPhase()).toBe("overtrain")
  })

})


// 5. Процент на шкале тренировки
describe("Timer.getPercent", ()=>{

  test("0% в начале", ()=>{
    let timer = new Timer(20, 0.2)
    timer.build(100)
    expect(timer.getPercent()).toBe("0.00")
  })

  test("50% на серидени", ()=>{
    let timer = new Timer(20, 0.2)
    timer.build(100)
    timer.currentSeconds = 75
    expect(timer.getPercent()).toBe("50.00")
  })

  test("100% в конце", ()=>{
    let timer = new Timer(20, 0.2)
    timer.build(100)
    timer.currentSeconds = 150
    expect(timer.getPercent()).toBe("100.00")
  })

  test("100% выход за границы", ()=>{
    let timer = new Timer(20, 0.2)
    timer.build(100)
    timer.currentSeconds = 300
    expect(timer.getPercent()).toBe("100.00")
  })

})


// 6. Проверка щеьчика таймера
describe("Timer start / pause / stop", ()=>{
  let timer;

  // Выполняеться перед каждым test в рамках describe
  beforeEach(()=>{
    jest.useFakeTimers();
    timer = new Timer(20, 0.2)
    timer.build(100)
  })

  // Выполняеться после каждым test в рамках describe
  afterEach(()=>{
    timer.pause()
    jest.useRealTimers();
  })

  test("isRunning(): false до старта и true после", ()=>{
    expect(timer.isRunning()).toBe(false)
    timer.start()
    expect(timer.isRunning()).toBe(true)
  })

  test("каждую секунду увеличивает currentSeconds", ()=>{
    timer.start()
    // Фейково увеличиваем время работы на 3 секунды
    jest.advanceTimersByTime(3000);
    expect(timer.currentSeconds).toBe(3)
  })

  test("повторный start не ускоряет таймер", ()=>{
    timer.start()
    timer.start()
    timer.start()
    jest.advanceTimersByTime(10000)
    expect(timer.currentSeconds).toBe(10)
  })

  test("pause останавливает счёт, но сохраняет время", ()=>{
    timer.start()
    // Увеличиваем таймер на 2 секунды
    jest.advanceTimersByTime(2000)
    timer.pause()
    // Увеличиваем на 5 сек, но пауза и это не добавляется
    jest.advanceTimersByTime(5000)
    // У нас 2 сек и пауза
    expect(timer.currentSeconds).toBe(2)
    expect(timer.isRunning()).toBe(false)
  })

  test("после паузы start продолжает с сохранённого времени", ()=>{
    timer.start()
    jest.advanceTimersByTime(2000)
    timer.pause()
    jest.advanceTimersByTime(5000)
    timer.start()
    jest.advanceTimersByTime(2000)
    expect(timer.currentSeconds).toBe(4)
    expect(timer.isRunning()).toBe(true)
  })

  test("stop сбрасывает время в 0", ()=>{
    timer.start()
    jest.advanceTimersByTime(5000)
    timer.stop()
    expect(timer.currentSeconds).toBe(0)
    expect(timer.isRunning()).toBe(false)
  })

  test("onTick вызывается каждую секунду и получает таймер", ()=>{
    // Функцыя "шпион" которая мониторит что в нее передали и сколько раз вызвали
    const spy = jest.fn()
    // Навешываем функцыю
    timer.onTick = spy

    timer.start()
    jest.advanceTimersByTime(3000)
    
    // Сколько раз вызвали подставную функцыю
    expect(spy).toHaveBeenCalledTimes(3)
    // Что передавали в подставную функцыю
    expect(spy).toHaveBeenCalledWith(timer)
  })

})