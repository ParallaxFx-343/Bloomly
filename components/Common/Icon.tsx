import React from 'react';
import Svg, { Path, Circle, Rect, G, Line } from 'react-native-svg';
import { Colors } from '../../constants/Colors';

interface IconProps {
  size?: number;
  color?: string;
}

// --- Tab bar icons ---

export function GardenIcon({ size = 24, color = Colors.primary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 22V12" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M12 12C12 8 8 4 4 4C4 8 8 12 12 12Z" fill={color} fillOpacity={0.3} stroke={color} strokeWidth={1.5} />
      <Path d="M12 12C12 8 16 4 20 4C20 8 16 12 12 12Z" fill={color} fillOpacity={0.3} stroke={color} strokeWidth={1.5} />
      <Path d="M9 22H15" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function SeedlingIcon({ size = 24, color = Colors.primary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 22V14" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M12 14C12 10 16 7 20 7C20 11 16 14 12 14Z" fill={color} fillOpacity={0.3} stroke={color} strokeWidth={1.5} />
      <Path d="M7 22C7 18.5 9.2 15.5 12 14" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

export function CalendarIcon({ size = 24, color = Colors.primary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={4} width={18} height={18} rx={3} stroke={color} strokeWidth={1.5} />
      <Path d="M3 9H21" stroke={color} strokeWidth={1.5} />
      <Path d="M8 2V5" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M16 2V5" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Circle cx={12} cy={15} r={2} fill={color} fillOpacity={0.4} />
    </Svg>
  );
}

export function CollectionIcon({ size = 24, color = Colors.primary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={8} cy={8} r={3} fill={color} fillOpacity={0.3} stroke={color} strokeWidth={1.5} />
      <Circle cx={16} cy={8} r={3} fill={color} fillOpacity={0.3} stroke={color} strokeWidth={1.5} />
      <Circle cx={8} cy={16} r={3} fill={color} fillOpacity={0.3} stroke={color} strokeWidth={1.5} />
      <Circle cx={16} cy={16} r={3} fill={color} fillOpacity={0.3} stroke={color} strokeWidth={1.5} />
    </Svg>
  );
}

export function SettingsIcon({ size = 24, color = Colors.primary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={3} stroke={color} strokeWidth={1.5} />
      <Path d="M12 2V5M12 19V22M2 12H5M19 12H22M4.9 4.9L7.1 7.1M16.9 16.9L19.1 19.1M19.1 4.9L16.9 7.1M7.1 16.9L4.9 19.1" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

// --- Category icons (replace emojis) ---

export function HomeIcon({ size = 28, color = Colors.category.familia }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 10.5L12 3L21 10.5V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V10.5Z" fill={color} fillOpacity={0.25} stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
      <Path d="M9 21V14H15V21" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
    </Svg>
  );
}

export function HeartIcon({ size = 28, color = Colors.category.salud }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 21C12 21 3 13.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 12 5.09C12.09 3.81 13.76 3 15.5 3C18.58 3 21 5.42 21 8.5C21 13.5 12 21 12 21Z" fill={color} fillOpacity={0.25} stroke={color} strokeWidth={1.5} />
    </Svg>
  );
}

export function BriefcaseIcon({ size = 28, color = Colors.category.trabajo }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={2} y={7} width={20} height={14} rx={2} fill={color} fillOpacity={0.25} stroke={color} strokeWidth={1.5} />
      <Path d="M16 7V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V7" stroke={color} strokeWidth={1.5} />
      <Path d="M2 12H22" stroke={color} strokeWidth={1.5} />
    </Svg>
  );
}

export function PeopleIcon({ size = 28, color = Colors.category.amigos }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={9} cy={7} r={3} fill={color} fillOpacity={0.25} stroke={color} strokeWidth={1.5} />
      <Path d="M3 20C3 16.6863 5.68629 14 9 14C12.3137 14 15 16.6863 15 20" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Circle cx={17} cy={8} r={2.5} fill={color} fillOpacity={0.15} stroke={color} strokeWidth={1.5} />
      <Path d="M17 14C19.2091 14 21 15.7909 21 18" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

export function LeafIcon({ size = 28, color = Colors.category.naturaleza }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 21C12 21 4 16 4 9C4 5 8 2 12 2C16 2 20 5 20 9C20 16 12 21 12 21Z" fill={color} fillOpacity={0.25} stroke={color} strokeWidth={1.5} />
      <Path d="M12 21V9" stroke={color} strokeWidth={1.5} />
      <Path d="M8 13L12 9L16 13" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function CupIcon({ size = 28, color = Colors.category.comida }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 6H17V14C17 17.3137 14.3137 20 11 20C7.68629 20 5 17.3137 5 14V6Z" fill={color} fillOpacity={0.25} stroke={color} strokeWidth={1.5} />
      <Path d="M17 9H19C20.1046 9 21 9.89543 21 11C21 12.1046 20.1046 13 19 13H17" stroke={color} strokeWidth={1.5} />
      <Path d="M8 3V5M11 2V5M14 3V5" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

export function MoonIcon({ size = 28, color = Colors.category.descanso }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79Z" fill={color} fillOpacity={0.25} stroke={color} strokeWidth={1.5} />
    </Svg>
  );
}

export function FlowerIcon({ size = 28, color = Colors.category.amor }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={3} fill={color} fillOpacity={0.5} stroke={color} strokeWidth={1.2} />
      <Circle cx={12} cy={7} r={2.5} fill={color} fillOpacity={0.2} stroke={color} strokeWidth={1} />
      <Circle cx={16.5} cy={9.5} r={2.5} fill={color} fillOpacity={0.2} stroke={color} strokeWidth={1} />
      <Circle cx={16.5} cy={14.5} r={2.5} fill={color} fillOpacity={0.2} stroke={color} strokeWidth={1} />
      <Circle cx={12} cy={17} r={2.5} fill={color} fillOpacity={0.2} stroke={color} strokeWidth={1} />
      <Circle cx={7.5} cy={14.5} r={2.5} fill={color} fillOpacity={0.2} stroke={color} strokeWidth={1} />
      <Circle cx={7.5} cy={9.5} r={2.5} fill={color} fillOpacity={0.2} stroke={color} strokeWidth={1} />
    </Svg>
  );
}

export function SparkleIcon({ size = 28, color = Colors.category.yoMisma }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill={color} fillOpacity={0.3} stroke={color} strokeWidth={1.2} strokeLinejoin="round" />
      <Path d="M18 14L19 17L22 18L19 19L18 22L17 19L14 18L17 17L18 14Z" fill={color} fillOpacity={0.2} stroke={color} strokeWidth={1} strokeLinejoin="round" />
    </Svg>
  );
}

export function ShareIcon({ size = 20, color = '#7D9B76' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L12 15M12 2L8 6M12 2L16 6" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M4 14V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V14" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// --- Garden screen icons ---

export function SoundOnIcon({ size = 16, color = Colors.primary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M11 5L6 9H2V15H6L11 19V5Z" fill={color} fillOpacity={0.3} stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
      <Path d="M15.5 8.5C16.5 9.5 17 10.7 17 12C17 13.3 16.5 14.5 15.5 15.5" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

export function SoundOffIcon({ size = 16, color = Colors.textLight }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M11 5L6 9H2V15H6L11 19V5Z" fill={color} fillOpacity={0.3} stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
      <Line x1={17} y1={9} x2={21} y2={15} stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Line x1={21} y1={9} x2={17} y2={15} stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

export function StreakIcon({ size = 18 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="#F59E0B" fillOpacity={0.5} stroke="#F59E0B" strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
    </Svg>
  );
}

// --- Paywall icons ---

export function PaletteIcon({ size = 18 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={10} stroke={Colors.secondary} strokeWidth={1.5} />
      <Circle cx={8} cy={10} r={2} fill={Colors.accent} />
      <Circle cx={14} cy={8} r={2} fill={Colors.primary} />
      <Circle cx={16} cy={14} r={2} fill={Colors.secondary} />
    </Svg>
  );
}

export function MusicIcon({ size = 18 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 18V5L21 3V16" stroke={Colors.primary} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={6} cy={18} r={3} fill={Colors.primary} fillOpacity={0.3} stroke={Colors.primary} strokeWidth={1.5} />
      <Circle cx={18} cy={16} r={3} fill={Colors.primary} fillOpacity={0.3} stroke={Colors.primary} strokeWidth={1.5} />
    </Svg>
  );
}

export function ChartIcon({ size = 18 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={12} width={4} height={9} rx={1} fill={Colors.primary} fillOpacity={0.3} stroke={Colors.primary} strokeWidth={1.5} />
      <Rect x={10} y={7} width={4} height={14} rx={1} fill={Colors.primary} fillOpacity={0.3} stroke={Colors.primary} strokeWidth={1.5} />
      <Rect x={17} y={3} width={4} height={18} rx={1} fill={Colors.primary} fillOpacity={0.3} stroke={Colors.primary} strokeWidth={1.5} />
    </Svg>
  );
}

export function NoAdsIcon({ size = 18 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={10} stroke={Colors.textLight} strokeWidth={1.5} />
      <Path d="M4 4L20 20" stroke={Colors.textLight} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

// --- Settings icons ---

export function SoundIcon({ size = 20, color = Colors.primary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M11 5L6 9H2V15H6L11 19V5Z" fill={color} fillOpacity={0.3} stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
      <Path d="M15.5 8.5C16.5 9.5 17 10.7 17 12C17 13.3 16.5 14.5 15.5 15.5" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

export function BellIcon({ size = 20, color = Colors.primary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M18 8A6 6 0 006 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" fill={color} fillOpacity={0.3} stroke={color} strokeWidth={1.5} />
      <Path d="M13.73 21A2 2 0 0110.27 21" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

export function StarIcon({ size = 20, color = Colors.secondary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill={color} fillOpacity={0.4} stroke={color} strokeWidth={1.2} strokeLinejoin="round" />
    </Svg>
  );
}

export function InfoIcon({ size = 20, color = Colors.textLight }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth={1.5} />
      <Path d="M12 16V12M12 8H12.01" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

// --- Ad reward icon ---

export function GiftIcon({ size = 20, color = Colors.accent }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={10} width={18} height={12} rx={2} fill={color} fillOpacity={0.25} stroke={color} strokeWidth={1.5} />
      <Path d="M12 10V22" stroke={color} strokeWidth={1.5} />
      <Rect x={2} y={7} width={20} height={4} rx={1} fill={color} fillOpacity={0.15} stroke={color} strokeWidth={1.5} />
      <Path d="M12 7C12 7 9 4 7 4C5.5 4 5 5.5 6 6.5C7 7.5 12 7 12 7Z" fill={color} fillOpacity={0.3} stroke={color} strokeWidth={1.2} />
      <Path d="M12 7C12 7 15 4 17 4C18.5 4 19 5.5 18 6.5C17 7.5 12 7 12 7Z" fill={color} fillOpacity={0.3} stroke={color} strokeWidth={1.2} />
    </Svg>
  );
}

// Map category ID to icon component
export const CATEGORY_ICONS: Record<string, (props: IconProps) => React.ReactElement> = {
  familia: HomeIcon,
  salud: HeartIcon,
  trabajo: BriefcaseIcon,
  amigos: PeopleIcon,
  naturaleza: LeafIcon,
  comida: CupIcon,
  descanso: MoonIcon,
  amor: FlowerIcon,
  yoMisma: SparkleIcon,
};
