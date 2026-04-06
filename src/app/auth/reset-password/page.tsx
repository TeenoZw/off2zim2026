"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/client-api";

type ResetState = "idle" | "submitting" | "success" | "error";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [state, setState] = useState<ResetState>("idle");
  const [message, setMessage] = useState("");

  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!token) {
      setState("error");
      setMessage("This password reset link is missing a token.");
      return;
    }

    if (password.length < 8) {
      setState("error");
      setMessage("Password must be at least 8 characters.");
      return;
    }

    if (!passwordsMatch) {
      setState("error");
      setMessage("Passwords do not match.");
      return;
    }

    setState("submitting");
    setMessage("");

    try {
      await apiFetch<{ ok: boolean }>("/api/auth/password-reset/confirm", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });
      setState("success");
      setMessage("Your password has been reset. Sign in with your new password.");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to reset password right now."
      );
    }
  };

  const accent = useMemo(
    () => (state === "success" ? "#16a34a" : state === "error" ? "#dc2626" : "#ff5630"),
    [state]
  );

  return (
    <main className="min-h-screen bg-[#f6efe8] px-6 py-12 text-slate-950">
      <div className="mx-auto max-w-lg rounded-[28px] border border-black/10 bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <div
          className="inline-flex rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em]"
          style={{ backgroundColor: `${accent}14`, color: accent }}
        >
          Off2Zim Auth
        </div>
        <h1 className="mt-5 text-3xl font-semibold">Reset your password</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Choose a new password for your Off2Zim account.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              New password
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-12 w-full rounded-[18px] border border-black/10 px-4 outline-none transition focus:border-[#ff5630]"
              placeholder="Enter a new password"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Confirm password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="h-12 w-full rounded-[18px] border border-black/10 px-4 outline-none transition focus:border-[#ff5630]"
              placeholder="Re-enter your new password"
            />
          </div>

          {message ? (
            <div
              className="rounded-[18px] px-4 py-3 text-sm"
              style={{ backgroundColor: `${accent}12`, color: accent }}
            >
              {message}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={state === "submitting"}
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#ff5630] px-5 text-sm font-semibold text-white transition hover:bg-[#ff6f4d] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {state === "submitting" ? "Resetting..." : "Reset password"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link href="/login" className="font-semibold text-[#ff5630] hover:text-[#e44c28]">
            Back to sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
