'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Kbd } from '@/components/ui/kbd';

interface EditableTextProps {
  value: string;
  onSubmit: (value: string) => void;
  className?: string;
  as?: React.ElementType;
}

export function EditableText({
  value: initialValue,
  onSubmit,
  className,
  as: Tag = 'span',
}: EditableTextProps) {
  const [value, setValue] = useState(initialValue);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleBlur = () => {
    const newValue = elementRef.current?.textContent || '';
    if (newValue !== initialValue) {
      setValue(newValue);
      onSubmit(newValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      elementRef.current?.blur();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      if (elementRef.current) {
        elementRef.current.textContent = initialValue;
        elementRef.current.blur();
      }
    }
  };

  return (
    <div className="relative mx-auto group">
      <Tag
        ref={elementRef}
        contentEditable
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          'inline-block w-full px-4 rounded-md focus:outline-none ring-2 ring-transparent focus:ring-primary',
          'whitespace-nowrap hover:ring-white/10 transition-all',
          'cursor-pointer focus:cursor-text',
          className
        )}
        suppressContentEditableWarning
      >
        {value}
      </Tag>
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
    <p
      className={cn(
        'text-xs text-muted-foreground absolute -bottom-6 right-0',
        'opacity-0 transition-all select-none pointer-events-none',
        className
      )}
    >
      {children}
    </p>
  );
}
