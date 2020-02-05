# websocket-stream-project


`git clone`

`npm install` 

`npm start`

go to http://localhost:3000/

stream to jsmpeg using ffmpeg eg:
`ffmpeg -f dshow -i video="Integrated Camera" -f mpegts -codec:v mpeg1video http://localhost:3000/streamer`

stream to videojs using ffmpeg eg:
`ffmpeg -f dshow -i video="Integrated Camera" -f webm -c vp8 -g 1 http://localhost:3000/streamer`

if deploying on heroku http://localhost:3000/ is replaced by https://"$<$your app name$>$".herokuapp.com/

Known bug: client must be connected before stream starts when using videojs