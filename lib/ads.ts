import {
  RewardedAd,
  RewardedAdEventType,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import { kvGetBool, kvSetBool } from './database';
import { getTodayStr } from './utils';

// ─── Configuration ──────────────────────────────────────────
// Replace with your actual ad unit ID from AdMob dashboard.
// TestIds.REWARDED is used automatically in __DEV__ mode.
const AD_UNIT_ID_ANDROID = 'ca-app-pub-9203328068849916/8693546723';

function getAdUnitId(): string {
  return __DEV__ ? TestIds.REWARDED : AD_UNIT_ID_ANDROID;
}

// ─── Daily reward tracking ──────────────────────────────────

/** Check if the user already claimed their daily ad reward today */
export async function hasClaimedAdRewardToday(): Promise<boolean> {
  return kvGetBool(`ad_reward_${getTodayStr()}`);
}

/** Mark today's ad reward as claimed */
async function markAdRewardClaimed(): Promise<void> {
  await kvSetBool(`ad_reward_${getTodayStr()}`, true);
}

// ─── Rewarded Ad ────────────────────────────────────────────

/**
 * Show a rewarded ad. Returns true if the user earned the reward
 * (watched the full ad), false if they cancelled or an error occurred.
 */
export function showRewardedAd(): Promise<boolean> {
  return new Promise((resolve) => {
    const rewarded = RewardedAd.createForAdRequest(getAdUnitId());
    let settled = false;

    function settle(value: boolean) {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(value);
    }

    // Timeout — prevent infinite hang if ad never loads
    const timeout = setTimeout(() => settle(false), 15_000);

    const unsubLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        rewarded.show();
      },
    );

    const unsubEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      async () => {
        await markAdRewardClaimed();
        settle(true);
      },
    );

    const unsubClosed = rewarded.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        settle(false);
      },
    );

    const unsubError = rewarded.addAdEventListener(
      AdEventType.ERROR,
      (error) => {
        if (__DEV__) console.warn('[Ads] Rewarded ad error:', error);
        settle(false);
      },
    );

    function cleanup() {
      clearTimeout(timeout);
      unsubLoaded();
      unsubEarned();
      unsubClosed();
      unsubError();
    }

    // Start loading the ad
    rewarded.load();
  });
}
