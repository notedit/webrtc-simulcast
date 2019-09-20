import socketio from 'socket.io'



const MediaServer = require("../medooze-media-server")

const SemanticSDP = require('semantic-sdp')

const SDPInfo		= SemanticSDP.SDPInfo
const MediaInfo		= SemanticSDP.MediaInfo
const CandidateInfo	= SemanticSDP.CandidateInfo
const DTLSInfo		= SemanticSDP.DTLSInfo
const ICEInfo		= SemanticSDP.ICEInfo
const StreamInfo	= SemanticSDP.StreamInfo
const TrackInfo		= SemanticSDP.TrackInfo
const Direction		= SemanticSDP.Direction
const CodecInfo		= SemanticSDP.CodecInfo


import config from './config'


// MediaServer.enableDebug(true)
// MediaServer.enableUltraDebug(true)




const socketioServer = socketio({
    pingInterval: 10000,
    pingTimeout: 5000,
    transports: ['websocket'] 
})





socketioServer.on('connection', async (socket: SocketIO.Socket) => {


    const endpoint = MediaServer.createEndpoint(config.endpoint)

    let transponder:any
    
    socket.on('publish', async (data:any, callback:Function) => {

        const sdp = SDPInfo.process(data.sdp)

       

        const transport = endpoint.createTransport(sdp)

        transport.setBandwidthProbing(true)

        transport.setRemoteProperties(sdp)

        transport.on('targetbitrate', (bitrate) => {

            if (!bitrate) {
                return;
            }
            
            const used = transponder.setTargetBitrate(300000)
            const stats = transponder.getAvailableLayers()
            console.log("targetbitrate " + bitrate + " Encoding " + transponder.getSelectedtEncoding() +" TL:" + transponder.getSelectedTemporalLayerId() + " used "+used);
            
        })
        
        transport.setBandwidthProbing(true)
        transport.setMaxProbingBitrate(0)


        const answer = sdp.answer({
            dtls    : transport.getLocalDTLSInfo(),
            ice		: transport.getLocalICEInfo(),
            candidates: endpoint.getLocalCandidates(),
            capabilities: config.capabilities
        })

        transport.setLocalProperties(answer)

        const offerStream = sdp.getFirstStream()

        const incomingStream = transport.createIncomingStream(offerStream)

        // const outgoingStream  = transport.createOutgoingStream({
        //     audio: false,
        //     video: true
        // })

        // const transponders = outgoingStream.attachTo(incomingStream)

        // transponder = transponders[0]

        // const outgoingTrack = outgoingStream.getVideoTracks()[0]


        // outgoingTrack.on('remb', (bitrate) => {

        //     console.log('remb')

        //     if (!bitrate) {
        //         return
        //     }

        //     const used = transponder.setTargetBitrate(bitrate)
        //     const stats = transponder.getAvailableLayers()
        //     transport.setMaxProbingBitrate(stats.layers[0].bitrate)

        //     console.log("remb " + bitrate + " Encoding " + transponder.getSelectedtEncoding() +" TL:" + transponder.getSelectedTemporalLayerId() + " used "+used);

        // })



        //answer.addStream(outgoingStream.getStreamInfo())

        callback({sdp: answer.toString()})


        //transponder.selectEncoding('c')



        // rid		: "c",
        // spatialLayerId	: 0,
        // temporalLayerId	: 2

        //transponder.selectEncoding("c");
			//Select layer
        // transponder.selectLayer(0,2);

        // console.dir(transponder.getSelectedtEncoding());

        // console.dir(transponder.getSelectedSpatialLayerId());

        // console.dir(transponder.getSelectedTemporalLayerId());

        setInterval(() => {
            //console.dir(transponder.getAvailableLayers())
        }, 5000)
    })

 
})

export = socketioServer
