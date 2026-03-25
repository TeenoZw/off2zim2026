"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Search,
  Filter,
  Grid,
  List,
  ShoppingCart,
  Heart,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import StarRating from "@/components/rating/StarRating";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  category: string;
  vendor: {
    name: string;
    location: string;
    verified: boolean;
  };
  shippingOptions: {
    pickup: boolean;
    delivery: boolean;
    shipping: boolean;
  };
  inStock: boolean;
  tags: string[];
}

const MarketplacePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Sample products data
  const products: Product[] = [
    {
      id: "1",
      name: "Traditional Shona Stone Sculpture",
      description:
        "Hand-carved traditional Shona sculpture made from premium Zimbabwean serpentine stone. Each piece tells a unique story of our rich cultural heritage.",
      price: 150,
      originalPrice: 200,
      images: [
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&q=80",
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&q=80",
      ],
      rating: 4.8,
      reviewCount: 24,
      category: "art-crafts",
      vendor: {
        name: "Heritage Arts Zimbabwe",
        location: "Harare, Zimbabwe",
        verified: true,
      },
      shippingOptions: {
        pickup: true,
        delivery: true,
        shipping: true,
      },
      inStock: true,
      tags: ["handmade", "traditional", "sculpture", "gift"],
    },
    {
      id: "2",
      name: "Premium Zimbabwean Coffee Beans",
      description:
        "Single-origin coffee beans from the Eastern Highlands of Zimbabwe. Medium roast with notes of chocolate and citrus.",
      price: 25,
      images: [
        "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500&q=80",
      ],
      rating: 4.6,
      reviewCount: 89,
      category: "food-beverages",
      vendor: {
        name: "Highland Coffee Co.",
        location: "Mutare, Zimbabwe",
        verified: true,
      },
      shippingOptions: {
        pickup: false,
        delivery: true,
        shipping: true,
      },
      inStock: true,
      tags: ["coffee", "organic", "highlands", "premium"],
    },
    {
      id: "3",
      name: "Victoria Falls Photography Print",
      description:
        "Stunning high-quality canvas print of Victoria Falls at sunset. Professional photography capturing the majesty of this natural wonder.",
      price: 75,
      originalPrice: 100,
      images: [
        "https://images.unsplash.com/photo-1517056609083-0e8b8c6b31d4?w=500&q=80",
      ],
      rating: 4.9,
      reviewCount: 15,
      category: "art-crafts",
      vendor: {
        name: "Zimbabwe Photography Studio",
        location: "Victoria Falls, Zimbabwe",
        verified: true,
      },
      shippingOptions: {
        pickup: true,
        delivery: true,
        shipping: true,
      },
      inStock: true,
      tags: ["photography", "victoria-falls", "canvas", "decor"],
    },
    {
      id: "4",
      name: "Authentic Safari Hat",
      description:
        "Classic safari hat made from high-quality canvas with UPF 50+ sun protection. Perfect for your African adventure.",
      price: 45,
      images: [
        "https://images.unsplash.com/photo-1529958030586-3aae4ca485ff?w=500&q=80",
      ],
      rating: 4.4,
      reviewCount: 67,
      category: "clothing-accessories",
      vendor: {
        name: "Safari Gear Zimbabwe",
        location: "Bulawayo, Zimbabwe",
        verified: true,
      },
      shippingOptions: {
        pickup: true,
        delivery: true,
        shipping: true,
      },
      inStock: true,
      tags: ["safari", "hat", "sun-protection", "adventure"],
    },
  ];

  const categories = [
    { id: "all", label: "All Products", count: products.length },
    { id: "art-crafts", label: "Art & Crafts", count: 2 },
    { id: "food-beverages", label: "Food & Beverages", count: 1 },
    { id: "clothing-accessories", label: "Clothing & Accessories", count: 1 },
    { id: "home-decor", label: "Home & Decor", count: 0 },
    { id: "books-media", label: "Books & Media", count: 0 },
  ];

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "newest", label: "Newest First" },
  ];

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Off2Zim Marketplace
              </h1>
              <p className="text-gray-600 mt-1">
                Discover authentic Zimbabwean products from verified local
                vendors
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products, vendors, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="h-5 w-5" />
                Filters
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{category.label}</span>
                      <span className="text-sm text-gray-500">
                        ({category.count})
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Shipping Options
              </h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">
                    Available for pickup
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Local delivery</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">
                    International shipping
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {filteredProducts.length} products found
              </p>
            </div>

            {/* Products Grid */}
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Product Image */}
                  <div className="relative h-48 bg-gray-100">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full ${
                        favorites.includes(product.id)
                          ? "bg-red-100 text-red-600"
                          : "bg-white text-gray-400 hover:text-red-600"
                      }`}
                    >
                      <Heart
                        className={`h-5 w-5 ${favorites.includes(product.id) ? "fill-current" : ""}`}
                      />
                    </button>

                    {product.originalPrice && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                        Save ${product.originalPrice - product.price}
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <StarRating
                        rating={product.rating}
                        readonly
                        showText={false}
                        size="sm"
                      />
                      <span className="text-sm text-gray-600">
                        ({product.reviewCount} reviews)
                      </span>
                    </div>

                    {/* Vendor */}
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {product.vendor.name}
                      </span>
                      {product.vendor.verified && (
                        <div className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                          Verified
                        </div>
                      )}
                    </div>

                    {/* Price and Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">
                          ${product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>

                      <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <ShoppingCart className="h-4 w-4" />
                        Add to Cart
                      </button>
                    </div>

                    {/* Shipping Options */}
                    <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                      {product.shippingOptions.pickup && (
                        <span>• Pickup available</span>
                      )}
                      {product.shippingOptions.delivery && (
                        <span>• Local delivery</span>
                      )}
                      {product.shippingOptions.shipping && (
                        <span>• Ships internationally</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;
