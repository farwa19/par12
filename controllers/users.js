const router = require('express').Router()
const bcrypt = require('bcrypt')

const { User, Blog } = require('../models')
router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: {
        exclude: ['userId']
      }
    }
  })
  res.json(users)
})
router.get('/:id', async (req, res) => {
  const where = {}
  if (req.query.read === 'true') {
    where.read = true
  } else if (req.query.read === 'false') {
    where.read = false
  }

  const user = await User.findByPk(req.params.id, {
    include: [
     
      {
        model: Blog,
        as: 'readings',
        through: {
          attributes: ['id', 'read'],
          where
        }
      }
    ]
  })

  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  res.json(user)
})

router.post('/', async (req, res) => {
  try {
    const { name, username, password } = req.body || {}
    if (typeof password !== 'string' || password.length < 3) {
      return res.status(400).json({ error: 'password must be at least 3 characters long' })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    
    const user = await User.create({
      name,
      username,
      passwordHash
    })

    res.status(201).json(user)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})



router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})
router.put('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ where: { username: req.params.username } })
    if (!user) {
      return res.status(404).end()
    }
    await user.update({
      name: req.body.name
    })
    res.json(user)
  } catch(error) {
    return res.status(400).json({ error: error.message })
  }
})

module.exports = router