function changeLanguage (language) {
	console.log(language)
	$.ajax({
		url: '/changeLanguage?lng=' + language,
		type: 'get'
	}).done(function(data) {
		location.reload()
	})
	.fail((err)=>{
		// location.reload()
		console.log(err)
	})
}