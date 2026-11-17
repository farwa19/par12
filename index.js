const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase, sequelize } = require('./util/db')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')

const authorRouter = require('./controllers/author')
const { loginRouter, logoutRouter } = require('./controllers/login')
const readingListRouter = require('./controllers/readinglist')
app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/authors', authorRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/logout', logoutRouter)
app.use('/api/readinglists', readingListRouter)
app.get('/', (req, res) => {
  res.sendStatus(200)
})
//  POST /api/reset that empties both the database tables

app.post('/api/reset', async (req, res) => {
  try {
    const queryInterface = sequelize.getQueryInterface()
    await sequelize.transaction(async (transaction) => {
      await queryInterface.bulkDelete('sessions', {}, { transaction })
      await queryInterface.bulkDelete('readinglists', {}, { transaction })
      await queryInterface.bulkDelete('memberships', {}, { transaction })
      await queryInterface.bulkDelete('blogs', {}, { transaction })
      await queryInterface.bulkDelete('users', {}, { transaction })
      await queryInterface.bulkDelete('teams', {}, { transaction })
    })

    res.status(204).end()
  } catch (error) {
    console.error('Error resetting database:', error)
    res.status(500).json({ error: error.message })
  }
})


const start = async () => {
  await connectToDatabase()
 
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()