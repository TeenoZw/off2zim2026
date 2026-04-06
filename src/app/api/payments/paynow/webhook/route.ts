import { NextRequest, NextResponse } from "next/server";
import { Paynow } from "paynow";
import { BookingService } from "@/services/BookingService";
import { EmailService } from "@/services/EmailService";
import { BookingConfirmation } from "@/types/payment";

export const dynamic = "force-dynamic";
// Initialize Paynow for webhook verification
function initializePaynow() {
  const integrationId = process.env.PAYNOW_INTEGRATION_ID;
  const integrationKey = process.env.PAYNOW_INTEGRATION_KEY;

  if (!integrationId || !integrationKey) {
    throw new Error("Paynow credentials not configured");
  }

  return new Paynow(integrationId, integrationKey);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const paynow = initializePaynow();

    // Convert FormData to a regular object for Paynow verification
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    console.log("Paynow webhook received:", data);

    // Verify the webhook signature
    if (!paynow.verifyWebhook(data)) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const reference = data.reference;
    const status = data.status;
    const amount = parseFloat(data.amount) / 100; // Convert from cents
    const paynowReference = data.paynowreference;

    if (!reference) {
      console.error("No reference provided in webhook");
      return NextResponse.json(
        { error: "No reference provided" },
        { status: 400 }
      );
    }

    try {
      // Find booking by confirmation number (which we used as reference)
      const booking = await BookingService.getBookingByConfirmation(reference);

      if (!booking) {
        console.error("Booking not found for reference:", reference);
        return NextResponse.json(
          { error: "Booking not found" },
          { status: 404 }
        );
      }

      console.log(
        `Processing webhook for booking ${booking.id}, status: ${status}`
      );

      // Update payment and booking status based on Paynow status
      switch (status.toLowerCase()) {
        case "paid":
        case "success":
          // Payment successful
          await BookingService.updateBookingStatus(booking.id, "CONFIRMED");
          await BookingService.updatePaymentStatus(booking.id, "COMPLETED");

          // Send confirmation email
          try {
            const confirmation: BookingConfirmation = {
              id: booking.id,
              paymentIntentId: reference,
              userId: booking.userId,
              items: [], // We'll need to fetch items from booking details
              totalAmount: amount,
              currency: booking.currency,
              status: "confirmed",
              paymentStatus: "paid",
              bookingDate: booking.createdAt.toISOString(),
              createdAt: new Date(),
              confirmationNumber: booking.confirmationNumber,
              customerInfo: {
                name: "Customer", // We'll need to get this from user data
                email: "customer@example.com", // We'll need to get this from user data
              },
              metadata: {
                paynowReference,
                paymentReference: reference,
              },
            };

            await EmailService.sendBookingConfirmation(confirmation);
            console.log("Confirmation email sent for booking:", booking.id);
          } catch (emailError) {
            console.error("Failed to send confirmation email:", emailError);
          }
          break;

        case "cancelled":
        case "failed":
          // Payment failed or cancelled
          await BookingService.updateBookingStatus(booking.id, "CANCELLED");
          await BookingService.updatePaymentStatus(booking.id, "FAILED");
          console.log("Booking cancelled/failed:", booking.id);
          break;

        case "pending":
        case "awaiting delivery":
          // Payment still pending
          await BookingService.updateBookingStatus(booking.id, "PENDING");
          await BookingService.updatePaymentStatus(booking.id, "PENDING");
          console.log("Booking status updated to pending:", booking.id);
          break;

        default:
          console.log("Unknown payment status:", status);
          break;
      }

      return NextResponse.json({
        success: true,
        message: "Webhook processed successfully",
        bookingId: booking.id,
        status: status,
      });
    } catch (dbError) {
      console.error("Database error processing webhook:", dbError);
      return NextResponse.json(
        { error: "Database error processing webhook" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing Paynow webhook:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}

// GET endpoint to check webhook status
export async function GET() {
  return NextResponse.json({
    message: "Paynow webhook endpoint is active",
    timestamp: new Date().toISOString(),
  });
}
