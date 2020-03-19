const express = require('express')
const app = express()
const http = require('http').Server(app)
const socketIO = require('socket.io')(http)

const initServer = () => {
  // For CORS policy
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PATCH, PUT, DELETE, OPTIONS'
    )
    next()
  })

  // For parsing incoming JSON requests
  app.use(express.json())

  // For admin API
  app.use('/api/rules', require('./api-routes/rules'))
  app.use('/api/openapi', require('./api-routes/openapi'))
  app.use('/api/outbound', require('./api-routes/outbound'))
  app.use('/api/config', require('./api-routes/config'))
  app.use('/longpolling', require('./api-routes/longpolling'))

  // // For front-end UI
  // app.use('/ui', express.static(path.join('client/build')))

  // app.get('*', (req, res) => {
  //   res.sendFile(process.cwd() + '/client/build/index.html')
  // })
}

const startServer = port => {
  initServer()
  http.listen(port)
  console.log('API Server started on port ' + port)
}

const getApp = () => {
  if (!Object.prototype.hasOwnProperty.call(app, '_router')) { // To check whether app is initialized or not
    initServer()
  }
  return app
}

module.exports = {
  startServer,
  socketIO,
  getApp
}
