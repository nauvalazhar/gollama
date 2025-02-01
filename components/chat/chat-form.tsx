'use client';

import { Editor } from '@/components/editor/editor';
import { cn } from '@/lib/utils';
import { ChatRequestOptions } from 'ai';
import { FormEvent, useRef, memo } from 'react';

function Form({
  handleSubmit,
  input,
  setInput,
  onHeightChange,
  onEditorCreated,
}: {
  handleSubmit: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions
  ) => void;
  input: string;
  setInput: (input: string) => void;
  onHeightChange: (height: number) => void;
  onEditorCreated: () => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (markdown: string) => {
    setInput(markdown);
  };

  const handleSubmitForm = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setTimeout(() => {
      handleSubmit(undefined);
      setInput('');
    }, 100);
  };

  const handleEnter = (e: KeyboardEvent, clear: () => void) => {
    const form = formRef.current;

    form?.requestSubmit();
    clear();
  };

  return (
    <div
      className={cn('absolute left-0 bottom-4 w-full', 'flex justify-center')}
    >
      <form ref={formRef} onSubmit={handleSubmitForm} className="w-3xl">
        <Editor
          onCreated={onEditorCreated}
          onChange={handleChange}
          onHeightChange={onHeightChange}
          onEnter={handleEnter}
          placeholder="Ask AI anything..."
        />
      </form>
    </div>
  );
}

export const ChatForm = memo(Form, (prevProps, nextProps) => {
  if (prevProps.input !== nextProps.input) return false;

  return true;
});
