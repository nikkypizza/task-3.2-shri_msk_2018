const gulp = require(`gulp`);
const mocha = require(`gulp-mocha`);
const rollup = require(`gulp-better-rollup`);
const commonjs = require(`rollup-plugin-commonjs`);

gulp.task(`test`, () => {
  return gulp
    .src([`js/**/*.test.js`])
    .pipe(rollup({
      plugins: [
        commonjs()
      ]
    }, `cjs`))
    .pipe(gulp.dest(`public`))
    .pipe(mocha({
      reporter: `spec`
    }));
});
