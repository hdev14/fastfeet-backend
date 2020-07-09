import * as Yup from 'yup';

class DeliverymanValidator {
  async store(req, res, next) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required(),
        email: Yup.string()
          .email()
          .required()
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
        name: Yup.string(),
        email: Yup.string().email()
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

export default new DeliverymanValidator();
