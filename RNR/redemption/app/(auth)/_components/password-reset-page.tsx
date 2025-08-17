"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

function isValidEmail(email: string) {
  // Simple email validation regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function PasswordResetPage() {
  const searchParams = useSearchParams();
  const referralCode = searchParams.get("referral") || "";
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    const res = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email}),
    });
    if (res.ok) {
      setMessage("Password reset link sent to your verified email address!");
    } else if (res.status === 404) {
      setError("Email address cannot be found.");
    } else {
      setError("Failed to send reset link.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Request Password Reset</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />    
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          Send Reset Link
        </button>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}
