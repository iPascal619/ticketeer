/* ============================================================
   SGP Tickets — Express Server with Paymegate Integration
   ============================================================ */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

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

  try {
    const response = await fetch('https://api.paymegate.com/v1/orders', {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        externalId: orderId,
        amount: totalAmount.toFixed(2),
        currency: 'USD',
        paymentMethodsKeys: ['*'],
        backUrl: `${process.env.PUBLIC_URL || 'http://localhost:3000'}/order-confirmation.html?orderId=${orderId}`,
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
      })
    });

    const data = await response.json();

    if (data.success && data.data?.checkoutUrl) {
      return res.json({
        success: true,
        checkoutUrl: data.data.checkoutUrl,
        orderUUID: data.data.orderUUID,
        orderId: orderId
      });
    } else {
      console.error('Paymegate error:', data);
      return res.status(502).json({
        success: false,
        error: 'Payment gateway returned an error. Please try again.'
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
app.post('/api/webhook/paymegate', express.json(), (req, res) => {
  const event = req.body;

  console.log('📩 Paymegate webhook received:', event.type);

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

    // TODO: In production, update your database, send confirmation email, etc.
  }

  // Always respond 200 to acknowledge receipt
  res.status(200).json({ received: true });
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

// ==================== START SERVER ====================
app.listen(PORT, () => {
  console.log(`\n🏎️  SGP Tickets server running at http://localhost:${PORT}`);
  console.log(`   Static files served from: ${__dirname}`);
  console.log(`   Paymegate API Key: ${process.env.PAYMEGATE_API_KEY ? '✅ Configured' : '❌ Not set — add to .env'}\n`);
});
