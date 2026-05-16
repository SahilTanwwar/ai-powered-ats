import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { auth, users } from "../../services/api";

export default function CandidateSettings() {
  const { user, logout, setToken } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState({ current: "", next: "", confirm: "" });
  const [notifications, setNotifications] = useState({ alerts: true, statusUpdates: true, messages: true, newsletter: false });
  const [deleteText, setDeleteText] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await users.getPreference("candidate-notifications");
        const serverValue = response?.data?.data;
        if (serverValue && typeof serverValue === "object") {
          setNotifications((prev) => ({ ...prev, ...serverValue }));
        }
      } catch (error) {
        void error;
      }
    };
    load();
  }, []);

  const requestEmailChange = async () => {
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error("Enter a valid email address.");
      return;
    }

    try {
      const response = await users.updateMyEmail(trimmed);
      if (response?.data?.token) {
        setToken(response.data.token);
      }
      toast.success("Email updated.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update email.");
    }
  };

  const saveNotificationPreferences = async () => {
    try {
      await users.savePreference("candidate-notifications", notifications);
      toast.success("Notification preferences saved.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save preferences.");
    }
  };

  const openPasswordSettings = async () => {
    if (!password.current || !password.next || !password.confirm) {
      toast.error("Fill all password fields before continuing.");
      return;
    }
    if (password.next !== password.confirm) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      await auth.changePassword(password.current, password.next);
      toast.success("Password updated.");
      setPassword({ current: "", next: "", confirm: "" });
      navigate("/settings");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update password.");
    }
  };

  const requestAccountDeletion = async () => {
    if (deleteText !== "DELETE") return;

    try {
      await users.deleteMe();
      logout();
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete account.");
    }
  };

  return (
    <div className="space-y-6">
      <section className="border border-border rounded-xl p-4 space-y-3">
        <h2 className="font-head font-semibold text-dark">Change Email</h2>
        <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="New email" className="w-full border border-border rounded-lg px-3 py-2.5" />
        <button type="button" onClick={requestEmailChange} className="btn btn-primary px-4 py-2.5">Update Email</button>
      </section>

      <section className="border border-border rounded-xl p-4 space-y-3">
        <h2 className="font-head font-semibold text-dark">Change Password</h2>
        <input type="password" value={password.current} onChange={(event) => setPassword((prev) => ({ ...prev, current: event.target.value }))} placeholder="Current password" className="w-full border border-border rounded-lg px-3 py-2.5" />
        <input type="password" value={password.next} onChange={(event) => setPassword((prev) => ({ ...prev, next: event.target.value }))} placeholder="New password" className="w-full border border-border rounded-lg px-3 py-2.5" />
        <input type="password" value={password.confirm} onChange={(event) => setPassword((prev) => ({ ...prev, confirm: event.target.value }))} placeholder="Confirm password" className="w-full border border-border rounded-lg px-3 py-2.5" />
        <button type="button" onClick={openPasswordSettings} className="btn btn-primary px-4 py-2.5">Update Password</button>
      </section>

      <section className="border border-border rounded-xl p-4 space-y-3">
        <h2 className="font-head font-semibold text-dark">Notification Preferences</h2>
        {Object.entries(notifications).map(([key, value]) => (
          <label key={key} className="flex items-center justify-between border border-border rounded-lg px-3 py-2.5">
            <span className="text-sm text-dark capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
            <input type="checkbox" checked={value} onChange={() => setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))} />
          </label>
        ))}
        <button type="button" onClick={saveNotificationPreferences} className="btn btn-primary px-4 py-2.5">Save Preferences</button>
      </section>

      <section className="border border-warning rounded-xl p-4 space-y-3 bg-warning/5">
        <h2 className="font-head font-semibold text-warning">Delete Account</h2>
        <p className="text-sm text-secondary">Type DELETE to permanently remove your account.</p>
        <input value={deleteText} onChange={(event) => setDeleteText(event.target.value)} className="w-full border border-border rounded-lg px-3 py-2.5" placeholder="DELETE" />
        <button type="button" disabled={deleteText !== "DELETE"} onClick={requestAccountDeletion} className="px-4 py-2.5 rounded bg-warning text-white disabled:opacity-50">Delete Account</button>
      </section>
    </div>
  );
}
