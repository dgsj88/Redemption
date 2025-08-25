"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AddUserPage({ onUserAdded }: { onUserAdded?: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"USER" | "ADMIN">("USER");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });
    if (res.ok) {
      setMessage("User added successfully!");
      setName("");
      setEmail("");
      setPassword("");
      setRole("USER");
      if (onUserAdded) onUserAdded();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to add user.");
    }
  };

  return (
    <Card className="max-w-lg mx-auto mt-10 p-6">
      <CardHeader>
        <CardTitle>Add New User</CardTitle>
        <CardDescription>Admins can create new user accounts here.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
          <select
            value={role}
            onChange={e => setRole(e.target.value as "USER" | "ADMIN")}
            className="w-full border rounded px-3 py-2"
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {message && <p className="text-green-600 text-sm">{message}</p>}
          <Button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
            Add User
          </Button>
        </form>
        <div className="mt-6 flex justify-start">
          <a
            href="/dashboard?view=users"
            className="text-blue-600 hover:underline text-sm"
          >
            ← Back to User Management
          </a>
        </div>
      </CardContent>
    </Card>
  );
}