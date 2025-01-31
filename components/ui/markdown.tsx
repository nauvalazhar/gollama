'use client';

import React, { memo } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
// import hljs from 'highlight.js';
// import 'highlight.js/styles/github-dark.css';
import rehypeShiki from '@shikijs/rehype';

const components: Partial<Components> = {
  pre: ({ children, className, node, ...props }) => {
    return (
      <pre
        className={cn(
          'rounded-2xl bg-white/5 border',
          '*:bg-transparent! *:p-0! *:border-0',
          '[&_code]:bg-transparent!',
          '*:overflow-visible!',
          className
        )}
        {...props}
      >
        {children}
      </pre>
    );
  },
  code: ({ className, children, node }) => {
    const language = className?.split('-')[1];

    return <code className={className}>{children}</code>;

    // if (!language) return <code className={className}>{children}</code>;

    // this option is still slow but it's better than using react-syntax-highlighter
    // consider using tool
    // const highlightedCode = hljs.highlight(
    //   String(children).replace(/\n$/, ''),
    //   {
    //     language,
    //   }
    // ).value;

    // return (
    //   <code
    //     className={cn('hljs', className)}
    //     dangerouslySetInnerHTML={{ __html: highlightedCode }}
    //   />
    // );
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
