// Составляет график цен по часам
const createRatesMap = (dataRanges) => {
  const MIDNIGHT = 23;
  let rates = {};
  if (dataRanges.length <= 0 || dataRanges.length > 24) {
    throw new Error(`rates amount should not be <= 0 or exceed length of a day`);
  }

  // Если показатель переходит через полночь -
  // отталкиваемся не от `it.to`, а от MIDNIGHT
  dataRanges.forEach((it) => {
    if (it.to === it.from) {
      throw new Error(`it.from and it.to should not be equal`);
    }
    if (it.to > it.from) {
      for (let i = it.from; i <= it.to; i++) {
        rates[i] = it.value;
      }
    } else {
      for (let j = it.from; j <= MIDNIGHT; j++) {
        rates[j] = it.value;
      }
      for (let q = 0; q < it.to; q++) {
        rates[q] = it.value;
      }
    }
  });
  return rates;
};

export default createRatesMap;
