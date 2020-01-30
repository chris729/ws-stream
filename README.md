# websocket-stream-project

Download project
run: 

npm install 

npm start

go to localhost:3000/

stream using ffmpeg eg:
ffmpeg -f dshow -framerate 25 -i video="Integrated Camera" -f mpegts -codec:v mpeg1video -s 640x480 -b:v 1000k -bf 0 http://localhost:3000/streamer

