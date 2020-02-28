import Sequelize from 'sequelize';

class Deliverer extends Sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING
      },
      { sequelize }
    );

    return this;
  }
}

export default Deliverer;
