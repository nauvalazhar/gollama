'use client';

import { Editor } from '@/components/editor/editor';
import { FormEvent, useState, useRef } from 'react';

export function ChatForm({
  onHeightChange,
  ...props
}: React.HTMLAttributes<HTMLFormElement> & {
  onHeightChange: (height: number) => void;
}) {
  const [content, setContent] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const handleChange = (markdown: string) => {
    setContent(markdown);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    console.log('Submitted:', content);
    // Handle the submission here (e.g., send to API)
    setContent('');
  };

  const handleEnter = (e: KeyboardEvent) => {
    const form = formRef.current;
    form?.requestSubmit();
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} {...props}>
      <Editor
        onChange={handleChange}
        onHeightChange={onHeightChange}
        onEnter={handleEnter}
        placeholder="Ask AI anything..."
        initialContent={content}
      />
    </form>
  );
}
