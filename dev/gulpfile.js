/* ----------------------------
 * gulp関連
 * ---------------------------- */
// gulp - 本体
const gulp = require("gulp");
// gulp-mode - 任意の名前でgulpのタスクを分けられる
const mode = require("gulp-mode")({
  modes: ["production", "development"], //分けたいモードの名前
  default: "development", //デフォルトのモード
});

/* ----------------------------
 * package - EJS関連
 * ---------------------------- */
// gulp-ejs - ejsのコンパイル
const ejs = require("gulp-ejs");
// gulp-thml-beautify - コンパイル後のhtmlを整形する
const htmlbeautify = require("gulp-html-beautify");
// htmlmin ejsファイルのコメントを削除する
const htmlmin = require("gulp-htmlmin");

/* ----------------------------
 * package - CSS関連
 * ---------------------------- */
// gulp-dart-sass
const sass = require("gulp-dart-sass");
// gulp-sass-glob-use-forward - dartsassで、一括読み込みを機能させる
const sassGlob = require("gulp-sass-glob-use-forward");
// gulp-postcss - postcssのパッケージを利用出切るようにする
const postcss = require("gulp-postcss");
// autoprefixer - scssコンパイル時に自動でベンダープレフィックスの付与する
const autoprefixer = require("autoprefixer");
// css-declaration-sorter - scssコンパイル時にcssを並び替える・ソートする
const cssSorter = require("css-declaration-sorter");
// css-mqpacker - scssコンパイル時に重複しているメディアクエリをひとつにまとめる
const mqpacker = require("css-mqpacker");
// gulp-clean-css - コンパイル時にcssを圧縮する
const cleanCss = require("gulp-clean-css");

/* ----------------------------
 * package - JS関連
 * ---------------------------- */
// gulp-uglify - jsファイルの圧縮
const uglify = require("gulp-uglify");
// gulp-babel - jsファイルのトランスパイル
const gulpBabel = require("gulp-babel");
// gulp-rollup - jsファイルのバンドル
const rollup = require("gulp-rollup");

/* ----------------------------
 * package - 画像関連
 * ---------------------------- */
// gulp-imagemin - PNG, JPEG, GIF, SVGの画像ファイルの圧縮
const imageMin = require("gulp-imagemin");
// imagemin-pngquant - gulp-imageminのpng圧縮率が低いため追加
const pngquant = require("imagemin-pngquant");
// gulp-webp - webp画像の圧縮
const webp = require("gulp-webp");

/* ----------------------------
 * package - その他
 * ---------------------------- */
// gulp-notify - gulpのタスクでエラーが起きた時にデスクトップ通知を行う
const notify = require("gulp-notify");
// gulp-plumber - notifyでエラーが起きた時に処理を継続する
const plumber = require("gulp-plumber");
// del - フォルダやファイルの削除をする
const del = require("del");
// gulp-rename - ファイルのリネーム
const rename = require("gulp-rename");
// browser-sync - ローカルサーバー立ち上げとホットリロード
const browserSync = require("browser-sync");
// path - nodeのpathを使えるようにする
const path = require("path");
const fs = require("fs");

/* ----------------------------
 * 各パス情報のソース
 * ---------------------------- */
const paths = {
  root: {
    dist: "../dist/",
  },
  ejs: {
    src: "./ejs/**/*.ejs",
    ignore: "!./ejs/**/_*.ejs",
    dist: "../dist/",
  },
  css: {
    src: "./assets/css/**/*.css",
    dist: "../dist/assets/css/",
    copy: {
      src: "./assets/css/libs/*.css",
      dist: "../dist/assets/css/libs/",
    },
  },
  scss: {
    src: "./assets/scss/**/*.scss",
    dist: "../dist/assets/css/",
    include: [path.resolve(__dirname, "scss")],
  },
  js: {
    src: "./assets/js/**/*.js",
    dist: "../dist/assets/js/",
    ignore: "!./assets/js/libs/**.js",
    copy: {
      src: "./assets/js/libs/**.js",
      dist: "../dist/assets/js/libs/",
    },
  },
  images: {
    src: "./assets/images/**/*",
    dist: "../dist/assets/images/",
  },
  clean: {
    all: "../dist/",
    images: "../dist/assets/images/",
  },
};

/* ----------------------------
 * gulpタスク - EJSのコンパイル
 * ---------------------------- */
const compileEjs = done => {
  const json = JSON.parse(fs.readFileSync("./ejs/data/page-data.json", "utf-8"));
  gulp
    .src([paths.ejs.src, paths.ejs.ignore])
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: "EJSコンパイルエラー",
          message: "Error: <%= error.message %>",
        }),
      })
    )
    .pipe(ejs({ jsonData: json })) //jsonデータの受け渡し
    .pipe(rename({ extname: ".html" }))
    .pipe(
      htmlmin({
        collapseWhitespace: true, // 余白を除去する
        removeComments: true, // HTMLコメントを除去する
      })
    )
    .pipe(
      htmlbeautify({
        indent_size: 2,
        indent_char: "\t",
        preserve_newlines: false,
      })
    )
    .pipe(gulp.dest(paths.ejs.dist));
  done();
};

/* ----------------------------
 * gulpタスク - scssのコンパイル
 * ---------------------------- */
const compileSass = done => {
  gulp
    .src(paths.scss.src, { sourcemaps: true })
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: "Scssコンパイルエラー",
          message: "Error: <%= error.message %>",
        }),
      })
    )
    .pipe(sassGlob())
    .pipe(
      sass.sync({
        includePaths: ["node_modules", "assets/scss"],
      })
    )
    .pipe(postcss([autoprefixer(), mqpacker(), cssSorter()]))
    .pipe(mode.development(gulp.dest(paths.scss.dist, { sourcemaps: "./sourcemaps" })))
    .pipe(mode.production(cleanCss())) //本番環境圧縮なしの場合は、コメントアウト
    .pipe(mode.production(gulp.dest(paths.scss.dist)));
  done();
};

/* ----------------------------
 * gulpタスク - jsのコンパイル
 * ---------------------------- */
// const compileJs = done => {
//   gulp
//     .src(paths.js.src, { sourcemaps: true })
//     .pipe(
//       plumber({
//         errorHandler: notify.onError({
//           title: "JSコンパイルエラー",
//           message: "Error: <%= error.message %>",
//         }),
//       })
//     )
//     .pipe(
//       gulpBabel({
//         presets: ["@babel/preset-env"],
//       })
//     )
//     .pipe(mode.production(uglify())) //本番環境圧縮なしの場合は、コメントアウト
//     .pipe(mode.development(gulp.dest(paths.js.dist, { sourcemaps: "./sourcemaps" })))
//     .pipe(mode.production(gulp.dest(paths.js.dist)));
//   done();
// };

/* ----------------------------
 * gulpタスク - jsのコンパイル - rollup
 * ---------------------------- */
const compileJs = done => {
  gulp
    .src([paths.js.src, paths.js.ignore], { sourcemaps: true })
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: "JSコンパイルエラー",
          message: "Error: <%= error.message %>",
        }),
      })
    )
    .pipe(
      rollup({
        input: "./assets/js/main.js",
        format: "esm",
        moduleName: "sample_module",
      })
    )
    .pipe(
      gulpBabel({
        presets: ["@babel/preset-env"],
      })
    )
    .pipe(mode.production(uglify())) //本番環境圧縮なしの場合は、コメントアウト
    .pipe(mode.development(gulp.dest(paths.js.dist, { sourcemaps: "./sourcemaps" })))
    .pipe(mode.production(gulp.dest(paths.js.dist)));
  done();
};

/* ----------------------------
 * gulpタスク - 画像の圧縮
 * ---------------------------- */
const minImages = done => {
  gulp
    .src(paths.images.src, {
      since: gulp.lastRun(minImages),
    })
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: "Imageコンパイルエラー",
          message: "Error: <%= error.message %>",
        }),
      })
    )
    .pipe(
      imageMin([
        imageMin.mozjpeg({ quality: 80 }), // 圧縮率
        imageMin.gifsicle({ optimizationLevel: 3 }), // 圧縮レベル
        pngquant({
          quality: [0.6, 0.8], // 画質の最小と最大
        }),
        imageMin.svgo({
          plugins: [
            {
              removeViewbox: false, // フォトショやイラレで書きだされるviewboxを消すかどうか※表示崩れの原因になるのでfalse推奨。以降はお好みで。
            },
            {
              removeMetadata: false, // <metadata>を削除するかどうか
            },
            {
              convertColors: false, // rgbをhexに変換、または#ffffffを#fffに変換するかどうか
            },
            {
              removeUnknownsAndDefaults: false, // 不明なコンテンツや属性を削除するかどうか
            },
            {
              convertShapeToPath: false, // コードが短くなる場合だけ<path>に変換するかどうか
            },
            {
              collapseGroups: false, // 重複や不要な`<g>`タグを削除するかどうか
            },
            {
              cleanupIDs: false, //SVG内に<style>や<script>がなければidを削除するかどうか
            },
          ],
        }),
      ])
    )
    .pipe(webp())
    .pipe(gulp.dest(paths.images.dist));
  done();
};

/* ----------------------------
 * gulpタスク - ディレクトリのコピー
 * ---------------------------- */
const copyCss = done => {
  gulp.src(paths.css.src).pipe(gulp.dest(paths.css.dist));
  done();
};

const copyJs = done => {
  gulp.src(paths.js.copy.src).pipe(gulp.dest(paths.js.copy.dist));
  done();
};

/* ----------------------------
 * gulpタスク - distのディレクトリやファイルを削除
 * ---------------------------- */
const cleanAll = done => {
  del([paths.clean.all], { force: true });
  done();
};

/* ----------------------------
 * gulpタスク - ローカルブラウザ関連
 * ---------------------------- */
// ローカルブラウザの立ち上げ
const browserInit = done => {
  browserSync.init({
    notify: false,
    server: {
      baseDir: paths.root.dist,
    },
  });
  done();
};

// ブラウザリロードタスク
const browserReload = done => {
  browserSync.reload();
  done();
};

/* ----------------------------
 * gulpタスク - ファイルの監視タスク
 * ---------------------------- */

const watch = done => {
  gulp.watch(paths.ejs.src, { delay: 200 }, gulp.series(compileEjs, browserReload));
  gulp.watch(paths.css.src, { delay: 200 }, gulp.series(copyCss, browserReload));
  gulp.watch(paths.scss.src, { delay: 200 }, gulp.series(compileSass, browserReload));
  gulp.watch(paths.js.src, { delay: 200 }, gulp.series(compileJs, browserReload));
  gulp.watch(paths.images.src, { delay: 200 }, minImages);
  done();
};

/* ----------------------------
 * 各タスクの実行コマンドを定義
 * ---------------------------- */
// 単一のタスクコマンド コマンドは、例 - nxp gulp compileSass
exports.compileEjs = compileEjs;
exports.compileSass = compileSass;
exports.compileJs = compileJs;
exports.minImages = minImages;
exports.watch = watch;
exports.cleanAll = cleanAll;

exports.browserInit = browserInit;

// 一括のタスクコマンド
exports.start = gulp.parallel(browserInit, watch);
exports.dev = gulp.parallel(compileEjs, copyCss, compileSass, copyJs, compileJs, minImages);
exports.build = gulp.parallel(compileEjs, copyCss, compileSass, copyJs, compileJs, minImages);
