/**
 * Controller module handling pdf-files.
 *
 * @author Daniel Andersson
 * @version 1.0.0
 */

import createError from 'http-errors'
import nodemailer from 'nodemailer'
import { join } from 'path'
import puppeteer from 'puppeteer'
import { generatePdfFromTemplate } from '../../docs/invoice.js'
import { generateEmailFromTemplate } from '../../docs/email.js'
import { writeFile } from 'fs'

/**
 *
 */
export class PDFController {
  /**
   * Gets pdf-file.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Next middleware function.
   */
  async get (req, res, next) {
    try {
      res.status(201).sendFile(join(process.cwd(), 'src', 'docs', 'pdf', 'invoice.pdf'))
    } catch (err) {
      next(createError(404))
    }
  }

  /**
   * Creates pdf-file and insert given values.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Next middleware function.
   */
  async create (req, res, next) {
    try {
      const browser = await puppeteer.launch({ headless: true })
      const page = await browser.newPage()

      await page.setContent(generatePdfFromTemplate(req.body))

      const pdfBuffer = await page.pdf({ format: 'A4' })

      await page.close()
      await browser.close()

      writeFile(join(process.cwd(), 'src', 'docs', 'pdf', 'invoice.pdf'), pdfBuffer, (err) => {
        if (err) throw createError(500)
      })
      res.status(204).end()
    } catch (err) {
      next(err)
    }
  }

  /**
   * Sends email to client with attached pdf.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Next middleware function.
   */
  async send (req, res, next) {
    try {
      const { customer, businessName } = req.body
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        service: process.env.EMAIL_SERVICE,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        tls: {
          rejectUnauthorized: false
        }
      })
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: customer.email,
        subject: `Faktura från ${businessName}`,
        text: `Faktura från ${businessName}`,
        html: generateEmailFromTemplate(req.body),
        attachments: [
          {
            filename: 'invoice.pdf',
            path: join(process.cwd(), 'src', 'docs', 'pdf', 'invoice.pdf')
          }
        ]
      })
      res.status(204).end()
    } catch (err) {
      next(createError(500))
    }
  }
}
