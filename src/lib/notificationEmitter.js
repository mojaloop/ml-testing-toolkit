const path = require('path')
const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

// io.on("connection", socket => {
//   // socket.leave(socketId);
//   // socket.join(socketId);
//   //   socket.to(doc.id).emit("document", doc);
//   io.emit("logRefresh", []);
//   const sendNotification = counter => {
//     socket.emit("newLog", { message: 'Log no'+counter});
//     setTimeout(sendNotification,1000,counter+1);
//   };
//   sendNotification(1);
// });

const startServer = port => {
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

  // For front-end UI
  app.use('/ui', express.static(path.join('client/build')))

  app.get('*', (req, res) => {
    res.sendFile(process.cwd() + '/client/build/index.html')
  })

  http.listen(port)
  console.log('API Server started on port ' + port)
}

const broadcastLog = log => {
  io.emit('newLog', {
    logTime: new Date(),
    ...log
  })
}

const broadcastOutboundProgress = status => {
  io.emit('outboundProgress', {
    reportTime: new Date(),
    ...status
  })
}

module.exports = {
  startServer,
  broadcastLog,
  broadcastOutboundProgress
}
