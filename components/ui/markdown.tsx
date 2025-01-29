'use client';

import React, { memo } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

const components: Partial<Components> = {
  pre: ({ children, className, node, ...props }) => {
    return (
      <pre
        className={cn(
          'rounded-2xl bg-white/5 border',
          '*:bg-transparent! *:p-0! *:border-0',
          className
        )}
        {...props}
      >
        {children}
      </pre>
    );
  },
  code: ({ className, children, node, ...props }) => {
    return (
      <code className={cn(className)} {...props}>
        {children}
      </code>
    );
  },
  p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
};

const remarkPlugins = [remarkGfm];

interface MarkdownProps {
  content: string;
  className?: string;
}

function NonMemoizedMarkdown({ content, className }: MarkdownProps) {
  return (
    <ReactMarkdown
      className={cn(
        'prose dark:prose-invert prose-p:leading-relaxed max-w-none',
        className
      )}
      remarkPlugins={remarkPlugins}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
}

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) =>
    prevProps.content === nextProps.content &&
    prevProps.className === nextProps.className
);
