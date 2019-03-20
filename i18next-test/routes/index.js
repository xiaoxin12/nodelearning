var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  // console.log(req)
  var data = {
  	title: req.t('home.title'),
  	user: req.t('home.user')
  }
	// res.send(req.t('home.user'))
  res.render('index', data);
});
/* 切换语言了 */
router.get('/changeLanguage', function(req, res, next) {
	// console.log(req)
	res.send('')
});

module.exports = router;
