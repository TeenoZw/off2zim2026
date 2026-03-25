"use client";

import React from "react";
import {
  AlertTriangle,
  Calendar,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Search,
} from "lucide-react";

const orders = [
  {
    id: "ORD-001",
    customer: "Sarah Chen",
    title: "Victoria Falls Helicopter Tour",
    date: "2024-06-15",
    guests: 2,
    total: "$360",
    payment: "Paid",
    booking: "Confirmed",
  },
  {
    id: "ORD-002",
    customer: "James Wilson",
    title: "Sunset River Cruise",
    date: "2024-06-10",
    guests: 4,
    total: "$260",
    payment: "Disputed",
    booking: "Cancelled",
  },
  {
    id: "ORD-003",
    customer: "Lisa Thompson",
    title: "Traditional Cooking Class",
    date: "2024-06-08",
    guests: 1,
    total: "$45",
    payment: "Paid",
    booking: "Completed",
  },
];

export default function EnhancedOrderManagement() {
  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-white/10 bg-[#111111] p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Orders and disputes</h2>
            <p className="mt-2 text-sm text-white/50">
              Track bookings, payouts, cancellations, and service issues in a single
              operational view.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black">
              Orders
            </button>
            <button className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/70">
              Disputes
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-[1.1fr_0.8fr_0.8fr_auto]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
            <input
              type="text"
              placeholder="Search orders"
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/35"
            />
          </div>
          <select className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/75">
            <option>All booking status</option>
            <option>Confirmed</option>
            <option>Cancelled</option>
            <option>Completed</option>
          </select>
          <select className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/75">
            <option>All payment status</option>
            <option>Paid</option>
            <option>Pending</option>
            <option>Disputed</option>
          </select>
          <button className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm text-white/75">
            Export
          </button>
        </div>
      </section>

      <section className="space-y-4">
        {orders.map((order) => (
          <article
            key={order.id}
            className="rounded-[32px] border border-white/10 bg-[#111111] p-6"
          >
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-2xl font-semibold text-white">{order.id}</h3>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      order.booking === "Confirmed"
                        ? "bg-[#153220] text-[#8cf0a1]"
                        : order.booking === "Cancelled"
                          ? "bg-[#2d1714] text-[#ff8a78]"
                          : "bg-[#13283a] text-[#8dc9ff]"
                    }`}
                  >
                    {order.booking}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      order.payment === "Paid"
                        ? "bg-[#153220] text-[#8cf0a1]"
                        : order.payment === "Disputed"
                          ? "bg-[#332913] text-[#ffca74]"
                          : "bg-white/10 text-white/60"
                    }`}
                  >
                    {order.payment}
                  </span>
                </div>

                <div className="mt-3 text-lg font-medium text-white">{order.title}</div>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-white/55">
                  <span>{order.customer}</span>
                  <span className="inline-flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#8dc9ff]" />
                    {order.date}
                  </span>
                  <span>{order.guests} guests</span>
                  <span>{order.total}</span>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3 xl:w-[360px] xl:grid-cols-1">
                <button className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/75">
                  View details
                </button>
                <button className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/75">
                  Message customer
                </button>
                <button className="rounded-full bg-[#ff5630] px-4 py-3 text-sm font-medium text-white">
                  Manage booking
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-[32px] border border-white/10 bg-[#111111] p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-[#332913] p-3">
            <AlertTriangle className="h-5 w-5 text-[#ffca74]" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">Dispute handling</h3>
            <p className="mt-2 text-sm leading-6 text-white/55">
              Complex dispute threads, attachments, and resolution logs can be expanded
              next, but this surface is now visually aligned and much easier to scan.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-white/55">
              <span className="inline-flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-[#8dc9ff]" />
                Keep communication visible
              </span>
              <span className="inline-flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#ff8a63]" />
                Email-linked support
              </span>
              <span className="inline-flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#8cf0a1]" />
                Direct escalation ready
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#ffc247]" />
                Service context preserved
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
