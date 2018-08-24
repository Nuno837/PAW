const express = require('express');
const router = express.Router();

router.get('/registar', function(request, response){
	response.set("Content-Type", "text/html");
	response.render('registar-produtor', {})
});



module.exports = router;