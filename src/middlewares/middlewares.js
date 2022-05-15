/**
 * Module of other middleware functions.
 *
 * @author Daniel Andersson
 * @version 1.0.0
 */

import createError from 'http-errors'
import jwt from 'jsonwebtoken'

/**
 * Authenticates user by verifying jwt.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Next middleware function.
 */
export const authenticateJWT = (req, res, next) => {
  try {
    const [scheme, token] = req.headers.authorization?.split(' ')
    if (scheme !== 'Bearer') throw new Error()

    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.payload = payload

    next()
  } catch (err) {
    next(createError(401, 'Invalid token.'))
  }
}
