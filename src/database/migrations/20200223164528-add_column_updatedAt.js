module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'recipients',
      'updated_at',
      Sequelize.DATE,
      {
        allowNull: false
      }
    );
  },

  down: QueryInterface => {
    return QueryInterface.removeColumn('recipients', 'updated_at');
  }
};
