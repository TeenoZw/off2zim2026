"use client";

import { useEffect, useState } from "react";
import { Plus, Package, Edit3, ToggleLeft, ToggleRight, Truck, MapPin } from "lucide-react";
import { apiFetch } from "@/lib/client-api";

interface ProviderListing {
  id: string;
  title: string;
  slug: string;
  status: string;
}

interface Product {
  id: string;
  listingId: string;
  slug: string;
  title: string;
  price: number | null;
  currency: string;
  images: string[];
  status: string;
  stockQuantity: number;
  isActive: boolean;
  offersShipping: boolean;
  shippingFee: number | null;
  pickupLeadTimeHours: number;
  deliveryEstimateDays: number | null;
  operatingHours: string | null;
  variants: unknown;
}

type Mode = "list" | "create" | "edit";

const DEFAULT_FORM = {
  listingId: "",
  stockQuantity: 0,
  offersShipping: false,
  shippingFee: "" as string | number,
  pickupLeadTimeHours: 24,
  deliveryEstimateDays: "" as string | number,
  operatingHours: "",
};

export default function ShopProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [listings, setListings] = useState<ProviderListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...DEFAULT_FORM });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [productData, listingData] = await Promise.all([
        apiFetch<{ products: Product[] }>("/api/provider/products"),
        apiFetch<{ listings: ProviderListing[] }>("/api/provider/listings"),
      ]);
      setProducts(productData.products);
      // Only show listings that don't already have a product
      const existingListingIds = new Set(productData.products.map((p) => p.listingId));
      setListings(
        listingData.listings.filter(
          (l) => !existingListingIds.has(l.id) && l.status !== "archived"
        )
      );
    } catch {
      setError("Unable to load products.");
    } finally {
      setLoading(false);
    }
  }

  function startCreate() {
    setForm({ ...DEFAULT_FORM });
    setEditingId(null);
    setMode("create");
    setError("");
    setSuccess("");
  }

  function startEdit(product: Product) {
    setForm({
      listingId: product.listingId,
      stockQuantity: product.stockQuantity,
      offersShipping: product.offersShipping,
      shippingFee: product.shippingFee ?? "",
      pickupLeadTimeHours: product.pickupLeadTimeHours,
      deliveryEstimateDays: product.deliveryEstimateDays ?? "",
      operatingHours: product.operatingHours ?? "",
    });
    setEditingId(product.id);
    setMode("edit");
    setError("");
    setSuccess("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const body = {
        ...(mode === "create" ? { listingId: form.listingId } : {}),
        stockQuantity: Number(form.stockQuantity),
        offersShipping: form.offersShipping,
        shippingFee: form.shippingFee !== "" ? Number(form.shippingFee) : null,
        pickupLeadTimeHours: Number(form.pickupLeadTimeHours),
        deliveryEstimateDays: form.deliveryEstimateDays !== "" ? Number(form.deliveryEstimateDays) : null,
        operatingHours: form.operatingHours || null,
      };

      if (mode === "create") {
        await apiFetch("/api/provider/products", { method: "POST", body: JSON.stringify(body) });
        setSuccess("Product created.");
      } else if (editingId) {
        await apiFetch(`/api/provider/products/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify(body),
        });
        setSuccess("Product updated.");
      }
      setMode("list");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save product.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(product: Product) {
    try {
      await apiFetch(`/api/provider/products/${product.id}`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !product.isActive }),
      });
      await loadData();
    } catch {
      setError("Unable to update product status.");
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="theme-panel animate-pulse rounded-[20px] p-5 h-20" />
        ))}
      </div>
    );
  }

  if (mode === "create" || mode === "edit") {
    const isCreate = mode === "create";
    return (
      <div className="theme-panel rounded-[28px] p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="theme-heading text-lg font-semibold">
            {isCreate ? "Add shop product" : "Edit product"}
          </h2>
          <button
            onClick={() => setMode("list")}
            className="text-sm text-white/50 hover:text-white/80"
          >
            Cancel
          </button>
        </div>

        {error ? (
          <div className="mb-4 rounded-xl border border-[#ff5630]/30 bg-[#ff5630]/8 px-4 py-3 text-sm text-[#ff5630]">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-5">
          {isCreate && (
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Listing <span className="text-[#ff5630]">*</span>
              </label>
              {listings.length === 0 ? (
                <p className="text-sm text-white/45">
                  All your listings already have products, or you have no active listings.
                  Create a new listing first.
                </p>
              ) : (
                <select
                  value={form.listingId}
                  onChange={(e) => setForm((f) => ({ ...f, listingId: e.target.value }))}
                  required
                  className="theme-input w-full rounded-xl px-4 py-3 text-sm"
                >
                  <option value="">Select a listing…</option>
                  {listings.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.title}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Stock quantity
              </label>
              <input
                type="number"
                min={0}
                value={form.stockQuantity}
                onChange={(e) => setForm((f) => ({ ...f, stockQuantity: parseInt(e.target.value) || 0 }))}
                className="theme-input w-full rounded-xl px-4 py-3 text-sm"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Pickup lead time (hours)
              </label>
              <input
                type="number"
                min={0}
                value={form.pickupLeadTimeHours}
                onChange={(e) => setForm((f) => ({ ...f, pickupLeadTimeHours: parseInt(e.target.value) || 0 }))}
                className="theme-input w-full rounded-xl px-4 py-3 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, offersShipping: !f.offersShipping }))}
              className={`flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                form.offersShipping ? "bg-[#4ade80]" : "bg-white/15"
              }`}
            >
              <span
                className={`ml-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  form.offersShipping ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
            <span className="text-sm text-white/70">Offer shipping</span>
          </div>

          {form.offersShipping && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Shipping fee (USD)
                </label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.shippingFee}
                  onChange={(e) => setForm((f) => ({ ...f, shippingFee: e.target.value }))}
                  className="theme-input w-full rounded-xl px-4 py-3 text-sm"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Delivery estimate (days)
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.deliveryEstimateDays}
                  onChange={(e) => setForm((f) => ({ ...f, deliveryEstimateDays: e.target.value }))}
                  className="theme-input w-full rounded-xl px-4 py-3 text-sm"
                  placeholder="e.g. 3"
                />
              </div>
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-white/70">
              Operating hours <span className="text-white/35">(optional, shown on product page)</span>
            </label>
            <input
              type="text"
              value={form.operatingHours}
              onChange={(e) => setForm((f) => ({ ...f, operatingHours: e.target.value }))}
              className="theme-input w-full rounded-xl px-4 py-3 text-sm"
              placeholder="e.g. Mon–Fri 8am–5pm"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving || (isCreate && listings.length === 0)}
              className="flex-1 rounded-xl bg-[#ff5630] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ff4520] disabled:opacity-50"
            >
              {saving ? "Saving…" : isCreate ? "Create product" : "Save changes"}
            </button>
            <button
              type="button"
              onClick={() => setMode("list")}
              className="rounded-xl border border-white/10 px-5 py-3 text-sm text-white/60 hover:text-white/80"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="theme-muted text-sm">{products.length} product{products.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={startCreate}
          className="flex items-center gap-2 rounded-xl bg-[#ff5630] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#ff4520]"
        >
          <Plus className="h-4 w-4" />
          Add product
        </button>
      </div>

      {error ? (
        <div className="rounded-xl border border-[#ff5630]/30 bg-[#ff5630]/8 px-4 py-3 text-sm text-[#ff5630]">
          {error}
        </div>
      ) : null}
      {success ? (
        <div className="rounded-xl border border-[#4ade80]/30 bg-[#4ade80]/8 px-4 py-3 text-sm text-[#4ade80]">
          {success}
        </div>
      ) : null}

      {products.length === 0 ? (
        <div className="theme-panel rounded-[28px] p-10 text-center">
          <Package className="mx-auto mb-3 h-10 w-10 text-white/20" />
          <p className="theme-heading font-semibold">No shop products yet</p>
          <p className="theme-muted mt-1 text-sm">
            Convert a listing into a purchasable product to start selling.
          </p>
          <button
            onClick={startCreate}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#ff5630] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#ff4520]"
          >
            <Plus className="h-4 w-4" />
            Add first product
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div key={product.id} className="theme-panel rounded-[20px] p-5">
              <div className="flex items-start gap-4">
                {product.images[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="h-14 w-14 shrink-0 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/8">
                    <Package className="h-6 w-6 text-white/25" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="theme-heading font-medium leading-tight">{product.title}</p>
                      <p className="theme-muted mt-0.5 text-sm">
                        {product.price != null ? `$${product.price} ${product.currency}` : "No price set"}
                        {" · "}
                        {product.stockQuantity} in stock
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        onClick={() => startEdit(product)}
                        className="rounded-lg border border-white/10 p-1.5 text-white/50 hover:text-white/80"
                        title="Edit"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => toggleActive(product)}
                        className="rounded-lg border border-white/10 p-1.5 text-white/50 hover:text-white/80"
                        title={product.isActive ? "Deactivate" : "Activate"}
                      >
                        {product.isActive ? (
                          <ToggleRight className="h-3.5 w-3.5 text-[#4ade80]" />
                        ) : (
                          <ToggleLeft className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-white/45">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Pickup {product.pickupLeadTimeHours}h lead
                    </span>
                    {product.offersShipping && (
                      <span className="flex items-center gap-1 text-[#8dc9ff]">
                        <Truck className="h-3 w-3" />
                        Shipping {product.shippingFee != null ? `$${product.shippingFee}` : "free"}
                      </span>
                    )}
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        product.isActive
                          ? "bg-[#4ade80]/10 text-[#4ade80]"
                          : "bg-white/8 text-white/35"
                      }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
