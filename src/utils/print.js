import { date, money } from "./format";

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const printDocument = (title, body) => {
  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (!printWindow) return;

  printWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <title>${escapeHtml(title)}</title>
        <style>
          body { color: #111827; font-family: Arial, sans-serif; margin: 32px; }
          h1 { font-size: 24px; margin: 0 0 6px; }
          h2 { font-size: 16px; margin: 22px 0 10px; }
          p { margin: 4px 0; }
          table { border-collapse: collapse; margin-top: 14px; width: 100%; }
          th, td { border: 1px solid #d1d5db; font-size: 13px; padding: 8px; text-align: left; }
          th { background: #f3f4f6; }
          .meta { display: grid; gap: 6px; grid-template-columns: repeat(2, 1fr); margin-top: 18px; }
          .summary { margin-left: auto; margin-top: 18px; width: 280px; }
          .right { text-align: right; }
          @media print { button { display: none; } body { margin: 18mm; } }
        </style>
      </head>
      <body>${body}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};

export const printSaleInvoice = ({ sale, items = [], shopName = "Shop" }) => {
  const rows = items.map((item) => `
    <tr>
      <td>${escapeHtml(item.productName)}</td>
      <td>${escapeHtml(item.productSku)}</td>
      <td class="right">${escapeHtml(item.quantity)}</td>
      <td class="right">${money(item.sellingPrice)}</td>
      <td class="right">${money(item.subtotal)}</td>
    </tr>
  `).join("");

  printDocument(`Invoice ${sale.invoiceNumber}`, `
    <h1>${escapeHtml(shopName)}</h1>
    <h2>Invoice</h2>
    <p>${escapeHtml(sale.invoiceNumber)}</p>
    <div class="meta">
      <p><strong>Customer:</strong> ${escapeHtml(sale.customerName)}</p>
      <p><strong>Date:</strong> ${date(sale.createdAt)}</p>
      <p><strong>Address:</strong> ${escapeHtml(sale.address || sale.note || "")}</p>
      <p><strong>Sold By:</strong> ${escapeHtml(sale.soldBy)}</p>
      <p><strong>Status:</strong> ${escapeHtml(sale.paymentStatus || "paid")}</p>
    </div>
    <table>
      <thead><tr><th>Product</th><th>SKU</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr></thead>
      <tbody>${rows || "<tr><td colspan=\"5\">No item details available.</td></tr>"}</tbody>
    </table>
    <table class="summary">
      <tr><th>Total</th><td class="right">${money(sale.totalAmount)}</td></tr>
      <tr><th>Paid</th><td class="right">${money(sale.paidAmount ?? sale.totalAmount)}</td></tr>
      <tr><th>Due</th><td class="right">${money(sale.dueAmount)}</td></tr>
    </table>
  `);
};

export const printCustomerDues = (customers = []) => {
  const totalUnpaid = customers.reduce((sum, customer) => sum + Number(customer.totalUnpaid || 0), 0);
  const rows = customers.map((customer) => `
    <tr>
      <td>${escapeHtml(customer._id || "Walk-in Customer")}</td>
      <td class="right">${escapeHtml(customer.invoices)}</td>
      <td class="right">${money(customer.totalBilled)}</td>
      <td class="right">${money(customer.totalPaid)}</td>
      <td class="right">${money(customer.totalUnpaid)}</td>
      <td>${date(customer.lastSaleAt)}</td>
    </tr>
  `).join("");

  printDocument("Customer Dues", `
    <h1>Customer Dues</h1>
    <p><strong>Total unpaid:</strong> ${money(totalUnpaid)}</p>
    <table>
      <thead><tr><th>Customer</th><th>Invoices</th><th>Total Billed</th><th>Paid</th><th>Unpaid</th><th>Last Sale</th></tr></thead>
      <tbody>${rows || "<tr><td colspan=\"6\">No customer dues.</td></tr>"}</tbody>
    </table>
  `);
};
