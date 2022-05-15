import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { router } from './routes/router.js'
import cors from 'cors'

/**
 * Creates express application.
 *
 * @param {object} database - Database object.
 */
export async function initServer (database) {
  try {
    await database.connectDB
    const app = express()
    app.use(helmet())
    app.use(cors())
    app.use(morgan('dev'))
    app.use(express.json({ limit: '50mb', extended: true }))
    app.use(express.urlencoded({ limit: '50mb', extended: true }))

    app.use('/', router)

    app.use(function (err, req, res, next) {
      err.status = err.status || 500

      if (err.status === 500) {
        err.message = 'An unexpected condition was encountered.'
      }

      return res.status(err.status).json({
        message: err.message
      })
    })
    return app
  } catch (e) {
    console.error(e)
    process.exitCode = 1
  }
}
