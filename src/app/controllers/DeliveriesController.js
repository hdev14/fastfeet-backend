import { Op } from 'sequelize';
import { isBefore, isAfter, setSeconds, setMinutes, setHours } from 'date-fns';

import Cache from '../../storage/Cache';

import Order from '../models/Order';
import Recipient from '../models/Recipient';
import File from '../models/File';

class DeliveriesController {
  async index(req, res) {
    const { id } = req.params;
    const { canceled } = req.query;

    const cached = await Cache.get('orders');
    let orders = null;

    if (cached) {
      orders = cached;
    } else {
      orders = await Order.findAll({
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
          },
          {
            model: File,
            as: 'signature',
            attributes: ['name', 'path', 'url']
          }
        ],
        attributes: ['id', 'product', 'canceled_at'],
        order: ['created_at']
      });
    }

    await Cache.set('orders', orders);

    if (canceled) {
      const canceledOrders = orders.filter(order => order.canceled_at !== null);
      return res.json(canceledOrders);
    }

    return res.json(orders);
  }

  async update(req, res) {
    const { id, order_id } = req.params;
    const { op } = req.query;

    const order = await Order.findOne({
      where: {
        id: order_id,
        deliveryman_id: id,
        canceled_at: null
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
        },
        {
          model: File,
          as: 'signature',
          attributes: ['name', 'path', 'url']
        }
      ]
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const currentDate = new Date();

    if (op === 'start') {
      const withdrawalStartDate = setSeconds(
        setMinutes(setHours(currentDate, 8), 0),
        0
      );
      const withdrawalEndDate = setSeconds(
        setMinutes(setHours(currentDate, 23), 0),
        0
      );
      const isValidDate =
        isAfter(currentDate, withdrawalStartDate) &&
        isBefore(currentDate, withdrawalEndDate);

      if (!isValidDate) {
        return res.status(401).json({
          error: "It's only can withdraw between 08:00 and 18:00"
        });
      }

      const numberWithdrawnOrders = await Order.findAll({
        where: {
          deliveryman_id: id,
          start_date: {
            [Op.ne]: null
          }
        }
      });

      if (numberWithdrawnOrders.length === 5) {
        return res.status(401).json({
          error: "It's only can withdraw 5 orders for day"
        });
      }

      order.start_date = currentDate;
    } else if (op === 'end') {
      if (!req.file) {
        return res.status(400).json({ error: 'Signature is required' });
      }

      const { originalname: name, filename: path } = req.file;
      const signature = await File.create({ name, path });

      order.signature_id = signature.id;
      order.end_date = currentDate;
    }

    order.save();
    await Cache.invalidate('orders');

    return res.json(order);
  }
}

export default new DeliveriesController();
