const path = require('path'),
	express = require('express'),
	http = require('http'),
	WebSocket = require('ws');

const app = express();
const httpServer = http.createServer(app);

const PORT = process.env.PORT || 3000;

// create a socket server
const socketServer = new WebSocket.Server({server: httpServer}, () => {
	console.log(`WS server is listening at ws://localhost:${WS_PORT}`)
});

// just logging number of connected clients
socketServer.connectionCount = 0;
socketServer.on('connection', (socket, req) => {
	socketServer.connectionCount++;
	console.log(socketServer.connectionCount+' clients connected');
	
	socket.on('close', ()=>{
		socketServer.connectionCount--;
		console.log(socketServer.connectionCount+' clients connected');
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
	    res.send(`
        <a href="jsmpeg">jsmpeg</a><br>
        <a href="videojs">videojs</a>
    `);
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

// HTTP actions for streamer
app.all('/streamer', (req, res) => {
	var i=0;
	req.on('data', data => {
		i++;
		if(i==1){console.log('Data incoming..')}
		socketServer.broadcast(data);
	});
	req.on('end',() => {
		i=0; 
		console.log('Data stopped.')
	});
});

httpServer.listen(PORT, () => {
	console.log(`HTTP server listening at http://localhost:${PORT}`)
});
