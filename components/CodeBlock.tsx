'use client';

import { useState } from 'react';
import { LuCopy, LuCheck } from 'react-icons/lu';
import { highlight } from '@/lib/highlight';

type Props = {
  code: string;
  file?: string;
  lang?: 'ts' | 'bash';
};

export default function CodeBlock({ code, file = 'main.ts', lang = 'ts' }: Props) {
  const [copied, setCopied] = useState(false);
  const clean = code.replace(/^\n+|\s+$/g, '');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(clean);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* el portapapeles puede no estar disponible */
    }
  };

  return (
    <div className="code-block">
      <div className="code-header">
        <div className="dots">
          <span />
          <span />
          <span />
        </div>
        <span className="code-file">{file}</span>
        <button className="copy-btn" onClick={copy} aria-label="Copiar código">
          {copied ? <LuCheck /> : <LuCopy />}
          {copied ? '¡Copiado!' : 'Copiar'}
        </button>
      </div>
      <pre>
        <code dangerouslySetInnerHTML={{ __html: highlight(clean, lang) }} />
      </pre>
    </div>
  );
}
