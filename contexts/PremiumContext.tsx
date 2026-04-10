import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { PurchasesPackage } from 'react-native-purchases';
import {
  initPurchases,
  checkPremiumStatus,
  getOfferings,
  purchasePackage,
  restorePurchases,
} from '../lib/purchases';

interface PremiumContextValue {
  isPremium: boolean;
  loading: boolean;
  packages: PurchasesPackage[];
  purchase: (pkg: PurchasesPackage) => Promise<boolean>;
  restore: () => Promise<boolean>;
  refresh: () => Promise<void>;
}

const PremiumContext = createContext<PremiumContextValue>({
  isPremium: false,
  loading: true,
  packages: [],
  purchase: async () => false,
  restore: async () => false,
  refresh: async () => {},
});

export function PremiumProvider({ children }: { children: ReactNode }) {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);

  const refresh = useCallback(async () => {
    try {
      await initPurchases();
      const [premium, pkgs] = await Promise.all([
        checkPremiumStatus(),
        getOfferings(),
      ]);
      setIsPremium(premium);
      setPackages(pkgs);
    } catch (err) {
      console.warn('[Premium] Init error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const purchase = useCallback(async (pkg: PurchasesPackage): Promise<boolean> => {
    try {
      const success = await purchasePackage(pkg);
      if (success) setIsPremium(true);
      return success;
    } catch (err) {
      console.warn('[Premium] Purchase failed:', err);
      return false;
    }
  }, []);

  const restore = useCallback(async (): Promise<boolean> => {
    try {
      const success = await restorePurchases();
      if (success) setIsPremium(true);
      return success;
    } catch (err) {
      console.warn('[Premium] Restore failed:', err);
      return false;
    }
  }, []);

  const value = useMemo(() => ({
    isPremium,
    loading,
    packages,
    purchase,
    restore,
    refresh,
  }), [isPremium, loading, packages, purchase, restore, refresh]);

  return (
    <PremiumContext.Provider value={value}>
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  return useContext(PremiumContext);
}
