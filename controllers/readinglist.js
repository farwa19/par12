
const router = require('express').Router()
const { User, Blog, ReadingList } = require('../models')
const authenticate = require('../util/auth')

router.get('/:id', async (req, res) => {
  try {
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
          attributes: ['id', 'title', 'author', 'url', 'likes', 'year'],
          through: {
            attributes: ['read', 'id'],
            where
          }
        }
      ]
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const { userId, blogId } = req.body || {}
    if (userId === undefined || userId === null || blogId === undefined || blogId === null) {
      return res.status(400).json({ error: 'userId and blogId are required' })
    }

    const user = await User.findByPk(userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const blog = await Blog.findByPk(blogId)
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' })
    }

    const existingEntry = await ReadingList.findOne({
      where: { userId: user.id, blogId: blog.id }
    })
    if (existingEntry) {
      return res.status(400).json({ error: 'Blog is already in the reading list' })
    }

    const readingList = await ReadingList.create({
      userId: user.id,
      blogId: blog.id
    })

    res.status(201).json(readingList)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})
router.put('/:id', authenticate, async (req, res) => {
  try {
    const readingList = await ReadingList.findByPk(req.params.id)
    if (!readingList) {
      return res.status(404).json({ error: 'Reading list entry not found' })
    }
    if (readingList.userId !== req.user.id) {
      return res.status(401).json({ error: 'Not authorized to update this reading list entry' })
    }

    const { read } = req.body
    readingList.read = read
    await readingList.save()

    res.json(readingList)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})
module.exports = router
