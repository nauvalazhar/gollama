'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
import { cn } from '@/lib/utils';
import 'highlight.js/styles/github-dark.css';

interface MarkdownProps {
  content: string;
  className?: string;
}

export function Markdown({ content, className }: MarkdownProps) {
  return (
    <ReactMarkdown
      className={cn(
        'prose dark:prose-invert prose-p:leading-relaxed max-w-none',
        className
      )}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[
        rehypeRaw,
        rehypeSanitize,
        [
          rehypeHighlight,
          {
            ignoreMissing: true,
            subset: false,
          },
        ],
      ]}
      components={{
        pre({ node, className, children, ...props }) {
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
        code({ node, className, children, ...props }) {
          return (
            <code
              className={cn('rounded bg-white/5 border', className)}
              {...props}
            >
              {children}
            </code>
          );
        },
        p({ children }) {
          return <p className="mb-4 last:mb-0">{children}</p>;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
