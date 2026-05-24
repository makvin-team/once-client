// Citation parsing for the learner assistant. Ported from the ai-frontend
// chat logic, trimmed to the regulatory-source case (the learner assistant
// never returns uploaded-file/PDF citations, so the file-citation branch and
// the lex.uz document viewer are intentionally omitted).
//
// The assistant streams answer text with inline brackets like
// `[O'RQ-1127 — 16-modda]`. We match each bracket against the regulatory
// sources the backend sent for the turn, replace recognized brackets with
// numbered chips, and hand back a markdown-safe copy of the text with those
// brackets escaped so react-markdown leaves them alone.

export interface RegulatorySource {
  document_id?: string | null;
  source_id?: string | null;
  doc_number?: string | null;
  doc_type?: string | null;
  title?: string | null;
  language?: string | null;
  status?: "Y" | "R" | "N" | string | null;
  effective_date?: string | null;
  acceptance_date?: string | null;
  obsolete_date?: string | null;
  primary_anchor_id?: string | null;
  clause_anchor_id?: string | null;
  clause_label?: string | null;
}

export type CitationKind = "file" | "regulatory";

export interface Citation {
  kind: CitationKind;
  reference: string;
  index: number;
  /** Compact label for the chip/reference row. */
  label: string;
  // file-citation fields
  filename?: string;
  page?: number;
  // regulatory-citation fields
  regulatorySource?: RegulatorySource;
}

export interface CitationFragment {
  type: "text" | "citation";
  value?: string;
  citation?: Citation;
}

export interface ParsedCitations {
  fragments: CitationFragment[];
  citations: Citation[];
  /** Same text with citation brackets escaped so react-markdown ignores them. */
  markdownSafeText: string;
}

const normalizeReference = (value: string): string =>
  value.trim().replace(/^["'`]+|["'`]+$/g, "");

// Cyrillic/Latin look-alikes the LLM and the source data mix freely. Folding
// them to a single alphabet keeps the substring match from failing on a
// visually-identical-but-different codepoint.
const normalizeConfusableChars = (value: string): string =>
  value
    .replace(/[А]/g, "A")
    .replace(/[В]/g, "B")
    .replace(/[С]/g, "C")
    .replace(/[Е]/g, "E")
    .replace(/[Н]/g, "H")
    .replace(/[К]/g, "K")
    .replace(/[М]/g, "M")
    .replace(/[О]/g, "O")
    .replace(/[Р]/g, "P")
    .replace(/[Т]/g, "T")
    .replace(/[Х]/g, "X")
    .replace(/[У]/g, "Y")
    .replace(/[а]/g, "a")
    .replace(/[с]/g, "c")
    .replace(/[е]/g, "e")
    .replace(/[о]/g, "o")
    .replace(/[р]/g, "p")
    .replace(/[х]/g, "x")
    .replace(/[у]/g, "y")
    .replace(/[Қ]/g, "Q")
    .replace(/[қ]/g, "q")
    .replace(/[Ғ]/g, "G")
    .replace(/[ғ]/g, "g")
    .replace(/[Ҳ]/g, "H")
    .replace(/[ҳ]/g, "h")
    .replace(/[Ў]/g, "O'")
    .replace(/[ў]/g, "o'")
    .replace(/[Ё]/g, "Yo")
    .replace(/[ё]/g, "yo");

// Shared by parseCitations (first pass) and the inline lookup in
// AssistantAnswer (second pass). Both passes MUST canonicalize identically, or
// react-markdown's own text transforms (smart quotes, NFKC) break the lookup.
export const canonicalizeReferenceForMatch = (value: string): string =>
  normalizeConfusableChars(normalizeReference(value))
    .normalize("NFKC")
    .replace(/[’‘`´ʻʼʹˈ]/g, "'")
    .replace(/[‐-―−]/g, "-")
    .replace(/\s+/g, " ")
    .toLowerCase();

// The LLM sometimes drops the apostrophe from a doc_number (`ORQ-1127` for
// `O'RQ-1127`). Strip apostrophes on both sides for matching only — display
// strings keep their originals.
const stripApostrophes = (value: string): string => value.replace(/'/g, "");

const includesTolerant = (haystack: string, needle: string): boolean => {
  if (haystack.includes(needle)) return true;
  const haystackBare = stripApostrophes(haystack);
  const needleBare = stripApostrophes(needle);
  return needleBare.length > 0 && haystackBare.includes(needleBare);
};

const BRACKET_REGEX = /[[【]([^\]】]+?)[\]】]/g;

// A bracket is a file citation when it looks like `name.ext` (optionally with
// `#page=N`) — e.g. `[fraud-policy.pdf#page=4]`.
const isFileLikeReference = (value: string): boolean =>
  /[^\s]\.[a-zA-Z0-9]{1,5}(?:#page=\d+)?$/.test(value.trim());

const matchesAvailableSource = (reference: string, source: string): boolean => {
  const a = canonicalizeReferenceForMatch(reference);
  const b = canonicalizeReferenceForMatch(source);
  if (!a || !b) return false;
  if (b === a || b.endsWith(a) || a.endsWith(b)) return true;
  const aBase = a.split("#")[0];
  const bBase = b.split("#")[0];
  return bBase === aBase || bBase.endsWith(aBase) || aBase.endsWith(bBase);
};

// Fallback needle tokens when the full doc_type/title doesn't fit in the
// bracket. Five-char floor avoids matching stop-words ("uchun", "bilan").
const distinctiveTokens = (s: string): string[] =>
  s.split(/\s+/).filter((t) => t.length >= 5);

/**
 * Compact display label: doc_number → doc_type → longest distinctive title
 * token → source_id → fallback. Treats empty strings as missing (the backend
 * sometimes writes `doc_number: ""` for named acts).
 */
export const regulatorySourceLabel = (
  src: RegulatorySource,
  fallback = "—",
): string => {
  const num = src.doc_number?.trim();
  if (num) return num;
  const type = src.doc_type?.trim();
  if (type) return type;
  const title = src.title?.trim();
  if (title) {
    const tokens = distinctiveTokens(title).sort((a, b) => b.length - a.length);
    return tokens[0] ?? title;
  }
  const sid = src.source_id?.trim();
  if (sid) return sid;
  return fallback;
};

const findRegulatoryMatch = (
  bracketContent: string,
  regulatorySources: RegulatorySource[],
): RegulatorySource | null => {
  if (regulatorySources.length === 0) return null;
  const haystack = canonicalizeReferenceForMatch(bracketContent);
  if (!haystack) return null;

  let best: { source: RegulatorySource; score: number } | null = null;
  for (const src of regulatorySources) {
    // Three-tier identifier: doc_number → doc_type → title. Named acts (the
    // Constitution, conventions) often only have a title set.
    const num = src.doc_number ?? undefined;
    const type = src.doc_type ?? undefined;
    const title = src.title ?? undefined;
    let needle = "";
    let isTypeMatch = false;
    let isTitleMatch = false;
    if (num) {
      needle = canonicalizeReferenceForMatch(num);
    }
    if (!needle && type) {
      needle = canonicalizeReferenceForMatch(type);
      isTypeMatch = true;
    }
    if (!needle && title) {
      needle = canonicalizeReferenceForMatch(title);
      isTitleMatch = true;
    }
    if (!needle) continue;

    // Direct substring first; type/title fall back to the longest distinctive
    // token. Numbered docs stay strict — `O'RQ-1127` must appear verbatim.
    let effectiveNeedle = needle;
    if (!includesTolerant(haystack, effectiveNeedle)) {
      if (!isTypeMatch && !isTitleMatch) continue;
      const tokens = distinctiveTokens(needle).sort((a, b) => b.length - a.length);
      const matched = tokens.find((t) => includesTolerant(haystack, t));
      if (!matched) continue;
      effectiveNeedle = matched;
    }

    const langHint = src.language
      ? canonicalizeReferenceForMatch(src.language)
      : "";
    const langBonus = langHint && haystack.includes(langHint) ? 1 : 0;
    // Clause label is the strongest signal when several sources share a
    // doc_number — pick the article the LLM actually cited.
    let clauseBonus = 0;
    if (src.clause_label) {
      const clauseHead = canonicalizeReferenceForMatch(
        String(src.clause_label).split(".", 1)[0] ?? "",
      );
      if (clauseHead && haystack.includes(clauseHead)) {
        clauseBonus = 1000; // dominates other signals
      }
    }
    // Penalties keep doc_number > doc_type > title.
    const typePenalty = isTypeMatch ? -10_000 : 0;
    const titlePenalty = isTitleMatch ? -20_000 : 0;
    const score =
      effectiveNeedle.length * 10 +
      clauseBonus +
      langBonus +
      typePenalty +
      titlePenalty;
    if (!best || score > best.score) {
      best = { source: src, score };
    }
  }
  return best ? best.source : null;
};

/**
 * Parse citation references from assistant answer text. Two shapes:
 *   - File citations: `[name.ext#page=N]` — opens the uploaded file at a page.
 *   - Regulatory citations: any `[...]` matching a regulatory source by
 *     doc_number / doc_type / title — opens the act at the cited article.
 *
 * Returns interleaved fragments, a sequentially-numbered citation list, and a
 * markdown-safe text variant where every recognized bracket is escaped so
 * react-markdown doesn't try to parse it as a link.
 */
export function parseCitations(
  text: string,
  availableSources?: string[],
  regulatorySources?: RegulatorySource[],
): ParsedCitations {
  const citations: Citation[] = [];
  const seenRefs = new Map<string, Citation>();
  const fragments: CitationFragment[] = [];

  const regSources = Array.isArray(regulatorySources) ? regulatorySources : [];
  const fileSources =
    Array.isArray(availableSources) && availableSources.length > 0
      ? availableSources.map((s) => normalizeReference(String(s))).filter(Boolean)
      : [];

  const matched: Array<{ start: number; end: number; inner: string }> = [];
  let bm: RegExpExecArray | null;
  BRACKET_REGEX.lastIndex = 0;
  while ((bm = BRACKET_REGEX.exec(text)) !== null) {
    matched.push({
      start: bm.index,
      end: bm.index + bm[0].length,
      inner: bm[1],
    });
  }

  let lastIndex = 0;
  const escapedRanges: Array<{ start: number; end: number }> = [];

  for (const m of matched) {
    const reference = normalizeReference(m.inner);
    if (!reference) continue;

    let citation: Citation | null = null;

    if (isFileLikeReference(reference)) {
      // Only resolve file citations we can actually open (filename is in the
      // turn's source list); otherwise leave the bracket as plain text.
      if (fileSources.length === 0) continue;
      let filename = reference;
      let page = 1;
      const hashIndex = reference.toLowerCase().indexOf("#page=");
      if (hashIndex !== -1) {
        filename = normalizeReference(reference.substring(0, hashIndex));
        page = parseInt(reference.substring(hashIndex + 6).trim(), 10) || 1;
      }
      const matchedSource = fileSources.find((s) =>
        matchesAvailableSource(reference, s),
      );
      if (!matchedSource) continue;
      const matchedFilename = normalizeReference(matchedSource).split("#")[0];
      if (matchedFilename) filename = matchedFilename;

      const dedupKey = `file::${filename}#${page}`;
      citation = seenRefs.get(dedupKey) ?? null;
      if (!citation) {
        citation = {
          kind: "file",
          reference,
          label: filename,
          filename,
          page,
          index: citations.length + 1,
        };
        seenRefs.set(dedupKey, citation);
        citations.push(citation);
      }
    } else if (regSources.length > 0) {
      const regMatch = findRegulatoryMatch(reference, regSources);
      if (!regMatch) continue;

      // Dedup distinct articles inside the same act so each gets its own index.
      const dedupKey = `reg::${regMatch.document_id ?? ""}|${regMatch.source_id ?? ""}|${regMatch.doc_number ?? ""}|${regMatch.clause_anchor_id ?? ""}|${regMatch.language ?? ""}`;
      citation = seenRefs.get(dedupKey) ?? null;
      if (!citation) {
        citation = {
          kind: "regulatory",
          reference,
          label: regulatorySourceLabel(regMatch, reference),
          regulatorySource: regMatch,
          index: citations.length + 1,
        };
        seenRefs.set(dedupKey, citation);
        citations.push(citation);
      }
    }

    if (!citation) continue;

    if (m.start > lastIndex) {
      fragments.push({ type: "text", value: text.slice(lastIndex, m.start) });
    }
    fragments.push({ type: "citation", citation });
    escapedRanges.push({ start: m.start, end: m.end });
    lastIndex = m.end;
  }

  if (lastIndex < text.length) {
    fragments.push({ type: "text", value: text.slice(lastIndex) });
  }
  if (fragments.length === 0) {
    fragments.push({ type: "text", value: text });
  }

  let markdownSafeText = text;
  if (escapedRanges.length > 0) {
    const out: string[] = [];
    let cursor = 0;
    for (const r of escapedRanges) {
      out.push(text.slice(cursor, r.start));
      const inner = text.slice(r.start + 1, r.end - 1);
      out.push(`\\[${inner}\\]`);
      cursor = r.end;
    }
    out.push(text.slice(cursor));
    markdownSafeText = out.join("");
  }

  return { fragments, citations, markdownSafeText };
}
