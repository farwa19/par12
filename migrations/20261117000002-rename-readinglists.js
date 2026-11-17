module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.renameTable('readingLists', 'readinglists')
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.renameTable('readinglists', 'readingLists')
  }
}
