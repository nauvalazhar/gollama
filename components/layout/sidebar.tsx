'use client';

import { createContext, memo, useContext } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Slot } from '@radix-ui/react-slot';

export const SidebarContext = createContext({
  dock: false,
});

export const useSidebar = () => useContext(SidebarContext);

export function SidebarProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: { dock: boolean };
}) {
  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <aside className="flex fixed top-0 left-0 h-full z-10 group/sidebar">
      <div
        className={cn(
          'w-(--sidebar-first-width) bg-background flex flex-col items-center py-4'
        )}
      >
        {children}
      </div>
    </aside>
  );
}

export function SidebarSeparator() {
  return <div className="w-8 h-px bg-white/10 my-6" />;
}

export function SidebarTrigger({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center size-12 rounded-2xl cursor-pointer',
        'bg-white/10 hover:bg-white/15 transition-all duration-150 ease-in-out'
      )}
    >
      {children}
    </div>
  );
}

export function SidebarMenu({ children }: { children: React.ReactNode }) {
  return <div className={cn('group sidebar-menu')}>{children}</div>;
}

export function SidebarMenuContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { dock } = useSidebar();

  return (
    <div
      className={cn(
        'absolute top-0 left-(--sidebar-first-width) h-full -z-10',
        'bg-background/60 backdrop-blur-lg transition-all duration-150 ease-in-out',
        'flex flex-col border-r border-transparent',
        'w-(--sidebar-second-width)',
        'sidebar-menu-content',
        'before:w-px before:h-full before:bg-border before:absolute before:top-0 before:left-0',
        dock && [
          'border-border invisible opacity-0 -translate-x-10',
          'group-hover/sidebar:visible group-hover/sidebar:opacity-100 group-hover/sidebar:-translate-x-0',
        ]
      )}
    >
      {children}
    </div>
  );
}

export function SidebarHeader({ children }: { children: React.ReactNode }) {
  return (
    <header className="flex items-center justify-between mb-6 p-4 pb-0">
      {children}
    </header>
  );
}

export function SidebarTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="font-semibold text-lg">{children}</h2>;
}

export function SidebarSubtitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        'font-semibold mb-2 -mx-4 px-4 text-sm text-muted-foreground',
        className
      )}
    >
      {children}
    </h3>
  );
}

export function SidebarList({ children }: { children: React.ReactNode }) {
  return (
    <ul className="flex flex-col gap-0.5 mb-6 -mx-2 relative">{children}</ul>
  );
}

function PureSidebarLink({
  children,
  href,
  active,
}: {
  children: React.ReactNode;
  href: string;
  active?: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        className={cn(
          'inline-block w-full text-left rounded-lg p-2 relative',
          'border border-transparent',
          'hover:bg-white/5 hover:border-border',
          'transition-all duration-150 ease-in-out',
          active
            ? 'bg-white/10 border-border text-white font-medium'
            : 'text-white font-light'
        )}
      >
        <div className="overflow-hidden whitespace-nowrap">{children}</div>
      </Link>
    </li>
  );
}

export const SidebarLink = memo(PureSidebarLink, (prev, next) => {
  if (prev.href !== next.href) return false;
  if (prev.active !== next.active) return false;
  if (prev.children !== next.children) return false;

  return true;
});

export function SidebarGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn('flex flex-col', 'bg-white/5 rounded-xl mb-6')}>
      {children}
    </div>
  );
}

export function SidebarItem({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'flex items-center group/sidebar-item',
        'border-b last:border-b-0',
        'first:rounded-t-xl last:rounded-b-xl',
        'hover:bg-white/5 hover:text-white'
      )}
    >
      {children}
    </div>
  );
}

export function SidebarItemTrigger({
  children,
  asChild,
}: {
  children: React.ReactNode;
  asChild?: boolean;
}) {
  const Component = asChild ? Slot : 'button';

  return (
    <Component
      className={cn(
        'flex items-center gap-4 w-full cursor-pointer',
        'px-4 h-10 text-white/80'
      )}
    >
      {children}
    </Component>
  );
}

export function SidebarItemAction({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn('ml-auto pr-4 flex items-center flex-shrink-0')}>
      {children}
    </div>
  );
}
