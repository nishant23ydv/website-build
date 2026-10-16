import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { connectToDB } from './config/db.js'
import authRouter from './routes/authRoutes.js'
import projectRouter from './routes/projectRoutes.js'

const app = express()
app.set('trust proxy', 1)   // Render ke proxy ke peeche secure cookie ke liye zaruri

await connectToDB()

const allowedOrigins = (process.env.ORIGINS || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean)

app.use(cors({ origin: allowedOrigins, credentials: true }))
app.use(cookieParser())
app.use(express.json())

app.get('/', (req, res) => res.send('Server is Live!'))
app.use('/api/auth', authRouter)
app.use('/api/projects', projectRouter)

// Centralised Error Handler
app.use((err, _req, res, _next) => {
    console.error(`[Error]: ${err.message}`)
    res.status(500).json({
        error: err.message
    })
})

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})