/**
 * Utility functions for handling bride and groom names, titles, and nicknames.
 */

export interface PersonNameObj {
  name?: string
  nickname?: string
}

/**
 * Extracts a clean call name (nama panggilan) for display on covers, seals, headers, etc.
 * Uses explicit `nickname` if provided, otherwise strips common Indonesian front titles
 * (e.g. Dr., dr., Drg., Ir., H., Hj., Prof., Drs., Dra., Raden, Tgk., Ners., Ustadz, etc.)
 * before taking the first name word.
 */
export function getCallName(person?: PersonNameObj | string, fallback = ''): string {
  if (!person) return fallback

  if (typeof person === 'object') {
    if (person.nickname && person.nickname.trim()) {
      return person.nickname.trim()
    }
  }

  const fullName = typeof person === 'string' ? person.trim() : (person.name ? person.name.trim() : '')
  if (!fullName) return fallback

  // Regex to match common front titles
  const titleRegex = /^(drg\.|dr\.|drs\.|dra\.|ir\.|h\.|hj\.|prof\.|c\.|st\.|ners\.|raden\.|r\.|tgk\.|ustadz\.|kiai\.|kyai\.|kh\.|m\.)\s+/i

  let cleaned = fullName
  // Strip multiple leading titles (e.g. "Dr. Hj. Zahra Aulia")
  while (titleRegex.test(cleaned)) {
    cleaned = cleaned.replace(titleRegex, '')
  }

  const firstWord = cleaned.split(' ')[0] || ''
  return firstWord || fallback
}
