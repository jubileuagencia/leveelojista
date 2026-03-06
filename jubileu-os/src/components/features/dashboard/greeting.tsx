'use client';

import { useSyncExternalStore } from 'react';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

const subscribe = () => () => {};

export function Greeting({ name }: { name: string }) {
  const greeting = useSyncExternalStore(
    subscribe,
    () => getGreeting(),
    () => ''
  );

  if (!greeting) return null;

  return (
    <h1 className="text-2xl font-bold tracking-tight">
      {greeting}, {name.split(' ')[0]}
    </h1>
  );
}
