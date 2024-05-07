import e from 'express'
import session from 'express-session'
import cors from 'cors'
import { authEnabler, errorHandler, unknownEndpointHandler } from './middleware'
import router from './routes'

const app = (() => {
  return e()
  .use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }))
  .use(e.json())
  .use(e.urlencoded({ extended: true }))
  .use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week 
    }
  }))
  .use(authEnabler)
  .use(router)
  .use(unknownEndpointHandler)
  .use(errorHandler)
})()

export default app