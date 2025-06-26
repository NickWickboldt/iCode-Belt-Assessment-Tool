import { beltAliasMapping } from '@/data/beltMapper';

/**
 * Takes a fuzzy input string from an AI and finds the matching canonical
 * key from our belt data.
 * @param aiSuggestion The raw string from the AI (e.g., "Foundation Belt").
 * @returns The canonical key (e.g., "foundation") or null if no match is found.
 */
export function getCanonicalBeltKey(aiSuggestion){
  if (!aiSuggestion) {
    return null;
  }

  const normalizedInput = aiSuggestion.toLowerCase().trim();

  const foundEntry = Object.entries(beltAliasMapping).find(
    ([canonicalKey, aliases]) => aliases.includes(normalizedInput)
  );

  return foundEntry ? foundEntry[0] : null;
}