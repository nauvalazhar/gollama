'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Kbd } from '@/components/ui/kbd';
import { Slot } from '@radix-ui/react-slot';

interface EditableTextProps {
  staticElement: (value: string) => React.ReactNode;
  defaultValue: string;
  onSubmit: (value: string) => void;
  className?: string;
  classNameInput?: string;
}

export function EditableText({
  staticElement,
  defaultValue,
  onSubmit,
  className,
  classNameInput,
}: EditableTextProps) {
  const [value, setValue] = useState(defaultValue);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (value.trim().length === 0) {
        return;
      } else if (value === defaultValue) {
        setIsEditing(false);
        return;
      }

      setIsEditing(false);
      onSubmit(value);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setValue(defaultValue);
      setIsEditing(false);
    }
  };

  return (
    <div className={cn('relative group', className)}>
      {isEditing ? (
        <input
          autoFocus
          contentEditable
          className={cn(
            'px-4 rounded-md focus:outline-none ring-2 ring-transparent focus:ring-primary',
            'hover:ring-white/10 transition-all',
            'min-w-48',
            classNameInput
          )}
          style={{ width: `${value.length + 2}ch` }}
          suppressContentEditableWarning
          value={value}
          onBlur={() => setIsEditing(false)}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
        />
      ) : (
        <Slot onClick={() => setIsEditing(true)}>{staticElement(value)}</Slot>
      )}
      <HelpText className="translate-y-2 group-focus-within:opacity-100 group-focus-within:translate-y-0">
        Press <Kbd>Enter</Kbd> to submit
      </HelpText>
      <HelpText className="translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-0!">
        Click to rename
      </HelpText>
    </div>
  );
}

function HelpText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'bg-popover backdrop-blur-sm px-2 py-1 rounded-md',
        'text-xs absolute z-10 -bottom-8 left-1/2 -translate-x-1/2',
        'opacity-0 transition-all select-none pointer-events-none',
        'whitespace-nowrap',
        className
      )}
    >
      {children}
    </div>
  );
}
