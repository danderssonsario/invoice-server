import { initServer } from '../app.js'
import database from './config/test.mongoose.js'
import request from 'supertest'
import { afterEach, afterAll } from '@jest/globals'
// import moment from 'moment'

const app = await initServer(database)
app.listen(8080)

afterEach(async () => {
  await database.clearDB
})
afterAll(async () => {
  await database.disconnectDB
})

/* const invoiceData = {
  creator: 'username',
  dueDate: moment(Date.now()).format('L'),
  date: moment(Date.now()).format('L'),
  orderID: '123abc123abc',
  items: [{ desc: 'Item1', itemID: 'ioqfiewjoiwq', quant: 1, pricePer: 100, priceTotal: 100 }],
  tax: { percent: 10, sum: 10 },
  total: 500,
  subtotal: 400,
  shipping: 10,
  status: false,
  issuer: {
    businessName: 'John Doe AB',
    email: 'johndoe@hotmail.com',
    phone: '0700001122',
    adress: 'Example Street 1',
    orgNr: '5555-5555',
    website: 'example.com'
  },
  customer: {
    name: 'Jane Doe',
    email: 'janedoe@hotmail.com',
    phone: '0766667788',
    adress: 'Lillgatan 1'
  },
  payment: { pg: '123456', bg: '123456789', iban: '1668465', bic: '4658932' }
} */

const mailData = {
  customer: {
    name: 'JohnDoe',
    email: 'da222xg@student.lnu.se'
  },
  body: 'ja men hallå där.',
  businessName: 'hej AB',
  footerItems: ['tja', 'hej', 'hejdå']
}

const token =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjYyNjU5ZmVhY2IwMGMzODk4MmMxZGI5MCIsImVtYWlsIjoiZW1haWxAZW1haWwuY29tIiwidXNlcm5hbWUiOiJ1c2VybmFtZSIsInBhc3N3b3JkIjoiJDJiJDEwJEU3S2NwQWVWdlI5VTlUdzNzejUvL09WSHBQSUU4YTB6WkR6SXBSRnRsY0pLc0FwNjA0b1plIiwiY3JlYXRlZEF0IjoiMjAyMi0wNC0yNFQxOTowNzoyMi4yNjVaIiwidXBkYXRlZEF0IjoiMjAyMi0wNC0yNFQxOTowNzoyMi4yNjVaIiwiX192IjowLCJpZCI6IjYyNjU5ZmVhY2IwMGMzODk4MmMxZGI5MCJ9LCJpYXQiOjE2NTA4MjcyNDIsImV4cCI6MTY4NjgyNzI0Mn0.xNkfUlA4LxYz7uCjbBcI392T9KGCavbCMSpTUAy_58QUAfI_8dbVBN1zdKR9AEICS4XjF9y1WTBRxwGpEjS-Jmfs-233LA4FeiQ_9smGNNZt8yUA2cQDnU1oazRmWwwewfB7IosezUOvG6xu6ISH8bulybUIKJFtzxRFVGBrEKZvj9fbB8CeqphjLEGqOxCIWdpcBy2suGo4eOJiDiyTq2TpBinO-1yQuCc51-heoPfkOwA8RVG2kG0SuBB8T7uHrGWCpk5uCYQvJvg6TZRe-76W1MttAxama-inzvJtSrbaxyDlqFceesk_N4Gd18KS7BgQ78RYP82lMOTA0rfqcw'

describe('GET /', () => {
  describe('Given a valid access token', () => {
    it('should return statuscode 201', async () => {
      const res = await request(app)
        .get('/api/v1/pdf/')
        .set({ Authorization: `Bearer ${token}` })

      expect(res.statusCode).toBe(201)
    })
  })
})

// Works locally, fails in gitlab pipeline. Fix for later.
/* describe('POST /create', () => {
  describe('Given a valid access token', () => {
    it('should return statuscode 204', async () => {
      const { statusCode } = await request(app)
        .post('/api/v1/pdf/create')
        .set({ Authorization: `Bearer ${token}` })
        .send(invoiceData)

      expect(statusCode).toBe(204)
    })
  })
})
 */
describe('POST /send', () => {
  describe('Given a valid access token', () => {
    it('should return statuscode 204', async () => {
      const { statusCode } = await request(app)
        .post('/api/v1/pdf/send')
        .set({ Authorization: `Bearer ${token}` })
        .send(mailData)

      expect(statusCode).toBe(204)
    })
  })
})
