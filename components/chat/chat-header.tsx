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

interface ChatHeaderProps {
  onModelChange?: (value: string) => void;
  onTitleChange?: (value: string) => void;
}

export function ChatHeader({ onModelChange, onTitleChange }: ChatHeaderProps) {
  return (
    <header className="flex items-center py-2 px-6 border-b border-border">
      <div className="w-4/12">
        <ModelSelector onChange={(value) => onModelChange?.(value)} />
      </div>
      <div className="w-4/12 flex items-center">
        <EditableText
          as="h1"
          value="What is React Server Components?"
          onSubmit={(value) => onTitleChange?.(value)}
          className="font-semibold text-center text-lg"
        />
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
              <DropdownMenuItem className="text-destructive">
                <Trash className="mr-1 size-4" />
                Delete chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
