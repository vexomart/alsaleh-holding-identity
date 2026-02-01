/**
 * Payment Providers Index - PHASE WALLET-1
 * Provider registry and unified payment API
 */

import { paylinkProvider, getPaylinkPaymentMethods } from './paylink-provider';
import type {
  PaymentProvider,
  PaymentMethod,
  PaymentMethodType,
  CreatePaymentSessionParams,
  PaymentSessionResult,
  VerifyPaymentParams,
  VerifyPaymentResult,
} from './types';

// =====================================================
// PROVIDER REGISTRY
// =====================================================

const providers = new Map<string, PaymentProvider>();

// Register default providers
providers.set('paylink', paylinkProvider);

/**
 * Get a specific payment provider
 */
export function getProvider(name: string): PaymentProvider | undefined {
  return providers.get(name);
}

/**
 * Get the default payment provider
 */
export function getDefaultProvider(): PaymentProvider {
  return paylinkProvider;
}

/**
 * Register a new payment provider
 */
export function registerProvider(provider: PaymentProvider): void {
  providers.set(provider.name, provider);
}

// =====================================================
// UNIFIED PAYMENT API
// =====================================================

/**
 * Create a payment session using the default provider
 */
export async function createPaymentSession(
  params: CreatePaymentSessionParams
): Promise<PaymentSessionResult> {
  const provider = getDefaultProvider();
  return provider.createSession(params);
}

/**
 * Verify a payment using the default provider
 */
export async function verifyPayment(
  params: VerifyPaymentParams
): Promise<VerifyPaymentResult> {
  const provider = getDefaultProvider();
  return provider.verifyPayment(params);
}

// =====================================================
// PAYMENT METHODS
// =====================================================

/**
 * Get all available payment methods including manual options
 */
export function getAllPaymentMethods(): PaymentMethod[] {
  const paylinkMethods = getPaylinkPaymentMethods();
  
  // Add bank transfer (manual)
  const bankTransfer: PaymentMethod = {
    type: 'bank_transfer',
    label: 'Bank Transfer',
    label_ar: 'تحويل بنكي',
    icon: 'Building2',
    is_enabled: true,
    is_instant: false,
    requires_review: true,
    supported_currencies: ['SAR'],
  };

  // Add wallet balance
  const walletBalance: PaymentMethod = {
    type: 'wallet',
    label: 'Wallet Balance',
    label_ar: 'رصيد المحفظة',
    icon: 'Wallet',
    is_enabled: true,
    is_instant: true,
    requires_review: false,
    supported_currencies: ['SAR'],
  };

  return [...paylinkMethods, bankTransfer, walletBalance];
}

/**
 * Get enabled instant payment methods (card, mada, etc.)
 */
export function getInstantPaymentMethods(): PaymentMethod[] {
  return getAllPaymentMethods().filter(m => m.is_enabled && m.is_instant && m.type !== 'wallet');
}

/**
 * Check if a payment method is enabled
 */
export function isPaymentMethodEnabled(type: PaymentMethodType): boolean {
  const method = getAllPaymentMethods().find(m => m.type === type);
  return method?.is_enabled ?? false;
}

// Export types
export * from './types';
export { paylinkProvider, getPaylinkPaymentMethods };
