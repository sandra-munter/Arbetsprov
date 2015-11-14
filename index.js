var express     = require("express"),
	app         = express(),
	path        = require("path");

	app.get('/',function(req,res){
		res.sendFile(path.join(__dirname+'/html/index.html'));
	});

	app.use("/css", express.static(__dirname + '/css'));
	app.use("/js", express.static(__dirname + '/js'));


	app.listen(8089);

