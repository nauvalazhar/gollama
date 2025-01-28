'use client';

import * as React from 'react';
import { Command } from 'cmdk';
import {
  Calculator,
  Calendar,
  CreditCard,
  MessageCircle,
  Plus,
  Settings,
  Smile,
  User,
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function CommandMenu({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 w-full max-w-[640px] -translate-x-1/2 -translate-y-1/2 z-50 rounded-2xl backdrop-blur-md',
            'bg-after after:bg-command/85 after:backdrop-blur-2xl after:rounded-2xl after:border-0!',
            'decoration-before before:opacity-15 before:translate-y-0 before:size-full',
            'p-2 ring-1 ring-white/15 shadow-2xl shadow-black/40',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-2 data-[state=open]:duration-300',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-bottom-2 data-[state=closed]:duration-200'
          )}
          aria-describedby={undefined}
        >
          {/* suppress the error */}
          <Dialog.Title hidden />
          <Command>
            <div className="relative flex items-center">
              <Command.Input
                placeholder="Type a command or search chat..."
                className="w-full bg-transparent px-4 py-3 text-base outline-none border-b"
                aria-label="Search commands"
              />
              <button
                className={cn(
                  'absolute right-4 text-xs uppercase tracking-wider font-semibold',
                  'bg-white/5 rounded-lg px-2 py-1 border cursor-pointer hover:bg-white/10',
                  'transition-colors duration-200'
                )}
                onClick={() => onOpenChange(false)}
              >
                Esc
              </button>
            </div>
            <Command.List
              className="mt-2 max-h-[400px] overflow-y-auto px-2"
              role="listbox"
            >
              <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                No results found.
              </Command.Empty>

              <CommandGroup>
                <CommandItem>
                  <Plus className="mr-2 h-4 w-4" />
                  <span>New Chat</span>
                </CommandItem>
              </CommandGroup>

              <CommandSeparator />

              <CommandGroup heading="Recent Chats">
                <CommandItem>
                  <MessageCircle />
                  <span>What is the weather in Tokyo?</span>
                </CommandItem>
                <CommandItem>
                  <MessageCircle />
                  <span>What is React Server Components?</span>
                </CommandItem>
                <CommandItem>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  <span>How to build a REST API?</span>
                </CommandItem>
                <CommandItem>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  <span>Explain quantum computing</span>
                </CommandItem>
                <CommandItem>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  <span>Write a Python sorting algorithm</span>
                </CommandItem>
              </CommandGroup>

              <CommandSeparator />

              <CommandGroup heading="Settings">
                <CommandItem>
                  <User />
                  <span>Profile</span>
                </CommandItem>
                <CommandItem>
                  <CreditCard />
                  <span>Billing</span>
                </CommandItem>
                <CommandItem>
                  <Settings />
                  <span>Settings</span>
                </CommandItem>
              </CommandGroup>
            </Command.List>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function CommandGroup({
  children,
  ...props
}: React.ComponentProps<typeof Command.Group>) {
  return (
    <Command.Group
      className="px-2 py-2 [&_[cmdk-group-items]]:-mx-4"
      {...props}
    >
      {children}
    </Command.Group>
  );
}

function CommandItem({
  children,
  ...props
}: React.ComponentProps<typeof Command.Item>) {
  return (
    <Command.Item
      className={cn(
        'flex items-center px-4 py-2 rounded-lg cursor-pointer border border-transparent',
        'data-[selected=true]:bg-white/5 data-[selected=true]:text-white',
        'data-[selected=true]:border-border',
        '[&_svg]:mr-4 [&_svg]:size-4'
      )}
      {...props}
    >
      {children}
    </Command.Item>
  );
}

function CommandSeparator() {
  return <Command.Separator className="my-2 h-[1px] bg-border" />;
}
