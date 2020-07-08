import * as Yup from 'yup';

class OrderValidator {
  async store(req, res, next) {
    try {
      const schema = Yup.object().shape({
        recipient_id: Yup.number()
          .integer()
          .required(),
        deliveryman_id: Yup.number()
          .integer()
          .required(),
        product: Yup.string().required()
      });

      await schema.validate(req.body);
      return next();
    } catch (err) {
      return res.status(400).json({
        error: 'Validation fails',
        message: err.message
      });
    }
  }

  async update(req, res, next) {
    try {
      const schema = Yup.object().shape({
        recipient_id: Yup.number().integer(),
        deliveryman_id: Yup.number().integer(),
        product: Yup.string()
      });

      await schema.validate(req.body);
      return next();
    } catch (err) {
      return res.status(400).json({
        error: 'Validation fails',
        message: err.message
      });
    }
  }
}

export default new OrderValidator();
