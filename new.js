const express = require('express')
const { Blog, sequelize } = require('./cli')

const app = express()
app.use(express.json())

app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.findAll()
    res.json(blogs)
  } catch (error) {
    console.error('Unable to fetch blogs:', error)
    res.status(500).json({ error: 'Unable to fetch blogs' })
  }
})

app.post('/api/blogs', async (req, res) => {
  try {
    const blog = await Blog.create(req.body)
    res.status(201).json(blog)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.put('/api/blogs/:id', async (req, res) => {
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

app.get('/api/blogs/:id', async (req, res) => {
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
app.delete('/api/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    if (!blog) {
      return res.status(404).end()
    }
    await blog.destroy()
    res.status(204).end()
  } catch (error) {
    console.error('Unable to delete blog:', error)
    res.status(500).json({ error: 'Unable to delete blog' })
  }
})
const start = async () => {
  await sequelize.authenticate()
  const port = process.env.PORT || 3001
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
  })
}

start().catch((error) => {
  console.error('Unable to start the server:', error)
  process.exitCode = 1
})