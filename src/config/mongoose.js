/**
 * Mongoose configuration module.
 *
 * @author Daniel Andersson
 * @version 1.0.0
 */

import mongoose from 'mongoose'

const { connection } = mongoose

/**
 * Establishes a connection to a database.
 *
 * @returns {Promise} - That resolves on a successfull connection.
 */
const connectDB = async () => {
  // Connection events
  connection.on('connected', () => console.log('MongoDB: Connected.'))
  connection.on('error', (err) => console.log(`MongoDB: Error: ${err}`))
  connection.on('disconnected', () => console.log('MongoDB: Disconnected.'))

  // Close connection on Node.js closure
  process.on('SIGINT', () => {
    connection.close(() => {
      console.log('Application terminated, MongoDB disconnected.')
      process.exit(0)
    })
  })

  // Connect DB to server.
  return mongoose.connect(process.env.DB_CONNECTION_STRING)
}

const database = {
  connectDB: await connectDB()
}

export default database
