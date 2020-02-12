# websocket-stream-project


`git clone`

`npm install` 

`npm start`

go to http://localhost:3000/

jsmpeg can be used to stream mpeg1:
`ffmpeg -f dshow -i video="Integrated Camera" -f mpegts -codec:v mpeg1video http://localhost:3000/streamer`

videojs can be used to stream fragmented mp4:
`ffmpeg -f dshow -i video="Integrated Camera" -vcodec libx264 -vf format=yuv420p -profile:v baseline -level 3.1 -f mp4 -movflags empty_moov+default_base_moof+frag_every_frame http://localhost:3000/streamer`

if deploying on heroku http://localhost:3000/ is replaced by https://(your app name).herokuapp.com/

Known bug: client must be connected before stream starts when using videojs stream