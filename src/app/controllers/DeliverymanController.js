import * as Yup from 'yup';
import { Op } from 'sequelize';

import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
  async index(req, res) {
    const { q } = req.query;
    const filter = q || '';

    const deliverymans = await Deliveryman.findAll({
      where: {
        name: {
          [Op.iLike]: `${filter}%`
        }
      },
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url']
        }
      ]
    });
    return res.json(deliverymans);
  }

  async show(req, res) {
    return res.json(req.deliveryman);
  }

  async store(req, res) {
    const { id, name, email } = await Deliveryman.create(req.body);

    return res.json({ id, name, email });
  }

  async update(req, res) {
    const { id, name, email } = await req.deliveryman.update(req.body);
    return res.json({ id, name, email });
  }

  async delete(req, res) {
    await req.deliveryman.destroy();
    return res.send();
  }
}

export default new DeliverymanController();
