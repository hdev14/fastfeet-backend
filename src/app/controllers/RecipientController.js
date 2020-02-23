import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const recipient = await Recipient.create(req.body);
    res.json(recipient);
  }

  async update(req, res) {
    const { id } = req.params;
    const recipient = await Recipient.findByPk(id);
    const edited_recipient = await recipient.update(req.body);
    return res.json({ edited_recipient });
  }
}

export default new RecipientController();
