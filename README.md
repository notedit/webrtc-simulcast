# webrtc-simulcast
webrtc  simulcast  demo




## 安装

请先安装 node 10，  目前不支持node 10.0 以上的版本 


安装依赖：

npm install 


运行：

npx ts-node server.ts


打开浏览器：

http://localhost:5000/



验证replaceTrack:

videotransceiver.sender.replaceTrack(null)

videotransceiver.sender.replaceTrack(videoTrack)
