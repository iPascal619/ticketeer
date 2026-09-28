/* ============================================================
   SGP Tickets — Email Service (Resend)
   Sends branded e-ticket confirmation emails after payment
   ============================================================ */

// const { Resend } = require('resend');
// const resend = new Resend(process.env.RESEND_API_KEY);
const resend = { emails: { send: async () => ({ data: { id: 'mock' } }) } };

// Your brand sender — must match a verified domain in Resend,
// or use the default onboarding address for testing
const FROM_EMAIL = process.env.FROM_EMAIL || 'SGP Tickets <onboarding@resend.dev>';

/**
 * Generate a unique ticket code for each ticket item
 */
function generateTicketCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'SGP-';
  for (let i = 0; i < 3; i++) {
    if (i > 0) code += '-';
    for (let j = 0; j < 4; j++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }
  return code;
}

/**
 * Build the HTML email body for e-ticket delivery
 */
function buildTicketEmailHtml({ customerName, orderId, items, totalAmount, currency, paidAt }) {
  const eventDate = 'October 9–11, 2026';
  const venue = 'Marina Bay Street Circuit, Singapore';
  const formattedDate = paidAt
    ? new Date(paidAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  // Generate ticket codes for each item × quantity
  const ticketRows = [];
  let parsedItems;
  try {
    parsedItems = typeof items === 'string' ? JSON.parse(items) : items;
  } catch {
    parsedItems = [{ name: 'SGP Ticket', quantity: 1, unitPrice: totalAmount, total: totalAmount }];
  }

  for (const item of parsedItems) {
    for (let i = 0; i < (item.quantity || 1); i++) {
      ticketRows.push({
        name: item.name,
        category: item.category || 'General',
        code: generateTicketCode(),
        unitPrice: item.unitPrice || item.total
      });
    }
  }

  const ticketCardsHtml = ticketRows.map((ticket, idx) => `
    <div style="background:#111;border:1px solid #222;border-radius:8px;padding:24px;margin-bottom:16px;position:relative;overflow:hidden;">
      <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#e10600,#ff4136);"></div>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
        <tr>
          <td>
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#888;margin-bottom:4px;">Ticket ${idx + 1} of ${ticketRows.length}</div>
            <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:18px;font-weight:700;color:#fff;">${ticket.name}</div>
            <div style="font-size:13px;color:#aaa;margin-top:2px;">${ticket.category}</div>
          </td>
          <td align="right" valign="top">
            <div style="font-size:22px;font-weight:800;color:#e10600;">$${Number(ticket.unitPrice).toFixed(2)}</div>
            <div style="font-size:11px;color:#888;">${currency || 'USD'}</div>
          </td>
        </tr>
      </table>
      
      <div style="border-top:1px dashed #333;margin:16px 0;"></div>

      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="50%" style="padding-right:8px;">
            <div style="font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#666;margin-bottom:4px;">Event</div>
            <div style="font-size:13px;color:#ddd;">Singapore Grand Prix 2026</div>
          </td>
          <td width="50%" style="padding-left:8px;">
            <div style="font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#666;margin-bottom:4px;">Date</div>
            <div style="font-size:13px;color:#ddd;">${eventDate}</div>
          </td>
        </tr>
        <tr>
          <td width="50%" style="padding-right:8px;padding-top:12px;">
            <div style="font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#666;margin-bottom:4px;">Venue</div>
            <div style="font-size:13px;color:#ddd;">${venue}</div>
          </td>
          <td width="50%" style="padding-left:8px;padding-top:12px;">
            <div style="font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#666;margin-bottom:4px;">Access</div>
            <div style="font-size:13px;color:#ddd;">3-Day Weekend (Fri–Sun)</div>
          </td>
        </tr>
      </table>

      <div style="border-top:1px dashed #333;margin:16px 0;"></div>
      
      <div style="text-align:center;">
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#666;margin-bottom:8px;">E-Ticket Code</div>
        <div style="background:#0a0a0a;border:2px solid #e10600;border-radius:6px;padding:14px 20px;display:inline-block;">
          <span style="font-family:'Courier New',monospace;font-size:22px;font-weight:700;letter-spacing:3px;color:#fff;">${ticket.code}</span>
        </div>
        <div style="font-size:11px;color:#666;margin-top:8px;">Present this code at the venue gate for entry</div>
      </div>
    </div>
  `).join('');

  // Summary row
  const summaryHtml = parsedItems.map(item => `
    <tr>
      <td style="padding:8px 0;font-size:14px;color:#ccc;border-bottom:1px solid #1a1a1a;">${item.name} × ${item.quantity || 1}</td>
      <td align="right" style="padding:8px 0;font-size:14px;color:#ccc;border-bottom:1px solid #1a1a1a;">$${Number(item.total || item.unitPrice).toFixed(2)}</td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#000;font-family:'Helvetica Neue',Arial,sans-serif;color:#fff;">
  <div style="max-width:600px;margin:0 auto;background:#000;">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0d0d0d 0%,#1a0000 100%);padding:40px 32px;text-align:center;border-bottom:2px solid #e10600;">
      <div style="font-size:28px;font-weight:900;letter-spacing:3px;text-transform:uppercase;">
        <span style="color:#fff;">SINGAPORE</span> <span style="color:#e10600;">GP TICKETS</span>
      </div>
      <div style="font-size:12px;color:#888;margin-top:8px;letter-spacing:2px;text-transform:uppercase;">Official E-Ticket Confirmation</div>
    </div>

    <!-- Greeting -->
    <div style="padding:32px;text-align:center;">
      <div style="width:64px;height:64px;background:rgba(0,255,135,0.1);border:2px solid #00ff87;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:28px;margin-bottom:20px;">✓</div>
      <h1 style="font-size:24px;font-weight:800;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">Payment Confirmed!</h1>
      <p style="font-size:15px;color:#999;line-height:1.6;margin:0;">
        Hey ${customerName || 'there'}, your tickets for the <strong style="color:#fff;">Singapore Grand Prix 2026</strong> are confirmed. Your e-tickets are below — screenshot or save this email.
      </p>
    </div>

    <!-- Order Info Bar -->
    <div style="background:#0d0d0d;border:1px solid #1a1a1a;border-radius:6px;margin:0 32px 24px;padding:16px 20px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <div style="font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#666;">Order Reference</div>
            <div style="font-family:'Courier New',monospace;font-size:13px;color:#fff;margin-top:4px;">${orderId}</div>
          </td>
          <td align="right">
            <div style="font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#666;">Payment Date</div>
            <div style="font-size:13px;color:#fff;margin-top:4px;">${formattedDate}</div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Ticket Cards -->
    <div style="padding:0 32px 24px;">
      ${ticketCardsHtml}
    </div>

    <!-- Order Summary -->
    <div style="padding:0 32px 32px;">
      <div style="background:#0d0d0d;border:1px solid #1a1a1a;border-radius:6px;padding:20px;">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#666;margin-bottom:12px;">Order Summary</div>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${summaryHtml}
          <tr>
            <td style="padding:12px 0 0;font-size:16px;font-weight:700;color:#fff;">Total Paid</td>
            <td align="right" style="padding:12px 0 0;font-size:20px;font-weight:800;color:#e10600;">$${Number(totalAmount).toFixed(2)} ${currency || 'USD'}</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Important Info -->
    <div style="padding:0 32px 32px;">
      <div style="background:#0d0d0d;border:1px solid #1a1a1a;border-radius:6px;padding:20px;">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#666;margin-bottom:12px;">📋 Important Information</div>
        <ul style="padding-left:20px;margin:0;color:#999;font-size:13px;line-height:2;">
          <li>Present your <strong style="color:#fff;">E-Ticket Code</strong> at any venue gate for entry</li>
          <li>Gates open at <strong style="color:#fff;">3:00 PM</strong> daily (Fri–Sun)</li>
          <li>Each code is valid for <strong style="color:#fff;">one person, all 3 days</strong></li>
          <li>Bring valid photo ID matching the name on this booking</li>
          <li>This email serves as your receipt — no physical ticket is needed</li>
        </ul>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#0a0a0a;padding:32px;text-align:center;border-top:1px solid #1a1a1a;">
      <div style="font-size:16px;font-weight:700;letter-spacing:2px;margin-bottom:8px;">
        <span style="color:#fff;">SGP</span> <span style="color:#e10600;">TICKETS</span>
      </div>
      <p style="font-size:12px;color:#666;margin:0;line-height:1.6;">
        © 2026 SGP Tickets. All rights reserved.<br>
        Questions? Reply to this email or visit our website.
      </p>
    </div>

  </div>
</body>
</html>`;
}

/**
 * Send the e-ticket confirmation email
 */
async function sendTicketEmail({ customerEmail, customerName, orderId, items, totalAmount, currency, paidAt }) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️  RESEND_API_KEY not set — skipping email delivery');
    return { success: false, error: 'RESEND_API_KEY not configured' };
  }

  if (!customerEmail) {
    console.warn('⚠️  No customer email provided — skipping email');
    return { success: false, error: 'No customer email' };
  }

  const html = buildTicketEmailHtml({
    customerName,
    orderId,
    items,
    totalAmount,
    currency,
    paidAt
  });

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: `🏎️ Your SGP Tickets — Order ${orderId} Confirmed`,
      html: html
    });

    if (error) {
      console.error('❌ Resend email error:', error);
      return { success: false, error };
    }

    console.log('✅ Ticket email sent to', customerEmail, '— Resend ID:', data.id);
    return { success: true, emailId: data.id };
  } catch (err) {
    console.error('❌ Failed to send ticket email:', err);
    return { success: false, error: err.message };
  }
}

module.exports = { sendTicketEmail };
