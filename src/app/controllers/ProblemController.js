import DeliveryProblem from '../models/DeliveryProblem';
import Order from '../models/Order';

class ProblemController {
  async delete(req, res) {
    const { problem_id } = req.params;
    const problem = await DeliveryProblem.findByPk(problem_id);

    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    const order = await Order.findByPk(problem.delivery_id);

    order.canceled_at = new Date();
    order.save();

    return res.json();
  }
}

export default new ProblemController();
