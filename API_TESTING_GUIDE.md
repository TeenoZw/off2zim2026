# API Testing Quick Reference

## 🚀 Working APIs - Ready for Use

### 1. Mobile Money Payment API ✅ FULLY FUNCTIONAL

**Endpoint:** `POST http://localhost:3002/api/payments/mobile-money`

**Test Command:**

```bash
npx tsx test-api.ts
```

**Sample Request:**

```json
{
  "paymentIntentId": "test_1733123456",
  "provider": "ecocash",
  "phoneNumber": "077123456",
  "amount": 35000,
  "currency": "USD",
  "userId": "demo-user-id",
  "bookingItems": [
    {
      "id": "cmbokbt2s0000ubbtqjqmogga",
      "type": "accommodation",
      "name": "Victoria Falls Safari Lodge - Standard Room",
      "price": 350.0,
      "currency": "USD",
      "quantity": 1,
      "metadata": {
        "hotelId": "cmbokbt2s0000ubbtqjqmogga"
      }
    }
  ]
}
```

**Success Response:**

```json
{
  "status": "completed",
  "booking": {
    "confirmationNumber": "OFF2ZIM-MBOSUDQ3",
    "totalAmount": 350,
    "currency": "USD",
    "status": "confirmed"
  }
}
```

---

### 2. Paynow Payment API ✅ NEWLY IMPLEMENTED

**Endpoint:** `POST http://localhost:3000/api/payments/paynow`

**Test Command:**

```bash
npx tsx test-paynow.ts
```

**Supported Payment Methods:**

- EcoCash (mobile money)
- OneMoney (mobile money)
- ZimSwitch (bank cards)
- Visa (credit/debit cards)
- Mastercard (credit/debit cards)

**Sample EcoCash Request:**

```json
{
  "paymentIntentId": "test-ecocash-1733123456",
  "amount": 150.0,
  "currency": "USD",
  "method": "ecocash",
  "phone": "0771234567",
  "email": "test@example.com",
  "userId": "demo-user-id",
  "checkIn": "2025-06-10T00:00:00.000Z",
  "checkOut": "2025-06-13T00:00:00.000Z",
  "guests": 2,
  "specialRequests": "Test EcoCash booking"
}
```

**Sample Web Payment Request (ZimSwitch/Visa/Mastercard):**

```json
{
  "paymentIntentId": "test-visa-1733123456",
  "amount": 450.0,
  "currency": "USD",
  "method": "visa",
  "email": "test@example.com",
  "userId": "demo-user-id",
  "checkIn": "2025-06-10T00:00:00.000Z",
  "checkOut": "2025-06-17T00:00:00.000Z",
  "guests": 2
}
```

**Success Response (Mobile Money - Immediate):**

```json
{
  "success": true,
  "status": "completed",
  "booking": {
    "id": "booking-123",
    "confirmationNumber": "OFF2ZIM-ABC123",
    "totalAmount": 150,
    "currency": "USD",
    "status": "confirmed",
    "paymentStatus": "paid"
  },
  "payment": {
    "reference": "paynow-ref-123",
    "method": "ecocash",
    "instructions": "Payment completed successfully"
  }
}
```

**Success Response (Web Payment - Redirect Required):**

```json
{
  "success": true,
  "status": "pending",
  "booking": {
    "id": "booking-456",
    "confirmationNumber": "OFF2ZIM-XYZ789",
    "totalAmount": 450,
    "currency": "USD",
    "status": "pending"
  },
  "payment": {
    "reference": "paynow-ref-456",
    "redirectUrl": "https://paynow.co.zw/payment/redirect-url",
    "pollUrl": "https://paynow.co.zw/payment/poll-url",
    "method": "visa",
    "instructions": "Complete payment on redirect page"
  }
}
```

**Webhook Endpoint:** `POST /api/payments/paynow/webhook`

This endpoint automatically processes payment status updates from Paynow and:

- Updates booking status (PENDING → CONFIRMED/CANCELLED)
- Updates payment status (pending → completed/failed)
- Sends confirmation emails for successful payments

**Environment Variables Required:**

```bash
PAYNOW_INTEGRATION_ID=your_paynow_integration_id
PAYNOW_INTEGRATION_KEY=your_paynow_integration_key
PAYNOW_RESULT_URL=http://localhost:3000/api/payments/paynow/webhook
PAYNOW_RETURN_URL=http://localhost:3000/booking/success
```

---

### 3. Stripe Payment Confirmation API ✅ DATABASE INTEGRATED

**Endpoint:** `POST http://localhost:3002/api/payments/confirm`

**Sample Request:**

```json
{
  "paymentIntentId": "pi_1GqICD2eZvKYlo2C4JH8gG8f",
  "amount": 4500,
  "currency": "USD",
  "userId": "demo-user-id",
  "bookingId": "booking-123",
  "paymentMethod": "stripe",
  "confirmationCode": "123456"
}
```

**Success Response:**

```json
{
  "status": "completed",
  "booking": {
    "confirmationNumber": "OFF2ZIM-MBOSUDQ3",
    "totalAmount": 450,
    "currency": "USD",
    "status": "confirmed"
  }
}
```

---

### 4. Available Hotel IDs for Testing

```
✅ Victoria Falls Safari Lodge
ID: cmbokbt2s0000ubbtqjqmogga

✅ The Kingdom at Victoria Falls
ID: cmbokbt2s0001ubbtdb6s7b7e
```

---

### 5. Phone Number Formats

**EcoCash:** 077xxxxxx, 078xxxxxx  
**OneMoney:** 071xxxxxx, 073xxxxxx  
**TeleCash:** 076xxxxxx

---

### 6. Database Verification Commands

**Check booking creation:**

```bash
npx tsx -e "
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
(async () => {
  const bookings = await prisma.booking.findMany({
    include: { hotel: true },
    orderBy: { createdAt: 'desc' },
    take: 3
  });
  console.log('Latest bookings:', bookings.map(b => ({
    confirmation: b.confirmationNumber,
    hotel: b.hotel?.name,
    amount: b.totalAmount
  })));
  await prisma.\$disconnect();
})();
"
```

---

## 🎯 Test Status Summary

| API            | Status         | Database      | Notes                        |
| -------------- | -------------- | ------------- | ---------------------------- |
| Mobile Money   | ✅ Working     | ✅ Persisted  | Fully tested & functional    |
| Paynow         | ✅ Working     | ⚡ N/A        | Test with various methods    |
| Stripe Intent  | ⚠️ Needs Setup | ⚡ N/A        | Requires STRIPE_SECRET_KEY   |
| Stripe Confirm | ⚠️ Needs Setup | ✅ Integrated | Ready when Stripe configured |
| Database       | ✅ Working     | ✅ Seeded     | 2 hotels, demo user ready    |

**Ready for Production:** Mobile Money payments with full database persistence!
