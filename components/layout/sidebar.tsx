'use client';

import { useState } from 'react';
import { Bot, ChevronLeft, ChevronRight, PlusIcon, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SearchButton } from '@/components/command/search-button';

export function Sidebar({
  handleCollapse,
  collapse,
}: {
  handleCollapse: () => void;
  collapse: boolean;
}) {
  return (
    <aside className="flex h-full">
      <div
        className={cn(
          'w-(--sidebar-first-width) bg-background z-10 flex flex-col items-center py-4',
          !collapse && 'border-r border-border'
        )}
      >
        <div
          className={cn(
            'flex items-center justify-center size-12 rounded-2xl',
            'bg-white/10'
          )}
        >
          <Bot className="size-6" />
        </div>
        <Button
          onClick={handleCollapse}
          aria-label={collapse ? 'Expand sidebar' : 'Collapse sidebar'}
          variant="outline"
          size="icon"
          className="mt-auto"
        >
          {collapse ? (
            <ChevronRight className="size-4" />
          ) : (
            <ChevronLeft className="size-4" />
          )}
        </Button>
      </div>

      <div
        className={cn(
          'bg-background transition-all duration-150 ease-in-out',
          'flex flex-col',
          'w-(--sidebar-second-width)',
          collapse && '-translate-x-full'
        )}
      >
        <SidebarHeader>
          <SidebarTitle>Chat History</SidebarTitle>
          <SearchButton />
        </SidebarHeader>
        <div className="px-4">
          <Button className="w-full py-5" asChild>
            <Link href="/">
              <PlusIcon className="size-4" />
              New chat
            </Link>
          </Button>
        </div>
        <div className="overflow-y-auto px-4 h-full mt-6">
          <SidebarSubtitle>Today</SidebarSubtitle>
          <SidebarList>
            <SidebarItem active>What is React Server Components?</SidebarItem>
            <SidebarItem>How to optimize Next.js performance?</SidebarItem>
            <SidebarItem>Explain TypeScript generics with examples</SidebarItem>
          </SidebarList>

          <SidebarSubtitle>Yesterday</SidebarSubtitle>
          <SidebarList>
            <SidebarItem>Best practices for React hooks</SidebarItem>
            <SidebarItem>Compare Tailwind vs CSS Modules</SidebarItem>
            <SidebarItem>Building accessible React components</SidebarItem>
            <SidebarItem>State management in modern React</SidebarItem>
          </SidebarList>

          <SidebarSubtitle>Previous 7 Days</SidebarSubtitle>
          <SidebarList>
            <SidebarItem>Implementing dark mode with Tailwind</SidebarItem>
            <SidebarItem>Using the App Router in Next.js 13+</SidebarItem>
            <SidebarItem>Debugging memory leaks in React</SidebarItem>
            <SidebarItem>Setting up CI/CD for Next.js projects</SidebarItem>
          </SidebarList>

          <SidebarSubtitle>Older</SidebarSubtitle>
          <SidebarList>
            <SidebarItem>Authentication patterns in Next.js</SidebarItem>
            <SidebarItem>Optimizing React component re-renders</SidebarItem>
            <SidebarItem>Working with WebSockets in Next.js</SidebarItem>
            <SidebarItem>Implementing infinite scroll</SidebarItem>
            <SidebarItem>Building a custom React hook</SidebarItem>
            <SidebarItem>Server-side vs Client-side pagination</SidebarItem>
            <SidebarItem>Mastering TypeScript utility types</SidebarItem>
            <SidebarItem>GraphQL vs REST in Next.js</SidebarItem>
            <SidebarItem>React performance profiling</SidebarItem>
            <SidebarItem>Building a design system</SidebarItem>
            <SidebarItem>Testing React components</SidebarItem>
            <SidebarItem>State machines in React</SidebarItem>
          </SidebarList>
        </div>
      </div>
    </aside>
  );
}

function SidebarHeader({ children }: { children: React.ReactNode }) {
  return (
    <header className="flex items-center justify-between mb-6 p-4 pb-0">
      {children}
    </header>
  );
}

function SidebarTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="font-semibold text-lg">{children}</h2>;
}

function SidebarSubtitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className={cn(
        'font-semibold mb-2 -mx-4 px-4 text-sm bg-background text-muted-foreground',
        'sticky top-0 z-10'
      )}
    >
      {children}
    </h3>
  );
}

function SidebarList({ children }: { children: React.ReactNode }) {
  return (
    <ul className="flex flex-col -mx-2 gap-0.5 mb-6 relative">{children}</ul>
  );
}

function SidebarItem({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <li>
      <Link
        href="/"
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
