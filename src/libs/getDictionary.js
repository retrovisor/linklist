import 'server-only'

const dictionaries = {
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  kr: () => import('@/dictionaries/kr.json').then((module) => module.default),
}

export const getDictionary = async (locale) => {
  if (!dictionaries[locale]) {
    console.warn(`Dictionary for locale "${locale}" not found. Falling back to English.`);
    return dictionaries.en();
  }
  return dictionaries[locale]();
}
