const router = require('express').Router()
const { User } = require('../models')
const { Blog } = require('../models')
const { Op } = require('sequelize')
const authenticate = require('../util/auth')
router.get('/', async (req, res) => {
  const where = {}
  //returns blogs based on likes in descending order.
  const order = [['likes', 'DESC']]

if (req.query.search) {
  const searchCondition = {
    [Op.iLike]: `%${req.query.search}%`
  }

  where[Op.or] = [
    { title: searchCondition },
    { author: searchCondition }
  ]
}

const blogs = await Blog.findAll({
  where,
  order,
  attributes: { exclude: ['userId'] },
  include: {
    model: User,
    attributes: ['id', 'name', 'username']
  }
})

res.json(blogs)

  })
router.post('/', authenticate, async (req, res) => {
  try {
    const blog = await req.user.createBlog({
      author: req.body.author,
      url: req.body.url,
      title: req.body.title,
      likes: req.body.likes
    })
    res.status(201).json(blog)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    if (!blog) {
      return res.status(404).end()
    }

    await blog.update({
      author: req.body.author,
      url: req.body.url,
      title: req.body.title,
      likes: req.body.likes
    })
    res.json(blog)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    if (!blog) {
      return res.status(404).end()
    }
    res.json(blog)
  } catch (error) {
    console.error('Unable to fetch blog:', error)
    res.status(500).json({ error: 'Unable to fetch blog' })
  }
})
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    if (!blog) {
      return res.status(404).end()
    }
    if (blog.userId !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to delete this blog' })
    }

    await blog.destroy()
    res.status(204).end()
  } catch (error) {
    console.error('Unable to delete blog:', error)
    res.status(500).json({ error: 'Unable to delete blog' })
  }
})
module.exports = router