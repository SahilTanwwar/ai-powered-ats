import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { users } from "../../services/api";

export default function AdminSettings() {
  const [limits, setLimits] = useState({ authRate: "5", apiRate: "100" });
  const [corsOrigin, setCorsOrigin] = useState("http://localhost:5173");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await users.getAdminSettings();
        const settings = response?.data?.data || {};
        if (settings.authRate) setLimits((prev) => ({ ...prev, authRate: String(settings.authRate) }));
        if (settings.apiRate) setLimits((prev) => ({ ...prev, apiRate: String(settings.apiRate) }));
        if (settings.corsOrigin) setCorsOrigin(settings.corsOrigin);
      } catch (error) {
        void error;
      }
    };
    load();
  }, []);

  const downloadConfigSnippet = (authRate, apiRate, origin) => {
    const text = [
      `AUTH_RATE_LIMIT=${authRate}`,
      `API_RATE_LIMIT=${apiRate}`,
      `FRONTEND_URL=${origin}`,
    ].join("\n");

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "admin-settings.env";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const saveSettings = async () => {
    if (!/^\d+$/.test(limits.authRate) || !/^\d+$/.test(limits.apiRate)) {
      toast.error("Rate limits must be numeric values.");
      return;
    }

    if (!corsOrigin.trim()) {
      toast.error("CORS frontend URL is required.");
      return;
    }

    try {
      await users.saveAdminSettings({
        authRate: limits.authRate,
        apiRate: limits.apiRate,
        corsOrigin: corsOrigin.trim(),
      });
      downloadConfigSnippet(limits.authRate, limits.apiRate, corsOrigin.trim());
      toast.success("Admin settings saved and exported.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save admin settings.");
    }
  };

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-head font-semibold text-dark">Admin Settings</h1>
      <div className="border border-border rounded-xl p-4 space-y-3">
        <h2 className="font-head font-semibold text-dark">Rate Limits</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <input value={limits.authRate} onChange={(event) => setLimits((prev) => ({ ...prev, authRate: event.target.value }))} placeholder="Auth requests / 15 min" className="border border-border rounded-lg px-3 py-2.5" />
          <input value={limits.apiRate} onChange={(event) => setLimits((prev) => ({ ...prev, apiRate: event.target.value }))} placeholder="API requests / 15 min" className="border border-border rounded-lg px-3 py-2.5" />
        </div>
      </div>

      <div className="border border-border rounded-xl p-4 space-y-3">
        <h2 className="font-head font-semibold text-dark">CORS Frontend URL</h2>
        <input value={corsOrigin} onChange={(event) => setCorsOrigin(event.target.value)} className="w-full border border-border rounded-lg px-3 py-2.5" />
      </div>

      <button type="button" onClick={saveSettings} className="btn btn-primary px-4 py-2.5">Save Settings</button>
    </div>
  );
}
