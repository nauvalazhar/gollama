'use client';

import {
  Bookmark,
  Download,
  Info,
  MessageSquarePlus,
  MoreVertical,
  Pencil,
  Trash,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditableText } from '@/components/ui/editable-text';
import { ModelSelector } from './model-selector';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { memo, useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';
import { useSWRConfig } from 'swr';
import { toast } from 'sonner';
import Link from 'next/link';

interface ChatHeaderProps {
  onModelChange?: (value: string) => void;
  title?: string;
  id: string;
}

function Header({ onModelChange, title, id }: ChatHeaderProps) {
  const [beingDeleted, setBeingDeleted] = useState(false);
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const handleDelete = async () => {
    const deletePromise = fetch(`/api/chat`, {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });

    toast.promise(deletePromise, {
      loading: 'Deleting chat...',
      success: () => {
        mutate('/api/chat/history');

        return 'Chat deleted successfully';
      },
      error: 'Failed to delete chat',
    });

    setBeingDeleted(false);

    router.push('/');
  };

  const handleTitleChange = async (value: string) => {
    await fetch('/api/chat/rename', {
      method: 'PATCH',
      body: JSON.stringify({ id, title: value }),
    });

    mutate('/api/chat/history');
  };

  return (
    <>
      <AlertDialog open={beingDeleted} onOpenChange={setBeingDeleted}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Chat</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to delete this chat. This action cannot be undone.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Delete Chat
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <header className="flex items-center py-2 px-6 border-b border-border">
        <div className="w-4/12">
          <Button variant="outline" asChild>
            <Link href="/">
              <MessageSquarePlus className="size-4" />
              <span className="ml-2">New Chat</span>
            </Link>
          </Button>
        </div>
        <div className="w-4/12 flex items-center">
          {title && (
            <EditableText
              as="h1"
              value={title}
              onSubmit={handleTitleChange}
              className="font-semibold text-center text-lg"
            />
          )}
        </div>
        <div className="w-4/12">
          <div className="flex items-center gap-2 justify-end">
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Bookmark className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Bookmark chat</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Pencil className="mr-1 size-4" />
                  Move to folder
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Info className="mr-1 size-4" />
                  Archive chat
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="mr-1 size-4" />
                  Export chat
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => setBeingDeleted(true)}
                >
                  <Trash className="mr-1 size-4" />
                  Delete chat
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </>
  );
}

export const ChatHeader = memo(Header, (prevProps, nextProps) => {
  if (prevProps.title !== nextProps.title) return false;

  return true;
});
