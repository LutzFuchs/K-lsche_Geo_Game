/**
 * Answers are matched on a tolerant key:
 *   - trim
 *   - uppercase
 *   - umlaut/eszett folded (Ä→A, Ö→O, Ü→U, ß→S)
 *   - any remaining combining marks stripped
 *
 * So "LÖWE", "Löwe", "loewe", "loewe ", "LOWE" all resolve to the same key.
 */
export function normalizeAnswer(input: string): string {
  return input
    .trim()
    .toUpperCase()
    .replace(/Ä/g, 'A')
    .replace(/Ö/g, 'O')
    .replace(/Ü/g, 'U')
    .replace(/ß/g, 'S')
    .replace(/OE/g, 'O')
    .replace(/AE/g, 'A')
    .replace(/UE/g, 'U')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

/**
 * Some answers are a person's surname only. Teams often type the full name
 * ("Karl Valentin") instead of just the surname ("Valentin") — accept both
 * by also matching the last word of the input against the expected answer.
 */
export function answerMatches(input: string, expected: string): boolean {
  const key = normalizeAnswer(input)
  const expectedKey = normalizeAnswer(expected)
  if (key === expectedKey) return true
  const words = key.split(/\s+/)
  return words.length > 1 && words[words.length - 1] === expectedKey
}
