// Mini resaltador de sintaxis para TypeScript / bash (sin dependencias)

const KEYWORDS = new Set([
  'import', 'from', 'export', 'class', 'const', 'let', 'var', 'return', 'async', 'await',
  'new', 'if', 'else', 'throw', 'private', 'public', 'protected', 'readonly', 'constructor',
  'extends', 'implements', 'interface', 'type', 'this', 'true', 'false', 'null', 'undefined',
  'for', 'of', 'in', 'try', 'catch', 'function', 'default', 'static', 'void', 'typeof',
  'npm', 'npx', 'cd', 'git',
]);

const TYPES = new Set([
  'string', 'number', 'boolean', 'Promise', 'Date', 'any', 'unknown', 'never', 'Record',
]);

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const TOKEN_RE =
  /((?<!:)\/\/[^\n]*|#[^\n]*|\/\*[\s\S]*?\*\/)|('(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`)|(@[A-Za-z_]\w*)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)(?=\s*\()|([A-Za-z_$][\w$]*)/g;

export function highlight(code: string, lang: 'ts' | 'bash' = 'ts'): string {
  let out = '';
  let last = 0;
  let m: RegExpExecArray | null;
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(code))) {
    out += escapeHtml(code.slice(last, m.index));
    const [full, com, str, dec, num, fn, word] = m;
    if (com) {
      // En TS, "#" no es comentario; en bash sí.
      if (com.startsWith('#') && lang === 'ts') out += escapeHtml(com);
      else out += `<span class="tok-com">${escapeHtml(com)}</span>`;
    } else if (str) out += `<span class="tok-str">${escapeHtml(str)}</span>`;
    else if (dec) out += `<span class="tok-dec">${escapeHtml(dec)}</span>`;
    else if (num) out += `<span class="tok-num">${num}</span>`;
    else if (fn) {
      if (KEYWORDS.has(fn)) out += `<span class="tok-kw">${fn}</span>`;
      else out += `<span class="tok-fn">${fn}</span>`;
    } else if (word) {
      if (KEYWORDS.has(word)) out += `<span class="tok-kw">${word}</span>`;
      else if (TYPES.has(word) || /^[A-Z]/.test(word)) out += `<span class="tok-type">${word}</span>`;
      else out += word;
    } else out += escapeHtml(full);
    last = m.index + full.length;
  }
  out += escapeHtml(code.slice(last));
  return out;
}
