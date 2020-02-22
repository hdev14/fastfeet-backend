module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
      'users',
      'name',
      {
        type: Sequelize.STRING,
        allowNull: false
      },
      {}
    );
  },

  down: () => {}
};
