import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function EmailVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [secondsLeft, setSecondsLeft] = useState(60);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const handleChange = (index, value) => {
    const sanitized = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = sanitized;
      return next;
    });

    if (sanitized && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = (event) => {
    event.preventDefault();
    const code = digits.join("");
    if (code.length < 4) {
      toast.error("Please enter all 4 digits.");
      return;
    }

    toast.success("Email verified successfully.");
    navigate("/login");
  };

  const handleResend = () => {
    if (secondsLeft > 0) return;
    setSecondsLeft(60);
    toast.success("Verification code resent.");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md border border-border rounded-xl p-8 bg-white shadow-sm">
        <h1 className="text-2xl font-head font-semibold text-dark mb-2">Check your email</h1>
        <p className="text-secondary text-sm mb-6">
          We&apos;ve sent a 4-digit verification code to {searchParams.get("email") || "your email"}.
        </p>

        <form onSubmit={handleVerify} className="space-y-5">
          <div className="flex items-center gap-3 justify-center">
            {digits.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                value={digit}
                onChange={(event) => handleChange(index, event.target.value)}
                className="w-12 h-12 border border-border rounded-lg text-center text-lg font-semibold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                inputMode="numeric"
                maxLength={1}
              />
            ))}
          </div>

          <button type="submit" className="w-full btn btn-primary py-2.5">
            Verify Email
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-secondary">
          <button type="button" onClick={handleResend} className="text-primary hover:underline disabled:opacity-50" disabled={secondsLeft > 0}>
            Resend Code
          </button>
          {secondsLeft > 0 && <span> ({secondsLeft}s)</span>}
        </div>

        <p className="mt-4 text-center text-sm text-secondary">
          Back to <Link to="/login" className="text-primary hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
