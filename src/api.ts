import { Response, Request, Router } from 'express'


const apiRouter = Router()



apiRouter.get('/test', async (req: Request, res: Response) => {
    res.send('hello world')
})


apiRouter.get('/', async (req: Request, res: Response) => {
    res.sendFile('index.html', { root: __dirname + '/../public'})
})



export default apiRouter

