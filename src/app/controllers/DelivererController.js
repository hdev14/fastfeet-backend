import Deliverer from '../models/Deliverer';

class DelivererController {
  async index(req, res) {
    const deliverers = await Deliverer.findAll();
    return res.json(deliverers);
  }

  async store(req, res) {
    const { name, email } = req.body;
    const deliverer = await Deliverer.create({ name, email });
    return res.json(deliverer);
  }

  async update(req, res) {
    const deliverer_id = req.params.id;
    const deliverer = await Deliverer.findByPk(deliverer_id);

    if (!deliverer) {
      return res.status(404).json({ error: 'Deliverer not found' });
    }

    const { id, name, email } = await deliverer.update(req.body);
    return res.json({ id, name, email });
  }

  async delete(req, res) {
    const deliverer_id = req.params.id;
    const deliverer = await Deliverer.findByPk(deliverer_id);

    if (!deliverer) {
      return res.status(404).json({ error: 'Deliverer not found' });
    }

    await deliverer.destroy();

    return res.send();
  }
}

export default new DelivererController();
