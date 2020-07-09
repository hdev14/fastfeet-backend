import { Op } from 'sequelize';

import Queue from '../../lib/Queue';
import NewDelivery from '../jobs/NewDelivery';

import Order from '../models/Order';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class OrderController {
  async index(req, res) {
    const { q } = req.query;
    const filter = q || '';

    const orders = await Order.findAll({
      where: {
        product: {
          [Op.iLike]: `${filter}%`
        }
      },
      attributes: ['id', 'product', 'start_date', 'end_date', 'canceled_at'],
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
          attributes: ['name', 'email'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['name', 'path', 'url']
            }
          ]
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

  async show(req, res) {
    const { id } = req.params;
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ error: 'Order does not exits' });
    }

    return res.status(200).json(order);
  }

  async store(req, res) {
    const { recipient_id, deliveryman_id } = req.body;
    const deliverymanExists = await Deliveryman.findByPk(deliveryman_id);
    const recipientExists = await Recipient.findByPk(recipient_id);

    if (!(deliverymanExists && recipientExists)) {
      return res
        .status(401)
        .json({ error: 'Deliveryman or Recipient not found' });
    }

    const order = await Order.create(req.body);

    await Queue.addJob(NewDelivery.key, {
      to: `${deliverymanExists.name} <${deliverymanExists.email}>`,
      context: {
        name: recipientExists.name,
        street: recipientExists.street,
        number: recipientExists.number,
        complement: recipientExists.complement,
        state: recipientExists.state,
        city: recipientExists.city,
        cep: recipientExists.cep
      }
    });

    return res.json(order);
  }

  async update(req, res) {
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
