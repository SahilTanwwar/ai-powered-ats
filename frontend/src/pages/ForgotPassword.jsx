import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email.trim()) {
      toast.error("Email is required.");
      return;
    }

    toast.success("Reset link sent to your email.");
    navigate(`/reset-password?email=${encodeURIComponent(email.trim())}`);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md border border-border rounded-xl p-8 bg-white shadow-sm">
        <h1 className="text-2xl font-head font-semibold text-dark mb-2">Forget Password?</h1>
        <p className="text-secondary text-sm mb-6">Enter your email and we&apos;ll send you a reset link.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full border border-border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            placeholder="john@example.com"
            required
          />

          <button type="submit" className="w-full btn btn-primary py-2.5">Send Reset Link</button>
        </form>

        <p className="mt-4 text-center text-sm text-secondary">
          <Link to="/login" className="text-primary hover:underline">Back to Sign In</Link>
        </p>
      </div>
    </div>
  );
}
