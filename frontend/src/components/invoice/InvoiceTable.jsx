import InvoiceCard from "./InvoiceCard";

export default function InvoiceTable({ invoices }) {
  if (!invoices.length) {
    return <p className="text-gray-400">No invoices found</p>;
  }

  return (
    <div className="bg-[#10131a] rounded-xl overflow-hidden">
      {/* DESKTOP */}
      <table className="w-full hidden md:table">
        <thead className="bg-[#161b26]">
          <tr>
            <th className="p-4 text-left">Vendor</th>
            <th>Invoice</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {invoices.map((inv) => (
            <tr
              key={inv.id}
              className="border-t border-gray-800 hover:bg-blue-900/20"
            >
              <td className="p-4">
                {inv.vendor_name}
                {inv.is_duplicate && (
                  <span className="ml-2 text-xs bg-yellow-500 px-2 py-1 rounded">
                    DUP
                  </span>
                )}
              </td>

              <td>{inv.invoice_number}</td>
              <td>₹{inv.total_amount}</td>
              <td>{inv.invoice_date}</td>
              <td>{inv.status || "pending"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MOBILE */}
      <div className="md:hidden space-y-4 p-4">
        {invoices.map((inv) => (
          <InvoiceCard key={inv.id} invoice={inv} />
        ))}
      </div>
    </div>
  );
}
