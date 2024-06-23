import 'server-only'

const dictionaries = {
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  kr: () => import('@/dictionaries/kr.json').then((module) => module.default),
}

export const getDictionary = async (locale) => dictionaries[locale]()
