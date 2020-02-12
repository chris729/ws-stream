const path = require('path'),
	express = require('express'),
	http = require('http'),
	WebSocket = require('ws'),
	uuidv4 = require('uuid/v4'),
	muxjs = require('mux.js');
	
const app = express();
const httpServer = http.createServer(app);
var transmuxer = new muxjs.mp4.Transmuxer();

const PORT = process.env.PORT || 3000;

// create a socket server
const socketServer = new WebSocket.Server({server: httpServer}, () => {
	console.log(`WS server is listening at ws://localhost:${WS_PORT}`)
});

// just logging number of connected clients
connectedClients = {};
socketServer.on('connection', (socket, req) => {
	
	// assign each client a unique ID
	socket.id = uuidv4();
	connectedClients[socket.id] = true;
	console.log(Object.keys(connectedClients).length +' clients connected');
	
	socket.on('close', () => {
		delete connectedClients[socket.id];
		console.log(Object.keys(connectedClients).length +' clients connected');
	});
});

// broadcast function
socketServer.broadcast = function(data) {
	socketServer.clients.forEach(function each(client) {
		if (client.readyState === WebSocket.OPEN) {
				client.send(data);
		}
	});
};

// HTTP actions for client
app.get('/', (req, res) => {
	    res.send(
		`<a href="jsmpeg">jsmpeg</a><br>
         <a href="videojs">videojs</a>`
		);
});
app.get('/jsmpeg', (req, res) => { 
	res.sendFile(path.resolve(__dirname, './jsmpeg.html'))
});
app.get('/videojs', (req, res) => { 
	res.sendFile(path.resolve(__dirname, './videojs.html'))
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
		if(i==0){console.log('Data incoming..')}
		socketServer.broadcast(data);
		i++;
	});
	req.on('end',() => {
		i=0; 
		console.log('Data stopped.')
	});
});

httpServer.listen(PORT, () => {
	console.log(`HTTP server listening at http://localhost:${PORT}`)
});
