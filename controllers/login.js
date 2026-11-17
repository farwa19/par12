const router = require('express').Router()
const bcrypt = require('bcrypt')
const { Session } = require('../models')
const jwt = require('jsonwebtoken')

const { User } = require('../models')
const { SECRET } = require('../util/config')

const logoutRouter = require('express').Router()

router.post('/', async (req, res) => {
  const { username, password } = req.body || {}
  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(401).json({ error: 'invalid username or password' })
  }

  if (!SECRET) {
    console.error('SECRET is not configured')
    return res.status(500).json({ error: 'Authentication is not configured' })
  }

  try {
    const user = await User.unscoped().findOne({ where: { username } })
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'invalid username or password' })
    }

    if (user.disabled) {
      return res.status(401).json({
        error: 'account disabled, please contact admin'
      })
    }

    const passwordCorrect = await bcrypt.compare(password, user.passwordHash)

    if (!passwordCorrect) {
      return res.status(401).json({ error: 'invalid username or password' })
    }
    //saves token in session

    const token = jwt.sign(
      { username: user.username, id: user.id },
      SECRET,
      { expiresIn: '1h' }
    )
    await Session.create({
      token,
      userId: user.id
    })
    return res.status(200).json({
      token,
      username: user.username,
      name: user.name
    })
  } catch (error) {
    console.error('Unable to log in:', error)
    return res.status(500).json({ error: 'Unable to log in' })
  }
})
logoutRouter.delete('/', async (req, res) => {
  const authorization = req.get('authorization')
  if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  try {
    const token = authorization.slice(7).trim()
    const session = await Session.findOne({ where: { token } })
    if (!session) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }
    await Session.destroy({ where: { userId: session.userId } })
    return res.status(204).end()
  } catch (error) {
    console.error('Unable to log out:', error)
    return res.status(500).json({ error: 'Unable to log out' })
  }
})
module.exports = { loginRouter: router, logoutRouter }
