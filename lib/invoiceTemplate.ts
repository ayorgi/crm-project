import { LOGO_BASE64 } from './logoBase64';
import { getVehiclePrice } from './utils';

export interface InvoiceData {
  id: string | number;
  pickupLocation: string;
  dropoffLocation: string;
  transferDate: string;
  transferTime?: string;
  transferType?: string;
  vehicleType: string;
  passengers?: string | number;
  flightNumber?: string;
  passengerName: string;
  email?: string;
  phone?: string;
  company?: string;
  status?: string;
  basePrice: string | number;
  tipAmount?: string | number;
  totalPrice: string | number;
  cardLast4?: string;
}

export function parseReservationPricing(item: any) {
  const notes = item?.notes || '';
  const fareMatch = notes.match(/\[Fare:\s*([^\]]+)\]/i);
  const tipMatch = notes.match(/\[Tip:\s*([^\]]+)\]/i);
  const cardMatch = notes.match(/(?:Card|card)\s*(?:••••|\*{4})\s*(\d{4})/i) || notes.match(/(?:••••|\*{4})\s*(\d{4})/);

  const numFare = fareMatch ? parseFloat(fareMatch[1].replace(/[^0-9.]/g, '')) : 0;
  const numTip = tipMatch ? parseFloat(tipMatch[1].replace(/[^0-9.]/g, '')) : 0;
  const standardBase = getVehiclePrice(item?.vehicleType || item?.vehicle_type);

  let basePrice = numFare > 0 
    ? numFare 
    : (item?.basePrice !== undefined && item?.basePrice !== null ? parseFloat(String(item.basePrice)) : standardBase);

  let tipAmount = numTip > 0 
    ? numTip 
    : (item?.tipAmount !== undefined && item?.tipAmount !== null ? parseFloat(String(item.tipAmount)) : 0);

  const rawTotal = item?.price !== undefined && item?.price !== null 
    ? parseFloat(String(item.price)) 
    : (item?.totalPrice !== undefined && item?.totalPrice !== null ? parseFloat(String(item.totalPrice)) : 0);

  let totalPrice = rawTotal > 0 ? rawTotal : (basePrice + tipAmount);

  // If total price was stored as base + tip, but tip was not parsed from notes
  if (totalPrice > basePrice && tipAmount === 0) {
    tipAmount = totalPrice - basePrice;
  } else if (totalPrice < basePrice + tipAmount) {
    totalPrice = basePrice + tipAmount;
  }

  const cardLast4 = cardMatch ? cardMatch[1] : (item?.cardLast4 || '5632');

  return {
    basePrice,
    tipAmount,
    totalPrice,
    cardLast4,
  };
}

function escapeHtml(str: string | null | undefined): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function downloadInvoiceHtml(receipt: InvoiceData, filename?: string) {
  const htmlContent = generateInvoiceHtml(receipt);
  const blob = new Blob([htmlContent.trim()], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `Invoice_INV_TR_${receipt.id}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function generateInvoiceHtml(receipt: InvoiceData): string {
  const basePriceFormatted = typeof receipt.basePrice === 'number' 
    ? receipt.basePrice.toFixed(2) 
    : parseFloat(receipt.basePrice || '0').toFixed(2);
    
  const tipAmountFormatted = typeof receipt.tipAmount === 'number'
    ? receipt.tipAmount.toFixed(2)
    : parseFloat(String(receipt.tipAmount || '0')).toFixed(2);
    
  const totalPriceFormatted = typeof receipt.totalPrice === 'number'
    ? receipt.totalPrice.toFixed(2)
    : parseFloat(String(receipt.totalPrice || '0')).toFixed(2);

  const statusText = (receipt.status || 'PAID').toUpperCase();
  const isPaid = statusText === 'PAID' || statusText === 'CONFIRMED' || statusText === 'COMPLETED';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice #INV-TR-${escapeHtml(String(receipt.id))}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
    * { 
      box-sizing: border-box; 
      margin: 0; 
      padding: 0; 
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
    }
    body { 
      background-color: #f1f5f9; 
      min-height: 100vh;
      padding: 40px 16px; 
      display: flex; 
      flex-direction: column; 
      align-items: center; 
      justify-content: center; 
      color: #0f172a;
      -webkit-font-smoothing: antialiased;
    }
    .invoice-card { 
      background: #ffffff; 
      width: 100%; 
      max-width: 580px; 
      border-radius: 24px; 
      padding: 28px 32px; 
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01); 
      border: 1px solid #f1f5f9; 
    }
    .top-header { 
      display: flex; 
      justify-content: space-between; 
      align-items: flex-start; 
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 16px;
      gap: 16px;
    }
    .brand-logo {
      height: 32px;
      width: auto;
      margin-bottom: 8px;
      display: block;
    }
    .sub-company { 
      font-size: 11px; 
      font-weight: 500; 
      color: #94a3b8; 
      line-height: 1.3; 
    }
    .tax-no { 
      font-size: 11px; 
      color: #94a3b8; 
      font-weight: 500; 
      line-height: 1.3; 
    }
    .inv-right { 
      text-align: right; 
    }
    .badge { 
      display: inline-block; 
      padding: 2px 10px; 
      background: ${isPaid ? '#ecfdf5' : '#fffbeb'}; 
      color: ${isPaid ? '#047857' : '#b45309'}; 
      font-weight: 700; 
      font-size: 10px; 
      border-radius: 9999px; 
      border: 1px solid ${isPaid ? '#a7f3d0' : '#fde68a'}; 
      text-transform: uppercase; 
      letter-spacing: 0.5px; 
      margin-bottom: 4px; 
    }
    .inv-num { 
      font-size: 18px; 
      font-weight: 900; 
      color: #0f172a; 
      line-height: 1.2; 
      letter-spacing: -0.3px; 
    }
    .date-str { 
      font-size: 11px; 
      color: #64748b; 
      margin-top: 2px; 
      font-weight: 500; 
    }
    .info-box { 
      display: grid; 
      grid-template-columns: 1fr 1fr; 
      gap: 16px; 
      background: #f8fafc; 
      padding: 14px 16px; 
      border-radius: 14px; 
      border: 1px solid #f1f5f9; 
      margin-top: 16px; 
      font-size: 12px; 
    }
    .sec-label { 
      font-size: 10px; 
      font-weight: 700; 
      color: #94a3b8; 
      text-transform: uppercase; 
      letter-spacing: 1px; 
      display: block; 
      margin-bottom: 4px; 
    }
    .client-name { 
      font-size: 14px; 
      font-weight: 700; 
      color: #0f172a; 
      margin-bottom: 2px; 
    }
    .client-detail { 
      font-size: 12px; 
      color: #64748b; 
      margin-bottom: 2px; 
      font-weight: 400; 
      word-break: break-all;
    }
    .route-section {
      margin-top: 16px;
    }
    .table-container { 
      border: 1px solid #e2e8f0; 
      border-radius: 12px; 
      overflow: hidden; 
      margin-top: 6px;
    }
    table { 
      width: 100%; 
      border-collapse: collapse; 
      text-align: left; 
      font-size: 12px; 
    }
    th { 
      background: #f1f5f9; 
      padding: 10px 12px; 
      font-size: 10px; 
      font-weight: 700; 
      color: #475569; 
      text-transform: uppercase; 
      letter-spacing: 0.5px; 
    }
    td { 
      padding: 10px 12px; 
      border-top: 1px solid #f1f5f9; 
    }
    .route-cell {
      font-weight: 600; 
      color: #0f172a; 
      display: flex; 
      align-items: center; 
      gap: 6px;
    }
    .price-breakdown { 
      background: #f8fafc; 
      border: 1px solid #e2e8f0; 
      border-radius: 14px; 
      padding: 14px 16px; 
      margin-top: 14px; 
      font-size: 12px; 
    }
    .price-row { 
      display: flex; 
      justify-content: space-between; 
      margin-bottom: 6px; 
      color: #64748b; 
      font-weight: 500;
    }
    .price-row.total { 
      border-top: 1px solid #e2e8f0; 
      padding-top: 6px; 
      margin-top: 6px; 
      margin-bottom: 0;
      font-weight: 700; 
      color: #0f172a; 
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .bottom-row { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      border-top: 1px solid #e2e8f0; 
      padding-top: 10px; 
      margin-top: 14px; 
      gap: 12px; 
    }
    .stamp-box { 
      background: #ecfdf5; 
      padding: 10px 14px; 
      border-radius: 12px; 
      border: 1px solid #a7f3d0; 
      display: flex; 
      align-items: center; 
      gap: 10px; 
      flex: 1; 
    }
    .stamp-title { 
      font-weight: 700; 
      color: #047857; 
      font-size: 12px; 
      line-height: 1.2; 
    }
    .stamp-sub { 
      font-size: 10px; 
      color: #059669; 
      margin-top: 2px; 
      line-height: 1.2; 
    }
    .total-box { 
      background: #0f172a; 
      color: #ffffff; 
      padding: 14px 20px; 
      border-radius: 16px; 
      text-align: right; 
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); 
      flex-shrink: 0; 
      min-width: 170px; 
    }
    .total-label { 
      font-size: 9px; 
      font-weight: 700; 
      color: #94a3b8; 
      text-transform: uppercase; 
      letter-spacing: 1px; 
      display: block; 
    }
    .total-price { 
      font-size: 20px; 
      font-weight: 900; 
      color: #ffffff; 
      display: block; 
      line-height: 1.2; 
      margin-top: 2px; 
    }
    .page-footer { 
      margin-top: 20px; 
      font-size: 11px; 
      color: #94a3b8; 
      text-align: center; 
    }
    @media print {
      body { background: #ffffff; padding: 0; }
      .invoice-card { box-shadow: none; border: none; padding: 0; max-width: 100%; }
    }
  </style>
</head>
<body>
  <div class="invoice-card">
    <!-- Top Header -->
    <div class="top-header">
      <div>
        <img src="${LOGO_BASE64}" alt="Transfer CRM Logo" class="brand-logo" />
        <div class="sub-company">VIP Chauffeur & Logistics Services Ltd.</div>
        <div class="tax-no">Tax Registration No: 9812-4091-VIP</div>
      </div>
      <div class="inv-right">
        <span class="badge">${escapeHtml(statusText)}</span>
        <h2 class="inv-num">INVOICE #INV-TR-${escapeHtml(String(receipt.id))}</h2>
        <p class="date-str">Date: ${escapeHtml(receipt.transferDate)} ${escapeHtml(receipt.transferTime || '')}</p>
      </div>
    </div>

    <!-- Billed To & Service Details -->
    <div class="info-box">
      <div>
        <span class="sec-label">BILLED TO</span>
        <p class="client-name">${escapeHtml(receipt.passengerName || '')}</p>
        <p class="client-detail">${escapeHtml(receipt.email || '')}</p>
        <p class="client-detail">${escapeHtml(receipt.phone || 'No phone provided')}</p>
        ${receipt.company ? `<p class="client-detail" style="color: #aa2d29; font-weight: 600; margin-top: 4px;">Partner: ${escapeHtml(receipt.company)}</p>` : ''}
      </div>
      <div>
        <span class="sec-label">SERVICE DETAILS</span>
        <p class="client-detail"><span style="color: #94a3b8;">Service:</span> <b style="color: #334155; font-weight: 600;">${escapeHtml(receipt.transferType || 'VIP Transfer')}</b></p>
        <p class="client-detail"><span style="color: #94a3b8;">Vehicle:</span> <b style="color: #334155; font-weight: 600;">${escapeHtml(receipt.vehicleType || 'Executive Vehicle')}</b></p>
        <p class="client-detail"><span style="color: #94a3b8;">Passengers:</span> <b style="color: #334155; font-weight: 600;">${escapeHtml(String(receipt.passengers || '1'))} Pax</b></p>
        ${receipt.flightNumber ? `<p class="client-detail"><span style="color: #94a3b8;">Flight No:</span> <b style="color: #334155; font-weight: 600;">${escapeHtml(receipt.flightNumber)}</b></p>` : ''}
      </div>
    </div>

    <!-- Route Breakdown -->
    <div class="route-section">
      <span class="sec-label">ROUTE BREAKDOWN</span>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>TRANSFER ROUTE</th>
              <th style="text-align: center;">TYPE</th>
              <th style="text-align: right;">STATUS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div class="route-cell">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aa2d29" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span>${escapeHtml(receipt.pickupLocation)} ➔ ${escapeHtml(receipt.dropoffLocation)}</span>
                </div>
              </td>
              <td style="text-align: center; color: #475569; font-weight: 500;">${escapeHtml(receipt.vehicleType)}</td>
              <td style="text-align: right; color: ${isPaid ? '#059669' : '#d97706'}; font-weight: 700; text-transform: uppercase;">${escapeHtml(statusText)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Price Breakdown -->
    <div class="price-breakdown">
      <div class="price-row">
        <span>Base Transfer Fare (${escapeHtml(receipt.vehicleType)}):</span>
        <b style="color: #0f172a; font-weight: 700;">$${basePriceFormatted}</b>
      </div>
      <div class="price-row">
        <span>Chauffeur Gratuity (Driver Tip):</span>
        <b style="color: #0f172a; font-weight: 700;">$${tipAmountFormatted}</b>
      </div>
      <div class="price-row total">
        <span style="display: flex; align-items: center; gap: 4px; color: #047857; font-weight: 600;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          Total Paid (Card ending in •••• ${escapeHtml(receipt.cardLast4 || '5632')}):
        </span>
        <b style="color: #aa2d29; font-size: 14px; font-weight: 900;">$${totalPriceFormatted} USD</b>
      </div>
    </div>

    <!-- Bottom Stamp & Total Box -->
    <div class="bottom-row">
      <div class="stamp-box">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#047857" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><path d="M20 13c0 5-8 9-8 9s-8-4-8-9V5l8-3 8 3z"/><path d="m9 12 2 2 4-4"/></svg>
        <div>
          <div class="stamp-title">Verified Electronic Tax Invoice</div>
          <div class="stamp-sub">Issued electronically under VIP Corporate Account Agreement.</div>
        </div>
      </div>
      <div class="total-box">
        <span class="total-label">TOTAL PAID</span>
        <span class="total-price">$${totalPriceFormatted} USD</span>
      </div>
    </div>
  </div>

  <div class="page-footer">VIP Chauffeur Services © 2026</div>
</body>
</html>`;
}
