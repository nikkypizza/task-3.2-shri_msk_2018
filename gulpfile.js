const gulp = require(`gulp`);
const mocha = require(`gulp-mocha`); // Добавим gulp-mocha плагин

gulp.task(`test`, function () {
  return gulp
  .src([`js/**/*.test.js`])
  .pipe(mocha({
    reporter: `nyan` // Вид в котором я хочу отображать результаты тестирования
  }));
});
