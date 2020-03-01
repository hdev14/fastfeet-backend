import * as Yup from 'yup';

import Queue from '../../lib/Queue';
import NewDelivery from '../jobs/NewDelevery';

import Order from '../models/Order';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class OrderController {
  async index(req, res) {
    const orders = await Order.findAll({
      attributes: ['id', 'product', 'start_date'],
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
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email']
        },
        {
          model: File,
          as: 'signature',
          attributes: ['name', 'path', 'url']
        }
      ]
    });

    return res.json(orders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().integer(),
      deliveryman_id: Yup.number().integer(),
      product: Yup.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id, recipient_id, deliveryman_id, product } = await Order.create(
      req.body
    );

    const { name, email } = await Deliveryman.findByPk(deliveryman_id);
    const {
      name: destinatary_name,
      street,
      number,
      complement,
      state,
      city,
      cep
    } = await Recipient.findByPk(recipient_id);

    await Queue.addJob(NewDelivery.key, {
      to: `${name} <${email}>`,
      context: {
        name: destinatary_name,
        street,
        number,
        complement,
        state,
        city,
        cep
      }
    });

    return res.json({ id, recipient_id, deliveryman_id, product });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().integer(),
      deliveryman_id: Yup.number().integer(),
      product: Yup.string()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const { id, recipient_id, deliveryman_id, product } = await order.update(
      req.body
    );

    return res.json({ id, recipient_id, deliveryman_id, product });
  }

  async delete(req, res) {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.canceled_at = new Date();
    await order.save();

    return res.send();
  }
}

export default new OrderController();
