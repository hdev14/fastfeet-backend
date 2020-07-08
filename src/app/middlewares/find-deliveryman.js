import Deliveryman from '../models/Deliveryman';

async function findDeliveryman(req, res, next) {
  const deliveryman_id = req.params.id;
  const deliveryman = await Deliveryman.findByPk(deliveryman_id);
  if (!deliveryman) {
    return res.status(404).json({ error: 'Deliveryman not found' });
  }
  req.deliveryman = deliveryman;
  return next();
}

export default findDeliveryman;
