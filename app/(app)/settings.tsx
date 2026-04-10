import { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Switch, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../contexts/ThemeContext';
import { SoundIcon, BellIcon, StarIcon, InfoIcon } from '../../components/Common/Icon';
import { kvGetBool, kvSetBool } from '../../lib/database';
import { refreshSoundSetting } from '../../lib/sounds';
import { scheduleDailyReminder, cancelDailyReminder } from '../../lib/notifications';
import { t } from '../../lib/i18n';
import { usePremium } from '../../contexts/PremiumContext';

function DarkModeIcon({ size = 20, color = '#B8A9C9' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79Z" fill={color} fillOpacity={0.3} stroke={color} strokeWidth={1.5} />
    </Svg>
  );
}

const getDarkModeOptions = () => [
  { value: 'auto' as const, label: t('settings.darkAuto') as string },
  { value: 'light' as const, label: t('settings.darkLight') as string },
  { value: 'dark' as const, label: t('settings.darkDark') as string },
];

export default function SettingsScreen() {
  const { colors, darkModePreference, setDarkModePreference } = useTheme();
  const { isPremium } = usePremium();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const router = useRouter();
  const darkModeOptions = useMemo(() => getDarkModeOptions(), []);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const sound = await kvGetBool('sound_enabled');
        const reminder = await kvGetBool('reminder_enabled');
        setSoundEnabled(sound || !(await kvGetBool('sound_set')));
        setReminderEnabled(reminder);
      })();
    }, [])
  );

  const toggleSound = async (value: boolean) => {
    setSoundEnabled(value);
    await kvSetBool('sound_enabled', value);
    await kvSetBool('sound_set', true);
    await refreshSoundSetting();
  };

  const toggleReminder = async (value: boolean) => {
    if (value) {
      const granted = await scheduleDailyReminder();
      if (!granted) return; // Permission denied — don't toggle
      setReminderEnabled(true);
      await kvSetBool('reminder_enabled', true);
    } else {
      setReminderEnabled(false);
      await kvSetBool('reminder_enabled', false);
      await cancelDailyReminder();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>{t('settings.title') as string}</Text>

      {/* Sound & Reminder */}
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <SoundIcon color={colors.primary} />
            <Text style={[styles.rowLabel, { color: colors.text }]}>{t('settings.sounds') as string}</Text>
          </View>
          <Switch
            value={soundEnabled}
            onValueChange={toggleSound}
            trackColor={{ true: colors.primary, false: colors.border }}
            thumbColor={colors.white}
          />
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <BellIcon color={colors.primary} />
            <Text style={[styles.rowLabel, { color: colors.text }]}>{t('settings.reminder') as string}</Text>
          </View>
          <Switch
            value={reminderEnabled}
            onValueChange={toggleReminder}
            trackColor={{ true: colors.primary, false: colors.border }}
            thumbColor={colors.white}
          />
        </View>
      </View>

      {/* Dark mode */}
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <DarkModeIcon color={colors.secondary} />
            <Text style={[styles.rowLabel, { color: colors.text }]}>{t('settings.darkMode') as string}</Text>
          </View>
        </View>
        <View style={styles.optionsRow}>
          {darkModeOptions.map((opt) => {
            const isSelected = darkModePreference === opt.value;
            return (
              <Pressable
                key={opt.value}
                style={[
                  styles.optionBtn,
                  { borderColor: colors.border },
                  isSelected && { backgroundColor: colors.primary, borderColor: colors.primary },
                ]}
                onPress={() => setDarkModePreference(opt.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: colors.textLight },
                    isSelected && { color: colors.white, fontWeight: '600' },
                  ]}
                >
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={[styles.optionHint, { color: colors.textLight }]}>
          {darkModePreference === 'auto'
            ? t('settings.darkHintAuto') as string
            : darkModePreference === 'dark'
            ? t('settings.darkHintDark') as string
            : t('settings.darkHintLight') as string}
        </Text>
      </View>

      {/* Premium */}
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Pressable
          style={styles.row}
          onPress={() => router.push('/(app)/paywall')}
        >
          <View style={styles.rowLeft}>
            <StarIcon color={colors.secondary} />
            <Text style={[styles.rowLabel, { color: colors.text }]}>{t('settings.premium') as string}</Text>
            {isPremium && <Text style={{ fontSize: 12, color: colors.primary, fontWeight: '600' }}>✓</Text>}
          </View>
          <Text style={[styles.arrow, { color: colors.textLight }]}>›</Text>
        </Pressable>
      </View>

      {/* About */}
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Pressable
          style={styles.row}
          onPress={() =>
            Alert.alert(
              t('settings.aboutTitle') as string,
              t('settings.aboutBody') as string
            )
          }
        >
          <View style={styles.rowLeft}>
            <InfoIcon color={colors.textLight} />
            <Text style={[styles.rowLabel, { color: colors.text }]}>{t('settings.about') as string}</Text>
          </View>
          <Text style={[styles.arrow, { color: colors.textLight }]}>›</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  section: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  arrow: {
    fontSize: 22,
  },
  divider: {
    height: 1,
    marginLeft: 52,
  },
  optionsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 8,
  },
  optionBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 14,
  },
  optionHint: {
    fontSize: 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
});
