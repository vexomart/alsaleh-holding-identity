/**
 * Customer Orders Module - Index exports
 */

// V2 Components (New)
export { CustomerOrdersCenterV2 as CustomerOrdersCenter } from './CustomerOrdersCenterV2';
export { OrdersKPIStripV2 as OrdersKPIStrip } from './OrdersKPIStripV2';

// Core Components
export { OrdersFilters } from './OrdersFilters';
export { OrdersTable } from './OrdersTable';
export { OrdersCardList } from './OrdersCardList';
export { OrdersPagination } from './OrdersPagination';
export { OrderDetailsDrawer } from './OrderDetailsDrawer';
export { OrderStatusBadge } from './OrderStatusBadge';
export { OrdersEmptyState, OrdersErrorState } from './OrdersEmptyState';
export { useCustomerOrders } from './useCustomerOrders';
export * from './types';

// Legacy exports (kept for compatibility)
export { CustomerOrdersCenter as CustomerOrdersCenterLegacy } from './CustomerOrdersCenter';
export { OrdersKPIStrip as OrdersKPIStripLegacy } from './OrdersKPIStrip';
