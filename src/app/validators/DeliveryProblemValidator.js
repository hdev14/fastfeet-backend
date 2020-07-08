import * as Yup from 'yup';

class DeliveryProblemValidator {
  async store(req, res, next) {
    try {
      const schema = Yup.object().shape({
        description: Yup.string().required()
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

export default new DeliveryProblemValidator();
