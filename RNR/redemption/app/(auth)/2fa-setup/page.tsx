"use client";
import { useSession } from "next-auth/react";

export default function TwoFactorSetup() {

  return (
    <div className="space-y-6">
      <div className="border p-6 rounded-md">
        <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>


      </div>
    </div>
  );
};
