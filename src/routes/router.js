/**
 * Routes of this application.
 *
 * @author Daniel Andersson
 * @version 1.0.0
 */

import express from 'express'
import createError from 'http-errors'
import { router as invoiceRouter } from './v1/invoice-router.js'
import { router as pdfRouter } from './v1/pdf-router.js'

export const router = express.Router()

router.use('/api/v1/invoice', invoiceRouter)
router.use('/api/v1/pdf', pdfRouter)

router.get('/api/v1', (req, res, next) => {
  res.json({ message: 'This is the root of the API version 1. Version X of the api starts at the route /api/vX' })
})

// Any other route
router.use('*', (req, res, next) => next(createError(404)))
