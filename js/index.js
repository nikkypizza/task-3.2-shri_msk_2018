import parseJSON from './utils/getData.js';

const pathToInputData = 'js/data/input.json';

const inputData = parseJSON(pathToInputData);
console.log(inputData);
