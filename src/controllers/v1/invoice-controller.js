/**
 * Controller module handling invoices.
 *
 * @author Daniel Andersson
 * @version 1.0.0
 */

import invoiceService from '../../services/invoice-service/index.js'

/**
 * Encapsulates a controller.
 */
export class InvoiceController {
  /**
   * Gets an invoice.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Next middleware function.
   */
  async getOne (req, res, next) {
    try {
      const { id } = req.params
      const invoice = await invoiceService.getInvoice(id)
      res.status(201).json(invoice)
    } catch (err) {
      next(err)
    }
  }

  /**
   * Gets all invoices.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Next middleware function.
   */
  async getAll (req, res, next) {
    try {
      const { email } = req.payload.user
      const invoices = await invoiceService.getInvoices(email)
      res.status(201).json(invoices)
    } catch (err) {
      next(err)
    }
  }

  /**
   * Creates an invoice.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Next middleware function.
   */
  async create (req, res, next) {
    try {
      const invoice = await invoiceService.createInvoice(req.body)

      const location = new URL(`${req.protocol}://${req.get('host')}${req.baseUrl}/${invoice.id}`)
      res.status(201).location(location.href).json(invoice)
    } catch (err) {
      next(err)
    }
  }

  /**
   * Edits an invoice.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Next middleware function.
   */
  async edit (req, res, next) {
    try {
      const { id } = req.params
      const editedInvoice = await invoiceService.editInvoice(id, req.body)
      res.status(201).json(editedInvoice)
    } catch (err) {
      next(err)
    }
  }

  /**
   * Deletes an invoice.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Next middleware function.
   */
  async delete (req, res, next) {
    try {
      const { id } = req.params
      await invoiceService.deleteInvoice(id)
      res.status(204).end()
    } catch (err) {
      next(err)
    }
  }
}
