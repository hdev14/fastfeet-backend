import { Op } from 'sequelize';
import { isBefore, isAfter, setSeconds, setMinutes, setHours } from 'date-fns';

import Order from '../models/Order';
import Recipient from '../models/Recipient';
import File from '../models/File';

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
      try {
        order.start_date = this.withdrawOrder(currentDate, id) && currentDate;
      } catch (err) {
        return res.status(401).json({
          message: err.message
        });
      }
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

    return res.json(order);
  }

  async withdrawOrder(date, deliveryman_id) {
    const withdrawalStartDate = setSeconds(setMinutes(setHours(date, 8), 0), 0);
    const withdrawalEndDate = setSeconds(setMinutes(setHours(date, 23), 0), 0);
    const isValidDate =
      isAfter(date, withdrawalStartDate) && isBefore(date, withdrawalEndDate);

    if (!isValidDate) {
      throw new Error("It's only can withdraw between 08:00 and 18:00");
    }

    const numberWithdrawnOrders = await Order.findAll({
      where: {
        deliveryman_id,
        start_date: {
          [Op.ne]: null
        }
      }
    });

    if (numberWithdrawnOrders.length === 5) {
      throw new Error("It's only can withdraw 5 orders for day");
    }

    return true;
  }
}

export default new DeliveriesController();
