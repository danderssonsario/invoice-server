import { initServer } from './app.js'
import database from './config/mongoose.js'

const app = await initServer(database)

app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`)
  console.log('Press Ctrl-C to terminate...')
})
