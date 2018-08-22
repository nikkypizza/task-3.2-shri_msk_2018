import parseJSON from './utils/getData.js';
import createRatesMap from './utils/createRatesMap.js';

const pathToInputData = `js/data/input.json`;
// Принимаем JSON и преобразуем его в объект
const inputData = parseJSON(pathToInputData);
// На основе "rates" из JSON составляем объект с почасовыми тарифами
const ratesRangeData = createRatesMap(inputData.rates);

// Расписание работы режимов
const DEVICE_MODES = {
  undefined: { start: 0, end: 23 },
  day: { start: 7, end: 20 },
  night: { start: 21, end: 6 }
};

// // Mock-объект
// let testItem = {
//   id: `C515D887EDBBE669B2FDAC62F571E9E9`,
//   name: `Духовка`,
//   power: 950,
//   duration: 3,
//   mode: `night`
// };

// Принимает объект устройства и возвращает значение часа
// с которого начинать работу будет дешевле всего
const calcDeviceIntervalCosts = (item) => {
  let deviceModeStart = eval(`DEVICE_MODES.${item.mode}.start`);
  let deviceModeEnd = eval(`DEVICE_MODES.${item.mode}.end`);
  let startingIndex = deviceModeStart + (item.duration - 1);
  let costVariants = {};

  // Если duration превышает время работы mode - кидаем ошибку
  if (item.duration > Math.abs(deviceModeEnd - deviceModeStart) + 1) {
    console.error(`Device ${item.name} duration does not match its mode`);
  }

  // Алгоритм для дневного и круглосуточного режимов
  if (item.mode !== `night`) {
    // Устройство должно работать неприрывно напротяжении своего duration:
    //  - берем duration как 'неразбивный блок' и прогоняем его по всем возможным ценовым вариантам
    //  - собираем их в объект
    for (let i = startingIndex; i <= deviceModeEnd; i++) {
      let sum = 0;

      // Прибавляем стоимость работы устройства на текущий час i
      // и добавляем оставшиеся значения от item.duration
      sum += ratesRangeData[i];
      for (let j = 0; j < item.duration - 1; j++) {
        sum += ratesRangeData[i - j];
      }

      costVariants[i] = (sum * item.power / 1000).toFixed(2);
      // На Я.трансляции прозвучало, что округлить до двух знаков после запятой достаточно
    }
    // Алгоритм для ночного режима
  } else {
    const HOURS_IN_DAY = 24;
    const NIGHT_MODE_BY_ITERATION = 30;

    // Для преодоления полуночи и сохранения релевантных цен
    // сбрасываем счетчик k вычитая из него HOURS_IN_DAY
    for (let i = startingIndex; i <= NIGHT_MODE_BY_ITERATION; i++) {
      let k = i >= HOURS_IN_DAY ? i - HOURS_IN_DAY : i;
      if (k === 0) { k = 1; }
      let sum = 0;
      // Прибавляем стоимость работы устройства на текущий час k
      // и добавляем оставшиеся значения от item.duration
      sum += ratesRangeData[k];
      for (let j = 0; j < item.duration - 1; j++) {
        sum += ratesRangeData[k - j];
      }

      // Введем еще один счетчик чтобы сравнЯть ключи в
      // результирующем объекте вне зависимости от режима работы прибора
      let m = i;
      if (m >= 24) { m -= 24; }
      costVariants[m] = (sum * item.power / 1000).toFixed(2);
    }
  }
  return costVariants;
};


/*
TODO:
- Найти в costVariants первое вхождение минимального значения.
- Пройтись по inputData с помощью forEach, внести все id в "schedule"
- Соответственно заполнить "consumedEnergy"
- Через JSON.stringify() вывести работу кода как JSON
- Рефакторинг, избавиться от eval
- Написать TLD юнит тесты
*/
