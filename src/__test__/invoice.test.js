import { initServer } from '../app.js'
import database from './config/test.mongoose.js'
import request from 'supertest'
import Invoice from '../models/Invoice.js'
import { afterEach, afterAll } from '@jest/globals'
import moment from 'moment'

const app = await initServer(database)
app.listen(8080)

/* it('should establish a database connection', async () => {
  const connectDB = sinon.spy()
  expect(connectDB.calledOnce).toBe(true)
  console.log('kommer förbi expect');
  connectDB.restore()
}) */

afterEach(async () => {
  await database.clearDB
})
afterAll(async () => {
  await database.disconnectDB
})

const invoiceData = {
  creator: 'username',
  dueDate: moment().format('L'),
  date: moment().format('L'),
  orderID: '123abc123abc',
  items: [{ desc: 'Item1', itemID: 'ioqfiewjoiwq', quant: 1, pricePer: 100, priceTotal: 100 }],
  tax: { percent: 10, sum: 10 },
  total: 500,
  subtotal: 400,
  shipping: 10,
  status: false,
  issuer: { businessName: 'John Doe AB', email: 'johndoe@hotmail.com', phone: '0700001122', adress: 'Storgatan 1' },
  customer: { name: 'Jane Doe', email: 'janedoe@hotmail.com', phone: '0766667788', adress: 'Lillgatan 1' },
  payment: { pg: '123456', bg: '123456789', iban: '1668465', bic: '4658932' }
}

const token =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjYyNjU5ZmVhY2IwMGMzODk4MmMxZGI5MCIsImVtYWlsIjoiZW1haWxAZW1haWwuY29tIiwidXNlcm5hbWUiOiJ1c2VybmFtZSIsInBhc3N3b3JkIjoiJDJiJDEwJEU3S2NwQWVWdlI5VTlUdzNzejUvL09WSHBQSUU4YTB6WkR6SXBSRnRsY0pLc0FwNjA0b1plIiwiY3JlYXRlZEF0IjoiMjAyMi0wNC0yNFQxOTowNzoyMi4yNjVaIiwidXBkYXRlZEF0IjoiMjAyMi0wNC0yNFQxOTowNzoyMi4yNjVaIiwiX192IjowLCJpZCI6IjYyNjU5ZmVhY2IwMGMzODk4MmMxZGI5MCJ9LCJpYXQiOjE2NTA4MjcyNDIsImV4cCI6MTY4NjgyNzI0Mn0.xNkfUlA4LxYz7uCjbBcI392T9KGCavbCMSpTUAy_58QUAfI_8dbVBN1zdKR9AEICS4XjF9y1WTBRxwGpEjS-Jmfs-233LA4FeiQ_9smGNNZt8yUA2cQDnU1oazRmWwwewfB7IosezUOvG6xu6ISH8bulybUIKJFtzxRFVGBrEKZvj9fbB8CeqphjLEGqOxCIWdpcBy2suGo4eOJiDiyTq2TpBinO-1yQuCc51-heoPfkOwA8RVG2kG0SuBB8T7uHrGWCpk5uCYQvJvg6TZRe-76W1MttAxama-inzvJtSrbaxyDlqFceesk_N4Gd18KS7BgQ78RYP82lMOTA0rfqcw'

describe('GET *', () => {
  it('should return statuscode 404', async () => {
    const { statusCode } = await request(app).get('/blabla')
    expect(statusCode).toBe(404)
  })
})

describe('GET /:id', () => {
  describe('given a valid access token', () => {
    it('should return an invoice', async () => {
      const invoice = new Invoice(invoiceData)
      await invoice.save()

      const { statusCode, body } = await request(app)
        .get(`/api/v1/invoice/${invoice.id}`)
        .set({ Authorization: `Bearer ${token}` })

      expect(statusCode).toBe(201)
      expect(body).toBeDefined()
      expect(body.id).toEqual(invoice.id)
    })
  })

  describe('when access token is invalid', () => {
    it('should return statuscode 401', async () => {
      const invoice = new Invoice(invoiceData)
      await invoice.save()

      const { statusCode, body } = await request(app)
        .get(`/api/v1/invoice/${invoice.id}`)
        .set({ Authorization: 'Bearer invalidtoken' })

      expect(statusCode).toBe(401)
      expect(body.message).toEqual('Invalid token.')
    })
  })

  describe('when auth-scheme is not bearer', () => {
    it('should return statuscode 401', async () => {
      const invoice = new Invoice(invoiceData)
      await invoice.save()

      const { statusCode, body } = await request(app)
        .get(`/api/v1/invoice/${invoice.id}`)
        .set({ Authorization: `Basic ${token}` })

      expect(statusCode).toBe(401)
      expect(body.message).toEqual('Invalid token.')
    })
  })

  describe('when no matching invoice', () => {
    it('should return statuscode 404', async () => {
      const { statusCode, body } = await request(app)
        .get('/api/v1/invoice/000000000000')
        .set({ Authorization: `Bearer ${token}` })

      expect(statusCode).toBe(404)
      expect(body.message).toEqual('No invoice.')
    })
  })
})

describe('GET /', () => {
  describe('given a valid access token', () => {
    it('should return all invoices', async () => {
      const invoice = new Invoice(invoiceData)
      await invoice.save()

      const { statusCode, body } = await request(app)
        .get('/api/v1/invoice/')
        .set({ Authorization: `Bearer ${token}` })

      expect(statusCode).toBe(201)
      expect(body).toBeDefined()
    })
  })

  describe('when access token is invalid', () => {
    it('should return statuscode 401', async () => {
      const invoice = new Invoice(invoiceData)
      await invoice.save()

      const { statusCode, body } = await request(app)
        .get('/api/v1/invoice/')
        .set({ Authorization: 'Bearer invalidtoken' })

      expect(statusCode).toBe(401)
      expect(body.message).toEqual('Invalid token.')
    })
  })

  describe('when auth-scheme is not bearer', () => {
    it('should return statuscode 401', async () => {
      const invoice = new Invoice(invoiceData)
      await invoice.save()

      const { statusCode, body } = await request(app)
        .get('/api/v1/invoice/')
        .set({ Authorization: `Basic ${token}` })

      expect(statusCode).toBe(401)
      expect(body.message).toEqual('Invalid token.')
    })
  })
})

describe('POST /', () => {
  describe('given a valid access token', () => {
    it('should return statuscode 201, location and created invoice', async () => {
      const res = await request(app)
        .post('/api/v1/invoice/')
        .set({ Authorization: `Bearer ${token}` })
        .send(invoiceData)

      expect(res.statusCode).toBe(201)
      expect(res.get('location')).toBeDefined()
      expect(res.body.creator).toEqual(invoiceData.creator)
    })
  })
  describe('when access token is invalid', () => {
    it('should return statuscode 401', async () => {
      const { statusCode, body } = await request(app)
        .post('/api/v1/invoice/')
        .set({ Authorization: 'Bearer invalidtoken' })
        .send(invoiceData)

      expect(statusCode).toBe(401)
      expect(body.message).toEqual('Invalid token.')
    })
  })
  describe('when auth-scheme is not bearer', () => {
    it('should return statuscode 401', async () => {
      const { statusCode, body } = await request(app)
        .post('/api/v1/invoice/')
        .set({ Authorization: `Basic ${token}` })
        .send(invoiceData)

      expect(statusCode).toBe(401)
      expect(body.message).toEqual('Invalid token.')
    })
  })
})

describe('PATCH /:id', () => {
  describe('Given a valid access token', () => {
    it('should return statuscode 201 and the edited invoice', async () => {
      const invoice = new Invoice(invoiceData)
      await invoice.save()
      const { statusCode, body } = await request(app)
        .patch(`/api/v1/invoice/${invoice.id}`)
        .set({ Authorization: `Bearer ${token}` })
        .send({ total: 1000 })

      expect(statusCode).toBe(201)
      expect(body.total).toEqual(1000)
    })
  })
  describe('when access token is invalid', () => {
    it('should return statuscode 201 and the edited invoice', async () => {
      const invoice = new Invoice(invoiceData)
      await invoice.save()
      const { statusCode, body } = await request(app)
        .patch(`/api/v1/invoice/${invoice.id}`)
        .set({ Authorization: 'Bearer invalidToken' })
        .send({ total: 1000 })

      expect(statusCode).toBe(401)
      expect(body.message).toEqual('Invalid token.')
    })
  })
  describe('when auth-scheme is not bearer', () => {
    it('should return statuscode 401', async () => {
      const invoice = new Invoice(invoiceData)
      await invoice.save()
      const { statusCode, body } = await request(app)
        .patch(`/api/v1/invoice/${invoice.id}`)
        .set({ Authorization: `Basic ${token}` })
        .send({ total: 1000 })

      expect(statusCode).toBe(401)
      expect(body.message).toEqual('Invalid token.')
    })
  })
})

describe('DELETE /:id', () => {
  describe('Given a valid access token', () => {
    it('should return statuscode 204', async () => {
      const invoice = new Invoice(invoiceData)
      await invoice.save()
      const { statusCode } = await request(app)
        .delete(`/api/v1/invoice/${invoice.id}`)
        .set({ Authorization: `Bearer ${token}` })

      expect(statusCode).toBe(204)
    })
  })
  describe('when access token is invalid', () => {
    it('should return statuscode 401', async () => {
      const invoice = new Invoice(invoiceData)
      await invoice.save()
      const { statusCode, body } = await request(app)
        .delete(`/api/v1/invoice/${invoice.id}`)
        .set({ Authorization: 'Bearer invalidToken' })

      expect(statusCode).toBe(401)
      expect(body.message).toEqual('Invalid token.')
    })
  })
  describe('when auth-scheme is not bearer', () => {
    it('should return statuscode 401', async () => {
      const invoice = new Invoice(invoiceData)
      await invoice.save()
      const { statusCode, body } = await request(app)
        .delete(`/api/v1/invoice/${invoice.id}`)
        .set({ Authorization: `Basic ${token}` })

      expect(statusCode).toBe(401)
      expect(body.message).toEqual('Invalid token.')
    })
  })
})
