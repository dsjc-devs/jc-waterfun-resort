import paymentServices from '../services/paymentServices.js';
import tempBookingServices from '../services/tempBookingServices.js';
import reservationServices from '../services/reservationServices.js';
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

    const intentRes = await paymentServices.createPaymentIntent({ amount, paymentMethods: ["gcash"] });
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

const payWithMaya = expressAsync(async (req, res) => {
  try {
    const { amount, name, email, phone, returnUrl, reservationId } = req.body;

    const intentRes = await paymentServices.createPaymentIntent({ amount, paymentMethods: ["paymaya"] });
    const paymentIntentId = intentRes.data.id;

    const methodRes = await paymentServices.createMayaPaymentMethod({ name, email, phone, returnUrl });
    const paymentMethodId = methodRes.data.id;

    const attachRes = await paymentServices.attachPaymentMethod(paymentIntentId, paymentMethodId, returnUrl);

    const redirectUrl = attachRes.data.attributes.next_action?.redirect?.url || null;

    res.status(200).json({
      paymentIntent: attachRes.data,
      redirectUrl,
    });
  } catch (error) {
    console.error("Error in Maya payment flow:", error.message);
    res.status(400).json({ error: error.message });
  }
});

const payWithBankTransfer = expressAsync(async (req, res) => {
  try {
    const { amount, name, email, phone, returnUrl, reservationId } = req.body;

    const intentRes = await paymentServices.createPaymentIntent({ amount, paymentMethods: ["dob"] });
    const paymentIntentId = intentRes.data.id;

    const methodRes = await paymentServices.createBankTransferPaymentMethod({ name, email, phone, returnUrl });
    const paymentMethodId = methodRes.data.id;

    const attachRes = await paymentServices.attachPaymentMethod(paymentIntentId, paymentMethodId, returnUrl);

    const redirectUrl = attachRes.data.attributes.next_action?.redirect?.url || null;

    res.status(200).json({
      paymentIntent: attachRes.data,
      redirectUrl,
    });
  } catch (error) {
    console.error("Error in Bank Transfer payment flow:", error.message);
    res.status(400).json({ error: error.message });
  }
});

const payWithMethod = expressAsync(async (req, res) => {
  try {
    const {
      amount,
      name,
      email,
      phone,
      returnUrl,
      paymentMethod,
      bookingData
    } = req.body;

    const normalizedMethod = paymentMethod?.toLowerCase();

    const paymentMethodMap = {
      'gcash': 'gcash',
      'maya': 'paymaya',
      'bank-transfer': 'dob'
    };

    const paymongoMethod = paymentMethodMap[normalizedMethod];
    if (!paymongoMethod) {
      return res.status(400).json({ error: `Unsupported payment method: ${paymentMethod}` });
    }

    const intentRes = await paymentServices.createPaymentIntent({ amount, paymentMethods: [paymongoMethod] });
    const paymentIntentId = intentRes.data.id;

    if (bookingData) {
      await tempBookingServices.createTempBooking({
        paymentIntentId,
        ...bookingData,
        paymentMethod: normalizedMethod
      });
    }

    const methodRes = await paymentServices.createPaymentMethod({
      paymentType: normalizedMethod,
      name,
      email,
      phone,
      returnUrl
    });
    const paymentMethodId = methodRes.data.id;

    const attachRes = await paymentServices.attachPaymentMethod(paymentIntentId, paymentMethodId, returnUrl);

    const redirectUrl = attachRes.data.attributes.next_action?.redirect?.url || null;

    res.status(200).json({
      paymentIntent: attachRes.data,
      redirectUrl,
      paymentIntentId
    });
  } catch (error) {
    console.error("Error in payment flow:", error.message);
    res.status(400).json({ error: error.message });
  }
});

const checkPaymentStatus = expressAsync(async (req, res) => {
  const { paymentIntentId } = req.params;

  if (!paymentIntentId) {
    return res.status(400).json({
      success: false,
      message: 'paymentIntentId is required'
    });
  }

  try {
    // 1) If we already have a payment record, it's succeeded
    const paymentRecord = await paymentServices.getPaymentByIntentId(paymentIntentId);
    if (paymentRecord) {
      return res.status(200).json({ success: true, status: 'succeeded', reservationId: paymentRecord.reservationId });
    }

    // 2) If we still have a temp booking, check PayMongo for final status and finalize if successful
    const pendingBooking = await tempBookingServices.getTempBookingByPaymentIntent(paymentIntentId);

    if (pendingBooking) {
      // Query PayMongo as a fallback in case webhook was delayed/missed
      try {
        const intentRes = await paymentServices.getPaymentIntent(paymentIntentId);
        const intent = intentRes?.data;
        const status = intent?.attributes?.status;

        if (status === 'succeeded') {
          // Idempotency: recheck to avoid double create
          const existingPayment = await paymentServices.getPaymentByIntentId(paymentIntentId);
          if (!existingPayment) {
            // Create reservation and payment record using the same logic as webhook success
            const reservationPayload = {
              userId: pendingBooking.userId,
              userData: pendingBooking.userData,
              accommodationId: pendingBooking.accommodationId,
              startDate: pendingBooking.startDate,
              endDate: pendingBooking.endDate,
              status: 'CONFIRMED',
              guests: pendingBooking.guests,
              entrances: pendingBooking.entrances,
              amount: pendingBooking.amount,
              paymentIntentId
            };

            const reservation = await reservationServices.createReservation(reservationPayload);

            await paymentServices.createPaymentDB({
              reservationId: reservation.reservationId,
              amount: intent.attributes.amount,
              currency: intent.attributes.currency,
              paymentIntentId,
              paymentMethodId: intent.attributes?.payment_method?.id,
              referenceNumber: intent.id
            });

            // Cleanup temp booking
            await tempBookingServices.deleteTempBooking(paymentIntentId);

            return res.status(200).json({ success: true, status: 'succeeded', reservationId: reservation.reservationId });
          }

          // If payment now exists (race), report success
          return res.status(200).json({ success: true, status: 'succeeded', reservationId: existingPayment.reservationId });
        }

        if (status === 'processing' || status === 'awaiting_next_action' || status === 'awaiting_payment_method') {
          return res.status(200).json({ success: true, status: 'processing' });
        }

        if (status === 'failed' || status === 'canceled') {
          // Clean up temp booking if failed
          await tempBookingServices.deleteTempBooking(paymentIntentId);
          return res.status(200).json({ success: true, status: 'failed' });
        }

        // Unknown status -> keep processing
        return res.status(200).json({ success: true, status: 'processing' });
      } catch (pmErr) {
        // If PayMongo check fails (network, auth), fall back to processing as long as temp exists
        console.error('PayMongo intent lookup failed:', pmErr.message);
        return res.status(200).json({ success: true, status: 'processing' });
      }
    }

    // 3) No temp booking and no payment record -> failed (we lack data to finalize)
    return res.status(200).json({ success: true, status: 'failed' });
  } catch (error) {
    console.error('Error checking payment status:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to verify payment status'
    });
  }
});

export {
  createPaymentIntent,
  payWithGCash,
  payWithMaya,
  payWithBankTransfer,
  payWithMethod,
  checkPaymentStatus
};
