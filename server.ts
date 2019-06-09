import Server from './src/server'

const pubServer = new Server({})


pubServer.listen(5000, '0.0.0.0', () => {
    console.log('listen on port ', 5000)
})
