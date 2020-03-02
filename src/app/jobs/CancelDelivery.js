import Mail from '../../lib/Mail';

class CancelDelivery {
  get key() {
    return 'CancelDelivery';
  }

  async handler({ data }) {
    const { to, context } = data;

    await Mail.sendMail({
      to,
      subject: 'Entrega cancelada',
      template: 'cancel-delivery',
      context
    });
  }
}

export default new CancelDelivery();
