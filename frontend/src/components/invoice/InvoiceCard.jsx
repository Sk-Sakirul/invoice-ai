import {
  formatCurrency,
  formatDate,
  confidenceLabel,
} from "../../utils/format";

export default function InvoiceCard({ invoice }) {
  const { label, color } = confidenceLabel(invoice.confidence_score);

  return (
    <div className="bg-[#10131a] border border-gray-800 rounded-xl p-4">
      <div className="flex justify-between mb-3">
        <div>
          <p className="font-bold">{invoice.vendor_name}</p>
          <p className="text-xs text-gray-400">{invoice.invoice_number}</p>
        </div>

        {invoice.is_duplicate && (
          <span className="bg-yellow-500 px-2 py-1 text-xs rounded">DUP</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-gray-400">Date</p>
          <p>{formatDate(invoice.invoice_date)}</p>
        </div>

        <div>
          <p className="text-gray-400">Amount</p>
          <p>{formatCurrency(invoice.total_amount, invoice.currency)}</p>
        </div>

        <div>
          <p className="text-gray-400">Confidence</p>
          <p style={{ color }}>{label}</p>
        </div>
      </div>
    </div>
  );
}
