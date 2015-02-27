var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  console.log('IP: '+add);
})

// https://github.com/octalmage/robotjs
var robot = require("robotjs");

var lastX = lastY = 0;

app.get('/', function(req, res){
	res.sendfile('index.html');
});

app.get('/jquery.js', function(req, res){
	res.sendfile('jquery.js');
});

app.get('/socketio.js', function(req, res){
	res.sendfile('socketio.js');
});

app.get('/mouse.png', function(req, res){
	res.sendfile('mouse.png');
});

io.on('connection', function(socket){
	
	//console.log('a user connected');

	socket.on("start", function(touch){
		//console.log(touch);
		
		lastX = touch.touches[0].clientX; 
		lastY = touch.touches[0].clientY;

	});

	socket.on("move", function(touch){
		//console.log(arg);
		var mouse=robot.getMousePos();
		
		var x = touch.touches[0].clientX;
		var y = touch.touches[0].clientY;
		//console.log(x+","+y);

		var incrX = x - lastX;
		var incrY = y - lastY;

		lastX = x; lastY = y;
		robot.moveMouse(mouse.x+incrX, mouse.y+incrY);

	});

	socket.on("click", function(touch){
		//console.log(touch);
		
		robot.mouseClick();

	});

	socket.on("dblclick", function(touch){
		console.log("dblclick");
		
		robot.mouseClick();
		robot.mouseClick();

	});


});

http.listen(3000, function(){
	console.log('listening on *:3000');
});