import Purchases, {
  PurchasesPackage,
  CustomerInfo,
  LOG_LEVEL,
} from 'react-native-purchases';
import { Platform } from 'react-native';

// ─── Configuration ───────────────────────────────────────────────
// RevenueCat public SDK keys (safe to expose in client code)
// https://app.revenuecat.com → Project → API Keys → SDK API keys
const REVENUECAT_API_KEY_ANDROID = 'goog_HxWvsatkRnVLDOkwjTokOhIdKjM';
const REVENUECAT_API_KEY_IOS = 'YOUR_REVENUECAT_IOS_API_KEY'; // Not used — Android only

// Entitlement ID configured in RevenueCat dashboard
export const ENTITLEMENT_ID = 'premium';

// Product identifiers (must match RevenueCat Offerings → Packages)
export const PRODUCT_MONTHLY = '$rc_monthly';
export const PRODUCT_YEARLY = '$rc_annual';
// ─────────────────────────────────────────────────────────────────

let isConfigured = false;

/** Initialize RevenueCat SDK. Call once at app startup. */
export async function initPurchases(): Promise<void> {
  if (isConfigured) return;

  const apiKey = Platform.OS === 'ios'
    ? REVENUECAT_API_KEY_IOS
    : REVENUECAT_API_KEY_ANDROID;

  // Skip if placeholder keys (dev mode)
  if (apiKey.startsWith('YOUR_')) {
    console.warn('[Purchases] RevenueCat not configured — using placeholder keys');
    return;
  }

  Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.ERROR);
  Purchases.configure({ apiKey });
  isConfigured = true;
}

/** Check if the user currently has the premium entitlement. */
export async function checkPremiumStatus(): Promise<boolean> {
  if (!isConfigured) return false;

  try {
    const info: CustomerInfo = await Purchases.getCustomerInfo();
    return info.entitlements.active[ENTITLEMENT_ID] !== undefined;
  } catch (err) {
    console.warn('[Purchases] Failed to check premium status:', err);
    return false;
  }
}

/** Get available packages (monthly/yearly) from the current offering. */
export async function getOfferings(): Promise<PurchasesPackage[]> {
  if (!isConfigured) return [];

  try {
    const offerings = await Purchases.getOfferings();
    const current = offerings.current;
    if (!current) return [];

    const packages: PurchasesPackage[] = [];
    if (current.annual) packages.push(current.annual);
    if (current.monthly) packages.push(current.monthly);
    return packages;
  } catch (err) {
    console.warn('[Purchases] Failed to get offerings:', err);
    return [];
  }
}

/** Purchase a specific package. Returns true if premium is now active. */
export async function purchasePackage(pkg: PurchasesPackage): Promise<boolean> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
  } catch (err: any) {
    // User cancelled — not an error
    if (err.userCancelled) return false;
    throw err;
  }
}

/** Restore previous purchases. Returns true if premium is now active. */
export async function restorePurchases(): Promise<boolean> {
  if (!isConfigured) return false;

  try {
    const info: CustomerInfo = await Purchases.restorePurchases();
    return info.entitlements.active[ENTITLEMENT_ID] !== undefined;
  } catch (err) {
    console.warn('[Purchases] Failed to restore purchases:', err);
    return false;
  }
}
