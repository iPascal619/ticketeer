/* ============================================================
   SGP Tickets — Express Server with Paymegate Integration
   ============================================================ */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sendTicketEmail } = require('./emailService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (index.html, styles.css, script.js, images)
app.use(express.static(path.join(__dirname)));

// ==================== PAYMEGATE CHECKOUT ====================
app.post('/api/checkout', async (req, res) => {
  const apiKey = process.env.PAYMEGATE_API_KEY;

  if (!apiKey || apiKey.length < 10) {
    return res.status(500).json({
      success: false,
      error: 'Paymegate API key is not configured. Add your key to the .env file.'
    });
  }

  const { items, customerEmail, customerName } = req.body;

  // Validate request
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Cart is empty. Add tickets before checking out.'
    });
  }

  // Calculate total from cart items
  const totalAmount = items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  // Build order description for metadata
  const orderDescription = items.map(item =>
    `${item.name} × ${item.quantity}`
  ).join(', ');

  const orderId = `sgp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  // Resolve the public URL — always enforce HTTPS for production
  let publicUrl = process.env.PUBLIC_URL || 'http://localhost:3000';
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    publicUrl = publicUrl.replace(/^http:/, 'https:');
  }

  try {
    const payload = {
      externalId: orderId,
      amount: totalAmount.toFixed(2),
      currency: 'USD',
      paymentMethodsKeys: ['*'],
      backUrl: `${publicUrl}/order-confirmation.html?orderId=${orderId}`,
      customer: {
        email: customerEmail || '',
        fullName: customerName || 'SGP Tickets Customer'
      },
      metadata: {
        orderId: orderId,
        items: JSON.stringify(items.map(item => ({
          name: item.name,
          category: item.category,
          quantity: item.quantity,
          unitPrice: item.price,
          total: item.price * item.quantity
        }))),
        description: orderDescription
      }
    };

    console.log('📤 Paymegate request payload:', JSON.stringify(payload, null, 2));

    const response = await fetch('https://api.paymegate.com/v1/orders', {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    console.log('📥 Paymegate response [HTTP %d]:', response.status, JSON.stringify(data, null, 2));

    if (data.success && data.data?.checkoutUrl) {
      return res.json({
        success: true,
        checkoutUrl: data.data.checkoutUrl,
        orderUUID: data.data.orderUUID,
        orderId: orderId
      });
    } else {
      console.error('❌ Paymegate order creation failed [HTTP %d]:', response.status, JSON.stringify(data, null, 2));

      // Extract a human-readable error string (Paymegate may return objects)
      let errorMsg = 'Payment gateway returned an error. Please try again.';
      if (typeof data.message === 'string') {
        errorMsg = data.message;
      } else if (typeof data.error === 'string') {
        errorMsg = data.error;
      } else if (typeof data.message === 'object' && data.message !== null) {
        errorMsg = JSON.stringify(data.message);
      } else if (typeof data.error === 'object' && data.error !== null) {
        errorMsg = JSON.stringify(data.error);
      }

      return res.status(502).json({
        success: false,
        error: errorMsg,
        details: data
      });
    }
  } catch (err) {
    console.error('Paymegate request failed:', err);
    return res.status(500).json({
      success: false,
      error: 'Could not connect to payment gateway. Please try again.'
    });
  }
});

// ==================== PAYMEGATE WEBHOOK ====================
app.post('/api/webhook/paymegate', express.json(), async (req, res) => {
  const event = req.body;

  console.log('📩 Paymegate webhook received:', event.type);

  // Always respond 200 immediately to acknowledge receipt
  res.status(200).json({ received: true });

  if (event.type === 'order.paid') {
    console.log('✅ Order PAID:', {
      orderUUID: event.orderUUID,
      transactionUUID: event.transactionUUID,
      amount: event.amount,
      currency: event.currency,
      customerEmail: event.customerEmail,
      externalId: event.externalId,
      paidAt: event.paidAt
    });

    // Send e-ticket confirmation email
    try {
      const emailResult = await sendTicketEmail({
        customerEmail: event.customerEmail,
        customerName: event.customerFullName || event.customerEmail?.split('@')[0],
        orderId: event.externalId,
        items: event.metadata?.items,
        totalAmount: event.amount,
        currency: event.currency,
        paidAt: event.paidAt
      });

      if (emailResult.success) {
        console.log('📧 Ticket email delivered for order', event.externalId);
      } else {
        console.error('📧 Email delivery failed for order', event.externalId, emailResult.error);
      }
    } catch (emailErr) {
      console.error('📧 Email send crashed for order', event.externalId, emailErr);
    }
  }
});

// ==================== ORDER STATUS (for confirmation page) ====================
app.get('/api/order/:orderId', async (req, res) => {
  const apiKey = process.env.PAYMEGATE_API_KEY;
  const { orderId } = req.params;

  if (!apiKey || apiKey.length < 10) {
    return res.status(500).json({ success: false, error: 'API key not configured' });
  }

  try {
    const response = await fetch(
      `https://api.paymegate.com/v1/orders/by-external-id/${encodeURIComponent(orderId)}`,
      {
        headers: { 'X-API-Key': apiKey }
      }
    );
    const data = await response.json();
    return res.json(data);
  } catch (err) {
    console.error('Order lookup failed:', err);
    return res.status(500).json({ success: false, error: 'Could not fetch order status' });
  }
});

// ==================== START SERVER / VERCEL EXPORT ====================
// Only start the server locally if not running in Vercel Serverless
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n🏎️  SGP Tickets server running at http://localhost:${PORT}`);
    console.log(`   Static files served from: ${__dirname}`);
    console.log(`   Paymegate API Key: ${process.env.PAYMEGATE_API_KEY ? '✅ Configured' : '❌ Not set — add to .env'}\n`);
  });
}

// Export the Express API for Vercel
module.exports = app;
