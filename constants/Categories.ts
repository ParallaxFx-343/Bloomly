import { Colors } from './Colors';
import { t } from '../lib/i18n';

export type CategoryId =
  | 'familia'
  | 'salud'
  | 'trabajo'
  | 'amigos'
  | 'naturaleza'
  | 'comida'
  | 'descanso'
  | 'amor'
  | 'yoMisma';

export interface Category {
  id: CategoryId;
  label: string;
  color: string;
}

export function getCategories(): Category[] {
  return [
    { id: 'familia', label: t('cat.familia') as string, color: Colors.category.familia },
    { id: 'salud', label: t('cat.salud') as string, color: Colors.category.salud },
    { id: 'trabajo', label: t('cat.trabajo') as string, color: Colors.category.trabajo },
    { id: 'amigos', label: t('cat.amigos') as string, color: Colors.category.amigos },
    { id: 'naturaleza', label: t('cat.naturaleza') as string, color: Colors.category.naturaleza },
    { id: 'comida', label: t('cat.comida') as string, color: Colors.category.comida },
    { id: 'descanso', label: t('cat.descanso') as string, color: Colors.category.descanso },
    { id: 'amor', label: t('cat.amor') as string, color: Colors.category.amor },
    { id: 'yoMisma', label: t('cat.yoMisma') as string, color: Colors.category.yoMisma },
  ];
}

/** @deprecated Use getCategories() for i18n support */
export const CATEGORIES = getCategories();
