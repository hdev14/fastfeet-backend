import Sequelize from 'sequelize';

class DeliveryProblem extends Sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.STRING
      },
      { sequelize }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Order, { foreignKey: 'delivery_id', as: 'orders' });
  }
}

export default DeliveryProblem;
