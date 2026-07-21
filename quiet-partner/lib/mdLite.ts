/**
 * Minimal Markdown → HTML (tables, headings, lists) — no CDN.
 * Used for ProjectM cheatsheets on /stages/docs/[slug].
 */
function esc(s: string) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inline(s: string) {
  let out = esc(s);
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  out = out.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-primary underline-offset-2 hover:underline">$1</a>',
  );
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, "$1<em>$2</em>");
  return out;
}

function isTableSep(line: string) {
  return /^\|?[\s:-]+\|[\s|:-]*$/.test(line.trim());
}

function parseTable(lines: string[], start: number) {
  const rows: string[][] = [];
  let i = start;
  while (i < lines.length && lines[i].includes("|")) {
    if (isTableSep(lines[i])) {
      i++;
      continue;
    }
    const cells = lines[i]
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((c) => c.trim());
    rows.push(cells);
    i++;
  }
  if (!rows.length) return { html: "", next: start + 1 };
  let html =
    '<div class="my-4 overflow-x-auto"><table class="w-max min-w-full border-collapse text-sm"><thead><tr>';
  for (const c of rows[0]) {
    html += `<th class="border border-border bg-muted/50 px-2 py-1.5 text-left font-medium">${inline(c)}</th>`;
  }
  html += "</tr></thead><tbody>";
  for (let r = 1; r < rows.length; r++) {
    html += "<tr>";
    for (const c of rows[r]) {
      html += `<td class="border border-border px-2 py-1.5 align-top">${inline(c)}</td>`;
    }
    html += "</tr>";
  }
  html += "</tbody></table></div>";
  return { html, next: i };
}

/** Convert Markdown source to safe HTML string. */
export function mdLite(src: string): string {
  const lines = String(src).replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let i = 0;
  let inCode = false;
  const codeBuf: string[] = [];
  let listType: "ul" | "ol" | null = null;
  const listItems: string[] = [];

  function flushList() {
    if (!listType) return;
    out.push(`<${listType} class="my-3 list-outside space-y-1 pl-5">`);
    for (const it of listItems) out.push(`<li>${inline(it)}</li>`);
    out.push(`</${listType}>`);
    listType = null;
    listItems.length = 0;
  }

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```")) {
      flushList();
      if (!inCode) {
        inCode = true;
        codeBuf.length = 0;
      } else {
        out.push(
          `<pre class="my-3 overflow-auto rounded-lg bg-muted p-3 text-sm whitespace-pre-wrap"><code>${esc(codeBuf.join("\n"))}</code></pre>`,
        );
        inCode = false;
      }
      i++;
      continue;
    }
    if (inCode) {
      codeBuf.push(line);
      i++;
      continue;
    }

    if (
      line.includes("|") &&
      i + 1 < lines.length &&
      isTableSep(lines[i + 1])
    ) {
      flushList();
      const t = parseTable(lines, i);
      out.push(t.html);
      i = t.next;
      continue;
    }

    if (/^\s*$/.test(line)) {
      flushList();
      i++;
      continue;
    }

    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      flushList();
      out.push('<hr class="my-6 border-border" />');
      i++;
      continue;
    }

    const hm = /^(#{1,6})\s+(.*)$/.exec(line);
    if (hm) {
      flushList();
      const lvl = hm[1].length;
      const cls =
        lvl === 1
          ? "mt-0 text-2xl font-semibold tracking-tight"
          : lvl === 2
            ? "mt-8 border-b border-border pb-1 text-lg font-semibold"
            : "mt-6 text-base font-semibold";
      out.push(`<h${lvl} class="${cls}">${inline(hm[2])}</h${lvl}>`);
      i++;
      continue;
    }

    if (line.startsWith(">")) {
      flushList();
      const q: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) {
        q.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      out.push(
        `<blockquote class="my-4 border-l-4 border-primary/40 bg-muted/40 px-3 py-2 text-sm">${inline(q.join(" "))}</blockquote>`,
      );
      continue;
    }

    const ul = /^[-*+]\s+(.*)$/.exec(line);
    const ol = /^\d+\.\s+(.*)$/.exec(line);
    if (ul || ol) {
      const typ = ul ? "ul" : "ol";
      const txt = ul ? ul[1] : ol![1];
      if (listType && listType !== typ) flushList();
      listType = typ;
      listItems.push(txt);
      i++;
      continue;
    }

    flushList();
    const paras = [line];
    i++;
    while (
      i < lines.length &&
      !/^\s*$/.test(lines[i]) &&
      !/^#{1,6}\s/.test(lines[i]) &&
      !/^[-*+]\s/.test(lines[i]) &&
      !/^\d+\.\s/.test(lines[i]) &&
      !/^>/.test(lines[i]) &&
      !/^```/.test(lines[i]) &&
      !(
        lines[i].includes("|") &&
        i + 1 < lines.length &&
        isTableSep(lines[i + 1])
      ) &&
      !/^(-{3,}|\*{3,}|_{3,})\s*$/.test(lines[i])
    ) {
      paras.push(lines[i]);
      i++;
    }
    out.push(`<p class="my-3 text-sm leading-relaxed text-foreground/90">${inline(paras.join(" "))}</p>`);
  }
  flushList();
  return out.join("\n");
}
