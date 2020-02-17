const path = require('path'),
	express = require('express'),
	http = require('http'),
	WebSocket = require('ws'),
	uuidv4 = require('uuid/v4'),
	muxjs = require('mux.js');
	
const app = express();
const httpServer = http.createServer(app);
var transmuxer = new muxjs.mp4.Transmuxer();
var initBlock = [];

const PORT = process.env.PORT || 3000;

// create a socket server
const socketServer = new WebSocket.Server({server: httpServer}, () => {
	console.log(`WS server is listening at ws://localhost:${WS_PORT}`)
});

// just logging number of connected clients
initClient = {};
socketServer.on('connection', (socket, req) => {
	
	// assign each new client a unique ID
	socket.id = uuidv4();
	initClient[socket.id] = false;
	console.log(Object.keys(initClient).length +' clients connected');
	
	// always send the init blocks as soon as a client connects
	if(!initClient[socket.id]){
		ftype = initBlock[0];
		moov = initBlock[1];
		//console.log(muxjs.mp4.tools.inspect(ftype));
		//console.log(muxjs.mp4.tools.inspect(moov));
		socket.send(ftype);
		socket.send(moov);
		initClient[socket.id] = true;
	}
	
	socket.on('close', () => {
		// on websocket closure remove the client
		delete initClient[socket.id];
		console.log(Object.keys(initClient).length +' clients connected');
	});
});

// broadcast function
socketServer.broadcast = function(data) {
	socketServer.clients.forEach(function each(client) {
		if ((client.readyState === WebSocket.OPEN) && initClient[client.id]) {
			//console.log('Data sent');
			client.send(data);
		}
	});
};

// HTTP actions for client
app.get('/', (req, res) => {
	    res.send(
		`<a href="jsmpeg">jsmpeg</a><br>
         <a href="fMP4-video">fMP4 video</a><br>
		 <a href="fMP4-audio">fMP4 audio</a>`
		);
});
app.get('/fMP4-video', (req, res) => { 
	res.sendFile(path.resolve(__dirname, './fMP4-video.html'))
});
app.get('/fMP4-audio', (req, res) => { 
	res.sendFile(path.resolve(__dirname, './fMP4-audio.html'))
});
app.get('/jsmpeg', (req, res) => { 
	res.sendFile(path.resolve(__dirname, './jsmpeg.html'))
});
app.get('/js/jsmpeg.min.js', (req, res) => {
	res.sendFile(path.resolve(__dirname, './js/jsmpeg.min.js'))
});
app.get('/js/mux.js', (req, res) => {
	res.sendFile(path.resolve(__dirname, './js/mux.js'))
});


// HTTP actions for streamer
app.all('/streamer', (req, res) => {
	var i=0;
	req.on('data', data => {
		// first two chunks of data will be ftype and moov for init block
		if(i==0){
			console.log('Data incoming..');
		}
		if(i<2){
			initBlock.push(data);
			i++;
		}
		else{
			socketServer.broadcast(data);
		}
	});
	req.on('end',() => {
		i=0; 
		initBlock = [];
		console.log('Data stopped.')
	});
});

httpServer.listen(PORT, () => {
	console.log(`HTTP server listening at http://localhost:${PORT}`)
});
