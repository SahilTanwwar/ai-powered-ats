import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    toast.success(`Password reset for ${searchParams.get("email") || "account"}.`);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md border border-border rounded-xl p-8 bg-white shadow-sm">
        <h1 className="text-2xl font-head font-semibold text-dark mb-2">Reset Password</h1>
        <p className="text-secondary text-sm mb-6">Set your new password below.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full border border-border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            placeholder="New password"
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="w-full border border-border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            placeholder="Confirm new password"
            required
          />

          <button type="submit" className="w-full btn btn-primary py-2.5">Reset Password</button>
        </form>

        <p className="mt-4 text-center text-sm text-secondary">
          <Link to="/login" className="text-primary hover:underline">Back to Sign In</Link>
        </p>
      </div>
    </div>
  );
}
