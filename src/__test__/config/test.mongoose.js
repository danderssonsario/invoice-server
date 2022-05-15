/**
 * Test database module.
 *
 * @author Daniel Andersson
 * @version 1.0.0
 */

import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

const { connection } = mongoose
let mongoDB

/**
 * Connects to database.
 */
const connectDB = async () => {
  mongoDB = await MongoMemoryServer.create()
  const connectionString = mongoDB.getUri()
  return mongoose.connect(connectionString)
}

/**
 * Disconnects database.
 */
const disconnectDB = async () => {
  try {
    await connection.close()
    if (mongoDB) await mongoDB.stop()
  } catch (err) {
    process.exit(1)
  }
}

/**
 * Clears database.
 */
const clearDB = async () => {
  const collections = connection.collections
  for (const key in collections) {
    await collections[key].deleteMany({})
  }
}

const database = {
  connectDB: connectDB(),
  disconnectDB: disconnectDB(),
  clearDB: clearDB()
}

export default database
