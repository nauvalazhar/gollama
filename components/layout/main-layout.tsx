'use client';

import { MainSidebar } from '@/components/layout/main-sidebar';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

export function MainLayout({
  children,
  sidebarFromCookie,
}: {
  children: React.ReactNode;
  sidebarFromCookie?: boolean;
}) {
  const [isDocked, setIsDocked] = useState(sidebarFromCookie || false);

  useHotkeys('ctrl+b', () => {
    setIsDocked(!isDocked);
  });

  const handleDock = () => {
    const _isDocked = !isDocked;
    setIsDocked(_isDocked);
    document.cookie = `sidebarDocked=${_isDocked};path=/;max-age=31536000`;
  };

  return (
    <div className="flex h-dvh w-dvw overflow-hidden">
      <MainSidebar dock={isDocked} handleDock={handleDock} />
      <main
        className={cn(
          'w-full h-full transition-all duration-150 ease-in-out relative',
          'shadow-2xl decoration-before bg-after after:bg-main',
          isDocked ? 'ml-(--sidebar-first-width)' : 'ml-(--sidebar-width)'
        )}
      >
        {children}
      </main>
    </div>
  );
}
