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
  SidebarLink,
  SidebarSeparator,
  SidebarSubtitle,
  SidebarGroup,
  SidebarItem,
} from '@/components/layout/sidebar';
import {
  Archive,
  Bookmark,
  Folder,
  FolderArchive,
  FolderHeart,
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
import { Tabs, TabsTrigger, TabsList, TabsContent } from '@/components/ui/tabs';

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

              <Tabs
                defaultValue="chat"
                className="h-full overflow-hidden flex flex-col"
              >
                <div className="px-4">
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="chat">Chat</TabsTrigger>
                    <TabsTrigger value="folder">Folder</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="chat" className="overflow-y-auto mt-6 px-4">
                  <Suspense fallback={<div>Loading...</div>}>
                    <ChatHistory />
                  </Suspense>
                </TabsContent>
                <TabsContent value="folder" className="px-4 mt-6">
                  <ChatFolder />
                </TabsContent>
              </Tabs>
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
              <SidebarLink
                key={chat.id}
                href={`/chat/${chat.id}`}
                active={params.id === chat.id}
              >
                {chat.title}
              </SidebarLink>
            ))}
          </SidebarList>
        </Fragment>
      ))}
    </>
  );
}

function ChatFolder() {
  return (
    <div>
      <SidebarSubtitle>Special Folder</SidebarSubtitle>
      <SidebarGroup>
        <SidebarItem>
          <Bookmark className="size-4" />
          Bookmarks
        </SidebarItem>
        <SidebarItem>
          <Archive className="size-4" />
          Archived
        </SidebarItem>
      </SidebarGroup>

      <SidebarSubtitle>Your Folder</SidebarSubtitle>
      <SidebarGroup>
        <SidebarItem>
          <Folder className="size-4" />
          All Chats
        </SidebarItem>
        <SidebarItem>
          <Folder className="size-4" />
          Folder 1
        </SidebarItem>
        <SidebarItem>
          <Folder className="size-4" />
          Folder 2
        </SidebarItem>
        <SidebarItem>
          <Folder className="size-4" />
          Folder 3
        </SidebarItem>
      </SidebarGroup>
    </div>
  );
}
