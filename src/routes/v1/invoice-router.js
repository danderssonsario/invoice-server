/**
 * Account routes.
 *
 * @author Daniel Andersson
 * @version 1.0.0
 */

import express from 'express'
import { authenticateJWT } from '../../middlewares/middlewares.js'
import { InvoiceController } from '../../controllers/v1/invoice-controller.js'

export const router = express.Router()

const controller = new InvoiceController()

router.get('/:id', authenticateJWT, (req, res, next) => controller.getOne(req, res, next))
router.get('/', authenticateJWT, (req, res, next) => controller.getAll(req, res, next))
router.post('/', authenticateJWT, (req, res, next) => controller.create(req, res, next))
router.patch('/:id', authenticateJWT, (req, res, next) => controller.edit(req, res, next))
router.delete('/:id', authenticateJWT, (req, res, next) => controller.delete(req, res, next))
