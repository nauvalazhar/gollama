'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CommandMenu } from './command-menu';
import { useHotkeys } from 'react-hotkeys-hook';

export function SearchButton() {
  const [open, setOpen] = React.useState(false);

  useHotkeys('ctrl+k', (e) => {
    e.preventDefault();
    setOpen(!open);
  });

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setOpen(true)}
        className="relative"
      >
        <Search className="h-4 w-4" />
      </Button>
      <CommandMenu open={open} onOpenChange={setOpen} />
    </>
  );
}
