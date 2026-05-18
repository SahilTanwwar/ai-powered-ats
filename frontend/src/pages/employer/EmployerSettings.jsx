import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { auth, users } from "../../services/api";

export default function EmployerSettings() {
  const { user, logout, setToken } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState({ current: "", next: "", confirm: "" });
  const [notifications, setNotifications] = useState({ alerts: true, applications: true, messages: true, newsletter: false });
  const [deleteText, setDeleteText] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await users.getPreference("employer-notifications");
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
      await users.savePreference("employer-notifications", notifications);
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
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
      <div className="mb-8 border-b border-white/10 pb-6 relative z-10">
        <h1 className="text-3xl font-head font-bold text-[#18191C] dark:text-white mb-2">Account Settings</h1>
        <p className="text-[#515B6F] dark:text-[#9199A3]">Manage your login credentials, notifications, and account state.</p>
      </div>

      <section className="bg-white dark:bg-[#18191C]/95 backdrop-blur-md border border-[#E6E9EE] dark:border-white/10 rounded-3xl p-8 shadow-sm dark:shadow-2xl relative overflow-hidden transition-all">
        <h2 className="font-head text-xl font-bold text-[#18191C] dark:text-white mb-6">Change Email Address</h2>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#515B6F] dark:text-white/80">Email Address</label>
            <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="careers@example.com" className="w-full bg-white dark:bg-white/5 border border-[#E6E9EE] dark:border-white/10 text-[#18191C] dark:text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-gray-400 dark:placeholder:text-white/30" />
          </div>
          <div className="flex justify-end pt-2">
            <button type="button" onClick={requestEmailChange} className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-glow hover:-translate-y-0.5">
              Update Email
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-[#18191C]/95 backdrop-blur-md border border-[#E6E9EE] dark:border-white/10 rounded-3xl p-8 shadow-sm dark:shadow-2xl relative overflow-hidden transition-all">
        <h2 className="font-head text-xl font-bold text-[#18191C] dark:text-white mb-6">Change Password</h2>
        <div className="space-y-4">
          <div className="space-y-1.5">
             <label className="text-sm font-medium text-[#515B6F] dark:text-white/80">Current Password</label>
             <input type="password" value={password.current} onChange={(event) => setPassword((prev) => ({ ...prev, current: event.target.value }))} placeholder="••••••••" className="w-full bg-white dark:bg-white/5 border border-[#E6E9EE] dark:border-white/10 text-[#18191C] dark:text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-gray-400 dark:placeholder:text-white/30" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
               <label className="text-sm font-medium text-[#515B6F] dark:text-white/80">New Password</label>
               <input type="password" value={password.next} onChange={(event) => setPassword((prev) => ({ ...prev, next: event.target.value }))} placeholder="••••••••" className="w-full bg-white dark:bg-white/5 border border-[#E6E9EE] dark:border-white/10 text-[#18191C] dark:text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-gray-400 dark:placeholder:text-white/30" />
            </div>
            <div className="space-y-1.5">
               <label className="text-sm font-medium text-[#515B6F] dark:text-white/80">Confirm New Password</label>
               <input type="password" value={password.confirm} onChange={(event) => setPassword((prev) => ({ ...prev, confirm: event.target.value }))} placeholder="••••••••" className="w-full bg-white dark:bg-white/5 border border-[#E6E9EE] dark:border-white/10 text-[#18191C] dark:text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-gray-400 dark:placeholder:text-white/30" />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button type="button" onClick={openPasswordSettings} className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-glow hover:-translate-y-0.5">
              Update Password
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-[#18191C]/95 backdrop-blur-md border border-[#E6E9EE] dark:border-white/10 rounded-3xl p-8 shadow-sm dark:shadow-2xl relative overflow-hidden transition-all">
        <h2 className="font-head text-xl font-bold text-[#18191C] dark:text-white mb-6">Notification Preferences</h2>
        <div className="space-y-3 mb-6">
        {Object.entries(notifications).map(([key, value]) => (
          <label key={key} className="flex items-center justify-between p-4 border border-[#E6E9EE] dark:border-white/10 rounded-xl cursor-pointer hover:bg-primary/5 transition-colors group">
            <span className="text-sm font-medium text-[#18191C] dark:text-white capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
            <div className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={value} onChange={() => setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-white/10 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            </div>
          </label>
        ))}
        </div>
        <div className="flex justify-end mt-4">
          <button type="button" onClick={saveNotificationPreferences} className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-glow hover:-translate-y-0.5">
            Save Preferences
          </button>
        </div>
      </section>

      <section className="bg-red-500/10 border border-red-500/20 rounded-3xl p-8 shadow-sm relative overflow-hidden transition-all">
        <h2 className="font-head text-xl font-bold text-red-500 mb-2">Danger Zone</h2>
        <p className="text-sm text-red-500/80 mb-6">Once you delete your account, there is no going back. Please be certain.</p>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-red-500/80">Type "DELETE" to confirm</label>
            <input value={deleteText} onChange={(event) => setDeleteText(event.target.value)} placeholder="DELETE" className="w-full bg-red-500/5 border border-red-500/20 text-red-500 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500/50 transition-all placeholder:text-red-500/30" />
          </div>
          <div className="flex justify-end pt-2">
            <button type="button" disabled={deleteText !== "DELETE"} onClick={requestAccountDeletion} className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-red-500/20 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed">
              Delete Account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
