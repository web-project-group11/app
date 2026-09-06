import express from "express"
import cors from "cors"
import searchRouter from './routers/searchRouter.js'

const port = process.env.BACKEND_PORT || 3001
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api', searchRouter)

app.use((err,req,res,next) => {
  const statusCode = err.status || 500
  res.status(statusCode).json({
    error: {
      message: err.message,
      status: statusCode
    }
  })
})

app.listen(port)