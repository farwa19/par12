const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { User } = require('../models')
const { SECRET } = require('../util/config')

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
    const passwordCorrect = user && user.passwordHash
      ? await bcrypt.compare(password, user.passwordHash)
      : false

    if (!passwordCorrect) {
      return res.status(401).json({ error: 'invalid username or password' })
    }

    const token = jwt.sign(
      { username: user.username, id: user.id },
      SECRET,
      { expiresIn: '1h' }
    )

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

module.exports = router
