'use strict'
import express from 'express'
import axios from 'axios'
import fileType from 'file-type'

const gifExtractFrames = require('gif-extract-frames')

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())

app.get('/', (req, res) => void res.sendStatus(405))
app.post('/', async (req, res) => {
    const type = req.headers['content-type']

    if (type !== 'application/json') {
        res.sendStatus(400)
        return
    }

    const { image }: { image: string } = req.body

    if (typeof image !== 'string' || image.length === 0) {
        res.sendStatus(400)
        return
    }
    try {
        const imgRes = await axios({
            url: image,
            method: 'get',
            responseType: 'stream'
        })

        const { mime } = await fileType.fromStream(imgRes.data) || {}

        if (typeof mime !== 'string' || mime.split('/')[0] !== 'image') {
            res.sendStatus(400)
            return
        }

        console.log(await gifExtractFrames('https://i.imgur.com/2T7glHi.gif'))

        res.sendStatus(200)
    } catch (e) {
        console.error(e)
        res.sendStatus(400)
    }
})

const listener = app.listen(PORT, () => console.log(`Your app is listening on port ${PORT}`))