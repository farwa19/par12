const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')
const { Blog, User, Author } = require('./models')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const authorRouter = require('./controllers/author')
const loginRouter = require('./controllers/login')
const { syncModels } = require('./models')
app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/authors', authorRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.get('/', (req, res) => {
  res.sendStatus(200)
})
//  POST /api/reset that empties both the database tables
app.post('/api/reset', async (req, res) => {
  try {
    await Blog.destroy({ where: {} })
    await User.destroy({ where: {} })

    res.status(204).end()
  } catch (error) {
    console.error('Error resetting database:', error)
    res.status(500).json({ error: error.message })
  }
})

const start = async () => {
  await connectToDatabase()
  await syncModels()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()