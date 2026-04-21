"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Calendar, ChevronDown, ChevronUp, Search, Star } from "lucide-react";
import { apiFetch } from "@/lib/client-api";
import type { DisputeRecord, ProviderOrderRecord } from "@/types/platform";
import BlindRatingForm from "@/components/rating/BlindRatingForm";

type OrderTab = "new" | "upcoming" | "completed" | "disputed" | "all";

const ORDER_TABS: { id: OrderTab; label: string }[] = [
  { id: "new", label: "New" },
  { id: "upcoming", label: "Upcoming" },
  { id: "completed", label: "Completed" },
  { id: "disputed", label: "Disputed" },
  { id: "all", label: "All orders" },
];

function matchesTab(order: ProviderOrderRecord, tab: OrderTab): boolean {
  if (tab === "all") return true;
  if (tab === "new") return order.status === "PENDING" || order.status === "REQUESTED";
  if (tab === "upcoming") return order.status === "CONFIRMED";
  if (tab === "completed") return order.status === "COMPLETED";
  if (tab === "disputed") return order.disputesCount > 0;
  return true;
}

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: "bg-[#153220] text-[#8cf0a1]",
  COMPLETED: "bg-[#0f2a1e] text-[#4ade80]",
  CANCELLED: "bg-[#2d1714] text-[#ff8a78]",
  PENDING: "bg-[#13283a] text-[#8dc9ff]",
  REQUESTED: "bg-[#1a1f2e] text-[#b5c7ff]",
};

const PAYMENT_COLORS: Record<string, string> = {
  COMPLETED: "bg-[#153220] text-[#8cf0a1]",
  PENDING: "bg-white/10 text-white/60",
};

// ─── Order card ───────────────────────────────────────────────────────────────

function OrderCard({
  order,
  updatingId,
  onStatusChange,
}: {
  order: ProviderOrderRecord;
  updatingId: string;
  onStatusChange: (id: string, status: string) => void;
}) {
  const [ratingOpen, setRatingOpen] = useState(false);

  return (
    <article className="rounded-[32px] border border-white/10 bg-[#111111] overflow-hidden p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        {/* Left: booking info */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-2xl font-semibold text-white">
              {order.confirmationNumber}
            </h3>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[order.status] ?? "bg-white/10 text-white/60"}`}
            >
              {order.status}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${PAYMENT_COLORS[order.paymentStatus] ?? "bg-[#332913] text-[#ffca74]"}`}
            >
              {order.paymentStatus}
            </span>
            {order.disputesCount > 0 && (
              <span className="rounded-full bg-[#332913] px-3 py-1 text-xs font-medium text-[#ffca74]">
                {order.disputesCount} dispute{order.disputesCount > 1 ? "s" : ""}
              </span>
            )}
          </div>

          <div className="mt-2 text-lg font-medium text-white">
            {order.listing?.title || order.bookingType}
          </div>

          <div className="mt-3 flex flex-wrap gap-4 text-sm text-white/55">
            <span>{order.customer.name}</span>
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#8dc9ff]" />
              {new Date(order.createdAt).toLocaleDateString()}
            </span>
            <span>
              {order.guests ?? 1} guest{(order.guests ?? 1) > 1 ? "s" : ""}
            </span>
            <span>
              ${order.totalAmount.toFixed(2)} {order.currency}
            </span>
          </div>
        </div>

        {/* Right: actions */}
        <div className="grid gap-3 md:grid-cols-2 xl:w-[300px] xl:grid-cols-1">
          {(order.status === "PENDING" || order.status === "REQUESTED") && (
            <button
              disabled={updatingId === order.id}
              onClick={() => onStatusChange(order.id, "CONFIRMED")}
              className="rounded-full bg-[#ff5630] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              Confirm booking
            </button>
          )}

          {order.status === "CONFIRMED" && (
            <button
              disabled={updatingId === order.id}
              onClick={() => onStatusChange(order.id, "COMPLETED")}
              className="rounded-full bg-[#153220] px-4 py-3 text-sm font-semibold text-[#4ade80] ring-1 ring-[#4ade80]/20 disabled:opacity-50"
            >
              Mark complete
            </button>
          )}

          <select
            value={order.status}
            disabled={updatingId === order.id}
            onChange={(e) => onStatusChange(order.id, e.target.value)}
            className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/75"
          >
            <option value="REQUESTED">Requested</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {order.status === "COMPLETED" && (
            <button
              onClick={() => setRatingOpen((v) => !v)}
              className="flex items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/60 transition hover:border-white/25 hover:text-white/85"
            >
              <Star className="h-4 w-4" />
              Rate explorer
              {ratingOpen ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Blind rating form — expands inline for completed orders */}
      {order.status === "COMPLETED" && ratingOpen && (
        <div className="mt-5 border-t border-white/8 pt-5">
          <BlindRatingForm
            bookingId={order.id}
            perspective="provider"
            targetName={order.customer.name}
          />
        </div>
      )}
    </article>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function EnhancedOrderManagement() {
  const [orders, setOrders] = useState<ProviderOrderRecord[]>([]);
  const [disputes, setDisputes] = useState<DisputeRecord[]>([]);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<OrderTab>("new");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [ordersPayload, disputesPayload] = await Promise.all([
          apiFetch<{ orders: ProviderOrderRecord[] }>("/api/provider/orders"),
          apiFetch<{ disputes: DisputeRecord[] }>("/api/provider/disputes"),
        ]);
        setOrders(ordersPayload.orders);
        setDisputes(disputesPayload.disputes);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load orders.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const tabCounts = useMemo(
    () => ({
      new: orders.filter((o) => matchesTab(o, "new")).length,
      upcoming: orders.filter((o) => matchesTab(o, "upcoming")).length,
      completed: orders.filter((o) => matchesTab(o, "completed")).length,
      disputed: orders.filter((o) => matchesTab(o, "disputed")).length,
      all: orders.length,
    }),
    [orders]
  );

  const visibleOrders = useMemo(() => {
    const normalized = query.toLowerCase();
    return orders
      .filter((o) => matchesTab(o, activeTab))
      .filter((o) =>
        [o.confirmationNumber, o.customer.name, o.listing?.title ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(normalized)
      );
  }, [orders, activeTab, query]);

  const updateOrderStatus = async (orderId: string, status: string) => {
    setUpdatingId(orderId);
    try {
      const payload = await apiFetch<{ order: ProviderOrderRecord }>(
        `/api/provider/orders/${orderId}`,
        { method: "PATCH", body: JSON.stringify({ status }) }
      );
      setOrders((current) =>
        current.map((item) => (item.id === payload.order.id ? payload.order : item))
      );
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update order.");
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header + Search */}
      <section className="rounded-[32px] border border-white/10 bg-[#111111] p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Orders</h2>
            <p className="mt-1 text-sm text-white/50">
              Manage incoming requests, confirmations, and fulfilment.
            </p>
          </div>
        </div>

        {/* Status tabs */}
        <div className="mt-5 flex flex-wrap gap-2 border-b border-white/10 pb-5">
          {ORDER_TABS.map((tab) => {
            const count = tabCounts[tab.id];
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-[#ff5630] text-white"
                    : "border border-white/10 bg-white/[0.04] text-white/65 hover:bg-white/[0.08] hover:text-white"
                }`}
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-xs tabular-nums ${
                      isActive ? "bg-white/20" : "bg-white/10"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="relative mt-4">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by confirmation, customer, or listing"
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/35"
          />
        </div>
      </section>

      {error && (
        <div className="rounded-[28px] border border-[#ff5630]/30 bg-[#2d1714] px-4 py-3 text-sm text-[#ffb09c]">
          {error}
        </div>
      )}

      {/* Orders list */}
      <section className="space-y-4">
        {loading ? (
          <article className="rounded-[32px] border border-white/10 bg-[#111111] p-6 text-white/60">
            Loading orders…
          </article>
        ) : visibleOrders.length === 0 ? (
          <article className="rounded-[32px] border border-white/10 bg-[#111111] p-6 text-white/60">
            {query
              ? "No orders match that search."
              : activeTab === "new"
                ? "No new orders awaiting action."
                : activeTab === "upcoming"
                  ? "No upcoming confirmed bookings."
                  : activeTab === "completed"
                    ? "No completed orders yet."
                    : activeTab === "disputed"
                      ? "No disputed orders."
                      : "No orders found."}
          </article>
        ) : (
          visibleOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              updatingId={updatingId}
              onStatusChange={updateOrderStatus}
            />
          ))
        )}
      </section>

      {/* Disputes section — only shown when disputes exist */}
      {disputes.length > 0 && (
        <section className="rounded-[32px] border border-white/10 bg-[#111111] p-6">
          <h3 className="text-lg font-semibold text-white">
            Active disputes
            <span className="ml-2 rounded-full bg-[#332913] px-2 py-0.5 text-xs text-[#ffca74]">
              {disputes.length}
            </span>
          </h3>
          <div className="mt-4 space-y-3">
            {disputes.map((dispute) => (
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
                  {dispute.listing && (
                    <span className="text-sm text-white/50">{dispute.listing.title}</span>
                  )}
                </div>
                <p className="mt-2 text-sm text-white/60">{dispute.reason}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
