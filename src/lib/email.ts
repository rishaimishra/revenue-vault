import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

// Configure SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587", 10),
  secure: process.env.SMTP_PORT === "465", // true for 465, false for others
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASSWORD,
  },
});

const APP_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

// Helper to format currency
const formatCurrency = (amount: number, currency: string = "INR") => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

/**
 * Sends an email notification to the seller when their listing's status is updated.
 */
export async function sendListingStatusEmail(
  listingId: string,
  status: string,
  rejectionReason?: string | null
) {
  try {
    const listing = await prisma.startupListing.findUnique({
      where: { id: listingId },
      include: { seller: true },
    });

    if (!listing || !listing.seller || !listing.seller.email) {
      console.warn(`[sendListingStatusEmail] Seller email not found for listing: ${listingId}`);
      return { success: false, error: "Seller email not found" };
    }

    const sellerName = listing.seller.name || "Seller";
    const sellerEmail = listing.seller.email;
    const title = listing.title;

    let statusText = status;
    let statusColor = "#3B82F6"; // Blue default
    let statusDescription = "";

    switch (status) {
      case "PUBLISHED":
        statusText = "Approved & Published";
        statusColor = "#10B981"; // Green
        statusDescription = "Congratulations! Your listing has been approved by our admin team and is now live on the marketplace. Buyers can now search and view your listing details.";
        break;
      case "REJECTED":
        statusText = "Rejected";
        statusColor = "#EF4444"; // Red
        statusDescription = `Unfortunately, your listing request could not be approved at this time.${
          rejectionReason ? ` Reason: "${rejectionReason}"` : ""
        } Please review the feedback, update your listing, and resubmit for approval.`;
        break;
      case "PENDING_APPROVAL":
        statusText = "Pending Approval";
        statusColor = "#F59E0B"; // Amber
        statusDescription = "Your listing is currently under review by our admin team. We will notify you as soon as the status is updated.";
        break;
      case "SOLD":
        statusText = "Marked as Sold";
        statusColor = "#6B7280"; // Gray
        statusDescription = "Your listing has been successfully marked as sold. Outstanding deal negotiations have been finalized.";
        break;
      case "DRAFT":
        statusText = "Draft";
        statusColor = "#9CA3AF"; // Light gray
        statusDescription = "Your listing is currently saved as a draft. You can submit it for approval whenever you are ready.";
        break;
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Listing Status Update</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f3f4f6; color: #1f2937; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); overflow: hidden; border: 1px solid #e5e7eb; }
          .header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 30px; text-align: center; color: #ffffff; }
          .logo { font-size: 24px; font-weight: bold; letter-spacing: -0.025em; margin-bottom: 5px; }
          .subtitle { font-size: 14px; opacity: 0.8; }
          .content { padding: 40px 30px; line-height: 1.6; }
          .greeting { font-size: 18px; font-weight: 600; margin-bottom: 20px; color: #111827; }
          .badge { display: inline-block; padding: 6px 16px; border-radius: 9999px; font-size: 14px; font-weight: 600; text-transform: uppercase; color: #ffffff; margin-bottom: 25px; }
          .details-card { background-color: #f9fafb; border: 1px solid #f3f4f6; border-radius: 8px; padding: 20px; margin-bottom: 30px; }
          .detail-row { display: flex; margin-bottom: 10px; border-bottom: 1px solid #f3f4f6; padding-bottom: 10px; }
          .detail-label { font-weight: 600; width: 120px; color: #4b5563; }
          .detail-value { color: #111827; flex: 1; }
          .button-container { text-align: center; margin-top: 30px; }
          .btn { display: inline-block; background-color: #2563eb; color: #ffffff !important; font-weight: 600; padding: 12px 28px; border-radius: 8px; text-decoration: none; transition: background-color 0.2s; }
          .btn:hover { background-color: #1d4ed8; }
          .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">RevenueVault</div>
            <div class="subtitle">Premium Marketplace for Startups & Digital Assets</div>
          </div>
          <div class="content">
            <div class="greeting">Hi ${sellerName},</div>
            <p>We are writing to update you on the status of your startup listing on RevenueVault.</p>
            
            <div style="text-align: center;">
              <span class="badge" style="background-color: ${statusColor};">${statusText}</span>
            </div>

            <div class="details-card">
              <div class="detail-row">
                <div class="detail-label">Startup:</div>
                <div class="detail-value" style="font-weight: 600;">${title}</div>
              </div>
              <div class="detail-row" style="border-bottom: none; padding-bottom: 0;">
                <div class="detail-label">Status Update:</div>
                <div class="detail-value">${statusDescription}</div>
              </div>
            </div>

            <div class="button-container">
              <a href="${APP_URL}/dashboard/seller" class="btn">Go to Seller Dashboard</a>
            </div>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} RevenueVault. All rights reserved.<br>
            If you have any questions, please contact our support team.
          </div>
        </div>
      </body>
      </html>
    `;

    const info = await transporter.sendMail({
      from: `"${process.env.SENDER_NAME || 'RevenueVault'}" <${process.env.SENDER_EMAIL}>`,
      to: sellerEmail,
      subject: `RevenueVault - Listing Status Update: ${title} (${statusText})`,
      html,
    });

    console.log(`[sendListingStatusEmail] Email sent successfully: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[sendListingStatusEmail] Error sending email:`, error);
    return { success: false, error };
  }
}

/**
 * Sends a detailed PDF-styled HTML invoice email to a user after a payment is successfully recorded.
 */
export async function sendInvoiceEmail(paymentId: string) {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { user: true },
    });

    if (!payment || !payment.user || !payment.user.email) {
      console.warn(`[sendInvoiceEmail] User email not found for payment: ${paymentId}`);
      return { success: false, error: "User email not found" };
    }

    const userName = payment.user.name || "Customer";
    const userEmail = payment.user.email;
    const amount = payment.amount;
    const currency = payment.currency || "INR";
    const status = payment.status;
    const type = payment.type;
    const provider = payment.provider;
    const providerId = payment.providerId;
    const createdAt = new Date(payment.createdAt);

    let paymentDescription = "Startup Listing Fee";
    if (type === "featured_listing") {
      paymentDescription = "Featured Listing Advertisement Upgrade";
    } else if (type === "subscription") {
      paymentDescription = "RevenueVault Premium Subscription Access";
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Payment Invoice</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f3f4f6; color: #1f2937; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); overflow: hidden; border: 1px solid #e5e7eb; }
          .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 30px; text-align: center; color: #ffffff; }
          .logo { font-size: 24px; font-weight: bold; letter-spacing: -0.025em; margin-bottom: 5px; }
          .subtitle { font-size: 14px; opacity: 0.8; }
          .content { padding: 40px 30px; line-height: 1.6; }
          .invoice-title { font-size: 22px; font-weight: bold; color: #0f172a; margin-bottom: 5px; text-align: center; }
          .invoice-date { font-size: 13px; color: #6b7280; text-align: center; margin-bottom: 30px; }
          .bill-details { display: flex; justify-content: space-between; margin-bottom: 30px; font-size: 14px; }
          .bill-col { flex: 1; }
          .bill-col:last-child { text-align: right; }
          .section-title { font-size: 12px; font-weight: 700; text-transform: uppercase; color: #9ca3af; letter-spacing: 0.05em; margin-bottom: 10px; }
          .table { width: 100%; border-collapse: collapse; margin-bottom: 35px; }
          .table th { background-color: #f8fafc; border-bottom: 2px solid #e2e8f0; text-align: left; padding: 12px; font-size: 13px; font-weight: 600; color: #475569; }
          .table td { border-bottom: 1px solid #e2e8f0; padding: 14px 12px; font-size: 14px; }
          .amount-summary { text-align: right; font-size: 15px; margin-bottom: 30px; }
          .total-row { font-size: 18px; font-weight: bold; color: #0f172a; }
          .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; background-color: #d1fae5; color: #065f46; }
          .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">RevenueVault</div>
            <div class="subtitle">Payment Invoice & Receipt</div>
          </div>
          <div class="content">
            <div class="invoice-title">INVOICE</div>
            <div class="invoice-date">Invoice Date: ${createdAt.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</div>

            <div class="bill-details">
              <div class="bill-col">
                <div class="section-title">Billed To</div>
                <strong style="color: #0f172a;">${userName}</strong><br>
                ${userEmail}
              </div>
              <div class="bill-col">
                <div class="section-title">Invoice Details</div>
                <strong>Transaction ID:</strong> ${providerId}<br>
                <strong>Method:</strong> ${provider} (${status})
              </div>
            </div>

            <table class="table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th style="text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong style="color: #0f172a;">${paymentDescription}</strong><br>
                    <span style="font-size: 12px; color: #6b7280;">Single transaction fee on RevenueVault Platform.</span>
                  </td>
                  <td style="text-align: right; vertical-align: top; font-weight: 500;">
                    ${formatCurrency(amount, currency)}
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="amount-summary">
              Subtotal: ${formatCurrency(amount, currency)}<br>
              Taxes: ${formatCurrency(0, currency)}<br>
              <div class="total-row" style="margin-top: 10px;">
                Total Paid: ${formatCurrency(amount, currency)}
              </div>
              <div style="margin-top: 10px;">
                <span class="badge">Paid</span>
              </div>
            </div>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} RevenueVault. All rights reserved.<br>
            This is an automated receipt for your purchase. Thank you for using RevenueVault.
          </div>
        </div>
      </body>
      </html>
    `;

    const info = await transporter.sendMail({
      from: `"${process.env.SENDER_NAME || 'RevenueVault'}" <${process.env.SENDER_EMAIL}>`,
      to: userEmail,
      subject: `RevenueVault Invoice - Payment Successful (${formatCurrency(amount, currency)})`,
      html,
    });

    console.log(`[sendInvoiceEmail] Invoice sent successfully: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[sendInvoiceEmail] Error sending invoice email:`, error);
    return { success: false, error };
  }
}

/**
 * Sends a notification email when a user receives a new message.
 */
export async function sendMessageEmail(messageId: string) {
  try {
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: {
        sender: { select: { name: true, email: true } },
        receiver: { select: { name: true, email: true } },
        deal: {
          include: {
            listing: { select: { title: true } },
          },
        },
      },
    });

    if (!message || !message.receiver || !message.receiver.email) {
      console.warn(`[sendMessageEmail] Receiver email not found for message: ${messageId}`);
      return { success: false, error: "Receiver email not found" };
    }

    const receiverName = message.receiver.name || "User";
    const receiverEmail = message.receiver.email;
    const senderName = message.sender.name || "Another User";
    const contentPreview = message.content.length > 200 
      ? `${message.content.substring(0, 197)}...` 
      : message.content;
    const listingTitle = message.deal?.listing.title || "Related Startup";

    const chatUrl = `${APP_URL}/messages/${message.dealId || ""}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Message Received</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f3f4f6; color: #1f2937; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); overflow: hidden; border: 1px solid #e5e7eb; }
          .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 30px; text-align: center; color: #ffffff; }
          .logo { font-size: 24px; font-weight: bold; letter-spacing: -0.025em; margin-bottom: 5px; }
          .subtitle { font-size: 14px; opacity: 0.8; }
          .content { padding: 40px 30px; line-height: 1.6; }
          .greeting { font-size: 18px; font-weight: 600; margin-bottom: 20px; color: #111827; }
          .notification-text { margin-bottom: 25px; }
          .message-bubble { background-color: #f3f4f6; border-left: 4px solid #4f46e5; border-radius: 4px; padding: 20px; font-style: italic; margin-bottom: 30px; color: #374151; }
          .meta-info { font-size: 13px; color: #6b7280; margin-bottom: 30px; }
          .button-container { text-align: center; margin-top: 30px; }
          .btn { display: inline-block; background-color: #4f46e5; color: #ffffff !important; font-weight: 600; padding: 12px 28px; border-radius: 8px; text-decoration: none; transition: background-color 0.2s; }
          .btn:hover { background-color: #4338ca; }
          .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">RevenueVault</div>
            <div class="subtitle">Chat & Deal Communications</div>
          </div>
          <div class="content">
            <div class="greeting">Hi ${receiverName},</div>
            <p class="notification-text">You have received a new chat message regarding the listing <strong>${listingTitle}</strong>.</p>
            
            <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #9ca3af; letter-spacing: 0.05em; margin-bottom: 8px;">Message from ${senderName}:</div>
            <div class="message-bubble">
              "${contentPreview}"
            </div>

            <div class="button-container">
              <a href="${chatUrl}" class="btn">View Message & Reply</a>
            </div>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} RevenueVault. All rights reserved.<br>
            You are receiving this because you have an active deal on our platform.
          </div>
        </div>
      </body>
      </html>
    `;

    const info = await transporter.sendMail({
      from: `"${senderName} via RevenueVault" <${process.env.SENDER_EMAIL}>`,
      to: receiverEmail,
      subject: `RevenueVault - New message from ${senderName} about "${listingTitle}"`,
      html,
    });

    console.log(`[sendMessageEmail] Message email sent successfully: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[sendMessageEmail] Error sending message email:`, error);
    return { success: false, error };
  }
}
