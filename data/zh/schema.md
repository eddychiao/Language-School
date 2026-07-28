The main file - `complete.json` - features ALL words appearing in any level, either of the HSK 2.0 tests or the HSK 3.0 ones - thus, it's the complete list.

Each entry includes different types of information:

### ⚡️ Example

```json
{
	"simplified": "爱好",
	"radical": "爫",
	"level": ["new-1", "old-3"],
	"frequency": 4902,
	"pos": ["n", "v"],
	"forms": [
		{
			"traditional": "愛好",
			"transcriptions": {
				"pinyin": "ài hào",
				"numeric": "ai4 hao4",
				"wadegiles": "ai⁴ hao⁴",
				"bopomofo": "ㄞˋ ㄏㄠˋ",
				"romatzyh": "ay haw"
			},
			"meanings": [
				"to like; to be fond of; to take pleasure in; to be keen on",
				"interest; hobby"
			],
			"classifiers": ["个"]
		}
	]
}
```

> [!TIP]
> The exact same data exists in the minified/compressed `complete.min.json`, only without pretty-printing and with the abbreviations you'll find in the table below used instead of the full field names (e.g `w` for `word`, etc).

#### Schema

- **simplified:** (→ _s_) corresponds to the main word/entry in Simplified Chinese characters (简化字)
- **radical:** (→ _r_) the main [radical](<https://en.wikipedia.org/wiki/Radical_(Chinese_characters)>) (部首)
- **level:** (→ _l_) includes information about the HSK levels in which the word in question appears (in the above example, it's new HSK 1, and the old HSK 3) - see below for reference. ⬇️
- **frequency:** (→ _q_) the word's relative "frequency" ranking (the lower this number, the more common the word)
- **pos:** (→ _p_) the different parts of speech the word corresponds to (if available) - see below for reference. ⬇️
- **forms:** (→ _f_) the different "forms" of the word
  - **traditional:** (→ _t_) corresponds to the main word in Traditional Chinese characters (正體字)
  - **transcriptions:** (→ _i_) different transliterations/transcriptions
    - **pinyin:** (→ _y_) the [Hanyu Pinyin](https://en.wikipedia.org/wiki/Pinyin) (汉语拼音) romanization with tone marks
    - **numeric:** (→ _n_) same as above, only with numeric notation for the tones
    - **wadegiles:** (→ _w_) transliteration of the word in [Wade-Giles](https://en.wikipedia.org/wiki/Wade%E2%80%93Giles) (威翟式拼音)
    - **bopomofo:** (→ _b_) transliteration of the word in [Bopomofo/Zhuyin](https://en.wikipedia.org/wiki/Bopomofo) (注音)
    - **romatzyh:** (→ _g_) transliteration of the word in [Gwoyeu Romatzyh](https://en.wikipedia.org/wiki/Gwoyeu_Romatzyh) (国语罗马字)
  - **meanings:** (→ _m_) a list of dictionary definitions for the current words (💡 all meanings have been cleaned and sanitized - as much as possible - with the possible classifier annotations extracted and presented as a separate entry)
  - **classifiers:** (→ _c_) the list of [measure words](https://en.wikipedia.org/wiki/Chinese_classifier) (classifiers) associated with the word form in question (if any)

> [!NOTE] > **Wordlists by level**
>
> The same data has been divided by HSK level (different sets for the new and old ones), and also in 'exclusive' vs 'inclusive' (does it include just the new words for each level, or _all_ of the words _up to_ that level?). So, let's say you want to find the complete list for the new (HSK 3.0) level 2, you would go to: `wordlists/inclusive/new/2.json` (with the minified version, changing `2.json` with `2.min.json`)

---

### 📖 Reference

#### Levels

| Level   | HSK 2.0          | HSK 3.0          |
| ------- | ---------------- | ---------------- |
| **1**   | `old-1` (→ _o1_) | `new-1` (→ _n1_) |
| **2**   | `old-2` (→ _o2_) | `new-2` (→ _n2_) |
| **3**   | `old-3` (→ _o3_) | `new-3` (→ _n3_) |
| **4**   | `old-4` (→ _o4_) | `new-4` (→ _n4_) |
| **5**   | `old-5` (→ _o5_) | `new-5` (→ _n5_) |
| **6**   | `old-6` (→ _o6_) | `new-6` (→ _n6_) |
| **7-9** | ---              | `new-7` (→ _n7_) |

#### Parts of Speech

| **Code** | **Meaning**                     | **Code** | **Meaning**                           |
| -------- | ------------------------------- | -------- | ------------------------------------- |
| **a**    | adjective                       | **ns**   | place name                            |
| **ad**   | adjective as adverbial          | **nt**   | organization name                     |
| **ag**   | adjective morpheme              | **nx**   | nominal character string              |
| **an**   | adjective with nominal function | **nz**   | other proper noun                     |
| **b**    | non-predicate adjective         | **o**    | onomatopoeia                          |
| **c**    | conjunction                     | **p**    | preposition                           |
| **d**    | adverb                          | **q**    | classifier                            |
| **dg**   | adverb morpheme                 | **r**    | pronoun                               |
| **e**    | interjection                    | **rg**   | pronoun morpheme                      |
| **f**    | directional locality            | **s**    | space word                            |
| **g**    | morpheme                        | **t**    | time word                             |
| **h**    | prefix                          | **tg**   | time word morpheme                    |
| **i**    | idiom                           | **u**    | auxiliary                             |
| **j**    | abbreviation                    | **v**    | verb                                  |
| **k**    | suffix                          | **vd**   | verb as adverbial                     |
| **l**    | fixed expressions               | **vg**   | verb morpheme                         |
| **m**    | numeral                         | **vn**   | verb with nominal function            |
| **mg**   | numeric morpheme                | **w**    | symbol and non-sentential punctuation |
| **n**    | common noun                     | **x**    | unclassified items                    |
| **ng**   | noun morpheme                   | **y**    | modal particle                        |
| **nr**   | personal name                   | **z**    | descriptive                           |

---
