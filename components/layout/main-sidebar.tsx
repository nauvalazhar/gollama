'use client';

import {
  Sidebar,
  SidebarProvider,
  SidebarMenu,
  SidebarTrigger,
  SidebarMenuContent,
  SidebarHeader,
  SidebarTitle,
  SidebarList,
  SidebarItem,
  SidebarSeparator,
  SidebarSubtitle,
} from '@/components/layout/sidebar';
import {
  MessagesSquare,
  PanelRightClose,
  PanelRightOpen,
  PlusIcon,
} from 'lucide-react';
import Link from 'next/link';
import { cn, fetcher } from '@/lib/utils';
import { Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchButton } from '@/components/command/search-button';
import useSWR from 'swr';
import { Fragment, Suspense } from 'react';
import { Chat, ChatHistoryGroup } from '@/database/types';
import { useParams } from 'next/navigation';

export function MainSidebar({
  dock,
  handleDock,
}: {
  dock: boolean;
  handleDock: () => void;
}) {
  return (
    <SidebarProvider value={{ dock }}>
      <Sidebar>
        <div
          className={cn(
            'flex items-center justify-center size-12 rounded-2xl',
            'bg-primary'
          )}
        >
          <Bot className="size-6" />
        </div>

        <SidebarSeparator />

        <div className="flex flex-col gap-2">
          <SidebarMenu>
            <SidebarTrigger>
              <MessagesSquare className="size-6" />
            </SidebarTrigger>
            <SidebarMenuContent>
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
                <Suspense fallback={<div>Loading...</div>}>
                  <ChatHistory />
                </Suspense>
              </div>
            </SidebarMenuContent>
          </SidebarMenu>
        </div>

        <Button
          onClick={handleDock}
          aria-label={dock ? 'Expand sidebar' : 'Collapse sidebar'}
          variant="outline"
          size="icon"
          className="mt-auto"
        >
          {dock ? (
            <PanelRightClose className="size-4" />
          ) : (
            <PanelRightOpen className="size-4" />
          )}
        </Button>
      </Sidebar>
    </SidebarProvider>
  );
}

function ChatHistory() {
  const { data } = useSWR<ChatHistoryGroup[]>('/api/chat/history', fetcher);
  const params = useParams();

  if (!data) return null;

  return (
    <>
      {data.map((group) => (
        <Fragment key={group.date}>
          <SidebarSubtitle>{group.date}</SidebarSubtitle>
          <SidebarList key={group.date}>
            {group.chats.map((chat) => (
              <SidebarItem
                key={chat.id}
                href={`/chat/${chat.id}`}
                active={params.id === chat.id}
              >
                {chat.title}
              </SidebarItem>
            ))}
          </SidebarList>
        </Fragment>
      ))}
    </>
  );
}
