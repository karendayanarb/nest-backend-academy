'use client';

import { useEffect, useState } from 'react';

export default function Typewriter({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[i % words.length];
    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting && text === word) {
      timeout = setTimeout(() => setDeleting(true), 1600);
    } else if (deleting && text === '') {
      setDeleting(false);
      setI((n) => n + 1);
    } else {
      timeout = setTimeout(
        () => setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1)),
        deleting ? 45 : 90
      );
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, i, words]);

  return <span className="typewriter">{text || ' '}</span>;}
