import express from 'express'
import path from 'path'

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}

const BASE_URL = process.env.BASE_URL || ''
const PORT = process.env.PORT || 3002

const publicPath = path.resolve(__dirname, './public')

const init = async () => {
  const app = express()

  app.use(
    BASE_URL,
    express.static(publicPath, {
      index: false,
      maxAge: 30 * 24 * 60 * 3600,
    }),
  )

  app.get('/*', (_, res) => {
    res.sendFile(`${publicPath}/index.html`)
  })

  app.listen(PORT, () => {
    if (process.env.NODE_ENV === 'development') console.log('server started at http://localhost:' + PORT)
  })
}

init()

export default init
