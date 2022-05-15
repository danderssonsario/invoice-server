/**
 * Account routes.
 *
 * @author Daniel Andersson
 * @version 1.0.0
 */

import express from 'express'
import { authenticateJWT } from '../../middlewares/middlewares.js'
import { PDFController } from '../../controllers/v1/pdf-controller.js'

export const router = express.Router()

const controller = new PDFController()

router.get('/', authenticateJWT, (req, res, next) => controller.get(req, res, next))

router.post('/create', authenticateJWT, (req, res, next) => controller.create(req, res, next))

router.post('/send', authenticateJWT, (req, res, next) => controller.send(req, res, next))
