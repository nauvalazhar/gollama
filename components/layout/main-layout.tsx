'use client';

import { Sidebar } from '@/components/layout/sidebar';
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
  const [isSecondaryCollapsed, setIsSecondaryCollapsed] = useState(
    sidebarFromCookie || false
  );

  useHotkeys('ctrl+b', () => {
    setIsSecondaryCollapsed(!isSecondaryCollapsed);
  });

  const handleCollapse = () => {
    const isCollapsed = !isSecondaryCollapsed;
    setIsSecondaryCollapsed(isCollapsed);
    document.cookie = `sidebarCollapsed=${isCollapsed};path=/;max-age=31536000`;
  };

  return (
    <div className="flex h-dvh w-dvw overflow-hidden">
      <Sidebar
        collapse={isSecondaryCollapsed}
        handleCollapse={handleCollapse}
      />
      <main
        className={cn(
          'w-full h-full transition-all duration-150 ease-in-out relative',
          'shadow-2xl decoration-before bg-after after:bg-main',
          isSecondaryCollapsed && '-ml-(--sidebar-second-width)'
        )}
      >
        {children}
      </main>
    </div>
  );
}
