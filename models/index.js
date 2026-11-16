const Blog = require('./blog')
const User = require('./user')
const Author = require('./authors')

User.hasMany(Blog)
Blog.belongsTo(User)
Author.hasMany(Blog, { as: 'blogEntries', foreignKey: 'authorId' })
Blog.belongsTo(Author, { as: 'authorRecord', foreignKey: 'authorId' })
const syncModels = async () => {
  await User.sync({ alter: true })
  await Author.sync({ alter: true })
  await Blog.sync({ alter: true })
}

module.exports = {
  Blog,
  User,
  Author,
  syncModels
}
