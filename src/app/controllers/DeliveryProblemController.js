import * as Yup from 'yup';

import DeliveryProblem from '../models/DeliveryProblem';
import Order from '../models/Order';

class DeliveryProblemController {
  async index(req, res) {
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
    return res.json(deliveryProblems);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

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

    return res.json(deliveryProblem);
  }
}

export default new DeliveryProblemController();