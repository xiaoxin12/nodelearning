var createError = require('http-errors');
var express = require('express');
const i18next = require('i18next');
const i18nextMiddleware = require('i18next-express-middleware');
const Backend = require('i18next-node-fs-backend');
var ejs = require('ejs')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

i18next
	.use(Backend)
	.use(i18nextMiddleware.LanguageDetector)
	.init({
		backend:{
			loadPath: __dirname + '/locales/{{lng}}/{{ns}}.json',
			addPath: __dirname + '/locales/{{lng}}/{{ns}}.missing.json',
		},
		fallbackLng: 'de',
		preload: ['en', 'de'],
		saveMissing: true
	});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(i18nextMiddleware.handle(i18next))

// 拦截处理
var changefalag = false; // 是否需要切换语言
var currentlng = 'de';
app.use(function(req, res, next) {
	var url = req._parsedOriginalUrl.pathname
	console.log(url)
	let changeLanguage = url.indexOf('/changeLanguage');
	console.log(changeLanguage)
	if (changeLanguage > -1) {
		changefalag = true;
		currentlng = req.query['lng']; // 获取change 后的语言并寸起来
	}
	if (changefalag) {
		req.i18n.changeLanguage(currentlng)
	}
	// var a = req.t('home.user')
	// res.render('index', { title: a });
  	next();
});
app.use(['/', '/changeLanguage'], indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
