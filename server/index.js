import express from 'express'
import morgan from 'morgan'

// Socket.io
import { Server } from 'socket.io'
import { createServer } from 'node:http'

const PORT = process.env.PORT ?? 3000
const app = express()
const server = createServer(app)
const io = new Server(server, {
  // Para cuando se pierde la conexion
  connectionStateRecovery: {}
})

io.on('connection', (socket) => {
  console.log('A user has connected!!')

  socket.on('disconnect', () => {
    console.log('An usar has disconnected')
  })

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg)
  })
})

// Middlewares
app.use(morgan('dev'))

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html')
})

server.listen(PORT, () => {
  console.log(`Server listening in port: http://localhost:${PORT}`)
})
