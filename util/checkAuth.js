import { AuthenticationError } from 'apollo-server'
import jwt from 'jsonwebtoken'
import { JWT_SECRET_KEY } from '../config.js'

export default (context) => {
  const authHeader = context.req.headers.authorization

  if (!authHeader) {
    throw new Error('Authirazation header must be provided')
  }

  const token = authHeader.split('Bearer ')[1]

  if (!token) {
    throw new Error("Authentication token must be 'Bearer [token]'")
  }

  try {
    const user = jwt.verify(token, JWT_SECRET_KEY)
    return user
  } catch (err) {
    throw new AuthenticationError('Invalid/Expired token')
  }
}
