import socketio from 'socket.io'



const MediaServer = require("medooze-media-server")

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

    
    socket.on('publish', async (data:any, callback:Function) => {

        const sdp = SDPInfo.process(data.sdp)

        const transport = endpoint.createTransport(sdp)

        transport.setRemoteProperties(sdp)

        const answer = sdp.answer({
            dtls    : transport.getLocalDTLSInfo(),
            ice		: transport.getLocalICEInfo(),
            candidates: endpoint.getLocalCandidates(),
            capabilities: config.capabilities
        })

        transport.setLocalProperties(answer)

        const offerStream = sdp.getFirstStream()

        console.dir(offerStream)

        const incomingStream = transport.createIncomingStream(offerStream)

        const outgoingStream  = transport.createOutgoingStream({
            audio: false,
            video: true
        })

        const transponders = outgoingStream.attachTo(incomingStream)

        const transponder = transponders[0]

       

        answer.addStream(outgoingStream.getStreamInfo())

        callback({sdp: answer.toString()})





        // rid		: "c",
        // spatialLayerId	: 0,
        // temporalLayerId	: 2

        transponder.selectEncoding("c");
			//Select layer
        transponder.selectLayer(0,2);

        console.dir(transponder.getSelectedtEncoding());

        console.dir(transponder.getSelectedSpatialLayerId());

        console.dir(transponder.getSelectedTemporalLayerId());

        setInterval(() => {
            console.dir(transponder.getAvailableLayers())
        }, 1000)
    })

 
})

export = socketioServer