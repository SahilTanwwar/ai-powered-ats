import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { users } from "../../services/api";

const PLANS = [
  { id: "free", name: "Free", price: "$0", features: ["1 active job", "Basic support", "Standard listing"] },
  { id: "basic", name: "Basic", price: "$29/mo", features: ["5 active jobs", "Highlighted listing", "Email support"] },
  { id: "premium", name: "Premium", price: "$79/mo", features: ["Unlimited jobs", "Featured company", "Priority support"] },
];

export default function EmployerSubscriptions() {
  const [currentPlan, setCurrentPlan] = useState("free");
  const [billingHistory, setBillingHistory] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await users.getSubscription();
        const subscription = response?.data?.data || {};
        setCurrentPlan(subscription.currentPlan || "free");
        setBillingHistory(subscription.billingHistory || []);
      } catch (error) {
        void error;
      }
    };
    load();
  }, []);

  const requestUpgrade = async (plan) => {
    try {
      const response = await users.upgradeSubscription(plan.id);
      const subscription = response?.data?.data || {};
      setCurrentPlan(subscription.currentPlan || plan.id);
      setBillingHistory(subscription.billingHistory || []);
      toast.success(`Plan changed to ${plan.name}.`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to upgrade subscription.");
    }
  };

  const downloadInvoice = (invoice) => {
    const content = [
      `Invoice Date: ${invoice.date}`,
      `Plan: ${invoice.plan}`,
      `Amount: ${invoice.amount}`,
      "",
      "Thank you for your subscription.",
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice-${invoice.date}-${invoice.plan.toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Invoice downloaded.");
  };

  const invoices = billingHistory;

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        {PLANS.map((plan) => (
          <div key={plan.id} className="border border-border rounded-xl p-4">
            <h3 className="font-head text-lg font-semibold text-dark">{plan.name}</h3>
            <p className="text-2xl font-head font-semibold text-primary mt-2">{plan.price}</p>
            <ul className="mt-3 space-y-1 text-sm text-secondary">
              {plan.features.map((feature) => <li key={feature}>• {feature}</li>)}
            </ul>
            <button
              type="button"
              onClick={() => requestUpgrade(plan)}
              disabled={currentPlan === plan.id}
              className="btn btn-primary mt-4 px-4 py-2.5 w-full disabled:opacity-60"
            >
              {currentPlan === plan.id ? "Current Plan" : "Upgrade"}
            </button>
          </div>
        ))}
      </div>

      <div className="border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="font-head font-semibold text-dark">Billing History</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <th>Date</th><th>Plan</th><th>Amount</th><th>Invoice</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-3 text-sm text-secondary">No invoices yet.</td>
              </tr>
            )}
            {invoices.map((invoice) => (
              <tr key={`${invoice.date}-${invoice.plan}`}>
                <td>{invoice.date}</td>
                <td>{invoice.plan}</td>
                <td>{invoice.amount}</td>
                <td>
                  <button type="button" onClick={() => downloadInvoice(invoice)} className="text-primary hover:underline">Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
