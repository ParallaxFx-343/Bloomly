import { CategoryId } from './Categories';
import { t } from '../lib/i18n';

export type PlantStage = 'seed' | 'sprout' | 'bud' | 'flower';

export interface PlantType {
  id: string;
  nameKey: string;
  name: string;
  category: CategoryId;
  premium: boolean;
  /** Emoji representations per stage */
  stages: Record<PlantStage, string>;
}

interface PlantDef {
  id: string;
  nameKey: string;
  category: CategoryId;
  premium: boolean;
  stages: Record<PlantStage, string>;
}

const PLANT_DEFS: PlantDef[] = [
  { id: 'margarita', nameKey: 'plant.margarita', category: 'familia', premium: false, stages: { seed: '🌰', sprout: '🌱', bud: '🌿', flower: '🌼' } },
  { id: 'aloe', nameKey: 'plant.aloe', category: 'salud', premium: false, stages: { seed: '🌰', sprout: '🌱', bud: '🌿', flower: '🪴' } },
  { id: 'cactus', nameKey: 'plant.cactus', category: 'trabajo', premium: false, stages: { seed: '🌰', sprout: '🌱', bud: '🌿', flower: '🌵' } },
  { id: 'girasol', nameKey: 'plant.girasol', category: 'amigos', premium: false, stages: { seed: '🌰', sprout: '🌱', bud: '🌿', flower: '🌻' } },
  { id: 'helecho', nameKey: 'plant.helecho', category: 'naturaleza', premium: false, stages: { seed: '🌰', sprout: '🌱', bud: '🌿', flower: '🌲' } },
  { id: 'frutilla', nameKey: 'plant.frutilla', category: 'comida', premium: false, stages: { seed: '🌰', sprout: '🌱', bud: '🌿', flower: '🍓' } },
  { id: 'lavanda', nameKey: 'plant.lavanda', category: 'descanso', premium: false, stages: { seed: '🌰', sprout: '🌱', bud: '🌿', flower: '💐' } },
  { id: 'rosa', nameKey: 'plant.rosa', category: 'amor', premium: false, stages: { seed: '🌰', sprout: '🌱', bud: '🌿', flower: '🌹' } },
  { id: 'tulipan', nameKey: 'plant.tulipan', category: 'yoMisma', premium: false, stages: { seed: '🌰', sprout: '🌱', bud: '🌿', flower: '🌷' } },
  // Premium
  { id: 'cerezo', nameKey: 'plant.cerezo', category: 'amor', premium: true, stages: { seed: '🌰', sprout: '🌱', bud: '🌿', flower: '🌸' } },
  { id: 'bonsai', nameKey: 'plant.bonsai', category: 'descanso', premium: true, stages: { seed: '🌰', sprout: '🌱', bud: '🌿', flower: '🎋' } },
  { id: 'palmera', nameKey: 'plant.palmera', category: 'naturaleza', premium: true, stages: { seed: '🌰', sprout: '🌱', bud: '🌿', flower: '🌴' } },
  { id: 'orquidea', nameKey: 'plant.orquidea', category: 'familia', premium: true, stages: { seed: '🌰', sprout: '🌱', bud: '🌿', flower: '🪻' } },
  { id: 'bambu', nameKey: 'plant.bambu', category: 'salud', premium: true, stages: { seed: '🌰', sprout: '🌱', bud: '🌿', flower: '🎍' } },
  { id: 'olivo', nameKey: 'plant.olivo', category: 'trabajo', premium: true, stages: { seed: '🌰', sprout: '🌱', bud: '🌿', flower: '🫒' } },
  { id: 'clavel', nameKey: 'plant.clavel', category: 'amigos', premium: true, stages: { seed: '🌰', sprout: '🌱', bud: '🌿', flower: '🌺' } },
  { id: 'durazno', nameKey: 'plant.durazno', category: 'comida', premium: true, stages: { seed: '🌰', sprout: '🌱', bud: '🌿', flower: '🍑' } },
  { id: 'loto', nameKey: 'plant.loto', category: 'yoMisma', premium: true, stages: { seed: '🌰', sprout: '🌱', bud: '🌿', flower: '🪷' } },
];

export function getPlants(): PlantType[] {
  return PLANT_DEFS.map((d) => ({
    ...d,
    name: t(d.nameKey as any) as string,
  }));
}

/** Static reference — use getPlants() for i18n-aware names */
export const PLANTS = getPlants();

/** Hours between each growth stage */
export const GROWTH_HOURS = 24; // 1 day per stage, 3 days seed→flower

/** Get the plant type for a category (first non-premium match) */
export function getDefaultPlant(category: CategoryId): PlantType {
  return PLANTS.find((p) => p.category === category && !p.premium) ?? PLANTS[0];
}

/** Get current stage based on hours since planting */
export function getPlantStage(plantedAt: Date): PlantStage {
  const time = plantedAt.getTime();
  if (isNaN(time)) return 'seed'; // invalid date fallback
  const hours = (Date.now() - time) / (1000 * 60 * 60);
  if (hours < GROWTH_HOURS) return 'seed';
  if (hours < GROWTH_HOURS * 2) return 'sprout';
  if (hours < GROWTH_HOURS * 3) return 'bud';
  return 'flower';
}
