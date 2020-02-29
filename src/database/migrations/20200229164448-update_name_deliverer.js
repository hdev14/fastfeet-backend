module.exports = {
  up: queryInterface => {
    return queryInterface.renameTable('deliverers', 'deliverymans');
  },

  down: queryInterface => {
    return queryInterface.renameTable('deliverymans', 'deliverers');
  }
};
