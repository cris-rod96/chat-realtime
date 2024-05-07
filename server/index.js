import express from 'express'
import morgan from 'morgan'
const PORT = process.env.PORT ?? 3000

const app = express()

// Middlewares
app.use(morgan('dev'))

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html')
})

app.listen(PORT, () => {
  console.log(`Server listening in port: http://localhost:${PORT}`)
})
