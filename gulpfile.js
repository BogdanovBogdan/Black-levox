"use stirct";


const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const terser = require('gulp-terser');
const concat = require('gulp-concat');
const cleanCss = require('gulp-clean-css');
const del = require('del');
const htmlreplace = require('gulp-html-replace');
const svgSprite = require('gulp-svg-sprite');


const prodDist = "./docs/";
const devDist = "./src/";
// const serverDest = "D://Program Files//Open Server//OSPanel//domains//";


const htmlPath = "./src/index.html";
const cssPath = "./src/css/*.css";
const jsPath = "./src/js/**/script.js";
const sassToCssPath = "./src/sass/**/*.sass";
const copySrcPaths = ["./src/**/*.*", `!${htmlPath}`, `!${cssPath}`, `!${jsPath}`, `!${sassToCssPath}`];
const spritePath = './src/img/sprite/';



const buildProd = (done) => {

	function html() {
		return gulp.src(htmlPath)
			.pipe(htmlreplace({
				'stylesheet': './css/style.min.css'
			}))
			.pipe(gulp.dest(prodDist));
	}

	function css() {
		return gulp.src(cssPath)
			.pipe(concat('style.min.css'))
			.pipe(cleanCss())
			.pipe(gulp.dest(prodDist + "/css"));
	};

	function js() {
		return gulp.src(jsPath)
			.pipe(terser()) // compressor
			.pipe(gulp.dest(prodDist + "/js"));
	};

	function copySrc() {
		return gulp.src(copySrcPaths)
			.pipe(gulp.dest(prodDist));
	};

	function cleanDist() {
		return del(prodDist)
	}

	(async function run() {
		browserSync.init({
			server: prodDist,
			port: 666
		});

		await cleanDist();
		html();
		css();
		js();
		copySrc();
	})();

	done();
}


const serve = (done) => {

	function html() {
		return gulp.src(htmlPath)
			.pipe(browserSync.stream());
	};

	function css() {
		return gulp.src(cssPath)
			.pipe(browserSync.stream());
	};

	function js() {
		return gulp.src(jsPath)
			.pipe(browserSync.stream());
	};

	function sassToCss() {
		return gulp.src(sassToCssPath)
			.pipe(sass({
				errorLogToConsole: true
			}))
			.on('error', console.error.bind(console))
			.pipe(autoprefixer({
				cascade: false,
				overrideBrowserslist: ["last 3 versions"]
			}))
			.pipe(gulp.dest("src/css"))
			.pipe(browserSync.stream());
	};

	function run() {
		browserSync.init({
			server: devDist,
			port: 4000,
			notify: true
		});

		html();
		css();
		js();
		sassToCss();

		gulp.watch(htmlPath, html);
		gulp.watch(cssPath, css);
		gulp.watch(jsPath, js);
		gulp.watch(sassToCssPath, sassToCss);
	}
	run();

	done();
}

gulp.task("clean", () => {
	return del("./**/.gitkeep");
});

const spriteConfig = {
	shape: { 
		id: { whitespace: '-' }
	},
	svg: {
		xmlDeclaration: false,
		dimensionAttributes: false,
		transform: [
			function(minifySprite) {
				const splitSprite = minifySprite.match(/<.+?>/gi);
				let unminifySprite;
				unminifySprite = splitSprite
					.map(line => {
						if (line.includes('<path')) return '\n\t\t' + line;
						else if (line.match(/<\/?symbol/gi)) return '\n\t' + line;
						else if (line.includes('</svg>')) return '\n' + line;
						else return line;
					})
					.join('')
				return unminifySprite;
			}
		]
	},
	mode: {
		symbol: {
			prefix: '.icon-',
			bust: false,
			render: { scss: true },
			// example: { dest: 'sprite.html' },
		}
	}
};


gulp.task("sprite", () => {
	return gulp.src(spritePath + '*.svg')
		.pipe(svgSprite(spriteConfig))
		.pipe(gulp.dest(spritePath))
})

gulp.task("buildProd", buildProd)
gulp.task("default", serve);


