"use client";

import React, { useState } from "react";
import { usePayment } from "@/contexts/PaymentContext";
import { ShoppingCart, X, Plus, Minus, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useRouter } from "next/navigation";

const CartComponent: React.FC = () => {
  const { currentBooking, removeFromBooking, calculateTotal, getItemCount } =
    usePayment();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleCheckout = () => {
    if (currentBooking && currentBooking.length > 0) {
      // Save items to localStorage for checkout page
      localStorage.setItem("checkout_items", JSON.stringify(currentBooking));

      // Navigate to checkout
      const itemsParam = encodeURIComponent(JSON.stringify(currentBooking));
      router.push(`/checkout?items=${itemsParam}`);
      setIsOpen(false);
    }
  };

  const updateQuantity = (itemId: string, change: number) => {
    if (!currentBooking) return;

    const item = currentBooking.find((item) => item.id === itemId);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity <= 0) {
        removeFromBooking(itemId);
      } else {
        // Update quantity logic would go here
        // For now, we'll just remove and re-add with new quantity
        removeFromBooking(itemId);
        // In a real implementation, you'd have an updateQuantity method
      }
    }
  };

  const itemCount = getItemCount();
  const total = calculateTotal();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <ShoppingCart className="w-5 h-5" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Your Booking Cart
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full pt-6">
          {!currentBooking || currentBooking.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-500">
                  Add some amazing experiences to start planning your Zimbabwe
                  adventure!
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-auto">
                <div className="space-y-4">
                  {currentBooking.map((item, index) => (
                    <div
                      key={`${item.id}-${index}`}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm">
                            {item.name}
                          </h4>

                          {item.description && (
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {item.description}
                            </p>
                          )}

                          {/* Item details */}
                          <div className="mt-2 space-y-1">
                            {item.checkIn && item.checkOut && (
                              <div className="text-xs text-gray-500">
                                {new Date(item.checkIn).toLocaleDateString()} -{" "}
                                {new Date(item.checkOut).toLocaleDateString()}
                              </div>
                            )}

                            {item.guests && (
                              <div className="text-xs text-gray-500">
                                {item.guests} guests
                              </div>
                            )}
                          </div>

                          {/* Quantity controls */}
                          <div className="flex items-center gap-2 mt-3">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-medium w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <div className="ml-4 flex flex-col items-end">
                          <button
                            onClick={() => removeFromBooking(item.id)}
                            className="text-gray-400 hover:text-red-500 mb-2"
                          >
                            <X className="w-4 h-4" />
                          </button>

                          <div className="text-right">
                            <div className="text-sm font-semibold text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                            {item.quantity > 1 && (
                              <div className="text-xs text-gray-500">
                                ${item.price.toFixed(2)} each
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Summary */}
              <div className="border-t pt-4 mt-4">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">VAT (15%)</span>
                    <span className="text-gray-900">
                      ${(total * 0.15).toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-emerald-600">
                        ${(total * 1.15).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  Proceed to Checkout
                </Button>

                <p className="text-xs text-gray-500 text-center mt-2">
                  Booking request protected by Off2Zim
                </p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartComponent;
