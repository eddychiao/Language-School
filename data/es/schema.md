`source.json` is a distilled, frequency-ranked Spanish word list derived from
[doozan/spanish_data](https://github.com/doozan/spanish_data) (`es-en.data`,
Wiktionary-parsed dictionary data, and `frequency.csv`, a lemma-level
frequency list). See `scripts/prepare-spanish-source.ts` for the exact
derivation — it's a one-time script, not part of the regular build, run by
hand whenever the source data needs refreshing.

### Derivation
1. Take the top ~10,000-12,000 lemmas from `frequency.csv` with no quality
   flags (`flags == ""`), in frequency-descending order.
2. For each, look up its headword block(s) in `es-en.data` and pull the
   English gloss(es) for the matching part of speech, skipping glosses that
   are pure inflection/redirect references (e.g. "form of X", "plural of Y").
3. Stop once 10,000 lemmas have resolved to at least one real gloss.

### Example
```json
{
  "word": "gato",
  "pos": ["n"],
  "gender": "m",
  "meanings": ["cat (unspecified gender)", "tomcat, gib (male cat)", "..."],
  "rank": 842
}
```

### Schema
- **word**: the Spanish lemma (dictionary form).
- **pos**: part-of-speech tag(s), in `es-en.data`'s own vocabulary (`n`,
  `v`, `adj`, `adv`, `prep`, `pron`, `conj`, `num`, `determiner`, `art`,
  `particle`, `interj`, `prop`, `letter`, `contraction`, `prefix`, `phrase`).
  Usually one tag; more than one only when multiple `pos:` blocks under the
  same headword share the frequency list's declared part of speech.
- **gender**: `"m"`, `"f"`, or `"mf"` (common gender / varies by referent),
  present for most nouns, normalized from `es-en.data`'s messier raw values
  (`m-p`, `mfbysense`, `mfequiv`, etc.).
- **meanings**: English gloss(es), qualifier-prefixed where `es-en.data`
  tagged one (e.g. region/register: `"(Mexico) servant"`).
- **rank**: 1-based frequency rank among the resolved entries (1 = most
  frequent). `scripts/build-dataset-es.ts` uses this both as the `Word.frequency`
  value and to bucket entries into 7 levels, proportioned like HSK's level
  sizes.

### Credits
- `es-en.data` — CC-BY-SA, attribution: wiktionary.org
- `frequency.csv` — CC-BY-SA 3.0, github.com/hermitdave/FrequencyWords
