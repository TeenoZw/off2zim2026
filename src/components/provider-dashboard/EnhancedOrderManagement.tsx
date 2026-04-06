"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Calendar,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Search,
} from "lucide-react";
import { apiFetch } from "@/lib/client-api";
import type { DisputeRecord, ProviderOrderRecord } from "@/types/platform";

export default function EnhancedOrderManagement() {
  const [orders, setOrders] = useState<ProviderOrderRecord[]>([]);
  const [query, setQuery] = useState("");
  const [disputes, setDisputes] = useState<DisputeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const [ordersPayload, disputesPayload] = await Promise.all([
          apiFetch<{ orders: ProviderOrderRecord[] }>("/api/provider/orders"),
          apiFetch<{ disputes: DisputeRecord[] }>("/api/provider/disputes"),
        ]);
        setOrders(ordersPayload.orders);
        setDisputes(disputesPayload.disputes);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load provider orders.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const normalized = query.toLowerCase();
    return orders.filter((order) =>
      [order.confirmationNumber, order.customer.name, order.listing?.title || ""]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    );
  }, [orders, query]);

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-white/10 bg-[#111111] p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Orders and disputes</h2>
            <p className="mt-2 text-sm text-white/50">
              Live provider-facing order stream for booking requests, confirmations,
              payouts, and disputes.
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

        <div className="mt-6 grid gap-3 lg:grid-cols-[1.1fr_auto]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search orders"
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/35"
            />
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm text-white/75">
            {filteredOrders.length} orders
          </div>
        </div>
      </section>

      {error ? (
        <section className="rounded-[32px] border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-200">
          {error}
        </section>
      ) : null}

      <section className="space-y-4">
        {loading ? (
          <article className="rounded-[32px] border border-white/10 bg-[#111111] p-6 text-white/60">
            Loading orders...
          </article>
        ) : filteredOrders.length === 0 ? (
          <article className="rounded-[32px] border border-white/10 bg-[#111111] p-6 text-white/60">
            No provider orders yet.
          </article>
        ) : (
          filteredOrders.map((order) => (
            <article
              key={order.id}
              className="rounded-[32px] border border-white/10 bg-[#111111] p-6"
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-2xl font-semibold text-white">
                      {order.confirmationNumber}
                    </h3>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        order.status === "CONFIRMED"
                          ? "bg-[#153220] text-[#8cf0a1]"
                          : order.status === "CANCELLED"
                            ? "bg-[#2d1714] text-[#ff8a78]"
                            : "bg-[#13283a] text-[#8dc9ff]"
                      }`}
                    >
                      {order.status}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        order.paymentStatus === "COMPLETED"
                          ? "bg-[#153220] text-[#8cf0a1]"
                          : order.paymentStatus === "PENDING"
                            ? "bg-white/10 text-white/60"
                            : "bg-[#332913] text-[#ffca74]"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>

                  <div className="mt-3 text-lg font-medium text-white">
                    {order.listing?.title || order.bookingType}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-white/55">
                    <span>{order.customer.name}</span>
                    <span className="inline-flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[#8dc9ff]" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                    <span>{order.guests || 1} guests</span>
                    <span>
                      ${order.totalAmount.toFixed(2)} {order.currency}
                    </span>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-3 xl:w-[360px] xl:grid-cols-1">
                  <button className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/75">
                    View details
                  </button>
                  <button className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/75">
                    Message customer
                  </button>
                  <select
                    value={order.status}
                    disabled={updatingId === order.id}
                    onChange={async (event) => {
                      setUpdatingId(order.id);
                      try {
                        const payload = await apiFetch<{ order: ProviderOrderRecord }>(
                          `/api/provider/orders/${order.id}`,
                          {
                            method: "PATCH",
                            body: JSON.stringify({
                              status: event.target.value,
                            }),
                          }
                        );
                        setOrders((current) =>
                          current.map((item) =>
                            item.id === payload.order.id ? payload.order : item
                          )
                        );
                        setError("");
                      } catch (err) {
                        setError(
                          err instanceof Error
                            ? err.message
                            : "Unable to update booking status."
                        );
                      } finally {
                        setUpdatingId("");
                      }
                    }}
                    className="rounded-full bg-[#ff5630] px-4 py-3 text-sm font-medium text-white"
                  >
                    <option value="REQUESTED">Requested</option>
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>
            </article>
          ))
        )}
      </section>

      <section className="rounded-[32px] border border-white/10 bg-[#111111] p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-[#332913] p-3">
            <AlertTriangle className="h-5 w-5 text-[#ffca74]" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">Dispute handling</h3>
            <p className="mt-2 text-sm leading-6 text-white/55">
              Provider disputes are now grounded in real booking records and can be
              extended into richer resolution workflows next.
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

      <section className="rounded-[32px] border border-white/10 bg-[#111111] p-6">
        <h3 className="text-lg font-semibold text-white">Active disputes</h3>
        <div className="mt-4 space-y-3">
          {disputes.length === 0 ? (
            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4 text-sm text-white/55">
              No disputes raised against your bookings yet.
            </div>
          ) : (
            disputes.map((dispute) => (
              <div
                key={dispute.id}
                className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-[#332913] px-3 py-1 text-xs font-medium text-[#ffca74]">
                    {dispute.status}
                  </span>
                  <span className="text-sm text-white/75">
                    {dispute.bookingConfirmationNumber}
                  </span>
                </div>
                <div className="mt-2 text-sm font-medium text-white">{dispute.reason}</div>
                <div className="mt-1 text-sm text-white/55">{dispute.details}</div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
