import express from 'express'

const createApp = ():express.Application => {
    const app = express()
    app.use(express.urlencoded())
    app.use(express.json())
    app.use()

    return app
}