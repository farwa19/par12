const Blog = require('./blog')
const User = require('./user')
const Author = require('./authors')
const Team = require('./team')
const Membership = require('./membership')
const ReadingList = require('./readinglist')
const Session = require('./Session')

User.hasMany(Blog)
User.hasMany(Session)
Blog.belongsTo(User)
Session.belongsTo(User)
User.belongsToMany(Team, { through: Membership })
Team.belongsToMany(User, { through: Membership })
Blog.belongsToMany(User, { through: ReadingList, as: 'users' })
User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })
module.exports = {
  Blog,
  User,
  Author,
  Team,
  Membership,
  ReadingList,
  Session
}
