'use client';

import { Editor } from '@/components/editor/editor';
import { cn } from '@/lib/utils';
import { ChatRequestOptions } from 'ai';
import { FormEvent, useState, useRef, memo } from 'react';

function Form({
  handleSubmit,
  input,
  setInput,
}: React.HTMLAttributes<HTMLFormElement> & {
  handleSubmit: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions
  ) => void;
  input: string;
  setInput: (input: string) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [editorHeight, setEditorHeight] = useState(0);

  const handleHeightChange = (height: number) => {
    setEditorHeight(height);
  };

  const handleChange = (markdown: string) => {
    setInput(markdown);
  };

  const handleSubmitForm = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    handleSubmit(undefined);
    setInput('');
  };

  const handleEnter = (e: KeyboardEvent, clear: () => void) => {
    const form = formRef.current;
    form?.requestSubmit();
    clear();
  };

  return (
    <>
      <div style={{ height: editorHeight + 20 }} className="flex-shrink-0" />
      <div
        className={cn('absolute left-0 bottom-4 w-full', 'flex justify-center')}
      >
        <form ref={formRef} onSubmit={handleSubmitForm} className="w-4xl">
          <Editor
            onChange={handleChange}
            onHeightChange={handleHeightChange}
            onEnter={handleEnter}
            placeholder="Ask AI anything..."
          />
        </form>
      </div>
    </>
  );
}

export const ChatForm = memo(Form, (prevProps, nextProps) => {
  if (prevProps.input !== nextProps.input) return false;

  return true;
});
