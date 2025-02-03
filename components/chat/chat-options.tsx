'use client';

import {
  Bookmark,
  Download,
  Info,
  MoreVertical,
  Pencil,
  Trash,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR, { useSWRConfig } from 'swr';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fetcher } from '@/lib/utils';
import { Folder } from '@/database/types';
import { Badge } from '@/components/ui/badge';

interface MoveFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chatId: string;
  onSuccess: () => void;
}

function MoveFolderDialog({
  open,
  onOpenChange,
  chatId,
  onSuccess,
}: MoveFolderDialogProps) {
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [moving, setMoving] = useState(false);
  const { mutate } = useSWRConfig();
  const { data } = useSWR<{ folders: Folder[]; currentFolder: Folder }>(
    open ? '/api/chat/folder?chatId=' + chatId : null,
    fetcher,
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const handleMoveFolder = async () => {
    if (!selectedFolder) return;

    setMoving(true);

    await fetch(`/api/chat/move-folder`, {
      method: 'PATCH',
      body: JSON.stringify({ chatId, folderId: selectedFolder }),
    });

    setMoving(false);

    await mutate('/api/chat/history');

    onSuccess();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogTitle>Move to Folder</AlertDialogTitle>
        <AlertDialogDescription>
          Move this chat from{' '}
          <Badge variant="outline" asChild>
            <span>{data?.currentFolder?.name}</span>
          </Badge>{' '}
          to:
        </AlertDialogDescription>
        <Select onValueChange={setSelectedFolder}>
          <SelectTrigger className="bg-white/5">
            <SelectValue placeholder="Select folder" />
          </SelectTrigger>
          <SelectContent>
            {data?.folders.map((folder) => (
              <SelectItem
                key={folder.id}
                value={folder.id}
                disabled={folder.id === data?.currentFolder?.id}
              >
                {folder.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleMoveFolder} progress={moving}>
            Move Chat
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface ChatOptionsProps {
  chatId: string;
}

export function ChatOptions({ chatId }: ChatOptionsProps) {
  const [beingDeleted, setBeingDeleted] = useState(false);
  const [movingFolder, setMovingFolder] = useState(false);
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const handleDelete = async () => {
    const deletePromise = fetch(`/api/chat`, {
      method: 'DELETE',
      body: JSON.stringify({ id: chatId }),
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

      <MoveFolderDialog
        open={movingFolder}
        onOpenChange={setMovingFolder}
        chatId={chatId}
        onSuccess={() => mutate('/api/chat/history')}
      />

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
            <DropdownMenuItem onClick={() => setMovingFolder(true)}>
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
    </>
  );
}
