import { Op } from 'sequelize';

import Recipient from '../models/Recipient';

class RecipientController {
  async index(req, res) {
    const { q } = req.query;
    const filter = q || '';

    const recipients = await Recipient.findAll({
      where: {
        name: {
          [Op.iLike]: `${filter}%`
        }
      }
    });

    return res.json(recipients);
  }

  async store(req, res) {
    const recipient = await Recipient.create(req.body);
    return res.json(recipient);
  }

  async show(req, res) {
    const { id } = req.params;
    const recipient = await Recipient.findByPk(id);

    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    return res.json(recipient);
  }

  async update(req, res) {
    const { id } = req.params;
    const recipient = await Recipient.findByPk(id);

    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    const {
      name,
      street,
      number,
      complement,
      state,
      city,
      cep
    } = await recipient.update(req.body);

    return res.json({ id, name, street, number, complement, state, city, cep });
  }

  async destroy(req, res) {
    const { id } = req.params;
    const recipient = await Recipient.findByPk(id);

    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    await recipient.destroy();

    return res.json();
  }
}

export default new RecipientController();
