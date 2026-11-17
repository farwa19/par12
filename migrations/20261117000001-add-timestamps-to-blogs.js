const { Sequelize } = require('sequelize')

module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.addColumn('blogs', 'created_at', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW
    })

    await queryInterface.addColumn('blogs', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW
    })
  },

  async down({ context: queryInterface }) {
    await queryInterface.removeColumn('blogs', 'updated_at')
    await queryInterface.removeColumn('blogs', 'created_at')
  }
}
