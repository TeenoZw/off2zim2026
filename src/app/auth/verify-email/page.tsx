"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/client-api";

type VerifyState = "verifying" | "success" | "error";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [state, setState] = useState<VerifyState>("verifying");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    if (!token) {
      setState("error");
      setMessage("This verification link is missing a token.");
      return;
    }

    const run = async () => {
      try {
        const payload = await apiFetch<{ ok: boolean; email: string }>(
          "/api/auth/verify-email/confirm",
          {
            method: "POST",
            body: JSON.stringify({ token }),
          }
        );

        setState("success");
        setMessage(`Your email ${payload.email} has been verified.`);
      } catch (error) {
        setState("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "Unable to verify this email right now."
        );
      }
    };

    run();
  }, [token]);

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
        <h1 className="mt-5 text-3xl font-semibold">
          {state === "success"
            ? "Email verified"
            : state === "error"
              ? "Verification failed"
              : "Verifying email"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full bg-[#ff5630] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ff6f4d]"
          >
            Go to sign in
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-black/10 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-black/[0.03]"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
