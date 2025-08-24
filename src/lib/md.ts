// Minimal, dependency-free Markdown-ish renderer with glow.
// Supports: #/##/### headings, paragraphs, unordered lists (- or *),
// inline **bold**, *italic*, `code`, [links](url), and ==glow== → <mark class="glow-mark">…</mark>.
// Everything is escaped first to avoid HTML injection.

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function inlineTransform(s: string) {
  // code spans first (to avoid formatting inside code)
  s = s.replace(/`([^`]+)`/g, (_m, g1) => `<code>${g1}</code>`)
  // bold, italic
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
  s = s.replace(/\*([^*]+)\*/g, "<em>$1</em>")
  // links [text](url)
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_m, text, url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`)
  // glow ==...==
  s = s.replace(/==([^=]+)==/g, `<mark class="glow-mark">$1</mark>`)
  return s
}

export function renderMiniMdToHtml(md: string): string {
  const lines = md.replace(/\r\n?/g, "\n").split("\n")
  const out: string[] = []
  let inList = false

  const flushList = () => { if (inList) { out.push("</ul>"); inList = false } }

  for (let raw of lines) {
    let line = escapeHtml(raw)

    // headings
    if (/^###\s+/.test(line)) { flushList(); out.push(`<h3>${inlineTransform(line.replace(/^###\s+/, ""))}</h3>`); continue }
    if (/^##\s+/.test(line))  { flushList(); out.push(`<h2>${inlineTransform(line.replace(/^##\s+/, ""))}</h2>`);  continue }
    if (/^#\s+/.test(line))   { flushList(); out.push(`<h1>${inlineTransform(line.replace(/^#\s+/, ""))}</h1>`);   continue }

    // list items
    if (/^\s*([-*])\s+/.test(line)) {
      if (!inList) { out.push("<ul>"); inList = true }
      out.push(`<li>${inlineTransform(line.replace(/^\s*([-*])\s+/, ""))}</li>`)
      continue
    } else {
      flushList()
    }

    // blank → paragraph break
    if (/^\s*$/.test(line)) { out.push(""); continue }

    // paragraph
    out.push(`<p>${inlineTransform(line)}</p>`)
  }

  flushList()
  return out.join("\n").replace(/\n{3,}/g, "\n\n")
}

/** Split rendered HTML into blocks we can classify as paragraphs or others. */
export function htmlToBlocks(html: string): { html: string; type: "para" | "other" }[] {
  const frag = document.createElement("div")
  frag.innerHTML = html
  const blocks: { html: string; type: "para" | "other" }[] = []
  Array.from(frag.childNodes).forEach(node => {
    if (node.nodeType !== Node.ELEMENT_NODE) return
    const el = node as HTMLElement
    if (el.tagName.toLowerCase() === "p") blocks.push({ html: el.innerHTML, type: "para" })
    else blocks.push({ html: el.outerHTML, type: "other" })
  })
  return blocks
}