export const POS_LABELS_ES: Record<string, string> = {
  n: "noun",
  v: "verb",
  adj: "adjective",
  adv: "adverb",
  prep: "preposition",
  pron: "pronoun",
  conj: "conjunction",
  num: "numeral",
  determiner: "determiner",
  art: "article",
  particle: "particle",
  interj: "interjection",
  prop: "proper noun",
  letter: "letter",
  contraction: "contraction",
  prefix: "prefix",
  suffix: "suffix",
  phrase: "phrase",
  proverb: "proverb",
  symbol: "symbol",
  punct: "punctuation",
};

export function posLabelEs(code: string): string {
  return POS_LABELS_ES[code] ?? code;
}
