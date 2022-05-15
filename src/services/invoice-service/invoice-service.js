/**
 * Controller-handlers.
 *
 * @author Daniel Andersson
 * @version 1.0.0
 */

import createError from 'http-errors'
import mongoose from 'mongoose'

/**
 * Finds an invoice by id.
 *
 * @param {any} Invoice - Invoice model.
 * @returns {any} - Found invoice.
 */
const getInvoice = (Invoice) => async (id) => {
  const invoice = await Invoice.findById(id)
  if (!invoice) throw createError(404, 'No invoice.')
  return invoice
}

/**
 * Finds invoices by user.
 *
 * @param {any} Invoice - Invoice model.
 * @returns {any} - Found invoices.
 */
const getInvoices = (Invoice) => async (creator) => {
  const invoices = await Invoice.find({ creator })
  if (!invoices) throw createError(404, 'No invoices.')
  return invoices
}

/**
 * Creates an invoice.
 *
 * @param {any} Invoice - Invoice model.
 * @returns {any} - Created invoice.
 */
const createInvoice = (Invoice) => async (invoiceData) => {
  const invoice = new Invoice(invoiceData)
  await invoice.save()
  return invoice
}

/**
 * Edits an invoice.
 *
 * @param {any} Invoice - Invoice model.
 * @returns {any} - Updated invoice.
 */
const editInvoice = (Invoice) => async (id, data) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw createError(404)
  return await Invoice.findByIdAndUpdate(id, data, { new: true })
}

/**
 * Deletes an invoices.
 *
 * @param {any} Invoice - Invoice model.
 * @returns {any} - Deleted invoice.
 */
const deleteInvoice = (Invoice) => async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw createError(404)
  return await Invoice.findByIdAndDelete(id)
}

/**
 * Exports module as a function.
 *
 * @param {any} Invoice - Injected invoice model.
 * @returns {object} - Object of module functions.
 */
const invoiceService = (Invoice) => {
  return {
    getInvoice: getInvoice(Invoice),
    getInvoices: getInvoices(Invoice),
    createInvoice: createInvoice(Invoice),
    editInvoice: editInvoice(Invoice),
    deleteInvoice: deleteInvoice(Invoice)
  }
}

export default invoiceService
