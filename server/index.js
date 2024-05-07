import express from 'express'
import morgan from 'morgan'

// Socket.io
import { Server } from 'socket.io'
import { createServer } from 'node:http'

import { createClient } from '@libsql/client'
import 'dotenv/config'

const PORT = process.env.PORT ?? 3000
const app = express()
const server = createServer(app)
const io = new Server(server, {
  // Para cuando se pierde la conexion
  connectionStateRecovery: {}
})
// Conexion a la base de datos
const db = createClient({
  url: process.env.DB_URL,
  authToken: process.env.DB_TOKEN
})

// Iniciar y crear un tabla
await db.execute(`CREATE TABLE IF NOT EXISTS messages(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT
)`)

io.on('connection', (socket) => {
  console.log('A user has connected!!')

  socket.on('disconnect', () => {
    console.log('An usar has disconnected')
  })

  socket.on('chat message', async (msg) => {
    let result
    try {
      result = await db.execute({
        sql: `INSERT INTO messages(content) VALUES(:message)`,
        args: { message: msg }
      })
    } catch (error) {
      console.log(error)
      return
    }
    io.emit('chat message', result.lastInsertRowid.toString())
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
