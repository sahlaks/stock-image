import createServer from './infrastructure/config/app'
import { connectDB } from './infrastructure/config/connectDB'
import http from 'http'
import dotenv from 'dotenv'



dotenv.config({path: '../.env' })
const startServer = async () => {
    try {
      await connectDB()
      const app = createServer()
      const server = http.createServer(app)
      const port = process.env.PORT
      server?.listen(port, () => {
        console.log('server is running at port ', port)
      })
  
    } catch (error) {
      console.log(error)
    }
  }
  
  startServer()