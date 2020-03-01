import Order from '../models/Order';
import Recipient from '../models/Recipient';

class DeliveriesController {
  async index(req, res) {
    const { id } = req.params;
    const { canceled } = req.query;

    const orders = await Order.findAll({
      where: {
        deliveryman_id: id,
        canceled_at: null,
        end_date: null
      },
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'name',
            'street',
            'number',
            'complement',
            'state',
            'city',
            'cep'
          ]
        }
      ],
      attributes: ['id', 'product', 'canceled_at'],
      order: ['created_at']
    });

    if (canceled) {
      const canceledOrders = orders.filter(order => order.canceled_at !== null);
      return res.json(canceledOrders);
    }

    return res.json(orders);
  }

  async update(req, res) {
    return res.json;
  }
}

export default new DeliveriesController();
