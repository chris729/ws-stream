# websocket-stream-project


`git clone`

`npm install` 

`npm start`

go to http://localhost:3000/

Please define a 'FEED' variable (such as a rtmp url)  in your environment to run ffmpeg directly on your server. This results in lower latency.
Also change the 'type' variable in web-server.js to 'a' if you want to stream audio only.

Otherwise you can stream from ffmpeg on your pc (higher latency) with the commands below: 

fMP4 video can be streamed using the command:
`ffmpeg -i sample.mp4 -c:a aac -b:a 192k -vcodec libx264 -vf format=yuv420p -profile:v baseline -level 3.1 -f mp4 -movflags empty_moov+default_base_moof+frag_every_frame http://localhost:3000/streamer`

fMP4 audio can be streamed using the command:
`ffmpeg -i sample.mp4 -vn -c:a aac -b:a 192k -f mp4 -movflags empty_moov+default_base_moof+frag_every_frame http://localhost:3000/streamer`

if deploying on heroku http://localhost:3000/ is replaced by https://(your app name).herokuapp.com/