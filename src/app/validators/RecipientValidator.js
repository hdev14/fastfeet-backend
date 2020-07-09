import * as Yup from 'yup';

class RecipientValidator {
  async store(req, res, next) {
    try {
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

      await schema.validate(req.body);
      return next();
    } catch (err) {
      return res.status(400).json({
        error: 'Validations fails',
        message: err.message
      });
    }
  }

  async update(req, res, next) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string(),
        street: Yup.string(),
        number: Yup.number().integer(),
        complement: Yup.string(),
        state: Yup.string().max(2),
        city: Yup.string(),
        cep: Yup.string()
      });

      await schema.validate(req.body);
      return next();
    } catch (err) {
      return res.status(400).json({
        error: 'Validations fails',
        message: err.message
      });
    }
  }
}

export default new RecipientValidator();
