import { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Colors } from '../../constants/Colors';
import { useTheme } from '../../contexts/ThemeContext';
import { getEntriesForMonth, EntryRow } from '../../lib/database';
import { FlowerIcon } from '../../components/Common/Icon';
import { CATEGORIES, CategoryId } from '../../constants/Categories';
import { PLANTS } from '../../constants/Plants';
import { t } from '../../lib/i18n';

function formatEntryDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const months = t('calendar.months') as string[];
  return (t('calendar.dateFormat') as (day: number, month: string, year: number) => string)(d, months[m - 1], y);
}

function getCategoryById(id: string) {
  return CATEGORIES.find((c) => c.id === id);
}

function getPlantById(id: string) {
  return PLANTS.find((p) => p.id === id);
}

const DAYS = () => t('calendar.days') as string[];

function getYearMonth(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

export default function CalendarScreen() {
  const { colors } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entries, setEntries] = useState<Map<string, EntryRow>>(new Map());
  const [selectedEntry, setSelectedEntry] = useState<EntryRow | null>(null);

  const yearMonth = getYearMonth(currentDate);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const rows = await getEntriesForMonth(yearMonth);
        const map = new Map<string, EntryRow>();
        rows.forEach((r) => map.set(r.date, r));
        setEntries(map);
      })();
    }, [yearMonth])
  );

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  // Adjust so Monday = 0
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const changeMonth = (delta: number) => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() + delta);
      return next;
    });
  };

  const cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  // Pad to complete weeks
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>{t('calendar.title') as string}</Text>

      {/* Month nav */}
      <View style={styles.monthNav}>
        <Pressable onPress={() => changeMonth(-1)} style={styles.navBtn}>
          <Text style={[styles.navText, { color: colors.primary }]}>‹</Text>
        </Pressable>
        <Text style={[styles.monthText, { color: colors.text }]}>
          {(t('calendar.months') as string[])[month]} {year}
        </Text>
        <Pressable onPress={() => changeMonth(1)} style={styles.navBtn}>
          <Text style={[styles.navText, { color: colors.primary }]}>›</Text>
        </Pressable>
      </View>

      {/* Day headers */}
      <View style={styles.row}>
        {DAYS().map((d) => (
          <View key={d} style={styles.dayHeader}>
            <Text style={[styles.dayHeaderText, { color: colors.textLight }]}>{d}</Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={styles.grid}>
        {cells.map((day, i) => {
          if (day === null) {
            return <View key={`empty-${i}`} style={styles.cell} />;
          }
          const dateStr = `${yearMonth}-${String(day).padStart(2, '0')}`;
          const entry = entries.get(dateStr);
          const dayContent = (
            <View
              style={[
                styles.dayCircle,
                entry && { backgroundColor: colors.accent + '30' },
              ]}
            >
              {entry ? (
                <FlowerIcon size={22} color={colors.accent} />
              ) : (
                <Text style={[styles.dayText, { color: colors.text }]}>{day}</Text>
              )}
            </View>
          );
          return (
            <View key={dateStr} style={styles.cell}>
              {entry ? (
                <Pressable
                  onPress={() => setSelectedEntry(entry)}
                  style={({ pressed }) => pressed && styles.dayPressed}
                >
                  {dayContent}
                </Pressable>
              ) : (
                dayContent
              )}
            </View>
          );
        })}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendRow}>
          <FlowerIcon size={16} color={colors.accent} />
          <Text style={[styles.legendItem, { color: colors.textLight }]}>{t('calendar.legend') as string}</Text>
        </View>
      </View>

      {/* Entry detail modal */}
      <Modal
        visible={selectedEntry !== null}
        transparent
        animationType="none"
        onRequestClose={() => setSelectedEntry(null)}
      >
        <Pressable
          style={[styles.modalBackdrop, { backgroundColor: colors.overlay }]}
          onPress={() => setSelectedEntry(null)}
        >
          <Animated.View
            entering={FadeIn.duration(250)}
            style={[styles.modalCard, { backgroundColor: colors.card }]}
          >
            <Pressable>
              {/* Close button */}
              <Pressable
                onPress={() => setSelectedEntry(null)}
                style={styles.closeBtn}
                hitSlop={12}
              >
                <Text style={[styles.closeBtnText, { color: colors.textLight }]}>✕</Text>
              </Pressable>

              {selectedEntry && (() => {
                let cats: string[] = [];
                try { cats = JSON.parse(selectedEntry.categories || '[]'); } catch {}
                const plant = getPlantById(selectedEntry.plant_type);
                return (
                  <>
                    {/* Date */}
                    <Text style={[styles.modalDate, { color: colors.text }]}>
                      {formatEntryDate(selectedEntry.date)}
                    </Text>

                    {/* Plant */}
                    {plant && (
                      <Text style={styles.modalPlant}>
                        {plant.stages.flower} {plant.name}
                      </Text>
                    )}

                    {/* Category chips */}
                    {cats.length > 0 && (
                      <View style={styles.chipRow}>
                        {cats.map((catId) => {
                          const cat = getCategoryById(catId);
                          if (!cat) return null;
                          return (
                            <View
                              key={catId}
                              style={[styles.chip, { backgroundColor: cat.color + '35' }]}
                            >
                              <Text style={[styles.chipText, { color: cat.color }]}>
                                {cat.label}
                              </Text>
                            </View>
                          );
                        })}
                      </View>
                    )}

                    {/* Note */}
                    {selectedEntry.note ? (
                      <Text style={[styles.modalNote, { color: colors.textLight }]}>
                        {selectedEntry.note}
                      </Text>
                    ) : null}
                  </>
                );
              })()}
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
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
    marginBottom: 16,
  },
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  navBtn: {
    padding: 8,
  },
  navText: {
    fontSize: 28,
    fontWeight: '600',
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
  },
  dayHeader: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 8,
  },
  dayHeaderText: {
    fontSize: 13,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 14,
  },
  dayTextFilled: {
    fontSize: 20,
  },
  legend: {
    marginTop: 20,
    alignItems: 'center',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendItem: {
    fontSize: 14,
  },
  dayPressed: {
    opacity: 0.6,
    transform: [{ scale: 0.92 }],
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '85%',
    borderRadius: 20,
    padding: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  closeBtn: {
    position: 'absolute',
    top: -4,
    right: -4,
    padding: 4,
  },
  closeBtnText: {
    fontSize: 20,
    fontWeight: '600',
  },
  modalDate: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  modalPlant: {
    fontSize: 28,
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  modalNote: {
    fontSize: 15,
    lineHeight: 22,
  },
});
