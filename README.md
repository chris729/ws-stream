# websocket-stream-project


`git clone`

`npm install` 

`npm start`

go to http://localhost:3000/

jsmpeg can be used to stream mpeg1 using the command:
`ffmpeg -i sample.mp4 -f mpegts -codec:v mpeg1video http://localhost:3000/streamer`

Video can be streamed to the videojs player with the command:
`ffmpeg -i sample.mp4 -c:a aac -b:a 192k -vcodec libx264 -vf format=yuv420p -profile:v baseline -level 3.1 -f mp4 -movflags empty_moov+default_base_moof+frag_every_frame http://localhost:3000/streamer`

Audio can be streamed to videojs by changing the mime source in the videojs.html file and using the command:
`ffmpeg -i sample.mp4 -vn -c:a aac -b:a 192k -f mp4 -movflags empty_moov+default_base_moof+frag_every_frame http://localhost:3000/streamer`


if deploying on heroku http://localhost:3000/ is replaced by https://(your app name).herokuapp.com/
