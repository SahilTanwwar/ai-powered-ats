import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { users } from "../../services/api";

const INITIAL_ALERTS = [
  { id: 1, title: "Frontend Roles", keywords: "react, frontend", location: "Remote", frequency: "Daily", enabled: true },
  { id: 2, title: "Design Roles", keywords: "ux, product design", location: "Bangalore", frequency: "Weekly", enabled: false },
];

export default function CandidateAlerts() {
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", keywords: "", location: "", frequency: "Daily" });

  useEffect(() => {
    const load = async () => {
      try {
        const response = await users.getPreference("candidate-alerts");
        const saved = response?.data?.data;
        if (Array.isArray(saved)) {
          setAlerts(saved);
        }
      } catch (error) {
        void error;
      }
    };
    load();
  }, []);

  const persistAlerts = async (next) => {
    setAlerts(next);
    try {
      await users.savePreference("candidate-alerts", next);
    } catch (error) {
      void error;
    }
  };

  const toggleAlert = (id) => {
    const next = alerts.map((alert) => (alert.id === id ? { ...alert, enabled: !alert.enabled } : alert));
    persistAlerts(next);
  };

  const createAlert = (event) => {
    event.preventDefault();
    if (!form.title.trim()) return;
    const next = [...alerts, { id: Date.now(), ...form, enabled: true }];
    persistAlerts(next);
    setForm({ title: "", keywords: "", location: "", frequency: "Daily" });
    setShowForm(false);
  };

  const removeAlert = (id) => {
    const next = alerts.filter((alert) => alert.id !== id);
    persistAlerts(next);
  };

  return (
    <div className="space-y-4">
      <button type="button" onClick={() => setShowForm((prev) => !prev)} className="btn btn-primary px-4 py-2.5">Create Alert</button>

      {showForm && (
        <form onSubmit={createAlert} className="border border-border rounded-xl p-4 grid md:grid-cols-2 gap-3">
          <input value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} placeholder="Alert title" className="border border-border rounded-lg px-3 py-2.5" required />
          <input value={form.keywords} onChange={(event) => setForm((prev) => ({ ...prev, keywords: event.target.value }))} placeholder="Keywords" className="border border-border rounded-lg px-3 py-2.5" />
          <input value={form.location} onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))} placeholder="Location" className="border border-border rounded-lg px-3 py-2.5" />
          <select value={form.frequency} onChange={(event) => setForm((prev) => ({ ...prev, frequency: event.target.value }))} className="border border-border rounded-lg px-3 py-2.5">
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
          </select>
          <button type="submit" className="btn btn-primary px-4 py-2.5 w-fit">Save Alert</button>
        </form>
      )}

      <div className="border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
              <th>Alert</th>
              <th>Keywords</th>
              <th>Location</th>
              <th>Frequency</th>
              <th>On/Off</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert) => (
              <tr key={alert.id}>
                <td>{alert.title}</td>
                <td>{alert.keywords}</td>
                <td>{alert.location}</td>
                <td>{alert.frequency}</td>
                <td>
                  <button type="button" onClick={() => toggleAlert(alert.id)} className={`px-2.5 py-1 rounded-md text-xs ${alert.enabled ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                    {alert.enabled ? "On" : "Off"}
                  </button>
                </td>
                <td>
                  <button type="button" onClick={() => removeAlert(alert.id)} className="text-warning hover:underline inline-flex items-center gap-1">
                    <Trash2 size={14} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
