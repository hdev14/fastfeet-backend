import Mail from '../../lib/Mail';

class NewDelivery {
  get key() {
    return 'NewDelivery';
  }

  async handler({ data }) {
    const { to, context } = data;

    await Mail.sendMail({
      to,
      subject: 'Nova entrega',
      template: 'new-delivery',
      context
    });
  }
}

export default new NewDelivery();
