const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')
const { User } = require('../models')

const authenticate = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  if (!SECRET) {
    console.error('SECRET is not configured')
    return res.status(500).json({ error: 'Authentication is not configured' })
  }

  let decodedToken
  try {
    decodedToken = jwt.verify(authorization.slice(7).trim(), SECRET)
  } catch (error) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  if (typeof decodedToken === 'string' || !decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  let user
  try {
    user = await User.findByPk(decodedToken.id)
  } catch (error) {
    console.error('Unable to verify authenticated user:', error)
    return res.status(500).json({ error: 'Unable to verify user' })
  }

  if (!user) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  req.user = user
  return next()
}

module.exports = authenticate
