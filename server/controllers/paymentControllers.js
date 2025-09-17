import paymentServices from '../services/paymentServices.js';
import expressAsync from 'express-async-handler';

const createPaymentIntent = expressAsync(async (req, res) => {
  try {
    const response = await paymentServices.createPaymentIntent(req.body);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error creating payment intent:", error.message);
    res.status(400).json({ error: error.message });
  }
});

const payWithGCash = expressAsync(async (req, res) => {
  try {
    const { amount, name, email, phone, returnUrl, reservationId } = req.body;

    const intentRes = await paymentServices.createPaymentIntent({ amount });
    const paymentIntentId = intentRes.data.id;

    const methodRes = await paymentServices.createGCashPaymentMethod({ name, email, phone });
    const paymentMethodId = methodRes.data.id;

    const attachRes = await paymentServices.attachPaymentMethod(paymentIntentId, paymentMethodId, returnUrl);

    const redirectUrl = attachRes.data.attributes.next_action?.redirect?.url || null;

    res.status(200).json({
      paymentIntent: attachRes.data,
      redirectUrl,
    });
  } catch (error) {
    console.error("Error in GCash payment flow:", error.message);
    res.status(400).json({ error: error.message });
  }
});

export {
  createPaymentIntent,
  payWithGCash
};
