import React from 'react';
import Svg, { Path, Circle, Ellipse, Rect, Line, G } from 'react-native-svg';
import type { PlantStage } from '../../constants/Plants';

interface PlantSVGProps {
  plantId: string;
  stage: PlantStage;
  size?: number;
}

// ─── Shared elements ───────────────────────────────────────

function Soil({ color = '#8B7355' }: { color?: string }) {
  return <Ellipse cx="32" cy="54" rx="20" ry="4" fill={color} opacity={0.3} />;
}

function Stem({ x = 32, y1 = 54, y2 = 30, color = '#7D9B76', width = 2.5 }: { x?: number; y1?: number; y2?: number; color?: string; width?: number }) {
  return <Path d={`M${x} ${y1} L${x} ${y2}`} stroke={color} strokeWidth={width} strokeLinecap="round" />;
}

function LeafLeft({ y = 42, color = '#7D9B76' }: { y?: number; color?: string }) {
  return <Path d={`M32 ${y} Q22 ${y - 6} 20 ${y - 2} Q22 ${y + 2} 32 ${y}Z`} fill={color} />;
}

function LeafRight({ y = 38, color = '#A8C5A0' }: { y?: number; color?: string }) {
  return <Path d={`M32 ${y} Q42 ${y - 6} 44 ${y - 2} Q42 ${y + 2} 32 ${y}Z`} fill={color} />;
}

// ─── Generic seed (reused across plants) ───────────────────

function GenericSeed({ bodyColor = '#8B6F4E', highlightColor = '#A0845C', crackColor = '#6B5740' }: { bodyColor?: string; highlightColor?: string; crackColor?: string }) {
  return (
    <G>
      <Soil />
      <Ellipse cx="32" cy="40" rx="8" ry="10" fill={bodyColor} />
      <Ellipse cx="32" cy="38" rx="6" ry="7" fill={highlightColor} opacity={0.5} />
      <Path d="M32 32 L33 36 L31 40 L32 44" stroke={crackColor} strokeWidth={1} fill="none" strokeLinecap="round" />
      <Ellipse cx="29" cy="36" rx="2" ry="3" fill="white" opacity={0.15} />
    </G>
  );
}

// ─── Generic sprout ────────────────────────────────────────

function GenericSprout({ stemColor = '#7D9B76', leafColor1 = '#7D9B76', leafColor2 = '#A8C5A0', tipColor = '#A8C5A0' }: { stemColor?: string; leafColor1?: string; leafColor2?: string; tipColor?: string }) {
  return (
    <G>
      <Soil />
      <Stem color={stemColor} y2={30} />
      <LeafLeft y={42} color={leafColor1} />
      <LeafRight y={38} color={leafColor2} />
      <Ellipse cx="32" cy="28" rx="3" ry="4" fill={tipColor} />
      <Ellipse cx="32" cy="27" rx="2" ry="2.5" fill={tipColor} opacity={0.6} />
    </G>
  );
}

// ═══════════════════════════════════════════════════════════
// PLANT RENDERERS
// ═══════════════════════════════════════════════════════════

// ─── 1. Margarita (Daisy) ──────────────────────────────────

function MargaritaSeed() { return <GenericSeed />; }
function MargaritaSprout() { return <GenericSprout />; }

function MargaritaBud() {
  return (
    <G>
      <Soil />
      <Stem y2={26} />
      <LeafLeft y={46} />
      <LeafRight y={40} color="#A8C5A0" />
      <Path d="M28 26 Q30 18 32 16 Q34 18 36 26Z" fill="#7D9B76" />
      <Path d="M26 28 Q28 20 32 16 Q28 22 26 28Z" fill="#6B8A64" opacity={0.5} />
      <Ellipse cx="32" cy="18" rx="3" ry="2" fill="#F4C430" opacity={0.6} />
    </G>
  );
}

function MargaritaFlower() {
  return (
    <G>
      <Soil />
      <Stem y2={30} />
      <LeafLeft y={48} />
      <LeafRight y={42} color="#A8C5A0" />
      {/* 8 full round petals */}
      <Circle cx="32" cy="13" r="5" fill="#FFF8E7" opacity={0.9} />
      <Circle cx="38.5" cy="15.5" r="5" fill="#FFF8E7" opacity={0.9} />
      <Circle cx="40" cy="22" r="5" fill="#FFEFD5" opacity={0.85} />
      <Circle cx="38.5" cy="28.5" r="5" fill="#FFF8E7" opacity={0.9} />
      <Circle cx="32" cy="31" r="5" fill="#FFEFD5" opacity={0.85} />
      <Circle cx="25.5" cy="28.5" r="5" fill="#FFF8E7" opacity={0.9} />
      <Circle cx="24" cy="22" r="5" fill="#FFEFD5" opacity={0.85} />
      <Circle cx="25.5" cy="15.5" r="5" fill="#FFF8E7" opacity={0.9} />
      {/* Center */}
      <Circle cx="32" cy="22" r="5.5" fill="#F4C430" />
      <Circle cx="32" cy="22" r="3.5" fill="#E8B820" opacity={0.6} />
      <Circle cx="30" cy="20.5" r="1" fill="#FFF8E7" opacity={0.3} />
    </G>
  );
}

// ─── 2. Aloe Vera ──────────────────────────────────────────

function AloeSeed() { return <GenericSeed bodyColor="#5B6B4E" highlightColor="#6B7B5E" crackColor="#4A5A3E" />; }
function AloeSprout() { return <GenericSprout stemColor="#5B8C5A" leafColor1="#5B8C5A" leafColor2="#7BAA78" tipColor="#7BAA78" />; }

function AloeBud() {
  return (
    <G>
      <Soil />
      {/* Thick aloe leaves growing from base */}
      <Path d="M32 54 Q26 40 22 28 Q24 26 28 30 Q30 42 32 54Z" fill="#5B8C5A" />
      <Path d="M32 54 Q38 40 42 28 Q40 26 36 30 Q34 42 32 54Z" fill="#6B9C6A" />
      <Path d="M32 54 Q30 38 30 24 Q32 22 34 24 Q34 38 32 54Z" fill="#7BAA78" />
      {/* Speckles */}
      <Circle cx="28" cy="36" r="0.8" fill="#A8C5A0" opacity={0.5} />
      <Circle cx="36" cy="34" r="0.8" fill="#A8C5A0" opacity={0.5} />
      <Circle cx="32" cy="30" r="0.8" fill="#A8C5A0" opacity={0.5} />
    </G>
  );
}

function AloeFlower() {
  return (
    <G>
      <Soil />
      {/* Full aloe rosette */}
      <Path d="M32 54 Q22 38 16 24 Q18 22 22 26 Q28 40 32 54Z" fill="#5B8C5A" />
      <Path d="M32 54 Q42 38 48 24 Q46 22 42 26 Q36 40 32 54Z" fill="#5B8C5A" />
      <Path d="M32 54 Q26 36 24 20 Q26 18 28 22 Q30 38 32 54Z" fill="#6B9C6A" />
      <Path d="M32 54 Q38 36 40 20 Q38 18 36 22 Q34 38 32 54Z" fill="#6B9C6A" />
      <Path d="M32 54 Q30 34 30 16 Q32 14 34 16 Q34 34 32 54Z" fill="#7BAA78" />
      {/* Gel highlight */}
      <Path d="M30 28 L30 40" stroke="#A8D5A0" strokeWidth={1} opacity={0.3} strokeLinecap="round" />
      <Path d="M34 26 L34 38" stroke="#A8D5A0" strokeWidth={1} opacity={0.3} strokeLinecap="round" />
      {/* Flower stalk */}
      <Path d="M32 18 L32 8" stroke="#7BAA78" strokeWidth={1.5} strokeLinecap="round" />
      <Circle cx="32" cy="6" r="2.5" fill="#FF8C42" />
      <Circle cx="30" cy="9" r="1.5" fill="#FFB366" />
      <Circle cx="34" cy="9" r="1.5" fill="#FFB366" />
    </G>
  );
}

// ─── 3. Cactus ─────────────────────────────────────────────

function CactusSeed() { return <GenericSeed bodyColor="#5B6B4E" highlightColor="#6B7B5E" crackColor="#4A5A3E" />; }

function CactusSprout() {
  return (
    <G>
      <Soil />
      <Ellipse cx="32" cy="42" rx="8" ry="10" fill="#5B8C5A" />
      <Ellipse cx="32" cy="40" rx="6" ry="7" fill="#6B9C6A" opacity={0.4} />
      <Path d="M28 34 L28 50" stroke="#4A7B49" strokeWidth={0.6} opacity={0.5} />
      <Path d="M32 32 L32 50" stroke="#4A7B49" strokeWidth={0.6} opacity={0.5} />
      <Path d="M36 34 L36 50" stroke="#4A7B49" strokeWidth={0.6} opacity={0.5} />
      <Circle cx="28" cy="38" r="0.8" fill="#C8D5B0" />
      <Circle cx="36" cy="36" r="0.8" fill="#C8D5B0" />
      <Circle cx="32" cy="34" r="0.8" fill="#C8D5B0" />
    </G>
  );
}

function CactusBud() {
  return (
    <G>
      <Soil />
      <Rect x="24" y="28" width="16" height="26" rx="8" fill="#5B8C5A" />
      <Rect x="26" y="30" width="12" height="20" rx="6" fill="#6B9C6A" opacity={0.3} />
      <Path d="M24 40 Q18 38 18 34 Q18 30 22 32" stroke="#5B8C5A" strokeWidth={5} strokeLinecap="round" fill="none" />
      <Path d="M40 36 Q46 34 46 30 Q46 26 42 28" stroke="#5B8C5A" strokeWidth={5} strokeLinecap="round" fill="none" />
      <Path d="M29 30 L29 52" stroke="#4A7B49" strokeWidth={0.6} opacity={0.4} />
      <Path d="M32 28 L32 54" stroke="#4A7B49" strokeWidth={0.6} opacity={0.4} />
      <Path d="M35 30 L35 52" stroke="#4A7B49" strokeWidth={0.6} opacity={0.4} />
      <Line x1="24" y1="34" x2="22" y2="33" stroke="#C8D5B0" strokeWidth={1} strokeLinecap="round" />
      <Line x1="40" y1="38" x2="42" y2="37" stroke="#C8D5B0" strokeWidth={1} strokeLinecap="round" />
      <Ellipse cx="32" cy="28" rx="4" ry="3" fill="#FF8FAB" opacity={0.5} />
    </G>
  );
}

function CactusFlower() {
  return (
    <G>
      <Soil />
      <Rect x="24" y="28" width="16" height="26" rx="8" fill="#5B8C5A" />
      <Rect x="26" y="30" width="12" height="20" rx="6" fill="#6B9C6A" opacity={0.3} />
      <Path d="M24 40 Q18 38 18 34 Q18 30 22 32" stroke="#5B8C5A" strokeWidth={5} strokeLinecap="round" fill="none" />
      <Path d="M40 36 Q46 34 46 30 Q46 26 42 28" stroke="#5B8C5A" strokeWidth={5} strokeLinecap="round" fill="none" />
      <Path d="M29 30 L29 52" stroke="#4A7B49" strokeWidth={0.6} opacity={0.4} />
      <Path d="M32 28 L32 54" stroke="#4A7B49" strokeWidth={0.6} opacity={0.4} />
      <Path d="M35 30 L35 52" stroke="#4A7B49" strokeWidth={0.6} opacity={0.4} />
      <Line x1="24" y1="34" x2="22" y2="33" stroke="#C8D5B0" strokeWidth={1} strokeLinecap="round" />
      <Line x1="40" y1="38" x2="42" y2="37" stroke="#C8D5B0" strokeWidth={1} strokeLinecap="round" />
      {/* Pink flower on top */}
      <Ellipse cx="32" cy="22" rx="3.5" ry="5" fill="#FF8FAB" />
      <Ellipse cx="28" cy="24" rx="3.5" ry="5" fill="#FFB3C6" rotation={-30} origin="28,24" />
      <Ellipse cx="36" cy="24" rx="3.5" ry="5" fill="#FFB3C6" rotation={30} origin="36,24" />
      <Circle cx="32" cy="24" r="2.5" fill="#FFD700" />
      <Circle cx="31" cy="23" r="0.8" fill="white" opacity={0.3} />
    </G>
  );
}

// ─── 4. Girasol (Sunflower) ────────────────────────────────

function GirasolSeed() { return <GenericSeed bodyColor="#8B7B4E" highlightColor="#A0905C" crackColor="#6B6040" />; }
function GirasolSprout() { return <GenericSprout leafColor1="#6B9B56" leafColor2="#8CB878" tipColor="#C4D84A" />; }

function GirasolBud() {
  return (
    <G>
      <Soil />
      <Stem y2={22} color="#6B8A54" width={3} />
      <LeafLeft y={46} color="#6B9B56" />
      <LeafRight y={38} color="#8CB878" />
      {/* Closed bud */}
      <Path d="M28 24 Q30 14 32 12 Q34 14 36 24Z" fill="#7D9B56" />
      <Path d="M30 22 Q31 16 32 12 Q33 16 34 22Z" fill="#FFD700" opacity={0.4} />
    </G>
  );
}

function GirasolFlower() {
  return (
    <G>
      <Soil />
      <Stem y2={28} color="#6B8A54" width={3} />
      <LeafLeft y={48} color="#6B9B56" />
      <LeafRight y={42} color="#8CB878" />
      {/* Petals — golden yellow */}
      <Ellipse cx="32" cy="12" rx="3.5" ry="6" fill="#FFD700" />
      <Ellipse cx="38" cy="14" rx="3.5" ry="6" fill="#FFC300" rotation={45} origin="38,14" />
      <Ellipse cx="40" cy="20" rx="3.5" ry="6" fill="#FFD700" rotation={90} origin="40,20" />
      <Ellipse cx="38" cy="26" rx="3.5" ry="6" fill="#FFC300" rotation={135} origin="38,26" />
      <Ellipse cx="32" cy="28" rx="3.5" ry="6" fill="#FFD700" rotation={180} origin="32,28" />
      <Ellipse cx="26" cy="26" rx="3.5" ry="6" fill="#FFC300" rotation={225} origin="26,26" />
      <Ellipse cx="24" cy="20" rx="3.5" ry="6" fill="#FFD700" rotation={270} origin="24,20" />
      <Ellipse cx="26" cy="14" rx="3.5" ry="6" fill="#FFC300" rotation={315} origin="26,14" />
      {/* Brown center */}
      <Circle cx="32" cy="20" r="6" fill="#8B6914" />
      <Circle cx="32" cy="20" r="4" fill="#6B5210" opacity={0.5} />
      {/* Seeds pattern */}
      <Circle cx="30" cy="19" r="0.8" fill="#4A3A0A" opacity={0.4} />
      <Circle cx="34" cy="19" r="0.8" fill="#4A3A0A" opacity={0.4} />
      <Circle cx="32" cy="21" r="0.8" fill="#4A3A0A" opacity={0.4} />
    </G>
  );
}

// ─── 5. Helecho (Fern) ─────────────────────────────────────

function HelechoSeed() { return <GenericSeed bodyColor="#5B6B4E" highlightColor="#6B7B5E" crackColor="#4A5A3E" />; }
function HelechoSprout() {
  return (
    <G>
      <Soil />
      <Stem y2={28} color="#4A7B49" />
      {/* Curled fiddlehead */}
      <Path d="M32 28 Q34 24 36 24 Q38 24 38 26 Q38 28 36 28 Q34 28 34 26" stroke="#5B8C5A" strokeWidth={2.5} fill="none" strokeLinecap="round" />
    </G>
  );
}

function HelechoBud() {
  return (
    <G>
      <Soil />
      <Stem y2={24} color="#4A7B49" />
      {/* Unfurling fronds */}
      <Path d="M32 24 Q26 20 22 22 Q20 24 22 26 Q26 28 32 24" fill="#5B8C5A" />
      <Path d="M32 24 Q38 20 42 22 Q44 24 42 26 Q38 28 32 24" fill="#6B9C6A" />
      {/* Small leaflets */}
      <Path d="M24 22 L22 20" stroke="#5B8C5A" strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M26 21 L24 18" stroke="#6B9C6A" strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M40 22 L42 20" stroke="#5B8C5A" strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M38 21 L40 18" stroke="#6B9C6A" strokeWidth={1.5} strokeLinecap="round" />
    </G>
  );
}

function HelechoFlower() {
  return (
    <G>
      <Soil />
      <Stem y2={22} color="#4A7B49" />
      {/* Full fern fronds */}
      <Path d="M32 22 Q20 14 14 18" stroke="#5B8C5A" strokeWidth={2} fill="none" strokeLinecap="round" />
      <Path d="M32 22 Q44 14 50 18" stroke="#5B8C5A" strokeWidth={2} fill="none" strokeLinecap="round" />
      <Path d="M32 22 Q22 10 18 12" stroke="#6B9C6A" strokeWidth={2} fill="none" strokeLinecap="round" />
      <Path d="M32 22 Q42 10 46 12" stroke="#6B9C6A" strokeWidth={2} fill="none" strokeLinecap="round" />
      {/* Leaflets on fronds */}
      <Path d="M24 16 Q22 14 20 15" stroke="#5B8C5A" strokeWidth={1.5} strokeLinecap="round" fill="none" />
      <Path d="M28 14 Q26 12 24 13" stroke="#6B9C6A" strokeWidth={1.5} strokeLinecap="round" fill="none" />
      <Path d="M40 16 Q42 14 44 15" stroke="#5B8C5A" strokeWidth={1.5} strokeLinecap="round" fill="none" />
      <Path d="M36 14 Q38 12 40 13" stroke="#6B9C6A" strokeWidth={1.5} strokeLinecap="round" fill="none" />
      {/* Center new frond */}
      <Path d="M32 22 Q32 12 32 8" stroke="#7BAA78" strokeWidth={2} strokeLinecap="round" />
      <Path d="M32 12 Q30 10 28 11" stroke="#7BAA78" strokeWidth={1.2} strokeLinecap="round" fill="none" />
      <Path d="M32 12 Q34 10 36 11" stroke="#7BAA78" strokeWidth={1.2} strokeLinecap="round" fill="none" />
    </G>
  );
}

// ─── 6. Frutilla (Strawberry) ──────────────────────────────

function FrutillaSeed() { return <GenericSeed />; }
function FrutillaSprout() { return <GenericSprout tipColor="#C8E6C0" />; }

function FrutillaBud() {
  return (
    <G>
      <Soil />
      <Stem y2={26} color="#6B8A64" />
      <LeafLeft y={46} />
      <LeafRight y={40} color="#A8C5A0" />
      {/* White flower */}
      <Circle cx="32" cy="18" r="3.5" fill="#FFFFFF" opacity={0.9} />
      <Circle cx="28" cy="20" r="3.5" fill="#FFFFFF" opacity={0.8} />
      <Circle cx="36" cy="20" r="3.5" fill="#FFFFFF" opacity={0.8} />
      <Circle cx="30" cy="24" r="3.5" fill="#FFF8F0" opacity={0.8} />
      <Circle cx="34" cy="24" r="3.5" fill="#FFF8F0" opacity={0.8} />
      <Circle cx="32" cy="21" r="2.5" fill="#F4E04D" />
    </G>
  );
}

function FrutillaFlower() {
  return (
    <G>
      <Soil />
      <Stem y2={24} color="#6B8A64" />
      <LeafLeft y={48} />
      <LeafRight y={42} color="#A8C5A0" />
      {/* Green crown */}
      <Path d="M26 18 Q28 14 32 16 Q36 14 38 18 L32 20Z" fill="#5B8C5A" />
      {/* Strawberry body */}
      <Path d="M26 20 Q24 28 28 34 Q30 36 32 36 Q34 36 36 34 Q40 28 38 20Z" fill="#DC3545" />
      <Path d="M28 22 Q26 28 28 32" stroke="#C82333" strokeWidth={0.5} opacity={0.3} fill="none" />
      {/* Seeds */}
      <Circle cx="30" cy="24" r="0.6" fill="#F4E04D" />
      <Circle cx="34" cy="24" r="0.6" fill="#F4E04D" />
      <Circle cx="32" cy="28" r="0.6" fill="#F4E04D" />
      <Circle cx="29" cy="30" r="0.6" fill="#F4E04D" />
      <Circle cx="35" cy="30" r="0.6" fill="#F4E04D" />
      {/* Shine */}
      <Ellipse cx="29" cy="23" rx="1.5" ry="2.5" fill="white" opacity={0.15} />
    </G>
  );
}

// ─── 7. Lavanda (Lavender) ─────────────────────────────────

function LavandaSeed() { return <GenericSeed bodyColor="#7B6B8E" highlightColor="#8E7BA0" crackColor="#6B5B7E" />; }
function LavandaSprout() { return <GenericSprout stemColor="#6B8A64" tipColor="#9B7DDB" />; }

function LavandaBud() {
  return (
    <G>
      <Soil />
      <Stem y2={20} color="#6B8A64" />
      <LeafLeft y={48} color="#7D9B76" />
      <LeafRight y={42} color="#A8C5A0" />
      {/* Lavender buds on stalk */}
      <Circle cx="32" cy="18" r="2" fill="#9B7DDB" />
      <Circle cx="32" cy="14" r="2" fill="#B794E8" />
      <Circle cx="32" cy="10" r="1.5" fill="#C9A8F0" />
    </G>
  );
}

function LavandaFlower() {
  return (
    <G>
      <Soil />
      {/* Multiple stalks */}
      <Path d="M28 54 L28 18" stroke="#6B8A64" strokeWidth={2} strokeLinecap="round" />
      <Path d="M32 54 L32 14" stroke="#6B8A64" strokeWidth={2} strokeLinecap="round" />
      <Path d="M36 54 L36 16" stroke="#6B8A64" strokeWidth={2} strokeLinecap="round" />
      {/* Leaves */}
      <Path d="M28 44 Q22 40 20 42 Q22 44 28 44Z" fill="#7D9B76" />
      <Path d="M36 42 Q42 38 44 40 Q42 42 36 42Z" fill="#A8C5A0" />
      {/* Left stalk flowers */}
      <Circle cx="28" cy="16" r="2" fill="#9B7DDB" />
      <Circle cx="28" cy="12" r="2" fill="#B794E8" />
      <Circle cx="28" cy="8" r="1.5" fill="#C9A8F0" />
      {/* Center stalk flowers */}
      <Circle cx="32" cy="12" r="2" fill="#9B7DDB" />
      <Circle cx="32" cy="8" r="2" fill="#B794E8" />
      <Circle cx="32" cy="4" r="1.5" fill="#C9A8F0" />
      {/* Right stalk flowers */}
      <Circle cx="36" cy="14" r="2" fill="#9B7DDB" />
      <Circle cx="36" cy="10" r="2" fill="#B794E8" />
      <Circle cx="36" cy="6" r="1.5" fill="#C9A8F0" />
    </G>
  );
}

// ─── 8. Rosa (Rose) — PASSION RED ──────────────────────────

function RosaSeed() { return <GenericSeed bodyColor="#8B4E5B" highlightColor="#9B5E6B" crackColor="#7B3E4B" />; }

function RosaSprout() {
  return (
    <G>
      <Soil />
      <Stem y2={30} color="#6B8A64" />
      <Line x1="32" y1="44" x2="30" y2="42" stroke="#6B8A64" strokeWidth={1.5} strokeLinecap="round" />
      <LeafLeft y={40} />
      <LeafRight y={34} color="#A8C5A0" />
      <Ellipse cx="32" cy="28" rx="3" ry="4" fill="#C41E3A" />
      <Ellipse cx="32" cy="27" rx="2" ry="2.5" fill="#D63050" opacity={0.5} />
    </G>
  );
}

function RosaBud() {
  return (
    <G>
      <Soil />
      <Stem y2={28} color="#6B8A64" />
      <Line x1="32" y1="46" x2="29" y2="44" stroke="#6B8A64" strokeWidth={1.5} strokeLinecap="round" />
      <Line x1="32" y1="38" x2="35" y2="36" stroke="#6B8A64" strokeWidth={1.5} strokeLinecap="round" />
      <LeafLeft y={48} />
      <LeafRight y={40} color="#A8C5A0" />
      {/* Closed bud — deep red */}
      <Path d="M28 28 Q30 16 32 14 Q34 16 36 28Z" fill="#C41E3A" />
      <Path d="M30 28 Q31 20 32 14 Q33 20 34 28Z" fill="#A01830" opacity={0.5} />
      {/* Sepals */}
      <Path d="M28 28 Q26 26 27 24" stroke="#6B8A64" strokeWidth={1.5} fill="none" strokeLinecap="round" />
      <Path d="M36 28 Q38 26 37 24" stroke="#6B8A64" strokeWidth={1.5} fill="none" strokeLinecap="round" />
    </G>
  );
}

function RosaFlower() {
  return (
    <G>
      <Soil />
      <Stem y2={30} color="#6B8A64" />
      <Line x1="32" y1="48" x2="29" y2="46" stroke="#6B8A64" strokeWidth={1.5} strokeLinecap="round" />
      <Line x1="32" y1="40" x2="35" y2="38" stroke="#6B8A64" strokeWidth={1.5} strokeLinecap="round" />
      <LeafLeft y={50} />
      <LeafRight y={42} color="#A8C5A0" />
      {/* Outer petals — passion red */}
      <Ellipse cx="26" cy="22" rx="5" ry="7" fill="#C41E3A" rotation={-20} origin="26,22" />
      <Ellipse cx="38" cy="22" rx="5" ry="7" fill="#C41E3A" rotation={20} origin="38,22" />
      <Ellipse cx="32" cy="16" rx="5" ry="6" fill="#D63050" />
      <Ellipse cx="28" cy="26" rx="5" ry="5" fill="#D63050" rotation={-10} origin="28,26" />
      <Ellipse cx="36" cy="26" rx="5" ry="5" fill="#D63050" rotation={10} origin="36,26" />
      {/* Inner petals */}
      <Ellipse cx="30" cy="20" rx="3.5" ry="5" fill="#A01830" rotation={-15} origin="30,20" />
      <Ellipse cx="34" cy="20" rx="3.5" ry="5" fill="#A01830" rotation={15} origin="34,20" />
      <Ellipse cx="32" cy="18" rx="3" ry="4" fill="#8B1025" />
      {/* Center spiral */}
      <Circle cx="32" cy="21" r="3" fill="#7A0D20" />
      <Path d="M31 20 Q32 18 33 20 Q34 22 32 22 Q30 22 31 20Z" fill="#5A0815" opacity={0.6} />
      <Circle cx="30" cy="18" r="1" fill="white" opacity={0.15} />
    </G>
  );
}

// ─── 9. Tulipán (Tulip) ────────────────────────────────────

function TulipanSeed() { return <GenericSeed bodyColor="#8B6B7E" highlightColor="#A07B90" crackColor="#7B5B6E" />; }
function TulipanSprout() { return <GenericSprout tipColor="#E066A0" />; }

function TulipanBud() {
  return (
    <G>
      <Soil />
      <Stem y2={24} color="#6B8A64" />
      <LeafLeft y={48} />
      <LeafRight y={40} color="#A8C5A0" />
      <Path d="M28 24 Q30 14 32 12 Q34 14 36 24Z" fill="#E066A0" />
      <Path d="M30 24 Q31 16 32 12 Q33 16 34 24Z" fill="#CC4D87" opacity={0.4} />
    </G>
  );
}

function TulipanFlower() {
  return (
    <G>
      <Soil />
      <Stem y2={30} color="#6B8A64" />
      <LeafLeft y={48} />
      <LeafRight y={42} color="#A8C5A0" />
      {/* Tulip petals */}
      <Path d="M24 28 Q22 18 26 12 Q28 10 30 12 L30 28Z" fill="#E066A0" />
      <Path d="M40 28 Q42 18 38 12 Q36 10 34 12 L34 28Z" fill="#E066A0" />
      <Path d="M28 28 Q28 16 32 10 Q36 16 36 28Z" fill="#CC4D87" />
      {/* Light streak */}
      <Path d="M30 26 Q30 18 32 12" stroke="#F0A0C0" strokeWidth={1} fill="none" opacity={0.4} strokeLinecap="round" />
      {/* Stamen */}
      <Ellipse cx="32" cy="26" rx="2" ry="1.5" fill="#F4E04D" opacity={0.6} />
    </G>
  );
}

// ─── 10. Cerezo (Cherry Blossom) — PREMIUM ─────────────────

function CerezoSeed() { return <GenericSeed bodyColor="#7B5B4E" highlightColor="#8B6B5E" crackColor="#6B4B3E" />; }
function CerezoSprout() { return <GenericSprout stemColor="#8B6B5E" leafColor1="#7D9B76" tipColor="#FFB7C5" />; }

function CerezoBud() {
  return (
    <G>
      <Soil />
      {/* Branch */}
      <Path d="M20 54 Q24 40 32 30" stroke="#8B6B5E" strokeWidth={3} fill="none" strokeLinecap="round" />
      <Path d="M32 30 Q36 24 40 22" stroke="#8B6B5E" strokeWidth={2} fill="none" strokeLinecap="round" />
      {/* Small buds */}
      <Circle cx="36" cy="24" r="2.5" fill="#FFB7C5" />
      <Circle cx="40" cy="22" r="2" fill="#FFC8D6" />
      <Circle cx="32" cy="30" r="2" fill="#FFB7C5" />
    </G>
  );
}

function CerezoFlower() {
  return (
    <G>
      <Soil />
      {/* Branch */}
      <Path d="M18 54 Q22 38 32 26" stroke="#8B6B5E" strokeWidth={3} fill="none" strokeLinecap="round" />
      <Path d="M32 26 Q38 20 44 18" stroke="#8B6B5E" strokeWidth={2} fill="none" strokeLinecap="round" />
      <Path d="M32 26 Q26 18 24 14" stroke="#8B6B5E" strokeWidth={2} fill="none" strokeLinecap="round" />
      {/* Cherry blossoms — cluster */}
      <Circle cx="38" cy="16" r="3.5" fill="#FFB7C5" opacity={0.9} />
      <Circle cx="42" cy="18" r="3" fill="#FFC8D6" opacity={0.85} />
      <Circle cx="40" cy="13" r="3" fill="#FFD4E0" opacity={0.85} />
      <Circle cx="26" cy="14" r="3.5" fill="#FFB7C5" opacity={0.9} />
      <Circle cx="22" cy="12" r="3" fill="#FFC8D6" opacity={0.85} />
      <Circle cx="32" cy="22" r="3.5" fill="#FFB7C5" opacity={0.9} />
      {/* Centers */}
      <Circle cx="38" cy="16" r="1.2" fill="#FF8FAB" />
      <Circle cx="26" cy="14" r="1.2" fill="#FF8FAB" />
      <Circle cx="32" cy="22" r="1.2" fill="#FF8FAB" />
      {/* Falling petal */}
      <Ellipse cx="34" cy="36" rx="2" ry="1.2" fill="#FFD4E0" opacity={0.5} rotation={30} origin="34,36" />
    </G>
  );
}

// ─── 11. Bonsái — PREMIUM ──────────────────────────────────

function BonsaiSeed() { return <GenericSeed bodyColor="#6B5B4E" highlightColor="#7B6B5E" crackColor="#5B4B3E" />; }
function BonsaiSprout() { return <GenericSprout stemColor="#8B6B4E" leafColor1="#5B8C5A" leafColor2="#7BAA78" tipColor="#6B9C6A" />; }

function BonsaiBud() {
  return (
    <G>
      <Soil />
      {/* Pot */}
      <Path d="M22 50 L26 54 L38 54 L42 50 L22 50Z" fill="#A0845C" />
      <Rect x="22" y="48" width="20" height="3" rx="1" fill="#B8956A" />
      {/* Trunk */}
      <Path d="M32 48 Q30 38 28 32 Q26 28 28 26" stroke="#8B6B4E" strokeWidth={3} fill="none" strokeLinecap="round" />
      {/* Small crown */}
      <Circle cx="28" cy="24" r="6" fill="#5B8C5A" opacity={0.8} />
      <Circle cx="28" cy="22" r="4" fill="#6B9C6A" opacity={0.5} />
    </G>
  );
}

function BonsaiFlower() {
  return (
    <G>
      <Soil />
      {/* Pot */}
      <Path d="M22 50 L26 54 L38 54 L42 50 L22 50Z" fill="#A0845C" />
      <Rect x="22" y="48" width="20" height="3" rx="1" fill="#B8956A" />
      {/* Trunk — curved bonsai style */}
      <Path d="M32 48 Q28 40 26 34 Q24 28 26 24" stroke="#8B6B4E" strokeWidth={3.5} fill="none" strokeLinecap="round" />
      <Path d="M26 30 Q22 28 20 30" stroke="#8B6B4E" strokeWidth={2} fill="none" strokeLinecap="round" />
      {/* Crown layers */}
      <Ellipse cx="26" cy="20" rx="10" ry="6" fill="#5B8C5A" opacity={0.8} />
      <Ellipse cx="22" cy="22" rx="6" ry="4" fill="#6B9C6A" opacity={0.7} />
      <Ellipse cx="30" cy="18" rx="6" ry="4" fill="#7BAA78" opacity={0.6} />
      <Ellipse cx="20" cy="28" rx="5" ry="3" fill="#5B8C5A" opacity={0.6} />
    </G>
  );
}

// ─── 12. Palmera (Palm Tree) — PREMIUM ─────────────────────

function PalmeraSeed() { return <GenericSeed bodyColor="#8B7B5E" highlightColor="#9B8B6E" crackColor="#7B6B4E" />; }
function PalmeraSprout() { return <GenericSprout stemColor="#A08B6E" tipColor="#6B9C6A" />; }

function PalmeraBud() {
  return (
    <G>
      <Soil />
      <Path d="M32 54 Q30 40 30 28" stroke="#A08B6E" strokeWidth={3.5} fill="none" strokeLinecap="round" />
      {/* Young fronds */}
      <Path d="M30 28 Q22 22 14 24" stroke="#5B8C5A" strokeWidth={2} fill="none" strokeLinecap="round" />
      <Path d="M30 28 Q38 22 46 24" stroke="#6B9C6A" strokeWidth={2} fill="none" strokeLinecap="round" />
      <Path d="M30 28 Q30 18 32 14" stroke="#7BAA78" strokeWidth={2} fill="none" strokeLinecap="round" />
    </G>
  );
}

function PalmeraFlower() {
  return (
    <G>
      <Soil />
      {/* Trunk — slight curve */}
      <Path d="M32 54 Q30 40 28 26" stroke="#A08B6E" strokeWidth={4} fill="none" strokeLinecap="round" />
      <Path d="M32 54 Q30 40 28 26" stroke="#B8A080" strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.3} />
      {/* Fronds */}
      <Path d="M28 26 Q16 18 8 22" stroke="#5B8C5A" strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <Path d="M28 26 Q40 18 52 22" stroke="#5B8C5A" strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <Path d="M28 26 Q18 14 12 16" stroke="#6B9C6A" strokeWidth={2} fill="none" strokeLinecap="round" />
      <Path d="M28 26 Q38 14 48 16" stroke="#6B9C6A" strokeWidth={2} fill="none" strokeLinecap="round" />
      <Path d="M28 26 Q26 14 28 8" stroke="#7BAA78" strokeWidth={2} fill="none" strokeLinecap="round" />
      <Path d="M28 26 Q30 14 32 8" stroke="#5B8C5A" strokeWidth={2} fill="none" strokeLinecap="round" />
      {/* Coconuts */}
      <Circle cx="26" cy="28" r="2.5" fill="#8B6B4E" />
      <Circle cx="30" cy="27" r="2.5" fill="#7B5B3E" />
    </G>
  );
}

// ─── 13. Orquídea (Orchid) — PREMIUM ───────────────────────

function OrquideaSeed() { return <GenericSeed bodyColor="#7B6B8E" highlightColor="#8B7BA0" crackColor="#6B5B7E" />; }
function OrquideaSprout() { return <GenericSprout stemColor="#6B8A64" tipColor="#9B59B6" />; }

function OrquideaBud() {
  return (
    <G>
      <Soil />
      <Stem y2={20} color="#6B8A64" />
      {/* Thick orchid leaves */}
      <Path d="M32 50 Q24 44 22 48 Q24 52 32 50Z" fill="#5B8C5A" />
      <Path d="M32 46 Q40 40 42 44 Q40 48 32 46Z" fill="#6B9C6A" />
      {/* Buds on stalk */}
      <Ellipse cx="32" cy="18" rx="3" ry="4" fill="#9B59B6" />
      <Ellipse cx="30" cy="14" rx="2.5" ry="3" fill="#B07DD6" />
    </G>
  );
}

function OrquideaFlower() {
  return (
    <G>
      <Soil />
      <Stem y2={22} color="#6B8A64" />
      <Path d="M32 50 Q22 44 20 48 Q22 52 32 50Z" fill="#5B8C5A" />
      <Path d="M32 46 Q42 40 44 44 Q42 48 32 46Z" fill="#6B9C6A" />
      {/* Orchid flower */}
      <Ellipse cx="32" cy="12" rx="6" ry="4" fill="#D4A0E8" />
      <Ellipse cx="26" cy="18" rx="4" ry="6" fill="#C88DE0" rotation={-20} origin="26,18" />
      <Ellipse cx="38" cy="18" rx="4" ry="6" fill="#C88DE0" rotation={20} origin="38,18" />
      <Ellipse cx="28" cy="24" rx="3" ry="4" fill="#D4A0E8" rotation={-10} origin="28,24" />
      <Ellipse cx="36" cy="24" rx="3" ry="4" fill="#D4A0E8" rotation={10} origin="36,24" />
      {/* Lip (labellum) */}
      <Ellipse cx="32" cy="20" rx="4" ry="3" fill="#9B59B6" />
      <Circle cx="32" cy="19" r="1.5" fill="#7B3B96" />
      {/* Spots */}
      <Circle cx="30" cy="18" r="0.6" fill="#7B3B96" opacity={0.4} />
      <Circle cx="34" cy="18" r="0.6" fill="#7B3B96" opacity={0.4} />
      <Circle cx="32" cy="16" r="0.6" fill="#7B3B96" opacity={0.4} />
    </G>
  );
}

// ─── 14. Bambú — PREMIUM ───────────────────────────────────

function BambuSeed() { return <GenericSeed bodyColor="#5B6B4E" highlightColor="#6B7B5E" crackColor="#4A5A3E" />; }
function BambuSprout() { return <GenericSprout stemColor="#5B8C5A" leafColor1="#5B8C5A" leafColor2="#7BAA78" />; }

function BambuBud() {
  return (
    <G>
      <Soil />
      {/* Bamboo segments */}
      <Rect x="29" y="22" width="6" height="32" rx="3" fill="#5B8C5A" />
      <Line x1="29" y1="30" x2="35" y2="30" stroke="#4A7B49" strokeWidth={0.8} />
      <Line x1="29" y1="38" x2="35" y2="38" stroke="#4A7B49" strokeWidth={0.8} />
      <Line x1="29" y1="46" x2="35" y2="46" stroke="#4A7B49" strokeWidth={0.8} />
      {/* Small leaves */}
      <Path d="M35 28 Q40 24 44 26" stroke="#6B9C6A" strokeWidth={1.5} fill="none" strokeLinecap="round" />
      <Path d="M29 36 Q24 32 20 34" stroke="#7BAA78" strokeWidth={1.5} fill="none" strokeLinecap="round" />
    </G>
  );
}

function BambuFlower() {
  return (
    <G>
      <Soil />
      {/* Main stalk */}
      <Rect x="29" y="8" width="6" height="46" rx="3" fill="#5B8C5A" />
      <Line x1="29" y1="16" x2="35" y2="16" stroke="#4A7B49" strokeWidth={0.8} />
      <Line x1="29" y1="24" x2="35" y2="24" stroke="#4A7B49" strokeWidth={0.8} />
      <Line x1="29" y1="32" x2="35" y2="32" stroke="#4A7B49" strokeWidth={0.8} />
      <Line x1="29" y1="40" x2="35" y2="40" stroke="#4A7B49" strokeWidth={0.8} />
      <Line x1="29" y1="48" x2="35" y2="48" stroke="#4A7B49" strokeWidth={0.8} />
      {/* Side stalk */}
      <Rect x="18" y="18" width="5" height="28" rx="2.5" fill="#6B9C6A" />
      <Line x1="18" y1="26" x2="23" y2="26" stroke="#5B8C5A" strokeWidth={0.6} />
      <Line x1="18" y1="34" x2="23" y2="34" stroke="#5B8C5A" strokeWidth={0.6} />
      {/* Leaves */}
      <Path d="M35 14 Q42 10 48 12" stroke="#6B9C6A" strokeWidth={1.8} fill="none" strokeLinecap="round" />
      <Path d="M35 22 Q42 18 46 20" stroke="#7BAA78" strokeWidth={1.5} fill="none" strokeLinecap="round" />
      <Path d="M18 22 Q12 18 8 20" stroke="#6B9C6A" strokeWidth={1.5} fill="none" strokeLinecap="round" />
      <Path d="M23 30 Q28 28 30 30" stroke="#7BAA78" strokeWidth={1} fill="none" strokeLinecap="round" />
      {/* Highlight */}
      <Rect x="30" y="10" width="2" height="40" rx="1" fill="white" opacity={0.08} />
    </G>
  );
}

// ─── 15. Olivo (Olive Tree) — PREMIUM ──────────────────────

function OlivoSeed() { return <GenericSeed bodyColor="#6B6B4E" highlightColor="#7B7B5E" crackColor="#5B5B3E" />; }
function OlivoSprout() { return <GenericSprout stemColor="#8B7B5E" leafColor1="#808C6C" leafColor2="#96A880" />; }

function OlivoBud() {
  return (
    <G>
      <Soil />
      <Path d="M32 54 Q30 42 28 32" stroke="#8B7B5E" strokeWidth={3} fill="none" strokeLinecap="round" />
      {/* Small crown */}
      <Ellipse cx="28" cy="28" rx="8" ry="6" fill="#808C6C" opacity={0.8} />
      <Ellipse cx="30" cy="26" rx="5" ry="4" fill="#96A880" opacity={0.5} />
    </G>
  );
}

function OlivoFlower() {
  return (
    <G>
      <Soil />
      {/* Gnarled trunk */}
      <Path d="M32 54 Q28 42 26 34 Q24 28 26 24" stroke="#8B7B5E" strokeWidth={4} fill="none" strokeLinecap="round" />
      <Path d="M26 30 Q22 28 20 30" stroke="#8B7B5E" strokeWidth={2.5} fill="none" strokeLinecap="round" />
      {/* Crown */}
      <Ellipse cx="26" cy="18" rx="12" ry="8" fill="#808C6C" opacity={0.8} />
      <Ellipse cx="22" cy="20" rx="7" ry="5" fill="#96A880" opacity={0.5} />
      <Ellipse cx="32" cy="14" rx="7" ry="5" fill="#6B7B56" opacity={0.6} />
      <Ellipse cx="20" cy="28" rx="5" ry="3.5" fill="#808C6C" opacity={0.6} />
      {/* Olives */}
      <Ellipse cx="30" cy="20" rx="2" ry="2.5" fill="#556B2F" />
      <Ellipse cx="22" cy="18" rx="2" ry="2.5" fill="#4A6025" />
      <Ellipse cx="26" cy="24" rx="1.8" ry="2.2" fill="#556B2F" />
      <Circle cx="29" cy="19" r="0.6" fill="white" opacity={0.15} />
    </G>
  );
}

// ─── 16. Clavel (Carnation) — PREMIUM ──────────────────────

function ClavelSeed() { return <GenericSeed bodyColor="#8B5B5B" highlightColor="#A06B6B" crackColor="#7B4B4B" />; }
function ClavelSprout() { return <GenericSprout tipColor="#E8505B" />; }

function ClavelBud() {
  return (
    <G>
      <Soil />
      <Stem y2={24} />
      <LeafLeft y={46} />
      <LeafRight y={40} color="#A8C5A0" />
      {/* Tight bud */}
      <Path d="M28 24 Q30 16 32 14 Q34 16 36 24Z" fill="#E8505B" />
      <Path d="M30 24 Q31 18 32 14 Q33 18 34 24Z" fill="#D04048" opacity={0.5} />
      <Path d="M28 24 Q26 22 28 20" stroke="#6B8A64" strokeWidth={1.2} fill="none" strokeLinecap="round" />
      <Path d="M36 24 Q38 22 36 20" stroke="#6B8A64" strokeWidth={1.2} fill="none" strokeLinecap="round" />
    </G>
  );
}

function ClavelFlower() {
  return (
    <G>
      <Soil />
      <Stem y2={28} />
      <LeafLeft y={48} />
      <LeafRight y={42} color="#A8C5A0" />
      {/* Ruffled carnation petals */}
      <Circle cx="32" cy="20" r="5" fill="#E8505B" />
      <Circle cx="28" cy="18" r="4" fill="#F06068" />
      <Circle cx="36" cy="18" r="4" fill="#F06068" />
      <Circle cx="30" cy="14" r="3.5" fill="#E8505B" />
      <Circle cx="34" cy="14" r="3.5" fill="#E8505B" />
      <Circle cx="32" cy="24" r="4" fill="#D04048" />
      <Circle cx="28" cy="22" r="3" fill="#F07078" />
      <Circle cx="36" cy="22" r="3" fill="#F07078" />
      {/* Center depth */}
      <Circle cx="32" cy="18" r="2.5" fill="#C83840" />
      <Circle cx="31" cy="16" r="0.8" fill="white" opacity={0.15} />
    </G>
  );
}

// ─── 17. Durazno (Peach) — PREMIUM ─────────────────────────

function DuraznoSeed() { return <GenericSeed bodyColor="#8B7B6E" highlightColor="#A08B7E" crackColor="#7B6B5E" />; }
function DuraznoSprout() { return <GenericSprout stemColor="#8B6B5E" tipColor="#FFAA7B" />; }

function DuraznoBud() {
  return (
    <G>
      <Soil />
      {/* Branch */}
      <Path d="M24 54 Q26 42 30 32" stroke="#8B6B5E" strokeWidth={3} fill="none" strokeLinecap="round" />
      <Path d="M30 32 Q34 26 36 24" stroke="#8B6B5E" strokeWidth={2} fill="none" strokeLinecap="round" />
      {/* Pink blossoms */}
      <Circle cx="36" cy="22" r="3.5" fill="#FFB3C6" />
      <Circle cx="30" cy="28" r="3" fill="#FFC8D6" />
      <Circle cx="36" cy="22" r="1.5" fill="#FF8FAB" />
      {/* Leaves */}
      <Path d="M30 38 Q24 34 22 36 Q24 40 30 38Z" fill="#7D9B76" />
    </G>
  );
}

function DuraznoFlower() {
  return (
    <G>
      <Soil />
      {/* Branch */}
      <Path d="M22 54 Q24 42 28 32 Q32 24 34 22" stroke="#8B6B5E" strokeWidth={3} fill="none" strokeLinecap="round" />
      {/* Leaves */}
      <Path d="M28 40 Q22 36 20 38 Q22 42 28 40Z" fill="#7D9B76" />
      <Path d="M34 30 Q40 26 42 28 Q40 32 34 30Z" fill="#A8C5A0" />
      {/* Peach fruit */}
      <Circle cx="34" cy="16" r="8" fill="#FFAA7B" />
      <Circle cx="34" cy="16" r="6" fill="#FFB88C" opacity={0.5} />
      {/* Cleft */}
      <Path d="M34 8 Q33 12 34 20" stroke="#E8956B" strokeWidth={0.8} fill="none" opacity={0.4} />
      {/* Blush */}
      <Circle cx="38" cy="14" r="3.5" fill="#FF8080" opacity={0.25} />
      {/* Shine */}
      <Ellipse cx="31" cy="13" rx="2" ry="3" fill="white" opacity={0.15} />
      {/* Leaf on top */}
      <Path d="M34 8 Q36 4 40 6" fill="#7D9B76" />
    </G>
  );
}

// ─── 18. Loto (Lotus) — PREMIUM ────────────────────────────

function LotoSeed() { return <GenericSeed bodyColor="#6B6B5E" highlightColor="#7B7B6E" crackColor="#5B5B4E" />; }
function LotoSprout() { return <GenericSprout stemColor="#6B8A64" tipColor="#F0A0C0" />; }

function LotoBud() {
  return (
    <G>
      {/* Water */}
      <Ellipse cx="32" cy="48" rx="24" ry="4" fill="#5B9BD5" opacity={0.2} />
      <Stem y1={48} y2={28} color="#6B8A64" />
      {/* Lily pad */}
      <Ellipse cx="22" cy="48" rx="10" ry="3" fill="#5B8C5A" opacity={0.5} />
      {/* Closed bud */}
      <Path d="M28 28 Q30 18 32 14 Q34 18 36 28Z" fill="#F0A0C0" />
      <Path d="M30 28 Q31 20 32 14 Q33 20 34 28Z" fill="#E88AB0" opacity={0.5} />
    </G>
  );
}

function LotoFlower() {
  return (
    <G>
      {/* Water */}
      <Ellipse cx="32" cy="48" rx="24" ry="4" fill="#5B9BD5" opacity={0.2} />
      <Stem y1={48} y2={30} color="#6B8A64" />
      {/* Lily pad */}
      <Ellipse cx="20" cy="48" rx="10" ry="3" fill="#5B8C5A" opacity={0.5} />
      <Ellipse cx="44" cy="48" rx="8" ry="2.5" fill="#6B9C6A" opacity={0.4} />
      {/* Outer petals */}
      <Ellipse cx="22" cy="26" rx="5" ry="8" fill="#F0C0D8" rotation={-25} origin="22,26" />
      <Ellipse cx="42" cy="26" rx="5" ry="8" fill="#F0C0D8" rotation={25} origin="42,26" />
      <Ellipse cx="26" cy="20" rx="4" ry="7" fill="#F0A0C0" rotation={-15} origin="26,20" />
      <Ellipse cx="38" cy="20" rx="4" ry="7" fill="#F0A0C0" rotation={15} origin="38,20" />
      {/* Inner petals */}
      <Ellipse cx="30" cy="18" rx="3.5" ry="6" fill="#E88AB0" rotation={-8} origin="30,18" />
      <Ellipse cx="34" cy="18" rx="3.5" ry="6" fill="#E88AB0" rotation={8} origin="34,18" />
      <Ellipse cx="32" cy="16" rx="3" ry="5" fill="#F0C0D8" />
      {/* Center pod */}
      <Circle cx="32" cy="22" r="3.5" fill="#F4E04D" />
      <Circle cx="31" cy="21" r="0.7" fill="#D4C040" />
      <Circle cx="33" cy="21" r="0.7" fill="#D4C040" />
      <Circle cx="32" cy="23" r="0.7" fill="#D4C040" />
      <Circle cx="30" cy="20" r="0.8" fill="white" opacity={0.2} />
    </G>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT — maps plantId + stage to renderer
// ═══════════════════════════════════════════════════════════

type Renderer = () => React.ReactElement;

const PLANT_RENDERERS: Record<string, Record<PlantStage, Renderer>> = {
  margarita: { seed: MargaritaSeed, sprout: MargaritaSprout, bud: MargaritaBud, flower: MargaritaFlower },
  aloe:      { seed: AloeSeed, sprout: AloeSprout, bud: AloeBud, flower: AloeFlower },
  cactus:    { seed: CactusSeed, sprout: CactusSprout, bud: CactusBud, flower: CactusFlower },
  girasol:   { seed: GirasolSeed, sprout: GirasolSprout, bud: GirasolBud, flower: GirasolFlower },
  helecho:   { seed: HelechoSeed, sprout: HelechoSprout, bud: HelechoBud, flower: HelechoFlower },
  frutilla:  { seed: FrutillaSeed, sprout: FrutillaSprout, bud: FrutillaBud, flower: FrutillaFlower },
  lavanda:   { seed: LavandaSeed, sprout: LavandaSprout, bud: LavandaBud, flower: LavandaFlower },
  rosa:      { seed: RosaSeed, sprout: RosaSprout, bud: RosaBud, flower: RosaFlower },
  tulipan:   { seed: TulipanSeed, sprout: TulipanSprout, bud: TulipanBud, flower: TulipanFlower },
  cerezo:    { seed: CerezoSeed, sprout: CerezoSprout, bud: CerezoBud, flower: CerezoFlower },
  bonsai:    { seed: BonsaiSeed, sprout: BonsaiSprout, bud: BonsaiBud, flower: BonsaiFlower },
  palmera:   { seed: PalmeraSeed, sprout: PalmeraSprout, bud: PalmeraBud, flower: PalmeraFlower },
  orquidea:  { seed: OrquideaSeed, sprout: OrquideaSprout, bud: OrquideaBud, flower: OrquideaFlower },
  bambu:     { seed: BambuSeed, sprout: BambuSprout, bud: BambuBud, flower: BambuFlower },
  olivo:     { seed: OlivoSeed, sprout: OlivoSprout, bud: OlivoBud, flower: OlivoFlower },
  clavel:    { seed: ClavelSeed, sprout: ClavelSprout, bud: ClavelBud, flower: ClavelFlower },
  durazno:   { seed: DuraznoSeed, sprout: DuraznoSprout, bud: DuraznoBud, flower: DuraznoFlower },
  loto:      { seed: LotoSeed, sprout: LotoSprout, bud: LotoBud, flower: LotoFlower },
};

export const PlantSVG = React.memo(function PlantSVG({ plantId, stage, size = 48 }: PlantSVGProps) {
  const renderer = PLANT_RENDERERS[plantId]?.[stage];

  if (!renderer) {
    // Fallback — generic seed
    return (
      <Svg width={size} height={size} viewBox="0 0 64 64">
        <GenericSeed />
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      {renderer()}
    </Svg>
  );
});
