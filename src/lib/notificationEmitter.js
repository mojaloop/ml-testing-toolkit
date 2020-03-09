const io = require('./api-server').socketIO

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
  broadcastLog,
  broadcastOutboundProgress
}
