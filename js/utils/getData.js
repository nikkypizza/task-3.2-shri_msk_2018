// Подгружает файл синхронно через Ajax, возвращает респонс
const loadJsonFileAjaxSync = (filePath) => {
  const xhr = new XMLHttpRequest();
  xhr.open(`GET`, filePath, false);
  xhr.send();
  switch (xhr.status) {
    case 200:
      return xhr.responseText;
    case 400:
      console.log(`${xhr.status} - Неверный запрос`);
      break;
    case 401:
      console.log(`${xhr.status} - Пользователь не авторизован`);
      break;
    case 404:
      console.log(`${xhr.status} - Файл не найден`);
      break;
    default:
      console.log(`${xhr.status} - ${xhr.statusText}`);
  }
};

// Подгружает локальный JSON и возвращает объект
const parseJSON = (filePath) => {
  const json = loadJsonFileAjaxSync(filePath);
  return JSON.parse(json);
};

export default parseJSON;
