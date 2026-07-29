'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const Oneko = dynamic(() => import('./oneko').then((mod) => mod.Oneko), { ssr: false });
const Oinu = dynamic(() => import('./oinu').then((mod) => mod.Oinu), { ssr: false });
const Ousagi = dynamic(() => import('./ousagi').then((mod) => mod.Ousagi), { ssr: false });

export function Pet() {
  const [activePet, setActivePet] = useState<'cat' | 'dog' | 'rabbit' | null>(null);

  useEffect(() => {
    // Randomly choose between cat (Oneko), dog (Oinu), and rabbit (Ousagi) on mount
    const rand = Math.random();
    if (rand < 0.33) {
      setActivePet('cat');
    } else if (rand < 0.66) {
      setActivePet('dog');
    } else {
      setActivePet('rabbit');
    }
  }, []);

  if (activePet === 'cat') return <Oneko />;
  if (activePet === 'dog') return <Oinu />;
  if (activePet === 'rabbit') return <Ousagi />;
  return null;
}

