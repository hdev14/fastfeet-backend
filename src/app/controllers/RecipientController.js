import * as Yup from 'yup';
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
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number()
        .integer()
        .required(),
      complement: Yup.string().required(),
      state: Yup.string()
        .max(2)
        .required(),
      city: Yup.string().required(),
      cep: Yup.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

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
    const schema = Yup.object().shape({
      name: Yup.string(),
      street: Yup.string(),
      number: Yup.number().integer(),
      complement: Yup.string(),
      state: Yup.string().max(2),
      city: Yup.string(),
      cep: Yup.string()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

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
