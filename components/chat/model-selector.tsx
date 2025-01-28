'use client';

import { Button } from '@/components/ui/button';
import { BotMessageSquare, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';

interface ModelSelectorProps {
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export function ModelSelector({
  defaultValue = 'gpt-4',
  onChange,
}: ModelSelectorProps) {
  const [value, setValue] = useState(defaultValue);

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    onChange?.(newValue);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <BotMessageSquare className="size-5!" />
          <span className="text-lg">{value}</span>
          <ChevronDown size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>AI Models</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={value} onValueChange={handleValueChange}>
          <DropdownMenuRadioItem value="gpt-4">GPT-4</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="gpt-3.5-turbo">
            GPT-3.5 Turbo
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="claude-2">
            Claude 2
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="palm-2">PaLM 2</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
