# Invoices API Contracts (Phase INVOICE-REALTIME-1 + FIN-2)

## Overview
Real-time invoice delivery system with integrated Paylink payment gateway.
Customers receive instant notifications when invoices are generated and can pay seamlessly.

---

## Admin API (`/api/admin/*`)

### 1. Generate Invoice for Order
**Function:** `createInvoice(request: CreateInvoiceRequest)`
```
POST /api/admin/orders/:id/invoice
```

**Request Body:**
```typescript
{
  order_id: string;        // Required
  customer_id: string;     // Required
  tenant_id?: string;
  subtotal: number;        // Required - Before VAT
  vat_rate?: number;       // Default: 15
  currency?: string;       // Default: "SAR"
  notes?: string;
  due_date?: string;       // ISO timestamp
  pdf_url?: string;        // Set after PDF generation
  metadata?: Record<string, unknown>;
}
```

**Response:** `Invoice`

**Side Effects (Automatic):**
1. Generates unique invoice number via `generate_invoice_number()` RPC
2. Calculates VAT amount and total
3. **Creates Paylink invoice** via edge function → stores `payment_url`
4. **Creates `financial_transaction`** with status=pending
5. Emits `invoice.generated` to customer channels
6. Creates notification record for customer

---

### 2. Update Invoice
**Function:** `updateInvoice(request: UpdateInvoiceRequest)`
```
PATCH /api/admin/invoices/:id
```

**Request Body:**
```typescript
{
  id: string;              // Required
  status?: InvoiceStatus;
  pdf_url?: string;
  notes?: string;
  due_date?: string;
  paid_at?: string;
  metadata?: Record<string, unknown>;
}
```

**Response:** `Invoice`

**Side Effects:**
- Emits `invoice.status_changed` if status changed

---

### 3. Mark Invoice as Paid
**Function:** `markInvoiceAsPaid(id: string)`
```
PATCH /api/admin/invoices/:id/pay
```

---

### 4. Cancel Invoice
**Function:** `cancelInvoice(id: string)`
```
PATCH /api/admin/invoices/:id/cancel
```

---

### 5. List All Invoices
**Function:** `getAllInvoices(filters?)`
```
GET /api/admin/invoices
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| status | InvoiceStatus | Filter by status |
| tenant_id | string | Filter by tenant |

---

## Customer API (`/api/app/*`)

### 1. Get Invoice for Order
**Function:** `getInvoiceByOrderId(orderId: string)`
```
GET /api/app/orders/:id/invoice
```

**Response:** `Invoice | null`

---

### 2. Get My Invoices
**Function:** `getCustomerInvoices(customerId: string)`
```
GET /api/app/invoices
```

**Response:** `Invoice[]`

---

## Realtime Channels

### Customer Channels (Tenant Isolated)
| Channel | Events | Purpose |
|---------|--------|---------|
| `user:{customer_id}:invoices` | invoice.generated, invoice.paid, payment.failed | Invoice & payment updates |
| `user:{customer_id}:notifications` | invoice.generated, invoice.paid, payment.failed | Notification delivery |

### Admin Channels
| Channel | Events | Purpose |
|---------|--------|---------|
| `tenant:{tenant_id}:invoices` | invoice.generated, invoice.status_changed | Admin monitoring |

---

## Realtime Payload Schema

### InvoiceRealtimePayload
```typescript
interface InvoiceRealtimePayload {
  event: 'invoice.generated' | 'invoice.status_changed' | 'invoice.paid' | 'payment.failed';
  invoice_id: string;
  invoice_number: string;
  order_id: string;
  customer_id: string;
  status: InvoiceStatus;
  total: number;
  currency: string;
  pdf_url: string | null;
  timestamp: string;  // ISO timestamp
}
```

---

## Data Types

### Invoice
```typescript
interface Invoice {
  id: string;
  tenant_id: string | null;
  order_id: string;
  customer_id: string;
  invoice_number: string;       // Format: INV-YYYY-XXXXX
  status: InvoiceStatus;
  subtotal: number;
  vat_rate: number;             // Default: 15
  vat_amount: number;           // Calculated
  total: number;                // subtotal + vat_amount
  currency: string;
  pdf_url: string | null;
  notes: string | null;
  due_date: string | null;
  paid_at: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}
```

### InvoiceStatus
```typescript
type InvoiceStatus = 'draft' | 'issued' | 'paid' | 'cancelled' | 'overdue';
```

---

## Database Schema

### Table: `invoices`
| Column | Type | Default | Notes |
|--------|------|---------|-------|
| id | uuid | gen_random_uuid() | Primary Key |
| tenant_id | uuid | null | FK to tenants |
| order_id | uuid | - | FK to orders (UNIQUE) |
| customer_id | uuid | - | Customer user ID |
| invoice_number | text | - | UNIQUE, generated |
| status | invoice_status | 'issued' | Enum |
| subtotal | numeric(12,2) | 0 | Before VAT |
| vat_rate | numeric(5,2) | 15.00 | VAT percentage |
| vat_amount | numeric(12,2) | 0 | Calculated |
| total | numeric(12,2) | 0 | subtotal + vat |
| currency | text | 'SAR' | |
| pdf_url | text | null | Storage URL |
| notes | text | null | |
| due_date | timestamptz | null | |
| paid_at | timestamptz | null | |
| metadata | jsonb | '{}' | |
| created_at | timestamptz | now() | |
| updated_at | timestamptz | now() | Auto-updated |

### Indexes
- `idx_invoices_order_id` - (order_id)
- `idx_invoices_customer_id` - (customer_id)
- `idx_invoices_tenant_status` - (tenant_id, status)
- `idx_invoices_created_at` - (created_at DESC)

### RLS Policies
- **Admins:** Full CRUD via `is_admin(auth.uid(), tenant_id)`
- **Customers:** SELECT only where `customer_id = auth.uid()`

---

## Database Functions

### `generate_invoice_number(p_tenant_id uuid)`
Generates unique invoice number in format: `INV-YYYY-XXXXX`

**Returns:** `text`

---

## React Hooks

### useInvoiceRealtime
Customer-side subscription for invoice events.

```typescript
import { useInvoiceRealtime } from '@/hooks/useInvoiceRealtime';

// Basic usage - shows toast automatically
useInvoiceRealtime();

// With callbacks
useInvoiceRealtime({
  onInvoiceGenerated: (payload) => {
    console.log('New invoice:', payload);
    refetchOrders();
  },
  onInvoiceStatusChanged: (payload) => {
    console.log('Status changed:', payload);
  },
  showToast: true, // default
});
```

### useAdminInvoiceRealtime
Admin-side subscription for tenant monitoring.

```typescript
import { useAdminInvoiceRealtime } from '@/hooks/useInvoiceRealtime';

useAdminInvoiceRealtime(tenantId, {
  onInvoiceGenerated: (payload) => {
    refetchInvoices();
  },
});
```

### useInvoiceDbRealtime
Direct Postgres changes subscription.

```typescript
import { useInvoiceDbRealtime } from '@/hooks/useInvoiceRealtime';

useInvoiceDbRealtime(
  (newInvoice) => console.log('Inserted:', newInvoice),
  (updatedInvoice) => console.log('Updated:', updatedInvoice)
);
```

---

## Customer UX Flow

1. **Admin generates invoice** for an order
2. **PDF generated** and stored (pdf_url set)
3. **Invoice record** saved to DB with VAT breakdown
4. **Realtime event** `invoice.generated` emitted to customer channels
5. **Notification record** created in notifications table
6. **Customer receives toast** notification instantly
7. **Customer navigates** to order details via notification link (`/app/orders/:id`)
8. **Customer downloads** invoice PDF

---

## UI Components

### OrderInvoiceSection (`src/components/orders/OrderInvoiceSection.tsx`)
Reusable invoice display component for order details.

**Props:**
```typescript
interface OrderInvoiceSectionProps {
  orderId: string;
  orderNumber: string;
  orderTitle: string;
  orderTitleAr?: string | null;
  orderDescription?: string | null;
  totalAmount: number;
  currency?: string;
  customerId?: string | null;
  tenantId?: string | null;
  createdAt?: string | null;
  dueDate?: string | null;
  isAdmin?: boolean;              // Shows "Generate Invoice" button
  onInvoiceGenerated?: (invoice: Invoice) => void;
}
```

**Features:**
- Shows "لا توجد فاتورة بعد" if no invoice exists
- Admin: "توليد الفاتورة" button to generate new invoice
- Shows invoice status with colored badge
- VAT breakdown: subtotal, VAT rate/amount, total
- "تحميل الفاتورة PDF" download button
- RTL support with LTR invoice numbers

### Admin Integration (`/admin/orders/:id` dialog)
- Added `OrderInvoiceSection` to order details dialog
- Shows invoice status and VAT breakdown
- Generate invoice button for orders without invoices

### Customer Page (`/app/orders/:id`)
- New page: `src/pages/app/OrderDetails.tsx`
- Shows order information with invoice section
- Real-time invoice notification via `useInvoiceRealtime`
- Download invoice PDF button
