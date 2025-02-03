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
  SidebarItemTrigger,
  SidebarItemAction,
} from '@/components/layout/sidebar';
import {
  Archive,
  Bookmark,
  Folder,
  FolderArchive,
  FolderHeart,
  FolderTree,
  Loader2,
  MessagesSquare,
  MoreHorizontal,
  PanelRightClose,
  PanelRightOpen,
  Pencil,
  PlusIcon,
  Trash,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { cn, fetcher } from '@/lib/utils';
import { Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchButton } from '@/components/command/search-button';
import useSWR from 'swr';
import { Fragment, Suspense, useEffect, useRef, useState } from 'react';
import { Chat, ChatHistoryGroup, Folder as FolderDb } from '@/database/types';
import { useParams } from 'next/navigation';
import { Tabs, TabsTrigger, TabsList, TabsContent } from '@/components/ui/tabs';
import { EditableText } from '@/components/ui/editable-text';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  TooltipContent,
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

export function MainSidebar({
  dock,
  handleDock,
}: {
  dock: boolean;
  handleDock: () => void;
}) {
  const { data } = useSWR<{ folders: FolderDb[] }>('/api/chat/folder', fetcher);
  const [folderId, setFolderId] = useState<string | undefined>();
  const [tab, setTab] = useState<'chat' | 'folder'>('chat');

  const handleFolderChange = (value: string) => {
    setFolderId(value === 'all' ? undefined : value);
  };

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

              <div className="px-4 flex items-center gap-2">
                <Select
                  value={folderId}
                  onValueChange={handleFolderChange}
                  disabled={tab === 'folder'}
                >
                  <SelectTrigger>
                    <div className="flex items-center gap-4">
                      <Folder className="size-4 opacity-60" />
                      <SelectValue placeholder="Select a folder" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Chat</SelectItem>
                    {data?.folders.map((folder) => (
                      <SelectItem key={folder.id} value={folder.id}>
                        {folder.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {tab === 'chat' ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="flex-shrink-0"
                          onClick={() => setTab('folder')}
                        >
                          <FolderTree className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">Folder</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="flex-shrink-0"
                          onClick={() => setTab('chat')}
                        >
                          <MessagesSquare className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">Chat</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>

              <Tabs
                value={tab}
                className="h-full overflow-hidden flex flex-col"
              >
                <TabsContent value="chat" className="overflow-y-auto mt-6 px-4">
                  <Suspense fallback={<div>Loading...</div>}>
                    <ChatHistory folderId={folderId} />
                  </Suspense>
                </TabsContent>
                <TabsContent value="folder" className="px-4 mt-6">
                  <ChatFolder />
                </TabsContent>
              </Tabs>

              <div className="pt-4 px-4">
                <SidebarGroup>
                  <SidebarItem>
                    <SidebarItemTrigger>
                      <Bookmark className="size-4" />
                      Bookmarks
                    </SidebarItemTrigger>
                  </SidebarItem>
                  <SidebarItem>
                    <SidebarItemTrigger>
                      <Archive className="size-4" />
                      Archived
                    </SidebarItemTrigger>
                  </SidebarItem>
                </SidebarGroup>
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

function ChatHistory({ folderId }: { folderId: string | undefined }) {
  const { data } = useSWR<ChatHistoryGroup[]>(
    `/api/chat/history${folderId ? `?folderId=${folderId}` : ''}`,
    fetcher
  );
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
      <UserFolder />
    </div>
  );
}

function UserFolder() {
  const { data, isLoading, mutate } = useSWR<{
    folders: FolderDb[];
  }>('/api/chat/folder', fetcher);

  const [newFolder, setNewFolder] = useState(false);
  const [mutatingFolder, setMutatingFolder] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [renameFolder, setRenameFolder] = useState<string | null>(null);
  const [beingDeleted, setBeingDeleted] = useState<string | null>(null);

  const handleNewFolder = async (value: string) => {
    setMutatingFolder(true);

    const res = await fetch('/api/chat/folder', {
      method: 'POST',
      body: JSON.stringify({ name: value }),
    });

    setMutatingFolder(false);

    if (!res.ok) {
      const error = await res.json();
      setError(error.error);
      return;
    }

    await mutate();

    setNewFolder(false);
    setError(null);
  };

  const handleRenameFolder = async (value: string) => {
    setMutatingFolder(true);

    const res = await fetch('/api/chat/folder', {
      method: 'PATCH',
      body: JSON.stringify({ id: renameFolder, name: value }),
    });

    setMutatingFolder(false);

    if (!res.ok) {
      const error = await res.json();
      setError(error.error);
      return;
    }

    await mutate();

    setRenameFolder(null);
    setError(null);
  };

  const handleCancelRename = () => {
    setRenameFolder(null);
    setError(null);
  };

  const handleCancelNewFolder = () => {
    setNewFolder(false);
    setError(null);
  };

  const handleDelete = async () => {
    setMutatingFolder(true);

    const res = await fetch('/api/chat/folder', {
      method: 'DELETE',
      body: JSON.stringify({ id: beingDeleted }),
    });

    setMutatingFolder(false);

    if (!res.ok) {
      const error = await res.json();
      toast.error(error.error);
      setBeingDeleted(null);

      return;
    }

    await mutate();

    setBeingDeleted(null);
  };

  return (
    <>
      <AlertDialog open={!!beingDeleted}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Folder</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to delete this folder. This action cannot be undone.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setBeingDeleted(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDelete}
              progress={mutatingFolder}
            >
              Delete Folder
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex items-center gap-2 mb-2">
        <SidebarSubtitle className="mb-0!">Your Folder</SidebarSubtitle>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="xs"
                className="ml-auto"
                onClick={() => setNewFolder(true)}
              >
                <PlusIcon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Create a new folder</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <SidebarGroup>
        {isLoading && (
          <SidebarItem>
            <SidebarItemTrigger>
              <Loader2 className="size-4 animate-spin" />
              <div className="w-28 h-4 rounded bg-white/5 animate-pulse" />
            </SidebarItemTrigger>
          </SidebarItem>
        )}

        {data?.folders.map((folder) => (
          <SidebarItem key={folder.id}>
            {renameFolder === folder.id ? (
              <SidebarItemTrigger asChild>
                <div>
                  {mutatingFolder ? (
                    <Loader2 className="size-4 animate-spin flex-shrink-0" />
                  ) : (
                    <Folder className="size-4 flex-shrink-0" />
                  )}
                  <FolderInput
                    onSubmit={handleRenameFolder}
                    onCancel={handleCancelRename}
                    disabled={mutatingFolder}
                    error={error}
                    defaultValue={folder.name}
                  />
                </div>
              </SidebarItemTrigger>
            ) : (
              <SidebarItemTrigger>
                <Folder className="size-4 flex-shrink-0" />
                {folder.name}
              </SidebarItemTrigger>
            )}
            <SidebarItemAction>
              {renameFolder === folder.id ? (
                <Button
                  variant="outline"
                  size="xs"
                  className="size-6"
                  onClick={handleCancelRename}
                >
                  <X className="size-4" />
                </Button>
              ) : (
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="xs" className="size-6">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="text-sm">
                    <DropdownMenuItem
                      onClick={(e) => {
                        setRenameFolder(folder.id);
                      }}
                    >
                      <Pencil className="size-4" />
                      Rename
                    </DropdownMenuItem>
                    {folder.id !== 'general' && (
                      <DropdownMenuItem
                        onClick={() => setBeingDeleted(folder.id)}
                      >
                        <Trash className="size-4" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </SidebarItemAction>
          </SidebarItem>
        ))}

        {newFolder && (
          <SidebarItem>
            <SidebarItemTrigger asChild>
              <div>
                {mutatingFolder ? (
                  <Loader2 className="size-4 animate-spin flex-shrink-0" />
                ) : (
                  <Folder className="size-4 flex-shrink-0" />
                )}
                <FolderInput
                  onSubmit={handleNewFolder}
                  onCancel={handleCancelNewFolder}
                  disabled={mutatingFolder}
                  error={error}
                  defaultValue="New Folder"
                />
              </div>
            </SidebarItemTrigger>
            <SidebarItemAction>
              <Button
                variant="outline"
                size="xs"
                className="size-6"
                onClick={handleCancelNewFolder}
              >
                <X className="size-4" />
              </Button>
            </SidebarItemAction>
          </SidebarItem>
        )}
      </SidebarGroup>
    </>
  );
}

function FolderInput({
  onSubmit,
  onCancel,
  disabled,
  error,
  defaultValue,
}: {
  onSubmit: (value: string) => void;
  onCancel: () => void;
  disabled?: boolean;
  error?: string | null;
  defaultValue?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(defaultValue || 'New Folder');

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleSubmit = () => {
    onSubmit(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <input
      ref={inputRef}
      value={value}
      onKeyDown={handleKeyDown}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onCancel}
      className={cn(
        'bg-transparent ring-1 outline-none w-full',
        error ? 'ring-red-500' : 'ring-primary'
      )}
      disabled={disabled}
    />
  );
}
