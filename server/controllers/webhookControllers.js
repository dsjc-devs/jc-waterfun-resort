import expressAsync from 'express-async-handler';
import reservationServices from '../services/reservationServices.js';
import paymentServices from '../services/paymentServices.js';
import tempBookingServices from '../services/tempBookingServices.js';

const handlePaymongoWebhook = expressAsync(async (req, res) => {
  try {
    const maybeRaw = req.body;
    const body = Buffer.isBuffer(maybeRaw)
      ? JSON.parse(maybeRaw.toString('utf8'))
      : maybeRaw;

    console.log('Webhook received. Parsed body type:', typeof body);

    const { data } = body;
    const eventType = data.attributes.type;
    const paymentIntent = data.attributes.data;

    console.log('Webhook event type:', eventType);


    switch (eventType) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(paymentIntent);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(paymentIntent);
        break;
      case 'payment.paid':
        const paymentData = data.attributes.data;
        const paymentIntentId = paymentData?.attributes?.payment_intent_id;
        if (paymentIntentId) {
          await handlePaymentSuccess({ id: paymentIntentId, attributes: paymentData.attributes });
        } else {
          console.log('No payment_intent_id found in payment.paid event');
        }
        break;
      default:
        console.log('Unhandled webhook event:', eventType);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

const handlePaymentSuccess = async (paymentIntent) => {
  try {
    const paymentIntentId = paymentIntent.id;

    const tempBooking = await tempBookingServices.getTempBookingByPaymentIntent(paymentIntentId);

    if (!tempBooking) {
      console.error('No booking data found for payment intent:', paymentIntentId);
      return;
    }

    const reservationPayload = {
      userId: tempBooking.userId,
      userData: tempBooking.userData,
      accommodationId: tempBooking.accommodationId,
      startDate: tempBooking.startDate,
      endDate: tempBooking.endDate,
      status: "CONFIRMED",
      guests: tempBooking.guests,
      entrances: tempBooking.entrances,
      amount: tempBooking.amount,
      paymentIntentId: paymentIntentId
    };

    const reservation = await reservationServices.createReservation(reservationPayload);

    await paymentServices.createPaymentDB({
      reservationId: reservation.reservationId,
      amount: paymentIntent.attributes.amount,
      currency: paymentIntent.attributes.currency,
      paymentIntentId: paymentIntentId,
      paymentMethodId: paymentIntent.attributes.payment_method?.id,
      referenceNumber: paymentIntent.id
    });

    await tempBookingServices.deleteTempBooking(paymentIntentId);

    console.log('Reservation created successfully:', reservation.reservationId);
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
};

const handlePaymentFailure = async (paymentIntent) => {
  try {
    const paymentIntentId = paymentIntent.id;

    await tempBookingServices.deleteTempBooking(paymentIntentId);

    console.log('Payment failed for intent:', paymentIntentId);
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
};

export {
  handlePaymongoWebhook
};