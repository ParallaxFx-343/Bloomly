import { getLocales } from 'expo-localization';

type TranslationValue = string | string[] | ((...args: any[]) => string);
type Translations = Record<string, TranslationValue>;

const es: Translations = {
  // Tabs
  'tab.garden': 'Jardín',
  'tab.plant': 'Plantar',
  'tab.calendar': 'Calendario',
  'tab.collection': 'Colección',
  'tab.settings': 'Ajustes',

  // Categories
  'cat.familia': 'Familia',
  'cat.salud': 'Salud',
  'cat.trabajo': 'Trabajo',
  'cat.amigos': 'Amigos',
  'cat.naturaleza': 'Naturaleza',
  'cat.comida': 'Comida',
  'cat.descanso': 'Descanso',
  'cat.amor': 'Amor',
  'cat.yoMisma': 'Yo misma',

  // Plant names
  'plant.margarita': 'Margarita',
  'plant.aloe': 'Aloe Vera',
  'plant.cactus': 'Cactus',
  'plant.girasol': 'Girasol',
  'plant.helecho': 'Helecho',
  'plant.frutilla': 'Frutilla',
  'plant.lavanda': 'Lavanda',
  'plant.rosa': 'Rosa',
  'plant.tulipan': 'Tulipán',
  'plant.cerezo': 'Cerezo',
  'plant.bonsai': 'Bonsái',
  'plant.palmera': 'Palmera',
  'plant.orquidea': 'Orquídea',
  'plant.bambu': 'Bambú',
  'plant.olivo': 'Olivo',
  'plant.clavel': 'Clavel',
  'plant.durazno': 'Durazno',
  'plant.loto': 'Loto',
  'plant.stageSeed': 'semilla',
  'plant.stageSprout': 'brote',

  // Garden screen
  'garden.title': 'Mi Jardín',
  'garden.empty': 'Tu jardín está esperando su primera semilla',
  'garden.plantCount': (n: number) => `${n} planta${n !== 1 ? 's' : ''} creciendo`,
  'garden.plantToday': 'Plantar hoy',
  'garden.soundOn': 'Activar sonido',
  'garden.soundOff': 'Silenciar sonido',
  'garden.streakDays': 'días seguidos',

  // Milestones
  'milestone.7': '¡7 días seguidos!\nDesbloqueaste el Cerezo 🌸',
  'milestone.14': '¡14 días de gratitud!\nDesbloqueaste el Bonsái 🎋',
  'milestone.30': '¡30 días — Sos increíble!\nDesbloqueaste la Orquídea 🪻',
  'milestone.60': '¡60 días — Imparable!\nDesbloqueaste la Palmera 🌴',
  'milestone.100': '¡100 días — Leyenda!\nDesbloqueaste el Loto 🪷',

  // Entry screen
  'entry.title': '¿Por qué estás agradecida hoy?',
  'entry.subtitle': 'Elegí hasta 3 categorías',
  'entry.pickPlant': 'Elegí tu planta',
  'entry.noteLabel': 'Nota corta (opcional)',
  'entry.planting': 'Plantando...',
  'entry.plantName': (name: string) => `Plantar ${name}`,
  'entry.plantSeed': 'Plantar semilla',
  'entry.alertNoCat': 'Elegí al menos una categoría',
  'entry.alertNoCatMsg': 'Seleccioná algo por lo que estés agradecida hoy',
  'entry.alertNoPlant': 'Elegí una planta',
  'entry.alertNoPlantMsg': 'Seleccioná qué planta querés plantar',
  'entry.alertAlready': 'Ya plantaste hoy',
  'entry.alertAlreadyMsg': 'Tu semilla de hoy ya está creciendo',
  'entry.alertError': 'Error',
  'entry.alertErrorMsg': 'No se pudo guardar. Intentá de nuevo.',
  'entry.planted': '¡Plantada!',

  // Entry prompts
  'prompt.0': 'Hoy agradezco...',
  'prompt.1': 'Me hizo sonreír...',
  'prompt.2': 'Algo lindo que pasó...',
  'prompt.3': 'Estoy agradecida por...',
  'prompt.4': 'Lo mejor de hoy fue...',
  'prompt.5': 'Me siento bien porque...',
  'prompt.6': 'Un momento especial...',
  'prompt.7': 'Alguien que valoro hoy...',

  // Calendar
  'calendar.title': 'Calendario',
  'calendar.legend': ' = día con gratitud',
  'calendar.months': [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ],
  'calendar.days': ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
  'calendar.dateFormat': (day: number, month: string, year: number) => `${day} de ${month}, ${year}`,

  // Collection
  'collection.title': 'Colección',
  'collection.subtitle': 'Tus plantas disponibles',
  'collection.basic': 'Básicas',
  'collection.premium': 'Premium',

  // Settings
  'settings.title': 'Ajustes',
  'settings.sounds': 'Sonidos',
  'settings.reminder': 'Recordatorio diario',
  'settings.darkMode': 'Modo oscuro',
  'settings.darkAuto': 'Auto',
  'settings.darkLight': 'Claro',
  'settings.darkDark': 'Oscuro',
  'settings.darkHintAuto': 'Se activa solo de noche (20:00 a 5:00)',
  'settings.darkHintDark': 'Siempre oscuro',
  'settings.darkHintLight': 'Siempre claro',
  'settings.premium': 'Bloomly Premium',
  'settings.about': 'Acerca de',
  'settings.aboutTitle': 'Bloomly',
  'settings.aboutBody': 'Versión 1.0.0\n\nHecho con amor en Argentina',

  // Paywall
  'paywall.title': 'Bloomly Premium',
  'paywall.subtitle': 'Desbloqueá todo el jardín y hacé que crezca sin límites',
  'paywall.free': 'Free',
  'paywall.premium': 'Premium',
  'paywall.plants': 'Plantas',
  'paywall.plantsFree': '9 básicas',
  'paywall.plantsPremium': '30+ variedades',
  'paywall.themes': 'Temas',
  'paywall.themesFree': '1 clásico',
  'paywall.themesPremium': '5 temas únicos',
  'paywall.sounds': 'Sonidos',
  'paywall.soundsFree': '1 ambiente',
  'paywall.soundsPremium': '6 sonidos',
  'paywall.stats': 'Estadísticas',
  'paywall.statsFree': 'Racha',
  'paywall.statsPremium': 'Stats completas',
  'paywall.ads': 'Anuncios',
  'paywall.adsFree': 'Con ads',
  'paywall.adsPremium': 'Sin anuncios',
  'paywall.yearly': 'Anual — $29.99/año',
  'paywall.yearlySave': 'Ahorrá 50%',
  'paywall.monthly': 'Mensual — $4.99/mes',
  'paywall.restore': 'Restaurar compra',
  'paywall.errorTitle': 'Error',
  'paywall.errorNotAvailable': 'Este plan no está disponible en este momento.',
  'paywall.errorPurchase': 'No se pudo completar la compra. Intentá de nuevo.',
  'paywall.errorRestore': 'No se pudieron restaurar las compras.',
  'paywall.restoreSuccessTitle': '¡Restaurado!',
  'paywall.restoreSuccessMsg': 'Tu suscripción premium fue restaurada.',
  'paywall.restoreNoneTitle': 'Sin compras',
  'paywall.restoreNoneMsg': 'No se encontraron compras anteriores.',
  'paywall.alreadyPremium': '¡Ya sos Premium!',
  'paywall.backToGarden': 'Volver al jardín',

  // Onboarding
  'onboarding.slide1Title': 'Plantá gratitud',
  'onboarding.slide1Sub': 'Cada día elegí algo por lo que estás agradecida y plantá una semilla en tu jardín.',
  'onboarding.slide2Title': 'Mirá tu jardín crecer',
  'onboarding.slide2Sub': 'Tus semillas crecen con el tiempo. En unos días, tu jardín va a estar lleno de flores.',
  'onboarding.slide3Title': 'Mantené la racha',
  'onboarding.slide3Sub': 'Entrá cada día y mirá cómo crece tu racha. A los 7, 14 y 30 días vas a desbloquear celebraciones.',
  'onboarding.slide4Title': 'Sin presión, con amor',
  'onboarding.slide4Sub': 'No hay castigos por días perdidos. Bloomly está acá cuando vos quieras, a tu ritmo.',
  'onboarding.next': 'Siguiente',
  'onboarding.start': 'Empezar',

  // Share
  'garden.share': 'Compartir jardín',
  'garden.shareTitle': 'Mi jardín en Bloomly',

  // Ads
  'ad.watchAd': 'Ver anuncio para planta rara',
  'ad.rewardTitle': '¡Planta rara desbloqueada!',
  'ad.rewardMsg': 'Hoy podés plantar cualquier planta premium. ¡Elegí tu favorita!',

  // Notifications
  'notif.title': '🌱 Bloomly',
  'notif.body': '¿Por qué estás agradecida hoy? Tu jardín te espera',
};

const en: Translations = {
  // Tabs
  'tab.garden': 'Garden',
  'tab.plant': 'Plant',
  'tab.calendar': 'Calendar',
  'tab.collection': 'Collection',
  'tab.settings': 'Settings',

  // Categories
  'cat.familia': 'Family',
  'cat.salud': 'Health',
  'cat.trabajo': 'Work',
  'cat.amigos': 'Friends',
  'cat.naturaleza': 'Nature',
  'cat.comida': 'Food',
  'cat.descanso': 'Rest',
  'cat.amor': 'Love',
  'cat.yoMisma': 'Myself',

  // Plant names
  'plant.margarita': 'Daisy',
  'plant.aloe': 'Aloe Vera',
  'plant.cactus': 'Cactus',
  'plant.girasol': 'Sunflower',
  'plant.helecho': 'Fern',
  'plant.frutilla': 'Strawberry',
  'plant.lavanda': 'Lavender',
  'plant.rosa': 'Rose',
  'plant.tulipan': 'Tulip',
  'plant.cerezo': 'Cherry Blossom',
  'plant.bonsai': 'Bonsai',
  'plant.palmera': 'Palm Tree',
  'plant.orquidea': 'Orchid',
  'plant.bambu': 'Bamboo',
  'plant.olivo': 'Olive Tree',
  'plant.clavel': 'Carnation',
  'plant.durazno': 'Peach',
  'plant.loto': 'Lotus',
  'plant.stageSeed': 'seed',
  'plant.stageSprout': 'sprout',

  // Garden screen
  'garden.title': 'My Garden',
  'garden.empty': 'Your garden is waiting for its first seed',
  'garden.plantCount': (n: number) => `${n} plant${n !== 1 ? 's' : ''} growing`,
  'garden.plantToday': 'Plant today',
  'garden.soundOn': 'Turn on sound',
  'garden.soundOff': 'Turn off sound',
  'garden.streakDays': 'day streak',

  // Milestones
  'milestone.7': '7 days in a row!\nYou unlocked the Cherry Blossom 🌸',
  'milestone.14': '14 days of gratitude!\nYou unlocked the Bonsai 🎋',
  'milestone.30': '30 days — You\'re amazing!\nYou unlocked the Orchid 🪻',
  'milestone.60': '60 days — Unstoppable!\nYou unlocked the Palm Tree 🌴',
  'milestone.100': '100 days — Legend!\nYou unlocked the Lotus 🪷',

  // Entry screen
  'entry.title': 'What are you grateful for today?',
  'entry.subtitle': 'Pick up to 3 categories',
  'entry.pickPlant': 'Pick your plant',
  'entry.noteLabel': 'Short note (optional)',
  'entry.planting': 'Planting...',
  'entry.plantName': (name: string) => `Plant ${name}`,
  'entry.plantSeed': 'Plant a seed',
  'entry.alertNoCat': 'Pick at least one category',
  'entry.alertNoCatMsg': 'Select something you\'re grateful for today',
  'entry.alertNoPlant': 'Pick a plant',
  'entry.alertNoPlantMsg': 'Select which plant you want to grow',
  'entry.alertAlready': 'Already planted today',
  'entry.alertAlreadyMsg': 'Your seed for today is already growing',
  'entry.alertError': 'Error',
  'entry.alertErrorMsg': 'Could not save. Try again.',
  'entry.planted': 'Planted!',

  // Entry prompts
  'prompt.0': 'Today I\'m grateful for...',
  'prompt.1': 'Something that made me smile...',
  'prompt.2': 'A nice thing that happened...',
  'prompt.3': 'I\'m thankful for...',
  'prompt.4': 'The best part of today was...',
  'prompt.5': 'I feel good because...',
  'prompt.6': 'A special moment...',
  'prompt.7': 'Someone I appreciate today...',

  // Calendar
  'calendar.title': 'Calendar',
  'calendar.legend': ' = day with gratitude',
  'calendar.months': [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ],
  'calendar.days': ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
  'calendar.dateFormat': (day: number, month: string, year: number) => `${month} ${day}, ${year}`,

  // Collection
  'collection.title': 'Collection',
  'collection.subtitle': 'Your available plants',
  'collection.basic': 'Basic',
  'collection.premium': 'Premium',

  // Settings
  'settings.title': 'Settings',
  'settings.sounds': 'Sounds',
  'settings.reminder': 'Daily reminder',
  'settings.darkMode': 'Dark mode',
  'settings.darkAuto': 'Auto',
  'settings.darkLight': 'Light',
  'settings.darkDark': 'Dark',
  'settings.darkHintAuto': 'Activates at night only (8 PM to 5 AM)',
  'settings.darkHintDark': 'Always dark',
  'settings.darkHintLight': 'Always light',
  'settings.premium': 'Bloomly Premium',
  'settings.about': 'About',
  'settings.aboutTitle': 'Bloomly',
  'settings.aboutBody': 'Version 1.0.0\n\nMade with love in Argentina',

  // Paywall
  'paywall.title': 'Bloomly Premium',
  'paywall.subtitle': 'Unlock the full garden and let it grow without limits',
  'paywall.free': 'Free',
  'paywall.premium': 'Premium',
  'paywall.plants': 'Plants',
  'paywall.plantsFree': '9 basic',
  'paywall.plantsPremium': '30+ varieties',
  'paywall.themes': 'Themes',
  'paywall.themesFree': '1 classic',
  'paywall.themesPremium': '5 unique themes',
  'paywall.sounds': 'Sounds',
  'paywall.soundsFree': '1 ambient',
  'paywall.soundsPremium': '6 sounds',
  'paywall.stats': 'Statistics',
  'paywall.statsFree': 'Streak',
  'paywall.statsPremium': 'Full stats',
  'paywall.ads': 'Ads',
  'paywall.adsFree': 'With ads',
  'paywall.adsPremium': 'No ads',
  'paywall.yearly': 'Yearly — $29.99/year',
  'paywall.yearlySave': 'Save 50%',
  'paywall.monthly': 'Monthly — $4.99/month',
  'paywall.restore': 'Restore purchase',
  'paywall.errorTitle': 'Error',
  'paywall.errorNotAvailable': 'This plan is not available right now.',
  'paywall.errorPurchase': 'Could not complete purchase. Try again.',
  'paywall.errorRestore': 'Could not restore purchases.',
  'paywall.restoreSuccessTitle': 'Restored!',
  'paywall.restoreSuccessMsg': 'Your premium subscription has been restored.',
  'paywall.restoreNoneTitle': 'No purchases',
  'paywall.restoreNoneMsg': 'No previous purchases found.',
  'paywall.alreadyPremium': 'You\'re already Premium!',
  'paywall.backToGarden': 'Back to garden',

  // Onboarding
  'onboarding.slide1Title': 'Plant gratitude',
  'onboarding.slide1Sub': 'Each day, pick something you\'re grateful for and plant a seed in your garden.',
  'onboarding.slide2Title': 'Watch your garden grow',
  'onboarding.slide2Sub': 'Your seeds grow over time. In a few days, your garden will be full of flowers.',
  'onboarding.slide3Title': 'Keep the streak',
  'onboarding.slide3Sub': 'Come back each day and watch your streak grow. At 7, 14 and 30 days you\'ll unlock celebrations.',
  'onboarding.slide4Title': 'No pressure, just love',
  'onboarding.slide4Sub': 'No penalties for missed days. Bloomly is here when you want it, at your pace.',
  'onboarding.next': 'Next',
  'onboarding.start': 'Start',

  // Share
  'garden.share': 'Share garden',
  'garden.shareTitle': 'My garden in Bloomly',

  // Ads
  'ad.watchAd': 'Watch ad for rare plant',
  'ad.rewardTitle': 'Rare plant unlocked!',
  'ad.rewardMsg': 'Today you can plant any premium plant. Pick your favorite!',

  // Notifications
  'notif.title': '🌱 Bloomly',
  'notif.body': 'What are you grateful for today? Your garden awaits',
};

const translations: Record<string, Translations> = { es, en };

/** Detect device language, default to Spanish */
function getDeviceLanguage(): string {
  try {
    const locales = getLocales();
    const lang = locales[0]?.languageCode ?? 'es';
    return lang in translations ? lang : 'es';
  } catch {
    return 'es';
  }
}

let currentLang = getDeviceLanguage();

/** Get translation for a key. Returns the value from current language. */
export function t(key: string): TranslationValue {
  const value = translations[currentLang]?.[key] ?? es[key];
  if (value === undefined && __DEV__) {
    console.warn(`[i18n] Missing key: ${key}`);
  }
  return value ?? key;
}

/** Get current language code */
export function getLanguage(): string {
  return currentLang;
}

/** Override language (for settings toggle in the future) */
export function setLanguage(lang: string): void {
  if (lang in translations) {
    currentLang = lang;
  }
}
