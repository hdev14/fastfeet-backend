import Cache from '../../storage/Cache';

import DeliveryProblem from '../models/DeliveryProblem';
import Order from '../models/Order';

class DeliveryProblemController {
  async index(req, res) {
    const { order_id } = req.params;

    const cacheKey = `delivery:${order_id}:problems`;

    const cached = await Cache.get(cacheKey);

    if (cached) {
      return res.json(cached);
    }

    const deliveryProblems = await DeliveryProblem.findAll({
      where: {
        delivery_id: req.params.order_id
      },
      attributes: ['id', 'description'],
      include: [
        {
          model: Order,
          as: 'orders'
        }
      ]
    });

    await Cache.set(cacheKey, deliveryProblems);

    return res.json(deliveryProblems);
  }

  async store(req, res) {
    const { order_id } = req.params;
    const isOrder = await Order.findOne({
      where: { id: order_id, canceled_at: null }
    });

    if (!isOrder) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    const deliveryProblem = await DeliveryProblem.create({
      delivery_id: order_id,
      description: req.body.description
    });

    await Cache.invalidate('problems');
    await Cache.invalidate(`delivery:${order_id}`);

    return res.json(deliveryProblem);
  }
}

export default new DeliveryProblemController();
