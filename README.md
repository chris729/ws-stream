# websocket-stream-project


`git clone`

`npm install` 

`npm start`

go to http://localhost:3000/

stream using ffmpeg eg:
`ffmpeg -f dshow -framerate 25 -i video="Integrated Camera" -f mpegts -codec:v mpeg1video -s 640x480 -b:v 1000k -bf 0 http://localhost:3000/streamer`

if deploying on heroku http://localhost:3000/ is replaced by https://<your app name>.herokuapp.com/