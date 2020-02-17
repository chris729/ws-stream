const path = require('path'),
	express = require('express'),
	http = require('http'),
	WebSocket = require('ws'),
	uuidv4 = require('uuid/v4'),
	ffmpeg = require('fluent-ffmpeg'),
	muxjs = require('mux.js');
	
const app = express();
const httpServer = http.createServer(app);
var transmuxer = new muxjs.mp4.Transmuxer();
var initBlock = [];

const PORT = process.env.PORT || 3000;

// create a socket server
const socketServer = new WebSocket.Server({
	perMessageDeflate: false,
	server: httpServer
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
	socketServer.clients.forEach(function each(client){
		if((client.readyState === 1) && initClient[client.id]){
			client.send(data);
		}
	});
};

/*
var input = process.stdin;
console.log("Please enter rtmp feed and type (v/a): ");
console.log("eg. rtmp://localhost:3000 v");

type = 'v';

input.on('data', data => {
	
	data = String(data).split(' ');
	let feedUrl = String(data[0]).trim();
	type = String(data[1]).trim();
	*/
	
	// testing on heroku with buildpacks
	let type = 'v';
	let feedUrl = 'rtmp://aflradio.wow1.vosm.privatemediacloudservice.telstra.com/live/racingvic';
	
	if (type == 'a'){
		console.log('audio streaming');
		video = ffmpeg(feedUrl, { timeout: 432000 }).addOptions([
		// can change options here - must be supported by browser
			'-vn',
			'-c:a aac',
			'-b:a 192k', 
			'-f mp4', 
			'-movflags empty_moov+default_base_moof+frag_every_frame' 
		]).pipe()
	} 
	else {
		console.log('video streaming');
		video = ffmpeg(feedUrl, { timeout: 432000 }).addOptions([
		// can change options here - must be supported by browser
			'-c:v h264',
			'-c:a aac',
			'-b:a 44k',
			'-vf format=yuv420p',
			'-profile:v baseline',
			'-level 3.1',
			'-b:v 900k', 
			'-f mp4', 
			'-movflags empty_moov+default_base_moof+frag_every_frame' 
		]).pipe()
	}
	i=0;
	video.on('data', data => {
		// first two chunks of data will be ftype and moov for init block
		//console.log(muxjs.mp4.tools.inspect(data));
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
	})
//})

// HTTP actions for client
app.get('/', (req, res) => { 
	if(type == 'a'){
		res.sendFile(path.resolve(__dirname, './fMP4-audio.html'))
	}else{	
		res.sendFile(path.resolve(__dirname, './fMP4-video.html'))
	}
	
});
app.get('/js/mux.js', (req, res) => {
	res.sendFile(path.resolve(__dirname, './js/mux.js'))
});
httpServer.listen(PORT);