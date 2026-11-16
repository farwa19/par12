const router = require('express').Router()
const { Blog } = require('../models')
const { Op } = require('sequelize')
const { sequelize } = require('../util/db')

router.get('/', async (req, res) => {
  try {
    const authors = await Blog.findAll({
      attributes: [
        'author',
        [sequelize.fn('COUNT', sequelize.col('id')), 'blogs'],
        [sequelize.fn('SUM', sequelize.col('likes')), 'likes']
      ],
      where: {
        author: { [Op.ne]: null }
      },
      group: ['author'],
      order: [[sequelize.fn('SUM', sequelize.col('likes')), 'DESC']],
      raw: true
    })

    res.json(authors)
  } catch (error) {
    console.error('Unable to fetch author statistics:', error)
    res.status(500).json({ error: 'Unable to fetch author statistics' })
  }
})

module.exports = router