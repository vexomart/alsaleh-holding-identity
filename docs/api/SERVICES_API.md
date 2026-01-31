# Services API Contracts (Phase SERVICES-1)

## Overview
This document describes the Services module API endpoints for both Admin and Customer interfaces.

---

## Admin API (`/api/admin/services`)

### 1. List Services
**Function:** `fetchServices(filters?: ServiceFilters)`
```
GET /api/admin/services
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| category | string | No | Filter by category |
| is_active | boolean | No | Filter by active status |
| is_visible_to_customers | boolean | No | Filter by customer visibility |
| search | string | No | Search by name (AR/EN) |

**Response:** `Service[]`

**Ordering:** `sort_order ASC`, `created_at DESC`

---

### 2. Get Service by ID
**Function:** `fetchServiceById(id: string)`
```
GET /api/admin/services/:id
```

**Response:** `Service | null`

---

### 3. Create Service
**Function:** `createService(request: CreateServiceRequest)`
```
POST /api/admin/services
```

**Request Body:**
```typescript
{
  name: string;              // Required - English name
  name_ar?: string;          // Optional - Arabic name
  description?: string;      // Optional - English description
  description_ar?: string;   // Optional - Arabic description
  short_description?: string;
  short_description_ar?: string;
  price?: number;
  currency?: string;         // Default: "SAR"
  include_vat?: boolean;     // Default: false
  category?: string;
  icon?: string;
  image_url?: string;
  is_active?: boolean;       // Default: true
  is_visible_to_customers?: boolean; // Default: true
  sort_order?: number;       // Auto-generated if not provided
  metadata?: Record<string, unknown>;
}
```

**Response:** `Service`

---

### 4. Update Service
**Function:** `updateService(request: UpdateServiceRequest)`
```
PATCH /api/admin/services/:id
```

**Request Body:** Same as Create (all fields optional except `id`)

**Response:** `Service`

---

### 5. Delete Service
**Function:** `deleteService(id: string)`
```
DELETE /api/admin/services/:id
```

**Response:** `void`

---

### 6. Reorder Services (Bulk)
**Function:** `updateServicesSortOrder(orders: SortOrder[])`
```
PATCH /api/admin/services/reorder
```

**Request Body:**
```typescript
[
  { id: string; sort_order: number },
  { id: string; sort_order: number },
  ...
]
```

**Response:** `boolean`

**Note:** Uses PostgreSQL RPC for transaction-like atomicity.

---

### 7. Get Services by Category (Admin)
**Function:** `fetchServicesByCategory(includeInactive?: boolean)`
```
GET /api/admin/services/by-category
```

**Response:** `ServicesByCategory[]`

---

### 8. Get Categories
**Function:** `fetchCategories()`
```
GET /api/admin/services/categories
```

**Response:** `string[]` - Sorted list of unique categories

---

### 9. Toggle Service Status
**Function:** `toggleServiceStatus(id: string, is_active: boolean)`
```
PATCH /api/admin/services/:id/status
```

---

### 10. Toggle Customer Visibility
**Function:** `toggleServiceVisibility(id: string, is_visible_to_customers: boolean)`
```
PATCH /api/admin/services/:id/visibility
```

---

### 11. Duplicate Service
**Function:** `duplicateService(id: string)`
```
POST /api/admin/services/:id/duplicate
```

**Note:** Creates inactive copy with "(نسخة)" suffix.

---

### 12. Bulk Update
**Function:** `bulkUpdateServices(ids: string[], updates: Partial<CreateServiceRequest>)`
```
PATCH /api/admin/services/bulk
```

---

## Customer API (`/api/app/services`)

### 1. List Services (Customer)
**Function:** `fetchCustomerServices(category?: string)`
```
GET /api/app/services
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| category | string | No | Filter by category |

**Filtering:** Only returns services where `is_active=true` AND `is_visible_to_customers=true`

**Ordering:** `sort_order ASC`, `created_at DESC`

**Response:** `Service[]`

---

### 2. Get Services by Category (Customer)
**Function:** `fetchCustomerServicesByCategory()`
```
GET /api/app/services/by-category
```

**Response:** `ServicesByCategory[]`

---

## Data Types

### Service
```typescript
interface Service {
  id: string;
  tenant_id: string | null;
  name: string;
  name_ar: string | null;
  description: string | null;
  description_ar: string | null;
  short_description: string | null;
  short_description_ar: string | null;
  price: number | null;
  currency: string | null;
  include_vat: boolean;
  category: string | null;
  icon: string | null;
  image_url: string | null;
  is_active: boolean;
  is_visible_to_customers: boolean;
  sort_order: number;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}
```

### ServicesByCategory
```typescript
interface ServicesByCategory {
  category: string;
  services: Service[];
}
```

### ServiceFilters
```typescript
interface ServiceFilters {
  category?: string;
  is_active?: boolean;
  is_visible_to_customers?: boolean;
  search?: string;
}
```

---

## Database Schema

### Table: `services`
| Column | Type | Default | Notes |
|--------|------|---------|-------|
| id | uuid | gen_random_uuid() | Primary Key |
| tenant_id | uuid | null | Multi-tenant support |
| name | text | - | Required |
| name_ar | text | null | Arabic name |
| description | text | null | |
| description_ar | text | null | |
| short_description | text | null | |
| short_description_ar | text | null | |
| price | numeric | null | |
| currency | text | 'SAR' | |
| include_vat | boolean | false | VAT inclusion flag |
| category | text | null | |
| icon | text | null | Icon identifier |
| image_url | text | null | |
| is_active | boolean | true | Admin activation |
| is_visible_to_customers | boolean | true | Customer visibility |
| sort_order | integer | 0 | Display ordering |
| metadata | jsonb | '{}' | Extra data |
| created_at | timestamptz | now() | |
| updated_at | timestamptz | now() | |

### Indexes
- `idx_services_tenant_active_sort` - (tenant_id, is_active, sort_order)
- `idx_services_tenant_category` - (tenant_id, category)
- `idx_services_customer_view` - Partial index for active+visible services
- `idx_services_created_at` - (created_at DESC)

### RLS Policies
- **Admins:** Full CRUD access via `is_admin(auth.uid(), tenant_id)`
- **Public:** SELECT only where `is_active = true`

---

## Database Functions (RPC)

### `update_services_sort_order(p_service_orders jsonb)`
Bulk updates sort_order for multiple services atomically.

### `get_services_by_category(p_tenant_id uuid, p_include_inactive boolean)`
Returns services grouped by category.

### `get_next_service_sort_order(p_tenant_id uuid)`
Returns next available sort_order value.
