"use client";

import React from "react";
import { CheckCircle, Eye, EyeOff, MapPin, Plus, Search, Star } from "lucide-react";

const listings = [
  {
    title: "Victoria Falls Helicopter Tour",
    category: "Adventure Activities",
    location: "Victoria Falls",
    price: "$180",
    status: "Active",
    visibility: "Public",
    rating: "4.9",
    bookings: "156 bookings",
  },
  {
    title: "Sunset River Cruise",
    category: "Scenic Tours",
    location: "Victoria Falls",
    price: "$65",
    status: "Active",
    visibility: "Public",
    rating: "4.7",
    bookings: "89 bookings",
  },
  {
    title: "Traditional Cooking Class",
    category: "Cultural Experiences",
    location: "Victoria Falls",
    price: "$45",
    status: "Paused",
    visibility: "Private",
    rating: "New",
    bookings: "Draft growth item",
  },
];

export default function ListingManagement() {
  return (
    <div className="space-y-6">
      <section className="theme-panel rounded-[32px] p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="theme-heading text-2xl font-semibold">Listing management</h2>
            <p className="theme-muted mt-2 text-sm">
              Manage the public storefront for your services without leaving the new
              dashboard shell.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full bg-[#ff5630] px-5 py-3 text-sm font-semibold text-white">
            <Plus className="h-4 w-4" />
            Add new listing
          </button>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-[1.1fr_0.8fr_0.8fr_auto]">
          <div className="relative">
            <Search className="theme-subtle absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search listings"
              className="theme-input w-full rounded-2xl py-3 pl-11 pr-4 text-sm"
            />
          </div>
          <select className="theme-input rounded-2xl px-4 py-3 text-sm">
            <option>All status</option>
            <option>Active</option>
            <option>Paused</option>
            <option>Pending</option>
          </select>
          <select className="theme-input rounded-2xl px-4 py-3 text-sm">
            <option>All business types</option>
            <option>Accommodation</option>
            <option>Tours</option>
            <option>Transport</option>
          </select>
          <button className="theme-button-secondary rounded-2xl px-5 py-3 text-sm">
            Filter
          </button>
        </div>
      </section>

      <section className="grid gap-5">
        {listings.map((listing) => (
          <article
            key={listing.title}
            className="theme-panel rounded-[32px] p-6"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="theme-heading text-2xl font-semibold">{listing.title}</h3>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      listing.status === "Active"
                        ? "bg-[#153220] text-[#8cf0a1]"
                        : "bg-white/10 text-white/60"
                    }`}
                  >
                    {listing.status}
                  </span>
                </div>
                <div className="theme-muted mt-3 flex flex-wrap gap-3 text-sm">
                  <span>{listing.category}</span>
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#ff7352]" />
                    {listing.location}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Star className="h-4 w-4 fill-[#ffc247] text-[#ffc247]" />
                    {listing.rating}
                  </span>
                  <span>{listing.bookings}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="text-right">
                  <div className="theme-heading text-2xl font-semibold">{listing.price}</div>
                  <div className="theme-subtle text-sm">{listing.visibility}</div>
                </div>
                <button className="theme-button-secondary rounded-full p-3">
                  {listing.visibility === "Public" ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>
                <button className="theme-button-secondary rounded-full px-4 py-3 text-sm font-medium">
                  Edit
                </button>
                <button className="rounded-full bg-[#ff5630] px-4 py-3 text-sm font-medium text-white">
                  View
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className="theme-card-soft rounded-[24px] p-4 text-sm">
                Visibility controls and publishing state
              </div>
              <div className="theme-card-soft rounded-[24px] p-4 text-sm">
                Reviews, rating, and trust signals
              </div>
              <div className="theme-card-soft rounded-[24px] p-4 text-sm">
                Conversion-facing performance summary
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="theme-panel rounded-[32px] p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-[#153220] p-3">
            <CheckCircle className="h-5 w-5 text-[#8cf0a1]" />
          </div>
          <div>
            <h3 className="theme-heading text-lg font-semibold">One business, many services</h3>
            <p className="theme-muted mt-2 text-sm leading-6">
              The listing manager now reflects the PRD more clearly by framing this
              dashboard as a central operating hub for multiple service lines.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
