"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Building2, ShieldCheck, Sparkles, Users } from "lucide-react";
import RegisterForm from "@/components/auth/RegisterForm";
import { useAuth } from "@/contexts/AuthContext";

function RegisterContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo =
    searchParams?.get("redirect") ||
    (user?.role === "provider"
      ? "/provider-dashboard"
      : user?.role === "admin"
        ? "/admin/providers"
        : "/dashboard");

  useEffect(() => {
    if (user) {
      router.push(redirectTo);
    }
  }, [redirectTo, router, user]);

  if (user) {
    return (
      <div className="theme-page flex min-h-screen items-center justify-center p-8">
        <div className="theme-panel rounded-[28px] px-8 py-6 text-center">
          <p className="theme-muted text-sm">Redirecting to your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="theme-page min-h-screen">
      <div className="mx-auto grid min-h-screen max-w-7xl px-4 py-6 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
        <section className="theme-panel-strong overflow-hidden rounded-[34px]">
          <div className="grid h-full lg:grid-cols-[1.02fr_0.98fr]">
            <div className="p-6 md:p-8 lg:p-10">
              <div className="theme-chip inline-flex rounded-full px-4 py-2 text-xs uppercase tracking-[0.28em]">
                Create account
              </div>
              <h1 className="theme-heading mt-4 max-w-xl text-4xl font-semibold md:text-5xl">
                Join Off2Zim with the role that matches your journey
              </h1>
              <p className="theme-muted mt-4 max-w-xl text-sm leading-7 md:text-base">
                Create an explorer or provider account and continue where you belong.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  { icon: Users, title: "Explorer accounts", text: "For visitors and locals discovering Zimbabwe." },
                  { icon: Building2, title: "Provider accounts", text: "For tourism operators, stays, transport, and experiences." },
                  { icon: ShieldCheck, title: "Guided verification", text: "Structured company details that support trust and approval workflows." },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="theme-card-soft flex items-start gap-4 rounded-[24px] p-4">
                      <Icon className="mt-0.5 h-5 w-5 text-[#ff7352]" />
                      <div>
                        <div className="theme-heading text-base font-semibold">{item.title}</div>
                        <div className="theme-muted mt-1 text-sm leading-6">{item.text}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div
              className="min-h-[280px] bg-cover bg-center"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgba(0,0,0,0.12), rgba(0,0,0,0.5)), url('/images/victoria-falls.jpg')",
              }}
            >
              <div className="flex h-full items-end p-5 md:p-7">
                <div className="w-full rounded-[28px] border border-white/15 bg-black/40 p-4 text-white backdrop-blur">
                  <div className="text-xs uppercase tracking-[0.24em] text-white/55">
                    Off2Zim
                  </div>
                  <div className="mt-2 text-2xl font-semibold">Explore | Experience | Enjoy</div>
                  <div className="mt-3 inline-flex items-center gap-2 text-sm text-white/80">
                    <Sparkles className="h-4 w-4 text-[#ffca74]" />
                    Built for travelers and tourism partners
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="flex items-center justify-center px-0 py-6 lg:px-10">
          <RegisterForm redirectTo={redirectTo} />
        </aside>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="theme-page min-h-screen" />}>
      <RegisterContent />
    </Suspense>
  );
}
