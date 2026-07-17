'use client';

import { useState, useEffect } from 'react';
import { Oneko } from './oneko';
import { Oinu } from './oinu';

export function Pet() {
  const [activePet, setActivePet] = useState<'cat' | 'dog' | null>(null);

  useEffect(() => {
    // Randomly choose between cat (Oneko) and dog (Oinu) on mount
    setActivePet(Math.random() < 0.5 ? 'cat' : 'dog');
  }, []);

  if (activePet === 'cat') return <Oneko />;
  if (activePet === 'dog') return <Oinu />;
  return null;
}
