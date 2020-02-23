module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'recipients',
      'created_at',
      Sequelize.DATE,
      {
        allowNull: false
      }
    );
  },

  down: QueryInterface => {
    return QueryInterface.removeColumn('recipients', 'created_at');
  }
};
